(function () {
    'use strict';

    const BASE_STATES = [
        { id: 'work', name: '工作', label: '工作中', icon: 'fa-laptop' },
        { id: 'study', name: '学习', label: '学习中', icon: 'fa-book-open' },
        { id: 'exercise', name: '运动', label: '运动中', icon: 'fa-person-running' },
        { id: 'sleep', name: '睡觉', label: '准备睡觉', icon: 'fa-moon' }
    ];
    const DURATION_OPTIONS = [
        { minutes: 5, label: '5 分钟' }, { minutes: 15, label: '15 分钟' },
        { minutes: 30, label: '半小时' }, { minutes: 60, label: '1 小时' },
        { minutes: 120, label: '2 小时' }, { minutes: 0, label: '自定义' }
    ];
    // 概率固定在代码中，不在页面提供修改入口。
    const ACCEPT_CHANCE = 70;
    const RANDOM_INVITE_CHANCE = 7;
    const DEFAULT_CONFIG = {
        customStates: [], images: { me: {}, partner: {} }, lastMyState: 'work',
        background: { mode: 'gradient', colorA: '#e9e3dc', colorB: '#d6ddd4', image: '', imageOpacity: 0.28 },
        music: { rainUrl: '', fireUrl: '', customTracks: [] }
    };

    let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    let storageKey = '';
    let initialized = false;
    let selectedState = 'work';
    let selectedMinutes = 15;
    let durationPurpose = 'invite';
    let incomingMessageId = null;
    let outgoingPending = false;
    let mapPerson = 'me';
    let session = null;
    let countdownTimer = null;
    let rarePartnerTimer = null;
    let saveTimer = null;
    let currentMusic = '';

    const byId = id => document.getElementById(id);
    const all = selector => [...document.querySelectorAll(selector)];
    const bridge = () => window.CompanionBridge;
    const states = () => [...BASE_STATES, ...(config.customStates || [])];
    const stateInfo = id => states().find(item => item.id === id) || BASE_STATES[0];
    const clone = value => JSON.parse(JSON.stringify(value));
    const randomItem = list => list[Math.floor(Math.random() * list.length)];
    const durationLabel = minutes => ({ 30: '半小时', 60: '1 小时', 120: '2 小时' }[minutes] || `${minutes} 分钟`);
    const nowLabel = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });

    function mergeConfig(saved) {
        const next = clone(DEFAULT_CONFIG);
        if (!saved || typeof saved !== 'object') return next;
        Object.assign(next, saved);
        delete next.acceptChance;
        delete next.randomInviteChance;
        next.background = Object.assign({}, DEFAULT_CONFIG.background, saved.background || {});
        next.music = Object.assign({}, DEFAULT_CONFIG.music, saved.music || {});
        next.music.customTracks = Array.isArray(saved.music?.customTracks)
            ? saved.music.customTracks.filter(item => item && item.url).map(item => ({
                id: item.id || `track_${Date.now()}_${Math.random()}`,
                name: item.name || '自定义歌曲',
                url: item.url
            }))
            : [];
        // 兼容上一版只保存一首自定义歌曲的数据。
        if (!next.music.customTracks.length && saved.music?.customUrl) {
            next.music.customTracks.push({
                id: `track_migrated_${Date.now()}`,
                name: saved.music.customName || '自定义歌曲',
                url: saved.music.customUrl
            });
        }
        next.images = Object.assign({ me: {}, partner: {} }, saved.images || {});
        next.images.me = Object.assign({}, saved.images?.me || {});
        next.images.partner = Object.assign({}, saved.images?.partner || {});
        next.customStates = Array.isArray(saved.customStates) ? saved.customStates : [];
        return next;
    }

    async function readStored() {
        try {
            if (window.localforage) return await localforage.getItem(storageKey);
            return JSON.parse(localStorage.getItem(storageKey) || 'null');
        } catch (error) {
            console.warn('[companion] load failed', error);
            return null;
        }
    }

    function saveConfig() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(async () => {
            try {
                if (window.localforage) await localforage.setItem(storageKey, config);
                else localStorage.setItem(storageKey, JSON.stringify(config));
            } catch (error) {
                console.warn('[companion] save failed', error);
                notify('陪伴设置保存失败，请检查浏览器存储空间', 'error');
            }
        }, 180);
    }

    function notify(text, type) {
        if (bridge()?.notify) bridge().notify(text, type || 'info', 2600);
    }

    function randomState(except) {
        const pool = states().filter(item => item.id !== except);
        return (randomItem(pool.length ? pool : states()) || BASE_STATES[0]).id;
    }

    function getNames() {
        return bridge()?.getNames?.() || { me: '我', partner: '梦角' };
    }

    function getAvatar(person) {
        return bridge()?.getAvatar?.(person) || '';
    }

    function randomReplyDelay(extraMinimum) {
        const delay = bridge()?.getReplyDelay?.() || { min: 3000, max: 7000 };
        const min = Math.max(extraMinimum || 0, Math.min(12000, Number(delay.min) || 3000));
        const max = Math.max(min, Math.min(15000, Number(delay.max) || 7000));
        return Math.round(min + Math.random() * (max - min));
    }

    function injectUI() {
        if (byId('companion-root')) return;
        const root = document.createElement('div');
        root.id = 'companion-root';
        root.innerHTML = `
            <section class="cp-screen cp-transition" id="cp-transition-screen">
                <div><div class="cp-transition-avatar" id="cp-transition-avatar"><i class="fas fa-user"></i></div>
                <h2 id="cp-transition-title">对方已接受邀约</h2><p id="cp-transition-copy">正在进入陪伴空间</p>
                <div class="cp-transition-dots"><i></i><i></i><i></i></div></div>
            </section>

            <section class="cp-screen cp-room" id="cp-room-screen">
                <div class="cp-room-bg" id="cp-room-bg"></div>
                <header class="cp-room-head">
                    <button class="cp-glass" id="cp-leave" title="结束陪伴"><i class="fas fa-chevron-left"></i></button>
                    <div class="cp-room-title"><b id="cp-room-title">工作陪伴</b><small>QUIETLY TOGETHER</small></div>
                    <div class="cp-timer" id="cp-timer">15:00</div>
                </header>
                <div class="cp-stage">
                    <article class="cp-person partner">
                        <img class="cp-character" id="cp-partner-image" alt="梦角状态图片" hidden>
                        <div class="cp-empty-character" id="cp-partner-empty">尚未设置状态图片</div>
                        <div class="cp-status"><small>PARTNER STATUS</small><span id="cp-partner-status">学习中</span></div>
                        <div class="cp-person-meta"><b id="cp-partner-name">梦角</b><small>状态由对方控制</small></div>
                    </article>
                    <article class="cp-person me">
                        <img class="cp-character" id="cp-me-image" alt="我的状态图片" hidden>
                        <div class="cp-empty-character" id="cp-me-empty">尚未设置状态图片</div>
                        <div class="cp-status"><small>MY STATUS</small><span id="cp-me-status">工作中</span></div>
                        <div class="cp-person-meta"><b id="cp-me-name">我</b><small id="cp-me-role">发起方 · 状态锁定</small></div>
                    </article>
                </div>
                <nav class="cp-tools">
                    <button class="cp-tool" id="cp-history-open" title="会话记录"><i class="fas fa-list-ul"></i></button>
                    <button class="cp-tool" id="cp-music-open" title="音乐"><i class="fas fa-music"></i></button>
                    <button class="cp-tool" id="cp-chat-open" title="说说话"><i class="fas fa-comment-dots"></i></button>
                    <button class="cp-tool" id="cp-settings-open" title="设置"><i class="fas fa-sliders-h"></i></button>
                </nav>

                <div class="cp-live-bubbles" id="cp-live-bubbles" aria-live="polite"></div>
                <section class="cp-chat-dock" id="cp-chat-dock">
                    <input class="cp-input" id="cp-chat-input" maxlength="160" placeholder="说点什么…">
                    <button class="cp-btn primary" id="cp-chat-send"><i class="fas fa-paper-plane"></i></button>
                </section>

                <section class="cp-full-page cp-half-page" id="cp-history-page">
                    <header class="cp-full-head"><button class="cp-glass" data-cp-page-close><i class="fas fa-chevron-left"></i></button><b>会话记录</b><span></span></header>
                    <div class="cp-session-list" id="cp-history-list"></div>
                </section>
                <section class="cp-full-page" id="cp-settings-page">
                    <header class="cp-full-head"><button class="cp-glass" data-cp-page-close><i class="fas fa-chevron-left"></i></button><b>陪伴设置</b><span></span></header>
                    <div class="cp-settings-body">
                        <div class="cp-setting-block"><h3>当前状态</h3><p id="cp-state-rule">发起方的状态在本次陪伴中锁定；梦角的状态始终由他自己控制。</p>
                            <div class="cp-setting-row"><div><label class="cp-label">我</label><select class="cp-select" id="cp-my-state-select"></select></div><div><label class="cp-label">梦角</label><select class="cp-select" id="cp-partner-state-select" disabled></select></div></div>
                            <button class="cp-test-link" id="cp-preview-partner-state">预览测试：让梦角更换一次状态</button>
                            <button class="cp-test-link" id="cp-preview-expire">预览测试：立即结束倒计时</button>
                        </div>
                        <div class="cp-setting-block"><h3>状态对应图片</h3><p>上传透明底人物图即可；人物本身始终保持完全不透明。</p>
                            <div class="cp-map-tabs"><button class="cp-map-tab active" data-map-person="me">我的图片</button><button class="cp-map-tab" data-map-person="partner">梦角图片</button></div>
                            <div class="cp-map-list" id="cp-map-list"></div>
                            <label class="cp-label">添加自定义状态</label><div class="cp-setting-row"><input class="cp-input" id="cp-new-state" maxlength="8" placeholder="例如：画画"><button class="cp-btn primary" id="cp-add-state">添加</button></div>
                        </div>
                        <div class="cp-setting-block"><h3>陪伴页面背景</h3><p>背景图的不透明度只影响背景，不会影响人物图片。</p>
                            <label class="cp-label">背景方式</label><select class="cp-select" id="cp-bg-mode"><option value="gradient">自定义渐变色</option><option value="image">自定义背景图</option></select>
                            <div id="cp-gradient-settings"><label class="cp-label">渐变颜色范围</label><div class="cp-color-row"><input class="cp-color" id="cp-color-a" type="color"><input class="cp-color" id="cp-color-b" type="color"></div></div>
                            <div id="cp-image-settings"><label class="cp-label">背景图片链接</label><input class="cp-input" id="cp-bg-url" placeholder="粘贴图片链接，或使用下方本地图片"><label class="cp-upload" style="display:block;text-align:center;margin-top:7px;padding:10px">选择本地背景图<input id="cp-bg-file" type="file" accept="image/*"></label><label class="cp-label">背景图不透明度 <span id="cp-bg-opacity-value"></span></label><input class="cp-range" id="cp-bg-opacity" type="range" min="0" max="100" step="1"></div>
                        </div>
                    </div>
                </section>
            </section>

            <div class="cp-overlay center" id="cp-duration-overlay"><div class="cp-panel cp-panel-pad"><div style="text-align:center"><div class="cp-avatar-small" style="margin:0 auto 10px"><i class="fas fa-heart"></i></div><b id="cp-duration-title">工作陪伴</b><div style="margin-top:4px;color:var(--text-secondary);font-size:9px">确定后，邀约卡片会发送到主聊天记录</div></div><div class="cp-section-title">陪伴时长</div><div class="cp-duration-grid" id="cp-duration-grid"></div><input class="cp-input cp-custom-duration" id="cp-custom-minutes" type="number" min="1" max="720" placeholder="输入分钟数（1—720）"><div class="cp-actions"><button class="cp-btn secondary" id="cp-duration-back">返回</button><button class="cp-btn primary" id="cp-duration-confirm">确定邀约</button></div></div></div>
            <div class="cp-overlay center" id="cp-incoming-overlay"><div class="cp-panel cp-panel-pad"><div style="display:flex;align-items:center;gap:11px"><div class="cp-avatar-small" id="cp-incoming-avatar"><i class="fas fa-user"></i></div><div><b id="cp-incoming-title">梦角发来了邀约</b><div id="cp-incoming-detail" style="margin-top:4px;color:var(--text-secondary);font-size:9px"></div></div></div><p style="margin:15px 0;color:var(--text-secondary);font-size:10px;line-height:1.7">梦角只决定自己的状态。接受后，你可在设置中调整自己的状态。</p><div class="cp-actions"><button class="cp-btn secondary" id="cp-incoming-decline">暂时不要</button><button class="cp-btn primary" id="cp-incoming-accept">同意邀约</button></div></div></div>
            <div class="cp-overlay center" id="cp-timeup-overlay"><div class="cp-panel cp-panel-pad" style="text-align:center"><div class="cp-avatar-small" style="margin:0 auto 11px"><i class="fas fa-heart"></i></div><b id="cp-timeup-title">陪伴时间到了</b><p id="cp-timeup-copy" style="margin:8px 0 0;color:var(--text-secondary);font-size:10px;line-height:1.7">要结束还是继续？</p><div class="cp-actions"><button class="cp-btn secondary" id="cp-finish">结束返回</button><button class="cp-btn primary" id="cp-continue">邀请继续</button></div></div></div>
            <div class="cp-overlay" id="cp-music-overlay"><div class="cp-panel cp-music-panel"><div class="cp-handle"></div><div class="cp-panel-head"><div><b>陪伴音乐</b><small id="cp-music-status">当前静音</small></div><button class="cp-close" data-cp-overlay-close>×</button></div><div class="cp-panel-pad" id="cp-music-home"><div class="cp-music-grid"><button class="cp-music-btn" data-music="rain"><i class="fas fa-cloud-rain"></i>雨声</button><button class="cp-music-btn" data-music="fire"><i class="fas fa-fire"></i>篝火</button><button class="cp-music-btn" id="cp-custom-music-open"><i class="fas fa-music"></i>自定义音乐</button></div><label class="cp-label">音量 <span id="cp-volume-value">45%</span></label><input class="cp-range" id="cp-volume" type="range" min="0" max="100" value="45"><button class="cp-test-link" id="cp-stop-music">停止播放</button></div><section class="cp-custom-music-card" id="cp-custom-music-card"><div class="cp-custom-music-head"><button class="cp-close" id="cp-custom-music-back"><i class="fas fa-chevron-left"></i></button><b>自定义音乐</b><span></span></div><div class="cp-music-tabs"><button class="cp-music-tab active" data-music-tab="library">音乐库</button><button class="cp-music-tab" data-music-tab="settings">设置</button></div><div class="cp-music-tab-page active" data-music-page="library"><div class="cp-track-list" id="cp-track-list"></div></div><div class="cp-music-tab-page" data-music-page="settings"><p class="cp-music-note">雨声和篝火保留为固定按钮，但音频链接由你自己填写；自定义歌曲保存后会进入音乐库。</p><div class="cp-url-row"><span>雨声链接</span><input class="cp-input" id="cp-rain-url" placeholder="填写可直接播放的音频链接"></div><div class="cp-url-row"><span>篝火链接</span><input class="cp-input" id="cp-fire-url" placeholder="填写可直接播放的音频链接"></div><div class="cp-url-row"><span>歌曲名称</span><input class="cp-input" id="cp-custom-name" placeholder="例如：晚风"></div><div class="cp-url-row"><span>歌曲链接</span><input class="cp-input" id="cp-custom-url" placeholder="填写可直接播放的音频链接"></div><button class="cp-btn primary cp-save-music" id="cp-save-music">保存设置</button></div></section></div></div>
            <input id="cp-state-image-file" type="file" accept="image/*" hidden><audio id="cp-audio" loop></audio>
        `;
        document.body.appendChild(root);
    }

    function bindEvents() {
        bindStateCards();
        byId('companion-pre-settings')?.addEventListener('click', () => {
            closeCompanionModal();
            openRootScreen('cp-room-screen');
            applyBackground();
            openSettings();
        });
        all('[data-cp-overlay-close]').forEach(button => button.addEventListener('click', closeOverlays));
        all('.cp-overlay').forEach(overlay => overlay.addEventListener('click', event => { if (event.target === overlay) closeOverlays(); }));
        all('[data-cp-page-close]').forEach(button => button.addEventListener('click', () => { if (session) closeFullPages(); else closeRoot(); }));
        byId('cp-duration-back').addEventListener('click', () => {
            closeOverlays();
            if (durationPurpose === 'invite') {
                closeRoot();
                openActivityPicker();
            }
        });
        byId('cp-duration-confirm').addEventListener('click', confirmDuration);
        byId('cp-incoming-decline').addEventListener('click', declineIncoming);
        byId('cp-incoming-accept').addEventListener('click', acceptIncoming);
        byId('cp-leave').addEventListener('click', leaveRoom);
        byId('cp-history-open').addEventListener('click', openHistory);
        byId('cp-chat-open').addEventListener('click', openSessionChat);
        byId('cp-settings-open').addEventListener('click', openSettings);
        byId('cp-music-open').addEventListener('click', openMusic);
        byId('cp-chat-send').addEventListener('click', sendSessionChat);
        byId('cp-chat-input').addEventListener('keydown', event => { if (event.key === 'Enter') sendSessionChat(); });
        byId('cp-my-state-select').addEventListener('change', event => changeMyState(event.target.value));
        byId('cp-preview-partner-state').addEventListener('click', () => changePartnerState(true));
        byId('cp-preview-expire').addEventListener('click', () => { if (session) { closeFullPages(); session.end = Date.now(); tick(); } });
        byId('cp-add-state').addEventListener('click', addCustomState);
        byId('cp-map-list').addEventListener('click', handleMapClick);
        byId('cp-state-image-file').addEventListener('change', saveStateImage);
        all('[data-map-person]').forEach(button => button.addEventListener('click', () => { mapPerson = button.dataset.mapPerson; all('[data-map-person]').forEach(item => item.classList.toggle('active', item === button)); renderImageMap(); }));
        byId('cp-bg-mode').addEventListener('change', event => { config.background.mode = event.target.value; updateBackgroundSettings(); applyBackground(); saveConfig(); });
        byId('cp-color-a').addEventListener('input', event => { config.background.colorA = event.target.value; applyBackground(); saveConfig(); });
        byId('cp-color-b').addEventListener('input', event => { config.background.colorB = event.target.value; applyBackground(); saveConfig(); });
        byId('cp-bg-url').addEventListener('change', event => { config.background.image = event.target.value.trim(); applyBackground(); saveConfig(); });
        byId('cp-bg-file').addEventListener('change', saveBackgroundFile);
        byId('cp-bg-opacity').addEventListener('input', event => { config.background.imageOpacity = Number(event.target.value) / 100; byId('cp-bg-opacity-value').textContent = `${event.target.value}%`; applyBackground(); saveConfig(); });
        all('[data-music]').forEach(button => button.addEventListener('click', () => playMusic(button.dataset.music)));
        byId('cp-custom-music-open').addEventListener('click', openCustomMusicCard);
        byId('cp-custom-music-back').addEventListener('click', closeCustomMusicCard);
        all('[data-music-tab]').forEach(button => button.addEventListener('click', () => switchMusicTab(button.dataset.musicTab)));
        byId('cp-save-music').addEventListener('click', saveMusicInputs);
        byId('cp-track-list').addEventListener('click', handleTrackClick);
        byId('cp-stop-music').addEventListener('click', stopMusic);
        byId('cp-volume').addEventListener('input', event => { byId('cp-audio').volume = Number(event.target.value) / 100; byId('cp-volume-value').textContent = `${event.target.value}%`; });
        byId('cp-finish').addEventListener('click', finishSession);
        byId('cp-continue').addEventListener('click', continueSession);
        document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeOverlays(); closeFullPages(); } });
    }

    function openRootScreen(id) {
        byId('companion-root').classList.add('open');
        all('#companion-root .cp-screen').forEach(screen => screen.classList.toggle('active', screen.id === id));
    }

    function closeRoot() {
        byId('companion-root').classList.remove('open');
        all('#companion-root .cp-screen').forEach(screen => screen.classList.remove('active'));
        closeOverlays(); closeFullPages();
        byId('cp-chat-dock')?.classList.remove('open');
    }

    function openOverlay(id) { closeOverlays(); byId(id).classList.add('open'); }
    function closeOverlays() { all('#companion-root .cp-overlay').forEach(overlay => overlay.classList.remove('open')); }
    function closeFullPages() { all('#companion-root .cp-full-page').forEach(page => page.classList.remove('open')); }

    function openActivityPicker() {
        if (!initialized) { notify('陪伴功能仍在读取设置，请稍后再试'); return; }
        if (session) { openRootScreen('cp-room-screen'); return; }
        renderStateGrid();
        const modal = byId('companion-modal');
        if (!modal) return;
        if (typeof window.showModal === 'function') window.showModal(modal);
        else modal.style.display = 'flex';
    }

    function renderStateGrid() {
        const grid = byId('companion-state-grid');
        if (!grid) return;
        grid.querySelectorAll('[data-companion-custom="true"]').forEach(item => item.remove());
        (config.customStates || []).forEach(item => {
            const card = document.createElement('div');
            card.className = 'settings-card hub-card';
            card.dataset.companionState = item.id;
            card.dataset.companionCustom = 'true';
            card.innerHTML = `<i class="fas ${item.icon || 'fa-star'}"></i><span></span>`;
            card.querySelector('span').textContent = item.name;
            grid.appendChild(card);
        });
        bindStateCards();
    }

    function bindStateCards() {
        all('[data-companion-state]').forEach(card => {
            if (card.dataset.companionBound === 'true') return;
            card.dataset.companionBound = 'true';
            card.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                openDuration(card.dataset.companionState, 'invite');
            });
        });
    }

    function closeCompanionModal() {
        const modal = byId('companion-modal');
        if (!modal) return;
        if (typeof window.hideModal === 'function') window.hideModal(modal);
        else modal.style.display = 'none';
    }

    function openDuration(stateId, purpose) {
        selectedState = stateId; selectedMinutes = 15; durationPurpose = purpose || 'invite';
        closeCompanionModal();
        byId('companion-root').classList.add('open');
        byId('cp-duration-title').textContent = durationPurpose === 'continue' ? '继续陪伴' : `${stateInfo(stateId).name}陪伴`;
        renderDurationGrid(); openOverlay('cp-duration-overlay');
    }

    function renderDurationGrid() {
        const grid = byId('cp-duration-grid'); grid.innerHTML = '';
        DURATION_OPTIONS.forEach(option => {
            const button = document.createElement('button'); button.className = `cp-duration${selectedMinutes === option.minutes ? ' active' : ''}`; button.textContent = option.label;
            button.addEventListener('click', () => { selectedMinutes = option.minutes; renderDurationGrid(); }); grid.appendChild(button);
        });
        byId('cp-custom-minutes').classList.toggle('show', selectedMinutes === 0);
    }

    function resolvedMinutes() {
        const value = selectedMinutes === 0 ? Number(byId('cp-custom-minutes').value) : selectedMinutes;
        return value >= 1 && value <= 720 ? value : 0;
    }

    function confirmDuration() {
        const minutes = resolvedMinutes(); if (!minutes) { notify('请输入 1—720 分钟', 'error'); return; }
        if (durationPurpose === 'continue') { closeOverlays(); requestContinuation(minutes); return; }
        sendUserInvitation(selectedState, minutes);
    }

    function sendUserInvitation(stateId, minutes) {
        if (outgoingPending) { notify('上一张邀约还在等待回应'); return; }
        closeRoot();
        config.lastMyState = stateId; saveConfig(); outgoingPending = true;
        const id = Date.now() + Math.random(); const info = stateInfo(stateId);
        bridge().addMainMessage({
            id, sender: 'user', text: '', type: 'companion-invite', companionDirection: 'outgoing',
            companionStateId: stateId, companionStateName: info.label, companionMinutes: minutes,
            companionDurationLabel: durationLabel(minutes), companionStatus: 'pending'
        });
        window.EnhancementUI?.playProfile(`invite_${stateId}`);
        const wait = randomReplyDelay(2800);
        setTimeout(() => {
            outgoingPending = false;
            const accepted = Math.random() * 100 < ACCEPT_CHANCE;
            bridge().updateMainMessage(id, { companionStatus: accepted ? 'accepted' : 'rejected' });
            if (accepted) showDecisionTransition(true, () => startSession({ initiator: 'me', stateId, minutes, messageId: id }));
            else showDecisionTransition(false);
        }, wait);
    }

    function createPartnerInvitation(force) {
        if (!initialized || session || incomingMessageId || outgoingPending) return;
        if (!force && Math.random() * 100 >= RANDOM_INVITE_CHANCE) return;
        const info = randomItem(states()); const minutes = randomItem([5, 15, 30, 60, 120]); const id = Date.now() + Math.random();
        incomingMessageId = id;
        bridge().addMainMessage({
            id, sender: getNames().partner, text: '', type: 'companion-invite', companionDirection: 'incoming',
            companionStateId: info.id, companionStateName: info.label, companionMinutes: minutes,
            companionDurationLabel: durationLabel(minutes), companionStatus: 'pending'
        });
        window.EnhancementUI?.playProfile(`invite_${info.id}`);
        bridge().playMessageSound?.();
        if (force) notify(`${getNames().partner}发来了一张陪伴邀约`);
    }

    function handleInviteCard(id) {
        const message = bridge()?.getMessage?.(id); if (!message || message.type !== 'companion-invite') return;
        if (message.companionStatus !== 'pending') { notify(message.companionStatus === 'accepted' ? '这张邀约已经接受' : '这张邀约已经结束'); return; }
        if (message.sender === 'user') { notify('正在等待对方回应'); return; }
        incomingMessageId = id; const info = stateInfo(message.companionStateId); const avatar = getAvatar('partner');
        byId('cp-incoming-avatar').innerHTML = avatar ? `<img src="${avatar}" alt="">` : '<i class="fas fa-user"></i>';
        byId('cp-incoming-title').textContent = `${getNames().partner}发来了${info.name}邀约`;
        byId('cp-incoming-detail').textContent = `${info.label} · ${durationLabel(message.companionMinutes)}`;
        byId('companion-root').classList.add('open'); openOverlay('cp-incoming-overlay');
    }

    function acceptIncoming() {
        const message = bridge()?.getMessage?.(incomingMessageId); if (!message) return;
        bridge().updateMainMessage(message.id, { companionStatus: 'accepted' }); incomingMessageId = null; closeOverlays();
        showDecisionTransition(true, () => startSession({ initiator: 'partner', stateId: message.companionStateId, minutes: message.companionMinutes, messageId: message.id }));
    }

    function declineIncoming() {
        const message = bridge()?.getMessage?.(incomingMessageId); if (message) bridge().updateMainMessage(message.id, { companionStatus: 'rejected' });
        incomingMessageId = null; closeRoot(); notify('你暂时没有接受这次陪伴');
    }

    function showDecisionTransition(accepted, callback) {
        applyBackground(); openRootScreen('cp-transition-screen');
        const avatar = getAvatar('partner'); byId('cp-transition-avatar').innerHTML = avatar ? `<img src="${avatar}" alt="">` : '<i class="fas fa-user"></i>';
        byId('cp-transition-title').textContent = accepted ? `${getNames().partner}已接受邀约` : `${getNames().partner}暂时没有接受`;
        byId('cp-transition-copy').textContent = accepted ? '正在进入陪伴空间' : '这次先各自忙一会儿吧';
        all('.cp-transition-dots').forEach(node => node.style.display = accepted ? 'flex' : 'none');
        setTimeout(() => { if (accepted && callback) callback(); else closeRoot(); }, accepted ? 1750 : 1900);
    }

    function startSession(options) {
        clearInterval(countdownTimer); clearInterval(rarePartnerTimer);
        const now = Date.now(); const myState = options.initiator === 'me' ? options.stateId : (config.lastMyState || 'work');
        const partnerState = options.initiator === 'partner' ? options.stateId : randomState();
        session = {
            initiator: options.initiator, lockedPerson: options.initiator, minutes: options.minutes,
            start: now, end: now + options.minutes * 60000, current: { me: myState, partner: partnerState },
            logs: [
                { type: 'system', text: `${options.initiator === 'me' ? getNames().me : getNames().partner}发起了${stateInfo(options.stateId).name}陪伴 · ${durationLabel(options.minutes)}` },
                { type: 'system', text: '对方已接受邀约，陪伴开始' }
            ], partnerChanged: false
        };
        config.lastMyState = myState; saveConfig();
        byId('cp-room-title').textContent = `${stateInfo(options.stateId).name}陪伴`;
        openRootScreen('cp-room-screen'); applyBackground(); renderRoom(); tick();
        countdownTimer = setInterval(tick, 1000);
        // 状态通常整场不变：每 15 分钟仅有 8% 概率变化，而且一场最多自动变化一次。
        rarePartnerTimer = setInterval(() => { if (session && !session.partnerChanged && Math.random() < 0.08) { session.partnerChanged = true; changePartnerState(false); } }, 15 * 60 * 1000);
    }

    function tick() {
        if (!session) return;
        const remaining = Math.max(0, session.end - Date.now()); const total = Math.ceil(remaining / 1000);
        const hours = Math.floor(total / 3600), minutes = Math.floor((total % 3600) / 60), seconds = total % 60;
        byId('cp-timer').textContent = (hours ? `${String(hours).padStart(2, '0')}:` : '') + `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (remaining <= 0) { clearInterval(countdownTimer); countdownTimer = null; openTimeUp(); }
    }

    function renderRoom() {
        if (!session) return; const names = getNames();
        byId('cp-partner-name').textContent = names.partner; byId('cp-me-name').textContent = names.me;
        renderPerson('me'); renderPerson('partner'); renderStateSelects(); renderLogs();
        byId('cp-me-role').textContent = session.lockedPerson === 'me' ? '发起方 · 状态锁定' : '被邀约方 · 设置中可更改';
    }

    function renderPerson(person) {
        const info = stateInfo(session.current[person]); const image = byId(`cp-${person}-image`); const empty = byId(`cp-${person}-empty`); const src = config.images?.[person]?.[info.id];
        byId(`cp-${person}-status`).textContent = info.label;
        if (src) { image.src = src; image.hidden = false; empty.hidden = true; }
        else { image.hidden = true; image.removeAttribute('src'); empty.hidden = false; empty.innerHTML = `<i class="fas ${info.icon || 'fa-star'}"></i><span>${escapeText(info.name)} · 尚未设置图片</span>`; }
    }

    function renderStateSelects() {
        const options = states().map(item => `<option value="${item.id}">${escapeText(item.label)}</option>`).join('');
        byId('cp-my-state-select').innerHTML = options; byId('cp-partner-state-select').innerHTML = options;
        byId('cp-my-state-select').value = session ? session.current.me : (config.lastMyState || 'work'); byId('cp-partner-state-select').value = session ? session.current.partner : 'study';
        byId('cp-my-state-select').disabled = !!session && session.lockedPerson === 'me'; byId('cp-partner-state-select').disabled = true;
        if (!session) { byId('cp-state-rule').textContent = '这里设置进入陪伴时我的默认状态；梦角进入页面后再随机决定自己的状态。'; return; }
        byId('cp-state-rule').textContent = session.lockedPerson === 'me'
            ? '你是本次邀约发起方，自己的状态已经锁定；梦角始终控制自己的状态。'
            : '你是本次被邀约方，可以更改自己的状态；梦角始终控制自己的状态。';
    }

    function changeMyState(value) {
        if (!session) { config.lastMyState = value; saveConfig(); notify(`默认状态已改为“${stateInfo(value).label}”`); return; }
        if (session.lockedPerson === 'me') { notify('邀约发起方不能更改自己的状态'); renderStateSelects(); return; }
        session.current.me = value; config.lastMyState = value; session.logs.push({ type: 'system', text: `${getNames().me}把状态改为“${stateInfo(value).label}”` }); saveConfig(); renderRoom();
    }

    function changePartnerState(showNotice) {
        if (!session) return; session.current.partner = randomState(session.current.partner); session.logs.push({ type: 'system', text: `${getNames().partner}把状态改为“${stateInfo(session.current.partner).label}”` }); renderRoom(); if (showNotice) notify(`${getNames().partner}更换了状态`);
    }

    function applyBackground() {
        const bg = config.background; const root = byId('companion-root');
        root.style.setProperty('--cp-gradient-a', bg.colorA); root.style.setProperty('--cp-gradient-b', bg.colorB);
        const layer = byId('cp-room-bg'); if (!layer) return;
        if (bg.mode === 'image' && bg.image) { layer.style.backgroundImage = `url("${String(bg.image).replace(/"/g, '%22')}")`; layer.style.opacity = String(bg.imageOpacity); }
        else { layer.style.backgroundImage = 'none'; layer.style.opacity = '0'; }
    }

    function openHistory() { renderLogs(); byId('cp-history-page').classList.add('open'); }
    function openSessionChat() {
        if (!session) return;
        const dock = byId('cp-chat-dock');
        const willOpen = !dock.classList.contains('open');
        dock.classList.toggle('open', willOpen);
        if (willOpen) setTimeout(() => byId('cp-chat-input').focus(), 120);
    }
    function renderLogs() {
        if (!session) return;
        const list = byId('cp-history-list');
        list.innerHTML = '';
        session.logs.forEach(item => {
            const row = document.createElement('div');
            if (item.type === 'system') {
                row.className = 'cp-log-system';
                row.textContent = `　　· ${item.text}`;
            } else {
                row.className = `cp-log-line ${item.type}`;
                const bubble = document.createElement('div');
                bubble.className = 'cp-log-bubble';
                bubble.textContent = item.text;
                row.appendChild(bubble);
            }
            list.appendChild(row);
        });
        requestAnimationFrame(() => list.scrollTop = list.scrollHeight);
    }

    function showTransientBubble(person, text) {
        const host = byId('cp-live-bubbles');
        if (!host) return;
        const item = document.createElement('div');
        item.className = `cp-live-bubble ${person}`;
        const avatar = getAvatar(person === 'me' ? 'me' : 'partner');
        const avatarNode = document.createElement('div');
        avatarNode.className = 'cp-live-avatar';
        avatarNode.innerHTML = avatar ? `<img src="${escapeText(avatar)}" alt="">` : '<i class="fas fa-user"></i>';
        const bubble = document.createElement('div');
        bubble.className = 'cp-live-bubble-text';
        bubble.textContent = text;
        item.append(avatarNode, bubble);
        host.appendChild(item);
        requestAnimationFrame(() => item.classList.add('show'));
        setTimeout(() => {
            item.classList.remove('show');
            setTimeout(() => item.remove(), 260);
        }, 8000);
    }

    function sendSessionChat() {
        if (!session) return; const input = byId('cp-chat-input'); const text = input.value.trim(); if (!text) return;
        input.value = ''; session.logs.push({ type: 'me', text }); renderLogs(); showTransientBubble('me', text);
        const settings = bridge()?.getSettings?.() || {}; if (settings.allowReadNoReply && Math.random() < 0.5) return;
        const count = Math.random() < 0.75 ? 1 : (Math.random() < 0.95 ? 2 : 3); let wait = 0;
        for (let i = 0; i < count; i++) {
            wait += randomReplyDelay(0);
            setTimeout(() => {
                if (!session) return; const reply = bridge()?.getRandomReply?.();
                if (!reply) { if (i === 0) notify('还没有添加可用字卡，请先在主网站字卡库中添加'); return; }
                session.logs.push({ type: 'partner', text: reply }); renderLogs(); showTransientBubble('partner', reply); bridge().playMessageSound?.();
            }, wait);
        }
    }

    function openSettings() { renderSettings(); byId('cp-settings-page').classList.add('open'); }
    function renderSettings() {
        renderStateSelects(); renderImageMap(); const bg = config.background;
        byId('cp-preview-partner-state').style.display = session ? 'block' : 'none'; byId('cp-preview-expire').style.display = session ? 'block' : 'none';
        byId('cp-bg-mode').value = bg.mode; byId('cp-color-a').value = bg.colorA; byId('cp-color-b').value = bg.colorB; byId('cp-bg-url').value = bg.image && !bg.image.startsWith('data:') ? bg.image : '';
        byId('cp-bg-opacity').value = Math.round(bg.imageOpacity * 100); byId('cp-bg-opacity-value').textContent = `${Math.round(bg.imageOpacity * 100)}%`; updateBackgroundSettings();
    }

    function updateBackgroundSettings() {
        const imageMode = config.background.mode === 'image'; byId('cp-gradient-settings').style.display = imageMode ? 'none' : 'block'; byId('cp-image-settings').style.display = imageMode ? 'block' : 'none';
    }

    function renderImageMap() {
        const list = byId('cp-map-list'); list.innerHTML = '';
        states().forEach(item => {
            const row = document.createElement('div'); row.className = 'cp-map-row'; const src = config.images?.[mapPerson]?.[item.id];
            const preview = document.createElement('div'); preview.className = 'cp-map-preview'; preview.innerHTML = src ? `<img src="${src}" alt="">` : '未设置';
            const copy = document.createElement('div'); copy.className = 'cp-map-copy'; const title = document.createElement('b'); title.textContent = item.name; const note = document.createElement('small'); note.textContent = item.base === false ? '自定义状态' : '基础状态'; copy.append(title, note);
            if (item.base === false) { const remove = document.createElement('button'); remove.className = 'cp-delete-state'; remove.dataset.deleteState = item.id; remove.textContent = '删除状态'; copy.appendChild(remove); }
            const label = document.createElement('label'); label.className = 'cp-upload'; label.textContent = src ? '更换' : '上传'; label.dataset.uploadState = item.id;
            row.append(preview, copy, label); list.appendChild(row);
        });
    }

    function handleMapClick(event) {
        const upload = event.target.closest('[data-upload-state]'); const remove = event.target.closest('[data-delete-state]');
        if (upload) { byId('cp-state-image-file').dataset.person = mapPerson; byId('cp-state-image-file').dataset.state = upload.dataset.uploadState; byId('cp-state-image-file').value = ''; byId('cp-state-image-file').click(); }
        if (remove) deleteCustomState(remove.dataset.deleteState);
    }

    function saveStateImage(event) {
        const file = event.target.files[0]; if (!file) return; const person = event.target.dataset.person, stateId = event.target.dataset.state; const reader = new FileReader();
        reader.onload = () => { config.images[person][stateId] = reader.result; saveConfig(); renderImageMap(); if (session) renderRoom(); notify('状态图片已保存'); };
        reader.readAsDataURL(file);
    }

    function addCustomState() {
        const input = byId('cp-new-state'); const name = input.value.trim(); if (!name) { notify('先填写状态名称'); return; }
        if (states().some(item => item.name === name)) { notify('这个状态已经存在'); return; }
        config.customStates.push({ id: `custom_${Date.now()}`, name, label: `${name}中`, icon: 'fa-star', base: false }); input.value = ''; saveConfig(); renderStateGrid(); renderImageMap(); renderStateSelects(); notify(`已添加“${name}”`);
    }

    function deleteCustomState(id) {
        const target = stateInfo(id); if (target.base !== false) return;
        config.customStates = config.customStates.filter(item => item.id !== id); delete config.images.me[id]; delete config.images.partner[id];
        if (config.lastMyState === id) config.lastMyState = 'work'; if (session?.current.me === id) session.current.me = 'work'; if (session?.current.partner === id) session.current.partner = 'study';
        saveConfig(); renderStateGrid(); renderImageMap(); if (session) renderRoom(); notify(`已删除“${target.name}”`);
    }

    function saveBackgroundFile(event) {
        const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { config.background.image = reader.result; config.background.mode = 'image'; saveConfig(); renderSettings(); applyBackground(); notify('陪伴背景已保存'); }; reader.readAsDataURL(file);
    }

    function openMusic() {
        closeCustomMusicCard();
        byId('cp-rain-url').value = config.music.rainUrl || '';
        byId('cp-fire-url').value = config.music.fireUrl || '';
        renderTrackLibrary();
        openOverlay('cp-music-overlay');
    }

    function openCustomMusicCard() {
        renderTrackLibrary();
        switchMusicTab('library');
        byId('cp-music-home').style.display = 'none';
        byId('cp-custom-music-card').classList.add('open');
    }

    function closeCustomMusicCard() {
        const card = byId('cp-custom-music-card');
        if (card) card.classList.remove('open');
        const home = byId('cp-music-home');
        if (home) home.style.display = 'block';
    }

    function switchMusicTab(tab) {
        all('[data-music-tab]').forEach(button => button.classList.toggle('active', button.dataset.musicTab === tab));
        all('[data-music-page]').forEach(page => page.classList.toggle('active', page.dataset.musicPage === tab));
    }

    function saveMusicInputs() {
        config.music.rainUrl = byId('cp-rain-url').value.trim();
        config.music.fireUrl = byId('cp-fire-url').value.trim();
        const customName = byId('cp-custom-name').value.trim();
        const customUrl = byId('cp-custom-url').value.trim();
        if (customName || customUrl) {
            if (!customUrl) { notify('请填写自定义歌曲链接', 'error'); return; }
            config.music.customTracks.push({ id: `track_${Date.now()}`, name: customName || '自定义歌曲', url: customUrl });
            byId('cp-custom-name').value = '';
            byId('cp-custom-url').value = '';
        }
        saveConfig();
        renderTrackLibrary();
        notify(customUrl ? '音乐已保存到音乐库' : '雨声与篝火链接已保存');
    }

    function renderTrackLibrary() {
        const list = byId('cp-track-list');
        if (!list) return;
        const tracks = config.music.customTracks || [];
        if (!tracks.length) {
            list.innerHTML = '<div class="cp-track-empty">音乐库还是空的<br><small>切换到“设置”添加歌曲链接</small></div>';
            return;
        }
        list.innerHTML = '';
        tracks.forEach(track => {
            const row = document.createElement('div');
            row.className = 'cp-track-row';
            row.innerHTML = '<button class="cp-track-play" type="button"><i class="fas fa-play"></i><span></span></button><button class="cp-track-delete" type="button" title="删除"><i class="fas fa-trash"></i></button>';
            row.dataset.trackId = track.id;
            row.querySelector('span').textContent = track.name;
            list.appendChild(row);
        });
    }

    function handleTrackClick(event) {
        const row = event.target.closest('[data-track-id]');
        if (!row) return;
        const trackId = row.dataset.trackId;
        if (event.target.closest('.cp-track-delete')) {
            config.music.customTracks = config.music.customTracks.filter(item => item.id !== trackId);
            saveConfig();
            renderTrackLibrary();
            return;
        }
        if (event.target.closest('.cp-track-play')) playMusic('custom', trackId);
    }

    function playMusic(type, trackId) {
        let url = '';
        let label = '';
        if (type === 'custom') {
            const track = (config.music.customTracks || []).find(item => item.id === trackId);
            if (track) { url = track.url; label = track.name; }
        } else {
            url = config.music[`${type}Url`] || '';
            label = type === 'rain' ? '雨声' : '篝火';
        }
        if (!url) { notify('请在“自定义音乐 → 设置”里填写对应的音频链接'); return; }
        const audio = byId('cp-audio'); audio.src = url; audio.volume = Number(byId('cp-volume').value) / 100;
        audio.play().then(() => {
            currentMusic = type === 'custom' ? `custom:${trackId}` : type;
            all('[data-music]').forEach(button => button.classList.toggle('active', button.dataset.music === type));
            byId('cp-music-status').textContent = `正在播放 · ${label}`;
        }).catch(() => notify('音乐链接无法播放，请检查是否为可直接访问的音频地址', 'error'));
    }

    function stopMusic() { const audio = byId('cp-audio'); audio.pause(); audio.removeAttribute('src'); currentMusic = ''; all('[data-music]').forEach(button => button.classList.remove('active')); byId('cp-music-status').textContent = '当前静音'; }

    function openTimeUp() {
        if (!session) return; const partnerAsks = Math.random() < 0.42;
        session.continueMode = partnerAsks ? 'partner' : 'me'; session.partnerContinueMinutes = randomItem([5, 15, 30]);
        byId('cp-timeup-title').textContent = partnerAsks ? `${getNames().partner}想继续陪你` : '陪伴时间到了';
        byId('cp-timeup-copy').textContent = partnerAsks ? `${getNames().partner}想再陪你 ${durationLabel(session.partnerContinueMinutes)}，要答应吗？` : '要结束返回聊天，还是再邀请对方继续陪一会儿？';
        byId('cp-continue').textContent = partnerAsks ? '答应继续' : '邀请继续'; openOverlay('cp-timeup-overlay');
    }

    function continueSession() {
        if (!session) return; if (session.continueMode === 'partner') extendSession(session.partnerContinueMinutes, `接受了${getNames().partner}的继续请求`); else openDuration(session.current.me, 'continue');
    }

    function requestContinuation(minutes) {
        if (!session) return; session.logs.push({ type: 'system', text: `已向${getNames().partner}发送继续陪伴 ${durationLabel(minutes)} 的请求` }); renderLogs();
        setTimeout(() => {
            if (!session) return; const accepted = Math.random() * 100 < ACCEPT_CHANCE;
            if (accepted) extendSession(minutes, `${getNames().partner}同意继续陪伴`);
            else { notify(`${getNames().partner}这次没有继续`); setTimeout(finishSession, 1200); }
        }, randomReplyDelay(2500));
    }

    function extendSession(minutes, text) {
        if (!session) return; session.end = Date.now() + minutes * 60000; session.minutes += minutes; session.logs.push({ type: 'system', text: `${text} · 延长 ${durationLabel(minutes)}` }); closeOverlays(); clearInterval(countdownTimer); countdownTimer = setInterval(tick, 1000); tick(); renderLogs();
    }

    function leaveRoom() { if (!session) return; if (confirm('要提前结束这次陪伴并返回主聊天吗？')) finishSession(); }
    function finishSession() {
        if (!session) return;
        const endedSession = session;
        const durationSeconds = Math.max(1, Math.round((Date.now() - endedSession.start) / 1000));
        if (typeof window.addCompanionDiaryEntry === 'function') {
            window.addCompanionDiaryEntry({
                id: Date.now(),
                mode: endedSession.current.me || 'work',
                duration: durationSeconds,
                initiator: endedSession.initiator === 'partner' ? 'partner' : 'user'
            });
        }
        clearInterval(countdownTimer); clearInterval(rarePartnerTimer); stopMusic();
        session = null;
        const bubbles = byId('cp-live-bubbles'); if (bubbles) bubbles.innerHTML = '';
        closeRoot(); notify('本次陪伴已经结束');
    }
    function escapeText(value) { const node = document.createElement('div'); node.textContent = String(value); return node.innerHTML; }

    async function initialize() {
        if (initialized) return;
        try { storageKey = bridge().storageKey('companionSettings'); }
        catch (error) { setTimeout(initialize, 450); return; }
        config = mergeConfig(await readStored()); injectUI(); bindEvents(); renderStateGrid(); applyBackground(); initialized = true;
    }

    window.companionFeature = {
        afterPartnerReply() { createPartnerInvitation(false); },
        handleInviteCard(id) { if (initialized) handleInviteCard(id); },
        open() { openActivityPicker(); }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 500));
    else setTimeout(initialize, 500);
})();
