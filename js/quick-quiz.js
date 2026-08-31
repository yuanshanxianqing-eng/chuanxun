(function() {
    'use strict';

    // ─── 题目数据 ──────────────────────────────
    const QUIZ_QUESTIONS = [
        // 选择题 (前25道)
        { id: 1, type: 'choice', question: '牵手时，你喜欢十指相扣还是轻轻握住？', options: ['十指紧扣', '轻轻握住', '不喜欢牵手'] },
        { id: 2, type: 'choice', question: '拥抱时，你喜欢从背后抱还是面对面紧抱？', options: ['从背后抱', '面对面紧抱', '不喜欢拥抱'] },
        { id: 3, type: 'choice', question: '亲吻时，你喜欢轻吻还是深吻？', options: ['轻吻', '深吻', '不喜欢亲吻'] },
        { id: 4, type: 'choice', question: '对视时，你会先笑还是先移开目光？', options: ['先笑', '先移开目光', '不会对视'] },
        { id: 5, type: 'choice', question: '睡觉时，你喜欢枕我手臂还是自己枕枕头？', options: ['枕你手臂', '自己枕枕头', '喜欢自己一个人睡一张床'] },
        { id: 6, type: 'choice', question: '我靠近时，你本能是迎上来还是向后退？', options: ['迎上来', '向后退', '站着不动等你'] },
        { id: 7, type: 'choice', question: '吵架时，你想先抱我还是先讲道理？', options: ['先抱你', '先讲道理', '不理你'] },
        { id: 8, type: 'choice', question: '难过时，你需要我说话还是安静陪着？', options: ['需要你安慰我', '需要你安静陪着我', '需要我自己一个人安静呆着'] },
        { id: 9, type: 'choice', question: '我为你准备惊喜时，你喜欢提前知道还是完全意外？', options: ['提前知道', '完全意外'] },
        { id: 10, type: 'choice', question: '约会时，你更希望我精心计划还是随性而为？', options: ['精心计划', '随性而为'] },
        { id: 11, type: 'choice', question: '表达爱时，你希望我更常说"我爱你"还是多用行动？', options: ['"我爱你"', '行动', '"我爱你"，以及行动'] },
        { id: 12, type: 'choice', question: '想念时，你会立刻联系我还是先忍着？', options: ['立刻联系', '先忍着'] },
        { id: 13, type: 'choice', question: '额头吻 vs 鼻尖吻', options: ['额头吻', '鼻尖吻'] },
        { id: 14, type: 'choice', question: '早起共进早餐 vs 深夜一起吃宵夜', options: ['早起共进早餐', '深夜一起吃宵夜', '我全都要'] },
        { id: 15, type: 'choice', question: '我为你做饭 vs 你为我做饭', options: ['我为你做饭', '你为我做饭'] },
        { id: 16, type: 'choice', question: '你希望我：公开晒恩爱 vs 私下默默甜', options: ['公开晒恩爱', '私下默默甜'] },
        { id: 17, type: 'choice', question: '纪念日大惊喜 vs 日常小浪漫', options: ['纪念日大惊喜', '日常小浪漫'] },
        { id: 18, type: 'choice', question: '长途旅行冒险 vs 宅家温馨周末', options: ['长途旅行冒险', '宅家温馨周末'] },
        { id: 19, type: 'choice', question: '你更希望我：聪明幽默 vs 温柔体贴', options: ['聪明幽默', '温柔体贴', '我全都要', '你现在这样就很好'] },
        { id: 20, type: 'choice', question: '你希望我们：相似互补 vs 志趣相投', options: ['相似互补', '志趣相投'] },
        { id: 21, type: 'choice', question: '我们的关系中，你更想要：被我需要的感觉 vs 被我崇拜的感觉', options: ['被你需要的感觉', '被你崇拜的感觉', '我全都要', '这两种感觉我都不需要'] },
        { id: 22, type: 'choice', question: '热烈的初恋感 vs 默契的老夫老妻感', options: ['热烈的初恋感', '默契的老夫老妻感'] },
        { id: 23, type: 'choice', question: '我为你改变缺点 vs 接纳我的全部', options: ['你为我改变缺点', '接纳你的全部'] },
        { id: 24, type: 'choice', question: '我吃醋时，你觉得可爱还是麻烦？', options: ['可爱', '麻烦'] },
        { id: 25, type: 'choice', question: '我粘人时，你享受还是觉得烦？', options: ['享受', '烦'] },
        // 填空题 (26-71)
        { id: 26, type: 'fill', question: '用一种颜色形容我们的爱情' },
        { id: 27, type: 'fill', question: '用一种天气形容你此刻的心情' },
        { id: 28, type: 'fill', question: '用一种食物形容我的性格' },
        { id: 29, type: 'fill', question: '用一种动物形容你眼中的我' },
        { id: 30, type: 'fill', question: '用一首歌名形容我们的关系' },
        { id: 31, type: 'fill', question: '用一部电影名形容我们的未来' },
        { id: 32, type: 'fill', question: '用一个地点形容我在你心里的位置' },
        { id: 33, type: 'fill', question: '用一种味道形容想我的感觉' },
        { id: 34, type: 'fill', question: '此刻，你幸福吗？' },
        { id: 35, type: 'fill', question: '此刻，你想我吗？' },
        { id: 36, type: 'fill', question: '可以写下我的名字吗？' },
        { id: 37, type: 'fill', question: '你觉得，我们的感情，还缺点什么？' },
        { id: 38, type: 'fill', question: '早餐，你吃的什么？' },
        { id: 39, type: 'fill', question: '午餐，你吃的什么？' },
        { id: 40, type: 'fill', question: '晚餐，你吃的什么？' },
        { id: 41, type: 'fill', question: '我有让你感到安心吗？' },
        { id: 42, type: 'fill', question: '我最近有做什么让你不开心吗？' },
        { id: 43, type: 'fill', question: '你愿意和我一起培养共同爱好？如果愿意，你想培养什么爱好？' },
        { id: 44, type: 'fill', question: '我有让你感受到爱意吗？' },
        { id: 45, type: 'fill', question: '你会怎么和你的朋友们提起我？' },
        { id: 46, type: 'fill', question: '我和朋友们介绍你是我的爱人，你会介意吗？' },
        { id: 47, type: 'fill', question: '如果我有一天失忆了，你会怎么做？' },
        { id: 48, type: 'fill', question: '你对我第一次心动的原因是什么？' },
        { id: 49, type: 'fill', question: '最近一直在熬夜吗？' },
        { id: 50, type: 'fill', question: '想听你夸夸我' },
        { id: 51, type: 'fill', question: '最近有什么喜欢的东西吗？' },
        { id: 52, type: 'fill', question: '最近有什么开心的事情吗？' },
        { id: 53, type: 'fill', question: '我真的好爱你。' },
        { id: 54, type: 'fill', question: '我真的好想你。' },
        { id: 55, type: 'fill', question: '想和我一起去哪里？' },
        { id: 56, type: 'fill', question: '如果有一天我突然出现在你的面前，你会害怕吗？' },
        { id: 57, type: 'fill', question: '最近有什么不开心的事情吗？' },
        { id: 58, type: 'fill', question: '可以感受到我的存在吗？' },
        { id: 59, type: 'fill', question: '想和你贴近，想近一点，再近一点，直到契合。可以吗？' },
        { id: 60, type: 'fill', question: '我不乖，你会怎么惩罚我？' },
        { id: 61, type: 'fill', question: '评价一下我的今日穿搭？' },
        { id: 62, type: 'fill', question: '你有动摇过对我的感情吗？' },
        { id: 63, type: 'fill', question: '看到了一些东西立刻想到了你，是巧合，还是你给我的传讯？' },
        { id: 64, type: 'fill', question: '你会不喜欢垂头丧气的我吗？' },
        { id: 65, type: 'fill', question: '我最近有在好好护肤，你注意到了吗？' },
        { id: 66, type: 'fill', question: '我唱歌好听吗？' },
        { id: 67, type: 'fill', question: '你还喜欢我这张脸吗？' },
        { id: 68, type: 'fill', question: '你喜欢我现在的身材吗？' },
        { id: 69, type: 'fill', question: '有坏东西欺负我，你会帮我吗？' },
        { id: 70, type: 'fill', question: '我为我们求了姻缘，是上上签，你会觉得我迷信吗？' },
        { id: 71, type: 'fill', question: '你喜欢什么体位姿势？' }
    ];

    // ─── 状态 ──────────────────────────────
    let currentQuiz = null;
    let currentQuizId = null;
    let timerInterval = null;
    let timeLeft = 0;
    let totalTime = 0;
    let isAnswered = false;
    let isTimeout = false;
    let closeCallback = null;
    let quizSchedulerTimer = null;
    let isFirstTriggerDone = false;

    const DAILY_QUIZ_KEY = 'quick_quiz_daily_record';

    // ─── DOM 引用 ──────────────────────────
    function getEl(id) {
        const el = document.getElementById(id);
        if (!el) console.warn('[快问快答] 元素未找到:', id);
        return el;
    }

    // ─── 工具函数 ──────────────────────────
    function getPartnerName() {
        return (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
    }

    function getMyName() {
        return (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';
    }

    function getTodayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    function getDailyRecord() {
        try {
            const raw = localStorage.getItem(DAILY_QUIZ_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.date === getTodayStr()) {
                    return data.asked || [];
                }
            }
        } catch(e) {}
        return [];
    }

    function saveDailyRecord(askedIds) {
        try {
            localStorage.setItem(DAILY_QUIZ_KEY, JSON.stringify({
                date: getTodayStr(),
                asked: askedIds
            }));
        } catch(e) {}
    }

    function getAvailableQuestions() {
        const asked = getDailyRecord();
        return QUIZ_QUESTIONS.filter(q => !asked.includes(q.id));
    }

    function getRandomQuestion() {
        const available = getAvailableQuestions();
        if (available.length === 0) return null;
        const idx = Math.floor(Math.random() * available.length);
        return available[idx];
    }

    function hasReachedDailyLimit() {
        const asked = getDailyRecord();
        return asked.length >= 2;
    }

    function markQuestionAsked(questionId) {
        const asked = getDailyRecord();
        if (!asked.includes(questionId)) {
            asked.push(questionId);
            saveDailyRecord(asked);
        }
    }

    // ─── 显示快问快答卡片 ──────────────────

    function showQuiz(question, isFirstTrigger = false) {
        if (!question) return;
        if (currentQuiz) {
            closeQuiz(true);
        }

        currentQuiz = question;
        currentQuizId = question.id;
        isAnswered = false;
        isTimeout = false;

        const overlay = document.getElementById('quick-quiz-overlay');
        if (!overlay) return;

        // 更新梦角头像
        const avatarEl = document.getElementById('qq-avatar');
        if (avatarEl) {
            const partnerImg = document.querySelector('#partner-avatar img');
            if (partnerImg) {
                avatarEl.innerHTML = `<img src="${partnerImg.src}">`;
            } else {
                avatarEl.innerHTML = `<i class="fas fa-user"></i>`;
            }
        }

        // 更新发送者名称
        const senderEl = document.getElementById('qq-sender');
        if (senderEl) senderEl.textContent = getPartnerName();

        // 题目类型
        const typeEl = document.getElementById('qq-type');
        if (typeEl) {
            typeEl.textContent = question.type === 'choice' ? '选择题' : '填空题';
            typeEl.style.background = question.type === 'choice' 
                ? 'rgba(var(--accent-color-rgb), 0.15)' 
                : 'rgba(76, 217, 100, 0.15)';
            typeEl.style.color = question.type === 'choice' 
                ? 'var(--accent-color)' 
 : '#4cd964';
        }

        // 题目内容
        const questionEl = document.getElementById('qq-question');
        if (questionEl) questionEl.textContent = question.question;

        // 选项/输入区域
        const optionsContainer = document.getElementById('qq-options-container');
        const inputContainer = document.getElementById('qq-input-container');
        const inputEl = document.getElementById('qq-input');

        // 重置结果区域
        const resultArea = document.getElementById('qq-result-area');
        if (resultArea) resultArea.innerHTML = '';

        if (question.type === 'choice') {
            optionsContainer.style.display = 'flex';
            inputContainer.style.display = 'none';
            optionsContainer.innerHTML = question.options.map((opt, idx) => `
                <button class="quick-quiz-option" data-index="${idx}">${opt}</button>
            `).join('');

            optionsContainer.querySelectorAll('.quick-quiz-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (isAnswered || isTimeout) return;
                    optionsContainer.querySelectorAll('.quick-quiz-option').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    document.getElementById('qq-submit-btn').disabled = false;
                });
            });
        } else {
            optionsContainer.style.display = 'none';
            inputContainer.style.display = 'block';
            if (inputEl) {
                inputEl.value = '';
                inputEl.disabled = false;
                setTimeout(() => inputEl.focus(), 300);
                inputEl.addEventListener('input', function() {
                    if (isAnswered || isTimeout) return;
                    document.getElementById('qq-submit-btn').disabled = !this.value.trim();
                });
            }
        }

        // 设置计时器
        totalTime = question.type === 'choice' ? 7 : 60;
        timeLeft = totalTime;
        updateTimerBar();

        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerBar();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                handleTimeout();
            }
        }, 1000);

        // 显示卡片
        overlay.classList.add('active');

        // 绑定按钮
        const submitBtn = document.getElementById('qq-submit-btn');
        submitBtn.disabled = true;
        submitBtn.onclick = function() {
            if (isAnswered || isTimeout) return;
            handleSubmit();
        };

        const skipBtn = document.getElementById('qq-skip-btn');
        skipBtn.onclick = function() {
            closeQuiz(false);
        };

        const closeBtn = document.getElementById('qq-close-btn');
        closeBtn.onclick = function() {
            closeQuiz(false);
        };

        overlay.onclick = function(e) {
            if (e.target === overlay) {
                closeQuiz(false);
            }
        };

        if (!isFirstTrigger) {
            markQuestionAsked(question.id);
        }

        closeCallback = null;
    }

    // ─── 更新计时条 ──────────────────────────
    function updateTimerBar() {
        const bar = document.getElementById('qq-timer-bar');
        if (!bar) return;
        const pct = (timeLeft / totalTime) * 100;
        bar.style.width = Math.max(0, pct) + '%';
        bar.classList.toggle('danger', pct < 20);
    }

    // ─── 处理超时 ──────────────────────────
    function handleTimeout() {
        if (isAnswered || isTimeout) return;
        isTimeout = true;

        const resultArea = document.getElementById('qq-result-area');
        if (resultArea) {
            resultArea.innerHTML = `<div class="quick-quiz-timeout"><i class="fas fa-hourglass-end"></i> 时间到！未作答</div>`;
        }

        const inputEl = document.getElementById('qq-input');
        if (inputEl) inputEl.disabled = true;
        document.getElementById('qq-submit-btn').disabled = true;
        document.querySelectorAll('.quick-quiz-option').forEach(b => b.style.pointerEvents = 'none');

        setTimeout(() => closeQuiz(false), 3000);
    }

    // ─── 处理提交 ──────────────────────────
    function handleSubmit() {
        if (isAnswered || isTimeout) return;

        let answer = '';
        if (currentQuiz.type === 'choice') {
            const selected = document.querySelector('.quick-quiz-option.selected');
            if (!selected) {
                showNotification('请选择一个选项', 'warning');
                return;
            }
            answer = selected.textContent.trim();
        } else {
            const inputEl = document.getElementById('qq-input');
            if (!inputEl || !inputEl.value.trim()) {
                showNotification('请输入你的回答', 'warning');
                return;
            }
            answer = inputEl.value.trim();
        }

        isAnswered = true;
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        document.querySelectorAll('.quick-quiz-option').forEach(b => b.style.pointerEvents = 'none');
        const inputEl = document.getElementById('qq-input');
        if (inputEl) inputEl.disabled = true;
        document.getElementById('qq-submit-btn').disabled = true;

        const resultArea = document.getElementById('qq-result-area');
        if (resultArea) {
            resultArea.innerHTML = `<div class="quick-quiz-answered"><i class="fas fa-check-circle"></i> 已作答</div>`;
        }

        // 发送回答到聊天
        const senderName = getMyName();
        const partnerName = getPartnerName();
        const questionText = currentQuiz.question;
        const typeLabel = currentQuiz.type === 'choice' ? '选择题' : '填空题';

        const messageText = `【快问快答 · ${typeLabel}】\n${partnerName} 问：${questionText}\n\n${senderName} 答：${answer}`;

        if (typeof addMessage === 'function') {
            addMessage({
                id: Date.now() + Math.random(),
                sender: 'user',
                text: messageText,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                favorited: false,
                note: null
            });
            if (typeof playSound === 'function') playSound('send');
        } else if (typeof messages !== 'undefined') {
            messages.push({
                id: Date.now() + Math.random(),
                sender: 'user',
                text: messageText,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                favorited: false,
                note: null
            });
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(false);
        }

        setTimeout(() => closeQuiz(false), 2000);
    }

    // ─── 关闭卡片 ──────────────────────────
    function closeQuiz(silent = false) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        const overlay = document.getElementById('quick-quiz-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.onclick = null;
        }
        currentQuiz = null;
        currentQuizId = null;
        isAnswered = false;
        isTimeout = false;
        if (closeCallback) {
            const cb = closeCallback;
            closeCallback = null;
            cb();
        }
    }

    // ─── 调度系统 ──────────────────────────

    function scheduleNextQuiz(isFirstTrigger = false) {
        if (quizSchedulerTimer) {
            clearTimeout(quizSchedulerTimer);
            quizSchedulerTimer = null;
        }

        if (!isFirstTrigger && hasReachedDailyLimit()) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const msToMidnight = tomorrow - now;
            quizSchedulerTimer = setTimeout(() => {
                saveDailyRecord([]);
                scheduleNextQuiz(false);
            }, msToMidnight + 1000);
            return;
        }

        const available = getAvailableQuestions();
        if (available.length === 0) {
            saveDailyRecord([]);
            const delay = 30 * 60 * 1000 + Math.random() * 60 * 60 * 1000;
            quizSchedulerTimer = setTimeout(() => {
                scheduleNextQuiz(false);
            }, delay);
            return;
        }

        const question = available[Math.floor(Math.random() * available.length)];
        if (!question) return;

        let delay;
        if (isFirstTrigger) {
            delay = 60 * 1000 + Math.random() * 14 * 60 * 1000;
        } else {
            const hours = 2 + Math.random() * 10;
            delay = hours * 60 * 60 * 1000;
        }

        quizSchedulerTimer = setTimeout(() => {
            if (!isFirstTrigger && hasReachedDailyLimit()) {
                const now = new Date();
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const msToMidnight = tomorrow - now;
                quizSchedulerTimer = setTimeout(() => {
                    saveDailyRecord([]);
                    scheduleNextQuiz(false);
                }, msToMidnight + 1000);
                return;
            }

            const freshAvailable = getAvailableQuestions();
            if (freshAvailable.length === 0) {
                saveDailyRecord([]);
                const nextDelay = 30 * 60 * 1000 + Math.random() * 60 * 60 * 1000;
                quizSchedulerTimer = setTimeout(() => {
                    scheduleNextQuiz(false);
                }, nextDelay);
                return;
            }

            const freshQuestion = freshAvailable[Math.floor(Math.random() * freshAvailable.length)];
            if (freshQuestion) {
                if (isFirstTrigger) {
                    isFirstTriggerDone = true;
                    markQuestionAsked(freshQuestion.id);
                    showQuiz(freshQuestion, true);
                    scheduleNextQuiz(false);
                } else {
                    showQuiz(freshQuestion, false);
                    scheduleNextQuiz(false);
                }
            }
        }, delay);
    }

    // ─── 启动系统 ──────────────────────────

    function startQuickQuizSystem() {
        const today = getTodayStr();
        try {
            const raw = localStorage.getItem(DAILY_QUIZ_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data.date !== today) {
                    saveDailyRecord([]);
                }
            } else {
                saveDailyRecord([]);
            }
        } catch(e) {
            saveDailyRecord([]);
        }

        // 首次触发：页面打开后15分钟内弹出
const firstDelay = 60 * 1000 + Math.random() * 14 * 60 * 1000; // 1-15分钟
        setTimeout(() => {
            const available = getAvailableQuestions();
            if (available.length > 0) {
                const question = available[Math.floor(Math.random() * available.length)];
                if (question) {
                    showQuiz(question, true);
                    isFirstTriggerDone = true;
                    markQuestionAsked(question.id);
                    scheduleNextQuiz(false);
                } else {
                    scheduleNextQuiz(false);
                }
            } else {
                saveDailyRecord([]);
                scheduleNextQuiz(false);
            }
        }, firstDelay);

        // 跨天重置检测（每30分钟）
        setInterval(() => {
            const currentToday = getTodayStr();
            try {
                const raw = localStorage.getItem(DAILY_QUIZ_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    if (data.date !== currentToday) {
                        saveDailyRecord([]);
                        if (quizSchedulerTimer) {
                            clearTimeout(quizSchedulerTimer);
                            quizSchedulerTimer = null;
                        }
                        scheduleNextQuiz(false);
                    }
                }
            } catch(e) {}
        }, 30 * 60 * 1000);
    }

    // ─── 暴露全局 ──────────────────────────

    window.quickQuiz = {
        showQuiz,
        closeQuiz,
        getAvailableQuestions,
        getDailyRecord,
        markQuestionAsked,
        startQuickQuizSystem
    };

    // ─── 初始化 ──────────────────────────

    function init() {
        const overlay = document.getElementById('quick-quiz-overlay');
        if (!overlay) {
            console.warn('[快问快答] 未找到 #quick-quiz-overlay');
            return;
        }

        setTimeout(() => {
            startQuickQuizSystem();
        }, 2000);

        console.log('[快问快答] 系统已启动 (z-index: 99999)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1500);
    }

})();
