(function() {
    'use strict';

    // 存储键
    const JOURNEY_KEY = 'journey_data_v1';
    const JOURNEY_DB_KEY = 'CHAT_APP_V3_journey_data_v2';

    // 数据结构
    let journeyData = {
        plans: [],
        history: []
    };

    // 当前编辑的计划
    let currentPlan = {
        origin: '',
        destination: '',
        passengers: [''],
        flight: '',
        date: '',
        gate: '',
        boardingTime: '',
        class: '',
        seats: [],
        itinerary: [],
        bgImage: null
    };
    let editingPlanId = null;
    let journeyHydrated = false;
    let journeyLoadPromise = null;
    let journeySaveChain = Promise.resolve();

    // ==================== 数据操作 ====================
    function normalizeJourneyData(parsed) {
        parsed = parsed && typeof parsed === 'object' ? parsed : {};
        const normalized = {
            plans: Array.isArray(parsed.plans) ? parsed.plans : [],
            history: Array.isArray(parsed.history) ? parsed.history : []
        };
        normalized.plans.forEach(plan => {
            if (!plan.itinerary) plan.itinerary = [];
            if (!plan.seats) plan.seats = [];
        });
        normalized.history.forEach(entry => {
            if (!entry.itinerary) entry.itinerary = [];
            if (!entry.seats) entry.seats = [];
            if (!entry.items) entry.items = [];
        });
        return normalized;
    }

    function cloneJourneyData(data) {
        return JSON.parse(JSON.stringify(data));
    }

    async function loadJourneyData() {
        if (journeyHydrated) return journeyData;
        if (journeyLoadPromise) return journeyLoadPromise;

        journeyLoadPromise = (async () => {
            let parsed = null;
            let loadedFromLegacy = false;

            if (window.localforage) {
                try {
                    parsed = await localforage.getItem(JOURNEY_DB_KEY);
                } catch (e) {
                    console.error('从 IndexedDB 加载旅程数据失败', e);
                }
            }

            if (!parsed) {
                try {
                    const saved = localStorage.getItem(JOURNEY_KEY);
                    if (saved) {
                        parsed = JSON.parse(saved);
                        loadedFromLegacy = true;
                    }
                } catch (e) {
                    console.error('加载旧版旅程数据失败', e);
                }
            }

            journeyData = normalizeJourneyData(parsed);
            journeyHydrated = true;

            if (loadedFromLegacy && window.localforage) {
                try {
                    await localforage.setItem(JOURNEY_DB_KEY, cloneJourneyData(journeyData));
                    localStorage.removeItem(JOURNEY_KEY);
                } catch (e) {
                    console.error('迁移旅程数据失败', e);
                }
            }

            return journeyData;
        })().finally(() => {
            journeyLoadPromise = null;
        });

        return journeyLoadPromise;
    }

    function saveJourneyData() {
        const snapshot = cloneJourneyData(journeyData);

        if (window.localforage) {
            journeySaveChain = journeySaveChain
                .catch(() => {})
                .then(() => localforage.setItem(JOURNEY_DB_KEY, snapshot))
                .then(() => {
                    try { localStorage.removeItem(JOURNEY_KEY); } catch (e) {}
                    return true;
                })
                .catch((e) => {
                    console.error('保存旅程数据失败', e);
                    showNotification('旅程图片保存失败，请检查浏览器存储权限', 'error');
                    return false;
                });
            return journeySaveChain;
        }

        try {
            localStorage.setItem(JOURNEY_KEY, JSON.stringify(snapshot));
            return Promise.resolve(true);
        } catch(e) {
            console.error('保存旅程数据失败', e);
            showNotification('旅程图片过大，当前浏览器无法保存', 'error');
            return Promise.resolve(false);
        }
    }

    // ==================== 工具函数 ====================
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        if (parts.length === 2) {
            return parts[0] + ':' + parts[1];
        }
        return timeStr;
    }

    function generateId() {
        return 'journey_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    }

    function showNotification(msg, type) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, type);
        } else if (typeof window.showNotification === 'function') {
            window.showNotification(msg, type);
        } else {
            console.log('[' + type + '] ' + msg);
        }
    }

    // 构建机票卡片HTML
    function buildTicketCardHtml(plan) {
        const passengers = (plan.passengers && plan.passengers.length > 0)
            ? plan.passengers.join(' & ')
            : '旅客';
        const seats = (plan.seats && plan.seats.length > 0)
            ? plan.seats.join(', ')
            : '--';
        const bgStyle = plan.bgImage
            ? `background-image: url(${plan.bgImage}); background-size: cover; background-position: center;`
            : 'background: linear-gradient(135deg, #eef2f5, #d5dbe3);';

        return `
        <div class="xhs-share-card" style="max-width: 320px; overflow: hidden; border-radius: 16px; background: #fff;">
            <div style="padding: 12px 16px 8px; border-bottom: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; color: #2c3e50; letter-spacing: 1px;">FANDOM AIRLINES</span>
                    <span style="font-size: 11px; color: #888; border: 1px solid #ccc; padding: 2px 10px; border-radius: 12px;">${escapeHtml(plan.class || '头等舱')}</span>
                </div>
            </div>
            <div style="padding: 16px; ${bgStyle} min-height: 160px; position: relative;">
                <div style="background: rgba(255,255,255,0.75); backdrop-filter: blur(4px); padding: 14px; border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: #1a1a1a;">${escapeHtml(plan.origin || '?')}</div>
                            <div style="font-size: 11px; color: #7f8c8d;">出发</div>
                        </div>
                        <div style="color: #bdc3c7; font-size: 20px;">
                            <i class="fas fa-plane" style="transform: rotate(45deg);"></i>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 28px; font-weight: 700; color: #1a1a1a;">${escapeHtml(plan.destination || '?')}</div>
                            <div style="font-size: 11px; color: #7f8c8d;">到达</div>
                        </div>
                    </div>
                    <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #555;">
                        <div><span style="color: #95a5a6;">航班</span> ${escapeHtml(plan.flight || '--')}</div>
                        <div><span style="color: #95a5a6;">日期</span> ${formatDate(plan.date) || '--'}</div>
                        <div><span style="color: #95a5a6;">登机口</span> ${escapeHtml(plan.gate || '--')}</div>
                        <div><span style="color: #95a5a6;">登机</span> ${formatTime(plan.boardingTime) || '--'}</div>
                        <div style="grid-column: span 2;"><span style="color: #95a5a6;">旅客</span> ${escapeHtml(passengers)}</div>
                        <div style="grid-column: span 2;"><span style="color: #95a5a6;">座位</span> ${escapeHtml(seats)}</div>
                    </div>
                </div>
            </div>
            <div style="padding: 8px 16px; border-top: 1px dashed #dcdde1; text-align: center; font-size: 10px; color: #aaa; letter-spacing: 2px;">
                ${escapeHtml(plan.flight || 'CP')} · ${formatDate(plan.date) || ''}
            </div>
        </div>`;
    }

    // ==================== 计划界面渲染 ====================
    function renderPlanView() {
        const container = document.getElementById('journey-content');
        if (!container) return;

        const p = currentPlan;

        // 确保数据一致
        if (!p.seats || !Array.isArray(p.seats)) p.seats = [];
        while (p.seats.length < p.passengers.length) {
            p.seats.push('');
        }
        if (!p.itinerary || !Array.isArray(p.itinerary)) p.itinerary = [];

        const passengersHtml = p.passengers.map((name, idx) => `
            <div class="journey-passenger-row">
                <input class="journey-input" type="text" value="${escapeHtml(name)}" placeholder="旅客姓名" data-passenger-idx="${idx}" onchange="window.updatePassenger(${idx}, this.value)">
                ${p.passengers.length > 1 ? `<button onclick="window.removePassenger(${idx})"><i class="fas fa-times"></i></button>` : ''}
            </div>
        `).join('');

        const seatsHtml = p.seats.map((seat, idx) => `
            <div class="journey-seat-row">
                <input class="journey-input" type="text" value="${escapeHtml(seat)}" placeholder="座位 ${idx+1}" data-seat-idx="${idx}" onchange="window.updateSeat(${idx}, this.value)">
                ${p.seats.length > 1 ? `<button onclick="window.removeSeat(${idx})"><i class="fas fa-times"></i></button>` : ''}
            </div>
        `).join('');

        const itineraryHtml = p.itinerary.map((item, idx) => `
            <div class="journey-itinerary-item">
                <i class="fas fa-map-marker-alt" style="color: var(--accent-color); font-size: 12px;"></i>
                <input type="text" value="${escapeHtml(item)}" placeholder="旅行事项" data-itinerary-idx="${idx}" onchange="window.updateItinerary(${idx}, this.value)">
                <button onclick="window.removeItineraryItem(${idx})"><i class="fas fa-times"></i></button>
            </div>
        `).join('');

        const bgPreview = p.bgImage
            ? `<div style="width:100%;height:120px;border-radius:8px;background-image:url(${p.bgImage});background-size:cover;background-position:center;border:1px solid var(--border-color);"></div>`
            : `<div style="width:100%;height:120px;border-radius:8px;background:linear-gradient(135deg,#eef2f5,#d5dbe3);border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:13px;">预览机票背景</div>`;

        container.innerHTML = `
            <div class="journey-plan-form">
                <div class="journey-form-row full">
                    <div class="form-group">
                        <label>机票背景</label>
                        <div class="journey-ticket-bg-controls" style="margin:0;">
                            <button onclick="window.uploadBgImage()"><i class="fas fa-upload"></i> 上传图片</button>
                            <button onclick="window.pasteBgUrl()"><i class="fas fa-link"></i> 图片链接</button>
                            ${p.bgImage ? `<button onclick="window.removeBgImage()" style="color:#ff4757;"><i class="fas fa-trash"></i> 移除</button>` : ''}
                        </div>
                        <div style="margin-top:6px;">${bgPreview}</div>
                    </div>
                </div>
                <div class="journey-form-row">
                    <div class="form-group">
                        <label>出发站</label>
                        <input class="journey-input" id="journey-origin" value="${escapeHtml(p.origin)}" placeholder="如 北京">
                    </div>
                    <div class="form-group">
                        <label>目的站</label>
                        <input class="journey-input" id="journey-dest" value="${escapeHtml(p.destination)}" placeholder="如 罗马">
                    </div>
                </div>
                <div class="journey-form-row">
                    <div class="form-group">
                        <label>旅客姓名 (一人及以上)</label>
                        <div class="journey-passengers" id="journey-passengers-container">
                            ${passengersHtml}
                        </div>
                        <div class="journey-add-passenger" onclick="window.addPassenger()" style="margin-top:6px;">
                            <i class="fas fa-plus"></i> 添加旅客
                        </div>
                    </div>
                    <div class="form-group">
                        <label>座位 (对应旅客人数)</label>
                        <div class="journey-seats" id="journey-seats-container">
                            ${seatsHtml}
                        </div>
                        <div class="journey-add-seat" onclick="window.addSeat()" style="margin-top:6px;">
                            <i class="fas fa-plus"></i> 添加座位
                        </div>
                    </div>
                </div>
                <div class="journey-form-row">
                    <div class="form-group">
                        <label>航班号</label>
                        <input class="journey-input" id="journey-flight" value="${escapeHtml(p.flight)}" placeholder="如 CP-0520">
                    </div>
                    <div class="form-group">
                        <label>日期</label>
                        <input class="journey-input" type="date" id="journey-date" value="${p.date || ''}">
                    </div>
                </div>
                <div class="journey-form-row">
                    <div class="form-group">
                        <label>登机口</label>
                        <input class="journey-input" id="journey-gate" value="${escapeHtml(p.gate)}" placeholder="如 13">
                    </div>
                    <div class="form-group">
                        <label>登机时间</label>
                        <input class="journey-input" type="time" id="journey-boarding" value="${p.boardingTime || ''}">
                    </div>
                </div>
                <div class="journey-form-row full">
                    <div class="form-group">
                        <label>舱位</label>
                        <input class="journey-input" id="journey-class" value="${escapeHtml(p.class)}" placeholder="如 头等舱">
                    </div>
                </div>

                <div class="journey-section-title">
                    <i class="fas fa-list-check"></i> 旅行计划
                </div>
                <div id="journey-itinerary-list">
                    ${itineraryHtml}
                </div>
                <button class="journey-add-passenger" onclick="window.addItineraryItem()" style="margin-top:4px;">
                    <i class="fas fa-plus"></i> 添加旅行计划事项
                </button>

                <button class="journey-save-btn" id="journey-save-plan" style="margin-top:8px;">
                    <i class="fas fa-save"></i> ${editingPlanId ? '更新计划' : '保存计划'}
                </button>
            </div>
            <div style="margin-top:20px;border-top:1px solid var(--border-color);padding-top:16px;">
                <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;">已保存的计划</div>
                <div id="journey-saved-plans"></div>
            </div>
        `;

        document.getElementById('journey-save-plan').addEventListener('click', function() {
            savePlan();
        });

        renderSavedPlans();
    }

    function renderSavedPlans() {
        const container = document.getElementById('journey-saved-plans');
        if (!container) return;

        const plans = journeyData.plans;
        if (plans.length === 0) {
            container.innerHTML = `<div class="journey-empty"><i class="fas fa-inbox"></i>暂无计划，创建你的第一个旅程吧</div>`;
            return;
        }

        container.innerHTML = plans.map(plan => {
            const itineraryCount = (plan.itinerary && plan.itinerary.length) ? plan.itinerary.length : 0;
            return `
            <div class="journey-plan-item">
                <div class="journey-plan-header">
                    <div class="journey-plan-title">${escapeHtml(plan.origin || '?')} <i class="fas fa-arrow-right" style="font-size:12px;"></i> ${escapeHtml(plan.destination || '?')}</div>
                    <div class="journey-plan-actions">
                        <button onclick="window.editPlan('${plan.id}')" title="编辑"><i class="fas fa-pen"></i></button>
                        <button class="danger" onclick="window.deletePlan('${plan.id}')" title="删除"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div class="journey-plan-detail">
                    <span>${escapeHtml(plan.flight || '--')}</span>
                    <span>${formatDate(plan.date) || '--'}</span>
                    <span>登机口 ${escapeHtml(plan.gate || '--')}</span>
                    <span>${formatTime(plan.boardingTime) || '--'}</span>
                    <span class="passengers">${plan.passengers ? plan.passengers.join(', ') : '--'}</span>
                </div>
                ${itineraryCount > 0 ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;"><i class="fas fa-list-check"></i> ${itineraryCount} 个旅行事项</div>` : ''}
                <div style="margin-top:8px;display:flex;gap:8px;">
                    <button class="journey-send-card" onclick="window.sendPlanToChat('${plan.id}')">
                        <i class="fas fa-paper-plane"></i> 发送机票
                    </button>
                    <button class="journey-send-card" style="background:rgba(var(--accent-color-rgb),0.12);" onclick="window.completePlan('${plan.id}')">
                        <i class="fas fa-check"></i> 完成并移入历史
                    </button>
                </div>
            </div>
        `}).join('');
    }

    // ==================== 历史界面渲染 ====================
    function renderHistoryView() {
        const container = document.getElementById('journey-content');
        if (!container) return;

        const history = journeyData.history;
        if (history.length === 0) {
            container.innerHTML = `<div class="journey-empty"><i class="fas fa-history"></i>还没有历史记录，完成计划后会自动移入</div>`;
            return;
        }

        container.innerHTML = history.map(entry => {
            const plan = entry;
            const items = entry.items || [];
            const doneCount = items.filter(item => item.done).length;

            return `
            <div class="journey-plan-item" style="border-left:3px solid var(--accent-color);">
                <div class="journey-plan-header">
                    <div class="journey-plan-title">${escapeHtml(plan.origin || '?')} <i class="fas fa-arrow-right" style="font-size:12px;"></i> ${escapeHtml(plan.destination || '?')}</div>
                    <div class="journey-plan-actions">
                        <button onclick="window.sendHistoryPlanToChat('${entry.id}')" title="发送机票+计划"><i class="fas fa-paper-plane"></i></button>
                        <button class="danger" onclick="window.deleteHistory('${entry.id}')" title="删除"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
                <div class="journey-plan-detail">
                    <span>${escapeHtml(plan.flight || '--')}</span>
                    <span>${formatDate(plan.date) || '--'}</span>
                    <span>登机口 ${escapeHtml(plan.gate || '--')}</span>
                    <span>${formatTime(plan.boardingTime) || '--'}</span>
                    <span class="passengers">${plan.passengers ? plan.passengers.join(', ') : '--'}</span>
                </div>
                <div style="margin-top:8px;font-size:12px;color:var(--text-secondary);">
                    事项 ${doneCount}/${items.length} 已完成
                </div>
                <div style="margin-top:6px;">
                    ${items.map((item, idx) => `
                        <div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid rgba(var(--accent-color-rgb),0.05);">
                            <label class="done-toggle" style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;">
                                <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.toggleHistoryItemDone('${entry.id}','${item.id}')">
                            </label>
                            <span style="font-size:13px;${item.done ? 'text-decoration:line-through;opacity:0.6;' : ''}">${escapeHtml(item.text || '事项')}</span>
                            ${item.media && item.media.length > 0 ? item.media.map(url => `<img src="${escapeHtml(url)}" style="width:32px;height:32px;border-radius:4px;object-fit:cover;cursor:pointer;" onclick="if(typeof viewImage==='function')viewImage('${escapeHtml(url.replace(/'/g,"\\'"))}')">`).join('') : ''}
                            <button style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:11px;padding:0 4px;" onclick="window.addHistoryItemMedia('${entry.id}','${item.id}')"><i class="fas fa-image"></i></button>
                            <button style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:11px;padding:0 4px;" onclick="window.addHistoryItemNote('${entry.id}','${item.id}')"><i class="fas fa-pen"></i></button>
                            ${item.note ? `<span style="font-size:11px;color:var(--text-secondary);background:var(--primary-bg);padding:2px 8px;border-radius:4px;">${escapeHtml(item.note)}</span>` : ''}
                        </div>
                    `).join('')}
                    <button class="journey-add-passenger" style="width:100%;margin-top:6px;" onclick="window.addHistoryItem('${entry.id}')">
                        <i class="fas fa-plus"></i> 添加事项
                    </button>
                </div>
                <div style="margin-top:8px;">
                    <button class="journey-send-card" onclick="window.sendHistoryPlanToChat('${entry.id}')">
                        <i class="fas fa-paper-plane"></i> 发送机票+计划
                    </button>
                </div>
            </div>
        `}).join('');
    }

    // ==================== 计划操作 ====================
    function collectFormData() {
        const origin = document.getElementById('journey-origin')?.value.trim() || '';
        const destination = document.getElementById('journey-dest')?.value.trim() || '';
        const flight = document.getElementById('journey-flight')?.value.trim() || '';
        const date = document.getElementById('journey-date')?.value || '';
        const gate = document.getElementById('journey-gate')?.value.trim() || '';
        const boardingTime = document.getElementById('journey-boarding')?.value || '';
        const classVal = document.getElementById('journey-class')?.value.trim() || '';

        // 只从旅客专属容器收集旅客
        const passengerContainer = document.getElementById('journey-passengers-container');
        let passengers = [];
        if (passengerContainer) {
            const inputs = passengerContainer.querySelectorAll('.journey-passenger-row input');
            passengers = Array.from(inputs).map(inp => inp.value.trim()).filter(n => n);
        } else {
            passengers = currentPlan.passengers.filter(n => n);
        }

        // 只从座位专属容器收集座位
        const seatsContainer = document.getElementById('journey-seats-container');
        let seats = [];
        if (seatsContainer) {
            const inputs = seatsContainer.querySelectorAll('.journey-seat-row input');
            seats = Array.from(inputs).map(inp => inp.value.trim()).filter(s => s);
        } else {
            seats = currentPlan.seats.filter(s => s);
        }

        // 收集旅行事项
        const itineraryContainer = document.getElementById('journey-itinerary-list');
        let itinerary = [];
        if (itineraryContainer) {
            const inputs = itineraryContainer.querySelectorAll('.journey-itinerary-item input');
            itinerary = Array.from(inputs).map(inp => inp.value.trim()).filter(t => t);
        } else {
            itinerary = currentPlan.itinerary.filter(t => t);
        }

        return { origin, destination, passengers, flight, date, gate, boardingTime, class: classVal, seats, itinerary };
    }

    async function savePlan() {
        const data = collectFormData();
        if (!data.origin || !data.destination) {
            showNotification('请填写出发站和目的站', 'warning');
            return;
        }
        if (data.passengers.length === 0) {
            showNotification('请至少填写一位旅客', 'warning');
            return;
        }

        // 更新 currentPlan
        currentPlan.origin = data.origin;
        currentPlan.destination = data.destination;
        currentPlan.passengers = data.passengers;
        currentPlan.flight = data.flight || 'CP-0520';
        currentPlan.date = data.date;
        currentPlan.gate = data.gate || '--';
        currentPlan.boardingTime = data.boardingTime;
        currentPlan.class = data.class || '头等舱';
        currentPlan.seats = data.seats;
        currentPlan.itinerary = data.itinerary;

        const plan = {
            id: editingPlanId || generateId(),
            origin: currentPlan.origin,
            destination: currentPlan.destination,
            passengers: [...currentPlan.passengers],
            flight: currentPlan.flight,
            date: currentPlan.date,
            gate: currentPlan.gate,
            boardingTime: currentPlan.boardingTime,
            class: currentPlan.class,
            seats: [...currentPlan.seats],
            itinerary: [...currentPlan.itinerary],
            bgImage: currentPlan.bgImage || null,
            createdAt: Date.now()
        };

        if (editingPlanId) {
            const idx = journeyData.plans.findIndex(p => p.id === editingPlanId);
            if (idx >= 0) {
                journeyData.plans[idx] = plan;
            }
            editingPlanId = null;
        } else {
            journeyData.plans.push(plan);
        }

        const saved = await saveJourneyData();
        if (!saved) return;

        // 保存后清空表单但保留背景图
        const bg = currentPlan.bgImage;
        currentPlan = {
            origin: '',
            destination: '',
            passengers: [''],
            flight: '',
            date: '',
            gate: '',
            boardingTime: '',
            class: '',
            seats: [],
            itinerary: [],
            bgImage: bg
        };
        editingPlanId = null;
        renderPlanView();
        showNotification('计划已保存', 'success');
        checkReminders();
    }

    // ==================== 全局操作方法 ====================
    // 旅客
    window.addPassenger = function() {
        currentPlan.passengers.push('');
        if (!currentPlan.seats) currentPlan.seats = [];
        currentPlan.seats.push('');
        renderPlanView();
    };

    window.removePassenger = function(idx) {
        if (currentPlan.passengers.length <= 1) {
            showNotification('至少保留一位旅客', 'warning');
            return;
        }
        currentPlan.passengers.splice(idx, 1);
        if (currentPlan.seats && currentPlan.seats.length > idx) {
            currentPlan.seats.splice(idx, 1);
        }
        renderPlanView();
    };

    window.updatePassenger = function(idx, val) {
        if (currentPlan.passengers[idx] !== undefined) {
            currentPlan.passengers[idx] = val;
        }
    };

    // 座位
    window.addSeat = function() {
        if (!currentPlan.seats) currentPlan.seats = [];
        currentPlan.seats.push('');
        renderPlanView();
    };

    window.removeSeat = function(idx) {
        if (!currentPlan.seats) currentPlan.seats = [];
        if (currentPlan.seats.length > 1) {
            currentPlan.seats.splice(idx, 1);
        } else {
            currentPlan.seats = [];
        }
        renderPlanView();
    };

    window.updateSeat = function(idx, val) {
        if (!currentPlan.seats) currentPlan.seats = [];
        if (currentPlan.seats[idx] !== undefined) {
            currentPlan.seats[idx] = val;
        } else {
            while (currentPlan.seats.length <= idx) {
                currentPlan.seats.push('');
            }
            currentPlan.seats[idx] = val;
        }
    };

    // 旅行计划事项
    window.addItineraryItem = function() {
        if (!currentPlan.itinerary) currentPlan.itinerary = [];
        currentPlan.itinerary.push('');
        renderPlanView();
    };

    window.removeItineraryItem = function(idx) {
        if (!currentPlan.itinerary) currentPlan.itinerary = [];
        currentPlan.itinerary.splice(idx, 1);
        renderPlanView();
    };

    window.updateItinerary = function(idx, val) {
        if (!currentPlan.itinerary) currentPlan.itinerary = [];
        if (currentPlan.itinerary[idx] !== undefined) {
            currentPlan.itinerary[idx] = val;
        }
    };

    // 背景图
    window.uploadBgImage = function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 5 * 1024 * 1024) {
                showNotification('图片不能超过5MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(ev) {
                currentPlan.bgImage = ev.target.result;
                renderPlanView();
                showNotification('背景已更新', 'success');
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    window.pasteBgUrl = function() {
        const url = prompt('请输入图片链接：');
        if (url && url.trim()) {
            if (url.match(/^https?:\/\/.+/)) {
                currentPlan.bgImage = url.trim();
                renderPlanView();
                showNotification('背景已更新', 'success');
            } else {
                showNotification('请输入有效的图片链接', 'error');
            }
        }
    };

    window.removeBgImage = function() {
        currentPlan.bgImage = null;
        renderPlanView();
        showNotification('背景已移除', 'success');
    };

    window.editPlan = function(id) {
        const plan = journeyData.plans.find(p => p.id === id);
        if (!plan) return;
        editingPlanId = id;
        currentPlan = {
            origin: plan.origin || '',
            destination: plan.destination || '',
            passengers: plan.passengers ? [...plan.passengers] : [''],
            flight: plan.flight || '',
            date: plan.date || '',
            gate: plan.gate || '',
            boardingTime: plan.boardingTime || '',
            class: plan.class || '',
            seats: plan.seats ? [...plan.seats] : [],
            itinerary: plan.itinerary ? [...plan.itinerary] : [],
            bgImage: plan.bgImage || null
        };
        // 确保数量匹配
        while (currentPlan.seats.length < currentPlan.passengers.length) {
            currentPlan.seats.push('');
        }
        renderPlanView();
    };

    window.deletePlan = function(id) {
        if (!confirm('确定要删除这个计划吗？')) return;
        journeyData.plans = journeyData.plans.filter(p => p.id !== id);
        saveJourneyData();
        renderPlanView();
        showNotification('计划已删除', 'success');
    };

    window.sendPlanToChat = function(id) {
        const plan = journeyData.plans.find(p => p.id === id);
        if (!plan) return;
        const cardHtml = buildTicketCardHtml(plan);
        sendJourneyCard(cardHtml);
        showNotification('机票已发送', 'success');
    };

    window.completePlan = function(id) {
        const plan = journeyData.plans.find(p => p.id === id);
        if (!plan) return;
        if (!confirm(`将「${plan.origin} → ${plan.destination}」移入历史记录？`)) return;

        // 创建历史条目
        const items = [];
        // 自动为每个旅客创建事项
        if (plan.passengers) {
            plan.passengers.forEach((passenger, idx) => {
                items.push({
                    id: 'item_' + Date.now() + '_' + idx,
                    text: passenger + ' 登机',
                    done: false,
                    media: [],
                    note: ''
                });
            });
        }
        // 添加旅行计划中的事项
        if (plan.itinerary) {
            plan.itinerary.forEach((item, idx) => {
                items.push({
                    id: 'item_' + Date.now() + '_itin_' + idx,
                    text: item,
                    done: false,
                    media: [],
                    note: ''
                });
            });
        }

        const historyEntry = {
            id: generateId(),
            origin: plan.origin,
            destination: plan.destination,
            passengers: plan.passengers,
            flight: plan.flight,
            date: plan.date,
            gate: plan.gate,
            boardingTime: plan.boardingTime,
            class: plan.class,
            seats: plan.seats,
            itinerary: plan.itinerary,
            bgImage: plan.bgImage,
            sentAt: Date.now(),
            items: items
        };

        journeyData.history.push(historyEntry);
        journeyData.plans = journeyData.plans.filter(p => p.id !== id);
        saveJourneyData();

        const activeTab = document.querySelector('.journey-tab.active');
        if (activeTab && activeTab.dataset.tab === 'plan') {
            renderPlanView();
        } else {
            renderHistoryView();
        }
        showNotification('已移入历史', 'success');
    };

    // ==================== 历史操作 ====================
    window.sendHistoryPlanToChat = function(id) {
        const entry = journeyData.history.find(h => h.id === id);
        if (!entry) return;
        const ticketCard = buildTicketCardHtml(entry);
        let itemsHtml = '';
        if (entry.items && entry.items.length > 0) {
            itemsHtml = entry.items.map(item => {
                const status = item.done ? '<i class="fas fa-check-circle" style="color:#4cd964;"></i>' : '<i class="far fa-circle"></i>';
                const note = item.note ? ` <span style="font-size:10px;color:var(--text-secondary);">(${escapeHtml(item.note)})</span>` : '';
                return `${status} ${escapeHtml(item.text)}${note}`;
            }).join('<br>');
        }
        const fullCard = `
        ${ticketCard}
        <div style="margin-top: 8px; padding: 12px; background: var(--primary-bg); border-radius: 10px; border-left: 3px solid var(--accent-color); max-width: 320px;">
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                <i class="fas fa-list-check"></i> 旅程计划
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.8;">${itemsHtml || '无事项'}</div>
        </div>`;
        sendJourneyCard(fullCard);
        showNotification('已发送机票+计划', 'success');
    };

    window.deleteHistory = function(id) {
        if (!confirm('确定要删除这条历史记录吗？')) return;
        journeyData.history = journeyData.history.filter(h => h.id !== id);
        saveJourneyData();
        renderHistoryView();
        showNotification('已删除', 'success');
    };

    window.toggleHistoryItemDone = function(historyId, itemId) {
        const entry = journeyData.history.find(h => h.id === historyId);
        if (!entry) return;
        const item = entry.items.find(i => i.id === itemId);
        if (!item) return;
        item.done = !item.done;
        saveJourneyData();
        renderHistoryView();
    };

    window.addHistoryItem = function(historyId) {
        const entry = journeyData.history.find(h => h.id === historyId);
        if (!entry) return;
        const text = prompt('输入新事项：');
        if (text && text.trim()) {
            entry.items.push({
                id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                text: text.trim(),
                done: false,
                media: [],
                note: ''
            });
            saveJourneyData();
            renderHistoryView();
            showNotification('事项已添加', 'success');
        }
    };

    window.addHistoryItemMedia = function(historyId, itemId) {
        const entry = journeyData.history.find(h => h.id === historyId);
        if (!entry) return;
        const item = entry.items.find(i => i.id === itemId);
        if (!item) return;

        const choice = confirm('点击"确定"上传本地图片，点击"取消"使用图片链接');
        if (choice) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('图片不能超过5MB', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = async function(ev) {
                    if (!item.media) item.media = [];
                    item.media.push(ev.target.result);
                    const saved = await saveJourneyData();
                    if (!saved) return;
                    renderHistoryView();
                    showNotification('图片已添加', 'success');
                };
                reader.readAsDataURL(file);
            };
            input.click();
        } else {
            const url = prompt('请输入图片链接：');
            if (url && url.trim()) {
                if (!item.media) item.media = [];
                item.media.push(url.trim());
                saveJourneyData();
                renderHistoryView();
                showNotification('图片已添加', 'success');
            }
        }
    };

    window.addHistoryItemNote = function(historyId, itemId) {
        const entry = journeyData.history.find(h => h.id === historyId);
        if (!entry) return;
        const item = entry.items.find(i => i.id === itemId);
        if (!item) return;
        const note = prompt('输入备注：', item.note || '');
        if (note !== null) {
            item.note = note.trim();
            saveJourneyData();
            renderHistoryView();
            showNotification('备注已保存', 'success');
        }
    };

    // ==================== 发送卡片到聊天 ====================
    function sendJourneyCard(html) {
        if (typeof addMessage === 'function') {
            addMessage({
                id: Date.now() + Math.random(),
                sender: 'user',
                text: html,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                webEmbed: true
            });
            if (typeof playSound === 'function') playSound('send');
        } else if (typeof messages !== 'undefined') {
            messages.push({
                id: Date.now() + Math.random(),
                sender: 'user',
                text: html,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                webEmbed: true
            });
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(false);
        }
    }

    // ==================== 提醒系统 ====================
    function checkReminders() {
        const now = Date.now();
        const plans = journeyData.plans;
        plans.forEach(plan => {
            if (!plan.date || !plan.boardingTime) return;
            try {
                const dateTimeStr = plan.date + 'T' + plan.boardingTime + ':00';
                const boardingMoment = new Date(dateTimeStr).getTime();
                if (isNaN(boardingMoment)) return;
                const diff = boardingMoment - now;
                if (diff > 0 && diff <= 10800000) {
                    if (!plan._reminded) {
                        plan._reminded = true;
                        saveJourneyData();
                        const msg = `[旅程提醒] 前往 ${plan.destination} 的航班 ${plan.flight || ''} 将在 ${formatTime(plan.boardingTime)} 登机，请做好准备！`;
                        if (typeof addMessage === 'function') {
                            addMessage({
                                id: Date.now() + Math.random(),
                                sender: 'system',
                                text: msg,
                                timestamp: new Date(),
                                type: 'system'
                            });
                        } else if (typeof messages !== 'undefined') {
                            messages.push({
                                id: Date.now() + Math.random(),
                                sender: 'system',
                                text: msg,
                                timestamp: new Date(),
                                type: 'system'
                            });
                            if (typeof throttledSaveData === 'function') throttledSaveData();
                            if (typeof renderMessages === 'function') renderMessages(false);
                        }
                        showNotification('航班提醒已发送', 'info');
                    }
                }
            } catch(e) {}
        });
    }

    setInterval(checkReminders, 60000);

    // ==================== 标签切换 ====================
    function switchTab(tabId) {
        document.querySelectorAll('.journey-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        if (tabId === 'plan') {
            editingPlanId = null;
            const bg = currentPlan.bgImage;
            currentPlan = {
                origin: '',
                destination: '',
                passengers: [''],
                flight: '',
                date: '',
                gate: '',
                boardingTime: '',
                class: '',
                seats: [],
                itinerary: [],
                bgImage: bg
            };
            renderPlanView();
        } else {
            renderHistoryView();
        }
    }

    // ==================== 初始化 ====================
    async function initJourney() {
        await loadJourneyData();

        const entryBtn = document.getElementById('journey-function');
        if (!entryBtn || entryBtn.dataset.journeyBound === '1') return;
        entryBtn.dataset.journeyBound = '1';
        entryBtn.addEventListener('click', async function() {
            const inviteModal = document.getElementById('invite-modal');
            if (inviteModal) hideModal(inviteModal);
            await loadJourneyData();
            currentPlan = {
                origin: '',
                destination: '',
                passengers: [''],
                flight: '',
                date: '',
                gate: '',
                boardingTime: '',
                class: '',
                seats: [],
                itinerary: [],
                bgImage: null
            };
            editingPlanId = null;
            renderPlanView();
            showModal(document.getElementById('journey-modal'));
        });

        document.querySelectorAll('.journey-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                switchTab(this.dataset.tab);
            });
        });

        document.getElementById('journey-close').addEventListener('click', function() {
            hideModal(document.getElementById('journey-modal'));
        });

        renderPlanView();
        setTimeout(checkReminders, 5000);
    }

    window.journey = {
        loadJourneyData,
        saveJourneyData,
        renderPlanView,
        renderHistoryView,
        switchTab,
        sendJourneyCard,
        checkReminders
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initJourney);
    } else {
        setTimeout(initJourney, 800);
    }

})();
