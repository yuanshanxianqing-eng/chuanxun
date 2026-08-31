(function() {
    'use strict';
    
    const MOMENTS_KEY = 'moments_data_v1';
    const MOMENTS_DB_KEY = 'CHAT_APP_V3_moments_data_v2';
    const MOMENTS_SCHEDULE_KEY = 'moments_schedule_v1';
    
    // 朋友圈数据
    let momentsData = {
        myCover: null,
        partnerCover: null,
        partnerCoverOptions: [],  // [{id, url}]
        partnerImagePool: [],     // [{id, url, description}]
        posts: []                 // 所有帖子
    };
    
    let currentMomentsTab = 'mine';
    let momentsEditorImages = [];  // [{url, description}]
    let momentsHydrated = false;
    let momentsLoadPromise = null;
    let momentsSaveChain = Promise.resolve();
    
    function getPartnerName() {
        return (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
    }
    function getMyName() {
        return (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';
    }
    
    function normalizeMomentsData(parsed) {
        parsed = parsed && typeof parsed === 'object' ? parsed : {};
        return {
            myCover: parsed.myCover || null,
            partnerCover: parsed.partnerCover || null,
            partnerCoverOptions: Array.isArray(parsed.partnerCoverOptions) ? parsed.partnerCoverOptions : [],
            partnerImagePool: Array.isArray(parsed.partnerImagePool) ? parsed.partnerImagePool : [],
            posts: Array.isArray(parsed.posts) ? parsed.posts : []
        };
    }

    function cloneMomentsData(data) {
        return JSON.parse(JSON.stringify(data));
    }

    async function loadMomentsData() {
        if (momentsHydrated) return momentsData;
        if (momentsLoadPromise) return momentsLoadPromise;

        momentsLoadPromise = (async () => {
            let parsed = null;
            let loadedFromLegacy = false;

            if (window.localforage) {
                try {
                    parsed = await localforage.getItem(MOMENTS_DB_KEY);
                } catch (e) {
                    console.error('从 IndexedDB 加载朋友圈数据失败', e);
                }
            }

            if (!parsed) {
                try {
                    const saved = localStorage.getItem(MOMENTS_KEY);
                    if (saved) {
                        parsed = JSON.parse(saved);
                        loadedFromLegacy = true;
                    }
                } catch (e) {
                    console.error('加载旧版朋友圈数据失败', e);
                }
            }

            momentsData = normalizeMomentsData(parsed);
            momentsHydrated = true;

            // 自动把旧版 localStorage 数据迁移到容量更大的 IndexedDB。
            if (loadedFromLegacy && window.localforage) {
                try {
                    await localforage.setItem(MOMENTS_DB_KEY, cloneMomentsData(momentsData));
                    localStorage.removeItem(MOMENTS_KEY);
                } catch (e) {
                    console.error('迁移朋友圈数据失败', e);
                }
            }

            return momentsData;
        })().finally(() => {
            momentsLoadPromise = null;
        });

        return momentsLoadPromise;
    }
    
    function saveMomentsData() {
        const snapshot = cloneMomentsData(momentsData);

        if (window.localforage) {
            momentsSaveChain = momentsSaveChain
                .catch(() => {})
                .then(() => localforage.setItem(MOMENTS_DB_KEY, snapshot))
                .then(() => {
                    // 避免旧版 Base64 数据继续占用 localStorage 配额。
                    try { localStorage.removeItem(MOMENTS_KEY); } catch (e) {}
                    return true;
                })
                .catch((e) => {
                    console.error('保存朋友圈数据失败', e);
                    if (typeof showNotification === 'function') {
                        showNotification('朋友圈图片保存失败，请检查浏览器存储权限', 'error');
                    }
                    return false;
                });
            return momentsSaveChain;
        }

        try {
            localStorage.setItem(MOMENTS_KEY, JSON.stringify(snapshot));
            return Promise.resolve(true);
        } catch(e) {
            console.error('保存朋友圈数据失败', e);
            if (typeof showNotification === 'function') {
                showNotification('朋友圈图片过大，当前浏览器无法保存', 'error');
            }
            return Promise.resolve(false);
        }
    }
    
    function getTogetherData() {
        try {
            const saved = localStorage.getItem('together_data');
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return null;
    }
    
    // 获取随机字卡内容
    function getRandomReplyText(minCount, maxCount) {
        const replyPool = (typeof customReplies !== 'undefined' && customReplies.length > 0)
            ? customReplies
            : (typeof CONSTANTS !== 'undefined' && CONSTANTS.REPLY_MESSAGES && CONSTANTS.REPLY_MESSAGES.length > 0
                ? CONSTANTS.REPLY_MESSAGES
                : ['一切安好', '今天很开心', '想你', '天气真好', '要开心哦']);
        const count = typeof maxCount === 'number' ? minCount + Math.floor(Math.random() * (maxCount - minCount + 1)) : minCount;
        const shuffled = [...replyPool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        if (selected.length === 0) return '今天心情不错 ✦';
        return selected.join('。') + '。';
    }
    
    // AI调用
    async function callAI(systemPrompt, userPrompt) {
        const togetherData = getTogetherData();
        if (!togetherData || !togetherData.aiSettings || !togetherData.aiSettings.apiUrl || !togetherData.aiSettings.apiKey || !togetherData.aiSettings.model) {
            return null;
        }
        const { apiUrl, apiKey, model, temperature } = togetherData.aiSettings;
        try {
            let requestUrl = apiUrl.replace(/\/+$/, '');
            if (!requestUrl.endsWith('/v1')) requestUrl += '/v1';
            requestUrl += '/chat/completions';
            const response = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: temperature || 0.7,
                    max_tokens: 2048
                })
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data.choices?.[0]?.message?.content || null;
        } catch(e) {
            console.error('AI调用失败', e);
            return null;
        }
    }
    
    function getRecentMomentsContext(maxPosts) {
        const allPosts = momentsData.posts.slice().sort((a, b) => b.timestamp - a.timestamp);
        const recent = allPosts.slice(0, maxPosts || 10);
        let ctx = '';
        const pn = getPartnerName();
        const mn = getMyName();
        recent.forEach(post => {
            const author = post.author === 'me' ? mn : pn;
            ctx += `\n【${author}的朋友圈 - ${new Date(post.timestamp).toLocaleString()}】\n`;
            if (post.text) ctx += `内容：${post.text}\n`;
            if (post.images && post.images.length > 0) {
                ctx += `图片描述：${post.images.map(img => img.description || '无描述').join('；')}\n`;
            }
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(c => {
                    const ca = c.author === 'me' ? mn : pn;
                    ctx += `  ${ca}评论：${c.text}\n`;
                    if (c.aiExpandedText) ctx += `    AI解释：${c.aiExpandedText}\n`;
                    if (c.replies && c.replies.length > 0) {
                        c.replies.forEach(r => {
                            const ra = r.author === 'me' ? mn : pn;
                            ctx += `    回复-${ra}：${r.text}\n`;
                            if (r.aiExpandedText) ctx += `      AI解释：${r.aiExpandedText}\n`;
                        });
                    }
                });
            }
        });
        return ctx;
    }
    
    // 渲染朋友圈列表
    function renderMomentsList(tab) {
        currentMomentsTab = tab;
        const container = document.getElementById('moments-content');
        const tabs = document.querySelectorAll('#moments-tabs .moments-tab');
        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
        
        const pn = getPartnerName();
        const mn = getMyName();
        const myAvatar = (() => {
            const img = document.querySelector('#my-avatar img');
            return img ? img.src : null;
        })();
        const partnerAvatar = (() => {
            const img = document.querySelector('#partner-avatar img');
            return img ? img.src : null;
        })();
        
        let coverUrl = null;
        if (tab === 'mine') {
            coverUrl = momentsData.myCover;
        } else {
            coverUrl = momentsData.partnerCover;
        }
        
        // 筛选帖子
        const posts = momentsData.posts
            .filter(p => p.author === (tab === 'mine' ? 'me' : 'partner'))
            .sort((a, b) => b.timestamp - a.timestamp);
        
        let html = '';
        
        // 封面
        html += `<div class="moments-cover-wrap">
            ${coverUrl ? `<img src="${escapeHtml(coverUrl)}" alt="封面">` : '<div style="width:100%;height:100%;background:linear-gradient(135deg,#2c3e50,#4a6fa5);"></div>'}
            <button class="moments-cover-change-btn" onclick="window.momentsChangeCover('${tab}')">
                <i class="fas fa-camera"></i> 更换封面
            </button>
            <div class="moments-avatar-inline">
                ${(tab === 'mine' ? myAvatar : partnerAvatar) 
                    ? `<img src="${escapeHtml(tab === 'mine' ? myAvatar : partnerAvatar)}" alt="">`
                    : `<i class="fas fa-user"></i>`}
            </div>
        </div>`;
        
        // 梦角管理按钮
        if (tab === 'partner') {
            html += `<div class="moments-partner-actions">
                <button class="moments-partner-action-btn" onclick="window.openPartnerCoverManager()">
                    <i class="fas fa-images"></i> 管理封面
                </button>
                <button class="moments-partner-action-btn" onclick="window.openPartnerImagePool()">
                    <i class="fas fa-camera"></i> 管理图片库
                </button>
            </div>`;
        }
        
        // 帖子列表
        if (posts.length === 0) {
            html += `<div class="moments-empty">
                <i class="fas fa-camera-retro"></i>
                <p>${tab === 'mine' ? '还没有发过朋友圈' : pn + '还没有发过朋友圈'}</p>
                <span>${tab === 'mine' ? '记录下这一刻的想法吧~' : '等待ta分享生活点滴'}</span>
            </div>`;
        } else {
            posts.forEach(post => {
                const isMe = post.author === 'me';
                const authorName = isMe ? mn : pn;
                const avatar = isMe ? myAvatar : partnerAvatar;
                const timeStr = new Date(post.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                
                html += `<div class="moment-post" data-post-id="${post.id}">
                    <div class="moment-post-header">
                        <div class="moment-post-avatar">
                            ${avatar ? `<img src="${escapeHtml(avatar)}" alt="">` : `<i class="fas fa-user"></i>`}
                        </div>
                        <div class="moment-post-user">
                            <div class="moment-post-name">${escapeHtml(authorName)}</div>
                            <div class="moment-post-time">${timeStr}</div>
                        </div>
                        <button class="moment-post-delete" onclick="window.deleteMomentPost('${post.id}')" title="删除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>`;
                
                if (post.text) {
                    html += `<div class="moment-post-text">${escapeHtml(post.text).replace(/\n/g, '<br>')}</div>`;
                }
                
                if (post.images && post.images.length > 0) {
                    const gridClass = `grid-${Math.min(post.images.length, 9)}`;
                    html += `<div class="moment-post-images ${gridClass}">`;
                    post.images.forEach(img => {
                        html += `<img src="${escapeHtml(img.url)}" class="moment-post-img" onclick="if(typeof viewImage==='function')viewImage('${escapeHtml(img.url.replace(/'/g,"\\'"))}')" loading="lazy" onerror="this.style.display='none'">`;
                    });
                    html += `</div>`;
                }
                
                // AI解释（仅梦角帖子）
                if (!isMe && post.aiExplanation) {
                    html += `<div class="moment-comment-expanded" style="margin-bottom:8px;">
                        <i class="fa-solid fa-caret-down" style="margin-right:4px;opacity:0.6;"></i>${escapeHtml(post.aiExplanation).replace(/\n/g, '<br>')}
                    </div>`;
                }
                if (!isMe && !post.aiExplanation) {
                    html += `<div style="margin-bottom:8px;">
                        <span class="moment-comment-expand" onclick="window.expandMomentAIExplanation('${post.id}')">
                            <i class="fa-solid fa-caret-down"></i> 展开解读
                        </span>
                    </div>`;
                }
                
                // 点赞和评论按钮
                const likeCount = post.likes ? post.likes.length : 0;
                const commentCount = post.comments ? post.comments.length : 0;
                html += `<div class="moment-post-actions">
                    <button class="moment-action-btn ${post.likes && post.likes.includes('me') ? 'liked' : ''}" onclick="window.toggleMomentLike('${post.id}')">
                        <i class="fas fa-heart"></i> ${likeCount > 0 ? likeCount : '赞'}
                    </button>
                    <button class="moment-action-btn" onclick="window.commentOnMoment('${post.id}')">
    <i class="fas fa-comment"></i> ${commentCount > 0 ? commentCount : '评论'}
</button>
                </div>`;
                
                // 评论区域
                if (post.comments && post.comments.length > 0) {
                    html += `<div class="moment-comments" id="comments-${post.id}">`;
                    post.comments.forEach(comment => {
                        const cAuthor = comment.author === 'me' ? mn : pn;
                        html += `<div class="moment-comment">
                            <div class="moment-comment-author">${escapeHtml(cAuthor)}</div>
                            <div class="moment-comment-text">${escapeHtml(comment.text)}</div>`;
                        if (comment.aiExpandedText) {
                            html += `<div class="moment-comment-expanded">
                                <i class="fa-solid fa-chevron-right" style="margin-right:3px;opacity:0.5;"></i>${escapeHtml(comment.aiExpandedText).replace(/\n/g, '<br>')}
                            </div>`;
                        } else if (comment.author === 'partner') {
                            html += `<span class="moment-comment-expand" onclick="window.expandCommentAI('${post.id}','${comment.id}')">
                                <i class="fas fa-caret-down"></i> 展开解读
                            </span>`;
                        }
                        // 回复
                        if (comment.replies && comment.replies.length > 0) {
                            comment.replies.forEach(reply => {
                                const rAuthor = reply.author === 'me' ? mn : pn;
                                html += `<div style="margin-left:16px;padding:4px 0;border-top:1px dashed rgba(var(--accent-color-rgb),0.05);">
                                    <div class="moment-comment-author" style="font-size:11px;">${escapeHtml(rAuthor)}</div>
                                    <div class="moment-comment-text" style="font-size:12px;">${escapeHtml(reply.text)}</div>`;
                                if (reply.aiExpandedText) {
                                    html += `<div class="moment-comment-expanded" style="font-size:11px;">
                                        <i class="fa-solid fa-chevron-right" style="margin-right:3px;opacity:0.5;"></i>${escapeHtml(reply.aiExpandedText).replace(/\n/g, '<br>')}
                                    </div>`;
                                } else if (reply.author === 'partner') {
                                    html += `<span class="moment-comment-expand" style="font-size:10px;" onclick="window.expandReplyAI('${post.id}','${comment.id}','${reply.id}')">
                                        <i class="fas fa-caret-down"></i> 展开解读
                                    </span>`;
                                }
                                html += `</div>`;
                            });
                        }
                        // 回复按钮
                        html += `<span class="moment-comment-reply" onclick="window.replyToMomentComment('${post.id}','${comment.id}')">
                            <i class="fas fa-reply"></i> 回复
                        </span>`;
                        html += `</div>`;
                    });
                    html += `</div>`;
                }
                
                html += `</div>`;
            });
        }
        
        // 发布按钮（仅"我的"）
        if (tab === 'mine') {
            html += `<div class="moments-publish-bar">
                <button class="moments-publish-btn" onclick="window.openMomentEditor()">
                    <i class="fas fa-pen"></i> 发布朋友圈
                </button>
            </div>`;
        }
        
        container.innerHTML = html;
        container.scrollTop = 0;
        // 控制右下角手动发帖按钮的显隐（只在梦角tab显示）
        const fab = document.getElementById('partner-post-fab');
        if (fab) fab.style.display = (tab === 'partner') ? 'flex' : 'none';
    }
    
    // 更换封面
    window.momentsChangeCover = function(tab) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
        overlay.innerHTML = `
            <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <i class="fas fa-image"></i> 更换封面
                </div>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <button class="delivery-checkout-btn" id="cover-local-btn" style="background:var(--accent-color);">
                        <i class="fas fa-upload"></i> 选择本地图片
                    </button>
                    <button class="delivery-checkout-btn" id="cover-url-btn" style="background:var(--accent-color);opacity:0.8;">
                        <i class="fas fa-link"></i> 使用图片链接
                    </button>
                    <button class="delivery-manage-btn" id="cover-cancel-btn" style="padding:12px;">取消</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.addEventListener('click', e => { if(e.target === overlay) close(); });
        overlay.querySelector('#cover-cancel-btn').onclick = close;
        
        overlay.querySelector('#cover-local-btn').onclick = () => {
            close();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { showNotification('图片不能超过5MB', 'error'); return; }
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    if (tab === 'mine') momentsData.myCover = ev.target.result;
                    else momentsData.partnerCover = ev.target.result;
                    const saved = await saveMomentsData();
                    if (!saved) return;
                    renderMomentsList(tab);
                    showNotification('封面已更新 ✨', 'success');
                };
                reader.readAsDataURL(file);
            };
            input.click();
        };
        overlay.querySelector('#cover-url-btn').onclick = async () => {
            close();
            const url = prompt('请输入封面图片的URL链接：');
            if (url && url.trim()) {
                if (tab === 'mine') momentsData.myCover = url.trim();
                else momentsData.partnerCover = url.trim();
                const saved = await saveMomentsData();
                if (!saved) return;
                renderMomentsList(tab);
                showNotification('封面已更新 ✨', 'success');
            }
        };
    };
    
    // 打开朋友圈编辑器
    window.openMomentEditor = function() {
        const overlay = document.getElementById('moments-editor-overlay');
        document.getElementById('moments-editor-text').value = '';
        momentsEditorImages = [];
        renderEditorImages();
        overlay.classList.add('active');
        updateEditorSubmitBtn();
    };
    
    function renderEditorImages() {
        const container = document.getElementById('moments-editor-images');
        const addArea = document.getElementById('moments-editor-add-area');
        if (momentsEditorImages.length === 0) {
            container.innerHTML = '';
            addArea.style.display = 'block';
        } else {
            container.innerHTML = momentsEditorImages.map((img, idx) => `
                <div class="moments-editor-img-item">
                    <img src="${escapeHtml(img.url)}" alt="">
                    <button class="moments-editor-img-remove" data-idx="${idx}">✕</button>
                    <input type="text" class="moments-editor-img-desc" placeholder="图片描述(仅AI理解)" value="${escapeHtml(img.description || '')}" data-idx="${idx}" onchange="window.updateEditorImageDesc(${idx}, this.value)">
                </div>`).join('');
            addArea.style.display = momentsEditorImages.length < 9 ? 'block' : 'none';
        }
        container.querySelectorAll('.moments-editor-img-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                momentsEditorImages.splice(idx, 1);
                renderEditorImages();
                updateEditorSubmitBtn();
            });
        });
        updateEditorSubmitBtn();
    }
    
    window.updateEditorImageDesc = function(idx, val) {
        if (momentsEditorImages[idx]) {
            momentsEditorImages[idx].description = val;
        }
    };
    
    function updateEditorSubmitBtn() {
        const text = document.getElementById('moments-editor-text').value.trim();
        const hasContent = text.length > 0 || momentsEditorImages.length > 0;
        document.getElementById('moments-editor-submit').disabled = !hasContent;
    }
    
    function addEditorImage(url) {
        if (momentsEditorImages.length >= 9) {
            showNotification('最多只能添加9张图片', 'warning');
            return;
        }
        momentsEditorImages.push({ url, description: '' });
        renderEditorImages();
        updateEditorSubmitBtn();
    }
    
    // 发布朋友圈
    function publishMoment() {
        const text = document.getElementById('moments-editor-text').value.trim();
        if (!text && momentsEditorImages.length === 0) {
            showNotification('请至少填写文字或添加图片', 'warning');
            return;
        }
        const post = {
            id: 'moment_' + Date.now(),
            author: 'me',
            text: text,
            images: momentsEditorImages.map(img => ({ url: img.url, description: img.description || '' })),
            timestamp: Date.now(),
            likes: [],
            comments: [],
            aiExplanation: null
        };
        momentsData.posts.push(post);
        saveMomentsData();
        
        document.getElementById('moments-editor-overlay').classList.remove('active');
        document.getElementById('moments-editor-text').value = '';
        momentsEditorImages = [];
        renderEditorImages();
        renderMomentsList('mine');
        showNotification('朋友圈已发布 ✨', 'success');
        
        // 梦角在5分钟内点赞评论
        schedulePartnerInteraction(post.id, 5 * 60 * 1000);
    }
    
    function schedulePartnerInteraction(postId, maxDelay) {
        const delay = Math.random() * maxDelay;
        setTimeout(() => {
            loadMomentsData();
            const post = momentsData.posts.find(p => p.id === postId);
            if (!post) return;
            
            if (!post.likes) post.likes = [];
            if (!post.likes.includes('partner')) {
                post.likes.push('partner');
            }
            
            const commentText = getRandomReplyText(2, 3);
            const comment = {
                id: 'cmt_' + Date.now(),
                author: 'partner',
                text: commentText,
                aiExpandedText: null,
                timestamp: Date.now(),
                replies: []
            };
            if (!post.comments) post.comments = [];
            post.comments.push(comment);
            saveMomentsData();
            
            const pn = getPartnerName();
            if (typeof addMessage === 'function') {
                addMessage({
                    id: Date.now() + 1,
                    sender: 'system',
                    text: `${pn} 评论了你的朋友圈 ✦`,
                    timestamp: new Date(),
                    type: 'system'
                });
            }
            
            if (currentMomentsTab === 'mine') renderMomentsList('mine');
            showNotification(`${pn} 点赞并评论了你的朋友圈 ✦`, 'success', 3000);
        }, delay);
    }
    
   // 展开评论AI解读
window.expandCommentAI = async function(postId, commentId) {
    loadMomentsData();
    const post = momentsData.posts.find(p => p.id === postId);
    if (!post) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    if (comment.aiExpandedText) return;
    
    const togetherData = getTogetherData();
    const pn = getPartnerName();
    const mn = getMyName();
    const charPersona = togetherData?.charPersona || '';
    const charMemories = togetherData?.charMemories || '';
    const userPersona = togetherData?.userPersona || '';
    const userMemories = togetherData?.userMemories || '';
    
    const recentCtx = getRecentMomentsContext(5);
    
    // ★ 修复：把朋友圈作者、正文、图片、用户评论一起传给 AI
    const postAuthor = post.author === 'me' ? mn : pn;
    const postText = post.text || '';
    let postImagesDesc = '';
    if (post.images && post.images.length > 0) {
        postImagesDesc = '图片内容描述：' + post.images.map(img => img.description || '一张图片').join('；');
    }
    
    // 用户在这条朋友圈下的评论（如果有）
    let userCommentsInPost = '';
    const userComments = post.comments.filter(c => c.author === 'me');
    if (userComments.length > 0) {
        userCommentsInPost = '\n' + mn + '在这条朋友圈下的评论：';
        userComments.forEach(c => {
            userCommentsInPost += '\n' + mn + '评论：' + c.text;
        });
    }
    
    const systemPrompt = `你是${pn}，以下是你的设定：
人设：${charPersona}
关于你的事：${charMemories}
关于${mn}的事：${userPersona} | ${userMemories}

你在朋友圈看到${postAuthor}发了一条朋友圈。
${postText ? '这条朋友圈的文字内容：' + postText : ''}
${postImagesDesc}

你在这条朋友圈下写了一条评论。你的评论必须包含的核心词句：「${comment.text}」
请以${pn}的身份，用自然通顺的方式，理清「${comment.text}」这些词句内在的联系，并将这些词句串联成逻辑通顺的话语发表完整的评论。
要求：语气自然，符合你的人设，150 字以内，且严禁使用任何括号 () 或描述动作的旁白。
${userCommentsInPost}

近期朋友圈互动记录：${recentCtx}`;
    
    const userPrompt = `请以${pn}的身份发表你对这条朋友圈的评论，你的评论必须包含的词句：「${comment.text}」`;
    
    showNotification('正在展开评论详情...', 'info', 2000);
    const aiResult = await callAI(systemPrompt, userPrompt);
    if (aiResult) {
        comment.aiExpandedText = aiResult;
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
    } else {
        comment.aiExpandedText = `（${pn}的评论：「${comment.text}」——ta想表达的就是字面意思呢 ✦）`;
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
        showNotification('AI解读失败，使用默认解释', 'warning');
    }
};
    // 展开回复 AI 解读
window.expandReplyAI = async function(postId, commentId, replyId) {
    loadMomentsData();
    const post            = momentsData.posts.find(p => p.id === postId);
    if (!post) return;
    const comment         = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    const reply           = comment.replies.find(r => r.id === replyId);
    if (!reply) return;
    if (reply.aiExpandedText) return;

    // 这条 reply 一定是梦角发的（UI 只在梦角的消息上显示“展开解读”按钮）
    if (reply.author !== 'partner') return;

    const togetherData    = getTogetherData();
    const pn              = getPartnerName();
    const mn              = getMyName();
    const charPersona     = togetherData?.charPersona || '';
    const charMemories    = togetherData?.charMemories || '';
    const userPersona     = togetherData?.userPersona || '';
    const userMemories    = togetherData?.userMemories || '';

    // 朋友圈作者
    const postAuthor      = post.author === 'me' ? mn : pn;
    const postText        = post.text || '';
    let   postImagesDesc  = '';
    if (post.images && post.images.length > 0) {
        postImagesDesc = '图片：' + post.images.map(img => img.description || '一张图').join('、');
    }

    // 构建完整对话链（按时间顺序）
    let conversationChain = '';
    conversationChain += `\n${pn}（你）的评论：${comment.text}`;

    // 找出本条 reply 之前的所有回复（包含用户说的和梦角自己说的其他回复）
    const allRepliesBefore = comment.replies
        .filter(r => r.timestamp <= reply.timestamp && r.id !== reply.id)
        .sort((a, b) => a.timestamp - b.timestamp);
    allRepliesBefore.forEach(r => {
        if (r.author === 'me') {
            conversationChain += `\n${mn} 回复：${r.text}`;
        } else {
            conversationChain += `\n${pn}（你）的回复：${r.text}`;
        }
    });

    // 最后是这次要解读的梦角的最新回复
    conversationChain += `\n${pn}（你）最新的回复：${reply.text}`;

    const systemPrompt = `你是 ${pn}，设定如下：
- 人设：${charPersona}
- 关于你的事：${charMemories}
- 关于 ${mn} 的事：${userPersona} | ${userMemories}

你正在看 ${postAuthor} 的朋友圈：
${postText ? '文字：' + postText : ''}${postImagesDesc}

你在这条朋友圈下与 ${mn} 进行了如下对话：
${conversationChain}
现在你要继续回复 ${mn}。你的回复必须包含的核心词句：「${reply.text}」
请以${pn}的身份进行回复，语气自然，用自然通顺的方式，理清「${reply.text}」这些词句内在的联系，并将这些词句串联成逻辑通顺的话语发表完整的回复，要符合你的人设，200 字以内。
【重要】
- 你的回复严禁使用任何括号 () 或 描述动作的旁白。
- 回复内容必须是${pn}说给${mn}的话，不要把${reply.text}中的话认为是对方说的。`;
    const userPrompt = `请用你自己的话把「${reply.text}」扩写成一段自然的回复。`;

    showNotification('正在展开详情…', 'info', 2000);
    const aiResult = await callAI(systemPrompt, userPrompt);
    if (aiResult) {
        reply.aiExpandedText = aiResult;
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
    } else {
        reply.aiExpandedText = `（${pn}的回复：「${reply.text}」）`;
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
    }
};
    
    // 展开梦角朋友圈AI解释
    window.expandMomentAIExplanation = async function(postId) {
        loadMomentsData();
        const post = momentsData.posts.find(p => p.id === postId);
        if (!post) return;
        if (post.aiExplanation) return;
        
        const togetherData = getTogetherData();
        const pn = getPartnerName();
        const mn = getMyName();
        const charPersona = togetherData?.charPersona || '';
        
        let imageDescStr = '';
        if (post.images && post.images.length > 0) {
            imageDescStr = post.images.map(img => img.description || '一张图片').join('；');
        }
        
        const systemPrompt = `你是${pn}，人设：${charPersona}
你发了一条朋友圈。${post.text ? '你发布的朋友圈文字需要包含的词句：「' + post.text + '」' : ''}${imageDescStr ? '。图片内容描述：' + imageDescStr : ''}
请以${pn}的视角发布这条朋友圈。要求：你发的朋友圈内容必须围绕提供的词句和图片描述中的关键信息。语气自然日常，温柔且以你的方式表达爱意，必须符合人设，200字以内。
【重要】
- 你的朋友圈内容严禁使用任何括号 () 或 描述动作。`;
        const userPrompt = `请以${pn}的视角发布这条朋友圈`;
        
        showNotification('正在展开朋友圈详情...', 'info', 2000);
        const aiResult = await callAI(systemPrompt, userPrompt);
        if (aiResult) {
            post.aiExplanation = aiResult;
            saveMomentsData();
            renderMomentsList(currentMomentsTab);
        } else {
            post.aiExplanation = `（${pn}分享了这条朋友圈，ta想表达的就是这些呢 ✦）`;
            saveMomentsData();
            renderMomentsList(currentMomentsTab);
        }
    };
    
    // 点赞
    window.toggleMomentLike = function(postId) {
        loadMomentsData();
        const post = momentsData.posts.find(p => p.id === postId);
        if (!post) return;
        if (!post.likes) post.likes = [];
        const idx = post.likes.indexOf('me');
        if (idx >= 0) {
            post.likes.splice(idx, 1);
        } else {
            post.likes.push('me');
        }
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
    };
    // 评论朋友圈帖子（不是回复已有评论）
window.commentOnMoment = function(postId) {
    const text = prompt('写下你的评论：');
    if (!text || !text.trim()) return;
    
    loadMomentsData();
    const post = momentsData.posts.find(p => p.id === postId);
    if (!post) return;
    
    // 添加评论
    const comment = {
        id: 'cmt_' + Date.now(),
        author: 'me',
        text: text.trim(),
        aiExpandedText: null,
        timestamp: Date.now(),
        replies: []
    };
    if (!post.comments) post.comments = [];
    post.comments.push(comment);
    saveMomentsData();
    
    // 立即刷新当前视图
    if (currentMomentsTab === 'partner' || currentMomentsTab === 'mine') {
        renderMomentsList(currentMomentsTab);
    }
    showNotification('评论成功 ✦', 'success');
    
    // 梦角在1分钟内回复
    const delay = Math.random() * 60 * 1000;
    setTimeout(() => {
        loadMomentsData();
        const latestPost = momentsData.posts.find(p => p.id === postId);
        if (!latestPost) return;
        const latestComment = latestPost.comments.find(c => c.id === comment.id);
        if (!latestComment) return;
        
        const partnerReplyText = getRandomReplyText(2, 3);
        const partnerReply = {
            id: 'reply_' + Date.now(),
            author: 'partner',
            text: partnerReplyText,
            aiExpandedText: null,
            timestamp: Date.now()
        };
        if (!latestComment.replies) latestComment.replies = [];
        latestComment.replies.push(partnerReply);
        saveMomentsData();
        
        if (currentMomentsTab === 'partner' || currentMomentsTab === 'mine') {
            renderMomentsList(currentMomentsTab);
        }
        showNotification(`${getPartnerName()} 回复了你的评论 ✦`, 'success', 3000);
    }, delay);
};
    // 回复评论
    window.replyToMomentComment = function(postId, commentId) {
        const replyText = prompt('输入你的回复：');
        if (!replyText || !replyText.trim()) return;
        
        loadMomentsData();
        const post = momentsData.posts.find(p => p.id === postId);
        if (!post) return;
        const comment = post.comments.find(c => c.id === commentId);
        if (!comment) return;
        
        const reply = {
            id: 'reply_' + Date.now(),
            author: 'me',
            text: replyText.trim(),
            aiExpandedText: null,
            timestamp: Date.now()
        };
        if (!comment.replies) comment.replies = [];
        comment.replies.push(reply);
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
        showNotification('回复成功 ✦', 'success');
        
        // 梦角1分钟内回复
        const delay = Math.random() * 60 * 1000;
        setTimeout(() => {
            loadMomentsData();
            const currentPost = momentsData.posts.find(p => p.id === postId);
            if (!currentPost) return;
            const currentComment = currentPost.comments.find(c => c.id === commentId);
            if (!currentComment) return;
            
            const partnerReplyText = getRandomReplyText(2, 3);
            const partnerReply = {
                id: 'reply_' + Date.now(),
                author: 'partner',
                text: partnerReplyText,
                aiExpandedText: null,
                timestamp: Date.now()
            };
            if (!currentComment.replies) currentComment.replies = [];
            currentComment.replies.push(partnerReply);
            saveMomentsData();
            if (currentMomentsTab === 'mine') renderMomentsList('mine');
            showNotification(`${getPartnerName()} 回复了你的评论 ✦`, 'success', 3000);
        }, delay);
    };
    
    // 删除帖子
    window.deleteMomentPost = function(postId) {
        if (!confirm('确定要删除这条朋友圈吗？')) return;
        loadMomentsData();
        momentsData.posts = momentsData.posts.filter(p => p.id !== postId);
        saveMomentsData();
        renderMomentsList(currentMomentsTab);
        showNotification('已删除', 'success');
    };
    
    // 滚动到评论
    window.scrollToMomentComments = function(postId) {
        const el = document.getElementById('comments-' + postId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    
    // 梦角封面管理
    window.openPartnerCoverManager = function() {
        const overlay = document.getElementById('moments-cover-manager-overlay');
        document.getElementById('moments-cover-manager-title').textContent = '管理梦角封面';
        const body = document.getElementById('moments-cover-manager-body');
        
        let html = '<div class="moments-cover-options">';
        momentsData.partnerCoverOptions.forEach((opt, idx) => {
            const isActive = momentsData.partnerCover === opt.url;
            html += `<div class="moments-cover-option${isActive ? ' active' : ''}" onclick="window.selectPartnerCover('${opt.id}')">
                <img src="${escapeHtml(opt.url)}" onerror="this.style.display='none';this.parentElement.innerHTML+='<div style=width:100%;height:100%;background:#ddd;display:flex;align-items:center;justify-content:center;color:#999;>加载失败</div>'">
                <button class="cover-option-delete" onclick="event.stopPropagation();window.deletePartnerCoverOption('${opt.id}')">✕</button>
            </div>`;
        });
        html += `<div class="moments-cover-add" onclick="window.addPartnerCoverOption()">
            <i class="fas fa-plus"></i> 添加封面
        </div>`;
        html += '</div>';
        
        body.innerHTML = html;
        overlay.classList.add('active');
    };
    
    window.selectPartnerCover = function(coverId) {
        const opt = momentsData.partnerCoverOptions.find(o => o.id === coverId);
        if (opt) {
            momentsData.partnerCover = opt.url;
            saveMomentsData();
            renderMomentsList('partner');
            window.openPartnerCoverManager();
            showNotification('封面已切换', 'success');
        }
    };
    
    window.deletePartnerCoverOption = function(coverId) {
        if (!confirm('确定删除这个封面吗？')) return;
        const opt = momentsData.partnerCoverOptions.find(o => o.id === coverId);
        momentsData.partnerCoverOptions = momentsData.partnerCoverOptions.filter(o => o.id !== coverId);
        if (opt && momentsData.partnerCover === opt.url) {
            momentsData.partnerCover = momentsData.partnerCoverOptions.length > 0 ? momentsData.partnerCoverOptions[0].url : null;
        }
        saveMomentsData();
        renderMomentsList('partner');
        window.openPartnerCoverManager();
        showNotification('封面已删除', 'success');
    };
    
    window.addPartnerCoverOption = function() {
        const mode = confirm('点击"确定"选择本地图片，点击"取消"使用图片链接');
        if (mode) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { showNotification('图片不能超过5MB', 'error'); return; }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    momentsData.partnerCoverOptions.push({ id: 'cover_' + Date.now(), url: ev.target.result });
                    if (!momentsData.partnerCover) momentsData.partnerCover = ev.target.result;
                    saveMomentsData();
                    renderMomentsList('partner');
                    window.openPartnerCoverManager();
                    showNotification('封面已添加', 'success');
                };
                reader.readAsDataURL(file);
            };
            input.click();
        } else {
            const url = prompt('请输入封面图片URL：');
            if (url && url.trim()) {
                momentsData.partnerCoverOptions.push({ id: 'cover_' + Date.now(), url: url.trim() });
                if (!momentsData.partnerCover) momentsData.partnerCover = url.trim();
                saveMomentsData();
                renderMomentsList('partner');
                window.openPartnerCoverManager();
                showNotification('封面已添加', 'success');
            }
        }
    };
    
    // 梦角图片池管理
    window.openPartnerImagePool = function() {
        const overlay = document.getElementById('moments-cover-manager-overlay');
        document.getElementById('moments-cover-manager-title').textContent = '管理梦角图片库';
        const body = document.getElementById('moments-cover-manager-body');
        
        let html = '<div class="moments-image-pool">';
        momentsData.partnerImagePool.forEach((item, idx) => {
            html += `<div class="moments-pool-item">
                <img src="${escapeHtml(item.url)}" onerror="this.style.display='none'">
                <div class="moments-pool-item-desc">${escapeHtml(item.description || '无描述')}</div>
                <button class="moments-pool-item-delete" onclick="window.deletePartnerPoolItem('${item.id}')">✕</button>
            </div>`;
        });
        html += `<div class="moments-cover-add" onclick="window.addPartnerPoolItem()">
            <i class="fas fa-plus"></i> 添加图片
        </div>`;
        html += '</div>';
        html += '<div style="font-size:11px;color:var(--text-secondary);padding:8px 0;text-align:center;">图片描述用于AI理解图片内容，不会出现在朋友圈中</div>';
        
        body.innerHTML = html;
        overlay.classList.add('active');
    };
    
    window.deletePartnerPoolItem = function(itemId) {
        if (!confirm('确定删除这张图片吗？')) return;
        momentsData.partnerImagePool = momentsData.partnerImagePool.filter(i => i.id !== itemId);
        saveMomentsData();
        window.openPartnerImagePool();
        showNotification('已删除', 'success');
    };
    
    window.addPartnerPoolItem = function() {
        const mode = confirm('点击"确定"选择本地图片，点击"取消"使用图片链接');
        const addWithDesc = (url) => {
            const desc = prompt('请为这张图片添加描述（方便AI理解图片内容）：', '一张图片');
            momentsData.partnerImagePool.push({
                id: 'pool_' + Date.now(),
                url: url,
                description: desc || '一张图片'
            });
            saveMomentsData();
            window.openPartnerImagePool();
            showNotification('图片已添加', 'success');
        };
        if (mode) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) { showNotification('图片不能超过5MB', 'error'); return; }
                const reader = new FileReader();
                reader.onload = (ev) => addWithDesc(ev.target.result);
                reader.readAsDataURL(file);
            };
            input.click();
        } else {
            const url = prompt('请输入图片URL：');
            if (url && url.trim()) addWithDesc(url.trim());
        }
    };
    
    // 梦角自动发布朋友圈
    function schedulePartnerMoments() {
        const today = new Date().toDateString();
        let schedule;
        try {
            schedule = JSON.parse(localStorage.getItem(MOMENTS_SCHEDULE_KEY) || '{}');
        } catch(e) { schedule = {}; }
        
        if (schedule.date === today) return; // 今天已经调度过
        
        const count = 1 + Math.floor(Math.random() * 5); // 1-5条
        const times = [];
        const now = new Date();
        const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const dayEnd = dayStart + 24 * 60 * 60 * 1000;
        
        for (let i = 0; i < count; i++) {
            const randomTime = dayStart + Math.random() * (dayEnd - dayStart - 60 * 60 * 1000) + 30 * 60 * 1000;
            times.push(randomTime);
        }
        times.sort((a, b) => a - b);
        
        schedule = { date: today, times: times, posted: [] };
        localStorage.setItem(MOMENTS_SCHEDULE_KEY, JSON.stringify(schedule));
        
        times.forEach(t => {
            const delay = Math.max(0, t - Date.now());
            setTimeout(() => {
                publishPartnerMoment();
            }, delay);
        });
    }
    
    function publishPartnerMoment() {
        loadMomentsData();
        
        const schedule = JSON.parse(localStorage.getItem(MOMENTS_SCHEDULE_KEY) || '{}');
        const today = new Date().toDateString();
        if (schedule.date !== today) return;
        
        const isImagePost = momentsData.partnerImagePool.length > 0 && Math.random() < 0.6;
        let text = '';
        let images = [];
        
        if (!isImagePost || Math.random() < 0.5) {
            text = getRandomReplyText(3, 5);
        }
        
        if (isImagePost) {
            const imgCount = 1 + Math.floor(Math.random() * Math.min(4, momentsData.partnerImagePool.length));
            const shuffled = [...momentsData.partnerImagePool].sort(() => Math.random() - 0.5);
            images = shuffled.slice(0, imgCount).map(img => ({ url: img.url, description: img.description || '' }));
        }
        
        if (!text && images.length === 0) {
            text = getRandomReplyText(3, 5);
        }
        
        const post = {
            id: 'moment_' + Date.now(),
            author: 'partner',
            text: text,
            images: images,
            timestamp: Date.now(),
            likes: [],
            comments: [],
            aiExplanation: null
        };
        
        momentsData.posts.push(post);
        saveMomentsData();
        
        if (currentMomentsTab === 'partner') renderMomentsList('partner');
        const pn = getPartnerName();
        showNotification(`${pn} 发布了一条朋友圈 ✦`, 'success', 3000);
        
        if (typeof addMessage === 'function') {
            addMessage({
                id: Date.now() + 1,
                sender: 'system',
                text: `${pn} 发布了一条新朋友圈，快去看看吧 ✦`,
                timestamp: new Date(),
                type: 'system'
            });
        }
    }
    
    // 恢复未完成的调度
    function restoreSchedule() {
        try {
            const schedule = JSON.parse(localStorage.getItem(MOMENTS_SCHEDULE_KEY) || '{}');
            const today = new Date().toDateString();
            if (schedule.date !== today) return;
            
            schedule.times.forEach(t => {
                if (schedule.posted && schedule.posted.includes(t)) return;
                const delay = Math.max(0, t - Date.now());
                if (delay > 0) {
                    setTimeout(() => {
                        publishPartnerMoment();
                        if (!schedule.posted) schedule.posted = [];
                        schedule.posted.push(t);
                        localStorage.setItem(MOMENTS_SCHEDULE_KEY, JSON.stringify(schedule));
                    }, delay);
                } else if (delay > -60000) {
                    // 刚刚过期的也发布
                    setTimeout(() => publishPartnerMoment(), 100);
                    if (!schedule.posted) schedule.posted = [];
                    schedule.posted.push(t);
                    localStorage.setItem(MOMENTS_SCHEDULE_KEY, JSON.stringify(schedule));
                }
            });
        } catch(e) {}
    }
    
    // 初始化
    async function initMoments() {
        await loadMomentsData();
        
        // 设置首页入口
        const entryBtn = document.getElementById('moments-function');
        if (!entryBtn || entryBtn.dataset.momentsBound === '1') return;
        entryBtn.dataset.momentsBound = '1';
        entryBtn.addEventListener('click', async () => {
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) hideModal(settingsModal);
            await loadMomentsData();
            renderMomentsList('mine');
            showModal(document.getElementById('moments-modal'));
        });
        
        // 标签切换
        document.querySelectorAll('#moments-tabs .moments-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                renderMomentsList(tab.dataset.tab);
            });
        });
        
        // 关闭按钮
        document.getElementById('moments-close').addEventListener('click', () => {
            hideModal(document.getElementById('moments-modal'));
        });
        
        // 编辑器事件
        document.getElementById('moments-editor-close').addEventListener('click', () => {
            document.getElementById('moments-editor-overlay').classList.remove('active');
        });
        document.getElementById('moments-editor-cancel').addEventListener('click', () => {
            document.getElementById('moments-editor-overlay').classList.remove('active');
        });
        document.getElementById('moments-editor-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('moments-editor-overlay')) {
                document.getElementById('moments-editor-overlay').classList.remove('active');
            }
        });
        document.getElementById('moments-editor-submit').addEventListener('click', publishMoment);
        document.getElementById('moments-editor-text').addEventListener('input', updateEditorSubmitBtn);
        
        document.getElementById('moments-editor-local-btn').addEventListener('click', () => {
            document.getElementById('moments-local-input').click();
        });
        document.getElementById('moments-local-input').addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('图片不能超过5MB', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => addEditorImage(ev.target.result);
                reader.readAsDataURL(file);
            });
            e.target.value = '';
        });
        document.getElementById('moments-editor-url-btn').addEventListener('click', () => {
            const url = prompt('请输入图片URL链接：');
            if (url && url.trim()) addEditorImage(url.trim());
        });
        document.getElementById('moments-editor-add-img-btn').addEventListener('click', () => {
            document.getElementById('moments-local-input').click();
        });
        
        // 封面管理面板
        document.getElementById('moments-cover-manager-close').addEventListener('click', () => {
            document.getElementById('moments-cover-manager-overlay').classList.remove('active');
        });
        document.getElementById('moments-cover-manager-cancel').addEventListener('click', () => {
            document.getElementById('moments-cover-manager-overlay').classList.remove('active');
        });
        document.getElementById('moments-cover-manager-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('moments-cover-manager-overlay')) {
                document.getElementById('moments-cover-manager-overlay').classList.remove('active');
            }
        });
        
        // 更新梦角标签名
        setInterval(() => {
            const tab = document.getElementById('moments-tab-partner');
            if (tab) tab.textContent = getPartnerName() + '的';
        }, 1000);
        
        // 初始化调度
        schedulePartnerMoments();
        restoreSchedule();
        // 【新增】手动触发梦角发朋友圈浮动按钮
(function() {
    const fab = document.createElement('button');
    fab.id = 'partner-post-fab';
    fab.title = '让梦角在10分钟内发布一条朋友圈';
    fab.innerHTML = '<i class="fas fa-paper-plane"></i>';
    // 按钮样式：圆形，绝对定位在 moments-modal 右下角
    fab.style.cssText = `
        position: absolute;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--accent-color);
        color: #fff;
        border: none;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        cursor: pointer;
        display: none; /* 默认隐藏，只在梦角tab显示 */
        align-items: center;
        justify-content: center;
        font-size: 20px;
        z-index: 20;
        transition: transform 0.2s, opacity 0.2s;
        backdrop-filter: blur(6px);
    `;
    // 点击行为
    fab.addEventListener('click', function() {
        const delay = Math.random() * 10 * 60 * 1000; // 0~10分钟随机
        const pn = getPartnerName();
        showNotification(`${pn} 将在 ${Math.round(delay/60000)} 分钟后发布朋友圈 ✦`, 'info', 3000);
        
        // 禁用按钮防止连点
        fab.disabled = true;
        fab.style.opacity = '0.5';
        fab.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            publishPartnerMoment();          // 发布（不涉及每日调度计数）
            showNotification(`${pn} 刚刚发布了一条朋友圈！`, 'success', 3000);
            fab.disabled = false;
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
        }, delay);
    });
    
    const modal = document.getElementById('moments-modal');
    if (modal) modal.appendChild(fab);
})();
    }
    
    // 导出全局函数
    window.momentsChangeCover = window.momentsChangeCover;
    window.openMomentEditor = window.openMomentEditor;
    window.openPartnerCoverManager = window.openPartnerCoverManager;
    window.openPartnerImagePool = window.openPartnerImagePool;
    window.selectPartnerCover = window.selectPartnerCover;
    window.deletePartnerCoverOption = window.deletePartnerCoverOption;
    window.addPartnerCoverOption = window.addPartnerCoverOption;
    window.deletePartnerPoolItem = window.deletePartnerPoolItem;
    window.addPartnerPoolItem = window.addPartnerPoolItem;
    window.deleteMomentPost = window.deleteMomentPost;
    window.toggleMomentLike = window.toggleMomentLike;
    window.scrollToMomentComments = window.scrollToMomentComments;
    window.expandCommentAI = window.expandCommentAI;
    window.expandReplyAI = window.expandReplyAI;
    window.expandMomentAIExplanation = window.expandMomentAIExplanation;
    window.replyToMomentComment = window.replyToMomentComment;
    window.updateEditorImageDesc = window.updateEditorImageDesc;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMoments);
    } else {
        setTimeout(initMoments, 800);
    }
})();
