// 立即执行
(function() {
    // 建站时间 - 请修改这里
    var startSite = new Date("08/09/2022 00:00:00"); 
    // 旅行者1号发射时间
    var startVoyager = new Date("01/01/2025 00:00:00"); 

    function createtime() {
        var now = new Date();
        now.setTime(now.getTime() + 1000);

        // 1. 计算运行时间
        var days = (now - startSite) / 1e3 / 60 / 60 / 24;
        var dnum = Math.floor(days);
        var hours = (now - startSite) / 1e3 / 60 / 60 - 24 * dnum;
        var hnum = Math.floor(hours);
        if (String(hnum).length == 1) hnum = "0" + hnum;
        var minutes = (now - startSite) / 1e3 / 60 - 1440 * dnum - 60 * hnum;
        var mnum = Math.floor(minutes);
        if (String(mnum).length == 1) mnum = "0" + mnum;
        var seconds = (now - startSite) / 1e3 - 86400 * dnum - 3600 * hnum - 60 * mnum;
        var snum = Math.round(seconds);
        if (String(snum).length == 1) snum = "0" + snum;

        // 2. 计算距离
        var dis = Math.trunc(23400000000 + ((now - startVoyager) / 1000) * 17);
        var unit = (dis / 149600000).toFixed(6);

        // 3. 状态逻辑
        var hour = now.getHours();
        var isWorking = hour >= 9 && hour < 18;
        var statusText = isWorking ? "搬砖中" : "休闲中";
        var statusIcon = isWorking ? "🔨" : "☕"; 

        // 4. 生成 HTML
        let content = `
            <div class="footer-group">
                <div class="status-bar">
                    <div class="status-left">☕ 墨不凡</div> <!-- 这里可以改成 statusIcon -->
                    <div class="status-right">${statusText}</div>
                </div>
                <div class="footer-line">
                    本站居然运行了 <span class="time-bold">${dnum}</span> 天 
                    <span class="time-bold">${hnum}</span> 小时 
                    <span class="time-bold">${mnum}</span> 分 
                    <span class="time-bold">${snum}</span> 秒 
                    <i class="fas fa-heartbeat footer-heart"></i>
                </div>
                <div class="footer-line" style="font-size: 12px; opacity: 0.8;">
                    旅行者 1 号当前距离地球 <span class="time-bold">${dis}</span> 千米，
                    约为 <span class="time-bold">${unit}</span> 个天文单位 🚀
                </div>
            </div>
        `;

        // 5. 暴力替换页脚内容
        var footerWrap = document.getElementById("footer-wrap");
        
        // 只有当页脚存在，且内容不是我们要的内容时，才进行替换或更新
        if (footerWrap) {
            // 如果页脚里还没有我们的自定义容器，说明是第一次运行或者页面刚刷新
            // 直接清空原有内容（去掉 John Doe），放入我们的内容
            if (!document.querySelector('.footer-group')) {
                footerWrap.innerHTML = content; 
            } else {
                // 如果已经有容器了，只更新数字，防止闪烁（可选，简单起见直接innerHTML也行）
                footerWrap.innerHTML = content;
            }
        }
    }

    // 启动
    setInterval(createtime, 1000);
})();