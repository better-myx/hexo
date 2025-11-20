// 定义 saveToLocal 对象
const saveToLocal = {
    set: function (key, value, expiration) {
        const data = { value: value, expiration: expiration };
        localStorage.setItem(key, JSON.stringify(data));
    },
    get: function (key) {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                if (parsedData.expiration && Date.now() > parsedData.expiration) {
                    localStorage.removeItem(key);
                    return null;
                }
                return parsedData.value;
            } catch (error) {
                console.error('解析 JSON 数据时出错:', error);
                return null;
            }
        }
        return null;
    }
};

function switchNightMode() {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>');
    setTimeout(function () {
        if (document.querySelector('body').classList.contains('DarkMode')) {
            document.querySelector('body').classList.remove('DarkMode');
            localStorage.setItem('isDark', '0');
            document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon');
        } else {
            document.querySelector('body').classList.add('DarkMode');
            localStorage.setItem('isDark', '1');
            document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun');
        }
        setTimeout(function () {
            document.getElementsByClassName('Cuteen_DarkSky')[0].style.transition = 'opacity 3s';
            document.getElementsByClassName('Cuteen_DarkSky')[0].style.opacity = '0';
            setTimeout(function () {
                document.getElementsByClassName('Cuteen_DarkSky')[0].remove();
            }, 1000);
        }, 2000);
    });
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    if (nowMode === 'light') {
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("moon").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "0";
            document.getElementById("moon").style.opacity = "1";
        }, 1000);

        activateDarkMode();
        saveToLocal.set('theme', 'dark', 2);
        document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun');
    } else {
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("moon").style.opacity = "1";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "1";
            document.getElementById("moon").style.opacity = "0";
        }, 1000);

        activateLightMode();
        saveToLocal.set('theme', 'light', 2);
        document.querySelector('body').classList.add('DarkMode');
        document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon');
    }
    // 兼容处理
    typeof utterancesTheme === 'function' && utterancesTheme();
    typeof FB === 'object' && window.loadFBComment();
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200);
}

function activateLightMode() {
    document.documentElement.setAttribute('data-theme', 'light');
}

function activateDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
}