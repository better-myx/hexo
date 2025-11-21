document.addEventListener('DOMContentLoaded', function () {
    // ================= 配置项 =================
    const CONFIG = {
        defaultTrans: 58,
        defaultColor: '#42c6b6',
        bgLight: '/hexo/img/light.png',
        bgDark: '/hexo/img/dark.webp',
        colors: [
            { name: 'Default', value: '#42c6b6' },
            { name: 'BlueCustom', value: '#5ea6e5' },
            { name: 'Red', value: 'rgb(241, 71, 71)' },
            { name: 'Orange', value: 'rgb(241, 162, 71)' },
            { name: 'Yellow', value: 'rgb(241, 238, 71)' },
            { name: 'Purple', value: 'rgb(179, 71, 241)' },
            { name: 'HeoBlue', value: 'rgb(66, 90, 239)' },
            { name: 'Green', value: 'rgb(57, 197, 187)' },
            { name: 'Pink', value: 'rgb(237, 112, 155)' },
            { name: 'DarkBlue', value: 'rgb(97, 100, 159)' }
        ]
    };

    let settings = JSON.parse(localStorage.getItem('themeSettings')) || {
        transparency: CONFIG.defaultTrans,
        themeColor: CONFIG.defaultColor
    };

    // ================= 1. 滚动百分比控制 =================
    function scrollPercentLogic() {
        const goUpBtn = document.getElementById('go-up');
        if (!goUpBtn) return;

        let percentSpan = goUpBtn.querySelector('.scroll-percent');
        if (!percentSpan) {
            percentSpan = document.createElement('span');
            percentSpan.className = 'scroll-percent';
            goUpBtn.appendChild(percentSpan);
        }
        
        window.addEventListener('scroll', () => {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            
            let percent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
            if (isNaN(percent)) percent = 0;
            
            if (percent < 95 && percent > 0) {
                goUpBtn.classList.add('show-percent');
                percentSpan.innerText = percent + '%'; // 百分号
            } else {
                goUpBtn.classList.remove('show-percent');
            }
        });
    }

    // ================= 2. 核心逻辑 =================
    window.toggleWinbox = function() {
        const panel = document.getElementById('settings-panel');
        const overlay = document.getElementById('settings-overlay');
        if (!panel) {
            initPanel();
            setTimeout(() => window.toggleWinbox(), 10);
            return;
        }
        panel.classList.toggle('show');
        overlay.classList.toggle('show');
    };

    function initPanel() {
        let colorHtml = '';
        CONFIG.colors.forEach(c => {
            colorHtml += `<div class="color-btn" style="background-color:${c.value}" data-color="${c.value}" title="${c.name}"></div>`;
        });

        const html = `
        <div id="settings-overlay" onclick="toggleWinbox()"></div>
        <div id="settings-panel">
            <div class="panel-header">
                <span><i class="fas fa-swatchbook"></i> 美化设置</span>
                <i class="fas fa-times close-btn" onclick="toggleWinbox()"></i>
            </div>
            <div class="panel-body">
                <div class="setting-item">
                    <div class="title-group">
                        <div class="title"><i class="fas fa-eye"></i> 透明度</div>
                        <div class="value" id="text-trans">${settings.transparency}%</div>
                    </div>
                    <div class="desc">0%为纯色，100%为磨砂玻璃</div>
                    <input type="range" id="input-trans" min="0" max="100" value="${settings.transparency}">
                </div>
                <div class="setting-item">
                    <div class="title-group">
                        <div class="title"><i class="fas fa-palette"></i> 主题颜色</div>
                    </div>
                    <div class="color-list" id="color-list">
                        ${colorHtml}
                    </div>
                </div>
                <button id="btn-reset">恢复默认设置</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        
        document.getElementById('input-trans').addEventListener('input', (e) => updateTransparency(e.target.value));
        document.getElementById('btn-reset').addEventListener('click', resetSettings);
        
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                updateThemeColor(this.getAttribute('data-color'));
                colorBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
        const activeBtn = document.querySelector(`.color-btn[data-color="${settings.themeColor}"]`);
        if(activeBtn) activeBtn.classList.add('active');
    }

    function updateTransparency(val) {
        val = parseInt(val);
        settings.transparency = val;
        const textVal = document.getElementById('text-trans');
        if(textVal) textVal.innerText = val + '%';
        
        // 算法修正：0%->1(不透明), 100%->0(全透明)
        // 之前可能有 0.9 的系数，现在直接 1 - x
        const alpha = 1 - (val / 100); 
        
        const blur = (val / 100) * 10; 
        const root = document.documentElement;
        root.style.setProperty('--card-opacity', alpha);
        root.style.setProperty('--card-blur', blur + 'px');
        saveSettings();
    }

    function updateThemeColor(color) {
        settings.themeColor = color;
        document.documentElement.style.setProperty('--theme-color', color);
        const header = document.querySelector('.panel-header');
        const resetBtn = document.getElementById('btn-reset');
        if(header) header.style.background = color;
        if(resetBtn) resetBtn.style.background = color;
        saveSettings();
    }

    function updateBackground() {
        const theme = document.documentElement.getAttribute('data-theme');
        const bgUrl = theme === 'dark' ? CONFIG.bgDark : CONFIG.bgLight;
        document.documentElement.style.setProperty('--global-bg', `url('${bgUrl}')`);
    }

    function saveSettings() {
        localStorage.setItem('themeSettings', JSON.stringify(settings));
    }

    function resetSettings() {
        updateTransparency(CONFIG.defaultTrans);
        updateThemeColor(CONFIG.defaultColor);
        const input = document.getElementById('input-trans');
        if(input) input.value = CONFIG.defaultTrans;
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(b => b.classList.remove('active'));
    }

    // ================= 初始化 =================
    updateTransparency(settings.transparency);
    updateThemeColor(settings.themeColor);
    updateBackground();
    scrollPercentLogic();
    
    const observer = new MutationObserver(updateBackground);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
