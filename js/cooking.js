/* 家 · 做饭
 * 纯前端、纯概率。评价文字只取自现有字卡库；菜谱与食材均为 JSON 配置。
 */
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const rand = (min, max) => min + Math.random() * (max - min);
    const pick = list => list && list.length ? list[Math.floor(Math.random() * list.length)] : null;
    const escapeHtml = value => {
        const box = document.createElement('div');
        box.textContent = String(value == null ? '' : value);
        return box.innerHTML;
    };
    const nowTime = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const discreteUnits = new Set(['个', '颗', '根', '瓣', '块', '片', '勺', '只', '朵']);
    const cutOptions = ['块', '片', '丁', '丝', '段', '碎末', '打散', '整颗'];
    const storageNames = {
        all: '全部', fridge_fresh: '冰箱 · 保鲜层', freezer: '冰箱 · 冷冻层',
        pantry_vegetable: '储藏室 · 蔬菜筐', pantry_staple: '储藏室 · 主食架',
        pantry_dry: '储藏室 · 干货架', pantry_seasoning: '储藏室 · 调料架', pantry_sauce: '储藏室 · 酱料与油'
    };
    const stepNames = { add: '加入食材', heat: '热锅', boil: '煮', steam: '蒸', stirFry: '翻炒', season: '调味', serve: '出锅' };
    const heatNames = { high: '大火', medium: '中火', low: '小火' };
    const modeNames = { solo_user: '独自料理', solo_partner: '对方料理', together: '一起料理' };
    const SESSION_VERSION = 1;

    let ingredients = [];
    let baseIngredients = [];
    let customIngredients = [];
    let recipes = [];
    let baseRecipes = [];
    let customRecipes = [];
    let history = [];
    let session = null;
    let pendingMode = 'solo_user';
    let pendingRecipe = null;
    let currentView = 'home';
    let storageFilter = 'all';
    let ingredientQuery = '';
    let recipeQuery = '';
    let recipeCategory = 'all';
    let tempAmounts = {};
    let managerTab = 'list';
    let managerDraft = null;
    let globalAssets = { myGood: '', myBad: '', partnerGood: '', partnerBad: '' };
    let selectedTasteMessageId = null;
    let selectedTasteStars = 0;
    let timers = { auto: null, clock: null, hold: null, stirPrompt: null, toast: null };
    let autoScheduleAnchor = null;

    function storageKey(name) {
        try {
            if (typeof getStorageKey === 'function') return getStorageKey('cooking_' + name);
        } catch (_) {}
        return 'CHUANXUN_COOKING_' + name;
    }
    async function readStore(name, fallback) {
        try {
            if (window.localforage) {
                const value = await localforage.getItem(storageKey(name));
                return value == null ? fallback : value;
            }
            const raw = localStorage.getItem(storageKey(name));
            return raw == null ? fallback : JSON.parse(raw);
        } catch (_) { return fallback; }
    }
    function writeStore(name, value) {
        try {
            if (window.localforage) return localforage.setItem(storageKey(name), value);
            localStorage.setItem(storageKey(name), JSON.stringify(value));
        } catch (error) { console.warn('[cooking] 保存失败', error); }
    }
    function saveSession() { writeStore('session', session); }
    function saveHistory() { writeStore('history', history); }
    function notify(text, type) {
        if (typeof showNotification === 'function') showNotification(text, type || 'info', 2400);
    }
    function getPartnerName() {
        try { return (typeof settings === 'object' && settings.partnerName) || '对方'; } catch (_) { return '对方'; }
    }
    function getMyName() {
        try { return (typeof settings === 'object' && settings.myName) || '我'; } catch (_) { return '我'; }
    }
    function getRecipe(id) { return recipes.find(item => item.id === id) || null; }
    function getIngredient(id) { return ingredients.find(item => item.id === id) || { id, name: id, icon: '🥣', storage: 'pantry_dry', defaultUnit: '个' }; }
    function mergeById(base, custom) {
        const map = new Map((base || []).map(item => [item.id, item]));
        (custom || []).forEach(item => map.set(item.id, item));
        return [...map.values()];
    }
    async function loadConfigs() {
        try {
            const [ingRes, recipeRes] = await Promise.all([
                fetch('data/cooking-ingredients.json', { cache: 'no-store' }),
                fetch('data/cooking-recipes.json', { cache: 'no-store' })
            ]);
            baseIngredients = await ingRes.json();
            baseRecipes = await recipeRes.json();
        } catch (error) {
            console.warn('[cooking] JSON 读取失败，使用最小备用配置', error);
            baseIngredients = [
                { id: 'egg', name: '鸡蛋', category: 'egg', storage: 'fridge_fresh', defaultUnit: '个', icon: '🥚' },
                { id: 'water', name: '水', category: 'liquid', storage: 'pantry_sauce', defaultUnit: 'ml', icon: '💧' },
                { id: 'salt', name: '盐', category: 'seasoning', storage: 'pantry_seasoning', defaultUnit: 'g', icon: '🧂' }
            ];
            baseRecipes = [{ id: 'steamed_egg', name: '蒸水蛋', category: '蒸菜', difficulty: 1, assets: {}, ingredients: [
                { id: 'egg', amount: 2, unit: '个', prep: '打散' }, { id: 'water', amount: 200, unit: 'ml', tolerance: 20 }, { id: 'salt', amount: 2, unit: 'g', tolerance: 1, seasoning: true }
            ], steps: [{ type: 'add', ingredients: ['egg', 'water'] }, { type: 'steam', heat: 'medium', minutes: 12 }, { type: 'season', ingredients: ['salt'] }, { type: 'serve' }] }];
        }
        customIngredients = await readStore('customIngredients', []);
        customRecipes = await readStore('customRecipes', []);
        globalAssets = Object.assign(globalAssets, await readStore('globalAssets', {}));
        history = await readStore('history', []);
        session = await readStore('session', null);
        ingredients = mergeById(baseIngredients, customIngredients);
        recipes = mergeById(baseRecipes, customRecipes);
        if (session && session.version !== SESSION_VERSION) session = null;
    }

    function injectPage() {
        if ($('cooking-page')) return;
        const page = document.createElement('section');
        page.id = 'cooking-page';
        page.setAttribute('aria-hidden', 'true');
        page.innerHTML = `
            <header class="cook-topbar">
                <button class="cook-icon-btn" id="cook-back" title="返回"><i class="fas fa-chevron-left"></i></button>
                <div class="cook-top-title"><b id="cook-top-title">做饭</b><small id="cook-top-sub">两个人的小厨房</small></div>
                <button class="cook-icon-btn" id="cook-manage" title="菜谱管理"><i class="fas fa-book-open"></i></button>
            </header>
            <main class="cook-shell" id="cook-shell"></main>`;
        document.body.appendChild(page);

        const toast = document.createElement('div');
        toast.id = 'cook-toast';
        toast.className = 'cook-toast';
        toast.innerHTML = '<i class="fas fa-kitchen-set"></i><div><b id="cook-toast-title"></b><small id="cook-toast-sub"></small></div><button id="cook-toast-go">去看看</button>';
        document.body.appendChild(toast);

        const taste = document.createElement('div');
        taste.id = 'cook-taste-modal';
        taste.className = 'modal';
        taste.innerHTML = `<div class="modal-content cook-taste-modal"><div class="modal-title"><i class="fas fa-utensils"></i><span>品尝料理</span></div>
            <div class="cook-rating" id="cook-rating">${[1,2,3,4,5].map(n => `<button data-star="${n}">★</button>`).join('')}</div>
            <textarea class="modal-textarea" id="cook-comment" rows="3" placeholder="写下你的评论（可以不填）"></textarea>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="cook-taste-cancel">取消</button><button class="modal-btn modal-btn-primary" id="cook-taste-send">确认评价</button></div></div>`;
        document.body.appendChild(taste);

        const resultView = document.createElement('section');
        resultView.id = 'cook-result-view';
        resultView.className = 'cook-result-view';
        resultView.setAttribute('aria-hidden', 'true');
        resultView.innerHTML = `<header class="cook-topbar"><button class="cook-icon-btn" id="cook-result-view-close" title="返回"><i class="fas fa-chevron-left"></i></button><div class="cook-top-title"><b>料理结算</b><small>我们的厨房</small></div><span></span></header><main id="cook-result-view-body" class="cook-result-view-body"></main>`;
        document.body.appendChild(resultView);

        const manager = document.createElement('div');
        manager.id = 'cook-manager-modal';
        manager.className = 'modal';
        manager.innerHTML = `<div class="modal-content cook-manager"><div class="modal-title"><i class="fas fa-book-open"></i><span>菜谱管理</span></div>
            <div class="cook-manager-tabs"><button data-manager-tab="list" class="active">菜谱</button><button data-manager-tab="edit">新建菜谱</button><button data-manager-tab="ingredients">食材库</button><button data-manager-tab="assets">结算图片</button></div>
            <div class="cook-manager-body" id="cook-manager-body"></div>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="cook-import-btn">导入 JSON</button><button class="modal-btn modal-btn-secondary" id="cook-export-btn">导出 JSON</button><button class="modal-btn modal-btn-secondary" id="cook-manager-close">关闭</button></div>
            <input type="file" id="cook-json-input" accept="application/json,.json" hidden></div>`;
        document.body.appendChild(manager);

        const list = document.querySelector('#advanced-modal .settings-item-list');
        if (list && !$('cooking-recipe-function')) {
            const item = document.createElement('div');
            item.className = 'settings-item';
            item.id = 'cooking-recipe-function';
            item.innerHTML = '<i class="fas fa-kitchen-set"></i><span>菜谱管理</span>';
            list.appendChild(item);
        }
    }

    function bindBaseEvents() {
        $('cooking-room-entry')?.addEventListener('click', openCooking);
        $('cook-back')?.addEventListener('click', goBack);
        $('cook-manage')?.addEventListener('click', openManager);
        $('cooking-recipe-function')?.addEventListener('click', () => {
            if (typeof hideModal === 'function') hideModal($('advanced-modal'));
            openManager();
        });
        $('cook-manager-close')?.addEventListener('click', () => {
            if (typeof hideModal === 'function') hideModal($('cook-manager-modal'));
            else $('cook-manager-modal').style.display = 'none';
        });
        document.querySelectorAll('[data-manager-tab]').forEach(btn => btn.addEventListener('click', () => {
            managerTab = btn.dataset.managerTab;
            document.querySelectorAll('[data-manager-tab]').forEach(x => x.classList.toggle('active', x === btn));
            renderManager();
        }));
        $('cook-export-btn')?.addEventListener('click', exportConfigs);
        $('cook-import-btn')?.addEventListener('click', () => $('cook-json-input')?.click());
        $('cook-json-input')?.addEventListener('change', importConfigs);
        $('cook-taste-cancel')?.addEventListener('click', closeTaste);
        $('cook-taste-send')?.addEventListener('click', submitTaste);
        $('cook-result-view-close')?.addEventListener('click', closeResultView);
        $('cook-rating')?.addEventListener('click', event => {
            const btn = event.target.closest('[data-star]');
            if (!btn) return;
            selectedTasteStars = Number(btn.dataset.star);
            document.querySelectorAll('#cook-rating [data-star]').forEach(star => star.classList.toggle('on', Number(star.dataset.star) <= selectedTasteStars));
        });
        $('cook-toast-go')?.addEventListener('click', () => {
            hideCookingToast();
            openCooking();
            if (session && session.mode === 'solo_partner') renderStage();
        });
    }

    function openCooking() {
        runPartnerEngine();
        const home = $('home-page');
        home?.classList.remove('active');
        home?.setAttribute('aria-hidden', 'true');
        const page = $('cooking-page');
        page.classList.add('active');
        page.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        currentView = 'home';
        renderHome();
        rollPartnerCooking();
    }
    function closeCooking() {
        clearClock();
        if(timers.hold){clearInterval(timers.hold);timers.hold=null;}
        const page = $('cooking-page');
        page.classList.remove('active');
        page.setAttribute('aria-hidden', 'true');
        const home = $('home-page');
        home?.classList.add('active');
        home?.setAttribute('aria-hidden', 'false');
    }
    function goBack() {
        if (currentView === 'home') { closeCooking(); return; }
        if (session && session.stage !== 'result' && ['collect','prep','cook'].includes(session.stage)) {
            renderHome();
            return;
        }
        renderHome();
    }
    function setHeader(title, sub) {
        $('cook-top-title').textContent = title;
        $('cook-top-sub').textContent = sub || '两个人的小厨房';
    }
    function setShell(html) {
        $('cook-shell').innerHTML = html;
        setTimeout(bindDynamicEvents, 0);
    }

    function renderHome() {
        if(timers.hold){clearInterval(timers.hold);timers.hold=null;}
        currentView = 'home';
        setHeader('做饭', '两个人的小厨房');
        const live = session && session.mode === 'solo_partner' && session.stage !== 'result';
        const pendingResult = session && session.stage === 'result' && !session.sentMessageId;
        const resume = session && session.stage !== 'result' ? `<button class="cook-resume" id="cook-resume"><i class="fas fa-clock-rotate-left"></i><div><b>继续做饭</b><small>${escapeHtml(getRecipe(session.recipeId)?.name || '未完成的料理')} · ${escapeHtml(modeNames[session.mode])}</small></div><i class="fas fa-chevron-right"></i></button>` : '';
        const pending = pendingResult ? `<div class="cook-pending-result"><div><span>待发送料理</span><b>${escapeHtml(getRecipe(session.recipeId)?.name || '料理')}</b><small>完成度 ${session.result?.total || 0}% · 结算已经替你保留</small></div><div><button class="cook-secondary" id="cook-pending-view">查看结算</button><button class="cook-primary" id="cook-pending-send">发送到聊天</button><button class="cook-secondary" id="cook-pending-archive">只收进记录</button></div></div>` : '';
        setShell(`${resume}${pending}<div class="cook-kicker">TODAY'S KITCHEN</div><h2 class="cook-section-title">今天要怎么做？</h2><p class="cook-section-sub">所有结果由你的操作与随机概率共同决定。</p>
            <div class="cook-mode-grid">
                <button class="cook-mode-card" data-cook-mode="solo_user" ${pendingResult?'disabled':''}><i class="fas fa-user"></i><b>我来做</b><small>自己完成取材、备菜和料理。</small></button>
                <button class="cook-mode-card ${live ? 'live' : ''}" data-cook-mode="${live ? 'watch' : 'invite_partner'}" ${pendingResult?'disabled':''}><i class="fas fa-eye"></i><b>${live ? getPartnerName() + '正在做饭' : '邀请对方做'}</b><small>${live ? '料理已经开始，可以进去围观。' : '邀请对方掌勺，你只能围观和发表情。'}</small></button>
                <button class="cook-mode-card" data-cook-mode="together" ${pendingResult?'disabled':''}><i class="fas fa-hands"></i><b>一起做</b><small>每张完整操作卡轮流完成。</small></button>
            </div>
            <div class="cook-home-tools"><button id="cook-browse-recipes"><i class="fas fa-book"></i> 菜谱</button><button id="cook-open-manager"><i class="fas fa-sliders"></i> 菜谱管理</button><button id="cook-open-history"><i class="fas fa-utensils"></i> 我们的厨房</button></div>`);
        $('cook-resume')?.addEventListener('click', renderStage);
        $('cook-pending-view')?.addEventListener('click', renderResult);
        $('cook-pending-send')?.addEventListener('click', () => sendResultToChat(false));
        $('cook-pending-archive')?.addEventListener('click', archiveAndReset);
        document.querySelectorAll('[data-cook-mode]').forEach(btn => btn.addEventListener('click', () => {
            const mode = btn.dataset.cookMode;
            if (mode === 'watch') return renderStage();
            pendingMode = mode;
            renderRecipeList();
        }));
        $('cook-browse-recipes')?.addEventListener('click', () => { pendingMode = 'browse'; renderRecipeList(); });
        $('cook-open-manager')?.addEventListener('click', openManager);
        $('cook-open-history')?.addEventListener('click', renderHistory);
    }

    function renderRecipeList() {
        currentView = 'recipes';
        setHeader('选择菜谱', pendingMode === 'browse' ? '查看现有菜谱' : modeNames[pendingMode === 'invite_partner' ? 'solo_partner' : pendingMode]);
        const categories = ['all', ...new Set(recipes.map(item => item.category || '其他'))];
        const filtered = recipes.filter(item => (recipeCategory === 'all' || item.category === recipeCategory) && (!recipeQuery || item.name.toLowerCase().includes(recipeQuery.toLowerCase())));
        setShell(`<div class="cook-kicker">RECIPE BOOK</div><h2 class="cook-section-title">选一道想做的菜</h2>
            <div class="cook-recipe-toolbar"><input class="cook-search" id="cook-recipe-search" value="${escapeHtml(recipeQuery)}" placeholder="搜索菜名"><select class="cook-filter" id="cook-recipe-category">${categories.map(c => `<option value="${escapeHtml(c)}" ${c === recipeCategory ? 'selected' : ''}>${escapeHtml(c === 'all' ? '全部分类' : c)}</option>`).join('')}</select></div>
            <div class="cook-recipe-grid">${filtered.map(recipeCardHtml).join('') || '<p class="cook-section-sub">没有找到菜谱。</p>'}</div>`);
        $('cook-recipe-search')?.addEventListener('input', event => { recipeQuery = event.target.value; renderRecipeList(); });
        $('cook-recipe-category')?.addEventListener('change', event => { recipeCategory = event.target.value; renderRecipeList(); });
        document.querySelectorAll('[data-recipe-id]').forEach(card => card.addEventListener('click', () => renderRecipeDetail(card.dataset.recipeId)));
    }
    function recipeCardHtml(recipe) {
        const art = recipe.assets?.dish ? `<img src="${escapeHtml(recipe.assets.dish)}" alt="">` : '🍲';
        return `<button class="cook-recipe-card" data-recipe-id="${escapeHtml(recipe.id)}"><span class="cook-recipe-art">${art}</span><span class="cook-recipe-info"><b>${escapeHtml(recipe.name)}</b><small>${escapeHtml(recipe.category || '其他')} · ${recipe.steps?.length || 0} 个步骤</small><span class="cook-stars">${'★'.repeat(clamp(Number(recipe.difficulty) || 1,1,5))}${'☆'.repeat(5-clamp(Number(recipe.difficulty) || 1,1,5))}</span></span><i class="fas fa-chevron-right"></i></button>`;
    }
    function renderRecipeDetail(id) {
        const recipe = getRecipe(id); if (!recipe) return;
        pendingRecipe = recipe;
        currentView = 'recipe-detail';
        setHeader(recipe.name, recipe.category || '菜谱');
        const buttonText = pendingMode === 'browse' ? '返回菜谱' : pendingMode === 'solo_user' ? '开始准备食材' : pendingMode === 'together' ? '邀请对方一起做' : '邀请对方来做';
        setShell(`<div class="cook-recipe-detail"><div class="cook-kicker">RECIPE DETAIL</div><h2 class="cook-section-title">${escapeHtml(recipe.name)}</h2><p class="cook-section-sub">难度 ${'★'.repeat(recipe.difficulty || 1)} · ${recipe.steps.length} 个料理步骤 · ${recipe.ingredients.length} 种食材</p>
            <div class="cook-required-list">${recipe.ingredients.map(req => { const ing=getIngredient(req.id); return `<div class="cook-required-item"><span>${ing.icon || '🥣'}</span><span>${escapeHtml(ing.name)}</span><b>${escapeHtml(req.amount)}${escapeHtml(req.unit)}</b></div>`; }).join('')}</div>
            <div class="cook-actions"><button class="cook-secondary" id="cook-detail-back">返回</button><button class="cook-primary" id="cook-detail-start">${buttonText}</button></div></div>`);
        $('cook-detail-back')?.addEventListener('click', renderRecipeList);
        $('cook-detail-start')?.addEventListener('click', () => {
            if (pendingMode === 'browse') return renderRecipeList();
            if (pendingMode === 'solo_user') return startSession('solo_user', recipe.id);
            requestCookingInvite(pendingMode, recipe.id);
        });
    }

    function requestCookingInvite(mode, recipeId) {
        const together = mode === 'together';
        notify('邀请已经发送，正在等待回应', 'info');
        const wait = 1800 + Math.random() * 2600;
        setTimeout(() => {
            if (Math.random() < .82) {
                notify('对方接受了做饭邀请', 'success');
                startSession(together ? 'together' : 'solo_partner', recipeId, true);
            } else {
                notify('这次邀请没有约成', 'info');
                renderHome();
            }
        }, wait);
    }

    function makeMetrics() { return { ingredient: [], prep: [], heat: [], operation: [], seasoning: [] }; }
    function startSession(mode, recipeId, invited) {
        clearAllTimers();
        const recipe = getRecipe(recipeId); if (!recipe) return;
        session = {
            version: SESSION_VERSION, id: 'cook_' + Date.now(), mode, recipeId, invited: !!invited,
            stage: 'collect', currentStep: 0, currentPrep: 0, turnIndex: 0,
            collected: {}, prep: {}, stepProgress: {}, metrics: makeMetrics(), logs: [],
            partnerDueAt: null,
            spectatorJoined: mode === 'solo_partner', spectatorJoinAt: mode === 'solo_user' && Math.random() < .6 ? rand(.1,.7) : null,
            startedAt: Date.now(), finishedAt: null, result: null
        };
        tempAmounts = {};
        addLog(mode === 'together' ? '共同料理开始' : mode === 'solo_partner' ? getPartnerName() + '开始准备料理' : getMyName() + '开始准备料理');
        saveSession();
        renderStage();
    }
    function addLog(text) {
        if (!session) return;
        session.logs.push({ time: nowTime(), text: String(text) });
        if (session.logs.length > 80) session.logs = session.logs.slice(-80);
        saveSession();
        const liveList = document.querySelector('#cooking-page.active .cook-log-list');
        if (liveList) {
            liveList.innerHTML = session.logs.map(row => `<div class="cook-log-row"><time>${escapeHtml(row.time)}</time><span>${escapeHtml(row.text)}</span></div>`).join('');
            liveList.scrollTop = liveList.scrollHeight;
        }
    }
    function addMetric(name, score) {
        session.metrics[name] = session.metrics[name] || [];
        session.metrics[name].push(clamp(Math.round(score), 0, 100));
    }
    function avg(values, fallback) { return values && values.length ? values.reduce((a,b)=>a+b,0)/values.length : fallback; }
    function partnerStepScore() { return Math.random() < .99 ? Math.round(rand(96,101)) : Math.round(rand(42,76)); }
    function activeOwner() {
        if (!session) return 'user';
        if (session.mode === 'solo_partner') return 'partner';
        if (session.mode === 'solo_user') return 'user';
        return session.turnIndex % 2 === 0 ? 'user' : 'partner';
    }
    function ownerLabel() { return activeOwner() === 'user' ? '轮到你操作' : '轮到' + getPartnerName() + '操作'; }
    function advanceTurn() { if (session.mode === 'together') session.turnIndex++; }
    function recipeProgress() {
        const recipe = getRecipe(session.recipeId);
        const collectDone = Object.keys(session.collected).length;
        const prepDone = Object.keys(session.prep).length;
        const total = recipe.ingredients.filter(x=>!x.optional).length + recipe.ingredients.filter(x=>x.prep).length + recipe.steps.length;
        const done = collectDone + prepDone + session.currentStep;
        return total ? done / total : 0;
    }
    function maybeJoinSpectator() {
        if (!session || session.mode !== 'solo_user' || session.spectatorJoined || session.spectatorJoinAt == null) return;
        if (recipeProgress() >= session.spectatorJoinAt) {
            session.spectatorJoined = true;
            addLog(getPartnerName() + '来到厨房旁边围观');
            showCookingToast(getPartnerName() + '来围观了', '现在只能看着你做，并偶尔发表情', false);
        }
    }
    function maybePartnerSticker() {
        if (!session?.spectatorJoined || session.mode !== 'solo_user' || Math.random() >= .15) return;
        let pool = [];
        try { if (typeof stickerLibrary !== 'undefined' && Array.isArray(stickerLibrary)) pool = stickerLibrary; } catch (_) {}
        floatSticker(pick(pool) || pick(['❤️','👏','👀','😋','😂','🥺']));
    }

    function renderStage() {
        if (!session) return renderHome();
        currentView = 'stage';
        if (session.stage === 'collect') renderCollect();
        else if (session.stage === 'prep') renderPrep();
        else if (session.stage === 'cook') renderCookingStep();
        else if (session.stage === 'result') renderResult();
        scheduleAuto();
    }
    function stageLayout(main, side) {
        const spectator = session.spectatorJoined ? `<div class="cook-spectator-strip">${avatarHtml(session.mode === 'solo_partner' ? true : false)}<span>${session.mode === 'solo_partner' ? '你正在围观，不能发言' : getPartnerName() + '正在围观'}</span></div>` : '';
        return `<div class="cook-stage-layout"><section class="cook-stage-main">${spectator}${main}${session.mode === 'solo_partner' ? spectatorDockHtml() : ''}</section>${side}</div>`;
    }
    function avatarHtml(user) {
        const root = document.getElementById(user ? 'user-avatar' : 'partner-avatar');
        const src = root?.querySelector('img')?.src;
        return src ? `<img src="${escapeHtml(src)}" alt="">` : '<span>👀</span>';
    }
    function logCardHtml() {
        return `<aside class="cook-log-card"><div class="cook-side-title"><span>料理记录</span><b>${session.logs.length}</b></div><div class="cook-log-list">${session.logs.map(row => `<div class="cook-log-row"><time>${escapeHtml(row.time)}</time><span>${escapeHtml(row.text)}</span></div>`).join('')}</div></aside>`;
    }
    function checklistHtml(recipe) {
        const required = recipe.ingredients.filter(item => !item.optional);
        const done = required.filter(item => session.collected[item.id] != null).length;
        return `<aside class="cook-checklist"><div class="cook-side-title"><span>食品清单</span><b>${done} / ${required.length}</b></div>${recipe.ingredients.map(req => { const ing=getIngredient(req.id), ok=session.collected[req.id] != null; return `<div class="cook-check-row ${ok?'done':''}"><i class="fas ${ok?'fa-circle-check':'fa-circle'}"></i><span>${escapeHtml(ing.name)}</span><b>${escapeHtml(req.amount)}${escapeHtml(req.unit)}</b></div>`; }).join('')}</aside>`;
    }
    function nextCollectRequirement(recipe) { return recipe.ingredients.find(req => !req.optional && session.collected[req.id] == null) || recipe.ingredients.find(req => req.optional && session.collected[req.id] == null) || null; }
    function allCollected(recipe) { return recipe.ingredients.filter(x=>!x.optional).every(req => session.collected[req.id] != null); }

    function renderCollect() {
        clearClock();
        const recipe = getRecipe(session.recipeId); if (!recipe) return;
        setHeader('准备食材', recipe.name + ' · ' + ownerLabel());
        const next = nextCollectRequirement(recipe);
        const storages = ['all', ...new Set(recipe.ingredients.map(req => getIngredient(req.id).storage))];
        const visible = recipe.ingredients.filter(req => {
            const ing = getIngredient(req.id);
            return (storageFilter === 'all' || ing.storage === storageFilter) && (!ingredientQuery || ing.name.includes(ingredientQuery));
        });
        const hint = `<div class="cook-step-hint"><b>${next ? ownerLabel() + '：取出' + getIngredient(next.id).name : '食材已经准备完成'}</b><span>可以搜索食材；数量错误不会立刻提示，只会影响结算。</span></div>`;
        const main = `${hint}<div class="cook-recipe-toolbar"><input class="cook-search" id="cook-ing-search" value="${escapeHtml(ingredientQuery)}" placeholder="搜索食材"></div><div class="cook-storage-tabs">${storages.map(s => `<button data-storage="${s}" class="${s===storageFilter?'active':''}">${escapeHtml(storageNames[s] || s)}</button>`).join('')}</div><div class="cook-ingredient-grid">${visible.map(req => ingredientCardHtml(req, next)).join('')}</div>${allCollected(recipe) && activeOwner() === 'user' ? '<div class="cook-actions"><button class="cook-primary" id="cook-start-prep">开始备菜</button></div>' : ''}`;
        const side = session.mode === 'solo_partner' || session.spectatorJoined ? logCardHtml() : checklistHtml(recipe);
        setShell(stageLayout(main, side));
        $('cook-ing-search')?.addEventListener('input', event => { ingredientQuery = event.target.value; renderCollect(); });
        document.querySelectorAll('[data-storage]').forEach(btn => btn.addEventListener('click', () => { storageFilter = btn.dataset.storage; renderCollect(); }));
        bindIngredientCards(recipe, next);
        $('cook-start-prep')?.addEventListener('click', beginPrep);
    }
    function ingredientCardHtml(req, next) {
        const ing = getIngredient(req.id);
        const amount = tempAmounts[req.id] ?? session.collected[req.id] ?? 0;
        const continuous = !discreteUnits.has(req.unit);
        const enabled = activeOwner() === 'user' && (session.mode !== 'together' || next?.id === req.id) && session.collected[req.id] == null;
        const max = Math.max(Number(req.amount) * 1.5, Number(req.amount) + 20, 10);
        const tol = Number(req.tolerance) || Math.max(1, Number(req.amount) * .08);
        const left = clamp((Number(req.amount)-tol)/max*100,0,100), width=clamp(tol*2/max*100,2,100-left);
        return `<article class="cook-ingredient-card" data-ing-card="${escapeHtml(req.id)}"><div class="cook-ingredient-head"><span class="ico">${ing.icon||'🥣'}</span><div><b>${escapeHtml(ing.name)}</b><small>${escapeHtml(storageNames[ing.storage]||ing.storage)} · 需要 ${escapeHtml(req.amount)}${escapeHtml(req.unit)}</small></div>${session.collected[req.id] != null ? '<i class="fas fa-circle-check" style="color:var(--accent-color)"></i>' : ''}</div>
            ${continuous ? `<div class="cook-measure-track"><i class="cook-measure-target" style="left:${left}%;width:${width}%"></i><i class="cook-measure-fill" style="width:${clamp(amount/max*100,0,100)}%"></i><i class="cook-measure-pointer" style="left:${clamp(amount/max*100,0,100)}%"></i></div><button class="cook-hold-btn" data-measure="${escapeHtml(req.id)}" ${enabled?'':'disabled'}>点击开始 · <span>${Math.round(amount)}</span>${escapeHtml(req.unit)}</button>` : `<div class="cook-qty-row"><button data-qty="minus" ${enabled?'':'disabled'}>−</button><strong><span>${amount}</span> ${escapeHtml(req.unit)}</strong><button data-qty="plus" ${enabled?'':'disabled'}>+</button></div><button class="cook-primary" style="width:100%;margin-top:8px" data-collect="${escapeHtml(req.id)}" ${enabled&&amount>0?'':'disabled'}>放入食品清单</button>`}</article>`;
    }
    function bindIngredientCards(recipe, next) {
        document.querySelectorAll('[data-ing-card]').forEach(card => {
            const id = card.dataset.ingCard;
            const req = recipe.ingredients.find(x => x.id === id);
            card.querySelector('[data-qty="minus"]')?.addEventListener('click', () => { tempAmounts[id] = Math.max(0,(tempAmounts[id]||0)-1); renderCollect(); });
            card.querySelector('[data-qty="plus"]')?.addEventListener('click', () => { tempAmounts[id] = (tempAmounts[id]||0)+1; renderCollect(); });
            card.querySelector('[data-collect]')?.addEventListener('click', () => finalizeCollected(req, tempAmounts[id]||0));
            const measure = card.querySelector('[data-measure]');
            if (measure && !measure.disabled) measure.addEventListener('click', () => toggleMeasure(measure, req));
        });
    }
    function toggleMeasure(button, req) {
        const max = Math.max(Number(req.amount)*1.5,Number(req.amount)+20,10);
        let value = tempAmounts[req.id] || 0;
        if (timers.hold) {
            clearInterval(timers.hold); timers.hold = null;
            button.classList.remove('holding');
            if (value > 0) finalizeCollected(req, Math.round(value));
            return;
        }
        if (value >= max) {
            finalizeCollected(req, Math.round(value));
            return;
        }
        button.classList.add('holding');
        button.firstChild.textContent = '点击停止 · ';
        timers.hold = setInterval(() => {
            value = Math.min(max, value + max/90);
            tempAmounts[req.id] = value;
            const card = button.closest('.cook-ingredient-card');
            const fill = card?.querySelector('.cook-measure-fill');
            const pointer = card?.querySelector('.cook-measure-pointer');
            const label = button.querySelector('span');
            const percent = clamp(value/max*100,0,100);
            if (fill) fill.style.width = percent+'%';
            if (pointer) pointer.style.left = percent+'%';
            if (label) label.textContent = Math.round(value);
            if (value >= max) {
                clearInterval(timers.hold); timers.hold = null;
                button.classList.remove('holding');
                button.firstChild.textContent = '已到最大 · 点击确认 ';
            }
        }, 50);
    }
    function scoreAmount(req, actual) {
        const target = Number(req.amount) || 1;
        const tol = Number(req.tolerance) || Math.max(1,target*.08);
        const error = Math.abs(actual-target);
        if (error <= tol) return 100;
        return clamp(100 - ((error-tol)/(target||1))*140, 0, 99);
    }
    function finalizeCollected(req, actual, partnerScore) {
        if (!session || session.stage !== 'collect') return;
        session.collected[req.id] = actual;
        tempAmounts[req.id] = actual;
        const score = partnerScore == null ? scoreAmount(req, actual) : partnerScore;
        addMetric('ingredient', score);
        addLog('取出' + getIngredient(req.id).name + ' ' + actual + req.unit);
        advanceTurn(); maybeJoinSpectator(); maybePartnerSticker();
        saveSession(); renderCollect();
        const recipe = getRecipe(session.recipeId);
        if (allCollected(recipe) && activeOwner() === 'partner') scheduleAuto();
    }
    function beginPrep() {
        session.stage = 'prep'; session.currentPrep = 0; saveSession(); renderPrep();
    }
    function prepQueue(recipe) { return recipe.ingredients.filter(req => req.prep && session.collected[req.id] != null); }
    function renderPrep() {
        clearClock();
        const recipe=getRecipe(session.recipeId), queue=prepQueue(recipe), req=queue[session.currentPrep];
        if (!req) {
            const owner=activeOwner();
            setHeader('备菜完成', recipe.name + ' · ' + ownerLabel());
            const summary=queue.map(item=>`<span>${getIngredient(item.id).icon||'🥣'} ${escapeHtml(getIngredient(item.id).name)} · ${escapeHtml(session.prep[item.id]||item.prep)}</span>`).join('');
            const main=`<div class="cook-step-hint"><b>所有食材都处理好了</b><span>确认完成备菜后，就会进入正式烹饪。</span></div><div class="cook-prep-card cook-prep-complete"><div class="cook-food-symbol">✨</div><h3>备菜完成</h3><div class="cook-prep-summary">${summary}</div>${owner==='user'?'<button class="cook-primary" id="cook-prep-finish">完成备菜</button>':'<p>正在等待对方确认备菜。</p>'}</div>`;
            setShell(stageLayout(main, session.spectatorJoined||session.mode==='solo_partner'?logCardHtml():checklistHtml(recipe)));
            $('cook-prep-finish')?.addEventListener('click', completePrepStage);
            return;
        }
        const ing=getIngredient(req.id), owner=activeOwner();
        setHeader('备菜', `${session.currentPrep+1} / ${queue.length} · ${ownerLabel()}`);
        const choices=[...new Set([req.prep,...cutOptions])].slice(0,8).sort(()=>Math.random()-.5);
        const parts=[1,2,3,4].map((_,i)=>`<span class="cook-cut-part p${i+1}">${ing.icon||'🥣'}</span>`).join('');
        const main=`<div class="cook-step-hint"><b>当前步骤 ${session.currentPrep+1} / ${queue.length}　${ing.name}：${req.prep}</b><span>${owner==='user'?'选择处理方式。错误不会即时公布。':'正在等待对方完成这张操作卡。'}</span></div><div class="cook-prep-card"><div class="cook-food-symbol cook-cut-symbol" id="cook-cut-symbol">${parts}</div><h3>${escapeHtml(ing.name)}</h3><p>菜谱需要：${escapeHtml(req.prep)}</p><div class="cook-cut-grid">${choices.map(choice=>`<button data-cut="${escapeHtml(choice)}" ${owner==='user'?'':'disabled'}>${escapeHtml(choice)}</button>`).join('')}</div></div>`;
        setShell(stageLayout(main, session.spectatorJoined||session.mode==='solo_partner'?logCardHtml():checklistHtml(recipe)));
        document.querySelectorAll('[data-cut]').forEach(btn=>btn.addEventListener('click',()=>animateAndCompletePrep(btn,req,btn.dataset.cut)));
    }
    function animateAndCompletePrep(button,req,choice){
        document.querySelectorAll('[data-cut]').forEach(btn=>btn.disabled=true);
        button.classList.add('selected');
        $('cook-cut-symbol')?.classList.add('split');
        setTimeout(()=>completePrep(req,choice),520);
    }
    function completePrep(req, choice, partnerScore) {
        session.prep[req.id]=choice;
        addMetric('prep', partnerScore == null ? (choice===req.prep?100:clamp(rand(25,72),0,100)) : partnerScore);
        addLog(getIngredient(req.id).name + (choice==='打散'?'打散':('切成'+choice)));
        session.currentPrep++; advanceTurn(); maybeJoinSpectator(); maybePartnerSticker(); saveSession(); renderPrep();
    }
    function completePrepStage(){session.stage='cook';session.currentStep=0;session.stepProgress={};saveSession();renderCookingStep();}

    function currentCookingStep() { return getRecipe(session.recipeId)?.steps?.[session.currentStep] || null; }
    function stepDescription(step) {
        if (!step) return '';
        if (step.type==='add') return '加入' + (step.ingredients||[]).map(id=>getIngredient(id).name).join('、');
        if (['heat','boil','steam'].includes(step.type)) return (heatNames[step.heat]||'') + stepNames[step.type] + ' ' + step.minutes + ' 分钟';
        if (step.type==='stirFry') return '每约 ' + (step.tapInterval||3) + ' 秒翻炒一次';
        if (step.type==='season') return '自由加入调料';
        return stepNames[step.type]||step.type;
    }
    function renderCookingStep() {
        clearClock();
        const recipe=getRecipe(session.recipeId), step=currentCookingStep();
        if (!step) return finishCooking();
        const owner=activeOwner(), next=recipe.steps[session.currentStep+1];
        setHeader('正式烹饪', `${session.currentStep+1} / ${recipe.steps.length} · ${ownerLabel()}`);
        const hint=`<div class="cook-step-hint"><b>当前步骤 ${session.currentStep+1} / ${recipe.steps.length}　${escapeHtml(stepDescription(step))}</b><span>${next?'接下来：'+escapeHtml(stepDescription(next)):'完成后就可以出锅'}</span></div>`;
        const main=hint+operationHtml(step,owner);
        setShell(stageLayout(main, session.spectatorJoined||session.mode==='solo_partner'?logCardHtml():checklistHtml(recipe)));
        bindOperation(step,owner);
    }
    function operationHtml(step, owner) {
        const disabled=owner==='user'?'':'disabled';
        if (step.type==='add') {
            const added=session.stepProgress.added||[];
            return `<div class="cook-operation-card"><div class="cook-food-symbol">🍳</div><h3>把对应食材放进锅里</h3><p>放入后按钮会变色并显示完成标记</p><div class="cook-op-buttons">${(step.ingredients||[]).map(id=>`<button class="${added.includes(id)?'added':''}" data-add-ing="${escapeHtml(id)}" ${disabled} ${added.includes(id)?'disabled':''}>${added.includes(id)?'<i class="fas fa-check"></i> ':''}${getIngredient(id).icon||'🥣'} ${escapeHtml(getIngredient(id).name)}</button>`).join('')}</div>${added.length===(step.ingredients||[]).length&&owner==='user'?'<button class="cook-primary" id="cook-step-next" style="margin-top:18px">完成这一步</button>':''}</div>`;
        }
        if (['heat','boil','steam'].includes(step.type)) {
            const running=session.stepProgress.timerStartedAt;
            return `<div class="cook-operation-card"><div class="cook-food-symbol">${step.type==='steam'?'♨️':step.type==='boil'?'🥘':'🔥'}</div><h3>${escapeHtml(heatNames[step.heat]||'火力')} · ${escapeHtml(stepNames[step.type])}</h3><p>标准时间 ${step.minutes} 秒，开始后再次点击结束</p><div class="cook-timer-ring" id="cook-timer-ring"><span id="cook-timer-text">${running?'0.0':'准备'}</span></div><div class="cook-op-buttons"><button class="${running?'active':''}" id="cook-fire-toggle" ${disabled}>${running?'结束计时':'开始'+(heatNames[step.heat]||'计时')}</button></div></div>`;
        }
        if (step.type==='stirFry') {
            const running=session.stepProgress.stirStartedAt,taps=session.stepProgress.taps||[],target=stirTargetCount(step);
            return `<div class="cook-operation-card" style="position:relative"><div class="cook-food-symbol">🍳</div><h3>保持翻炒节奏</h3><p>共需翻炒 ${target} 次 · 每 ${step.tapInterval||3} 秒按钮会亮起提醒</p><div class="cook-timer-ring" id="cook-timer-ring"><span id="cook-timer-text">${running?'0.0':'准备'}</span></div><div class="cook-stir-count" id="cook-stir-count">${taps.length} / ${target}</div><div class="cook-op-buttons">${running?`<button class="cook-stir-btn" id="cook-stir-tap" ${disabled}>翻炒</button><button id="cook-stir-finish" ${disabled} ${taps.length>=target?'':'disabled'}>完成翻炒</button>`:`<button id="cook-stir-start" ${disabled}>开始翻炒</button>`}</div></div>`;
        }
        if (step.type==='season') {
            const amounts=session.stepProgress.seasonings||{};
            return `<div class="cook-operation-card"><div class="cook-food-symbol">🧂</div><h3>最后调味</h3><p>可以按照自己的感觉随便加</p><div class="cook-op-buttons">${(step.ingredients||[]).map(id=>`<span><b style="display:block;font-size:10px;margin-bottom:5px">${escapeHtml(getIngredient(id).name)}</b><button data-season="${id}" data-delta="-1" ${disabled}>−</button><i style="display:inline-block;min-width:25px;font-style:normal">${amounts[id]||0}</i><button data-season="${id}" data-delta="1" ${disabled}>+</button></span>`).join('')}</div>${owner==='user'?'<button class="cook-primary" id="cook-season-finish" style="margin-top:18px">完成调味</button>':''}</div>`;
        }
        return `<div class="cook-operation-card"><div class="cook-food-symbol">🍽️</div><h3>料理完成</h3><p>确认出锅，进入结算</p><div class="cook-op-buttons"><button id="cook-serve" ${disabled}>出锅</button></div></div>`;
    }
    function bindOperation(step,owner) {
        if (owner!=='user') return;
        document.querySelectorAll('[data-add-ing]').forEach(btn=>btn.addEventListener('click',()=>{
            const list=session.stepProgress.added||(session.stepProgress.added=[]); list.push(btn.dataset.addIng); addLog('放入'+getIngredient(btn.dataset.addIng).name); saveSession(); renderCookingStep();
        }));
        $('cook-step-next')?.addEventListener('click',()=>completeCookingStep('operation',100));
        $('cook-fire-toggle')?.addEventListener('click',()=>toggleFireTimer(step));
        $('cook-stir-start')?.addEventListener('click',()=>startStir(step));
        $('cook-stir-tap')?.addEventListener('click',()=>tapStir(step));
        $('cook-stir-finish')?.addEventListener('click',()=>finishStir(step));
        document.querySelectorAll('[data-season]').forEach(btn=>btn.addEventListener('click',()=>{
            const map=session.stepProgress.seasonings||(session.stepProgress.seasonings={}); const id=btn.dataset.season; map[id]=Math.max(0,(map[id]||0)+Number(btn.dataset.delta)); saveSession(); renderCookingStep();
        }));
        $('cook-season-finish')?.addEventListener('click',()=>finishSeason(step));
        $('cook-serve')?.addEventListener('click',finishCooking);
        if(step.type==='stirFry'&&session.stepProgress.stirStartedAt){startClock(session.stepProgress.stirStartedAt,Math.max(2,step.minutes));startStirPrompts(step);}
        else if(['heat','boil','steam'].includes(step.type)&&session.stepProgress.timerStartedAt)startClock(session.stepProgress.timerStartedAt,Math.max(2,step.minutes));
    }
    function startClock(startedAt,targetSecs) {
        clearClock();
        const tick=()=>{
            const elapsed=(Date.now()-startedAt)/1000, text=$('cook-timer-text'), ring=$('cook-timer-ring');
            if(text) text.textContent=elapsed.toFixed(1)+'s';
            if(ring) ring.style.setProperty('--pct',clamp(elapsed/targetSecs*100,0,100));
        }; tick(); timers.clock=setInterval(tick,100);
    }
    function clearClock(){ if(timers.clock){clearInterval(timers.clock);timers.clock=null;}if(timers.stirPrompt){clearInterval(timers.stirPrompt);timers.stirPrompt=null;} }
    function toggleFireTimer(step){
        if(!session.stepProgress.timerStartedAt){session.stepProgress.timerStartedAt=Date.now();addLog('开启'+(heatNames[step.heat]||'火力'));saveSession();renderCookingStep();startClock(session.stepProgress.timerStartedAt,Math.max(2,step.minutes));return;}
        const elapsed=(Date.now()-session.stepProgress.timerStartedAt)/1000,target=Math.max(2,Number(step.minutes)||2),score=clamp(100-Math.abs(elapsed-target)/target*130,0,100);addLog((heatNames[step.heat]||'火力')+'持续 '+elapsed.toFixed(1)+' 秒');completeCookingStep('heat',score);
    }
    function stirTargetCount(step){return Math.max(1,Math.ceil((Number(step.minutes)||3)/(Number(step.tapInterval)||3)));}
    function startStir(step){session.stepProgress.stirStartedAt=Date.now();session.stepProgress.taps=[];addLog('开始翻炒，需要 '+stirTargetCount(step)+' 次');saveSession();renderCookingStep();}
    function startStirPrompts(step){
        clearInterval(timers.stirPrompt);
        const interval=(Number(step.tapInterval)||3)*1000;
        const tick=()=>{const taps=session?.stepProgress?.taps||[],last=taps.length?taps[taps.length-1]:session?.stepProgress?.stirStartedAt||Date.now(),due=Date.now()-last>=interval;$('cook-stir-tap')?.classList.toggle('prompt',due);};
        tick();timers.stirPrompt=setInterval(tick,180);
    }
    function tapStir(step){const now=Date.now(),taps=session.stepProgress.taps||(session.stepProgress.taps=[]),target=stirTargetCount(step);if(taps.length>=target)return;taps.push(now);const btn=$('cook-stir-tap');btn?.classList.remove('prompt');btn?.classList.add('tap');setTimeout(()=>btn?.classList.remove('tap'),140);if($('cook-stir-count'))$('cook-stir-count').textContent=taps.length+' / '+target;if(taps.length>=target&&$('cook-stir-finish'))$('cook-stir-finish').disabled=false;saveSession();}
    function finishStir(step){
        const elapsed=(Date.now()-session.stepProgress.stirStartedAt)/1000,target=Math.max(2,Number(step.minutes)||2),interval=Number(step.tapInterval)||3,taps=session.stepProgress.taps||[];
        const intervals=[];for(let i=1;i<taps.length;i++)intervals.push((taps[i]-taps[i-1])/1000);
        const intervalScore=intervals.length?avg(intervals.map(v=>clamp(100-Math.abs(v-interval)/interval*100,0,100)),60):45;
        const durationScore=clamp(100-Math.abs(elapsed-target)/target*90,0,100);addLog('完成翻炒');completeCookingStep('operation',intervalScore*.7+durationScore*.3);
    }
    function finishSeason(step){
        const map=session.stepProgress.seasonings||{};let scores=[];for(const id of step.ingredients||[]){const req=getRecipe(session.recipeId).ingredients.find(x=>x.id===id);if(req)scores.push(scoreAmount(req,map[id]||0));addLog('加入'+getIngredient(id).name+' '+(map[id]||0)+'份');}
        completeCookingStep('seasoning',avg(scores,70));
    }
    function completeCookingStep(metric,score){clearClock();addMetric(metric,score);session.currentStep++;session.stepProgress={};advanceTurn();maybeJoinSpectator();maybePartnerSticker();saveSession();renderCookingStep();}

    function autoDelay(){
        if(!session)return 500;
        if(session.stage==='collect'||session.stage==='prep')return rand(260,620);
        const step=currentCookingStep();
        if(step&&['heat','boil','steam','stirFry'].includes(step.type))return clamp((Number(step.minutes)||2)*180,650,5200);
        return rand(320,720);
    }
    function scheduleAuto(){
        clearTimeout(timers.auto);timers.auto=null;
        if(!session||activeOwner()!=='partner'||session.stage==='result')return;
        if(!session.partnerDueAt){session.partnerDueAt=(autoScheduleAnchor||Date.now())+autoDelay();saveSession();}
        timers.auto=setTimeout(runPartnerEngine,Math.max(20,session.partnerDueAt-Date.now()));
    }
    function runPartnerEngine(){
        clearTimeout(timers.auto);timers.auto=null;
        if(!session||activeOwner()!=='partner'||session.stage==='result')return;
        let guard=0;
        while(session&&activeOwner()==='partner'&&session.stage!=='result'&&Number(session.partnerDueAt||0)<=Date.now()&&guard++<80){
            autoScheduleAnchor=Number(session.partnerDueAt)||Date.now();
            session.partnerDueAt=null;
            autoAction();
        }
        autoScheduleAnchor=null;
        scheduleAuto();
    }
    function autoAction(){
        if(!session||activeOwner()!=='partner')return;
        const recipe=getRecipe(session.recipeId),score=partnerStepScore();
        if(session.stage==='collect'){
            const req=nextCollectRequirement(recipe);if(!req){session.stage='prep';session.currentPrep=0;advanceTurn();saveSession();return renderPrep();}
            const actual=score>=90?Number(req.amount)+rand(-(req.tolerance||0),(req.tolerance||0)):Math.max(.1,Number(req.amount)*rand(.55,1.45));finalizeCollected(req,discreteUnits.has(req.unit)?Math.max(1,Math.round(actual)):Math.round(actual),score);return;
        }
        if(session.stage==='prep'){
            const queue=prepQueue(recipe),req=queue[session.currentPrep];if(!req){if(session.mode==='together')advanceTurn();return completePrepStage();}
            completePrep(req,score>=90?req.prep:pick(cutOptions.filter(x=>x!==req.prep)),score);return;
        }
        if(session.stage==='cook'){
            const step=currentCookingStep();if(!step)return finishCooking();
            if(step.type==='serve')return finishCooking();
            addLog(stepDescription(step));
            completeCookingStep(step.type==='season'?'seasoning':step.type==='stirFry'||step.type==='add'?'operation':'heat',score);return;
        }
    }

    function finishCooking(){
        clearAllTimers();
        const metrics=session.metrics;
        const scores={ingredient:Math.round(avg(metrics.ingredient,100)),prep:Math.round(avg(metrics.prep,100)),heat:Math.round(avg(metrics.heat,100)),operation:Math.round(avg(metrics.operation,100)),seasoning:Math.round(avg(metrics.seasoning,75))};
        const total=Math.round(scores.ingredient*.20+scores.prep*.15+scores.heat*.30+scores.operation*.20+scores.seasoning*.15);
        const together=session.mode==='together';
        const cooperation=together?Math.round(clamp((total+avg([scores.prep,scores.operation],total))/2+rand(-4,5),0,100)):null;
        session.result={scores,total,cooperation,duration:Date.now()-session.startedAt};session.finishedAt=Date.now();session.stage='result';addLog('料理完成');saveSession();renderResult();
        if(session.mode==='solo_partner')setTimeout(()=>sendResultToChat(true),700);
    }
    function resultState(total){return total>=90?'非常成功':total>=75?'成功':total>=60?'普通':total>=40?'有点失败':'灾难料理';}
    function resultAssetList(mode,total){
        const good=Number(total)>=60;
        if(mode==='together')return [good?globalAssets.myGood:globalAssets.myBad,good?globalAssets.partnerGood:globalAssets.partnerBad].filter(Boolean);
        return [mode==='solo_partner'?(good?globalAssets.partnerGood:globalAssets.partnerBad):(good?globalAssets.myGood:globalAssets.myBad)].filter(Boolean);
    }
    function resultFigureHtml(mode,total){
        const assets=resultAssetList(mode,total),good=Number(total)>=60;
        if(!assets.length)return `<div class="cook-result-placeholder">${good?'🧑‍🍳':'🥣'}</div>`;
        return assets.map((src,i)=>`<img class="${assets.length>1?'duo duo-'+i:''}" src="${escapeHtml(src)}" alt="">`).join('');
    }
    function renderResult(){
        currentView='result';const recipe=getRecipe(session.recipeId),r=session.result;
        setHeader('料理完成',resultState(r.total));
        const mins=Math.floor(r.duration/60000),secs=Math.floor(r.duration/1000)%60;
        const figure=resultFigureHtml(session.mode,r.total);
        const labels={ingredient:'食材',prep:'刀工',heat:'火候',operation:'操作',seasoning:'调味'};
        setShell(`<div class="cook-result"><div class="cook-result-spark s1">✦</div><div class="cook-result-spark s2">✧</div><div class="cook-result-figure">${figure}</div><div class="cook-result-body"><div class="cook-kicker">COOKING COMPLETE</div><h2>${escapeHtml(recipe.name)}</h2><div class="cook-result-ribbon"><span>${escapeHtml(resultState(r.total))}</span></div><span class="cook-result-tag">${session.mode==='together'?'🫶':'🍳'} ${escapeHtml(modeNames[session.mode])}</span><div class="cook-score-list">${Object.entries(r.scores).map(([k,v])=>`<div class="cook-score-row"><span>${labels[k]}</span><div class="cook-score-bar"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}</div><div class="cook-result-total"><b>${r.total}%</b><span>完成度 · ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}${r.cooperation!=null?' · 配合度 '+r.cooperation+'%':''}</span></div><div class="cook-actions">${session.mode==='solo_partner'?'<button class="cook-secondary" id="cook-result-done">返回聊天</button>':'<button class="cook-secondary" id="cook-result-done">稍后发送</button><button class="cook-primary" id="cook-result-send">发送到聊天</button>'}</div></div></div>`);
        $('cook-result-send')?.addEventListener('click',()=>sendResultToChat(false));
        $('cook-result-done')?.addEventListener('click',()=>{if(session.mode==='solo_partner')closeToChat();else renderHome();});
    }
    function archiveSession(messageId){
        const recipe=getRecipe(session.recipeId);history.unshift({id:session.id,date:new Date().toISOString(),recipeId:recipe.id,name:recipe.name,mode:session.mode,total:session.result.total,cooperation:session.result.cooperation,messageId,userStars:null,partnerStars:null,userComment:'',partnerComments:[]});history=history.slice(0,120);saveHistory();
    }
    function sendResultToChat(auto){
        if(!session||session.sentMessageId)return;
        const recipe=getRecipe(session.recipeId),messageId=Date.now()+Math.random(),sender=session.mode==='solo_user'?'user':session.mode==='solo_partner'?getPartnerName():null;
        const cooking={sessionId:session.id,recipeId:recipe.id,dishName:recipe.name,mode:session.mode,total:session.result.total,scores:session.result.scores,duration:session.result.duration,cooperation:session.result.cooperation,userStars:null,partnerStars:null,userComment:'',partnerComments:[],partnerTasteDueAt:session.mode==='solo_partner'?null:Date.now()+Math.floor(rand(1,11))*60000};
        window.addMessage?.({id:messageId,sender,text:recipe.name,timestamp:new Date(),status:sender==='user'?'sent':'received',type:'cooking-card',cooking});
        session.sentMessageId=messageId;archiveSession(messageId);saveSession();
        if(auto){setTimeout(closeToChat,700);}else{notify('料理卡已经发送到聊天','success');setTimeout(closeToChat,500);}
    }
    function closeToChat(){
        $('cooking-page')?.classList.remove('active');$('cooking-page')?.setAttribute('aria-hidden','true');$('home-page')?.classList.remove('active');document.body.style.overflow='';
        if(session?.sentMessageId){session=null;writeStore('session',null);} 
    }
    function archiveAndReset(){if(session&&!history.find(x=>x.id===session.id))archiveSession(null);session=null;writeStore('session',null);renderHome();}

    function renderHistory(){
        currentView='history';setHeader('我们的厨房','完成过的料理会保存在这里');
        setShell(`<div class="cook-kicker">OUR KITCHEN</div><h2 class="cook-section-title">料理记录</h2><div class="cook-recipe-grid">${history.map(item=>`<div class="cook-recipe-card"><span class="cook-recipe-art">🍽️</span><span class="cook-recipe-info"><b>${escapeHtml(item.name)}</b><small>${new Date(item.date).toLocaleDateString('zh-CN')} · ${escapeHtml(modeNames[item.mode]||item.mode)}</small><span class="cook-stars">完成度 ${item.total}%${item.partnerStars?' · 对方 '+item.partnerStars+'星':''}</span></span></div>`).join('')||'<p class="cook-section-sub">厨房里还没有料理记录。</p>'}</div>`);
    }

    function spectatorDockHtml(){
        let pool=[];try{if(typeof myStickerLibrary!=='undefined'&&Array.isArray(myStickerLibrary))pool=myStickerLibrary.slice(0,12);}catch(_){}
        const fallback=['🙂','😂','❤️','👀','😋','👏'];
        const items=pool.length?pool:fallback;
        return `<div class="cook-sticker-dock">${items.map((item,i)=>`<button data-cook-sticker="${i}">${String(item).startsWith('data:')||String(item).startsWith('http')?`<img src="${escapeHtml(item)}" alt="">`:escapeHtml(item)}</button>`).join('')}</div>`;
    }
    function bindSpectatorDock(){document.querySelectorAll('[data-cook-sticker]').forEach((btn,i)=>btn.addEventListener('click',()=>{let pool=[];try{if(typeof myStickerLibrary!=='undefined'&&Array.isArray(myStickerLibrary))pool=myStickerLibrary.slice(0,12);}catch(_){};floatSticker((pool.length?pool:['🙂','😂','❤️','👀','😋','👏'])[i]);}));}
    function floatSticker(value){
        const host=document.querySelector('.cook-operation-card,.cook-prep-card,.cook-stage-main');if(!host||!value)return;host.style.position='relative';const el=document.createElement('span');el.className='cook-emoji-float';el.style.left=rand(12,78)+'%';el.style.bottom='18px';el.innerHTML=String(value).startsWith('data:')||String(value).startsWith('http')?`<img src="${escapeHtml(value)}" style="width:46px;height:46px;object-fit:contain">`:escapeHtml(value);host.appendChild(el);setTimeout(()=>el.remove(),2300);
    }

    function starDistribution(score){
        if(score>=90)return [[5,.70],[4,.25],[3,.05]];
        if(score>=75)return [[5,.25],[4,.55],[3,.20]];
        if(score>=60)return [[5,.05],[4,.25],[3,.55],[2,.15]];
        if(score>=40)return [[4,.05],[3,.25],[2,.50],[1,.20]];
        return [[3,.10],[2,.30],[1,.60]];
    }
    function randomStars(score){let roll=Math.random();for(const [stars,p] of starDistribution(score)){roll-=p;if(roll<=0)return stars;}return 3;}
    function getReplyCardPool(){
        try{if(typeof customReplies!=='undefined'&&Array.isArray(customReplies)&&customReplies.length)return customReplies.filter(Boolean);}catch(_){}
        return Array.isArray(window._customReplies)?window._customReplies.filter(Boolean):[];
    }
    function completePartnerTaste(msg){
        if(!msg?.cooking||msg.cooking.partnerStars)return;
        const data={...msg.cooking};data.partnerStars=randomStars(data.total);data.partnerTastedAt=Date.now();
        const pool=getReplyCardPool(),count=Math.random()<.15?2:1,chosen=[];const copy=pool.slice();while(copy.length&&chosen.length<count){chosen.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]);}data.partnerComments=chosen;
        window.CompanionBridge?.updateMainMessage(msg.id,{cooking:data});
        chosen.forEach((text,index)=>setTimeout(()=>window.addMessage?.({id:Date.now()+Math.random(),sender:getPartnerName(),text,timestamp:new Date(),status:'received',type:'text'}),index*450));
        const record=history.find(x=>String(x.messageId)===String(msg.id));if(record){record.partnerStars=data.partnerStars;record.partnerComments=chosen;saveHistory();}
    }
    function findMessage(id){try{return messages.find(m=>String(m.id)===String(id));}catch(_){return window.CompanionBridge?.getMessage(id)||null;}}
    function checkPendingTastes(){
        let list=[];try{list=messages||[];}catch(_){}
        list.filter(msg=>msg.type==='cooking-card'&&msg.cooking?.partnerTasteDueAt&&!msg.cooking.partnerStars&&Date.now()>=msg.cooking.partnerTasteDueAt).forEach(completePartnerTaste);
    }
    function openTaste(messageId){
        const msg=findMessage(messageId);if(!msg?.cooking||msg.cooking.userStars)return;selectedTasteMessageId=messageId;selectedTasteStars=0;$('cook-comment').value='';document.querySelectorAll('#cook-rating [data-star]').forEach(x=>x.classList.remove('on'));if(typeof showModal==='function')showModal($('cook-taste-modal'));else $('cook-taste-modal').style.display='flex';
    }
    function closeTaste(){if(typeof hideModal==='function')hideModal($('cook-taste-modal'));else $('cook-taste-modal').style.display='none';selectedTasteMessageId=null;}
    function submitTaste(){
        if(!selectedTasteStars)return notify('先点亮星星再提交','info');const msg=findMessage(selectedTasteMessageId);if(!msg?.cooking)return closeTaste();const comment=$('cook-comment').value.trim(),data={...msg.cooking,userStars:selectedTasteStars,userComment:comment,userTastedAt:Date.now()};window.CompanionBridge?.updateMainMessage(msg.id,{cooking:data});if(comment)window.addMessage?.({id:Date.now()+Math.random(),sender:'user',text:comment,timestamp:new Date(),status:'sent',type:'text'});const record=history.find(x=>String(x.messageId)===String(msg.id));if(record){record.userStars=selectedTasteStars;record.userComment=comment;saveHistory();}closeTaste();
    }
    function openResultView(messageId){
        const msg=findMessage(messageId);if(!msg?.cooking)return;
        const data=msg.cooking,labels={ingredient:'食材',prep:'刀工',heat:'火候',operation:'操作',seasoning:'调味'},scores=data.scores||{},duration=Number(data.duration)||0,mins=Math.floor(duration/60000),secs=Math.floor(duration/1000)%60;
        $('cook-result-view-body').innerHTML=`<div class="cook-result cook-result-readonly"><div class="cook-result-spark s1">✦</div><div class="cook-result-spark s2">✧</div><div class="cook-result-figure">${resultFigureHtml(data.mode,data.total)}</div><div class="cook-result-body"><div class="cook-kicker">COOKING COMPLETE</div><h2>${escapeHtml(data.dishName||msg.text||'料理')}</h2><div class="cook-result-ribbon"><span>${escapeHtml(resultState(data.total))}</span></div><span class="cook-result-tag">${data.mode==='together'?'🫶':'🍳'} ${escapeHtml(modeNames[data.mode]||'料理')}</span><div class="cook-score-list">${Object.entries(labels).map(([k,v])=>`<div class="cook-score-row"><span>${v}</span><div class="cook-score-bar"><i style="width:${Number(scores[k])||0}%"></i></div><b>${Number(scores[k])||0}</b></div>`).join('')}</div><div class="cook-result-total"><b>${Number(data.total)||0}%</b><span>完成度 · ${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}${data.cooperation!=null?' · 配合度 '+data.cooperation+'%':''}</span></div>${data.userStars?`<div class="cook-result-review"><span>你的评分　${'★'.repeat(data.userStars)}</span>${data.userComment?`<p>${escapeHtml(data.userComment)}</p>`:''}</div>`:''}${data.partnerStars?`<div class="cook-result-review"><span>对方评分　${'★'.repeat(data.partnerStars)}</span></div>`:''}</div></div>`;
        $('cook-result-view').classList.add('active');$('cook-result-view').setAttribute('aria-hidden','false');
    }
    function closeResultView(){$('cook-result-view')?.classList.remove('active');$('cook-result-view')?.setAttribute('aria-hidden','true');}
    function renderCookingMessage(msg){
        const data=msg.cooking||{},system=data.mode==='together',own=msg.sender==='user',cls=system?'system':own?'sent':'received';const stars=own||system?data.partnerStars:data.userStars;const canTaste=!own&&!data.userStars||system&&!data.userStars;const status=own||system?(data.partnerStars?'对方已品尝':'等待对方品尝'):(data.userStars?'你已评价':'等待你品尝'),thumbs=resultAssetList(data.mode,data.total);
        const wrap=document.createElement('div');wrap.className='cooking-message-wrap '+cls;wrap.dataset.id=msg.id;wrap.innerHTML=`<div class="cooking-chat-card" role="button" tabindex="0"><div class="cooking-card-decor">✦<span>✧</span></div><div class="cooking-card-top"><small>${system?'共同料理完成':own?'料理已送达':'对方完成了料理'}</small><b>${escapeHtml(data.dishName||msg.text||'料理')}</b><div class="cooking-card-meta"><span>${escapeHtml(modeNames[data.mode]||'料理')}</span><span class="cooking-score-seal">${Number(data.total)||0}</span></div>${thumbs.length?`<div class="cooking-card-figures">${thumbs.map(src=>`<img src="${escapeHtml(src)}" alt="">`).join('')}</div>`:''}</div><div class="cooking-card-body"><div class="cooking-card-stars">${[1,2,3,4,5].map((n,i)=>`<span class="${stars>=n?'on':''}" style="animation-delay:${i*.09}s">★</span>`).join('')}</div><div class="cooking-card-status">${escapeHtml(status)} · 点击查看结算</div>${canTaste?`<button class="cooking-card-btn" data-cook-taste="${escapeHtml(msg.id)}">品尝并评分</button>`:''}${data.userComment?`<div class="cooking-card-comments">你的评论：${escapeHtml(data.userComment)}</div>`:''}</div></div>`;
        const card=wrap.querySelector('.cooking-chat-card');card?.addEventListener('click',()=>openResultView(msg.id));card?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openResultView(msg.id);}});wrap.querySelector('[data-cook-taste]')?.addEventListener('click',e=>{e.stopPropagation();openTaste(msg.id);});return wrap;
    }

    function openManager(){
        managerTab='list';managerDraft=null;document.querySelectorAll('[data-manager-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.managerTab==='list'));renderManager();if(typeof showModal==='function')showModal($('cook-manager-modal'));else $('cook-manager-modal').style.display='flex';
    }
    function renderManager(){if(managerTab==='list')renderRecipeManagerList();else if(managerTab==='edit')renderRecipeEditor();else if(managerTab==='ingredients')renderIngredientManager();else renderGlobalAssetManager();}
    function renderRecipeManagerList(){
        $('cook-manager-body').innerHTML=`<button class="cook-primary" id="cook-new-recipe"><i class="fas fa-plus"></i> 新建菜谱</button><div class="cook-builder-list">${recipes.map(r=>`<div class="cook-manager-list-row"><span>${r.assets?.dish?'🖼️':'🍲'}</span><div><b>${escapeHtml(r.name)}</b><small>${escapeHtml(r.category||'其他')} · ${r.ingredients.length} 种食材 · ${r.steps.length} 步</small></div><button data-edit-recipe="${escapeHtml(r.id)}"><i class="fas fa-pen"></i></button>${customRecipes.some(x=>x.id===r.id)?`<button data-delete-recipe="${escapeHtml(r.id)}"><i class="fas fa-trash"></i></button>`:''}</div>`).join('')}</div>`;
        $('cook-new-recipe')?.addEventListener('click',()=>{managerDraft=freshRecipe();managerTab='edit';document.querySelectorAll('[data-manager-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.managerTab==='edit'));renderManager();});
        document.querySelectorAll('[data-edit-recipe]').forEach(btn=>btn.addEventListener('click',()=>{managerDraft=JSON.parse(JSON.stringify(getRecipe(btn.dataset.editRecipe)));managerTab='edit';document.querySelectorAll('[data-manager-tab]').forEach(x=>x.classList.toggle('active',x.dataset.managerTab==='edit'));renderManager();}));
        document.querySelectorAll('[data-delete-recipe]').forEach(btn=>btn.addEventListener('click',()=>{customRecipes=customRecipes.filter(x=>x.id!==btn.dataset.deleteRecipe);recipes=mergeById(baseRecipes,customRecipes);writeStore('customRecipes',customRecipes);renderManager();}));
    }
    function freshRecipe(){return{id:'recipe_'+Date.now(),name:'',category:'炒菜',difficulty:1,assets:{dish:''},ingredients:[],steps:[]};}
    function renderRecipeEditor(){
        if(!managerDraft)managerDraft=freshRecipe();const d=managerDraft;d.assets=d.assets||{dish:''};
        $('cook-manager-body').innerHTML=`<div class="cook-form-grid"><div class="cook-field"><label>菜名</label><input id="cook-r-name" value="${escapeHtml(d.name)}"></div><div class="cook-field"><label>分类</label><input id="cook-r-category" value="${escapeHtml(d.category)}"></div><div class="cook-field"><label>难度（1～5）</label><input id="cook-r-difficulty" type="number" min="1" max="5" value="${d.difficulty||1}"></div><div class="cook-field"><label>菜谱 ID</label><input id="cook-r-id" value="${escapeHtml(d.id)}"></div><div class="cook-field"><label>成品图片（仅这道菜）</label><input type="file" id="cook-r-dish" accept="image/*"></div><div class="cook-field"><label>人物结算图</label><p class="cook-field-note">成功/失败人物图已移到“结算图片”，全菜谱共用。</p></div></div>
            <div class="cook-side-title" style="margin-top:16px"><span>食材</span><button class="cook-secondary" id="cook-add-ing-row">添加食材</button></div><div class="cook-builder-list" id="cook-editor-ings">${d.ingredients.map((row,i)=>ingredientEditorRow(row,i)).join('')}</div>
            <div class="cook-side-title" style="margin-top:16px"><span>料理步骤</span><button class="cook-secondary" id="cook-add-step-row">添加步骤</button></div><div class="cook-builder-list" id="cook-editor-steps">${d.steps.map((row,i)=>stepEditorRow(row,i)).join('')}</div><div class="cook-actions"><button class="cook-primary" id="cook-save-recipe">保存菜谱</button></div>`;
        bindRecipeEditor();
    }
    function ingredientEditorRow(row,i){return `<div class="cook-builder-row" data-editor-ing="${i}"><div class="cook-field"><label>食材</label><select data-k="id">${ingredients.map(ing=>`<option value="${escapeHtml(ing.id)}" ${ing.id===row.id?'selected':''}>${escapeHtml(ing.name)}</option>`).join('')}</select></div><div class="cook-field"><label>数量</label><input data-k="amount" type="number" value="${row.amount??1}"></div><div class="cook-field"><label>单位</label><input data-k="unit" value="${escapeHtml(row.unit||getIngredient(row.id).defaultUnit||'个')}"></div><div class="cook-field"><label>处理</label><input data-k="prep" value="${escapeHtml(row.prep||'')}"></div><button data-remove-ing="${i}"><i class="fas fa-xmark"></i></button></div>`;}
    function stepEditorRow(row,i){return `<div class="cook-builder-row step" data-editor-step="${i}"><div class="cook-field"><label>动作</label><select data-k="type">${Object.keys(stepNames).map(type=>`<option value="${type}" ${type===row.type?'selected':''}>${stepNames[type]}</option>`).join('')}</select></div><div class="cook-field"><label>食材 ID（逗号分隔）</label><input data-k="ingredients" value="${escapeHtml((row.ingredients||[]).join(','))}"></div><div class="cook-field"><label>火力</label><select data-k="heat"><option value="">无</option>${Object.keys(heatNames).map(h=>`<option value="${h}" ${h===row.heat?'selected':''}>${heatNames[h]}</option>`).join('')}</select></div><div class="cook-field"><label>分钟 / 点击间隔</label><input data-k="minutes" type="number" value="${row.minutes??0}" placeholder="分钟"><input data-k="tapInterval" type="number" value="${row.tapInterval??3}" placeholder="间隔秒"></div><button data-remove-step="${i}"><i class="fas fa-xmark"></i></button></div>`;}
    function syncDraftFromForm(){
        const d=managerDraft;d.name=$('cook-r-name')?.value.trim()||'';d.category=$('cook-r-category')?.value.trim()||'其他';d.difficulty=clamp(Number($('cook-r-difficulty')?.value)||1,1,5);d.id=($('cook-r-id')?.value.trim()||('recipe_'+Date.now())).replace(/\s+/g,'_');
        d.ingredients=[...document.querySelectorAll('[data-editor-ing]')].map(row=>{const obj={};row.querySelectorAll('[data-k]').forEach(el=>obj[el.dataset.k]=el.dataset.k==='amount'?Number(el.value):el.value.trim());if(!obj.prep)delete obj.prep;if(!discreteUnits.has(obj.unit))obj.tolerance=Math.max(1,Math.round(obj.amount*.08));return obj;});
        d.steps=[...document.querySelectorAll('[data-editor-step]')].map(row=>{const obj={};row.querySelectorAll('[data-k]').forEach(el=>{if(el.dataset.k==='ingredients')obj.ingredients=el.value.split(',').map(x=>x.trim()).filter(Boolean);else if(['minutes','tapInterval'].includes(el.dataset.k))obj[el.dataset.k]=Number(el.value)||0;else if(el.value)obj[el.dataset.k]=el.value;});if(obj.type!=='stirFry')delete obj.tapInterval;if(!['heat','boil','steam'].includes(obj.type))delete obj.heat;if(!['heat','boil','steam','stirFry'].includes(obj.type))delete obj.minutes;return obj;});
    }
    function bindRecipeEditor(){
        $('cook-add-ing-row')?.addEventListener('click',()=>{syncDraftFromForm();managerDraft.ingredients.push({id:ingredients[0]?.id||'',amount:1,unit:ingredients[0]?.defaultUnit||'个'});renderRecipeEditor();});
        $('cook-add-step-row')?.addEventListener('click',()=>{syncDraftFromForm();managerDraft.steps.push({type:'add',ingredients:[]});renderRecipeEditor();});
        document.querySelectorAll('[data-remove-ing]').forEach(btn=>btn.addEventListener('click',()=>{syncDraftFromForm();managerDraft.ingredients.splice(Number(btn.dataset.removeIng),1);renderRecipeEditor();}));
        document.querySelectorAll('[data-remove-step]').forEach(btn=>btn.addEventListener('click',()=>{syncDraftFromForm();managerDraft.steps.splice(Number(btn.dataset.removeStep),1);renderRecipeEditor();}));
        $('cook-r-dish')?.addEventListener('change',event=>readImage(event.target.files[0],url=>managerDraft.assets.dish=url));
        $('cook-save-recipe')?.addEventListener('click',()=>{syncDraftFromForm();if(!managerDraft.name)return notify('先填写菜名','warning');if(!managerDraft.ingredients.length||!managerDraft.steps.length)return notify('至少添加一种食材和一个步骤','warning');customRecipes=customRecipes.filter(x=>x.id!==managerDraft.id);customRecipes.push(JSON.parse(JSON.stringify(managerDraft)));recipes=mergeById(baseRecipes,customRecipes);writeStore('customRecipes',customRecipes);notify('菜谱已保存为固定 JSON 结构','success');managerTab='list';managerDraft=null;document.querySelectorAll('[data-manager-tab]').forEach(x=>x.classList.toggle('active',x.dataset.managerTab==='list'));renderManager();});
    }
    function readImage(file,done){if(!file)return;const reader=new FileReader();reader.onload=()=>done(String(reader.result||''));reader.readAsDataURL(file);}
    function renderIngredientManager(){
        $('cook-manager-body').innerHTML=`<div class="cook-form-grid"><div class="cook-field"><label>食材名称</label><input id="cook-i-name"></div><div class="cook-field"><label>ID（可留空）</label><input id="cook-i-id"></div><div class="cook-field"><label>储藏位置</label><select id="cook-i-storage">${Object.entries(storageNames).filter(([k])=>k!=='all').map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></div><div class="cook-field"><label>默认单位</label><input id="cook-i-unit" value="个"></div><div class="cook-field"><label>图标（emoji）</label><input id="cook-i-icon" value="🥣"></div></div><div class="cook-actions"><button class="cook-primary" id="cook-add-ingredient">添加食材</button></div><div class="cook-builder-list">${ingredients.map(ing=>`<div class="cook-manager-list-row"><span>${ing.icon||'🥣'}</span><div><b>${escapeHtml(ing.name)}</b><small>${escapeHtml(storageNames[ing.storage]||ing.storage)} · ${escapeHtml(ing.defaultUnit)}</small></div>${customIngredients.some(x=>x.id===ing.id)?`<button data-delete-ingredient="${escapeHtml(ing.id)}"><i class="fas fa-trash"></i></button>`:''}</div>`).join('')}</div>`;
        $('cook-add-ingredient')?.addEventListener('click',()=>{const name=$('cook-i-name').value.trim();if(!name)return notify('请填写食材名称','warning');const id=($('cook-i-id').value.trim()||('ingredient_'+Date.now())).replace(/\s+/g,'_');customIngredients=customIngredients.filter(x=>x.id!==id);customIngredients.push({id,name,category:'custom',storage:$('cook-i-storage').value,defaultUnit:$('cook-i-unit').value.trim()||'个',icon:$('cook-i-icon').value.trim()||'🥣'});ingredients=mergeById(baseIngredients,customIngredients);writeStore('customIngredients',customIngredients);renderIngredientManager();});
        document.querySelectorAll('[data-delete-ingredient]').forEach(btn=>btn.addEventListener('click',()=>{customIngredients=customIngredients.filter(x=>x.id!==btn.dataset.deleteIngredient);ingredients=mergeById(baseIngredients,customIngredients);writeStore('customIngredients',customIngredients);renderIngredientManager();}));
    }
    function renderGlobalAssetManager(){
        const fields=[['myGood','我的美味料理图','我做得成功时显示'],['myBad','我的失败料理图','我做得糟糕时显示'],['partnerGood',getPartnerName()+'的美味料理图','对方做得成功时显示'],['partnerBad',getPartnerName()+'的失败料理图','对方做得糟糕时显示']];
        $('cook-manager-body').innerHTML=`<p class="cook-section-sub">这里的四张透明底人物图是全局设置。设置一次后，所有菜谱结算都会沿用；一起做时会同时显示两个人。</p><div class="cook-global-assets">${fields.map(([key,title,sub])=>`<div class="cook-global-asset"><div class="cook-global-preview">${globalAssets[key]?`<img src="${escapeHtml(globalAssets[key])}" alt="">`:'<i class="fas fa-image"></i>'}</div><div><b>${escapeHtml(title)}</b><small>${escapeHtml(sub)}</small><label class="cook-secondary"><i class="fas fa-upload"></i> 选择图片<input type="file" data-global-asset="${key}" accept="image/*" hidden></label>${globalAssets[key]?`<button class="cook-asset-clear" data-clear-asset="${key}">清除</button>`:''}</div></div>`).join('')}</div>`;
        document.querySelectorAll('[data-global-asset]').forEach(input=>input.addEventListener('change',event=>readImage(event.target.files[0],url=>{globalAssets[input.dataset.globalAsset]=url;writeStore('globalAssets',globalAssets);renderGlobalAssetManager();})));
        document.querySelectorAll('[data-clear-asset]').forEach(btn=>btn.addEventListener('click',()=>{globalAssets[btn.dataset.clearAsset]='';writeStore('globalAssets',globalAssets);renderGlobalAssetManager();}));
    }
    function exportConfigs(){
        const blob=new Blob([JSON.stringify({format:'chuanxun-cooking-v2',globalAssets,ingredients:customIngredients,recipes:customRecipes},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='chuanxun-cooking-recipes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    function importConfigs(event){
        const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result),newRecipes=Array.isArray(data)?data:(data.recipes||[]),newIngredients=Array.isArray(data.ingredients)?data.ingredients:[];if(data.globalAssets){globalAssets=Object.assign(globalAssets,data.globalAssets);writeStore('globalAssets',globalAssets);}newIngredients.forEach(item=>{customIngredients=customIngredients.filter(x=>x.id!==item.id);customIngredients.push(item);});newRecipes.forEach(item=>{customRecipes=customRecipes.filter(x=>x.id!==item.id);customRecipes.push(item);});ingredients=mergeById(baseIngredients,customIngredients);recipes=mergeById(baseRecipes,customRecipes);writeStore('customIngredients',customIngredients);writeStore('customRecipes',customRecipes);notify('菜谱 JSON 已导入','success');renderManager();}catch(error){notify('JSON 格式不正确','error');}};reader.readAsText(file);event.target.value='';
    }

    function showCookingToast(title,sub,showButton){
        $('cook-toast-title').textContent=title;$('cook-toast-sub').textContent=sub;$('cook-toast-go').style.display=showButton===false?'none':'';$('cook-toast').classList.add('show');clearTimeout(timers.toast);timers.toast=setTimeout(hideCookingToast,9000);
    }
    function hideCookingToast(){$('cook-toast')?.classList.remove('show');}
    async function rollPartnerCooking(){
        if(session)return;const today=new Date().toISOString().slice(0,10),lastDay=await readStore('lastPartnerRollDay',''),lastEvent=await readStore('lastPartnerCookAt',0);if(lastDay===today)return;writeStore('lastPartnerRollDay',today);if(Date.now()-Number(lastEvent)<36*3600000)return;if(Math.random()<.05){writeStore('lastPartnerCookAt',Date.now());const recipe=pick(recipes);startSession('solo_partner',recipe.id,false);showCookingToast(getPartnerName()+'好像在厨房忙什么……','料理已经开始，可以进去围观',true);}}
    function clearAllTimers(){clearTimeout(timers.auto);timers.auto=null;clearClock();if(timers.hold){clearInterval(timers.hold);timers.hold=null;}}

    function bindDynamicEvents(){
        bindSpectatorDock();
    }
    window.CookingFeature={open:openCooking,renderMessage:renderCookingMessage,taste:openTaste,checkPendingTastes,debugPartnerCook(recipeId){if(session)return false;startSession('solo_partner',recipeId||pick(recipes).id,false);showCookingToast(getPartnerName()+'好像在厨房忙什么……','调试事件已开始',true);return true;}};

    async function init(){
        await loadConfigs();injectPage();bindBaseEvents();checkPendingTastes();setTimeout(checkPendingTastes,2500);setInterval(checkPendingTastes,30000);
        if(session&&session.stage!=='result'&&activeOwner()==='partner')runPartnerEngine();
        document.addEventListener('visibilitychange',()=>{if(!document.hidden)runPartnerEngine();});
        window.refreshMainMessages?.();
        setTimeout(rollPartnerCooking,2400);
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,200));else setTimeout(init,200);
})();
