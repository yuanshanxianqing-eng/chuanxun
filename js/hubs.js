(function () {
    'use strict';

    function openModalById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        if (typeof showModal === 'function') showModal(modal);
        else modal.style.display = 'flex';
    }

    function closeModalById(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        if (typeof hideModal === 'function') hideModal(modal);
        else modal.style.display = 'none';
    }

    function notifyPending(name) {
        const text = `${name}已经放进新布局，功能会在后续补充`;
        if (typeof showNotification === 'function') showNotification(text, 'info', 2600);
        else alert(text);
    }

    function initHubs() {
        const inviteBtn = document.getElementById('invite-btn');
        const closeInviteBtn = document.getElementById('close-invite');
        const inviteModal = document.getElementById('invite-modal');
        const companionBtn = document.getElementById('companion-settings');
        const closeCompanionBtn = document.getElementById('close-companion');
        const backCompanionBtn = document.getElementById('back-companion');
        const companionModal = document.getElementById('companion-modal');
        const settingsModal = document.getElementById('settings-modal');
        const homeBtn = document.getElementById('home-btn');
        const closeHomeBtn = document.getElementById('close-home');
        const homePage = document.getElementById('home-page');
        const distanceBtn = document.getElementById('distance-btn');

        inviteBtn?.addEventListener('click', () => openModalById('invite-modal'));
        closeInviteBtn?.addEventListener('click', () => closeModalById('invite-modal'));
        inviteModal?.addEventListener('click', event => {
            if (event.target === inviteModal) closeModalById('invite-modal');
        });

        companionBtn?.addEventListener('click', () => {
            closeModalById('settings-modal');
            openModalById('companion-modal');
        });
        closeCompanionBtn?.addEventListener('click', () => closeModalById('companion-modal'));
        backCompanionBtn?.addEventListener('click', () => {
            closeModalById('companion-modal');
            openModalById('settings-modal');
        });
        companionModal?.addEventListener('click', event => {
            if (event.target === companionModal) closeModalById('companion-modal');
        });

        function closeHome() {
            if (!homePage) return;
            homePage.classList.remove('active');
            homePage.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        homeBtn?.addEventListener('click', () => {
            if (!homePage) return;
            homePage.classList.add('active');
            homePage.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        closeHomeBtn?.addEventListener('click', closeHome);

        distanceBtn?.addEventListener('click', () => notifyPending('距离'));

        document.querySelectorAll('.hub-placeholder').forEach(card => {
            card.addEventListener('click', () => notifyPending(card.dataset.comingSoon || '这个功能'));
        });

        document.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            if (homePage?.classList.contains('active')) closeHome();
            else if (inviteModal?.style.display === 'flex') closeModalById('invite-modal');
            else if (companionModal?.style.display === 'flex') closeModalById('companion-modal');
        });

        void settingsModal;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHubs);
    } else {
        initHubs();
    }
})();
