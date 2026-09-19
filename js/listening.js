(function () {
    'use strict';

    var page;
    var frame;
    var previousBodyOverflow = '';

    function closeInviteModal() {
        var modal = document.getElementById('invite-modal');
        if (!modal) return;
        if (typeof hideModal === 'function') hideModal(modal);
        else modal.style.display = 'none';
    }

    function openInviteModal() {
        var modal = document.getElementById('invite-modal');
        if (!modal) return;
        if (typeof showModal === 'function') showModal(modal);
        else modal.style.display = 'flex';
    }

    function readMainAvatar(selector) {
        var img = document.querySelector(selector);
        return img && img.src ? img.src : '';
    }

    function syncMainAvatars() {
        if (!frame || !frame.contentDocument) return;
        try {
            var doc = frame.contentDocument;
            var mine = doc.getElementById('avatarImgA');
            var partner = doc.getElementById('avatarImgB');
            var mineSrc = readMainAvatar('#my-avatar img');
            var partnerSrc = readMainAvatar('#partner-avatar img');

            if (mine && !mine.getAttribute('src') && mineSrc) mine.src = mineSrc;
            if (partner && !partner.getAttribute('src') && partnerSrc) partner.src = partnerSrc;
        } catch (error) {
            console.warn('[listening] 头像同步失败', error);
        }
    }

    function syncMainTheme() {
        if (!frame || !frame.contentDocument) return;
        try {
            var source = window.getComputedStyle(document.documentElement);
            var target = frame.contentDocument.documentElement.style;
            var variables = {
                '--primary-bg': '--site-primary-bg',
                '--secondary-bg': '--site-secondary-bg',
                '--text-primary': '--site-text-primary',
                '--text-secondary': '--site-text-secondary',
                '--border-color': '--site-border-color',
                '--accent-color': '--site-accent-color',
                '--accent-color-rgb': '--site-accent-rgb'
            };

            Object.keys(variables).forEach(function (sourceName) {
                var value = source.getPropertyValue(sourceName).trim();
                if (value) target.setProperty(variables[sourceName], value);
            });
        } catch (error) {
            console.warn('[listening] 主题同步失败', error);
        }
    }

    function syncPlayerContext() {
        syncMainAvatars();
        syncMainTheme();
    }

    function pausePlayer() {
        if (!frame || !frame.contentDocument) return;
        try {
            var audio = frame.contentDocument.getElementById('audio');
            if (audio && !audio.paused) audio.pause();
        } catch (error) {
            console.warn('[listening] 暂停播放器失败', error);
        }
    }

    function beginSharedPlayback() {
        if (!frame || !frame.contentWindow) return;
        try {
            var bridge = frame.contentWindow.ListeningPlayerBridge;
            if (bridge && typeof bridge.begin === 'function') bridge.begin();
        } catch (error) {
            console.warn('[listening] 歌单接入失败', error);
        }
    }

    function returnPlaybackToFloatingPlayer() {
        if (!frame || !frame.contentWindow) return false;
        try {
            var bridge = frame.contentWindow.ListeningPlayerBridge;
            return !!(bridge && typeof bridge.end === 'function' && bridge.end());
        } catch (error) {
            console.warn('[listening] 播放状态交还失败', error);
            return false;
        }
    }

    function openListening() {
        if (!page) return;
        closeInviteModal();
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        page.classList.add('active');
        page.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function () {
            syncPlayerContext();
            beginSharedPlayback();
        });
    }

    function closeListening(options) {
        if (!page || !page.classList.contains('active')) return;
        if (!returnPlaybackToFloatingPlayer()) pausePlayer();
        page.classList.remove('active');
        page.classList.remove('music-center-open');
        page.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousBodyOverflow;
        if (!options || options.reopenInvite !== false) {
            setTimeout(openInviteModal, 80);
        }
    }

    function init() {
        page = document.getElementById('listening-page');
        frame = document.getElementById('listening-player-frame');
        var trigger = document.getElementById('listen-function');
        var back = document.getElementById('listening-back-btn');
        if (!page || !frame || !trigger || !back) return;

        trigger.addEventListener('click', openListening);
        back.addEventListener('click', function () { closeListening({ reopenInvite: true }); });
        frame.addEventListener('load', function () {
            syncPlayerContext();
            // 慢速设备上 iframe 可能晚于入口页加载；如果此时已经进入听歌页，
            // 仍要立即接管悬浮播放器的歌单和播放进度。
            if (page.classList.contains('active')) beginSharedPlayback();
        });
        window.addEventListener('message', function (event) {
            if (!frame || event.source !== frame.contentWindow || !event.data) return;
            if (event.data.type === 'listening-music-center') {
                page.classList.toggle('music-center-open', Boolean(event.data.open));
            }
            if (event.data.type === 'listening-close-request') {
                closeListening({ reopenInvite: true });
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && page.classList.contains('active')) {
                event.preventDefault();
                event.stopImmediatePropagation();
                closeListening({ reopenInvite: true });
            }
        }, true);

        window.ListeningFeature = {
            open: openListening,
            close: closeListening
        };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
