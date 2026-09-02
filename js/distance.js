/* 距离：纯前端随机感知。复用主站姓名、头像与存储，不调用 AI。 */
(function () {
    'use strict';

    const TTL = 24 * 60 * 60 * 1000;
    const NEAR_RADIUS = 18.5;
    const MAX_RADIUS = 46.5;
    const $ = id => document.getElementById(id);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const rnd = (min, max) => min + Math.random() * (max - min);

    let preferences = { showAvatar: false, showMyAvatar: false, showNames: true, directionMode: 'cardinal', panelCollapsed: false };
    let records = [];
    let loaded = false;
    let pageOpen = false;
    let raf = 0;
    let path = null;
    let pauseUntil = 0;
    let point = randomPoint();
    let near = radiusOf(point) <= NEAR_RADIUS;
    let intensity = Math.random() * .45;
    let linkStrength = Math.random();
    let touchSignal = false;
    let nextIntensityShift = 0;
    let nextLinkShift = 0;
    let previousBodyOverflow = '';

    function key(name) {
        try { if (typeof getStorageKey === 'function') return getStorageKey(name); } catch (_) {}
        return (window.APP_PREFIX || 'CHAT_APP_V3_') + name;
    }
    async function read(name, fallback) {
        try {
            if (window.localforage) {
                const value = await localforage.getItem(key(name));
                return value == null ? fallback : value;
            }
            const raw = localStorage.getItem(key(name));
            return raw == null ? fallback : JSON.parse(raw);
        } catch (_) { return fallback; }
    }
    async function write(name, value) {
        try {
            if (window.localforage) return await localforage.setItem(key(name), value);
            localStorage.setItem(key(name), JSON.stringify(value));
        } catch (error) { console.warn('[distance] 保存失败', error); }
    }
    function appSettings() {
        try { if (typeof settings !== 'undefined' && settings) return settings; } catch (_) {}
        return window.settings || {};
    }
    function partnerName() { return appSettings().partnerName || '梦角'; }
    function myName() { return appSettings().myName || '我'; }
    function escapeHtml(value) {
        const box = document.createElement('div');
        box.textContent = String(value == null ? '' : value);
        return box.innerHTML;
    }

    function injectPage() {
        if ($('distance-page')) return;
        const page = document.createElement('section');
        page.id = 'distance-page';
        page.setAttribute('aria-hidden', 'true');
        page.innerHTML = `
            <div class="dist-nebula"></div><div class="dist-stars"></div><div class="dist-grain"></div>
            <main class="dist-app">
                <header class="dist-header">
                    <button class="dist-back" id="dist-back" title="返回聊天"><i class="fas fa-chevron-left"></i></button>
                    <div class="dist-brand"><span class="dist-brand-line"></span><div class="dist-title">距离</div><span class="dist-brand-line"></span></div>
                    <div class="dist-head-right">
                        <button class="dist-gear" id="dist-gear" title="距离设置"><i class="fas fa-gear"></i></button>
                        <div class="dist-settings" id="dist-settings">
                            <div class="dist-setting-row"><div class="dist-setting-name">显示对方头像<span class="dist-setting-sub">使用主站梦角头像</span></div><button class="dist-toggle" id="dist-avatar-toggle"></button></div>
                            <div class="dist-setting-row"><div class="dist-setting-name">显示我的头像<span class="dist-setting-sub">使用主站我的头像</span></div><button class="dist-toggle" id="dist-my-avatar-toggle"></button></div>
                            <div class="dist-setting-row"><div class="dist-setting-name">显示名字<span class="dist-setting-sub">控制坐标下方姓名</span></div><button class="dist-toggle" id="dist-name-toggle"></button></div>
                            <div class="dist-setting-row"><div class="dist-setting-name">方位模式<span class="dist-setting-sub" id="dist-direction-sub">当前：东西南北</span></div><button class="dist-seg" id="dist-direction-btn">切换</button></div>
                        </div>
                    </div>
                </header>
                <section class="dist-stage">
                    <div class="dist-stage-caption">DISTANCE · RESONANCE</div>
                    <div class="dist-cosmos" id="dist-cosmos">
                        <div class="dist-glow-disk"></div>
                        <div class="dist-orbit dist-o1"></div><div class="dist-orbit dist-o2"></div><div class="dist-orbit dist-o3"></div><div class="dist-orbit dist-o4"></div><div class="dist-orbit dist-o5"></div>
                        <div class="dist-arc"></div><div class="dist-arc dist-a2"></div><div class="dist-arc dist-a3"></div>
                        <div class="dist-dash"></div><div class="dist-dash dist-d2"></div>
                        <div class="dist-signal"></div><div class="dist-signal dist-s2"></div>
                        <div class="dist-ripple dist-r1"></div><div class="dist-ripple dist-r2"></div><div class="dist-ripple dist-r3"></div>
                        <span class="dist-twinkle dist-t1">✦</span><span class="dist-twinkle dist-t2">✦</span><span class="dist-twinkle dist-t3">✦</span><span class="dist-twinkle dist-t4">✦</span><span class="dist-twinkle dist-t5">✦</span>
                        <div class="dist-center" id="dist-center"><div class="dist-me-avatar" id="dist-me-avatar"></div><div class="dist-me">✦</div><div class="dist-me-label" id="dist-me-label">我</div></div>
                        <div class="dist-char" id="dist-char"><div class="dist-avatar" id="dist-avatar"></div><div class="dist-marker"><span class="dist-marker-cross"></span><span class="dist-marker-star">✦</span><span class="dist-char-label" id="dist-partner-label">梦角</span></div></div>
                    </div>
                    <aside class="dist-side-panel" id="dist-side-panel">
                        <button class="dist-panel-collapse" id="dist-panel-collapse" aria-label="折叠状态栏"><span>›</span></button>
                        <div class="dist-panel-inner">
                            <div class="dist-panel-title">状态栏</div><div class="dist-panel-rule"></div>
                            <div class="dist-panel-planet">
                                <div class="dist-planet-glow"></div>
                                <div class="dist-planet-shell">
                                    <div class="dist-planet-orbit"></div>
                                    <div class="dist-planet-orbit dist-planet-orbit-two"></div>
                                    <div class="dist-planet-shine"></div>
                                    <div class="dist-planet-ring"></div>
                                    <div class="dist-planet-core"></div>
                                </div>
                                <span class="dist-panel-star dist-ps1">✦</span>
                                <span class="dist-panel-star dist-ps2">✦</span>
                                <span class="dist-panel-star dist-ps3">✦</span>
                                <span class="dist-panel-star dist-ps4">✦</span>
                            </div>
                            <div class="dist-status-list">
                                <div class="dist-status-item"><div class="dist-status-label">方位感知 <span class="dist-status-mode" id="dist-direction-label">东西南北</span></div><div class="dist-status-value" id="dist-direction-value">暂时感知不到</div></div>
                                <div class="dist-status-item"><div class="dist-status-label">感知强度</div><div class="dist-status-value" id="dist-intensity-value">很淡，像只是掠过一丝气息</div><div class="dist-strength-bar"><div class="dist-strength-fill" id="dist-intensity-fill"></div></div></div>
                                <div class="dist-status-item"><div class="dist-status-label">链接状态</div><div class="dist-status-value" id="dist-link-value">偏弱，讯号断续</div><div class="dist-strength-bar"><div class="dist-strength-fill" id="dist-link-fill"></div></div></div>
                                <div class="dist-record-box"><div class="dist-status-label">记录 <span class="dist-status-mode">逐条保留24小时</span></div><div class="dist-record-list" id="dist-record-list"></div></div>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>`;
        document.body.appendChild(page);
    }

    async function loadData() {
        if (loaded) return;
        preferences = Object.assign(preferences, await read('distanceState', {}));
        const saved = await read('distanceRecords', []);
        records = Array.isArray(saved) ? saved : [];
        loaded = true;
        await pruneRecords(true);
        applyPreferences();
    }
    function applyPreferences() {
        const page = $('distance-page');
        const character = $('dist-char');
        $('dist-avatar-toggle')?.classList.toggle('active', !!preferences.showAvatar);
        $('dist-my-avatar-toggle')?.classList.toggle('active', !!preferences.showMyAvatar);
        $('dist-name-toggle')?.classList.toggle('active', preferences.showNames !== false);
        character?.classList.toggle('show-avatar', !!preferences.showAvatar);
        $('dist-center')?.classList.toggle('show-my-avatar', !!preferences.showMyAvatar);
        page?.classList.toggle('hide-names', preferences.showNames === false);
        $('dist-side-panel')?.classList.toggle('collapsed', !!preferences.panelCollapsed);
        updateDirectionLabels();
    }
    function savePreferences() { write('distanceState', preferences); }

    function refreshIdentity() {
        const partner = partnerName(), me = myName();
        if ($('dist-partner-label')) $('dist-partner-label').textContent = partner;
        if ($('dist-me-label')) $('dist-me-label').textContent = me;
        const source = $('partner-avatar')?.querySelector('img')?.src || '';
        const avatar = $('dist-avatar');
        if (avatar) avatar.innerHTML = source ? `<img src="${escapeHtml(source)}" alt="${escapeHtml(partner)}">` : `<span>${escapeHtml(partner.slice(0, 1) || '梦')}</span>`;
        const mySource = $('my-avatar')?.querySelector('img')?.src || '';
        const myAvatar = $('dist-me-avatar');
        if (myAvatar) myAvatar.innerHTML = mySource ? `<img src="${escapeHtml(mySource)}" alt="${escapeHtml(me)}">` : `<span>${escapeHtml(me.slice(0, 1) || '我')}</span>`;
    }

    async function openDistance() {
        if (pageOpen) return;
        await loadData();
        refreshIdentity();
        applyPreferences();
        renderRecords();
        pageOpen = true;
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        $('distance-page')?.classList.add('active');
        $('distance-page')?.setAttribute('aria-hidden', 'false');
        setPosition(point, false);
        if (!raf) raf = requestAnimationFrame(tick);
    }
    function closeDistance() {
        pageOpen = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        $('dist-settings')?.classList.remove('show');
        $('distance-page')?.classList.remove('active');
        $('distance-page')?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousBodyOverflow;
    }

    function randomPoint() {
        const angle = rnd(0, Math.PI * 2);
        const radius = Math.sqrt(rnd(0, 1)) * (MAX_RADIUS - 7.5) + 7.5;
        return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
    }
    function radiusOf(value) { return Math.hypot(value.x - 50, value.y - 50); }
    function randomWalkTarget(from) {
        const dx = from.x - 50, dy = from.y - 50;
        const radius = Math.max(1, radiusOf(from));
        const angle = Math.atan2(dy, dx);
        const nextRadius = clamp(radius + (Math.random() + Math.random() - 1) * 18, 7.5, MAX_RADIUS);
        const nextAngle = angle + (Math.random() + Math.random() - 1) * 1.9;
        return { x: 50 + Math.cos(nextAngle) * nextRadius, y: 50 + Math.sin(nextAngle) * nextRadius };
    }
    function cubic(a, b, c, d, t) {
        const m = 1 - t, m2 = m * m, t2 = t * t;
        return { x: m2*m*a.x + 3*m2*t*b.x + 3*m*t2*c.x + t2*t*d.x, y: m2*m*a.y + 3*m2*t*b.y + 3*m*t2*c.y + t2*t*d.y };
    }
    function randomMoveDuration() { return 2500 + (-Math.log(Math.max(1e-8, Math.random()))) * 5200; }
    function randomHoldDuration() { return (-Math.log(Math.max(1e-9, Math.random()))) * 6200; }
    function randomWait(scale, floor) { return (floor || 0) + (-Math.log(Math.max(1e-9, Math.random()))) * scale; }
    function buildPath(now) {
        const end = randomWalkTarget(point), chord = { x: end.x - point.x, y: end.y - point.y };
        const length = Math.max(1, Math.hypot(chord.x, chord.y)), nx = -chord.y / length, ny = chord.x / length;
        const bend = (Math.random() + Math.random() - 1) * Math.min(9, 3 + length * .22);
        const c1 = { x: point.x + chord.x*rnd(.22,.42) + nx*bend, y: point.y + chord.y*rnd(.22,.42) + ny*bend };
        const c2 = { x: point.x + chord.x*rnd(.58,.78) - nx*bend*rnd(.35,.8), y: point.y + chord.y*rnd(.58,.78) - ny*bend*rnd(.35,.8) };
        path = { start: { ...point }, c1, c2, end, startTime: now, duration: randomMoveDuration() };
    }

    async function addRecord(type) {
        const ts = Date.now(), name = partnerName();
        const text = type === 'near' ? `${name}出现在附近。` : `${name}离开了附近。`;
        const item = { id: `dist_${ts}_${Math.random().toString(36).slice(2,7)}`, ts, expiresAt: ts + TTL, type, text };
        records.unshift(item);
        await write('distanceRecords', records);
        renderRecords();
        if (typeof window.addCompanionDiaryEntry === 'function') {
            Promise.resolve(window.addCompanionDiaryEntry({ id: 'diary_' + item.id, ts, mode: 'distance', kind: 'distance', eventType: type, eventText: text, initiator: 'system', partnerNote: text, userNote: '' }))
                .catch(error => console.warn('[distance] 陪伴日记同步失败', error));
        }
    }
    async function pruneRecords(forceSave) {
        if (!loaded) return;
        const now = Date.now(), before = records.length;
        records = records.filter(item => item && Number(item.ts) && Number(item.expiresAt || (Number(item.ts) + TTL)) > now);
        if (forceSave || records.length !== before) await write('distanceRecords', records);
        renderRecords();
    }
    function recordTime(ts) {
        const date = new Date(ts), now = new Date();
        const time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        if (date.toDateString() === now.toDateString()) return time;
        const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return '昨天 ' + time;
        return `${date.getMonth()+1}/${date.getDate()} ${time}`;
    }
    function renderRecords() {
        const list = $('dist-record-list'); if (!list) return;
        if (!records.length) { list.innerHTML = '<div class="dist-record-empty">还没有新的靠近记录。</div>'; return; }
        list.innerHTML = records.map(item => `<div class="dist-record-item"><span class="dist-record-time">${escapeHtml(recordTime(item.ts))}</span><span class="dist-record-text">${escapeHtml(item.text)}</span></div>`).join('');
    }

    function setPosition(position, emit) {
        const character = $('dist-char'); if (!character) return;
        character.style.left = position.x + '%'; character.style.top = position.y + '%';
        const previous = near;
        near = radiusOf(position) <= NEAR_RADIUS;
        if (emit && near !== previous) addRecord(near ? 'near' : 'leave');
        character.classList.toggle('visible', near);
    }
    function formatDirectionLabel(label) {
        return ({ 前:'前方',后:'后方',左:'左侧',右:'右侧',东:'东侧',西:'西侧',南:'南侧',北:'北侧' })[label] || `${label}侧`;
    }
    function proximityFactor() {
        return Math.pow(1 - clamp((radiusOf(point) - 7.5) / (MAX_RADIUS - 7.5), 0, 1), .82);
    }
    function directionText() {
        if (!near) {
            if (intensity < .30) return '暂时感知不到';
            if (intensity < .62) return '不在身边，但偶尔能察觉到他的存在';
            if (touchSignal && intensity >= .72) return '隔着一段距离，也会偶尔传来很轻的触碰感';
            return '似乎隔着一段距离也能感觉到他';
        }
        const angle = (Math.atan2(point.y - 50, point.x - 50) * 180 / Math.PI + 360) % 360;
        const labels = preferences.directionMode === 'cardinal' ? ['东','东南','南','西南','西','西北','北','东北'] : ['右','后右','后','后左','左','前左','前','前右'];
        return `在${formatDirectionLabel(labels[Math.round(angle / 45) % 8])}`;
    }
    function intensityPhrase(value) {
        if (!near) {
            if (value < .18) return '很淡，像什么也没有留下';
            if (value < .36) return '偶尔会掠过一点若有若无的存在感';
            if (value < .56) return '隔着距离也能隐约察觉到他';
            if (touchSignal && value < .76) return '偶尔会有一瞬很轻的触碰越过距离传来';
            if (value < .76) return '距离没有完全盖住他的存在感';
            return touchSignal ? '明明不在身边，触碰感却会突然变得很清晰' : '隔得很远，感知却仍然鲜明得不太讲道理';
        }
        if (value < .12) return '很轻，像只是安静待在一旁';
        if (value < .24) return '微微拂过，存在感刚好能被察觉';
        if (value < .38) return touchSignal ? '像指尖轻轻碰过衣角' : '贴得近了些，但还没有明显触碰';
        if (value < .54) return touchSignal ? '轻轻的触碰变得清晰' : '存在感已经很近，像就在身边';
        if (value < .72) return touchSignal ? '偏强，像被轻轻抱住一样' : '靠得很近，气息和存在都很明显';
        if (value < .88) return touchSignal ? '很强，拥抱或亲昵触碰都变得清晰' : '感知很强，几乎无法忽略他的存在';
        return touchSignal ? '过于鲜明，像整个人都被他包围住' : '存在感浓得几乎贴在身上';
    }
    function linkPhrase(value) {
        if (value < .14) return '极弱，几乎断线'; if (value < .28) return '偏弱，讯号断续';
        if (value < .44) return '时明时暗，还不太稳定'; if (value < .62) return '中等，能感到但不算清晰';
        if (value < .78) return '稳定，回应也更顺畅'; if (value < .92) return '很强，感知会持续贴近';
        return '极强，像始终和你连在一起';
    }
    function updateSenses(now) {
        if (now >= nextLinkShift) { linkStrength = clamp(linkStrength + (Math.random()+Math.random()-1)*.52, 0, 1); nextLinkShift = now + randomWait(52000, 18000); }
        if (now >= nextIntensityShift) {
            const distance = proximityFactor();
            intensity = clamp(Math.random()*.60 + distance*.25 + linkStrength*.15, 0, 1);
            touchSignal = Math.random() < clamp(.018 + Math.pow(distance,1.45)*.25 + linkStrength*.10, .018, .34);
            nextIntensityShift = now + randomWait(17000, 5000);
        }
        if ($('dist-direction-value')) $('dist-direction-value').textContent = directionText();
        if ($('dist-intensity-value')) $('dist-intensity-value').textContent = intensityPhrase(intensity);
        if ($('dist-link-value')) $('dist-link-value').textContent = linkPhrase(linkStrength);
        if ($('dist-intensity-fill')) $('dist-intensity-fill').style.width = Math.round(intensity*100) + '%';
        if ($('dist-link-fill')) $('dist-link-fill').style.width = Math.round(linkStrength*100) + '%';
    }
    function tick(now) {
        if (!pageOpen) { raf = 0; return; }
        if (now >= pauseUntil && !path) buildPath(now);
        if (path) {
            const raw = clamp((now - path.startTime) / path.duration, 0, 1), eased = raw*raw*(3-2*raw);
            point = cubic(path.start, path.c1, path.c2, path.end, eased);
            point.x += Math.sin(now/1570)*.08 + Math.sin(now/830)*.035;
            point.y += Math.cos(now/1730)*.08 + Math.cos(now/910)*.035;
            setPosition(point, true);
            if (raw >= 1) { path = null; pauseUntil = now + randomHoldDuration(); }
        }
        updateSenses(Date.now());
        raf = requestAnimationFrame(tick);
    }

    function updateDirectionLabels() {
        const text = preferences.directionMode === 'cardinal' ? '东西南北' : '前后左右';
        if ($('dist-direction-label')) $('dist-direction-label').textContent = text;
        if ($('dist-direction-sub')) $('dist-direction-sub').textContent = `当前：${text}`;
    }
    function bindEvents() {
        $('distance-btn')?.addEventListener('click', openDistance);
        $('dist-back')?.addEventListener('click', closeDistance);
        $('dist-gear')?.addEventListener('click', event => { event.stopPropagation(); $('dist-settings')?.classList.toggle('show'); });
        $('dist-settings')?.addEventListener('click', event => event.stopPropagation());
        document.addEventListener('click', () => $('dist-settings')?.classList.remove('show'));
        $('dist-avatar-toggle')?.addEventListener('click', () => { preferences.showAvatar = !preferences.showAvatar; applyPreferences(); savePreferences(); });
        $('dist-my-avatar-toggle')?.addEventListener('click', () => { preferences.showMyAvatar = !preferences.showMyAvatar; applyPreferences(); savePreferences(); });
        $('dist-name-toggle')?.addEventListener('click', () => { preferences.showNames = preferences.showNames === false; applyPreferences(); savePreferences(); });
        $('dist-direction-btn')?.addEventListener('click', () => { preferences.directionMode = preferences.directionMode === 'cardinal' ? 'relative' : 'cardinal'; applyPreferences(); savePreferences(); updateSenses(Date.now()); });
        $('dist-panel-collapse')?.addEventListener('click', () => { preferences.panelCollapsed = !preferences.panelCollapsed; applyPreferences(); savePreferences(); });
        document.addEventListener('keydown', event => { if (event.key === 'Escape' && pageOpen) closeDistance(); });
    }

    async function init() {
        injectPage(); bindEvents();
        setInterval(() => pruneRecords(false), 60 * 1000);
        window.DistanceFeature = { open: openDistance, close: closeDistance, pruneRecords };
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
