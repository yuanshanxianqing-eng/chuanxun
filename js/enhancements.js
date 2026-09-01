/* 传讯扩展桥：只把参考功能接入现有框架，不接管原页面结构。 */
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const esc = value => { const n = document.createElement('div'); n.textContent = String(value == null ? '' : value); return n.innerHTML; };
    const notify = (text, type) => typeof showNotification === 'function' && showNotification(text, type || 'info');
    const save = () => typeof throttledSaveData === 'function' && throttledSaveData();

    function injectFeatureModals() {
        const host = document.createElement('div');
        host.id = 'enhancement-modals';
        host.innerHTML = `
        <div class="modal" id="transfer-modal"><div class="modal-content redpacket-send-content">
            <div class="redpacket-send-head"><span><i class="fas fa-envelope"></i></span><div><b>发红包</b><small>把心意放进聊天里</small></div></div>
            <div class="redpacket-send-form"><div class="redpacket-amount"><span>¥</span><input id="transfer-amount-input" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="0.00"></div>
            <div id="transfer-amount-label">¥0.00</div><input class="modal-input" id="rp-send-greeting" maxlength="20" placeholder="恭喜发财，大吉大利"><div id="transfer-amount-hint"></div>
            <div class="redpacket-presets">${['6.66','8.88','52.00','520.00','1314.00'].map(v=>`<button class="transfer-preset" data-amt="${v}">${v}</button>`).join('')}</div>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="transfer-cancel-btn">取消</button><button class="modal-btn modal-btn-primary" id="transfer-confirm-btn">塞钱进红包</button></div></div>
        </div></div>
        <div class="modal" id="rp-record-modal"><div class="modal-content"><div class="modal-title"><i class="fas fa-clock-rotate-left"></i><span>红包记录</span></div>
            <div class="enhancement-tabbar"><button class="active" id="rp-record-tab-partner" onclick="TransferFeature.switchRecord('partner')">梦角</button><button id="rp-record-tab-me" onclick="TransferFeature.switchRecord('me')">我</button></div>
            <div id="rp-record-list" class="rp-record-list"></div><div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="close-rp-record">关闭</button></div></div></div>
        <div class="redpacket-open-modal" id="redpacket-open-modal"><div class="redpacket-open-inner"><button class="redpacket-open-close" onclick="TransferFeature.closeOpen()"><i class="fas fa-times"></i></button>
            <div class="redpacket-open-body" id="redpacket-open-body"><div class="redpacket-open-heart"><i class="fas fa-heart"></i></div><div class="redpacket-open-name" id="rp-open-name"></div><div class="redpacket-open-greeting" id="rp-open-greeting"></div><div class="redpacket-open-amount" id="rp-open-amount">¥0.00</div></div>
            <div class="redpacket-open-foot"><button class="redpacket-open-btn" id="rp-open-btn" onclick="TransferFeature.openIt()">开</button></div></div></div>
        <div class="modal" id="poke-library-modal"><div class="modal-content poke-library-card"><div class="modal-title"><i class="fas fa-box-archive"></i><span>我的拍一拍库</span></div>
            <p class="enhancement-hint">勾选要放进快捷动作栏的字卡，最多 6 个。</p><div id="poke-library-list"></div>
            <div class="poke-add-row"><input class="modal-input" id="poke-library-input" maxlength="40" placeholder="输入新的拍一拍字卡"><button class="modal-btn modal-btn-primary" id="poke-library-add">添加</button></div>
            <button class="modal-btn modal-btn-secondary poke-preset-add" id="poke-library-presets"><i class="fas fa-wand-magic-sparkles"></i> 添加预设字卡</button>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="poke-library-close">完成</button></div></div></div>
        <div class="modal" id="companion-diary-modal"><div class="modal-content cd-modal-content">
            <div class="cd-header"><div class="cd-title"><i class="fas fa-book"></i><span>陪伴日记</span></div><button class="cd-stats-btn" id="cd-stats-btn"><i class="fas fa-chart-pie"></i><span>统计</span></button></div>
            <div class="cd-toolbar"><button class="cd-month-display" id="cd-month-display"><span id="cd-month-text"></span><i class="fas fa-chevron-down"></i></button><div class="cd-filters">
                <div class="cd-chip" id="cd-chip-mode"><span id="cd-chip-mode-label">种类</span><i class="fas fa-chevron-down"></i><div class="cd-dropdown"><div class="cd-dropdown-item" data-val="all">全部</div><div class="cd-dropdown-item" data-val="study">学习</div><div class="cd-dropdown-item" data-val="work">工作</div><div class="cd-dropdown-item" data-val="exercise">运动</div><div class="cd-dropdown-item" data-val="sleep">睡觉</div><div class="cd-dropdown-item" data-val="distance">距离</div></div></div>
                <div class="cd-chip" id="cd-chip-init"><span id="cd-chip-init-label">邀请</span><i class="fas fa-chevron-down"></i><div class="cd-dropdown"><div class="cd-dropdown-item" data-val="all">全部</div><div class="cd-dropdown-item" data-val="partner" data-name-partner>梦角邀请</div><div class="cd-dropdown-item" data-val="user" data-name-me>我邀请</div><div class="cd-dropdown-item" data-val="missed" data-name-missed>我错过了</div></div></div>
            </div></div>
            <div class="cd-cal-popup" id="cd-cal-popup"><div class="cd-cal-year"><button id="cd-cal-prev-year"><i class="fas fa-chevron-left"></i></button><span id="cd-cal-year-label"></span><button id="cd-cal-next-year"><i class="fas fa-chevron-right"></i></button></div><div id="cd-cal-months"></div></div>
            <div class="cd-body"><div class="cd-pages" id="cd-pages"></div></div>
            <div class="cd-stats-view" id="cd-stats-view"><button class="cd-stats-back" id="cd-stats-back"><i class="fas fa-arrow-left"></i> 返回日记</button><div class="cd-totals"><div><b id="cd-total-count">0</b><span>累计陪伴次数</span></div><div><b id="cd-total-duration">0min</b><span>累计陪伴时长</span></div></div><div class="cd-chart-grid"><div><canvas id="cd-pie-init" width="120" height="120"></canvas><div id="cd-legend-init"></div></div><div><canvas id="cd-pie-mode" width="120" height="120"></canvas><div id="cd-legend-mode"></div></div></div></div>
            <details class="diary-bg-settings"><summary>日记背景</summary><input type="file" id="diary-bg-input" accept="image/*"><button id="diary-bg-reset">恢复默认</button><div id="diary-bg-list"></div></details>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="cd-back-btn">返回</button><button class="modal-btn modal-btn-secondary" id="close-companion-diary">关闭</button></div>
        </div></div>
        <div class="modal" id="cd-note-edit-modal"><div class="modal-content"><div class="modal-title"><i class="fas fa-pen"></i><span>编辑备注</span></div><div id="cd-note-edit-info"></div><textarea class="modal-textarea" id="cd-note-edit-textarea" rows="4"></textarea><div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="cd-note-edit-cancel">取消</button><button class="modal-btn modal-btn-primary" id="cd-note-edit-save">保存</button></div></div></div>`;
        document.body.appendChild(host);
    }

    function injectQuestionnaireModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'ask-batch-modal';
        modal.innerHTML = `<div class="modal-content ask-batch-modal-content">
            <div class="modal-title ask-batch-title"><i class="fas fa-circle-question"></i><span>问问你</span><small>可以一次放入多个问题</small></div>
            <div class="ask-batch-list" id="ask-batch-list"></div>
            <button type="button" class="ask-add-question" id="ask-add-question"><i class="fas fa-plus"></i> 添加一个问题</button>
            <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="ask-batch-cancel">取消</button><button class="modal-btn modal-btn-primary" id="ask-batch-send">发送全部问题</button></div>
        </div>`;
        document.body.appendChild(modal);
    }

    function bindMenus() {
        const moreButton = $('more-btn'), morePanel = $('more-panel');
        moreButton && morePanel && moreButton.addEventListener('click', e => { e.stopPropagation(); const opening = !morePanel.classList.contains('open'); document.querySelectorAll('.composer-mini-menu.open').forEach(x => x.classList.remove('open')); morePanel.classList.toggle('open', opening); });
        document.addEventListener('click', e => { if (!e.target.closest('.composer-popover-anchor')) document.querySelectorAll('.composer-mini-menu.open').forEach(x => x.classList.remove('open')); });
        $('continue-choice-btn')?.addEventListener('click', () => { $('continue-btn')?.click(); $('conversation-action-panel')?.classList.remove('open'); });
        $('batch-choice-btn')?.addEventListener('click', () => { $('batch-btn')?.click(); $('conversation-action-panel')?.classList.remove('open'); });
        const action = $('conversation-action-btn'), actionPanel = $('conversation-action-panel');
        action?.addEventListener('click', e => {
            e.stopPropagation();
            const opening = !actionPanel?.classList.contains('open');
            document.querySelectorAll('.composer-mini-menu.open').forEach(x => x.classList.remove('open'));
            actionPanel?.classList.toggle('open', opening);
        });
        $('more-image-btn')?.addEventListener('click', () => $('image-input')?.click());
        $('more-redpacket-btn')?.addEventListener('click', () => window.TransferFeature?.open());
        $('more-redpacket-record-btn')?.addEventListener('click', () => window.TransferFeature?.openRecord());
        $('more-questionnaire-btn')?.addEventListener('click', () => { $('more-panel')?.classList.remove('open'); window.QuestionnaireFeature?.open(); });
        $('cinema-function')?.addEventListener('click', () => { if (typeof hideModal === 'function') hideModal($('invite-modal')); window.openEntertainment?.(); });
    }

    function bindSettings() {
        document.querySelectorAll('.enhancement-toggle').forEach(row => {
            if (row.dataset.enhancementBound === '1') return;
            row.dataset.enhancementBound = '1';
            const key = row.dataset.setting;
            const sync = () => row.classList.toggle('active', settings[key] !== false && (key !== 'combineReplyCards' || !!settings[key]));
            row.addEventListener('click', () => { settings[key] = !(settings[key] !== false && (key !== 'combineReplyCards' || !!settings[key])); sync(); save(); });
            sync();
        });
        const diary = $('companion-diary-function');
        diary?.addEventListener('click', () => { if (typeof hideModal === 'function') hideModal($('advanced-modal')); if (typeof showModal === 'function') showModal($('companion-diary-modal')); });
        $('cd-back-btn')?.addEventListener('click', () => { hideModal($('companion-diary-modal')); showModal($('advanced-modal')); });
    }

    const soundItems = [
        ['my_send','我的发送音'],['partner_message','梦角消息音'],['my_poke','我的拍一拍'],['partner_poke','梦角拍一拍'],
        ['invite_study','学习邀约'],['invite_work','工作邀约'],['invite_exercise','运动邀约'],['invite_sleep','睡觉邀约'],['invite_videocall','视频邀约']
    ];
    function renderSoundSettings() {
        const root = $('sound-matrix'); if (!root) return;
        settings.soundProfiles = settings.soundProfiles || {};
        root.innerHTML = '<p class="cs-group-label">分类音效</p>' + soundItems.map(([key,label]) => { const p=settings.soundProfiles[key]||{}; return `<div class="sound-profile-row" data-sound="${key}"><div class="sound-profile-head"><b>${label}</b><button class="sound-test-btn" type="button"><i class="fas fa-play"></i></button></div><select><option value="default">默认</option><option value="kakaotalk">KakaoTalk</option><option value="soft">轻柔</option><option value="low">低沉</option><option value="warm">温暖</option><option value="dark">暗色</option><option value="haze">雾感</option><option value="mute">静音</option><option value="custom">自定义</option></select><div class="sound-custom-row"><input value="${esc(p.url||'')}" placeholder="音频 URL"><label><i class="fas fa-upload"></i><input type="file" accept="audio/*"></label></div></div>`; }).join('');
        root.querySelectorAll('.sound-profile-row').forEach(row => {
            const key=row.dataset.sound, p=settings.soundProfiles[key]||(settings.soundProfiles[key]={}), sel=row.querySelector('select'), url=row.querySelector('.sound-custom-row input'), file=row.querySelector('input[type=file]');
            sel.value=p.preset||'default'; row.classList.toggle('custom',sel.value==='custom');
            sel.onchange=()=>{p.preset=sel.value;row.classList.toggle('custom',sel.value==='custom');save();};
            url.onchange=()=>{p.url=url.value.trim();p.preset=p.url?'custom':sel.value;sel.value=p.preset;row.classList.toggle('custom',p.preset==='custom');save();};
            file.onchange=()=>{const f=file.files[0];if(!f)return;const reader=new FileReader();reader.onload=()=>{p.url=reader.result;p.preset='custom';url.value='已上传本地音频';sel.value='custom';row.classList.add('custom');save();};reader.readAsDataURL(f);};
            row.querySelector('.sound-test-btn').onclick=()=>window.EnhancementUI.playProfile(key);
        });
    }

    const presets = ['拍了拍对方的头','戳了戳对方的脸颊','抱住了对方','给对方比了个心','牵起了对方的手','看着对方发呆'];
    window.PokeLibraryFeature = {
        getQuick(all) { const picked=(settings.quickPokes||[]).filter(x=>all.includes(x)); return picked.length ? picked.slice(0,6) : all.slice(0,6); },
        open() { this.render(); showModal($('poke-library-modal')); },
        render() { const root=$('poke-library-list'); if(!root)return; const selected=settings.quickPokes||[]; root.innerHTML=customPokes.map((text,i)=>`<div class="poke-library-row"><label><input type="checkbox" data-poke-index="${i}" ${selected.includes(text)?'checked':''}><span>${esc(text)}</span></label><button data-delete-poke="${i}" title="删除"><i class="fas fa-trash"></i></button></div>`).join('') || '<div class="enhancement-empty">还没有字卡</div>'; root.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.onchange=()=>{let list=settings.quickPokes||[];const text=customPokes[+cb.dataset.pokeIndex];if(cb.checked){if(list.length>=6){cb.checked=false;notify('快捷动作栏最多放 6 个','warning');return;}if(!list.includes(text))list.push(text);}else list=list.filter(x=>x!==text);settings.quickPokes=list;save();});root.querySelectorAll('[data-delete-poke]').forEach(btn=>btn.onclick=()=>{const i=+btn.dataset.deletePoke;const removed=customPokes.splice(i,1)[0];settings.quickPokes=(settings.quickPokes||[]).filter(x=>x!==removed);save();this.render();}); }
    };
    function bindPokeLibrary() {
        $('poke-library-add')?.addEventListener('click',()=>{const input=$('poke-library-input'),v=input.value.trim();if(!v)return;if(!customPokes.includes(v))customPokes.push(v);input.value='';save();window.PokeLibraryFeature.render();});
        $('poke-library-presets')?.addEventListener('click',()=>{presets.forEach(v=>{if(!customPokes.includes(v))customPokes.push(v);});save();window.PokeLibraryFeature.render();notify('预设字卡已加入','success');});
        $('poke-library-close')?.addEventListener('click',()=>hideModal($('poke-library-modal')));
    }

    let askDrafts = [];
    const freshAsk = () => ({ id: Date.now() + Math.random(), question: '', mode: 'single', options: ['', ''] });
    function renderAskDrafts() {
        const root = $('ask-batch-list'); if (!root) return;
        root.innerHTML = askDrafts.map((item, index) => `<section class="ask-editor-card" data-ask-index="${index}">
            <div class="ask-editor-head"><span>问题 ${index + 1}</span>${askDrafts.length > 1 ? '<button type="button" data-ask-remove title="删除问题"><i class="fas fa-trash"></i></button>' : ''}</div>
            <textarea data-ask-question placeholder="输入你想问的问题…">${esc(item.question)}</textarea>
            <div class="ask-mode-row"><span>回答方式</span><div><button type="button" data-ask-mode="single" class="${item.mode === 'single' ? 'active' : ''}">单选</button><button type="button" data-ask-mode="multiple" class="${item.mode === 'multiple' ? 'active' : ''}">多选</button></div></div>
            <div class="ask-option-list">${item.options.map((option, optionIndex) => `<div class="ask-option-row"><span>${String.fromCharCode(65 + optionIndex)}</span><input data-ask-option="${optionIndex}" value="${esc(option)}" placeholder="输入选项内容…"><button type="button" data-ask-option-remove="${optionIndex}" ${item.options.length <= 2 ? 'disabled' : ''}><i class="fas fa-xmark"></i></button></div>`).join('')}</div>
            <button type="button" class="ask-option-add" data-ask-option-add><i class="fas fa-plus"></i> 添加选项</button>
        </section>`).join('');
        root.querySelectorAll('.ask-editor-card').forEach(card => {
            const i = Number(card.dataset.askIndex), item = askDrafts[i];
            card.querySelector('[data-ask-question]').oninput = e => item.question = e.target.value;
            card.querySelectorAll('[data-ask-mode]').forEach(btn => btn.onclick = () => { item.mode = btn.dataset.askMode; renderAskDrafts(); });
            card.querySelectorAll('[data-ask-option]').forEach(input => input.oninput = e => item.options[Number(input.dataset.askOption)] = e.target.value);
            card.querySelectorAll('[data-ask-option-remove]').forEach(btn => btn.onclick = () => { if (item.options.length <= 2) return; item.options.splice(Number(btn.dataset.askOptionRemove), 1); renderAskDrafts(); });
            card.querySelector('[data-ask-option-add]').onclick = () => { if (item.options.length >= 10) return notify('每个问题最多 10 个选项', 'info'); item.options.push(''); renderAskDrafts(); };
            card.querySelector('[data-ask-remove]')?.addEventListener('click', () => { askDrafts.splice(i, 1); renderAskDrafts(); });
        });
    }
    function scheduleQuestionnaireAnswer(questions) {
        const min = Number(settings.replyDelayMin) || 3000;
        const max = Math.max(min, Number(settings.replyDelayMax) || 7000);
        setTimeout(() => {
            const answered = questions.map(item => {
                const shuffled = item.options.slice().sort(() => Math.random() - 0.5);
                const count = item.mode === 'multiple' ? Math.max(1, Math.min(shuffled.length, 1 + Math.floor(Math.random() * Math.min(3, shuffled.length)))) : 1;
                return { ...item, answer: shuffled.slice(0, count) };
            });
            addMessage({ id: Date.now() + Math.random(), sender: settings.partnerName || '梦角', text: '回答了你的问卷', questions: answered, timestamp: new Date(), status: 'received', type: 'question-batch' });
            messages.forEach(message => { if (message.sender === 'user' && message.status !== 'read') message.status = 'read'; });
            save();
            if (typeof window._sendPartnerNotification === 'function') window._sendPartnerNotification(settings.partnerName || '梦角', `回答了你的 ${questions.length} 个问题`);
        }, min + Math.random() * (max - min));
    }
    window.QuestionnaireFeature = {
        open() { askDrafts = [freshAsk()]; renderAskDrafts(); showModal($('ask-batch-modal')); },
        add() { if (askDrafts.length >= 10) return notify('一次最多询问 10 个问题', 'info'); askDrafts.push(freshAsk()); renderAskDrafts(); },
        send() {
            const questions = askDrafts.map(item => ({ question: item.question.trim(), mode: item.mode, options: item.options.map(v => v.trim()).filter(Boolean) }));
            if (questions.some(item => !item.question)) return notify('请把每个问题填写完整', 'warning');
            if (questions.some(item => item.options.length < 2)) return notify('每个问题至少需要 2 个选项', 'warning');
            hideModal($('ask-batch-modal'));
            addMessage({ id: Date.now() + Math.random(), sender: 'user', text: `向${settings.partnerName || '梦角'}提出了 ${questions.length} 个问题`, questions, timestamp: new Date(), status: 'sent', type: 'question-batch' });
            scheduleQuestionnaireAnswer(questions);
            notify(`已发送 ${questions.length} 个问题`, 'success');
        }
    };
    function bindQuestionnaire() {
        $('ask-add-question')?.addEventListener('click', () => window.QuestionnaireFeature.add());
        $('ask-batch-cancel')?.addEventListener('click', () => hideModal($('ask-batch-modal')));
        $('ask-batch-send')?.addEventListener('click', () => window.QuestionnaireFeature.send());
    }

    function avatarHtml(isUser) {
        const el = isUser ? document.getElementById('user-avatar') : document.getElementById('partner-avatar');
        const img = el?.querySelector('img'); return img ? `<img src="${esc(img.src)}" alt="">` : '<i class="fas fa-user"></i>';
    }
    window.EnhancementUI = {
        renderRedpacket(msg) {
            const own=msg.sender==='user', wrap=document.createElement('div'); wrap.className=`message-wrapper ${own?'sent':'received'} redpacket-message-wrap`; wrap.dataset.id=msg.id;
            wrap.innerHTML=`<div class="message-avatar">${avatarHtml(own)}</div><div class="message-content-wrapper"><button class="redpacket-card ${msg.opened?'opened':''}" type="button"><div class="redpacket-card-main"><i class="fas fa-envelope-open-text"></i><div><strong>${esc(msg.text||'恭喜发财，大吉大利')}</strong><span>${msg.opened?'红包已领取':'领取红包'}</span></div></div><div class="redpacket-card-foot">传讯红包 · ¥${Number(msg.amount||0).toFixed(2)}</div></button></div>`;
            wrap.querySelector('.redpacket-card').onclick=()=>window.TransferFeature?.openRedpacket(msg.id); return wrap;
        },
        renderCinemaInvite(msg) {
            const d=msg.cinemaInviteData||{}, own=d.state==='pending'||d.state==='declined'||msg.sender==='user', wrap=document.createElement('div');wrap.className=`message-wrapper ${own?'sent':'received'} cinema-invite-msg-wrap`;wrap.dataset.id=msg.id;
            let actions=d.state==='countered'?'<div class="cinema-invite-card-actions"><button data-invite-action="reschedule">换时间</button><button data-invite-action="changemovie">换片</button><button data-invite-action="decline">拒绝</button><button class="primary" data-invite-action="accept">同意</button></div>':`<div class="cinema-invite-card-status">${d.state==='accepted'?'约定成功':d.state==='declined'?'下次吧':'等待回复中…'}</div>`;
            wrap.innerHTML=`<div class="message-avatar">${avatarHtml(own)}</div><div class="message-content-wrapper"><div class="cinema-invite-card" data-invite-id="${esc(d.negoId||'')}"><div class="cinema-invite-card-banner">CINEMA</div><strong>${esc(d.movieTitle||'电影邀约')}</strong><span>${esc((d.dateStr||'')+' '+(d.timeStr||''))}</span>${actions}</div></div>`;return wrap;
        },
        renderQuestionnaire(msg) {
            const own = msg.sender === 'user', wrap = document.createElement('div');
            wrap.className = `message-wrapper ${own ? 'sent' : 'received'} question-batch-wrap`;
            wrap.dataset.id = msg.id;
            const questions = Array.isArray(msg.questions) ? msg.questions : [];
            const cards = questions.map((item, index) => {
                const answers = Array.isArray(item.answer) ? item.answer : [];
                const options = (item.options || []).map((option, optionIndex) => `<div class="question-option ${answers.includes(option) ? 'chosen' : ''}"><span class="question-opt-tag">${String.fromCharCode(65 + optionIndex)}</span><span class="question-opt-text">${esc(option)}</span>${answers.includes(option) ? '<span class="question-opt-check">✓</span>' : ''}</div>`).join('');
                return `<section class="question-card ${answers.length ? 'question-card-answer' : ''}"><div class="question-card-q"><span class="question-card-icon">${answers.length ? '💌' : '🌸'}</span><span class="question-card-text">${esc(item.question)}</span><span class="question-mode-tag">${item.mode === 'multiple' ? '多选' : '单选'}</span></div><div class="question-card-sep"></div><div class="question-card-options">${options}</div>${answers.length ? `<div class="question-answer-line"><span class="question-answer-label">TA 的选择</span><span class="question-answer-val">${esc(answers.join('、'))}</span></div>` : ''}</section>`;
            }).join('');
            wrap.innerHTML = `<div class="message-avatar">${avatarHtml(own)}</div><div class="message-content-wrapper"><div class="question-batch-shell"><div class="question-batch-heading"><span>${own ? '问问你' : '我的回答'}</span><b>${questions.length} 题</b></div>${cards}</div></div>`;
            return wrap;
        },
        triggerPartnerRecall() { const candidate=[...messages].reverse().find(m=>m.sender!=='user'&&m.type!=='system'&&!m.recalled&&(m.text||m.image)); if(!candidate)return false;candidate.recalled=true;candidate.recalledAt=Date.now();renderMessages();save();return true; },
        playProfile(key) { const p=(settings.soundProfiles||{})[key]||{}, preset=p.preset||'default';if(preset==='mute')return;if(preset==='custom'&&p.url){const a=new Audio(p.url);a.volume=settings.soundVolume||.15;a.play().catch(()=>notify('音效链接无法播放','error'));return;}if(preset==='kakaotalk'){const a=new Audio('https://image.uglycat.cc/jl5xf9.mp3');a.volume=settings.soundVolume||.15;a.play().catch(()=>{});return;}const invite=key.startsWith('invite_')?`assets/audio/${key}.mp3`:'';if(invite&&preset==='default'){const a=new Audio(invite);a.volume=settings.soundVolume||.15;a.play().catch(()=>{});return;}try{const c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);const tones={low:360,soft:620,warm:520,dark:290,haze:440,default:760};o.frequency.value=tones[preset]||760;o.type=preset==='dark'?'triangle':'sine';g.gain.value=Math.min(.3,settings.soundVolume||.15);o.start();g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.16);o.stop(c.currentTime+.17);}catch(e){} }
    };

    injectFeatureModals(); injectQuestionnaireModal();
    bindMenus(); bindPokeLibrary(); bindQuestionnaire();
    function bootSettings(attempt) {
        if ((!settings || !settings.partnerName) && attempt < 20) {
            setTimeout(() => bootSettings(attempt + 1), 120);
            return;
        }
        bindSettings(); renderSoundSettings();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bootSettings(0));
    else bootSettings(0);
    window.appSessionKey = base => typeof getStorageKey === 'function' ? getStorageKey(base) : base;
})();
