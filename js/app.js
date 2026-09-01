		// 在 <script> 开头或 DOMContentLoaded 中添加
		(function fixFileInputs() {
		    // 修复所有文件导入input的accept属性
		    const fixAccept = () => {
		        document.querySelectorAll('input[type="file"]').forEach(input => {
		            const currentAccept = input.getAttribute('accept') || '';
		            
		            // 如果是JSON导入但没有明确MIME类型
		            if (currentAccept.includes('.json') && !currentAccept.includes('application/json')) {
		                input.setAttribute('accept', currentAccept + ',application/json');
		            }
		            
		            // 如果是TXT导入但没有明确MIME类型
		            if (currentAccept.includes('.txt') && !currentAccept.includes('text/plain')) {
		                input.setAttribute('accept', currentAccept + ',text/plain');
		            }
		            
		            // 如果完全没有accept属性，不给它设置（避免拉起相机）
		            if (!currentAccept && input.id) {
		                // 根据ID判断用途
		                if (input.id.includes('import') || input.id.includes('upload')) {
		                    input.setAttribute('accept', 'application/json,text/plain,application/octet-stream');
		                }
		            }
		        });
		    };
		    
		    // 在DOM准备好后执行
		    if (document.readyState === 'loading') {
		        document.addEventListener('DOMContentLoaded', fixAccept);
		    } else {
		        fixAccept();
		    }
		    
		    // 监听动态创建的input
		    const observer = new MutationObserver(fixAccept);
		    observer.observe(document.body, { childList: true, subtree: true });
		})();
        /*应用常量与数据结构*/
// 从 localStorage 读取 TTS 设置（由“我们在一起”模块保存）
function getTogetherTtsConfig() {
  try {
    const raw = localStorage.getItem('together_data');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.ttsConfig || null;
  } catch (e) {
    return null;
  }
}

// 判断 TTS 功能是否已配置（API Key 不为空）
function isTtsReady() {
  const cfg = getTogetherTtsConfig();
  return cfg && cfg.apiKey && cfg.apiKey.trim() !== '';
}
        const APP_PREFIX = 'CHAT_APP_V3_';
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
        const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
        const MESSAGES_PER_PAGE = 50;
        
        const CONSTANTS = {
            HEADER_MOTTOS: [],
            WELCOME_ANIMATIONS: [{
                line1: "♡ 爱 ♡",
                line2: "✧ 正在连接我们的思绪 ✧"
            },
                {
                    line1: "𝑳𝒐𝒗𝒆",
                    line2: "若要由我来谈论爱的话"
                },
                {
                    line1: "𝕰𝖈𝖍𝖔",
                    line2: "听见我的回音了吗？"
                },
                {
                    line1: "𝚂𝚘𝚞𝚕𝚖𝚊𝚝𝚎",
                    line2: "灵魂正在共振"
                },
                {
                    line1: "Akashic Eye",
                    line2: "链接已建立"
                },
                {
                    line1: "✦ 相遇 ✦",
                    line2: "在万千人海中遇见你"
                },
                {
                    line1: "詩篇",
                    line2: "为你写下的每一行诗"
                },
                {
                    line1: "Melody",
                    line2: "心跳的旋律为你奏响"
                },
                {
                    line1: "Destiny",
                    line2: "命运的红线将我们相连"
                },
                {
                    line1: "Memory",
                    line2: "创造属于我们的回忆"
                },
                {
                    line1: "言葉",
                    line2: "想传达给你的话语"
                },
                {
                    line1: "絆",
                    line2: "看不见的羁绊"
                },
                {
                    line1: "未来",
                    line2: "一起走向的未来"
                },
                {
                    line1: "希望",
                    line2: "你就是我的希望"
                },
                {
                    line1: "光",
                    line2: "你是我生命中的光"
                },
                {
                    line1: "Amore",
                    line2: "心跳漏拍的那一秒"
                },
                {
                    line1: "共振",
                    line2: "频率相同的两个灵魂"
                },
                {
                    line1: "∞",
                    line2: "无限循环的思念"
                },
                {
                    line1: "Serendipity",
                    line2: "最美丽的意外"
                },
                {
                    line1: "浮世",
                    line2: "沉浮人世间的温柔"
                },
                {
                    line1: "量子纠缠",
                    line2: "超越距离的默契"
                },
                {
                    line1: "Elysian",
                    line2: "与你共度的理想乡"
                },
                {
                    line1: "星轨",
                    line2: "交汇时互放的光亮"
                },
                {
                    line1: "虹色",
                    line2: "折射出所有的可能"
                },
                {
                    line1: "Paracosm",
                    line2: "共同构建的私宇宙"
                },
                {
                    line1: "潮汐",
                    line2: "因你而起的律动"
                },
                {
                    line1: "Æther",
                    line2: "弥漫在空气中的悸动"
                },
                {
                    line1: "双星",
                    line2: "彼此环绕的永恒舞蹈"
                },
                {
                    line1: "绯色",
                    line2: "染上脸颊的温度"
                },
                {
                    line1: "Symphony",
                    line2: "生命交织的乐章"
                },
                {
                    line1: "经纬",
                    line2: "注定相遇的坐标"
                },
                {
                    line1: "Nebula",
                    line2: "朦胧而璀璨的心事"
                },
                {
                    line1: "时雨",
                    line2: "恰到好处的温柔"
                },
                {
                    line1: "Event Horizon",
                    line2: "再也无法逃离的引力"
                },
                {
                    line1: "花火",
                    line2: "刹那即永恒的光芒"
                },
                {
                    line1: "ℰ𝓉𝑒𝓇𝓃𝒶𝓁",
                    line2: "时间停驻的此刻"
                },
                {
                    line1: "韶光",
                    line2: "与你共度的每寸光阴"
                },
                {
                    line1: "𝒮𝓊𝓂𝓂𝑒𝓇",
                    line2: "永不结束的盛夏"
                },
                {
                    line1: "星霜",
                    line2: "共同经历的岁月"
                },
                {
                    line1: "𝓚𝓲𝓼𝓼",
                    line2: "未说出口的告白"
                },
                {
                    line1: "月下",
                    line2: "两人独处的夜晚"
                },
                {
                    line1: "𝓕𝓸𝓻𝓮𝓿varepsilon𝓻",
                    line2: "想要延续的永远"
                },
                {
                    line1: "朝露",
                    line2: "晶莹剔透的真心"
                },
                {
                    line1: "𝓜𝓲𝓻𝓪𝓬𝓵𝓮",
                    line2: "你就是奇迹本身"
                },
                {
                    line1: "春风",
                    line2: "轻轻拂过的温柔"
                },
                {
                    line1: "𝓛𝓾𝓬𝓴𝔂",
                    line2: "此生最大的幸运"
                },
                {
                    line1: "萤火",
                    line2: "黑暗中指引的光"
                },
                {
                    line1: "𝓗𝓮𝓪𝓻𝓽",
                    line2: "为你跳动的心脏"
                },
                {
                    line1: "初雪",
                    line2: "纯洁无瑕的爱意"
                },
                {
                    line1: "𝓒𝓸𝓶𝓮𝓽",
                    line2: "划过天际的相遇"
                },
                {
                    line1: "潮鸣",
                    line2: "内心澎湃的声音"
                },
                {
                    line1: "𝓢𝓽𝓪𝓻𝓭𝓾𝓼𝓽",
                    line2: "散落在身的星尘"
                },
                {
                    line1: "梧桐",
                    line2: "等待凤凰的执着"
                },
                {
                    line1: "𝓟𝓻𝓮𝓬𝓲𝓸𝓾𝓼",
                    line2: "视若珍宝的你我"
                },
                {
                    line1: "青空",
                    line2: "澄澈如你的眼眸"
                },
                {
                    line1: "𝒜𝓂𝒶𝓇𝓃𝓉𝒽",
                    line2: "永不凋零的心意"
                },
                {
                    line1: "Étoile",
                    line2: "你是我唯一的星辰"
                },
                {
                    line1: "𝑩𝒍ü𝒕𝒆",
                    line2: "悄然绽放的恋慕"
                },
                {
                    line1: "運命",
                    line2: "避无可避的相遇"
                },
                {
                    line1: "𝑪𝒆𝒍𝒆𝒔𝒕𝒆",
                    line2: "来自天际的馈赠"
                },
                {
                    line1: "恋心",
                    line2: "藏不住的悸动"
                },
                {
                    line1: "𝑺𝒆𝒓𝒂𝒑𝒉",
                    line2: "守护你的六翼天使"
                },
                {
                    line1: "一期一会",
                    line2: "一生一次的邂逅"
                },
                {
                    line1: "𝑬𝒑𝒐𝒏𝒂",
                    line2: "穿越时空的眷恋"
                },
                {
                    line1: "月の雫",
                    line2: "月光凝成的泪滴"
                },
                {
                    line1: "𝑽𝒆𝒓𝒔𝒂𝒊𝒍𝒍𝒆𝒔",
                    line2: "为你建造的宫殿"
                },
                {
                    line1: "千夜一夜",
                    line2: "诉不尽的夜话"
                },
                {
                    line1: "𝑴𝒂𝒓é𝒆",
                    line2: "温柔席卷的浪潮"
                },
                {
                    line1: "桃源郷",
                    line2: "只属于两人的乐土"
                },
                {
                    line1: "𝑺𝒐𝒖𝒇𝒇𝒍𝒆𝒓",
                    line2: "甜蜜的折磨"
                },
                {
                    line1: "桜吹雪",
                    line2: "纷飞如雪的思念"
                },
                {
                    line1: "𝑨𝒖𝒓𝒐𝒓𝒆",
                    line2: "黎明前的极光"
                },
                {
                    line1: "十六夜",
                    line2: "最圆满的夜晚"
                },
                {
                    line1: "𝑪𝒚𝒂𝒏𝒐𝒑𝒉𝒚𝒍𝒍𝒆",
                    line2: "青涩的恋之叶"
                },
                {
                    line1: "金木犀",
                    line2: "秋日里暗香浮动"
                },
            ],
            WELCOME_ICONS: [
                "fas fa-heart", "fas fa-star", "fas fa-moon", "fas fa-sun", "fas fa-cloud", "fas fa-feather", "fas fa-book", "fas fa-music", "fas fa-pen", "fas fa-key", "fas fa-compass", "fas fa-globe", "fas fa-leaf", "fas fa-water", "fas fa-fire", "fas fa-snowflake", "fas fa-umbrella", "fas fa-anchor", "fas fa-bell", "fas fa-gem", "fas fa-crown", "fas fa-dragon", "fas fa-feather-alt", "fas fa-fish", "fas fa-frog", "fas fa-hat-wizard", "fas fa-magic", "fas fa-ring", "fas fa-scroll", "fas fa-shield-alt", "fas fa-dove", "fas fa-cat", "fas fa-dog", "fas fa-horse", "fas fa-otter", "fas fa-paw", "fas fa-spider", "fas fa-kiwi-bird", "fas fa-crow", "fas fa-dove", "fas fa-seedling", "fas fa-tree", "fas fa-mountain", "fas fa-water", "fas fa-wind", "fas fa-volcano", "fas fa-meteor", "fas fa-satellite", "fas fa-rocket", "fas fa-user-astronaut"
            ],
            PARTNER_STATUSES: [],
            REPLY_MESSAGES: [],
            REPLY_EMOJIS: [],
            POKE_ACTIONS: [],
            TAROT_CARDS: [
                { name: "愚人", eng: "The Fool", meaning: "新的开始、冒险、天真、无畏", keyword: "流浪", icon: "fa-hiking" },
                { name: "魔术师", eng: "The Magician", meaning: "创造力、技能、意志力、化腐朽为神奇", keyword: "创造", icon: "fa-hat-wizard" },
                { name: "女祭司", eng: "The High Priestess", meaning: "直觉、潜意识、神秘、智慧", keyword: "智慧", icon: "fa-book-open" },
                { name: "女帝", eng: "The Empress", meaning: "丰饶、母性、自然、感官享受", keyword: "丰收", icon: "fa-seedling" },
                { name: "皇帝", eng: "The Emperor", meaning: "权威、结构、控制、父亲形象", keyword: "支配", icon: "fa-crown" },
                { name: "教皇", eng: "The Hierophant", meaning: "传统、信仰、教导、精神指引", keyword: "援助", icon: "fa-church" },
                { name: "恋人", eng: "The Lovers", meaning: "爱、和谐、关系、价值观的选择", keyword: "结合", icon: "fa-heart" },
                { name: "战车", eng: "The Chariot", meaning: "意志力、胜利、决心、自我控制", keyword: "胜利", icon: "fa-horse-head" },
                { name: "力量", eng: "Strength", meaning: "勇气、耐心、控制、内在力量", keyword: "意志", icon: "fa-fist-raised" },
                { name: "隐士", eng: "The Hermit", meaning: "内省、孤独、寻求真理、指引", keyword: "探索", icon: "fa-lightbulb" },
                { name: "命运之轮", eng: "Wheel of Fortune", meaning: "循环、命运、转折点、运气", keyword: "轮回", icon: "fa-dharmachakra" },
                { name: "正义", eng: "Justice", meaning: "公正、真理、因果、法律", keyword: "均衡", icon: "fa-balance-scale" },
                { name: "倒吊人", eng: "The Hanged Man", meaning: "牺牲、新的视角、等待、放下", keyword: "奉献", icon: "fa-user-injured" },
                { name: "死神", eng: "Death", meaning: "结束、转变、重生、放手", keyword: "结束", icon: "fa-skull" },
                { name: "节制", eng: "Temperance", meaning: "平衡、适度、耐心、调和", keyword: "净化", icon: "fa-glass-whiskey" },
                { name: "恶魔", eng: "The Devil", meaning: "束缚、物质主义、欲望、诱惑", keyword: "诱惑", icon: "fa-link" },
                { name: "高塔", eng: "The Tower", meaning: "突变、混乱、启示、破坏", keyword: "毁灭", icon: "fa-gopuram" },
                { name: "星星", eng: "The Star", meaning: "希望、灵感、平静、治愈", keyword: "希望", icon: "fa-star" },
                { name: "月亮", eng: "The Moon", meaning: "幻觉、恐惧、焦虑、潜意识", keyword: "不安", icon: "fa-moon" },
                { name: "太阳", eng: "The Sun", meaning: "快乐、成功、活力、清晰", keyword: "生命", icon: "fa-sun" },
                { name: "审判", eng: "Judgement", meaning: "复活、觉醒、号召、决定", keyword: "复活", icon: "fa-bullhorn" },
                { name: "世界", eng: "The World", meaning: "完成、整合、成就、圆满", keyword: "达成", icon: "fa-globe-americas" }
            ]
        };

window.APP_PREFIX = APP_PREFIX;

        function safeGetItem(key) {
            try { return localStorage.getItem(key); }
            catch (e) { console.error('Error getting item:', e); return null; }
        }

        function safeSetItem(key, value) {
            try {
                if (typeof value === 'object') value = JSON.stringify(value);
                localStorage.setItem(key, value);
            } catch (e) { console.error('Error setting item:', e); }
        }

        function safeRemoveItem(key) {
            try { localStorage.removeItem(key); }
            catch (e) { console.error('Error removing item:', e); }
        }

function getRandomItem(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeStringStrict(s) {
    if (typeof s !== 'string') return '';
    return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function deduplicateContentArray(arr, baseSystemArray = []) {
    const seen = new Set(baseSystemArray.map(normalizeStringStrict));
    const result = [];
    let removedCount = 0;
    for (const item of arr) {
        const norm = normalizeStringStrict(item);
        if (norm !== '' && !seen.has(norm)) {
            seen.add(norm);
            result.push(item);
        } else {
            removedCount++;
        }
    }
    return { result, removedCount };
}

        function cropImageToSquare(file, maxSize = 640) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const minSide = Math.min(img.width, img.height);
                        const sx = (img.width - minSide) / 2;
                        const sy = (img.height - minSide) / 2;
                        const canvas = document.createElement('canvas');
                        canvas.width = maxSize; canvas.height = maxSize;
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);
                        resolve(canvas.toDataURL('image/jpeg', 0.95));
                    };
                    img.onerror = reject;
                    img.src = e.target.result;
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }


     function downloadFileFallback(blob, fileName) {
         // ----- 5+ App 环境：直接写入文本 -----
         if (typeof window.plus !== 'undefined') {
             const reader = new FileReader();
             reader.onload = function () {
                 // reader.result 就是文本内容（JSON 字符串）
                 const content = reader.result;
                 plus.io.resolveLocalFileSystemURL(
                     '_downloads/',  // 保存到公共下载目录
                     function (dirEntry) {
                         dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
                             fileEntry.createWriter(function (writer) {
                                 writer.onwrite = function () {
                                     plus.nativeUI.toast('文件已保存到下载目录');
                                     // 可选：尝试打开文件
                                     plus.runtime.openFile(fileEntry.fullPath, {}, function () {}, function (e) {
                                         console.log('打开文件失败，但已保存：' + e.message);
                                     });
                                 };
                                 writer.onerror = function (err) {
                                     plus.nativeUI.toast('保存失败：' + err.message);
                                 };
                                 writer.write(content);   // 直接写文本
                             }, function (err) {
                                 plus.nativeUI.toast('创建写入失败：' + err.message);
                             });
                         }, function (err) {
                             plus.nativeUI.toast('创建文件失败：' + err.message);
                         });
                     },
                     function (err) {
                         plus.nativeUI.toast('无法访问下载目录：' + err.message);
                     }
                 );
             };
             reader.readAsText(blob);   // 以文本方式读取
             return;
         }
     
         // ----- 非 5+ 环境（普通浏览器 / PWA）-----
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = fileName;
         link.style.display = 'none';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setTimeout(() => URL.revokeObjectURL(url), 2000);
     }
     
     function exportDataToMobileOrPC(dataString, fileName) {
         // 5+ App 中直接写文件
         if (typeof window.plus !== 'undefined') {
             const blob = new Blob([dataString], { type: 'application/json' });
             downloadFileFallback(blob, fileName);
             return;
         }
     
         // 普通浏览器尝试分享或下载
         if (navigator.share && navigator.canShare) {
             try {
                 const blob = new Blob([dataString], { type: 'application/json' });
                 const file = new File([blob], fileName, { type: 'application/json' });
                 if (navigator.canShare({ files: [file] })) {
                     navigator.share({ files: [file], title: '传讯数据备份', text: '请选择"保存到文件"' })
                         .catch(() => downloadFileFallback(blob, fileName));
                     return;
                 }
             } catch (e) {}
         }
         const blob = new Blob([dataString], { type: 'application/json' });
         downloadFileFallback(blob, fileName);
     }

        localforage.config({
            driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
            name: 'ChatApp_V3', version: 1.0, storeName: 'chat_data',
            description: 'Storage for Chat App V3'
        });

        function showNotification(message, type = 'info', duration = 3000) {
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            const iconMap = { success:'fa-check-circle', error:'fa-exclamation-circle', info:'fa-info-circle', warning:'fa-exclamation-triangle' };
            notification.innerHTML = `<i class="fas ${iconMap[type] || 'fa-info-circle'}"></i><span>${message}</span>`;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.classList.add('hiding');
                notification.addEventListener('animationend', () => notification.remove());
            }, duration);
        }

        const playSound = (type) => {
            if (!settings.soundEnabled) return;
            try {
                const profileMap = { send: 'my_send', message: 'partner_message', poke: 'my_poke' };
                const profileKey = profileMap[type] || type;
                const profile = settings.soundProfiles && settings.soundProfiles[profileKey];
                if (profile && profile.preset && window.EnhancementUI) {
                    window.EnhancementUI.playProfile(profileKey);
                    return;
                }
                if (settings.customSoundUrl && settings.customSoundUrl.trim()) {
                    const audio = new Audio(settings.customSoundUrl.trim());
                    audio.volume = Math.min(1, Math.max(0, settings.soundVolume || 0.15));
                    audio.play().catch(() => {});
                    return;
                }
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                const vol = Math.min(0.5, Math.max(0.01, settings.soundVolume || 0.1));
                gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
                if (type === 'send') oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                else if (type === 'favorite') oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
                else oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.start();
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15);
                oscillator.stop(audioContext.currentTime + 0.15);
            } catch (e) { console.warn("音频播放失败:", e); }
        };

        const throttledSaveData = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveData, 500);
        };

async function applyCustomFont(url) {
    if (!url || !url.trim()) {
        document.documentElement.style.removeProperty('--font-family');
        document.documentElement.style.removeProperty('--message-font-family');
        return;
    }
    const fontName = 'UserCustomFont';
    try {
        const font = new FontFace(fontName, `url(${url})`);
        await font.load();
        document.fonts.add(font);
        const fontStack = `"${fontName}", 'Noto Serif SC', serif`;
        document.documentElement.style.setProperty('--font-family', fontStack);
        document.documentElement.style.setProperty('--message-font-family', fontStack);
        if (typeof settings !== 'undefined') settings.messageFontFamily = fontStack;
    } catch (e) {
        console.error('字体加载失败:', e);
        showNotification('字体加载失败，请检查链接是否有效', 'error');
    }
}

function applyCustomBubbleCss(cssCode) {
    const styleId = 'user-custom-bubble-style';
    let styleTag = document.getElementById(styleId);
    if (!cssCode || !cssCode.trim()) { if (styleTag) styleTag.remove(); return; }
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = styleId; }
    document.head.appendChild(styleTag);

    function boostSpecificity(css) {
        return css.replace(/([^{}@][^{}]*)\{([^{}]*)\}/g, (match, rawSel, body) => {
            const selectors = rawSel.split(',').map(s => s.trim()).filter(Boolean);
            const boosted = selectors.map(sel => {
                if (sel.startsWith('html') || sel.startsWith('@') || sel.startsWith('from') || sel.startsWith('to') || /^\d/.test(sel)) return sel;
                return `html body ${sel}`;
            });
            return `${boosted.join(', ')} {${body}}`;
        });
    }

    const boostedCss = boostSpecificity(cssCode);

    styleTag.textContent = boostedCss + `
/* image bubble reset — must stay !important */
html[data-theme] .message.message-image-bubble-none,
html body .message.message-image-bubble-none {
    background: transparent !important; border: none !important;
    box-shadow: none !important; padding: 0 !important; border-radius: 0 !important;
}`;

    try {
        const alreadyCustomized = (typeof settings !== 'undefined' && settings.customThemeColors) ? settings.customThemeColors : {};
        const sentMatch  = cssCode.match(/\.message-sent\s*\{([^}]*)\}/);
        const recvMatch  = cssCode.match(/\.message-received\s*\{([^}]*)\}/);
        if (sentMatch && !alreadyCustomized['--message-sent-text']) {
            const colorLine = sentMatch[1].match(/\bcolor\s*:\s*([^;}\n]+)/);
            if (colorLine) {
                const v = colorLine[1].trim().replace(/!important/g,'').trim();
                if (v && !v.startsWith('var(')) {
                    document.documentElement.style.setProperty('--message-sent-text', v);
                }
            }
        }
        if (recvMatch && !alreadyCustomized['--message-received-text']) {
            const colorLine = recvMatch[1].match(/\bcolor\s*:\s*([^;}\n]+)/);
            if (colorLine) {
                const v = colorLine[1].trim().replace(/!important/g,'').trim();
                if (v && !v.startsWith('var(')) {
                    document.documentElement.style.setProperty('--message-received-text', v);
                }
            }
        }
    } catch(e) {}
}

function applyGlobalThemeCss(cssCode) {
    const styleId = 'user-custom-global-theme-style';
    let styleTag = document.getElementById(styleId);
    if (!cssCode || !cssCode.trim()) { if (styleTag) styleTag.remove(); return; }
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = styleId; document.head.appendChild(styleTag); }
    styleTag.textContent = cssCode;
}

async function exportAllData() {
    try {
        showNotification('正在收集数据…', 'info', 2000);
        const keys = await localforage.keys();
        const idbData = {};
        for (const k of keys) {
            try { idbData[k] = await localforage.getItem(k); } catch(e) {}
        }
        const lsData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k) lsData[k] = localStorage.getItem(k);
        }
        const payload = {
            version: '3.1-full', appName: 'ChatApp',
            exportDate: new Date().toISOString(), type: 'full',
            indexedDB: idbData, localStorage: lsData
        };
        const str = JSON.stringify(payload, null, 2);
        const fileName = `chat-full-backup-${new Date().toISOString().slice(0,10)}.json`;
        const blob = new Blob([str], { type: 'application/json' });
        downloadFileFallback(blob, fileName);
    } catch(e) {
        console.error('全量导出失败:', e);
        showNotification('全量导出失败，请重试', 'error');
    }
}

async function importAllData(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            let raw = e.target.result;
            if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
            const data = JSON.parse(raw);
            if (data.type !== 'full') {
                if (typeof importChatHistory === 'function') importChatHistory(file);
                return;
            }
            if (!confirm('全量恢复将覆盖所有现有数据，确认继续？')) return;
            showNotification('正在恢复数据…', 'info', 3000);
            if (data.indexedDB) {
                for (const [k, v] of Object.entries(data.indexedDB)) {
                    try { await localforage.setItem(k, v); } catch(err) {}
                }
            }
            if (data.localStorage) {
                for (const [k, v] of Object.entries(data.localStorage)) {
                    try { localStorage.setItem(k, v); } catch(err) {}
                }
            }
            showNotification('恢复成功，即将刷新页面…', 'success', 2000);
            setTimeout(() => location.reload(), 2200);
        } catch(e) {
            console.error('全量导入失败:', e);
            showNotification('文件损坏或格式不兼容', 'error');
        }
    };
    reader.readAsText(file);
}

/**
 * state.js - Application State Variables & DOM Elements
 * 应用状态变量与DOM元素引用
 * NOTE: This must be loaded after the DOM is ready (or wrapped in DOMContentLoaded)
 */

        let SESSION_ID = null;
        let autoSendTimer = null; 
        let sessionList = [];
        let messages = [];
        let settings = {};
        let partnerPersonas = []; 
        let showPartnerNameInChat = false; 
        let readNoReplyTimer = null; 
        let isBatchMode = false;
        let batchMessages = [];
        let currentReplyTo = null;
        let lastCoinResult = null;
        let currentNoteMessageId = null;
        let savedBackgrounds = [];
        let saveTimeout;
        let displayedMessageCount = 20;
        const HISTORY_BATCH_SIZE = 20;
        let isLoadingHistory = false;
        let isBatchFavoriteMode = false;
        let selectedMessages = [];
        let customReplies = [];
        let customPokes = [];
        let customStatuses = [];
        let customMottos = [];
        let customIntros = []; 
        let currentMajorTab = 'reply'; 
        let currentSubTab = 'custom';  
        let currentReplyTab = 'custom';
        let customEmojis = [];
        let anniversaries = [];
        let stickerLibrary = []; 
        let myStickerLibrary = []; 
        let currentAnniversaryType = 'anniversary';
        let customThemes = [];
        let themeSchemes = []; 
        const DOMElements = {
            html: document.documentElement,
            chatContainer: document.getElementById('chat-container'),
            messageInput: document.getElementById('message-input'),
            sendBtn: document.getElementById('send-btn'),
            attachmentBtn: document.getElementById('attachment-btn'),
            imageInput: document.getElementById('image-input'),
            themeToggle: document.getElementById('theme-toggle'),
            batchBtn: document.getElementById('batch-btn'),
            continueBtn: document.getElementById('continue-btn'),
            comboBtn: document.getElementById('combo-btn'),
            coinTossOverlay: document.getElementById('coin-toss-overlay'),
            animatedCoin: document.getElementById('animated-coin'),
            coinResultText: document.getElementById('coin-result-text'),
            cancelCoinResult: document.getElementById('cancel-coin-result'),
            sendCoinResult: document.getElementById('send-coin-result'),
            typingIndicator: document.getElementById('typing-indicator'),
            emptyState: document.getElementById('empty-state'),
            welcomeAnimation: document.getElementById('welcome-animation'),
            batchPreview: document.getElementById('batch-preview'),
            replyPreviewContainer: document.getElementById('reply-preview-container'),
            pagination: document.getElementById('pagination'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            pageInfo: document.getElementById('page-info'),
            editModal: {
                modal: document.getElementById('edit-modal'),
                title: document.getElementById('edit-modal-title'),
                input: document.getElementById('name-input'),
                cancel: document.getElementById('cancel-edit'),
                save: document.getElementById('save-name')
            },
            avatarModal: {
                modal: document.getElementById('avatar-modal'),
                title: document.getElementById('avatar-modal-title'),
                input: document.getElementById('avatar-input'),
                cancel: document.getElementById('cancel-avatar'),
                save: document.getElementById('save-avatar')
            },
            noteModal: {
                modal: document.getElementById('note-modal'),
                input: document.getElementById('note-input'),
                cancel: document.getElementById('cancel-note'),
                save: document.getElementById('save-note')
            },
            pokeModal: {
                modal: document.getElementById('poke-modal'),
                input: document.getElementById('poke-input'),
                cancel: document.getElementById('cancel-poke'),
                save: document.getElementById('send-poke')
            },
            settingsModal: {
                modal: document.getElementById('settings-modal'),
                settingsBtn: document.getElementById('settings-btn'),
                cancel: document.getElementById('cancel-settings')
            },
            favoritesModal: {
                modal: document.getElementById('stats-modal'),
                favoritesBtn: document.getElementById('group-chat-btn'),
                list: document.getElementById('favorites-list'),
                cancel: document.getElementById('close-stats')
            },
            statsModal: {
                modal: document.getElementById('stats-modal'),
                content: document.getElementById('stats-content'),
                closeBtn: document.getElementById('close-stats')
            },
            sessionModal: {
                modal: document.getElementById('session-modal'),
                managerBtn: document.getElementById('session-manager-btn'),
                list: document.getElementById('session-list'),
                createBtn: document.getElementById('create-new-session'),
                cancelBtn: document.getElementById('cancel-session')
            },
            fortuneModal: {
                modal: document.getElementById('fortune-lenormand-modal'),
                content: document.getElementById('fortune-content'),
                shareBtn: document.getElementById('share-fortune'),
                closeBtn: document.getElementById('close-fortune')
            },
            customRepliesModal: {
                modal: document.getElementById('custom-replies-modal'),
                list: document.getElementById('custom-replies-list'),
                addBtn: document.getElementById('add-custom-reply'),
                closeBtn: document.getElementById('close-custom-replies')
            },
            backgroundInput: document.getElementById('background-input'),
            importInput: document.getElementById('import-input'),
            partner: {
                name: document.getElementById('partner-name'),
                avatarContainer: document.getElementById('partner-avatar-container'), 
                avatar: document.getElementById('partner-avatar'),
                status: document.getElementById('partner-status').querySelector('span')
            },
            me: {
                name: document.getElementById('my-name'),
                avatarContainer: document.getElementById('my-avatar-container'), 
                avatar: document.getElementById('my-avatar'),
                statusContainer: document.getElementById('my-status-container'),
                statusText: document.getElementById('my-status-text')
            },
            anniversaryModal: {
                modal: document.getElementById('anniversary-modal'),
                closeBtn: document.getElementById('close-anniversary-modal'),
                saveBtn: document.getElementById('save-ann-btn'),
                addBtn: document.getElementById('open-ann-add-btn'),
                dateInput: document.getElementById('ann-input-date'),
                nameInput: document.getElementById('ann-input-name'),
                displayArea: document.getElementById('anniversary-display'),
                daysElement: document.getElementById('anniversary-days'),
                dateShowElement: document.getElementById('anniversary-date-show'),
                list: document.getElementById('ann-list-container'),
                typeHint: document.getElementById('ann-type-desc')
            },            
            anniversaryAnimation: {
                modal: document.getElementById('anniversary-animation'),
                title: document.getElementById('anniversary-animation-title'),
                days: document.getElementById('anniversary-animation-days'),
                message: document.getElementById('anniversary-animation-message'),
                closeBtn: document.getElementById('close-anniversary-animation')
            },
            appearanceModal: {
                modal: document.getElementById('appearance-modal'),
                closeBtn: document.getElementById('close-appearance')
            },
            chatModal: {
                modal: document.getElementById('chat-modal'),
                closeBtn: document.getElementById('close-chat')
            },
            advancedModal: {
                modal: document.getElementById('advanced-modal'),
                closeBtn: document.getElementById('close-advanced')
            },
            dataModal: {
                modal: document.getElementById('data-modal'),
                closeBtn: document.getElementById('close-data')
            }
        };

        /*核心应用逻辑：数据加载保存、消息渲染、会话管理等*/

        function clearAllAppData() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
    overlay.innerHTML = `
        <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:340px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
            <div style="text-align:center;margin-bottom:20px;">
                <div style="width:52px;height:52px;border-radius:50%;background:rgba(255,80,80,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                    <i class="fas fa-trash-alt" style="color:#ff5050;font-size:20px;"></i>
                </div>
                <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">重置数据</div>
                <div style="font-size:12px;color:var(--text-secondary);">请选择要重置的范围</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <button id="_reset_current" style="width:100%;padding:12px 16px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);color:var(--text-primary);font-size:13px;font-weight:600;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
                    <i class="fas fa-comment-slash" style="color:var(--accent-color);font-size:15px;width:18px;text-align:center;"></i>
                    <span>仅清除当前会话消息</span>
                </button>
                <button id="_reset_all" style="width:100%;padding:12px 16px;border:1px solid rgba(255,80,80,0.3);border-radius:12px;background:rgba(255,80,80,0.06);color:#ff5050;font-size:13px;font-weight:600;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;transition:all 0.2s;">
                    <i class="fas fa-bomb" style="font-size:15px;width:18px;text-align:center;"></i>
                    <span>重置所有数据（完全清空）</span>
                </button>
                <button id="_reset_cancel" style="width:100%;padding:10px 16px;border:none;border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;transition:all 0.2s;">取消</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    function closeDialog() { overlay.remove(); }
    overlay.addEventListener('click', e => { if (e.target === overlay) closeDialog(); });
    document.getElementById('_reset_cancel').onclick = closeDialog;

    document.getElementById('_reset_current').onclick = () => {
        closeDialog();
        if (confirm('确定要清除当前会话的所有消息吗？此操作无法恢复！')) {
            messages = [];
            window.messages = messages; // 双保险：同步 window 属性
            displayedMessageCount = HISTORY_BATCH_SIZE;

            // 立即清除 localStorage 备份，防止 _tryRecoverFromBackup 在 IndexedDB 写入前恢复旧消息
            try { localStorage.removeItem('BACKUP_V1_critical'); } catch(e) {}
            try { localStorage.removeItem('BACKUP_V1_timestamp'); } catch(e) {}

            // 直接写入 IndexedDB（跳过 500ms 防抖），确保刷新后不恢复
            localforage.setItem(getStorageKey('chatMessages'), []).catch(() => {});

            renderMessages();
            showNotification('当前会话消息已清除', 'success');
        }
    };

    document.getElementById('_reset_all').onclick = () => {
        closeDialog();
        if (confirm('【高危操作】确定要重置所有数据吗？此操作将清除所有本地数据且无法恢复！')) {
            window._skipBackup = true;
            messages = [];
            settings = {};
            localforage.clear().then(() => {
                localStorage.clear();
                showNotification('所有数据已重置，页面即将刷新', 'info', 2000);
                setTimeout(() => { window.location.href = window.location.pathname + '?reset=' + Date.now(); }, 2000);
            }).catch(e => {
                window._skipBackup = false;
                showNotification('清除数据时发生错误', 'error');
                console.error("清除 localforage 失败:", e);
            });
        }
    };
}


        function getDefaultSettings() {
            return {
                partnerName: "梦角",
                myName: "我",
                myStatus: "在线",
                partnerStatus: "在线",
                isDarkMode: false,
                colorTheme: "gold",
                soundEnabled: true,
                typingIndicatorEnabled: true,
                readReceiptsEnabled: true,
                replyEnabled: true,
                lastStatusChange: Date.now(),
                nextStatusChange: 1 + Math.random() * 7,
                fontSize: 16,
                bubbleStyle: 'standard',
                messageFontFamily: "'Noto Serif SC', serif",
                messageFontWeight: 400,
                messageLineHeight: 1.5,
                musicPlayerEnabled: false,
                replyDelayMin: 3000,
                replyDelayMax: 7000,
                inChatAvatarEnabled: true,
                inChatAvatarSize: 36,
                inChatAvatarPosition: 'center',
                alwaysShowAvatar: false,
                showPartnerNameInChat: false,
                customFontUrl: "", 
        customBubbleCss: "",
        customGlobalCss: "",
                myAvatarFrame: null, 
                partnerAvatarFrame: null,
                myAvatarShape: 'circle',
                partnerAvatarShape: 'circle',
autoSendEnabled: false,
autoSendInterval: 5,
        allowReadNoReply: false, 
        readNoReplyChance: 0.2,
        timeFormat: 'HH:mm',
        customSoundUrl: '',
        soundVolume: 0.15,
        bottomCollapseMode: false,
        emojiMixEnabled: true,
        voiceCardEnabled: true,
        partnerRecallEnabled: true,
        partnerHangupEnabled: true,
        partnerRedpacketEnabled: true,
        combineReplyCards: false,
        quickPokes: [],
        soundProfiles: {}
            };
        }


        function renderBackgroundGallery() {
            const list = document.getElementById('background-gallery-list');
            if (!list) return;

            list.innerHTML = '';

            
            const addBtn = document.createElement('div');
            addBtn.className = 'bg-item bg-add-btn';
            
            addBtn.innerHTML = '<i class="fas fa-plus"></i><span></span>';
            addBtn.onclick = () => document.getElementById('bg-gallery-input').click();
            list.appendChild(addBtn);

            const currentBg = safeGetItem(getStorageKey('chatBackground'));

            savedBackgrounds.forEach((bg, index) => {
                const item = document.createElement('div');
                let isActive = false;

                if (currentBg && currentBg === bg.value) isActive = true;

                item.className = `bg-item ${isActive ? 'active': ''}`;

                if (bg.type === 'image') {
                    item.innerHTML = `<img src="${bg.value}" loading="lazy" alt="bg">`;
                } else {
                    item.innerHTML = `<div class="bg-color-block" style="background: ${bg.value}"></div>`;
                }

                item.onclick = (e) => {
                    if (e.target.closest('.bg-delete-btn')) return;
                    applyBackground(bg.value);
                    safeSetItem(getStorageKey('chatBackground'), bg.value);
                    localforage.setItem(getStorageKey('chatBackground'), bg.value);
                    renderBackgroundGallery();
                    showNotification('背景已切换', 'success');
                };

                if (bg.id.startsWith('user-')) {
                    const delBtn = document.createElement('div');
                    delBtn.className = 'bg-delete-btn';
                    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    delBtn.title = "删除此背景";
                    delBtn.onclick = (e) => {
                        e.stopPropagation();
                        if (confirm('确定删除这张背景图吗？')) {
                            savedBackgrounds.splice(index, 1);
                            saveBackgroundGallery();

                            if (isActive) {
                                removeBackground(); 
                                renderBackgroundGallery();
                            } else {
                                renderBackgroundGallery();
                            }
                        }
                    };
                    item.appendChild(delBtn);
                }

                list.appendChild(item);
            });
        }



        function saveBackgroundGallery() {
    localforage.setItem(getStorageKey('backgroundGallery'), savedBackgrounds);
}


        const applyBackground = (value) => {
            if (!value || typeof value !== 'string') return;
            try {
                if (value.startsWith('linear-gradient') || value.startsWith('#') || value.startsWith('rgb')) {
                    document.documentElement.style.setProperty('--chat-bg-image', value);
                } else {
                    const cssValue = value.startsWith('url(') ? value : `url(${value})`;
                    document.documentElement.style.setProperty('--chat-bg-image', cssValue);
                }
                document.body.classList.add('with-background');
            } catch (e) {
                if (typeof removeBackground === 'function') removeBackground();
            }
        };


const loadData = async () => {
    try {
        settings = getDefaultSettings();
        
        const results = await Promise.allSettled([
            localforage.getItem(getStorageKey('chatSettings')),
            localforage.getItem(getStorageKey('chatMessages')),
            localforage.getItem(getStorageKey('backgroundGallery')),
            localforage.getItem(getStorageKey('customReplies')),
            localforage.getItem(getStorageKey('customPokes')),
            localforage.getItem(getStorageKey('customStatuses')),
            localforage.getItem(getStorageKey('customMottos')),
            localforage.getItem(getStorageKey('customIntros')),
            localforage.getItem(getStorageKey('anniversaries')),
            localforage.getItem(getStorageKey('stickerLibrary')),
            localforage.getItem(`${APP_PREFIX}customThemes`),
            localforage.getItem(getStorageKey('chatBackground')),
            localforage.getItem(getStorageKey('partnerAvatar')),
            localforage.getItem(getStorageKey('myAvatar')),
            localforage.getItem(getStorageKey('partnerPersonas')), 
            localforage.getItem(getStorageKey('showPartnerNameInChat')),
            localforage.getItem(`${APP_PREFIX}themeSchemes`),
            localforage.getItem(getStorageKey('myStickerLibrary')),
            localforage.getItem(getStorageKey('customReplyGroups'))
        ]);
        const getVal = (index) => results[index].status === 'fulfilled' ? results[index].value : null;

        const savedSettings = getVal(0);
        const savedMessages = getVal(1);
        const savedBgGallery = getVal(2);
        const savedCustomReplies = getVal(3);
        const savedPokes = getVal(4);
        const savedStatuses = getVal(5);
        const savedMottos = getVal(6);
        const savedIntros = getVal(7);
        const savedAnniversaries = getVal(8);
        const savedStickers = getVal(9);
        const savedCustomThemes = getVal(10);
        const savedChatBg = getVal(11);
        const partnerAvatarSrc = getVal(12);
        const myAvatarSrc = getVal(13);
        const savedPartnerPersonas = getVal(14);
        const savedShowNameConfig = getVal(15);
        const savedThemeSchemes = getVal(16);
        const savedMyStickers = getVal(17);
        const savedReplyGroups = getVal(18);

        if (savedPartnerPersonas) partnerPersonas = savedPartnerPersonas;

        if (savedSettings) Object.assign(settings, savedSettings);

        if (settings.showPartnerNameInChat !== undefined) {
            showPartnerNameInChat = settings.showPartnerNameInChat;
        } else if (savedShowNameConfig !== null) {
            showPartnerNameInChat = savedShowNameConfig;
        }
        document.body.classList.toggle('show-partner-name', showPartnerNameInChat);
        try {
            if (settings.customFontUrl) applyCustomFont(settings.customFontUrl);
            if (settings.customBubbleCss) applyCustomBubbleCss(settings.customBubbleCss);
            if (settings.customGlobalCss) applyGlobalThemeCss(settings.customGlobalCss);
        } catch(e) { console.warn("样式应用失败", e); }
        
        if (savedPokes) customPokes = savedPokes;
        else customPokes = [...CONSTANTS.POKE_ACTIONS];

        if (savedStatuses) customStatuses = savedStatuses;
        else customStatuses = [...CONSTANTS.PARTNER_STATUSES];

        if (savedMottos) customMottos = savedMottos;
        else customMottos = [...CONSTANTS.HEADER_MOTTOS];
        
        if (savedIntros) customIntros = savedIntros;
        else customIntros = CONSTANTS.WELCOME_ANIMATIONS.map(a => `${a.line1}|${a.line2}`);

        if (savedMessages && Array.isArray(savedMessages)) {
            messages = savedMessages.map(m => ({
                ...m, timestamp: new Date(m.timestamp)
            }));
        } else {
            const backup = _tryRecoverFromBackup();
            if (backup && Array.isArray(backup.messages) && backup.messages.length > 0) {
                const timeSince = Math.round((Date.now() - backup.ts) / 60000);
                console.warn(`[loadData] 主存储无消息，正在从备份恢复（备份时间：${timeSince} 分钟前）`);
                messages = backup.messages.map(m => ({
                    ...m, timestamp: new Date(m.timestamp)
                }));
                if (backup.settings) Object.assign(settings, backup.settings);
                if (backup.anniversaries && Array.isArray(backup.anniversaries)) {
                    anniversaries = backup.anniversaries;
                }
                setTimeout(() => saveData(), 1000);
                showNotification(
                    `已从备份恢复 ${messages.length} 条消息${backup._truncated ? '（备份为最近200条）' : ''}`,
                    'warning', 6000
                );
            } else {
                messages = [];
            }
        }

        if (savedBgGallery) {
            savedBackgrounds = savedBgGallery;
        } else {
            savedBackgrounds = [{ id: 'preset-1', type: 'color', value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }];
        }

        if (savedCustomReplies) customReplies = savedCustomReplies;
        if (savedReplyGroups) window.customReplyGroups = savedReplyGroups;
        if (savedAnniversaries) anniversaries = savedAnniversaries;
        if (savedStickers) stickerLibrary = savedStickers;
        if (savedMyStickers) myStickerLibrary = savedMyStickers;
        if (savedCustomThemes) customThemes = savedCustomThemes;
        if (savedThemeSchemes) themeSchemes = savedThemeSchemes;
        try { const ce = await localforage.getItem(getStorageKey('customEmojis')); if (ce && Array.isArray(ce)) customEmojis = ce; } catch(e) {}
        window._customReplies = customReplies;
        window._CONSTANTS = CONSTANTS;

        if (DOMElements && DOMElements.partner && DOMElements.me) {
            updateAvatar(DOMElements.partner.avatar, partnerAvatarSrc);
            updateAvatar(DOMElements.me.avatar, myAvatarSrc);
        }

        if (savedChatBg) {
            applyBackground(savedChatBg);
        } else {
            const lsBg = safeGetItem(getStorageKey('chatBackground'));
            if (lsBg) {
                applyBackground(lsBg);
                localforage.setItem(getStorageKey('chatBackground'), lsBg);
            }
        }

        try { await initMoodData(); } catch(e) { console.warn("心情数据加载失败", e); }
        try { await loadEnvelopeData(); } catch(e) { console.warn("信封数据加载失败", e); }
        
        displayedMessageCount = HISTORY_BATCH_SIZE;
        
        setTimeout(() => {
            applyAllAvatarFrames();
            manageAutoSendTimer(); 
            checkEnvelopeStatus(); 
            updateUI();
            if (settings.customBubbleCss) {
                try { applyCustomBubbleCss(settings.customBubbleCss); } catch(e) {}
            }
        }, 100);

    } catch (e) {
        console.error("LoadData 内部致命错误:", e);
        settings = getDefaultSettings();
        messages = [];
        updateUI();
    }
};

const LIBRARY_CONFIG = {
    reply: {
        title: "回复库管理",
        tabs: [
            { id: 'custom', name: '主字卡', mode: 'list' },
            { id: 'emojis', name: 'Emoji', mode: 'grid' },
            { id: 'stickers', name: '表情库', mode: 'grid' }
        ]
    },
    atmosphere: {
        title: "氛围感配置",
        tabs: [
            { id: 'pokes', name: '拍一拍', mode: 'list' },
            { id: 'statuses', name: '对方状态', mode: 'list' },
            { id: 'mottos', name: '顶部格言', mode: 'list' },
            { id: 'intros', name: '开场动画', mode: 'list' }
        ]
    }
};
let currentAnnType = 'anniversary'; 

window.openMyStickerSettings = function() {
    const picker = document.getElementById('user-sticker-picker');
    if (picker) picker.classList.remove('active');
    if (typeof currentMajorTab !== 'undefined') {
        currentMajorTab = 'reply';
        currentSubTab = 'stickers';
    }
    var sidebarBtns = document.querySelectorAll('.sidebar-btn');
    sidebarBtns.forEach(function(b) { b.classList.toggle('active', b.dataset.major === 'reply'); });
    if (typeof renderReplyLibrary === 'function') renderReplyLibrary();
    var modal = document.getElementById('custom-replies-modal');
    if (modal && typeof showModal === 'function') showModal(modal);
};

window.switchAnnType = function(type) {
    currentAnnType = type;
    currentAnniversaryType = type; 
    document.querySelectorAll('.ann-type-btn').forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const desc = document.getElementById('ann-type-desc');
    if(desc) {
        desc.textContent = type === 'anniversary' 
            ? '计算从过去某一天到现在已经过了多少天 (例如: 相识、恋爱)' 
            : '计算从现在到未来某一天还剩下多少天 (例如: 生日、跨年)';
    }
};

window.deleteAnniversaryItem = function(id) {
    if(confirm("确定要删除这条记录吗？")) {
        anniversaries = anniversaries.filter(a => a.id !== id);
        throttledSaveData(); 
        renderAnniversariesList();
        showNotification('已删除', 'success');
    }
};

const _BACKUP_PREFIX = 'BACKUP_V1_';
function _backupCriticalData() {
    if (window._skipBackup) return;
    try {
        const backupPayload = {
            ts: Date.now(),
            messages: messages,
            settings: settings,
            sessionId: SESSION_ID,
            anniversaries: anniversaries
        };

        let payloadToStore = backupPayload;
        const msgSizeEstimate = messages.length * 500; 
        if (msgSizeEstimate > 3 * 1024 * 1024) {
            payloadToStore = {
                ...backupPayload,
                messages: messages.slice(-200),
                _truncated: true
            };
        }

        const json = JSON.stringify(payloadToStore);

        if (json.length > 4.5 * 1024 * 1024) {
            const smallerPayload = {
                ...payloadToStore,
                messages: messages.slice(-50),
                _truncated: true
            };
            const smallerJson = JSON.stringify(smallerPayload);
            localStorage.setItem(_BACKUP_PREFIX + 'critical', smallerJson);
        } else {
            localStorage.setItem(_BACKUP_PREFIX + 'critical', json);
        }
        localStorage.setItem(_BACKUP_PREFIX + 'timestamp', String(Date.now()));
    } catch (e) {
        console.warn('localStorage 备份写入失败（可能存储已满）:', e);
    }
}

function _tryRecoverFromBackup() {
    try {
        const raw = localStorage.getItem(_BACKUP_PREFIX + 'critical');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

const saveData = async () => {
    if (!SESSION_ID) {
        console.warn('[saveData] SESSION_ID 尚未初始化，跳过保存以防数据写入临时 key');
        return;
    }

    const promises = [
        { key: 'chatSettings',           val: () => localforage.setItem(getStorageKey('chatSettings'), settings) },
        { key: 'customReplies',          val: () => localforage.setItem(getStorageKey('customReplies'), customReplies) },
        { key: 'customReplyGroups',      val: () => localforage.setItem(getStorageKey('customReplyGroups'), window.customReplyGroups || []) },
        { key: 'customEmojis',           val: () => localforage.setItem(getStorageKey('customEmojis'), customEmojis) },
        { key: 'anniversaries',          val: () => localforage.setItem(getStorageKey('anniversaries'), anniversaries) },
        { key: 'customPokes',            val: () => localforage.setItem(getStorageKey('customPokes'), customPokes) },
        { key: 'customStatuses',         val: () => localforage.setItem(getStorageKey('customStatuses'), customStatuses) },
        { key: 'customMottos',           val: () => localforage.setItem(getStorageKey('customMottos'), customMottos) },
        { key: 'customIntros',           val: () => localforage.setItem(getStorageKey('customIntros'), customIntros) },
        { key: 'stickerLibrary',         val: () => localforage.setItem(getStorageKey('stickerLibrary'), stickerLibrary) },
        { key: 'myStickerLibrary',       val: () => localforage.setItem(getStorageKey('myStickerLibrary'), myStickerLibrary) },
        { key: 'customThemes',           val: () => localforage.setItem(`${APP_PREFIX}customThemes`, customThemes) },
        { key: 'themeSchemes',           val: () => localforage.setItem(`${APP_PREFIX}themeSchemes`, themeSchemes) },
        { key: 'chatMessages',           val: () => localforage.setItem(getStorageKey('chatMessages'), messages) },
    ];

    const partnerAvatarSrc = (() => {
        try {
            const img = DOMElements.partner.avatar.querySelector('img');
            return img ? img.src : null;
        } catch(e) { return null; }
    })();
    const myAvatarSrc = (() => {
        try {
            const img = DOMElements.me.avatar.querySelector('img');
            return img ? img.src : null;
        } catch(e) { return null; }
    })();

    if (partnerAvatarSrc) {
        promises.push({ key: 'partnerAvatar', val: () => localforage.setItem(getStorageKey('partnerAvatar'), partnerAvatarSrc) });
    } else {
        promises.push({ key: 'partnerAvatar', val: () => localforage.removeItem(getStorageKey('partnerAvatar')) });
    }

    if (myAvatarSrc) {
        promises.push({ key: 'myAvatar', val: () => localforage.setItem(getStorageKey('myAvatar'), myAvatarSrc) });
    } else {
        promises.push({ key: 'myAvatar', val: () => localforage.removeItem(getStorageKey('myAvatar')) });
    }

    const results = await Promise.allSettled(promises.map(p => {
        try { return p.val(); }
        catch(e) { return Promise.reject(e); }
    }));

    const failed = [];
    results.forEach((r, i) => {
        if (r.status === 'rejected') {
            failed.push(promises[i].key);
            console.error(`[saveData] 保存失败: ${promises[i].key}`, r.reason);
        }
    });

    if (failed.length > 0) {
        console.warn(`[saveData] ${failed.length} 项写入失败，已触发 localStorage 降级备份`, failed);
    }

    _backupCriticalData();
};

        function initializeRandomUI() {


            document.querySelector('.header-motto').textContent = getRandomItem(CONSTANTS.HEADER_MOTTOS);
if (customMottos && customMottos.length > 0) {
    document.querySelector('.header-motto').textContent = getRandomItem(customMottos);
} else {
    document.querySelector('.header-motto').textContent = '';
}
            const placeholder = "";
            DOMElements.messageInput.placeholder = placeholder.length > 20 ? placeholder.substring(0, 20) + "...": placeholder;


            const starsContainer = document.getElementById('stars-container');
            starsContainer.innerHTML = '';
            const starCount = 80;
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const size = Math.random() * 2.5 + 0.5;
                const duration = Math.random() * 4 + 2;
                const delay = Math.random() * 6;
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.setProperty('--duration', `${duration}s`);
                star.style.animationDelay = `${delay}s`;
                starsContainer.appendChild(star);
            }
            const particlesContainer = document.getElementById('welcome-particles');
            if (particlesContainer) {
                particlesContainer.innerHTML = '';
                const types = ['petal', 'petal', 'petal', 'sparkle', 'sparkle'];
                for (let i = 0; i < 22; i++) {
                    const p = document.createElement('div');
                    const type = types[i % types.length];
                    p.className = `wp ${type}`;
                    const sz = type === 'petal' ? (Math.random() * 6 + 5) : (Math.random() * 4 + 2);
                    p.style.setProperty('--pSz', sz + 'px');
                    p.style.left = (Math.random() * 100) + '%';
                    p.style.setProperty('--pDur', (Math.random() * 10 + 9) + 's');
                    p.style.setProperty('--pDel', (Math.random() * 8) + 's');
                    p.style.setProperty('--pX1', (Math.random() * 50 - 25) + 'px');
                    p.style.setProperty('--pX2', (Math.random() * 80 - 40) + 'px');
                    p.style.setProperty('--pX3', (Math.random() * 50 - 25) + 'px');
                    particlesContainer.appendChild(p);
                }
            }

            const meteorsContainer = document.getElementById('welcome-meteors');
            if (meteorsContainer) {
                meteorsContainer.innerHTML = '';
                let meteorCount = 0;
                const MAX_METEORS = 12;
                const createMeteor = () => {
                    if (meteorCount >= MAX_METEORS) return;
                    meteorCount++;
                    const m = document.createElement('div');
                    m.className = 'meteor';
                    m.style.left = (Math.random() * 100) + '%';
                    m.style.top = (Math.random() * 35) + '%';
                    const dur = (Math.random() * 0.8 + 0.7);
                    m.style.setProperty('--mDur', dur + 's');
                    m.style.setProperty('--mDel', '0s');
                    m.style.setProperty('--mRot', (25 + Math.random() * 20) + 'deg');
                    meteorsContainer.appendChild(m);
                    setTimeout(() => { m.remove(); meteorCount = Math.max(0, meteorCount - 1); }, (dur + 0.1) * 1000);
                };
                for (let i = 0; i < 8; i++) setTimeout(createMeteor, i * 350);
                const meteorTimer = setInterval(createMeteor, 600);
                setTimeout(() => clearInterval(meteorTimer), 5000);
            }

            const loaderBarEl = document.getElementById('loader-tech-bar');
            if (loaderBarEl) {
                setTimeout(() => loaderBarEl.classList.add('pulsing'), 300);
            }


            const welcomeIcon = getRandomItem(CONSTANTS.WELCOME_ICONS);
document.querySelector('.logo-icon-main').innerHTML = `<i class="${welcomeIcon}"></i>`;

if (customIntros && customIntros.length > 0) {
    const rawIntro = getRandomItem(customIntros);
    const parts = rawIntro.split('|');
    const line1 = parts[0];
    const line2 = parts[1] || ""; 

    const titleEl = document.getElementById('welcome-title-glitch');
    const subEl = document.getElementById('welcome-subtitle-scramble');

    titleEl.classList.remove('playing');
    titleEl.textContent = line1;
    void titleEl.offsetWidth;
    titleEl.classList.add('playing');

    const scrambleText = (element, finalText, duration = 1500) => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
                const length = finalText.length;
                let start = Date.now();

                const interval = setInterval(() => {
                    const now = Date.now();
                    const progress = (now - start) / duration;

                    if (progress >= 1) {
                        element.textContent = finalText;
                        clearInterval(interval);
                        return;
                    }

                    let result = '';

                    const revealIndex = Math.floor(progress * length);

                    for (let i = 0; i < length; i++) {
                        if (i <= revealIndex) {
                            result += finalText[i];
                        } else {

                            result += chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                    element.textContent = result;
                },
                    40);
            };


          setTimeout(() => {
        scrambleText(subEl, line2, 2000);
    }, 600);
} else {
    document.getElementById('welcome-title-glitch').textContent = "传讯";
    document.getElementById('welcome-subtitle-scramble').textContent = "请在设置中添加开场动画";
}


            const loaderBar = document.getElementById('loader-tech-bar');
            const statusText = document.getElementById('loader-status-text');
            loaderBar.style.width = '0%';
            const loadingPhases = [
                { width: '15%', text: 'INITIALIZING · 初始化中' },
                { width: '40%', text: 'LOADING MEMORIES · 读取记忆' },
                { width: '70%', text: 'BUILDING WORLD · 构建世界' },
                { width: '90%', text: 'ALMOST THERE · 即将完成' },
                { width: '100%', text: 'CONNECTED · 连接成功' }
            ];
            const delays = [100, 700, 1600, 2400, 2900];
            delays.forEach((delay, i) => {
                setTimeout(() => {
                    loaderBar.style.width = loadingPhases[i].width;
                    if (statusText) statusText.textContent = loadingPhases[i].text;
                }, delay);
            });
        }

function manageAutoSendTimer() {
    if (autoSendTimer) {
        clearInterval(autoSendTimer);
        autoSendTimer = null;
    }
    if (settings.autoSendEnabled) {
        const intervalMs = settings.autoSendInterval * 60 * 1000;
        
        autoSendTimer = setInterval(() => {
            if (!document.body.classList.contains('batch-favorite-mode')) {
                simulateReply(); 
            }
        }, intervalMs);
    }
}

        const updateUI = () => {
            const isCustomTheme = settings.colorTheme.startsWith('custom-');
            if (isCustomTheme) {
                const themeId = settings.colorTheme;
                const theme = customThemes.find(t => t.id === themeId);
                if (theme) {
                    applyTheme(theme.colors);
                } else {
                    DOMElements.html.setAttribute('data-color-theme', 'gold');
                }
            } else {
                DOMElements.html.setAttribute('data-color-theme', settings.colorTheme);
                applyTheme(null, true);
            }
            
            if (settings.customThemeColors && Object.keys(settings.customThemeColors).length > 0) {
                for (const [variable, value] of Object.entries(settings.customThemeColors)) {
                    document.documentElement.style.setProperty(variable, value);
                }
            }

            DOMElements.html.setAttribute('data-theme', settings.isDarkMode ? 'dark': 'light');
            DOMElements.themeToggle.innerHTML = settings.isDarkMode ? '<i class="fas fa-sun"></i>': '<i class="fas fa-moon"></i>';
            DOMElements.partner.name.textContent = settings.partnerName;
            DOMElements.me.name.textContent = settings.myName;
            DOMElements.partner.status.textContent = settings.partnerStatus || '在线';
            DOMElements.me.statusText.textContent = settings.myStatus;
            if (typeof window.updateDynamicNames === 'function') window.updateDynamicNames();
            document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
            
            const fontToUse = settings.messageFontFamily || "'Noto Serif SC', serif";
            
            document.documentElement.style.setProperty('--message-font-family', fontToUse);
            document.documentElement.style.setProperty('--font-family', fontToUse);
            document.documentElement.style.setProperty('--message-font-weight', settings.messageFontWeight);
            document.documentElement.style.setProperty('--message-line-height', settings.messageLineHeight);

            document.documentElement.style.setProperty('--in-chat-avatar-size', `${settings.inChatAvatarSize}px`);
            const _alignMap = { 'top': 'flex-start', 'center': 'center', 'bottom': 'flex-end', 'custom': 'flex-start' };
            document.documentElement.style.setProperty('--avatar-align', _alignMap[settings.inChatAvatarPosition || 'center'] || 'center');
            if (settings.inChatAvatarPosition === 'custom' && settings.inChatAvatarCustomOffset !== undefined) {
                document.documentElement.style.setProperty('--avatar-custom-offset', settings.inChatAvatarCustomOffset + 'px');
            }
            document.body.classList.toggle('always-show-avatar', !!settings.alwaysShowAvatar);
            if (typeof _applyCollapseState === 'function') _applyCollapseState(!!settings.bottomCollapseMode);
            document.body.classList.toggle('show-partner-name', !!(settings.showPartnerNameInChat || showPartnerNameInChat));

            document.querySelectorAll('.theme-color-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === settings.colorTheme);
            });


            document.querySelectorAll('[data-bubble-style]').forEach(item => {
                item.classList.toggle('active', item.dataset.bubbleStyle === settings.bubbleStyle);
            });

            const _pillSyncMap = {
                '#reply-toggle': 'replyEnabled',
                '#sound-toggle': 'soundEnabled',
                '#read-receipts-toggle': 'readReceiptsEnabled',
                '#typing-indicator-toggle': 'typingIndicatorEnabled',
                '#read-no-reply-toggle': 'allowReadNoReply',
                '#emoji-mix-toggle': 'emojiMixEnabled',
                '#auto-send-toggle': 'autoSendEnabled'
            };
            for (const [sel, prop] of Object.entries(_pillSyncMap)) {
                const el = document.querySelector(sel);
                if (el) {
                    const val = prop === 'emojiMixEnabled' ? (settings[prop] !== false) : !!settings[prop];
                    el.classList.toggle('active', val);
                }
            }
            const _immToggle = document.getElementById('immersive-toggle');
            if (_immToggle) _immToggle.classList.toggle('active', document.body.classList.contains('immersive-mode'));

            renderMessages();
        };

        const updateAvatar = (element, src) => {
            if (src) element.innerHTML = `<img src="${src}" alt="avatar">`; else element.innerHTML = `<i class="fas fa-user"></i>`;
        };

        const removeBackground = () => {
            document.documentElement.style.removeProperty('--chat-bg-image');
            document.body.classList.remove('with-background');
            localforage.removeItem(getStorageKey('chatBackground'));
            safeRemoveItem(getStorageKey('chatBackground'));
            showNotification('背景图片已移除', 'success');
        };

        window.scrollToQuotedMessage = function(el) {
            const id = el.getAttribute('data-reply-id');
            if (!id) return;
            const tryScroll = () => {
                const target = document.querySelector(`[data-msg-id="${id}"]`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.classList.add('msg-highlight');
                    setTimeout(() => target.classList.remove('msg-highlight'), 1500);
                    return true;
                }
                return false;
            };
            if (!tryScroll()) {
                const msgIndex = messages.findIndex(m => String(m.id) === String(id));
                if (msgIndex === -1) {
                    if (typeof showNotification === 'function') showNotification('消息可能已被删除', 'info');
                    return;
                }
                const needed = messages.length - msgIndex;
                if (needed > displayedMessageCount) {
                    displayedMessageCount = needed;
                    renderMessages(false);
                    setTimeout(tryScroll, 150);
                } else {
                    if (typeof showNotification === 'function') showNotification('消息可能已被删除', 'info');
                }
            }
        };
// 在renderMessages函数中，渲染完成后调用
function initXhsCardSliders() {
    document.querySelectorAll('.xhs-card-slider-container').forEach(container => {
        if (container.dataset.xhsInitialized) return;
        container.dataset.xhsInitialized = 'true';
        
        const slider = container.closest('.xhs-card-slider');
        const dots = slider?.querySelectorAll('.xhs-card-dot');
        const countSpan = slider?.querySelector('.xhs-card-image-count');
        const items = container.children;
        
        if (!items.length) return;
        
        const updateIndicator = () => {
            const scrollLeft = container.scrollLeft;
            const itemWidth = items[0].offsetWidth;
            const currentIndex = Math.round(scrollLeft / itemWidth);
            
            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
            
            if (countSpan) {
                countSpan.innerHTML = `<i class="fas fa-image"></i> ${currentIndex + 1}/${items.length}`;
            }
        };
        
        container.addEventListener('scroll', updateIndicator);
        updateIndicator();
        
        // 触摸/拖动优化
        let isDown = false;
        let startX, scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 1.5;
            container.scrollLeft = scrollLeft - walk;
        });
    });
}
// 内存缓存：会话内避免重复生成（刷新后缓存清空自然失效）
const _voiceAudioCache = {};
let voiceGenerating = false;

async function handleVoiceBubbleClick(msg) {
  if (typeof msg === 'undefined') return;
  if (voiceGenerating) return;

  // 用户实录语音已经带有可播放的 data/blob URL，不经过 TTS 二次生成。
  if (msg.voiceUrl || (msg.voice && msg.voice.url)) {
    const source = msg.voiceUrl || msg.voice.url;
    const recordedAudio = new Audio(source);
    recordedAudio.play().catch(() => showNotification('语音播放失败', 'error'));
    return;
  }

  // 1. 检查内存缓存（如果已在本会话生成过，直接播放）
  if (_voiceAudioCache[msg.id]) {
    const cached = _voiceAudioCache[msg.id];
    if (cached.audioUrl && cached.audioDuration > 0) {
      const audio = new Audio(cached.audioUrl);
      audio.play().catch(e => showNotification('播放失败', 'error'));
      return;
    }
  }

  // 2. 强制重新生成（忽略之前可能保存的无效 voiceUrl）
  const cfg = getTogetherTtsConfig();
  if (!cfg || !cfg.apiKey) {
    showNotification('缺少 MiniMax API 设置', 'warning');
    return;
  }

  const voiceText = (msg.voicePrefix || '') + msg.text;
  voiceGenerating = true;

  try {
    const requestBody = {
      model: 'speech-2.8-hd',
      text: voiceText,
      stream: false,
      voice_setting: {
        voice_id: cfg.voiceId || 'Chinese (Mandarin)_Lyrical_Voice',
        speed: cfg.speed || 1.0,
        vol: 1.0,
        pitch: 0
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: 'mp3',
        channel: 2
      },
      pronunciation_dict: { tone: [] },
      subtitle_enable: false
    };

    const resp = await fetch('https://api.minimaxi.com/v1/t2a_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const json = await resp.json();
    const hex = json.data?.audio?.replace(/\s/g, '');
    if (!hex) throw new Error('无音频数据');

    const byteArray = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) byteArray[i / 2] = parseInt(hex.substr(i, 2), 16);
    const blob = new Blob([byteArray], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.addEventListener('loadedmetadata', () => {
      // 更新内存缓存和消息对象的时长（用于展示）
      _voiceAudioCache[msg.id] = {
        audioUrl: url,
        audioDuration: audio.duration
      };
      msg.voiceDuration = audio.duration;         // 持久化时长（用于界面显示）
      throttledSaveData();                        // 保存时长到 IndexedDB
      // 更新 UI 上的时长显示
      const durEl = document.querySelector(`[data-msg-id="${msg.id}"] .voice-duration`);
      if (durEl) durEl.textContent = Math.ceil(audio.duration) + '"';
    });

    audio.play().catch(e => showNotification('播放失败', 'error'));

    // 注意：msg.voiceUrl 不再保存，因为 blob URL 跨会话无效。
    // 即使之前有冗余保存，这里也不赋值，让它保持为 null。
    // 这样刷新后 voiceUrl 永远是 null，触发重新生成。
    throttledSaveData();        // 保存（主要是保存 voiceDuration）

  } catch (error) {
    console.error(error);
    showNotification('语音生成失败：' + error.message, 'error');
  } finally {
    voiceGenerating = false;
  }
}

        function renderMessages(preserveScroll = false) {
            const container = DOMElements.chatContainer;
            const totalMessages = messages.length;

            const startIndex = Math.max(0, totalMessages - displayedMessageCount);
            const msgsToRender = messages.slice(startIndex);

            DOMElements.emptyState.style.display = totalMessages === 0 ? 'flex': 'none';

            const oldScrollHeight = container.scrollHeight;
            
            const prevRenderedCount = container._lastRenderedCount || 0;
            const newMessageCount = msgsToRender.length - prevRenderedCount;
            
            container.innerHTML = '';
            container._lastRenderedCount = msgsToRender.length;

            const fragment = new DocumentFragment();
            const spacer = document.createElement('div');
            spacer.style.flex = '1';
            fragment.appendChild(spacer);
            let currentDate = '';
            let lastSender = null;

            msgsToRender.forEach((msg, index) => {
                const messageDate = new Date(msg.timestamp).toDateString();
                if (messageDate !== currentDate) {
                    currentDate = messageDate;
                    const dateDivider = document.createElement('div');
                    dateDivider.className = 'date-divider';
                    const today = new Date().toDateString();
                    const yesterday = new Date(Date.now() - 86400000).toDateString();
                    const displayDate = (messageDate === today) ? '今天': (messageDate === yesterday) ? '昨天': new Date(msg.timestamp).toLocaleDateString('zh-CN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });
                    dateDivider.innerHTML = `<span>${displayDate}</span>`;
                    fragment.appendChild(dateDivider);
                    lastSender = null; 
                }

                if (msg.type === 'system') {
                    const systemMsgDiv = document.createElement('div');
                    systemMsgDiv.className = 'system-message';
                    systemMsgDiv.innerHTML = msg.text;
                    fragment.appendChild(systemMsgDiv);
                    lastSender = 'system';
                    return;
                }

                if (msg.recalled) {
                    const recalled = document.createElement('div');
                    recalled.className = 'system-message recalled-message';
                    recalled.textContent = `${msg.sender === 'user' ? '你' : (settings.partnerName || '梦角')}撤回了一条消息`;
                    fragment.appendChild(recalled);
                    lastSender = 'system';
                    return;
                }

                if (msg.type === 'redpacket' && window.EnhancementUI) {
                    fragment.appendChild(window.EnhancementUI.renderRedpacket(msg));
                    lastSender = msg.sender;
                    return;
                }

                if (msg.type === 'cinema-invite' && window.EnhancementUI) {
                    fragment.appendChild(window.EnhancementUI.renderCinemaInvite(msg));
                    lastSender = msg.sender;
                    return;
                }

                if (msg.type === 'question-batch' && window.EnhancementUI) {
                    fragment.appendChild(window.EnhancementUI.renderQuestionnaire(msg));
                    lastSender = msg.sender;
                    return;
                }

                if (msg.type === 'cooking-card' && window.CookingFeature) {
                    fragment.appendChild(window.CookingFeature.renderMessage(msg));
                    lastSender = msg.sender;
                    return;
                }

                if (msg.type === 'call-event') {
                    const callEvDiv = document.createElement('div');
                    callEvDiv.className = 'call-event-message';
                    callEvDiv.dataset.id = msg.id;
                    const icon = msg.callIcon || 'fa-video';
                    const isEnded = icon === 'fa-video';
                    const isRejected = icon === 'fa-phone-slash';
                    const colorClass = isRejected ? 'call-event-pill--rejected' : 'call-event-pill--ended';
                    const detail = msg.callDetail ? `<span class="call-event-detail">${msg.callDetail}</span>` : '';
                    callEvDiv.innerHTML = `<div class="call-event-pill ${colorClass}"><i class="fas ${icon} call-event-icon"></i><span class="call-event-label">${msg.text.replace(/ · .*/, '')}</span>${detail}<button class="call-event-delete" title="删除" onclick="(function(btn){const id=btn.closest('[data-id]').dataset.id;const idx=messages.findIndex(m=>String(m.id)===String(id));if(idx>-1){messages.splice(idx,1);renderMessages();throttledSaveData();}})(this)"><i class="fas fa-times"></i></button></div>`;
                    fragment.appendChild(callEvDiv);
                    lastSender = 'system';
                    return;

                }
                if (msg.type === 'companion-invite') {
                    const inviteWrap = document.createElement('div');
                    inviteWrap.className = `companion-message-wrap ${msg.sender === 'user' ? 'sent' : 'received'}`;
                    inviteWrap.dataset.id = msg.id;

                    const card = document.createElement('button');
                    card.className = `companion-chat-card ${msg.companionStatus || 'pending'}`;
                    card.type = 'button';

                    const head = document.createElement('div');
                    head.className = 'companion-chat-card-head';
                    const kicker = document.createElement('span');
                    kicker.className = 'companion-chat-card-kicker';
                    kicker.textContent = 'STAY BESIDE ME';
                    const title = document.createElement('strong');
                    title.textContent = '陪伴邀约';
                    const detail = document.createElement('span');
                    detail.className = 'companion-chat-card-detail';
                    detail.textContent = `${msg.companionStateName || '陪伴'} · ${msg.companionDurationLabel || ''}`;
                    const seal = document.createElement('span');
                    seal.className = 'companion-chat-card-seal';
                    seal.textContent = '邀';
                    head.append(kicker, title, detail, seal);

                    const foot = document.createElement('div');
                    foot.className = 'companion-chat-card-foot';
                    const ownState = document.createElement('span');
                    ownState.textContent = msg.sender === 'user'
                        ? `我的状态 · ${msg.companionStateName || ''}`
                        : `${settings.partnerName || '梦角'}的状态 · ${msg.companionStateName || ''}`;
                    const status = document.createElement('b');
                    const labels = {
                        pending: msg.sender === 'user' ? '等待回应' : '点击查看',
                        accepted: '已接受',
                        rejected: '未接受',
                        expired: '已结束'
                    };
                    status.textContent = labels[msg.companionStatus || 'pending'] || '查看邀约';
                    foot.append(ownState, status);
                    card.append(head, foot);
                    card.addEventListener('click', () => {
                        if (window.companionFeature && typeof window.companionFeature.handleInviteCard === 'function') {
                            window.companionFeature.handleInviteCard(msg.id);
                        }
                    });
                    inviteWrap.appendChild(card);
                    fragment.appendChild(inviteWrap);
                    lastSender = 'companion-invite';
                    return;
                }
// ========== 礼物消息（卡片形式，无气泡）==========
if (msg.type === 'gift') {
    const giftWrapper = document.createElement('div');
    giftWrapper.className = 'gift-message-wrapper';
    giftWrapper.setAttribute('data-gift-id', msg.id);
    
    const giftCard = document.createElement('div');
    giftCard.className = 'gift-card' + (msg.opened ? ' opened' : '');
    giftCard.setAttribute('data-id', msg.id);
    giftCard.setAttribute('data-opened', msg.opened);
    
    // 点击打开礼物
    giftCard.addEventListener('click', (function(id) {
        return function() { handleGiftCardClick(id); };
    })(msg.id));
    
    // 礼物图标
    const iconDiv = document.createElement('div');
    iconDiv.className = 'gift-icon';
    const icon = document.createElement('i');
    icon.className = msg.opened ? 'fas fa-box-open' : 'fas fa-gift';
    iconDiv.appendChild(icon);
    
    // 礼物文字
    const label = document.createElement('span');
    label.className = 'gift-label';
    label.textContent = ' 一份神秘礼物 ';
    
    giftCard.appendChild(iconDiv);
    giftCard.appendChild(label);
    giftWrapper.appendChild(giftCard);
    fragment.appendChild(giftWrapper);
    
    // 更新 lastSender（避免影响后续消息的头像显示逻辑）
    lastSender = 'gift';
    return; // 跳过后续普通消息的处理
}
                let showTimestamp = true;
                if (settings.timeFormat === 'off') {
                    showTimestamp = false;
                } else if (index < msgsToRender.length - 1) {
                    const nextMsg = msgsToRender[index + 1];
                    const currentTs = new Date(msg.timestamp).getTime();
                    const nextTs = new Date(nextMsg.timestamp).getTime();
                    
                    if (nextMsg.sender === msg.sender && 
                        nextMsg.type !== 'system' && 
                        (nextTs - currentTs < 60000)) {
                        showTimestamp = false;
                    }
                }

                let isLastInSenderGroup = true;
                if (index < msgsToRender.length - 1) {
                    const nextMsg = msgsToRender[index + 1];
                    const currentTs = new Date(msg.timestamp).getTime();
                    const nextTs = new Date(nextMsg.timestamp).getTime();
                    if (nextMsg.sender === msg.sender &&
                        nextMsg.type !== 'system' &&
                        (nextTs - currentTs < 60000)) {
                        isLastInSenderGroup = false;
                    }
                }

                const wrapper = document.createElement('div');
                wrapper.className = `message-wrapper ${msg.sender === 'user' ? 'sent': 'received'}`;
                wrapper.dataset.id = msg.id;
                wrapper.dataset.msgId = msg.id;
                if (index < msgsToRender.length - Math.max(newMessageCount, 0)) {
                    wrapper.style.animation = 'none';
                    wrapper.style.opacity = '1';
                }
                
                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'message-avatar';
                if (settings.inChatAvatarPosition === 'custom' && settings.inChatAvatarCustomOffset !== undefined) {
                    avatarDiv.style.marginTop = settings.inChatAvatarCustomOffset + 'px';
                }

                const groupMember = (msg.sender !== 'user' && typeof getGroupMemberForMessage === 'function') ? getGroupMemberForMessage(msg.id) : null;

                if (settings.inChatAvatarEnabled) {
                    const isSameSenderGroup = groupMember && lastSender === 'group_' + (groupMember ? groupMember.name : '');
                    const isSameSenderNormal = !groupMember && msg.sender === lastSender;
                    const shouldHide = !settings.alwaysShowAvatar && (isSameSenderGroup || isSameSenderNormal);
                    if (shouldHide) {
                        avatarDiv.classList.add('hidden');
                    } else if (groupMember) {
                        const groupAvatarShape = settings.partnerAvatarShape || 'circle';
                        ['circle','square','pentagon','heart'].forEach(s => avatarDiv.classList.remove('shape-' + s));
                        if (groupAvatarShape !== 'none') avatarDiv.classList.add('shape-' + groupAvatarShape);
                        if (groupMember.avatar) {
                            avatarDiv.innerHTML = `<img src="${groupMember.avatar}" style="width:100%;height:100%;object-fit:cover;">`;
                        } else {
                            const initials = (groupMember.name || '?').charAt(0).toUpperCase();
                            avatarDiv.innerHTML = `<div style="width:100%;height:100%;background:var(--accent-color);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;">${initials}</div>`;
                        }
                    } else {
                        const isUser = msg.sender === 'user';
                        const avatarElement = isUser ? DOMElements.me.avatar : DOMElements.partner.avatar;
                        const frameSettings = isUser ? settings.myAvatarFrame : settings.partnerAvatarFrame;
                        const avatarShape = isUser ? (settings.myAvatarShape || 'circle') : (settings.partnerAvatarShape || 'circle');
                        avatarDiv.innerHTML = avatarElement.innerHTML;
                        applyAvatarFrame(avatarDiv, frameSettings);
                        ['circle','square','pentagon','heart'].forEach(s => avatarDiv.classList.remove('shape-' + s));
                        if (avatarShape !== 'none') avatarDiv.classList.add('shape-' + avatarShape);
                    }
                } else {
                    avatarDiv.style.display = 'none';
                }
                wrapper.appendChild(avatarDiv);
                
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'message-content-wrapper';

                if (groupMember && groupChatSettings.showName) {
                    const nameLabel = document.createElement('div');
                    nameLabel.className = 'group-sender-name';
                    nameLabel.textContent = groupMember.name;
                    const isSameSenderGroupForName = lastSender === 'group_' + groupMember.name;
                    if (!isSameSenderGroupForName) contentWrapper.appendChild(nameLabel);
                } else if (!groupMember && msg.sender !== 'user' && msg.sender !== null &&
                           (settings.showPartnerNameInChat || showPartnerNameInChat)) {
                    const isSameSenderForName = lastSender === msg.sender;
                    if (!isSameSenderForName) {
                        const nameLabel = document.createElement('div');
                        nameLabel.className = 'group-sender-name';
                        nameLabel.textContent = settings.partnerName || msg.sender || '对方';
                        contentWrapper.appendChild(nameLabel);
                    }
                }
                
                // ─── 替换消息渲染部分（从 isImageOnly 定义开始）───

const isImageOnly = !msg.text && !!msg.image;
const isXhsCard = msg.xhsCard === true;
const isVoice = msg.type === 'voice';          // ← 新增判断

let messageHTML = '';
if (msg.replyTo) {
    const repliedText = msg.replyTo.text || (msg.replyTo.image ? '🖼 图片' : '[消息]');
    const repliedSender = msg.replyTo.sender === 'user' ? (settings.myName || '我') : (settings.partnerName || '对方');
    messageHTML += `<div class="reply-indicator" data-reply-id="${msg.replyTo.id || ''}" style="cursor:pointer;" onclick="scrollToQuotedMessage(this)"><span class="reply-indicator-sender">${repliedSender}</span><span class="reply-indicator-text">${repliedText}</span></div>`;
}

// 【核心】语音气泡内容
if (isVoice) {
    const duration = msg.voiceDuration > 0 ? Math.ceil(msg.voiceDuration) + '"' : "''";
    messageHTML += `
        <div class="voice-bubble-inner" style="display:flex; align-items:center; cursor:pointer;">
            <span class="voice-icon voice-wave-icon" style="display:flex; align-items:flex-end; gap:2px; height:20px; margin-right:8px;">
    <span class="wave-bar" style="display:inline-block; width:3px; height:40%; background:currentColor; border-radius:2px; animation: wave-anim 0.8s infinite ease-in-out alternate; animation-delay: 0s;"></span>
    <span class="wave-bar" style="display:inline-block; width:3px; height:65%; background:currentColor; border-radius:2px; animation: wave-anim 0.8s infinite ease-in-out alternate; animation-delay: 0.15s;"></span>
    <span class="wave-bar" style="display:inline-block; width:3px; height:100%; background:currentColor; border-radius:2px; animation: wave-anim 0.8s infinite ease-in-out alternate; animation-delay: 0.3s;"></span>
    <span class="wave-bar" style="display:inline-block; width:3px; height:65%; background:currentColor; border-radius:2px; animation: wave-anim 0.8s infinite ease-in-out alternate; animation-delay: 0.45s;"></span>
</span>
            <span class="voice-duration" style="font-family: monospace; font-size:13px;">${duration}</span>
        </div>
        <div class="voice-text" style="margin-top:4px; font-size:12px; color:var(--text-secondary); opacity:0.8; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${escapeHtml(msg.text || '')}
        </div>
    `;
} else {
    // 非语音消息的原有逻辑
    let content = '';
if (!isXhsCard) {
    content = msg.text ? `<div>${msg.text.replace(/\n/g, '<br>')}</div>` : '';
    if (msg.image) {
        content += `<img src="${msg.image}" class="message-image${isImageOnly ? ' message-image-only' : ''}" alt="图片" style="max-width:${isImageOnly ? '100px' : '100px'}; border-radius: 12px;${!isImageOnly ? ' margin-top: 6px;' : ''} cursor: pointer;" onclick="viewImage('${msg.image}')">`;
    }
}
messageHTML += content;
}
// ───────────────────────────────────────────

const messageDiv = document.createElement('div');

// 网页嵌入卡片特殊处理 - 不包裹气泡
const isWebEmbed = msg.webEmbed === true;
const isInvitationCard = msg.isInvitationCard === true;

if (isXhsCard) {
    messageDiv.className = 'xhs-message-wrapper';
    messageDiv.innerHTML = msg.text;
} else if (isWebEmbed || isInvitationCard) {
    messageDiv.className = 'web-embed-message-wrapper';
    messageDiv.innerHTML = msg.text;
} else if (isImageOnly && !isVoice) {
    messageDiv.className = `message message-${msg.sender === 'user' ? 'sent': 'received'} message-image-bubble-none`;
    messageDiv.innerHTML = messageHTML;
} else {
    // 语音消息也走这里，使用与普通文本消息完全相同的气泡 class
    messageDiv.className = `message message-${msg.sender === 'user' ? 'sent': 'received'} ${settings.bubbleStyle}`;
    // 为语音消息添加额外标记，方便事件委托
    if (isVoice) {
        messageDiv.classList.add('voice-message');
    }
    messageDiv.innerHTML = messageHTML;
}
// ─── 后面继续原有的 actionsHTML、metaHTML、wrapper 组装 ───

let actionsHTML = '';
                
                if (settings.replyEnabled) actionsHTML += `<button class="meta-action-btn reply-btn" title="回复"><i class="fas fa-reply"></i></button>`;
                
                const starIcon = msg.favorited ? 'fas fa-star' : 'far fa-star'; 
                actionsHTML += `<button class="meta-action-btn favorite-action-btn ${msg.favorited ? 'favorited' : ''}" title="${msg.favorited ? '取消收藏' : '收藏'}"><i class="${starIcon}"></i></button>`;
                

actionsHTML += `<button class="meta-action-btn delete-btn" title="删除"><i class="fas fa-trash-alt"></i></button>`;
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-meta-actions';
                actionsDiv.innerHTML = actionsHTML;
let metaHTML = '';
                
                if (showTimestamp) {
                    const ts = new Date(msg.timestamp);
                    let timeStr;
                    const fmt = settings.timeFormat || 'HH:mm';
                    if (fmt === 'HH:mm:ss') {
                        timeStr = ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                    } else if (fmt === 'h:mm AM/PM') {
                        timeStr = ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    } else if (fmt === 'h:mm:ss AM/PM') {
                        timeStr = ts.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
                    } else {
                        timeStr = ts.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
                    }
                    metaHTML += `<div class="timestamp">${timeStr}</div>`;
                }

                if (msg.sender === 'user' && settings.readReceiptsEnabled && isLastInSenderGroup) {
                    const rrStyle = settings.readReceiptStyle || 'icon';
                    if (rrStyle === 'text') {
                        if (msg.status === 'read') {
                            metaHTML += `<div class="read-receipt read" style="font-size:9px;letter-spacing:0.3px;font-weight:500;">已读</div>`;
                        } else {
                            metaHTML += `<div class="read-receipt" style="font-size:9px;letter-spacing:0.3px;opacity:0.5;">未读</div>`;
                        }
                    } else {
                        const statusIcon = msg.status === 'read' ? 'fa-check-double': 'fa-check';
                        metaHTML += `<div class="read-receipt ${msg.status === 'read' ? 'read': ''}"><i class="fas ${statusIcon}"></i></div>`;
                    }
                }
                




                if (metaHTML !== '') {
                    const metaDiv = document.createElement('div');
                    metaDiv.className = 'message-meta';
                    if (!showTimestamp && !metaHTML.includes('timestamp')) {
                         metaDiv.style.height = 'auto'; 
                         metaDiv.style.marginTop = '2px';
                         if (settings.inChatAvatarPosition !== 'top') {
                             avatarDiv.style.marginBottom = '18px';
                         }
                    } else {
                         
                         if (settings.inChatAvatarPosition !== 'top') {
                             avatarDiv.style.marginBottom = '26px';
                         }
                    }
                    metaDiv.innerHTML = metaHTML;
                    contentWrapper.append(actionsDiv, messageDiv, metaDiv);
                } else {
                    contentWrapper.append(actionsDiv, messageDiv);
                }
                wrapper.appendChild(contentWrapper);
                fragment.appendChild(wrapper);
                
                lastSender = groupMember ? ('group_' + groupMember.name) : msg.sender;
            });

            container.appendChild(fragment);

            if (preserveScroll) {
                const newScrollHeight = container.scrollHeight;
                const delta = newScrollHeight - oldScrollHeight;
                container.scrollTop = Math.max(0, container.scrollTop + delta);
            } else {
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });

    setTimeout(() => {
        initXhsCardSliders();
    }, 50);

            }
        }        

        const addMessage = (message) => {
            if (!(message.timestamp instanceof Date)) message.timestamp = new Date(message.timestamp);
            messages.push(message);
            displayedMessageCount++;
            const container = DOMElements.chatContainer;
            container.style.opacity = '1';
            renderMessages(false);
            throttledSaveData();
            return message;
        };
        window.addMessage = addMessage;

        // 陪伴功能只通过这层桥梁复用主站已有的聊天数据、头像、字卡和回复频率。
        window.CompanionBridge = {
            addMainMessage(message) {
                addMessage(Object.assign({
                    id: Date.now() + Math.random(),
                    timestamp: new Date(),
                    status: 'received',
                    favorited: false,
                    note: null
                }, message));
            },
            updateMainMessage(id, patch) {
                const target = messages.find(item => String(item.id) === String(id));
                if (!target) return false;
                Object.assign(target, patch || {});
                renderMessages(false);
                throttledSaveData();
                return true;
            },
            getMessage(id) {
                return messages.find(item => String(item.id) === String(id)) || null;
            },
            getSettings() {
                return settings || {};
            },
            getNames() {
                return { me: settings.myName || '我', partner: settings.partnerName || '梦角' };
            },
            getAvatar(person) {
                const holder = person === 'me' ? DOMElements.me.avatar : DOMElements.partner.avatar;
                const image = holder && holder.querySelector('img');
                return image ? image.src : '';
            },
            getReplyDelay() {
                return {
                    min: Number(settings.replyDelayMin) || 3000,
                    max: Number(settings.replyDelayMax) || 7000
                };
            },
            getRandomReply() {
                let disabledItems = new Set();
                try {
                    const raw = localStorage.getItem('disabledReplyItems');
                    if (raw) disabledItems = new Set(JSON.parse(raw));
                } catch (error) {}
                const disabledGroupItems = new Set();
                (window.customReplyGroups || []).forEach(group => {
                    if (group.disabled && Array.isArray(group.items)) {
                        group.items.forEach(item => disabledGroupItems.add(item));
                    }
                });
                const pool = (customReplies || []).filter(item => !disabledItems.has(item) && !disabledGroupItems.has(item));
                return pool.length ? pool[Math.floor(Math.random() * pool.length)] : '';
            },
            storageKey(name) {
                return getStorageKey(name);
            },
            notify(text, type, duration) {
                showNotification(text, type || 'info', duration || 2400);
            },
            playMessageSound() {
                playSound('message');
            }
        };

        window._addCallEvent = (icon, label, detail) => {
            addMessage({
                id: Date.now() + Math.random(),
                sender: 'system',
                text: label + (detail ? ' · ' + detail : ''),
                timestamp: new Date(),
                status: 'received',
                type: 'call-event',
                callIcon: icon || 'fa-video',
                callDetail: detail || null,
                favorited: false,
                note: null,
            });
        };

        function optimizeImage(file, maxWidth = 800, quality = 0.7) {
            return new Promise((resolve, reject) => {
                if (file.size < 300 * 1024) {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                    return;
                }
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let {
                        width,
                        height
                    } = img;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                    URL.revokeObjectURL(img.src);
                };
                img.onerror = () => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                    URL.revokeObjectURL(img.src);
                };
                img.src = URL.createObjectURL(file);
            });
        }

        window.updateReplyPreview = function() {
            const container = DOMElements.replyPreviewContainer;
            if (!container) return;
            if (!currentReplyTo) {
                container.innerHTML = '';
                container.style.display = 'none';
                return;
            }
            const senderName = currentReplyTo.sender === 'user' ? (settings.myName || '我') : (settings.partnerName || '对方');
            const previewText = currentReplyTo.text ? currentReplyTo.text.slice(0, 40) : '🖼 图片';
            container.style.display = 'flex';
            container.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(var(--accent-color-rgb),0.07);border-left:3px solid var(--accent-color);border-radius:0 8px 8px 0;width:100%;">
                    <div style="flex:1;min-width:0;">
                        <span style="font-size:11px;color:var(--accent-color);font-weight:600;">回复 ${senderName}</span>
                        <div style="font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${previewText}</div>
                    </div>
                    <button onclick="currentReplyTo=null;window.updateReplyPreview();" style="background:none;border:none;cursor:pointer;color:var(--text-secondary);padding:2px 4px;font-size:14px;">✕</button>
                </div>`;
        };
        function updateReplyPreview() { window.updateReplyPreview(); }

        function sendMessage(textOverride = null, type = 'normal') {
            const text = textOverride || DOMElements.messageInput.value.trim();
            const imageFile = DOMElements.imageInput.files[0];
            if (!text && !imageFile && type === 'normal') return;

            DOMElements.messageInput.value = '';
            DOMElements.messageInput.style.height = '46px';
            if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
                showNotification('图片大小不能超过5MB', 'error'); DOMElements.imageInput.value = ''; return;
            }

            const createMessage = (imgSrc = null) => {
                const messageData = {
                    id: Date.now(),
                    sender: 'user',
                    text: text || '',
                    timestamp: new Date(),
                    image: imgSrc,
                    status: 'sent',
                    favorited: false,
                    note: null,
                    replyTo: currentReplyTo,
                    type: type
                };
                if (type === 'system') messageData.sender = null;

                addMessage(messageData);
                if (type !== 'system') playSound('send');
                currentReplyTo = null;
                updateReplyPreview();

if (!isBatchMode && type === 'normal') {
    const delayRange = settings.replyDelayMax - settings.replyDelayMin;
    const randomDelay = settings.replyDelayMin + Math.random() * delayRange;

    const shouldIgnore = settings.allowReadNoReply && (Math.random() < 0.5);

    const readDelay = 1500 + Math.random() * 2500;
    setTimeout(() => {
        let changed = false;
        messages.forEach(msg => {
            if (msg.sender === 'user' && msg.status !== 'read') {
                msg.status = 'read';
                changed = true;
            }
        });
        if (changed) { renderMessages(false); throttledSaveData(); }
    }, readDelay);

    if (window._pendingReplyTimer) clearTimeout(window._pendingReplyTimer);
    window._pendingReplyTimer = null;

    if (!shouldIgnore) {
        if (settings.typingIndicatorEnabled) {
            const tiWrapper = document.getElementById('typing-indicator-wrapper');
            const tiLabel = document.getElementById('typing-indicator-label');
            const tiAvatar = document.getElementById('typing-indicator-avatar');
            if (tiLabel) tiLabel.textContent = (settings.partnerName || '对方') + ' 正在输入';
            if (tiWrapper) { positionTypingIndicator(); tiWrapper.style.display = 'block'; }
            if (tiAvatar) {
                const partnerImg = DOMElements.partner.avatar.querySelector('img');
                tiAvatar.innerHTML = partnerImg ? `<img src="${partnerImg.src}">` : '<i class="fas fa-user"></i>';
            }
            if (DOMElements.chatContainer) DOMElements.chatContainer.scrollTop = DOMElements.chatContainer.scrollHeight;
        }
        window._pendingReplyTimer = setTimeout(() => {
            window._pendingReplyTimer = null;
            simulateReply();
        }, randomDelay);
    }
}
};

            if (imageFile) {
                showNotification('正在优化图片...', 'info', 1500);
                optimizeImage(imageFile).then(createMessage).catch(() => showNotification('图片处理失败', 'error'));
            } else {
                createMessage();
            }
            DOMElements.imageInput.value = '';
        }

        function toggleBatchMode() {
            isBatchMode = !isBatchMode;
            DOMElements.batchBtn.classList.toggle('active', isBatchMode);
            DOMElements.batchBtn.title = isBatchMode ? "退出批量模式": "批量发送模式";
            DOMElements.batchPreview.style.display = isBatchMode ? 'flex': 'none';
            const placeholder = "";
            DOMElements.messageInput.placeholder = isBatchMode ? "此刻，想说的有很多很多...": (placeholder.length > 20 ? placeholder.substring(0, 20) + "...": placeholder);
            if (isBatchMode) {
                batchMessages = []; updateBatchPreview();
            }
        }

        function addToBatch(imageOverride = null) {
            const text = DOMElements.messageInput.value.trim();
            if (!text && !imageOverride) return;
            batchMessages.push({
                id: Date.now() + batchMessages.length, text: text || '', image: imageOverride || null
            });
            DOMElements.messageInput.value = ''; DOMElements.messageInput.style.height = '46px';
            updateBatchPreview();
        }

        function updateBatchPreview() {
            const previewContainer = DOMElements.batchPreview;
            let listHTML = '';
            if (batchMessages.length > 0) {
                listHTML = batchMessages.map((msg, index) => {
                    const preview = msg.image
                        ? `<img src="${msg.image}" style="height:36px;width:36px;object-fit:cover;border-radius:6px;vertical-align:middle;margin-right:6px;">`
                        : '';
                    const label = msg.text
                        ? `<span class="batch-preview-text">${msg.text}</span>`
                        : `<span class="batch-preview-text" style="color:var(--text-secondary);font-style:italic;">图片</span>`;
                    return `<div class="batch-preview-item" data-index="${index}">${preview}${label}<button class="batch-preview-edit" title="编辑"><i class="fas fa-pencil-alt"></i></button><button class="batch-preview-remove"><i class="fas fa-times"></i></button></div>`;
                }).join('');
            } else {
                listHTML = '<div style="text-align: center; color: var(--text-secondary); font-size: 14px; padding: 10px;">つ♡⊂</div>';
            }

            previewContainer.innerHTML = `
        <div class="batch-preview-title">我有很多的话想说…！</div>
        <div class="batch-actions-top" style="display:flex;gap:6px;padding:4px 10px 0;"><label style="flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:5px 8px;background:var(--secondary-bg);border:1px solid var(--border-color);border-radius:8px;cursor:pointer;font-size:12px;color:var(--text-secondary);"><i class="fas fa-image"></i>添加图片<input type="file" accept="image/*" style="display:none;" id="batch-image-input"></label></div>
        <div class="batch-preview-list">${listHTML}</div>
        <div class="batch-actions">
        <button class="batch-action-btn batch-cancel-btn">取消</button>
        <button class="batch-action-btn batch-send-btn" ${batchMessages.length === 0 ? 'disabled': ''}>发送全部 (${batchMessages.length})</button>
        </div>`;

            const batchImgInput = document.getElementById('batch-image-input');
            if (batchImgInput) {
                batchImgInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > MAX_IMAGE_SIZE) { showNotification('图片超过5MB限制', 'warning'); return; }
                    try {
                        const base64 = await optimizeImage(file, 600, 0.8);
                        addToBatch(base64);
                    } catch(err) { showNotification('图片处理失败', 'error'); }
                    e.target.value = '';
                });
            }
        }

        function sendBatchMessages() {
            if (batchMessages.length === 0) return;
            showNotification(`正在发送 ${batchMessages.length} 条消息...`, 'info', 2000);
            batchMessages.forEach((msg, index) => {
                setTimeout(() => {
                    addMessage({
                        id: Date.now() + index, sender: 'user', text: msg.text || '', image: msg.image || null, timestamp: new Date(), status: 'sent', favorited: false, type: 'normal'
                    });
                    playSound('send');
                }, index * 300);
            });
            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
            setTimeout(simulateReply, batchMessages.length * 300 + randomDelay);
            isBatchMode = false; batchMessages = [];
            DOMElements.batchBtn.classList.remove('active'); DOMElements.batchPreview.style.display = 'none';
            const placeholder = "";
            DOMElements.messageInput.placeholder = placeholder.length > 20 ? placeholder.substring(0, 20) + "...": placeholder;
        }

        function positionTypingIndicator() {
            var tiW = document.getElementById('typing-indicator-wrapper');
            var inputArea = document.querySelector('.input-area-wrapper');
            if (!tiW || !inputArea) return;
            var h = inputArea.offsetHeight;
            tiW.style.bottom = h + 'px';
        }
        (function() {
            var inputArea = document.querySelector('.input-area-wrapper');
            if (!inputArea) return;
            var ro = new ResizeObserver(function() {
                var tiW = document.getElementById('typing-indicator-wrapper');
                if (tiW && tiW.style.display !== 'none') positionTypingIndicator();
            });
            ro.observe(inputArea);
        })();

       function simulateReply() {
    function showTypingIndicator() {
        if (!settings.typingIndicatorEnabled) return;
        const tiWrapper = document.getElementById('typing-indicator-wrapper');
        const tiLabel = document.getElementById('typing-indicator-label');
        const tiAvatar = document.getElementById('typing-indicator-avatar');
        if (tiLabel) tiLabel.textContent = (settings.partnerName || '对方') + ' 正在输入';
        if (tiWrapper) { positionTypingIndicator(); tiWrapper.style.display = 'block'; }
        if (tiAvatar) {
            const partnerImg = DOMElements.partner.avatar.querySelector('img');
            tiAvatar.innerHTML = partnerImg ? `<img src="${partnerImg.src}">` : '<i class="fas fa-user"></i>';
        }
        DOMElements.chatContainer.scrollTop = DOMElements.chatContainer.scrollHeight;
    }

    showTypingIndicator();

    let changed = false;
    messages.forEach(msg => {
        if (msg.sender === 'user' && msg.status !== 'read') {
            msg.status = 'read'; changed = true;
        }
    });
    if (changed) {
        renderMessages(false); throttledSaveData();
    }

    if (partnerPersonas && partnerPersonas.length > 0 && Math.random() < 0.3) {
        const currentPool = [...partnerPersonas];
        if(currentPool.length > 0) {
            const nextPersona = currentPool[Math.floor(Math.random() * currentPool.length)];
            settings.partnerName = nextPersona.name;
            DOMElements.partner.name.textContent = nextPersona.name;
            if (nextPersona.avatar) {
                updateAvatar(DOMElements.partner.avatar, nextPersona.avatar);
                localforage.setItem(getStorageKey('partnerAvatar'), nextPersona.avatar);
            }
            throttledSaveData();
        }
    }
    if (Math.random() < 0.03) {
        if (customPokes && customPokes.length > 0) {
            const randomAction = getRandomItem(customPokes);
            const pokeTypes = [{
                prefix: "💫",
                text: `${settings.partnerName} ${randomAction}`
            }, {
                prefix: "✨",
                text: `${settings.partnerName} ${randomAction}`
            }, {
                prefix: "🌟",
                text: `${settings.partnerName} ${randomAction}`
            }, {
                prefix: "🥰",
                text: `${settings.partnerName} ${randomAction}`
            }, {
                prefix: "💖",
                text: `${settings.partnerName} ${randomAction}`
            }];
            const selectedPoke = getRandomItem(pokeTypes);
            addMessage({
                id: Date.now(),
                text: `${selectedPoke.prefix} ${settings.partnerName} ${randomAction} ${selectedPoke.prefix}`,
                timestamp: new Date(),
                type: 'system'
            });
            (function(){var _tiW=document.getElementById('typing-indicator-wrapper');if(_tiW){var _tiInner=_tiW.querySelector('.typing-indicator');if(_tiInner){_tiInner.classList.add('hiding');setTimeout(function(){_tiW.style.display='none';if(_tiInner)_tiInner.classList.remove('hiding');},240);}else{_tiW.style.display='none';}}})();
            return;
        }
    }

    if (settings.partnerRecallEnabled !== false && Math.random() < 0.025 && window.EnhancementUI) {
        if (window.EnhancementUI.triggerPartnerRecall()) {
            (function(){var el=document.getElementById('typing-indicator-wrapper');if(el)el.style.display='none';})();
            return;
        }
    }

    // ──────────── 🔊 语音消息配置 ────────────
    // 这些常量需要和全局的 isTtsReady() 配合
    const VOICE_PREFIXES = [
        '(laughs)', '(chuckle)', '(coughs)', '(clear-throat)',
        '(groans)', '(breath)', '(pant)', '(inhale)',
        '(exhale)', '(gasps)', '(sniffs)', '(sighs)',
        '(snorts)', '(burps)', '(lip-smacking)',
        '(humming)', '(hissing)', '(emm)', '(sneezes)'
    ];
    // 注：isTtsReady() 和 getTogetherTtsConfig() 已在全局定义
    // ─────────────────────────────────────────

    const replyCount = Math.random() < 0.75 ? 1: (Math.random() < 0.95 ? 2: 3);
    if (!customReplies || customReplies.length === 0) {
        (function(){var _tiW=document.getElementById('typing-indicator-wrapper');if(_tiW){var _tiInner=_tiW.querySelector('.typing-indicator');if(_tiInner){_tiInner.classList.add('hiding');setTimeout(function(){_tiW.style.display='none';if(_tiInner)_tiInner.classList.remove('hiding');},240);}else{_tiW.style.display='none';}}})();
        showNotification('还没有添加字卡，请先到"自定义回复"中添加字卡', 'info', 4000);
        return;
    }
    let delay = 0;
    const recentUserMsgs = settings.replyEnabled
        ? messages.filter(m => m.sender === 'user' && m.text).slice(-10)
        : [];

    for (let i = 0; i < replyCount; i++) {
        const delayRange = settings.replyDelayMax - settings.replyDelayMin;
        delay += settings.replyDelayMin + Math.random() * delayRange;
        setTimeout(() => {
            let disabledItems = new Set();
            try {
                const raw = localStorage.getItem('disabledReplyItems');
                if (raw) disabledItems = new Set(JSON.parse(raw));
            } catch(e) {}

            const disabledGroupItems = new Set();
            const _groups = window.customReplyGroups || [];
            _groups.forEach(g => {
                if (g.disabled && Array.isArray(g.items)) {
                    g.items.forEach(item => disabledGroupItems.add(item));
                }
            });

            const replyPool = customReplies.filter(r => !disabledItems.has(r) && !disabledGroupItems.has(r));
            let replyText = replyPool[Math.floor(Math.random() * replyPool.length)];
            // 参考版概率下调：开启后仅约 18% 的回复会拼接 2～3 张字卡。
            if (settings.combineReplyCards && replyPool.length > 1 && Math.random() < 0.18) {
                const parts = [replyText];
                const count = Math.min(replyPool.length, Math.random() < 0.78 ? 2 : 3);
                while (parts.length < count) {
                    const next = replyPool[Math.floor(Math.random() * replyPool.length)];
                    if (!parts.includes(next)) parts.push(next);
                }
                replyText = parts.join(Math.random() < 0.5 ? '，' : '……');
            }

            const shouldSendSticker = stickerLibrary && stickerLibrary.length > 0 && Math.random() < 0.2;

            let finalText = replyText;
            let separateEmoji = null;
            if (customEmojis && customEmojis.length > 0 && Math.random() < 0.2) {
                const emoji = customEmojis[Math.floor(Math.random() * customEmojis.length)];
                if (settings.emojiMixEnabled !== false) {
                    finalText = Math.random() < 0.5
                        ? emoji + ' ' + replyText
                        : replyText + ' ' + emoji;
                } else {
                    separateEmoji = emoji;
                }
            }

            // ──────────── 🔊 决定是否生成语音消息 ────────────
            let isVoice = false;
            let voicePrefix = '';
            // 只有在 TTS 已配置时才考虑生成语音
            if (settings.voiceCardEnabled !== false && typeof isTtsReady === 'function' && isTtsReady()) {
                // 每 5 条里随机 0~1 条 ≈ 20% 概率
                if (Math.random() < 0.2) {
                    isVoice = true;
                    voicePrefix = VOICE_PREFIXES[Math.floor(Math.random() * VOICE_PREFIXES.length)];
                }
            }
            // ─────────────────────────────────────────────────

            const msgPayload = {
                id: Date.now() + i,
                sender: settings.partnerName || '对方',
                text: finalText,                     // 原始文字（不含语气词）
                timestamp: new Date(),
                status: 'received',
                favorited: false,
                note: null,
                replyTo: (i === 0 && recentUserMsgs.length > 0 && Math.random() < 0.3)
                    ? (function(){ const m = recentUserMsgs[Math.floor(Math.random() * recentUserMsgs.length)]; return { id: m.id, text: m.text, sender: m.sender }; })()
                    : null,
                type: isVoice ? 'voice' : 'normal',  // ← 语音类型
                voicePrefix: isVoice ? voicePrefix : null,
                voiceDuration: 0,
                voiceUrl: null
            };

            addMessage(msgPayload);

            if (typeof window._sendPartnerNotification === 'function') {
                window._sendPartnerNotification(settings.partnerName || '对方', finalText);
            }
            playSound('message');

            if (shouldSendSticker) {
                const randomSticker = stickerLibrary[Math.floor(Math.random() * stickerLibrary.length)];
                setTimeout(() => {
                    addMessage({
                        id: Date.now() + i + 2000,
                        sender: settings.partnerName || '对方',
                        text: '',
                        timestamp: new Date(),
                        image: randomSticker,
                        status: 'received',
                        favorited: false,
                        note: null,
                        type: 'normal'
                    });
                    playSound('message');
                    if (typeof window._sendPartnerNotification === 'function') {
                        window._sendPartnerNotification(settings.partnerName || '对方', '[表情]');
                    }
                }, 400 + Math.random() * 600);
            }

            if (separateEmoji) {
                setTimeout(() => {
                    addMessage({
                        id: Date.now() + i + 1000,
                        sender: settings.partnerName || '对方',
                        text: separateEmoji,
                        timestamp: new Date(),
                        status: 'received',
                        favorited: false,
                        note: null,
                        type: 'normal'
                    });
                }, 300 + Math.random() * 400);
            }

            if (i === replyCount - 1) {
                (function() {
                    var _tiW = document.getElementById('typing-indicator-wrapper');
                    if (_tiW) {
                        var _tiInner = _tiW.querySelector('.typing-indicator');
                        if (_tiInner) {
                            _tiInner.classList.add('hiding');
                            setTimeout(function() {
                                _tiW.style.display = 'none';
                                if (_tiInner) _tiInner.classList.remove('hiding');
                            }, 240);
                        } else {
                            _tiW.style.display = 'none';
                        }
                    }
                })();
                if (window.companionFeature && typeof window.companionFeature.afterPartnerReply === 'function') {
                    setTimeout(() => window.companionFeature.afterPartnerReply(), 320);
                }
            }
        }, delay);
    }
}
function showModal(modalElement, focusElement = null) {
            if (modalElement._hideTimeout) {
                clearTimeout(modalElement._hideTimeout);
                modalElement._hideTimeout = null;
            }
            modalElement.style.display = 'flex';
            requestAnimationFrame(() => {
                const content = modalElement.querySelector('.modal-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0) scale(1)';
                }
                if (focusElement) {
                    setTimeout(() => focusElement.focus(), 100);
                }
            });
        }

        function hideModal(modalElement) {
            const content = modalElement.querySelector('.modal-content');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px) scale(0.95)';
            }
            if (modalElement._hideTimeout) clearTimeout(modalElement._hideTimeout);
            modalElement._hideTimeout = setTimeout(() => {
                modalElement.style.display = 'none';
            }, 300);
        }

        function viewImage(src) {
            const modal = document.createElement('div');
            modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;touch-action:pinch-zoom;';
            modal.innerHTML = `
                <div style="position:relative;max-width:95vw;max-height:92vh;display:flex;align-items:center;justify-content:center;">
                    <img src="${src}" style="max-width:95vw;max-height:88vh;object-fit:contain;display:block;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.6);" draggable="false">
                    <button onclick="this.closest('[style*=fixed]').remove()" style="position:fixed;top:16px;right:16px;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);z-index:10;line-height:1;">×</button>
                    <a href="${src}" download style="position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 24px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);border-radius:20px;color:#fff;font-size:13px;text-decoration:none;backdrop-filter:blur(8px);display:flex;align-items:center;gap:6px;"><i class="fas fa-download"></i> 保存图片</a>
                </div>`;
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.tagName === 'IMG') modal.remove();
            });
            document.body.appendChild(modal);
        }

        function exportChatHistory() {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
            overlay.innerHTML = `
                <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                    <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:6px;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-file-export" style="color:var(--accent-color);font-size:14px;"></i>选择导出内容
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">勾选需要导出的数据模块</div>
                    <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:20px;">
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);transition:border-color 0.2s;">
                            <input type="checkbox" id="_exp_msgs" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-comments" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>聊天记录 <span style="font-size:11px;color:var(--text-secondary);">(${messages.length} 条)</span></span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);transition:border-color 0.2s;">
                            <input type="checkbox" id="_exp_settings" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sliders-h" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>外观与聊天设置</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);transition:border-color 0.2s;">
                            <input type="checkbox" id="_exp_replies" style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-reply" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>字卡回复库</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);transition:border-color 0.2s;">
                            <input type="checkbox" id="_exp_ann" style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-calendar-heart" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>纪念日 / 倒计时</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);transition:border-color 0.2s;">
                            <input type="checkbox" id="_exp_themes" style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-palette" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>自定义主题配色</span>
                        </label>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button id="_exp_cancel" style="flex:1;padding:11px;border:1px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
                        <button id="_exp_confirm" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:7px;">
                            <i class="fas fa-download"></i>确认导出
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);

            function closeDialog() { overlay.remove(); }
            overlay.addEventListener('click', e => { if (e.target === overlay) closeDialog(); });
            document.getElementById('_exp_cancel').onclick = closeDialog;

            document.getElementById('_exp_confirm').onclick = function() {
                const inclMsgs     = document.getElementById('_exp_msgs').checked;
                const inclSettings = document.getElementById('_exp_settings').checked;
                const inclReplies  = document.getElementById('_exp_replies').checked;
                const inclAnn      = document.getElementById('_exp_ann').checked;
                const inclThemes   = document.getElementById('_exp_themes').checked;

                if (!inclMsgs && !inclSettings && !inclReplies && !inclAnn && !inclThemes) {
                    showNotification('请至少选择一项导出内容', 'error');
                    return;
                }
                closeDialog();

                try {
                    let dgCustomData = null, dgStatusPool = null, customWeatherMap = {};
                    if (inclSettings) {
                        try { dgCustomData = JSON.parse(localStorage.getItem('dg_custom_data') || 'null'); } catch(e2) {}
                        try { dgStatusPool = JSON.parse(localStorage.getItem('dg_status_pool') || 'null'); } catch(e2) {}
                        try {
                            Object.keys(localStorage).forEach(kk => {
                                if (kk && kk.startsWith('customWeather_')) {
                                    customWeatherMap[kk] = localStorage.getItem(kk);
                                }
                            });
                        } catch(e2) {}
                    }

                    const exportObj = {
                        version: '3.1',
                        appName: 'ChatApp',
                        exportDate: new Date().toISOString(),
                        exportModules: []
                    };
                    if (inclMsgs)     { exportObj.messages = messages; exportObj.exportModules.push('messages'); }
                    if (inclSettings) {
                        exportObj.settings = settings;
                        exportObj.exportModules.push('settings');
                        exportObj.dgCustomData = dgCustomData;
                        exportObj.dgStatusPool = dgStatusPool;
                        exportObj.customWeatherMap = customWeatherMap;
                    }
                    if (inclReplies)  {
                        exportObj.customReplies = customReplies;
                        if (customEmojis && customEmojis.length > 0) exportObj.customEmojis = customEmojis;
                        exportObj.exportModules.push('customReplies');
                    }
                    if (inclAnn)      { exportObj.anniversaries = anniversaries; exportObj.exportModules.push('anniversaries'); }
                    if (inclThemes)   { exportObj.customThemes = customThemes; exportObj.stickerLibrary = stickerLibrary; exportObj.exportModules.push('themes'); }

                    const dataStr = JSON.stringify(exportObj, null, 2);
                    const parts = exportObj.exportModules.join('+');
                    const fileName = `chat-export-${parts}-${new Date().toISOString().slice(0,10)}.json`;

                    if (navigator.share && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
                        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
                        const file = new File([blob], fileName, { type: 'application/json' });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            navigator.share({ files: [file], title: '传讯数据导出', text: `导出日期：${new Date().toLocaleDateString()}` })
                                .catch(() => fallbackExport(dataStr, fileName));
                            return;
                        }
                    }
                    fallbackExport(dataStr, fileName);
                } catch (error) {
                    console.error('导出失败:', error);
                    showNotification('导出失败，请重试', 'error');
                }
            };
        }

        function fallbackExport(dataStr, fileName) {
            fileName = fileName || `chat-backup-${SESSION_ID}-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            showNotification('导出成功', 'success');
        }

        function importChatHistory(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let rawText = e.target.result;
                    if (rawText.charCodeAt(0) === 0xFEFF) rawText = rawText.slice(1);
                    const importedData = JSON.parse(rawText);

                    const hasMessages  = importedData.messages && Array.isArray(importedData.messages);
                    const hasSettings  = !!importedData.settings;
                    const hasReplies   = importedData.customReplies && Array.isArray(importedData.customReplies);
                    const hasAnn       = importedData.anniversaries && Array.isArray(importedData.anniversaries);
                    const hasThemes    = !!importedData.customThemes || !!importedData.stickerLibrary;

                    if (!hasMessages && !hasSettings && !hasReplies && !hasAnn && !hasThemes) {
                        throw new Error('无效的聊天记录文件（未检测到可识别的数据模块）');
                    }

                    const overlay = document.createElement('div');
                    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';

                    const makeRow = (id, icon, label, sublabel, available, checked) => {
                        if (!available) return '';
                        return `<label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="${icon}" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>${label}${sublabel ? `<span style="font-size:11px;color:var(--text-secondary);margin-left:4px;">${sublabel}</span>` : ''}</span>
                        </label>`;
                    };

                    overlay.innerHTML = `
                        <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                            <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:6px;display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-file-import" style="color:var(--accent-color);font-size:14px;"></i>选择导入内容
                            </div>
                            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">文件中检测到以下数据，选择要导入的模块</div>
                            <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:20px;">
                                ${makeRow('_imp_msgs', 'fas fa-comments', '聊天记录', hasMessages ? `(${importedData.messages.length} 条)` : '', hasMessages, true)}
                                ${makeRow('_imp_settings', 'fas fa-sliders-h', '外观与聊天设置', '', hasSettings, true)}
                                ${makeRow('_imp_replies', 'fas fa-reply', '字卡回复库', '', hasReplies, false)}
                                ${makeRow('_imp_ann', 'fas fa-calendar-heart', '纪念日 / 倒计时', '', hasAnn, false)}
                                ${makeRow('_imp_themes', 'fas fa-palette', '自定义主题配色', '', hasThemes, false)}
                            </div>
                            <div style="display:flex;gap:10px;">
                                <button id="_imp_cancel" style="flex:1;padding:11px;border:1px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
                                <button id="_imp_confirm" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:7px;">
                                    <i class="fas fa-upload"></i>确认导入
                                </button>
                            </div>
                        </div>`;
                    document.body.appendChild(overlay);

                    function closeDialog() { overlay.remove(); }
                    overlay.addEventListener('click', ev => { if (ev.target === overlay) closeDialog(); });
                    document.getElementById('_imp_cancel').onclick = closeDialog;

                    document.getElementById('_imp_confirm').onclick = function() {
                        const doMsgs     = hasMessages  && document.getElementById('_imp_msgs')?.checked;
                        const doSettings = hasSettings  && document.getElementById('_imp_settings')?.checked;
                        const doReplies  = hasReplies   && document.getElementById('_imp_replies')?.checked;
                        const doAnn      = hasAnn       && document.getElementById('_imp_ann')?.checked;
                        const doThemes   = hasThemes    && document.getElementById('_imp_themes')?.checked;

                        if (!doMsgs && !doSettings && !doReplies && !doAnn && !doThemes) {
                            showNotification('请至少选择一项导入内容', 'error');
                            return;
                        }

                        if (doMsgs && messages.length > 0 && !confirm('导入将覆盖当前会话的聊天记录，确定继续吗？')) return;
                        closeDialog();

                        if (doMsgs) {
                            messages = importedData.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
                        }
                        if (doSettings) {
                            if (importedData.settings) {
                                Object.assign(settings, importedData.settings);
                                try {
                                    if (settings.customFontUrl) applyCustomFont(settings.customFontUrl);
                                    if (settings.customBubbleCss) applyCustomBubbleCss(settings.customBubbleCss);
                                    if (settings.customGlobalCss) applyGlobalThemeCss(settings.customGlobalCss);
                                } catch(e2) { console.warn('导入后样式应用失败', e2); }
                            }
                            if (importedData.dgCustomData) { try { localStorage.setItem('dg_custom_data', JSON.stringify(importedData.dgCustomData)); } catch(e2) {} }
                            if (importedData.dgStatusPool) { try { localStorage.setItem('dg_status_pool', JSON.stringify(importedData.dgStatusPool)); } catch(e2) {} }
                            if (importedData.customWeatherMap) { try { Object.keys(importedData.customWeatherMap).forEach(wk => localStorage.setItem(wk, importedData.customWeatherMap[wk])); } catch(e2) {} }
                        }
                        if (doReplies  && importedData.customReplies)  customReplies  = importedData.customReplies;
                        if (doReplies  && importedData.customEmojis && Array.isArray(importedData.customEmojis)) customEmojis = importedData.customEmojis;
                        if (doAnn      && importedData.anniversaries)   anniversaries  = importedData.anniversaries;
                        if (doThemes   && importedData.customThemes)    customThemes   = importedData.customThemes;
                        if (doThemes   && importedData.stickerLibrary)  stickerLibrary = importedData.stickerLibrary;

                        saveData();
                        if (doMsgs && typeof renderMessages === 'function') renderMessages();
                        if (typeof applySettings === 'function') applySettings();
                        updateUI();
                        const count = doMsgs ? `${messages.length} 条消息` : '所选数据';
                        showNotification(`成功导入${count}`, 'success');
                    };
                } catch (error) {
                    console.error('导入失败:', error);
                    showNotification('文件格式错误或已损坏', 'error');
                }
            };
            reader.onerror = () => showNotification('文件读取失败', 'error');
            reader.readAsText(file);
        }

        const checkStatusChange = () => {
            if ((Date.now() - settings.lastStatusChange) / 36e5 >= settings.nextStatusChange) {
if (customStatuses && customStatuses.length > 0) {
    settings.partnerStatus = getRandomItem(customStatuses);
}
                settings.lastStatusChange = Date.now();
                settings.nextStatusChange = 1 + Math.random() * 7;
                DOMElements.partner.status.textContent = settings.partnerStatus;
                throttledSaveData();
            }
        };



        function getStorageKey(baseKey) {
            if (!SESSION_ID) {
                console.error('[getStorageKey] SESSION_ID 尚未初始化，拒绝生成存储键:', baseKey);
                throw new Error('SESSION_ID 未初始化，存储操作已中止');
            }
            return `${APP_PREFIX}${SESSION_ID}_${baseKey}`;
        }

        async function migrateData() {
            const isMigrated = await localforage.getItem(APP_PREFIX + 'MIGRATION_V2_DONE');
            if (isMigrated) return;

            try {
                const keys = Object.keys(localStorage);
                for (const key of keys) {
                    if (key.startsWith(APP_PREFIX)) {
                        try {
                            const val = localStorage.getItem(key);
                            if (val) {
                                let dataToStore = val;
                                try {
                                    if (val.startsWith('{') || val.startsWith('[')) {
                                        dataToStore = JSON.parse(val);
                                    }
                                } catch (e) {
                                    console.warn(`迁移期间解析数据失败: ${key}，将作为原始字符串存储。`, e);
                                }
                                await localforage.setItem(key, dataToStore);
                            }
                        } catch (e) {
                            console.error(`迁移键值 ${key} 时发生错误，已跳过。`, e);
                        }
                    }
                }
                
                await localforage.setItem(APP_PREFIX + 'MIGRATION_V2_DONE', 'true');
            } catch (e) {
                console.error("数据迁移过程中发生严重错误:", e);
                showNotification('数据迁移失败，部分旧数据可能丢失', 'error');
            }
        }
async function initializeSession() {
    
    await migrateData();

    const sessionsData = await localforage.getItem(`${APP_PREFIX}sessionList`);
    sessionList = sessionsData || [];

    const hash = window.location.hash.substring(1);
    if (hash && sessionList.some(s => s.id === hash)) {
        SESSION_ID = hash;
    } else if (sessionList.length > 0) {
        const lastId = await localforage.getItem(`${APP_PREFIX}lastSessionId`);
        SESSION_ID = lastId && sessionList.some(s => s.id === lastId) ? lastId : sessionList[0].id;
    } else {
        SESSION_ID = await createNewSession(false);
    }

    await localforage.setItem(`${APP_PREFIX}lastSessionId`, SESSION_ID);
}

function toggleBatchFavoriteMode() {
            isBatchFavoriteMode = !isBatchFavoriteMode;
            selectedMessages = [];

            if (isBatchFavoriteMode) {
                document.body.classList.add('batch-favorite-mode');
                showBatchFavoriteActions();
                showNotification('批量收藏模式已开启，点击消息进行选择', 'info');
            } else {
                document.body.classList.remove('batch-favorite-mode');
                hideBatchFavoriteActions();
                showNotification('批量收藏模式已关闭', 'info');
            }

            renderMessages(true);
        }

        function hideBatchFavoriteActions() {
            const actions = document.querySelector('.batch-favorite-actions');
            if (actions) {

                actions.style.animation = 'floatUpAction 0.3s reverse forwards';
                setTimeout(() => {
                    actions.remove();
                }, 300);
            }
        }


        function showBatchFavoriteActions() {

            if (document.querySelector('.batch-favorite-actions')) return;

            const actions = document.createElement('div');
            actions.className = 'batch-favorite-actions';

            actions.innerHTML = `
        <button class="batch-action-btn-pill batch-btn-cancel" id="cancel-batch-favorite">
        <i class="fas fa-times"></i> 取消
        </button>
        <button class="batch-action-btn-pill batch-btn-confirm" id="confirm-batch-favorite">
        <i class="fas fa-check"></i> 确认收藏 (0)
        </button>
        `;
            document.body.appendChild(actions);

            document.getElementById('confirm-batch-favorite').addEventListener('click', confirmBatchFavorite);
            document.getElementById('cancel-batch-favorite').addEventListener('click', toggleBatchFavoriteMode);
        }


        function confirmBatchFavorite() {
            if (selectedMessages.length === 0) {
                showNotification('请先选择要收藏的消息', 'warning');
                return;
            }


            const count = selectedMessages.length;


            selectedMessages.forEach(msgId => {
                const message = messages.find(m => m.id === msgId);
                if (message) {
                    message.favorited = true;
                }
            });


            throttledSaveData();


            toggleBatchFavoriteMode();


            showNotification(`已成功收藏 ${count} 条消息`, 'success');
        }


        function renderAnniversaries() {
    const list = DOMElements.anniversaryModal.list;
    if (anniversaries.length === 0) {
        list.innerHTML = '<div class="no-favorites" style="padding:20px 0;"><i class="fas fa-heart" style="font-size:24px;margin-bottom:10px;"></i><p>还没有记录纪念日</p></div>';
        return;
    }

    list.innerHTML = anniversaries.map(anniversary => {
        const startDate = new Date(anniversary.date);
        const now = new Date();
        let diffDays;
        
        if (anniversary.type === 'countdown') {
            diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) diffDays = 0; 
        } else {
            diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        }

        const typeClass = anniversary.type === 'countdown' ? 'type-future' : 'type-past';
        const tagText = anniversary.type === 'countdown' ? '倒数' : '纪念';

        return `
        <div class="anniversary-card ${typeClass}" data-id="${anniversary.id}">
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                <div class="ann-info">
                    <div class="ann-name">
                        ${anniversary.name} 
                        <span class="ann-tag">${tagText}</span>
                    </div>
                    <div class="ann-date">${startDate.toLocaleDateString()}</div>
                </div>
                <div class="ann-days">
                    <span class="ann-number">${diffDays}</span>
                    <span class="ann-label">Days</span>
                </div>
            </div>
            <div class="ann-delete-btn" style="position:absolute; top:-8px; right:-8px; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity 0.2s;" 
                 onclick="deleteAnniversary(${anniversary.id}, event)">
                <i class="fas fa-times" style="font-size:12px;"></i>
            </div>
        </div>
        `;
    }).join('');
}

        function addAnniversary() {
    const nameInput = document.getElementById('ann-input-name');
    const dateInput = document.getElementById('ann-input-date');
    
    const name = (nameInput ? nameInput.value : (DOMElements.anniversaryModal.nameInput ? DOMElements.anniversaryModal.nameInput.value : '')).trim();
    const date = dateInput ? dateInput.value : (DOMElements.anniversaryModal.dateInput ? DOMElements.anniversaryModal.dateInput.value : '');

    if (!name || !date) {
        showNotification('请填写名称和日期', 'error');
        return;
    }

    const type = (typeof currentAnnType !== 'undefined' ? currentAnnType : null) 
              || (typeof currentAnniversaryType !== 'undefined' ? currentAnniversaryType : 'anniversary');

    const newAnniversary = {
        id: Date.now(),
        name: name,
        date: date,
        type: type
    };

    anniversaries.push(newAnniversary);
    throttledSaveData();
    renderAnniversariesList();
    
    if (nameInput) nameInput.value = '';
    if (dateInput) dateInput.value = '';
    if (DOMElements.anniversaryModal.nameInput) DOMElements.anniversaryModal.nameInput.value = '';
    if (DOMElements.anniversaryModal.dateInput) DOMElements.anniversaryModal.dateInput.value = '';

    const annFormWrapper = document.getElementById('ann-form-wrapper');
    const annToggleBtn = document.getElementById('ann-toggle-btn');
    if (annFormWrapper) annFormWrapper.classList.remove('active');
    if (annToggleBtn) annToggleBtn.classList.remove('active');

    showNotification('纪念日已添加', 'success');
}

        function showAnniversaryAnimation(anniversary) {
            const startDate = new Date(anniversary.date);
            const now = new Date();
            let diffDays;
            let title, message;

            if (anniversary.type === 'countdown') {

                diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
                title = "倒数日";
                message = `距离 ${anniversary.name} 还有`;
            } else {

                diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
                title = "纪念日快乐！";
                message = `我们已经相伴了`;
            }

            DOMElements.anniversaryAnimation.title.textContent = title;
            DOMElements.anniversaryAnimation.days.textContent = diffDays;
            DOMElements.anniversaryAnimation.message.textContent = message;

            DOMElements.anniversaryAnimation.modal.classList.add('active');
        }

        function updateAnniversaryDisplay(dateString) {
            if (!dateString) return;

            const start = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - start);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            DOMElements.anniversaryModal.daysElement.textContent = diffDays;
            DOMElements.anniversaryModal.dateShowElement.textContent = `起始日：${start.toLocaleDateString()}`;
            DOMElements.anniversaryModal.displayArea.style.display = 'block';
        }



const MOOD_OPTIONS = [
    { key: 'happy', kaomoji: '😆', label: '开心', color: '#FFD93D' },
    { key: 'excited', kaomoji: '🥰', label: '兴奋', color: '#FF6B6B' },
    { key: 'peace', kaomoji: '☺️', label: '平淡', color: '#6BCB77' },
    { key: 'sad', kaomoji: '😕', label: '难过', color: '#4D96FF' },
    { key: 'tired', kaomoji: '😞', label: '疲惫', color: '#8D9EFF' },
    { key: 'angry', kaomoji: '😠', label: '生气', color: '#FF4757' },
    { key: 'love', kaomoji: '🥰', label: '想你', color: '#FF9A8B' },
    { key: 'busy', kaomoji: '😵‍💫', label: '忙碌', color: '#A8D8EA' },
    { key: 'sleepy', kaomoji: '😴', label: '困困', color: '#E0C3FC' },
{ key: 'lonely', kaomoji: '🥹', label: '孤单', color: '#B8A9C9' }, 
{ key: 'cool', kaomoji: '😎', label: '潇洒', color: '#2C3E50' },
    { key: 'cute', kaomoji: '🥺', label: '撒娇', color: '#FFB6C1' }
];

let moodData = {}; 
let currentCalendarDate = new Date();
window.selectedDateStr = null;
let selectedDateStr = null;
let currentMoodPage = 1; 
let currentMoodEditTarget = 'me'; 
let customMoodOptions = []; 
let customMoodSelectedColor = '#FFD93D';
const CUSTOM_MOOD_COLORS = ['#FFD93D','#FF6B6B','#6BCB77','#4D96FF','#8D9EFF','#FF9A8B','#A8D8EA','#E0C3FC','#B8A9C9','#2C3E50'];

async function initMoodData() {
    const savedMoods = await localforage.getItem(getStorageKey('moodCalendar'));
    if (savedMoods) { moodData = savedMoods; }
    const savedCustomMoods = await localforage.getItem(getStorageKey('customMoodOptions'));
    if (savedCustomMoods) { customMoodOptions = savedCustomMoods; }
    window.moodData = moodData;
    checkPartnerDailyMood();
}
function checkPartnerDailyMood() {
    const today = new Date();
    const dateStr = formatDateStr(today);
    
    if (!moodData[dateStr]) {
        moodData[dateStr] = {};
    }

    if (!moodData[dateStr].partner && moodData[dateStr].partnerChecked === undefined) {
        moodData[dateStr].partnerChecked = true;
        if (Math.random() < 0.20) {
            saveMoodData();
            return;
        }
        const randomMood = MOOD_OPTIONS[Math.floor(Math.random() * MOOD_OPTIONS.length)];
        moodData[dateStr].partner = randomMood.key;
        try {
            const cReplies = (typeof customReplies !== 'undefined') ? customReplies : (window._customReplies || []);
            const sourcePool = [...cReplies];
            if (sourcePool.length > 0) {
                const count = Math.floor(Math.random() * 3) + 1;
                const chosen = [];
                const shuffled = [...sourcePool].sort(() => Math.random() - 0.5);
                for (let i = 0; i < Math.min(count, shuffled.length); i++) {
                    chosen.push(shuffled[i]);
                }
                moodData[dateStr].partnerNote = chosen.join('　');
            }
        } catch(e) {  }
        saveMoodData();
    }
}
function saveMoodData() {
    localforage.setItem(getStorageKey('moodCalendar'), moodData);
    window.moodData = moodData;
    var moodModal = document.getElementById('mood-modal');
    if (moodModal && !moodModal.classList.contains('hidden') && moodModal.style.display !== 'none') {
        renderMoodCalendar();
    }
}
function saveCustomMoodOptions() {
    localforage.setItem(getStorageKey('customMoodOptions'), customMoodOptions);
}
function getAllMoodOptions() {
    return [...MOOD_OPTIONS, ...customMoodOptions];
}
function formatDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}


let currentMoodSelection = null; 
function renderMoodCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthLabel = document.getElementById('calendar-month-label');
    
    if (!grid || !monthLabel) return;

    grid.innerHTML = '';
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    monthLabel.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); 

    let stats = {
        me: { total: 0, counts: {} },
        partner: { total: 0, counts: {} }
    };

    for (let i = 0; i < startDayOfWeek; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        grid.appendChild(empty);
    }

    const todayStr = formatDateStr(new Date());

    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dateObj = new Date(year, month, d);
        const dateStr = formatDateStr(dateObj);
        
        if (dateStr === todayStr) {
            dayDiv.classList.add('today');
            dayDiv.style.borderColor = 'var(--accent-color)';
        }

        const numSpan = document.createElement('span');
        numSpan.textContent = d;
        dayDiv.appendChild(numSpan);

        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'mood-dots-container';

        const dayData = moodData[dateStr];
        
        if (dayData) {
            if (dayData.user) {
                const moodObj = getAllMoodOptions().find(m => m.key === dayData.user);
                if (moodObj) {
                    stats.me.counts[moodObj.key] = (stats.me.counts[moodObj.key] || 0) + 1;
                    stats.me.total++;
                    const dot = createMoodDot(moodObj, dayData.note, false);
                    dotsContainer.appendChild(dot);
                }
            }
            if (dayData.partner) {
                const moodObj = getAllMoodOptions().find(m => m.key === dayData.partner);
                if (moodObj) {
                    stats.partner.counts[moodObj.key] = (stats.partner.counts[moodObj.key] || 0) + 1;
                    stats.partner.total++;
                    const dot = createMoodDot(moodObj, dayData.partnerNote, true); 
                    dotsContainer.appendChild(dot);
                }
            }
        }

        dayDiv.appendChild(dotsContainer);

        dayDiv.addEventListener('click', () => {
            const dayEntry = moodData[dateStr];
            if (dayEntry && (dayEntry.user || dayEntry.partner)) {
                showDayDetails(dateStr, dayEntry);
            } else {
                openMoodSelector(dateStr, 'me');
            }
        });

        grid.appendChild(dayDiv);
    }

    updateDualMoodStats(stats);
}

function createMoodDot(moodObj, note, isPartner) {
    const dot = document.createElement('div');
    dot.className = `mood-detail-dot ${isPartner ? 'partner-mood' : ''}`;
    dot.style.backgroundColor = moodObj.color;
    
    if (isPartner) {
        dot.innerHTML = `
            <span class="mood-kaomoji-span">${moodObj.kaomoji}</span>
            <span class="mood-text-span">Ta</span>
        `;
    } else {
        const displayText = (note && note.trim()) ? note : moodObj.label;
        dot.innerHTML = `
            <span class="mood-kaomoji-span">${moodObj.kaomoji}</span>
            <span class="mood-text-span" style="margin-left:2px;">${displayText}</span>
        `;
    }
    return dot;
}
function updateDualMoodStats(stats) {
    const container = document.getElementById('mood-stats-container');
    if (!container) return;

    const mName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';
    const pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';

    const myTotal = stats.me.total;
    const partnerTotal = stats.partner.total;
    
    const daysInMonth = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 0).getDate();
    const myPercent = daysInMonth > 0 ? (myTotal / daysInMonth) * 100 : 0;
    const partnerPercent = daysInMonth > 0 ? (partnerTotal / daysInMonth) * 100 : 0;

    let myDominant = { label: '无', kaomoji: '😶', color: '#ccc' };
    let myMaxCount = 0;
    Object.keys(stats.me.counts).forEach(key => {
        if (stats.me.counts[key] > myMaxCount) {
            myMaxCount = stats.me.counts[key];
            const m = getAllMoodOptions().find(o => o.key === key);
            if (m) myDominant = m;
        }
    });

    let partnerDominant = { label: '无', kaomoji: '😶', color: '#ccc' };
    let partnerMaxCount = 0;
    Object.keys(stats.partner.counts).forEach(key => {
        if (stats.partner.counts[key] > partnerMaxCount) {
            partnerMaxCount = stats.partner.counts[key];
            const m = getAllMoodOptions().find(o => o.key === key);
            if (m) partnerDominant = m;
        }
    });
    
    const createMoodBarHTML = (moodCounts, totalCount) => {
        if (totalCount <= 0) {
            return `<div class="mood-bar-container" style="justify-content: center; align-items: center; font-size: 10px; color: var(--text-secondary); background: var(--message-received-bg);">无数据</div>`;
        }

        const segments = Object.keys(moodCounts)
            .map(key => {
                const count = moodCounts[key];
                const moodObj = getAllMoodOptions().find(m => m.key === key);
                if (moodObj) {
                    const percentage = (count / totalCount) * 100;
                    return `<div class="mood-bar-segment" style="width: ${percentage}%; background-color: ${moodObj.color};" title="${moodObj.label}: ${count}天"></div>`;
                }
                return ''; 
            })
            .join(''); 
        return `<div class="mood-bar-container">${segments}</div>`;
    };

    const myBarHTML = createMoodBarHTML(stats.me.counts, myTotal);
    const partnerBarHTML = createMoodBarHTML(stats.partner.counts, partnerTotal);

    var todayStr = formatDateStr(new Date());
    var todayEntry = moodData[todayStr] || {};
    var myWeatherVal = todayEntry.myWeather || '';
    var partnerWeatherVal = todayEntry.partnerWeather || '';

    container.innerHTML = `
        <div class="mood-circles-wrapper" style="margin-bottom:20px;">
            <div class="mood-circle-item">
                <div class="mood-circle" style="--percent: ${myPercent}%">
                    <span class="mood-circle-text" style="color:var(--accent-color)">${myTotal}</span>
                </div>
                <div class="mood-circle-label">
                    <span class="mood-marker me" style="width:8px;height:8px;"></span> ${mName}
                </div>
                <div class="stats-weather-tag" onclick="editStatsWeather(this,'me')" title="点击编辑天气">
                    ${myWeatherVal ? `<span>${myWeatherVal}</span>` : `<span style="opacity:0.4;">+ 天气</span>`}
                </div>
            </div>
            <div class="mood-circle-item">
                <div class="mood-circle" style="--percent: ${partnerPercent}%; --accent-color: #ff6b6b;">
                    <span class="mood-circle-text" style="color:#ff6b6b">${partnerTotal}</span>
                </div>
                <div class="mood-circle-label">
                    <span class="mood-marker partner" style="width:8px;height:8px;"></span> ${pName}
                </div>
                <div class="stats-weather-tag" onclick="editStatsWeather(this,'partner')" title="点击编辑天气">
                    ${partnerWeatherVal ? `<span>${partnerWeatherVal}</span>` : `<span style="opacity:0.4;">+ 天气</span>`}
                </div>
            </div>
        </div>

        <div class="mood-stat-group">
            <div class="mood-stat-title">
                <span>我的心情</span>
                <div class="dominant-mood-tag">
                    <span style="color:${myDominant.color}; font-weight:bold;">${myDominant.kaomoji} ${myDominant.label}</span>
                </div>
            </div>
            <div style="font-size:11px; color:var(--text-secondary); display:flex; justify-content:space-between;">
                <span>记录天数: ${myTotal}</span>
            </div>
            ${myBarHTML}
        </div>

        <div class="mood-stat-group">
            <div class="mood-stat-title">
                <span>${pName}的心情</span>
                <div class="dominant-mood-tag">
                    <span style="color:${partnerDominant.color}; font-weight:bold;">${partnerDominant.kaomoji} ${partnerDominant.label}</span>
                </div>
            </div>
            <div style="font-size:11px; color:var(--text-secondary); display:flex; justify-content:space-between;">
                <span>记录天数: ${partnerTotal}</span>
            </div>
            ${partnerBarHTML}
        </div>
    `;
}

window.editStatsWeather = function(el, who) {
    if (el.querySelector('input')) return;
    var todayStr = formatDateStr(new Date());
    if (!moodData[todayStr]) moodData[todayStr] = {};
    var current = who === 'me' ? (moodData[todayStr].myWeather || '') : (moodData[todayStr].partnerWeather || '');
    var input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.maxLength = 20;
    input.placeholder = '今日天气…';
    input.style.cssText = 'width:100%;padding:3px 7px;border:1px solid var(--accent-color);border-radius:8px;font-size:12px;background:var(--primary-bg);color:var(--text-primary);outline:none;text-align:center;';
    el.innerHTML = '';
    el.appendChild(input);
    input.focus(); input.select();
    function save() {
        var val = input.value.trim();
        if (who === 'me') moodData[todayStr].myWeather = val;
        else moodData[todayStr].partnerWeather = val;
        saveMoodData();
        el.innerHTML = val ? `<span>${val}</span>` : `<span style="opacity:0.4;">+ 天气</span>`;
    }
    input.addEventListener('blur', save);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); save(); }
        if (e.key === 'Escape') { el.innerHTML = current ? `<span>${current}</span>` : `<span style="opacity:0.4;">+ 天气</span>`; }
    });
};

window.deleteDailyMood = function(dateStr, who) {
    if (!moodData[dateStr]) return;
    if (who === 'me') { delete moodData[dateStr].user; delete moodData[dateStr].note; delete moodData[dateStr].myWeather; }
    else { delete moodData[dateStr].partner; delete moodData[dateStr].partnerNote; delete moodData[dateStr].partnerWeather; }
    if (!moodData[dateStr].user && !moodData[dateStr].partner) delete moodData[dateStr];
    saveMoodData();
    renderMoodCalendar();
    showNotification('已删除心情记录', 'success');
    closeMoodOverlay();
};

function renderMoodOptionsGrid(targetKey) {
    const allMoods = getAllMoodOptions();
    const optionsGrid = document.getElementById('mood-options-grid');
    optionsGrid.innerHTML = allMoods.map(mood => {
        const isSelected = targetKey === mood.key;
        const isCustom = mood.key.startsWith('custom_');
        return `
        <div class="mood-option-btn${isCustom ? ' mood-option-custom' : ''}" 
             style="${isSelected ? `background:${mood.color}; color:#fff; border-color:${mood.color}; transform:scale(1.05); box-shadow:0 4px 10px rgba(0,0,0,0.15);` : ''}"
             onclick="tempSelectMood('${mood.key}')">
            <div class="mood-kaomoji" style="${isSelected ? 'color:#fff' : `color:${mood.color}`}">${mood.kaomoji}</div>
            <div class="mood-label">${mood.label}</div>
            ${isCustom ? `<div class="mood-custom-actions" onclick="event.stopPropagation()">
                <button class="mood-custom-action-btn" onclick="editCustomMood('${mood.key}')" title="编辑">✏️</button>
                <button class="mood-custom-action-btn" onclick="deleteCustomMood('${mood.key}')" title="删除">🗑</button>
            </div>` : ''}
        </div>
    `}).join('');
}

function switchMoodPage(dir) {
    currentMoodPage = Math.max(1, Math.min(2, currentMoodPage + dir));
    const page1 = document.getElementById('mood-page-1');
    const page2 = document.getElementById('mood-page-2');
    const indicator = document.getElementById('mood-page-indicator');
    const prevBtn = document.getElementById('mood-page-prev');
    const nextBtn = document.getElementById('mood-page-next');
    if (currentMoodPage === 1) {
        page1.style.display = 'block'; page2.style.display = 'none';
        indicator.textContent = '第 1 页 · 心情';
        prevBtn.disabled = true; nextBtn.disabled = false;
    } else {
        page1.style.display = 'none'; page2.style.display = 'block';
        const isPartner = currentMoodEditTarget === 'partner';
        indicator.textContent = '第 2 页 · 随记';
        document.getElementById('mood-note-label').textContent = isPartner ? '对方随记:' : '随记:';
        document.getElementById('mood-note-input').placeholder = isPartner ? '记录对方今天发生的事...' : '记录下今天发生的小事...';
        prevBtn.disabled = false; nextBtn.disabled = true;
    }
}
window.switchMoodPage = switchMoodPage;

function switchMoodEditTarget(target) {
    currentMoodEditTarget = target;
    document.getElementById('mood-tab-me').classList.toggle('active', target === 'me');
    document.getElementById('mood-tab-partner').classList.toggle('active', target === 'partner');
    const existing = moodData[selectedDateStr];
    let currentKey, noteVal;
    if (target === 'me') {
        currentKey = existing ? existing.user : null;
        noteVal = (existing && existing.note) ? existing.note : '';
    } else {
        currentKey = existing ? existing.partner : null;
        noteVal = (existing && existing.partnerNote) ? existing.partnerNote : '';
    }
    currentMoodSelection = currentKey;
    document.getElementById('mood-note-input').value = noteVal;
    renderMoodOptionsGrid(currentKey);
    switchMoodPage(0); 
}
window.switchMoodEditTarget = switchMoodEditTarget;

function openMoodSelector(dateStr, editTarget) {
    selectedDateStr = dateStr;
    window.selectedDateStr = dateStr;
    currentMoodEditTarget = editTarget || 'me';
    currentMoodPage = 1;
    currentMoodSelection = null;

    const overlay = document.getElementById('mood-selector-overlay');
    const editorView = document.getElementById('mood-editor-view');
    const detailView = document.getElementById('mood-detail-view');
    const dateTitle = document.getElementById('mood-selector-date');

    if (window._moodOverlayRafId) {
        cancelAnimationFrame(window._moodOverlayRafId);
        window._moodOverlayRafId = null;
    }

    overlay.classList.remove('active');
    
    editorView.style.display = 'block';
    if (detailView) detailView.style.display = 'none';

    const [y, m, d] = dateStr.split('-');
    dateTitle.textContent = `${m}月${d}日`;

    document.getElementById('mood-tab-me').classList.toggle('active', currentMoodEditTarget === 'me');
    document.getElementById('mood-tab-partner').classList.toggle('active', currentMoodEditTarget === 'partner');

    const existing = moodData[dateStr];
    let currentKey, noteVal, weatherVal;
    if (currentMoodEditTarget === 'me') {
        currentKey = existing ? existing.user : null;
        noteVal = (existing && existing.note) ? existing.note : '';
        weatherVal = (existing && existing.myWeather) ? existing.myWeather : '';
    } else {
        currentKey = existing ? existing.partner : null;
        noteVal = (existing && existing.partnerNote) ? existing.partnerNote : '';
        weatherVal = (existing && existing.partnerWeather) ? existing.partnerWeather : '';
    }
    currentMoodSelection = currentKey;
    document.getElementById('mood-note-input').value = noteVal;
    const weatherInput = document.getElementById('mood-weather-input');
    if (weatherInput) weatherInput.value = weatherVal;
    const weatherLabel = document.getElementById('mood-weather-label');
    if (weatherLabel) {
        var pNameW = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        var mNameW = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';
        if (weatherLabel.firstChild) weatherLabel.firstChild.textContent = currentMoodEditTarget === 'me' ? mNameW + '的天气\u00a0' : pNameW + '的天气\u00a0';
    }

    document.getElementById('mood-page-1').style.display = 'block';
    document.getElementById('mood-page-2').style.display = 'none';
    document.getElementById('mood-page-indicator').textContent = '第 1 页 · 心情';
    document.getElementById('mood-page-prev').disabled = true;
    document.getElementById('mood-page-next').disabled = false;

    renderMoodOptionsGrid(currentKey);
    window._moodOverlayRafId = requestAnimationFrame(() => {
        window._moodOverlayRafId = null;
        overlay.classList.add('active');
    });
}

window.editPartnerMoodRecord = function() {
    openMoodSelector(selectedDateStr, 'partner');
};

window.tempSelectMood = function(key) {
    currentMoodSelection = key;
    renderMoodOptionsGrid(key);
}

document.getElementById('confirm-mood-save').addEventListener('click', () => {
    if (!selectedDateStr) return;
    if (!currentMoodSelection && currentMoodPage === 1) {
        showNotification('请先选择一个心情图标', 'warning');
        return;
    }
    if (!moodData[selectedDateStr]) moodData[selectedDateStr] = {};
    const weatherVal = (document.getElementById('mood-weather-input') || {}).value || '';
    if (currentMoodEditTarget === 'me') {
        if (currentMoodSelection) moodData[selectedDateStr].user = currentMoodSelection;
        moodData[selectedDateStr].note = document.getElementById('mood-note-input').value.trim();
        moodData[selectedDateStr].myWeather = weatherVal.trim();
    } else {
        if (currentMoodSelection) moodData[selectedDateStr].partner = currentMoodSelection;
        moodData[selectedDateStr].partnerNote = document.getElementById('mood-note-input').value.trim();
        moodData[selectedDateStr].partnerWeather = weatherVal.trim();
    }
    
    saveMoodData();
    closeMoodOverlay();
    showNotification('记录已保存 ✦', 'success');
});

function showDayDetails(dateStr, data) {
    selectedDateStr = dateStr;
    window.selectedDateStr = dateStr;
    const overlay = document.getElementById('mood-selector-overlay');
    const editorView = document.getElementById('mood-editor-view');
    const detailView = document.getElementById('mood-detail-view');
    
    const allMoods = getAllMoodOptions();
    const moodObj = allMoods.find(m => m.key === data.user);

    const [y, m, d] = dateStr.split('-');
    document.getElementById('detail-date').textContent = `${m}月${d}日`;

    const mySection = document.getElementById('detail-my-section');
    if (moodObj) {
        mySection.style.display = 'block';
        document.getElementById('detail-kaomoji').textContent = moodObj.kaomoji;
        document.getElementById('detail-label').textContent = moodObj.label;
        document.getElementById('detail-label').style.color = moodObj.color;
        document.getElementById('detail-text').textContent = data.note || "（这天没有写下随记...）";
        detailView.style.borderLeftColor = moodObj.color;
        const myWeatherEl = document.getElementById('detail-my-weather');
        if (myWeatherEl) {
            if (data.myWeather) { myWeatherEl.style.display = 'block'; document.getElementById('detail-my-weather-val').textContent = data.myWeather; }
            else myWeatherEl.style.display = 'none';
        }
    } else {
        mySection.style.display = 'none';
    }

    const partnerSection = document.getElementById('detail-partner-section');
    const partnerNoRecord = document.getElementById('detail-partner-no-record');
    if (data.partner) {
        const partnerMoodObj = allMoods.find(mo => mo.key === data.partner);
        if (partnerMoodObj) {
            partnerSection.style.display = 'block';
            if (partnerNoRecord) partnerNoRecord.style.display = 'none';
            document.getElementById('detail-partner-kaomoji').textContent = partnerMoodObj.kaomoji;
            document.getElementById('detail-partner-label').textContent = partnerMoodObj.label;
            document.getElementById('detail-partner-label').style.color = partnerMoodObj.color;
            document.getElementById('detail-partner-text').textContent = data.partnerNote || "（Ta 这天没有写下任何随记）";
            const partnerWeatherEl = document.getElementById('detail-partner-weather');
            if (partnerWeatherEl) {
                if (data.partnerWeather) { partnerWeatherEl.style.display = 'block'; document.getElementById('detail-partner-weather-val').textContent = data.partnerWeather; }
                else partnerWeatherEl.style.display = 'none';
            }
        } else {
            partnerSection.style.display = 'none';
            if (partnerNoRecord) partnerNoRecord.style.display = 'none';
        }
    } else {
        partnerSection.style.display = 'none';
        if (partnerNoRecord) partnerNoRecord.style.display = 'block';
    }

    editorView.style.display = 'none';
    detailView.style.display = 'block';
    overlay.classList.add('active');
}

document.getElementById('edit-existing-mood').addEventListener('click', () => {
    const editorView = document.getElementById('mood-editor-view');
    const detailView = document.getElementById('mood-detail-view');
    openMoodSelector(selectedDateStr, 'me');
    editorView.style.display = 'block';
    detailView.style.display = 'none';
});

window.closeMoodOverlay = function() {
    if (window._moodOverlayRafId) {
        cancelAnimationFrame(window._moodOverlayRafId);
        window._moodOverlayRafId = null;
    }
    const overlay = document.getElementById('mood-selector-overlay');
    if(overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.opacity = '';
            overlay.style.transition = '';
            const customDialog = document.getElementById('custom-mood-dialog');
            if(customDialog) customDialog.style.display = 'none';
        }, 250);
    }
};
window.viewMoodDetailFromEditor = function() {
    if (!selectedDateStr || !moodData[selectedDateStr]) return;
    showDayDetails(selectedDateStr, moodData[selectedDateStr]);
};
document.getElementById('cancel-mood-edit').addEventListener('click', closeMoodOverlay);

window.openCustomMoodDialog = function() {
    const dialog = document.getElementById('custom-mood-dialog');
    document.getElementById('custom-mood-emoji').value = '';
    document.getElementById('custom-mood-label').value = '';
    customMoodSelectedColor = CUSTOM_MOOD_COLORS[0];
    const colorsEl = document.getElementById('custom-mood-colors');
    colorsEl.innerHTML = CUSTOM_MOOD_COLORS.map((c,i) => 
        `<div class="custom-mood-color-dot ${i===0?'selected':''}" style="background:${c};" onclick="selectCustomColor('${c}',this)"></div>`
    ).join('');
    const saveBtn = dialog.querySelector('.modal-btn-primary');
    saveBtn.onclick = window.saveCustomMood;
    dialog.style.display = 'block';
};
window.selectCustomColor = function(color, el) {
    customMoodSelectedColor = color;
    document.querySelectorAll('.custom-mood-color-dot').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
};
window.closeCustomMoodDialog = function() {
    document.getElementById('custom-mood-dialog').style.display = 'none';
};
window.saveCustomMood = function() {
    const emoji = document.getElementById('custom-mood-emoji').value.trim();
    const label = document.getElementById('custom-mood-label').value.trim();
    if (!emoji || !label) { showNotification('请填写表情和名称', 'warning'); return; }
    const key = 'custom_' + Date.now();
    customMoodOptions.push({ key, kaomoji: emoji, label, color: customMoodSelectedColor });
    saveCustomMoodOptions();
    closeCustomMoodDialog();
    renderMoodOptionsGrid(currentMoodSelection);
    showNotification('自定义心情已添加 ✦', 'success');
};

window.deleteCustomMood = function(key) {
    customMoodOptions = customMoodOptions.filter(m => m.key !== key);
    saveCustomMoodOptions();
    renderMoodOptionsGrid(currentMoodSelection);
    showNotification('已删除自定义心情', 'success');
};

window.editCustomMood = function(key) {
    const mood = customMoodOptions.find(m => m.key === key);
    if (!mood) return;
    const dialog = document.getElementById('custom-mood-dialog');
    document.getElementById('custom-mood-emoji').value = mood.kaomoji;
    document.getElementById('custom-mood-label').value = mood.label;
    customMoodSelectedColor = mood.color;
    const colorsEl = document.getElementById('custom-mood-colors');
    colorsEl.innerHTML = CUSTOM_MOOD_COLORS.map((c) => 
        `<div class="custom-mood-color-dot ${c===mood.color?'selected':''}" style="background:${c};" onclick="selectCustomColor('${c}',this)"></div>`
    ).join('');
    dialog.style.display = 'block';
    dialog._editingKey = key;
    const saveBtn = dialog.querySelector('.modal-btn-primary');
    saveBtn.onclick = function() {
        const emoji = document.getElementById('custom-mood-emoji').value.trim();
        const label = document.getElementById('custom-mood-label').value.trim();
        if (!emoji || !label) { showNotification('请填写表情和名称', 'warning'); return; }
        const idx = customMoodOptions.findIndex(m => m.key === key);
        if (idx !== -1) customMoodOptions[idx] = { key, kaomoji: emoji, label, color: customMoodSelectedColor };
        saveCustomMoodOptions();
        closeCustomMoodDialog();
        saveBtn.onclick = null;
        renderMoodOptionsGrid(currentMoodSelection);
        showNotification('自定义心情已更新 ✦', 'success');
    };
};

function initMoodListeners() {
    const btnCalendar = document.getElementById('btn-view-calendar');
    const btnStats = document.getElementById('btn-view-stats');
    const viewCalendar = document.getElementById('mood-calendar-view');
    const viewStats = document.getElementById('mood-stats-view');

    if (btnCalendar && !btnCalendar.dataset.initialized) {
        btnCalendar.dataset.initialized = 'true';
        btnCalendar.addEventListener('click', () => {
            btnCalendar.classList.add('active');
            btnStats.classList.remove('active');
            viewCalendar.classList.remove('hidden-view');
            viewStats.classList.add('hidden-view');
        });
    }

    if (btnStats && !btnStats.dataset.initialized) {
        btnStats.dataset.initialized = 'true';
        btnStats.addEventListener('click', () => {
            btnStats.classList.add('active');
            btnCalendar.classList.remove('active');
            viewStats.classList.remove('hidden-view');
            viewCalendar.classList.add('hidden-view');
            renderMoodCalendar(); 
        });
    }

    const entryBtn = document.getElementById('mood-function');
    const modal = document.getElementById('mood-modal');
    
    if (entryBtn && !entryBtn.dataset.initialized) {
        entryBtn.dataset.initialized = 'true';
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);
        
        newBtn.addEventListener('click', () => {
            if (typeof window.updateDynamicNames === 'function') window.updateDynamicNames();
            const advModal = document.getElementById('advanced-modal');
            if (advModal) hideModal(advModal); 
            setTimeout(() => {
                renderMoodCalendar();
                showModal(modal);
            }, 150); 
        });
    }

    const closeMoodBtn = document.getElementById('close-mood');
    if (closeMoodBtn && !closeMoodBtn.dataset.initialized) {
        closeMoodBtn.dataset.initialized = 'true';
        closeMoodBtn.addEventListener('click', () => hideModal(modal));
    }
    
    const cancelMoodBtn = document.getElementById('cancel-mood-edit');
    if (cancelMoodBtn && !cancelMoodBtn.dataset.initialized) {
        cancelMoodBtn.dataset.initialized = 'true';
        cancelMoodBtn.addEventListener('click', closeMoodOverlay);
    }

    const overlay = document.getElementById('mood-selector-overlay');
    if (overlay && !overlay.dataset.initialized) {
        overlay.dataset.initialized = 'true';
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeMoodOverlay();
            }
        });
    }

    const prevMonthBtn = document.getElementById('prev-month');
    if (prevMonthBtn && !prevMonthBtn.dataset.initialized) {
        prevMonthBtn.dataset.initialized = 'true';
        prevMonthBtn.addEventListener('click', () => {
            const y = currentCalendarDate.getFullYear();
            const m = currentCalendarDate.getMonth();
            currentCalendarDate = new Date(y, m - 1, 1);
            renderMoodCalendar();
        });
    }
    
    const nextMonthBtn = document.getElementById('next-month');
    if (nextMonthBtn && !nextMonthBtn.dataset.initialized) {
        nextMonthBtn.dataset.initialized = 'true';
        nextMonthBtn.addEventListener('click', () => {
            const y = currentCalendarDate.getFullYear();
            const m = currentCalendarDate.getMonth();
            currentCalendarDate = new Date(y, m + 1, 1);
            renderMoodCalendar();
        });
    }
}

let envelopeData = { outbox: [], inbox: [] }; 
let currentEnvTab = 'outbox';
let editingEnvId = null; 
let editingEnvSection = null; 

async function loadEnvelopeData() {
    const saved = await localforage.getItem(getStorageKey('envelopeData'));
    if (saved) envelopeData = saved;
    const oldPending = await localforage.getItem(getStorageKey('pending_envelope'));
    if (oldPending && envelopeData.outbox.length === 0) {
        envelopeData.outbox.push({
            id: 'legacy_' + Date.now(),
            content: '（历史寄出的信件）',
            sentTime: oldPending.sentTime,
            replyTime: oldPending.replyTime,
            status: 'pending'
        });
        await localforage.removeItem(getStorageKey('pending_envelope'));
        saveEnvelopeData();
    }
}

function saveEnvelopeData() {
    localforage.setItem(getStorageKey('envelopeData'), envelopeData);
}

async function checkEnvelopeStatus() {
    await loadEnvelopeData();
    const now = Date.now();
    let changed = false;
    let newReplyLetter = null;
    envelopeData.outbox.forEach(letter => {
        if (letter.status === 'pending' && now >= letter.replyTime) {
            letter.status = 'replied';
            const replyContent = generateEnvelopeReplyText();
            const replyId = 'reply_' + Date.now() + '_' + Math.random().toString(36).substr(2,4);
            const inboxLetter = {
                id: replyId,
                refId: letter.id,
                originalContent: letter.content,
                content: replyContent,
                receivedTime: Date.now(),
                isNew: true
            };
            envelopeData.inbox.push(inboxLetter);
            newReplyLetter = inboxLetter;
            changed = true;
            playSound('message');
        }
    });
    if (changed) {
        saveEnvelopeData();
        if (newReplyLetter) showEnvelopeReplyPopup(newReplyLetter);
    }
}

function showEnvelopeReplyPopup(letter) {
    const existing = document.getElementById('envelope-reply-popup');
    if (existing) existing.remove();
    const popup = document.createElement('div');
    popup.id = 'envelope-reply-popup';
    popup.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--secondary-bg);border:1px solid var(--border-color);border-radius:20px;padding:18px 20px;z-index:8000;max-width:320px;width:88%;box-shadow:0 8px 32px rgba(0,0,0,0.18);display:flex;flex-direction:column;gap:12px;animation:slideUpNotif 0.4s cubic-bezier(0.22,1,0.36,1);';
    popup.innerHTML = `
        <style>@keyframes slideUpNotif{from{opacity:0;transform:translateX(-50%) translateY(24px) scale(0.9)}60%{transform:translateX(-50%) translateY(-4px) scale(1.02)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}</style>
        <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-size:26px;">💌</span>
            <div>
                <div style="font-size:14px;font-weight:700;color:var(--text-primary);">收到了一封回信</div>
                <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;opacity:0.8;">Ta 给你写了回信，快去看看吧~</div>
            </div>
        </div>
        <div style="display:flex;gap:8px;">
            <button onclick="document.getElementById('envelope-reply-popup').remove();" style="flex:1;padding:8px 0;border-radius:12px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-secondary);font-size:13px;cursor:pointer;">稍后查看</button>
            <button onclick="openEnvelopeAndViewReply('${letter.id}');" style="flex:2;padding:8px 0;border-radius:12px;border:none;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">立即阅读 ✉</button>
        </div>`;
    document.body.appendChild(popup);
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 8000);
}

const APPEARANCE_PANEL_TITLES = {
    'theme': '主题配色', 'font': '字体设置', 'background': '聊天背景',
    'bubble': '气泡样式', 'avatar': '聊天头像', 'css': '自定义CSS',
    'font-bg': '背景 & 字体', 'bubble-css': '气泡 & CSS'
};
window.showAppearancePanel = function(panel) {
    const panelMap = {
        'font-bg': ['font', 'background'],
        'bubble-css': ['bubble', 'css']
    };
    document.getElementById('appearance-nav-grid').style.display = 'none';
    var unBtn = document.getElementById('update-notice-btn');
    if (unBtn) unBtn.style.display = 'none';
    var galleryBanner = document.getElementById('gallery-banner-entry');
    if (galleryBanner) galleryBanner.style.display = 'none';
    document.getElementById('appearance-panel-container').style.display = 'block';
    document.getElementById('appearance-panel-title').textContent = APPEARANCE_PANEL_TITLES[panel] || panel;
    document.querySelectorAll('.appearance-sub-panel').forEach(p => p.style.display = 'none');
    if (panelMap[panel]) {
        panelMap[panel].forEach(sub => {
            const target = document.getElementById('appearance-panel-' + sub);
            if (target) target.style.display = 'block';
        });
    } else {
        const target = document.getElementById('appearance-panel-' + panel);
        if (target) target.style.display = 'block';
    }
    if (panel === 'bubble' || panel === 'bubble-css') { setTimeout(() => { if (typeof window.updateBubblePreviewFn === 'function') window.updateBubblePreviewFn(); }, 50); }
};
window.hideAppearancePanel = function() {
    document.getElementById('appearance-nav-grid').style.display = 'grid';
    document.getElementById('appearance-panel-container').style.display = 'none';
    document.querySelectorAll('.appearance-sub-panel').forEach(p => p.style.display = 'none');
    var unBtn = document.getElementById('update-notice-btn');
    if (unBtn) unBtn.style.display = 'flex';
    var galleryBanner = document.getElementById('gallery-banner-entry');
    if (galleryBanner) galleryBanner.style.display = 'flex';
};

window.openEnvelopeAndViewReply = function(replyId) {
    const popup = document.getElementById('envelope-reply-popup');
    if (popup) popup.remove();
    const envelopeModal = document.getElementById('envelope-modal');
    showModal(envelopeModal);
    setTimeout(() => {
        switchEnvTab('inbox');
        viewEnvLetter('inbox', replyId);
    }, 200);
};

function generateEnvelopeReplyText() {
    const sourcePool = [...customReplies];
    const sentenceCount = Math.floor(Math.random() * (12 - 8 + 1)) + 8;
    let replyContent = "";
    for (let i = 0; i < sentenceCount; i++) {
        const randomSentence = sourcePool[Math.floor(Math.random() * sourcePool.length)];
        const punctuation = Math.random() < 0.2 ? "！" : (Math.random() < 0.2 ? "..." : "。");
        replyContent += randomSentence + punctuation;
    }
    return replyContent;
}


window.switchEnvTab = function(tab) {
    currentEnvTab = tab;
    document.getElementById('env-tab-outbox').classList.toggle('active', tab === 'outbox');
    document.getElementById('env-tab-inbox').classList.toggle('active', tab === 'inbox');
    document.getElementById('env-outbox-section').style.display = tab === 'outbox' ? 'block' : 'none';
    document.getElementById('env-inbox-section').style.display = tab === 'inbox' ? 'block' : 'none';
    document.getElementById('env-compose-form').style.display = 'none';
    document.getElementById('env-main-close-btn').style.display = 'flex';
    renderEnvelopeLists();
};

function renderEnvelopeLists() {
    renderOutboxList();
    renderInboxList();
    const pendingCount = envelopeData.outbox.filter(l => l.status === 'pending').length;
    const newInboxCount = envelopeData.inbox.filter(l => l.isNew).length;
    const outboxBadge = document.getElementById('env-outbox-badge');
    const inboxBadge = document.getElementById('env-inbox-badge');
    if (outboxBadge) { outboxBadge.textContent = pendingCount; outboxBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none'; }
    if (inboxBadge) { inboxBadge.textContent = newInboxCount; inboxBadge.style.display = newInboxCount > 0 ? 'inline-block' : 'none'; }
    const envelopeEntryBadge = document.getElementById('env-entry-badge');
    if (envelopeEntryBadge) { envelopeEntryBadge.style.display = newInboxCount > 0 ? 'inline-block' : 'none'; }
}

function renderOutboxList() {
    const list = document.getElementById('env-outbox-list');
    if (!list) return;
    if (envelopeData.outbox.length === 0) {
        list.innerHTML = `<div class="env-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
            <div style="font-size:14px;font-weight:500;margin-top:4px;">还没有寄出任何信件</div>
            <div style="font-size:12px;margin-top:6px;opacity:0.6;">提笔写下心意，寄送给Ta吧~</div>
        </div>`;
        return;
    }
    list.innerHTML = envelopeData.outbox.slice().reverse().map(letter => {
        const date = new Date(letter.sentTime).toLocaleDateString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'});
        const isPending = letter.status === 'pending';
        const replyTime = isPending ? new Date(letter.replyTime).toLocaleDateString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';
        const statusIcon = isPending
            ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
            : `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        const statusText = isPending ? `${statusIcon} 预计 ${replyTime} 回信` : `${statusIcon} 已收到回信`;
        const preview = letter.content.length > 38 ? letter.content.substring(0, 38) + '…' : letter.content;
        return `
        <div class="env-letter-item" onclick="viewEnvLetter('outbox','${letter.id}')">
            <div class="env-letter-header">
                <div class="env-letter-header-from">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:3px;"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                    寄出 · ${date}
                </div>
                <div class="env-stamp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
            </div>
            <div class="env-letter-body">
                <div class="env-letter-preview">${preview}</div>
                <div class="env-letter-status">${statusText}</div>
            </div>
            <button class="env-letter-delete-btn" onclick="deleteEnvLetter(event,'outbox','${letter.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`;
    }).join('');
}

function renderInboxList() {
    const list = document.getElementById('env-inbox-list');
    if (!list) return;
    if (envelopeData.inbox.length === 0) {
        list.innerHTML = `<div class="env-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/><polyline points="22 13 12 13"/><path d="M19 16l-5-3-5 3"/></svg>
            <div style="font-size:14px;font-weight:500;margin-top:4px;">还没有收到回信</div>
            <div style="font-size:12px;margin-top:6px;opacity:0.6;">对方正在认真回复中，请稍候~</div>
        </div>`;
        return;
    }
    list.innerHTML = envelopeData.inbox.slice().reverse().map(letter => {
        const date = new Date(letter.receivedTime).toLocaleDateString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'});
        const preview = letter.content.length > 50 ? letter.content.substring(0, 50) + '…' : letter.content;
        const isNew = letter.isNew;
        const origPreview = letter.originalContent ? (letter.originalContent.length > 32 ? letter.originalContent.substring(0, 32) + '…' : letter.originalContent) : '';
        return `
        <div class="env-letter-item reply ${isNew ? 'env-letter-new' : ''}" onclick="viewEnvLetter('inbox','${letter.id}')">
            <div class="env-letter-header">
                <div class="env-letter-header-from">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-1px;margin-right:3px;"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                    收到 · ${date}
                    ${isNew ? '<span style="background:rgba(255,255,255,0.3);color:#fff;font-size:9px;padding:1px 5px;border-radius:6px;margin-left:6px;">新</span>' : ''}
                </div>
                <div class="env-stamp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
            </div>
            ${origPreview ? `<div style="padding:6px 12px 0;display:flex;align-items:flex-start;gap:6px;"><div style="width:2px;border-radius:2px;background:rgba(var(--accent-color-rgb),0.4);flex-shrink:0;align-self:stretch;min-height:14px;margin-top:1px;"></div><div style="font-size:11px;color:var(--text-secondary);font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:calc(100% - 14px);opacity:0.75;">原信: ${origPreview}</div></div>` : ''}
            <div class="env-letter-body">
                <div class="env-letter-preview">${preview}</div>
            </div>
            <button class="env-letter-delete-btn" onclick="deleteEnvLetter(event,'inbox','${letter.id}')">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>`;
    }).join('');
}

window.viewEnvLetter = function(section, id) {
    const letters = section === 'outbox' ? envelopeData.outbox : envelopeData.inbox;
    const letter = letters.find(l => l.id === id);
    if (!letter) return;
    if (section === 'inbox' && letter.isNew) {
        letter.isNew = false;
        saveEnvelopeData();
        renderEnvelopeLists();
    }
    editingEnvId = id;
    editingEnvSection = section;

    document.getElementById('env-view-title').textContent = section === 'outbox' ? '寄出的信' : '收到的回信';

    const dateObj = letter.timestamp ? new Date(letter.timestamp) : new Date();
    const y = dateObj.getFullYear();
    const mo = String(dateObj.getMonth()+1).padStart(2,'0');
    const d = String(dateObj.getDate()).padStart(2,'0');
    const dateStr = `${y}/${mo}/${d}`;
    const weekdays = ['日','一','二','三','四','五','六'];
    const fullDateStr = dateStr + ' 星期' + weekdays[dateObj.getDay()];

    const stampEl = document.getElementById('env-view-stamp-date');
    if (stampEl) stampEl.textContent = `${mo}/${d}`;

    const dateLine = document.getElementById('env-view-date-line');
    if (dateLine) dateLine.textContent = fullDateStr;

    const toLine = document.getElementById('env-view-to-line');
    const greetingLine = document.getElementById('env-view-greeting-line');
    if (section === 'outbox') {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) || '亲爱的';
        if (toLine) toLine.textContent = `致 ${partnerName}：`;
        if (greetingLine) greetingLine.textContent = '见字如面，望君安好。';
    } else {
        const myName = (typeof settings !== 'undefined' && settings.myName) || '你';
        if (toLine) toLine.textContent = `致 ${myName}：`;
        if (greetingLine) greetingLine.textContent = '见字如面，一切皆好。';
    }

    const textEl = document.getElementById('env-view-text');
    if (textEl) textEl.textContent = letter.content;

    const signDateEl = document.getElementById('env-view-sign-date');
    const signNameEl = document.getElementById('env-view-sign-name');
    if (signDateEl) signDateEl.textContent = fullDateStr;
    if (section === 'outbox') {
        const myName = (typeof settings !== 'undefined' && settings.myName) || '你';
        if (signNameEl) signNameEl.textContent = myName;
    } else {
        const partnerName = (typeof settings !== 'undefined' && settings.partnerName) || '对方';
        if (signNameEl) signNameEl.textContent = partnerName;
    }

    document.getElementById('env-edit-input').value = letter.content;
    document.getElementById('env-view-content').style.display = 'block';
    document.getElementById('env-view-edit').style.display = 'none';
    document.getElementById('env-view-edit-btn').style.display = 'inline-flex';
    document.getElementById('env-view-save-btn').style.display = 'none';
    const origCtx = document.getElementById('env-view-original-ctx');
    const origText = document.getElementById('env-view-original-text');
    const origExpand = document.getElementById('env-view-original-expand');
    if (origCtx && origText) {
        if (section === 'inbox' && letter.originalContent) {
            origText.textContent = letter.originalContent;
            origText.style.maxHeight = '80px';
            origCtx.style.display = 'block';
            if (origExpand) {
                origExpand.style.display = letter.originalContent.length > 120 ? 'block' : 'none';
                origExpand.textContent = '展开查看全文';
            }
        } else {
            origCtx.style.display = 'none';
        }
    }
    showModal(document.getElementById('envelope-view-modal'));
};

window.toggleEnvEdit = function() {
    const contentEl = document.getElementById('env-view-content');
    const editEl = document.getElementById('env-view-edit');
    const editBtn = document.getElementById('env-view-edit-btn');
    const saveBtn = document.getElementById('env-view-save-btn');
    const isEditing = editEl.style.display !== 'none';
    if (isEditing) {
        contentEl.style.display = 'block';
        editEl.style.display = 'none';
        editBtn.textContent = '编辑';
        saveBtn.style.display = 'none';
    } else {
        contentEl.style.display = 'none';
        editEl.style.display = 'block';
        editBtn.textContent = '取消';
        saveBtn.style.display = 'inline-flex';
    }
};

window.saveEnvEdit = function() {
    const newContent = document.getElementById('env-edit-input').value.trim();
    if (!newContent) { showNotification('内容不能为空', 'warning'); return; }
    const letters = editingEnvSection === 'outbox' ? envelopeData.outbox : envelopeData.inbox;
    const letter = letters.find(l => l.id === editingEnvId);
    if (letter) {
        letter.content = newContent;
        saveEnvelopeData();
        const textEl = document.getElementById('env-view-text');
        if (textEl) textEl.textContent = newContent;
        showNotification('已保存修改', 'success');
        toggleEnvEdit();
    }
};

window.closeEnvViewModal = function() {
    hideModal(document.getElementById('envelope-view-modal'));
};

window.deleteEnvLetter = function(event, section, id) {
    event.stopPropagation();
    if (!confirm('确定要删除这封信吗？')) return;
    if (section === 'outbox') {
        envelopeData.outbox = envelopeData.outbox.filter(l => l.id !== id);
    } else {
        envelopeData.inbox = envelopeData.inbox.filter(l => l.id !== id);
    }
    saveEnvelopeData();
    renderEnvelopeLists();
    showNotification('已删除', 'success');
};

window.openNewEnvelopeForm = function() {
    document.getElementById('env-outbox-section').style.display = 'none';
    document.getElementById('env-inbox-section').style.display = 'none';
    document.getElementById('env-main-close-btn').style.display = 'none';
    document.getElementById('env-compose-title').textContent = '写一封信';
    document.getElementById('envelope-input').value = '';
    document.getElementById('env-send-to-chat').checked = false;
    document.getElementById('env-compose-form').style.display = 'block';
};

window.cancelEnvelopeCompose = function() {
    document.getElementById('env-compose-form').style.display = 'none';
    document.getElementById('env-main-close-btn').style.display = 'flex';
    if (currentEnvTab === 'outbox') {
        document.getElementById('env-outbox-section').style.display = 'block';
    } else {
        document.getElementById('env-inbox-section').style.display = 'block';
    }
};

function handleSendEnvelope() {
    const text = document.getElementById('envelope-input').value.trim();
    if (!text) { showNotification('信件内容不能为空', 'warning'); return; }

    const sendToChat = document.getElementById('env-send-to-chat').checked;
    if (sendToChat) {
        addMessage({ id: Date.now(), sender: 'user', text: `【寄出的信】\n${text}`, timestamp: new Date(), status: 'sent', type: 'normal' });
    }

    const minHours = 10, maxHours = 24;
    const randomHours = Math.random() * (maxHours - minHours) + minHours;
    const replyTime = Date.now() + randomHours * 60 * 60 * 1000;
    const newId = 'env_' + Date.now() + '_' + Math.random().toString(36).substr(2,4);
    envelopeData.outbox.push({
        id: newId, content: text,
        sentTime: Date.now(), replyTime,
        status: 'pending'
    });
    saveEnvelopeData();

    cancelEnvelopeCompose();
    switchEnvTab('outbox');
    showNotification(`信件已寄出，预计 ${Math.floor(randomHours)} 小时后收到回信 ✉️`, 'success');
}

if (typeof customReplyGroups === 'undefined') window.customReplyGroups = [];
if (typeof replyGroupsEnabled === 'undefined') window.replyGroupsEnabled = false;

let _batchSelectedIndices = new Set();
let _batchModeActive = false;
let _searchVisible = false;
let _searchQuery = '';
let _searchDebounceTimer = null;
let _activeGroupFilter = null; 

const GROUP_COLORS = [
    '#FF6B6B','#FF8E53','#FFC542','#51CF66',
    '#20C997','#4DABF7','#748FFC','#DA77F2',
    '#F783AC','#FF922B','#A9E34B','#38D9A9',
    '#339AF0','#5C7CFA','#CC5DE8','#F06595',
    '#868E96','#212529'
];

const ICONS = {
    reply:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H9l-3 2.5V11H3a1 1 0 01-1-1V3z" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>`,
    magic:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l.9 2.7L11.6 4l-1.8 2.2L12 8l-2.9-.1L8 10.8l-.9-2.9L4.4 8l1.8-2.2L4.4 4l2.7.7L8 2z" stroke="currentColor" stroke-width="1.2" fill="none"/><line x1="2" y1="14" x2="5" y2="11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    news:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="5" y1="9" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    folder:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5a1 1 0 011-1h3.5l1.2 1.2H13a1 1 0 011 1V12a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>`,
    search:   `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.3"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    batch:    `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2"/><rect x="8.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" opacity=".6"/><rect x="1.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" opacity=".6"/><rect x="8.5" y="8.5" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.2" opacity=".4"/></svg>`,
    plus:     `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><line x1="7.5" y1="2" x2="7.5" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="7.5" x2="13" y2="7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    close:    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    check:    `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    trash:    `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="2" y1="3" x2="11" y2="3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M4.5 3V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V3"/><path d="M3.5 3.5l.5 7h5l.5-7" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
    edit:     `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2l2.5 2.5L4 11.5H1.5V9L8.5 2z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
    eye:      `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5s2-4 5-4 5 4 5 4-2 4-5 4-5-4-5-4z" stroke="currentColor" stroke-width="1.2"/><circle cx="6.5" cy="6.5" r="1.5" fill="currentColor"/></svg>`,
    eyeOff:   `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="2" y1="2" x2="11" y2="11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><path d="M4.5 3.5C5.1 3.2 5.7 3 6.5 3c3 0 5 3.5 5 3.5s-.5 1-1.5 2M2 5s-.5.8-.5 1.5c0 .6.2 1.1.5 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    tag:      `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 1.5h5l5 5-5 5-5-5v-5z" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="4" cy="4" r="1" fill="currentColor"/></svg>`,
    filter:   `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><line x1="2" y1="4" x2="13" y2="4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="4" y1="7.5" x2="11" y2="7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="6" y1="11" x2="9" y2="11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    dedup:    `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M4.5 7h6M7 10h1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    import:   `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 9.5V2M4 6.5l3.5 3L11 6.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="2" y1="12.5" x2="13" y2="12.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    export:   `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 5V12M4 7.5l3.5-3L11 7.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="2" y1="2.5" x2="13" y2="2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    chevronD: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    chevronR: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    comment:  `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3.5A1.5 1.5 0 013.5 2h11A1.5 1.5 0 0116 3.5v8A1.5 1.5 0 0114.5 13H10l-3 3v-3H3.5A1.5 1.5 0 012 11.5v-8z" stroke="currentColor" stroke-width="1.3"/></svg>`,
    hand:     `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v8M6 5v5M3 8v3a6 6 0 0012 0V6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    dot:      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" fill="currentColor"/><circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.3"/></svg>`,
    quote:    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6.5C3 5.4 3.9 4.5 5 4.5h2v5H5A2 2 0 013 7.5V6.5zM10 6.5c0-1.1.9-2 2-2h2v5h-2a2 2 0 01-2-2V6.5z" fill="currentColor" opacity=".7"/></svg>`,
    play:     `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.3"/><path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="currentColor"/></svg>`,
    smile:    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.3"/><circle cx="6.5" cy="7.5" r="1" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1" fill="currentColor"/><path d="M6 11.5s1 2 3 2 3-2 3-2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    sticker:  `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" stroke-width="1.3"/><circle cx="6.5" cy="7" r="1.2" fill="currentColor"/><circle cx="11.5" cy="7" r="1.2" fill="currentColor"/><path d="M6 11s1 2.5 3 2.5S12 11 12 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    folderBig:`<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 5a1 1 0 011-1h4l1.5 1.5H15a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke="currentColor" stroke-width="1.3"/></svg>`,
    palette:  `<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a6 6 0 100 12 2.5 2.5 0 010-5 2.5 2.5 0 000-7z" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="7.5" cy="3.5" r="1" fill="currentColor"/><circle cx="11" cy="6" r="1" fill="currentColor"/></svg>`,
};


// ─── 共享样式：只注入一次，避免每张卡片各塞一个 <style> ───────────────────
(function _injectReplyLibStyles() {
    if (document.getElementById('rl-shared-styles')) return;
    const s = document.createElement('style');
    s.id = 'rl-shared-styles';
    s.textContent = `
        .rl-card {
            display:flex;align-items:flex-start;gap:0;padding:11px 13px;
            border-radius:12px;border:1.5px solid var(--border-color);
            background:var(--secondary-bg);margin-bottom:7px;
            transition:all 0.18s;position:relative;overflow:hidden;
        }
        .rl-card:hover { border-color:var(--accent-color);transform:translateY(-1px);box-shadow:0 3px 12px rgba(0,0,0,0.08); }
        .rl-card.rl-selected { border-color:var(--accent-color);background:rgba(var(--accent-color-rgb,180,140,100),0.08); }
        .rl-card-actions {
            display:flex;gap:3px;margin-left:auto;flex-shrink:0;padding-left:8px;
            opacity:0;transition:opacity 0.18s;align-items:center;
        }
        .rl-card:hover .rl-card-actions { opacity:1; }
        @media (hover:none) { .rl-card-actions { opacity:1; } }
        .rl-act-btn {
            width:28px;height:28px;border-radius:8px;border:none;
            background:transparent;color:var(--text-secondary);cursor:pointer;
            display:flex;align-items:center;justify-content:center;transition:all 0.15s;
            flex-shrink:0;
        }
        .rl-act-btn:hover { border-color:var(--accent-color);color:var(--accent-color); }
        .rl-act-btn.danger:hover { border-color:#ef4444;color:#ef4444; }
        .rl-act-btn.active { background:var(--accent-color);border-color:var(--accent-color);color:#fff; }
        .rl-group-block { margin-bottom:12px; }
        .rl-group-header {
            display:flex;align-items:center;gap:9px;padding:9px 14px;
            border-radius:12px 12px 0 0;
            background:var(--secondary-bg);cursor:pointer;user-select:none;
            transition:background 0.2s;
        }
        .rl-group-header.collapsed { border-radius:12px; }
        .rl-group-header:hover { background:rgba(var(--accent-color-rgb,180,140,100),0.06); }
        .rl-group-body { border:1px solid var(--border-color);border-top:none;border-radius:0 0 12px 12px;padding:6px 8px 8px;background:var(--primary-bg); }
        .rl-group-tag {
            display:inline-flex;align-items:center;gap:5px;
            padding:2px 9px 2px 6px;border-radius:20px;
            cursor:pointer;transition:all 0.15s;
        }
        .rl-batch-check {
            width:18px;height:18px;border-radius:5px;flex-shrink:0;margin-top:1px;
            display:flex;align-items:center;justify-content:center;transition:all 0.15s;
        }
    `;
    (document.head || document.documentElement).appendChild(s);
})();

// 批量添加图片链接的对话框
function _showBatchAddStickerByUrlDialog() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
    
    overlay.innerHTML = `
        <div style="
            background:var(--secondary-bg);border-radius:20px;padding:24px;
            width:92%;max-width:480px;max-height:85vh;
            display:flex;flex-direction:column;
            box-shadow:0 20px 60px rgba(0,0,0,0.4);
            animation:modalContentSlideIn 0.3s ease forwards;
        ">
            <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-shrink:0;">
                <i class="fas fa-link" style="color:var(--accent-color);"></i>
                <span>批量添加表情</span>
            </div>
            
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;flex-shrink:0;">
                <i class="fas fa-info-circle"></i> 每行一个图片链接，支持 jpg/png/gif/webp
            </div>
            
            <textarea id="batch-url-input" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png&#10;https://example.com/image3.gif" style="
                width:100%;height:180px;padding:14px;border:1.5px solid var(--border-color);
                border-radius:12px;background:var(--primary-bg);color:var(--text-primary);
                font-size:13px;font-family:monospace;outline:none;resize:vertical;
                box-sizing:border-box;transition:border-color 0.2s;line-height:1.6;
                flex-shrink:0;
            "></textarea>
            
            <div style="
                display:flex;align-items:center;justify-content:space-between;
                margin:12px 0;flex-shrink:0;
            ">
                <span style="font-size:12px;color:var(--text-secondary);">
                    已解析 <span id="valid-url-count" style="color:var(--accent-color);font-weight:600;">0</span> 个有效链接
                </span>
                <button id="parse-urls-btn" style="
                    padding:6px 14px;border:1.5px solid var(--border-color);border-radius:8px;
                    background:var(--primary-bg);color:var(--text-secondary);font-size:12px;
                    cursor:pointer;font-family:var(--font-family);transition:all 0.2s;
                ">
                    <i class="fas fa-sync-alt"></i> 解析链接
                </button>
            </div>
            
            <div id="url-preview-grid" style="
                display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));
                gap:8px;max-height:200px;overflow-y:auto;padding:8px 2px;
                border-top:1px solid var(--border-color);margin-top:4px;
            "></div>
            
            <div style="
                display:flex;gap:10px;margin-top:16px;flex-shrink:0;
            ">
                <button id="batch-url-cancel" style="
                    flex:1;padding:12px;border:1.5px solid var(--border-color);border-radius:12px;
                    background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;
                    font-family:var(--font-family);
                ">取消</button>
                <button id="batch-url-confirm" style="
                    flex:2;padding:12px;border:none;border-radius:12px;
                    background:var(--accent-color);color:#fff;font-size:14px;font-weight:600;
                    cursor:pointer;font-family:var(--font-family);display:flex;
                    align-items:center;justify-content:center;gap:6px;
                " disabled>
                    <i class="fas fa-plus"></i> 批量添加 (<span id="add-count-display">0</span>)
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const urlInput = overlay.querySelector('#batch-url-input');
    const previewGrid = overlay.querySelector('#url-preview-grid');
    const validCountSpan = overlay.querySelector('#valid-url-count');
    const addCountSpan = overlay.querySelector('#add-count-display');
    const confirmBtn = overlay.querySelector('#batch-url-confirm');
    const cancelBtn = overlay.querySelector('#batch-url-cancel');
    const parseBtn = overlay.querySelector('#parse-urls-btn');
    
    let validUrls = [];
    let previewItems = new Map(); // 存储预览项的选中状态
    
    // 关闭对话框
    const closeDialog = () => overlay.remove();
    cancelBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
    
    // 修改 parseUrls 函数，让它能识别更多类型的图片链接
function parseUrls(text) {
    const lines = text.split('\n');
    const urls = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // 匹配URL（支持从文本中提取）
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/i);
        if (!urlMatch) return;
        
        let url = urlMatch[1];
        
        // 清理URL末尾可能的标点符号
        url = url.replace(/[.,;!?）】」』"']+$/, '');
        
        // 更宽松的图片链接判断：
        // 1. 常见图片扩展名
        // 2. 常见图床域名
        // 3. 包含 image/photo/pic/img 等关键词的路径
        // 4. 或者直接通过图片加载测试（在预览时再验证）
        const isImageUrl = 
            /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico)(\?.*)?$/i.test(url) || // 常见扩展名
            /(imgur|postimg|catbox|mufy|cdn|image|photo|pic|img|upload|static|assets)/i.test(url); // 常见图床/图片路径关键词
        
        if (isImageUrl && !urls.includes(url)) {
            urls.push(url);
        }
    });
    
    return urls;
}
    
    // 更新预览网格
    function updatePreview(urls) {
        previewGrid.innerHTML = '';
        previewItems.clear();
        
        if (urls.length === 0) {
            previewGrid.innerHTML = `
                <div style="
                    grid-column:1/-1;text-align:center;padding:30px 0;
                    color:var(--text-secondary);font-size:12px;opacity:0.6;
                ">
                    <i class="fas fa-image" style="font-size:24px;margin-bottom:8px;display:block;"></i>
                    暂无有效图片链接
                </div>
            `;
            return;
        }
        
        urls.forEach((url, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                position:relative;aspect-ratio:1/1;border-radius:8px;
                border:2px solid var(--border-color);overflow:hidden;
                cursor:pointer;background:var(--primary-bg);
                transition:all 0.2s;
            `;
            item.dataset.url = url;
            item.dataset.index = index;
            
            const img = document.createElement('img');
            img.src = url;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
            img.alt = 'preview';
            
            // 选中标记
            const checkMark = document.createElement('div');
            checkMark.style.cssText = `
                position:absolute;top:4px;right:4px;
                width:20px;height:20px;border-radius:50%;
                background:var(--accent-color);color:#fff;
                display:flex;align-items:center;justify-content:center;
                font-size:12px;opacity:0;transition:opacity 0.2s;
            `;
            checkMark.innerHTML = '✓';
            
            item.appendChild(img);
            item.appendChild(checkMark);
            
            // 默认选中
            previewItems.set(url, true);
            item.style.borderColor = 'var(--accent-color)';
            checkMark.style.opacity = '1';
            
            // 点击切换选中状态
            item.addEventListener('click', () => {
                const isSelected = previewItems.get(url) || false;
                previewItems.set(url, !isSelected);
                item.style.borderColor = !isSelected ? 'var(--accent-color)' : 'var(--border-color)';
                checkMark.style.opacity = !isSelected ? '1' : '0';
                updateConfirmButton();
            });
            
            // 图片加载失败处理
            img.onerror = () => {
                item.style.borderColor = '#ff4757';
                img.style.display = 'none';
                item.innerHTML = `
                    <div style="
                        display:flex;flex-direction:column;align-items:center;
                        justify-content:center;height:100%;color:#ff4757;
                        font-size:10px;text-align:center;padding:4px;
                    ">
                        <i class="fas fa-exclamation-triangle" style="font-size:16px;margin-bottom:2px;"></i>
                        加载失败
                    </div>
                    <div style="
                        position:absolute;top:4px;right:4px;
                        width:20px;height:20px;border-radius:50%;
                        background:#ff4757;color:#fff;
                        display:flex;align-items:center;justify-content:center;
                        font-size:12px;
                    ">✕</div>
                `;
                previewItems.set(url, false);
                updateConfirmButton();
            };
            
            previewGrid.appendChild(item);
        });
    }
    
    // 更新确认按钮状态
    function updateConfirmButton() {
        const selectedCount = Array.from(previewItems.values()).filter(v => v).length;
        confirmBtn.disabled = selectedCount === 0;
        addCountSpan.textContent = selectedCount;
    }
    
    // 解析并预览
    function parseAndPreview() {
        const text = urlInput.value;
        validUrls = parseUrls(text);
        validCountSpan.textContent = validUrls.length;
        updatePreview(validUrls);
        updateConfirmButton();
    }
    
    // 输入时自动解析（防抖）
    let parseTimer;
    urlInput.addEventListener('input', () => {
        clearTimeout(parseTimer);
        parseTimer = setTimeout(parseAndPreview, 500);
    });
    
    // 手动解析按钮
    parseBtn.addEventListener('click', parseAndPreview);
    
    // 支持粘贴事件
    urlInput.addEventListener('paste', () => {
        setTimeout(parseAndPreview, 100);
    });
    
    // 确认添加
    confirmBtn.addEventListener('click', () => {
        const selectedUrls = validUrls.filter(url => previewItems.get(url) === true);
        
        if (selectedUrls.length === 0) {
            showNotification('请至少选择一个表情', 'warning');
            return;
        }
        
        // 根据当前标签页决定添加到哪个库
        if (currentMajorTab === 'reply' && currentSubTab === 'stickers') {
            // 去重：过滤掉已存在的URL
            const newUrls = selectedUrls.filter(url => !stickerLibrary.includes(url));
            const duplicateCount = selectedUrls.length - newUrls.length;
            
            if (newUrls.length === 0) {
                showNotification('所有链接都已存在于表情库中', 'info');
                return;
            }
            
            stickerLibrary.push(...newUrls);
            throttledSaveData();
            renderReplyLibrary();
            
            let msg = `✓ 已添加 ${newUrls.length} 个表情到对方表情库`;
            if (duplicateCount > 0) {
                msg += `，跳过 ${duplicateCount} 个重复`;
            }
            showNotification(msg, 'success');
        }
        
        closeDialog();
    });
    
    // 自动聚焦
    setTimeout(() => urlInput.focus(), 100);
}

// 在 _renderModernToolbar 函数中，修改工具栏部分，添加批量链接按钮
// 找到这段代码：
/*
        <div style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-bottom:1px solid var(--border-color);">
            <button class="toolbar-icon-btn ${_searchVisible ? 'active' : ''}" id="tb-search-btn" title="搜索">
                ${ICONS.search}
            </button>
            ${currentSubTab === 'stickers' ? `
            <button class="toolbar-icon-btn" id="tb-url-add-btn" title="通过链接添加">
                <i class="fas fa-link"></i>
            </button>
            ` : ''}
*/

// 修改为（将单个链接改为批量链接）：
/*
        <div style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-bottom:1px solid var(--border-color);">
            <button class="toolbar-icon-btn ${_searchVisible ? 'active' : ''}" id="tb-search-btn" title="搜索">
                ${ICONS.search}
            </button>
            
*/

// 然后在事件绑定部分添加：
/*
    // 批量链接添加按钮
    
*/

function _renderListContentOnly() {
    const list = document.getElementById('custom-replies-list');
    if (!list) return;

    const toolbar = document.getElementById('batch-ops-toolbar');
    Array.from(list.children).forEach(child => {
        if (child !== toolbar) child.remove();
    });

    let itemsToRender = [];
    let renderType = 'text';

    if (currentMajorTab === 'reply') {
        if (currentSubTab === 'custom') {
            itemsToRender = customReplies;
        } else if (currentSubTab === 'emojis') {
            itemsToRender = CONSTANTS.REPLY_EMOJIS;
            renderType = 'emoji';
        } else if (currentSubTab === 'stickers') {
            itemsToRender = stickerLibrary;
            renderType = 'image';
        }
    } else if (currentMajorTab === 'atmosphere') {
        if (currentSubTab === 'pokes') itemsToRender = customPokes;
        else if (currentSubTab === 'statuses') itemsToRender = customStatuses;
        else if (currentSubTab === 'mottos') itemsToRender = customMottos;
        else if (currentSubTab === 'intros') itemsToRender = customIntros;
    }

    if (renderType === 'emoji') { _renderEmojiTab(list, itemsToRender); return; }
    if (renderType === 'image') { _renderStickerTab(list, itemsToRender); return; }

    const q = _searchQuery.toLowerCase().trim();
    const filtered = q ? itemsToRender.filter(item => item.toLowerCase().includes(q)) : itemsToRender;

    if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.innerHTML = renderEmptyState(q ? `未找到 "${q}"` : '列表空空如也');
        list.appendChild(empty.firstElementChild || empty);
        return;
    }

    if (currentMajorTab === 'reply' && currentSubTab === 'custom') {
        _renderCardViewWithGroups(list, filtered);
    } else {
        _renderAtmosphereList(list, filtered);
    }
}

let _rlRafId = null;
/** 防抖版 renderReplyLibrary：同一帧内多次调用只渲染一次 */
function renderReplyLibraryRaf() {
    if (_rlRafId) return;
    _rlRafId = requestAnimationFrame(() => {
        _rlRafId = null;
        renderReplyLibrary();
    });
}

function renderReplyLibrary() {
    const list = document.getElementById('custom-replies-list');
    const titleEl = document.getElementById('cr-modal-title');
    if (!list) return;

    const currentConfig = LIBRARY_CONFIG[currentMajorTab];
    if (titleEl) titleEl.textContent = currentConfig.title;

    const subTabsContainer = document.getElementById('cr-sub-tabs');
    if (subTabsContainer) {
        subTabsContainer.innerHTML = currentConfig.tabs.map(tab => `
            <button class="reply-tab-btn ${currentSubTab === tab.id ? 'active' : ''}"
                    data-id="${tab.id}" data-mode="${tab.mode}">
                ${tab.name}
            </button>
        `).join('');
        subTabsContainer.querySelectorAll('.reply-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentSubTab = btn.dataset.id;
                _batchModeActive = false;
                _batchSelectedIndices.clear();
                _activeGroupFilter = null;
                _searchVisible = false;
                _searchQuery = '';
                renderReplyLibrary();
            });
        });
    }

    list.innerHTML = '';
    list.className = 'content-list-area';

    const activeTabConfig = currentConfig.tabs.find(t => t.id === currentSubTab);
    if (activeTabConfig) list.classList.add(activeTabConfig.mode + '-mode');

    _renderModernToolbar();

    let itemsToRender = [];
    let renderType = 'text';

    if (currentMajorTab === 'reply') {
        if (currentSubTab === 'custom') {
            itemsToRender = customReplies;
        } else if (currentSubTab === 'emojis') {
            itemsToRender = CONSTANTS.REPLY_EMOJIS;
            renderType = 'emoji';
        } else if (currentSubTab === 'stickers') {
            itemsToRender = stickerLibrary;
            renderType = 'image';
        }
    } else if (currentMajorTab === 'atmosphere') {
        if (currentSubTab === 'pokes') itemsToRender = customPokes;
        else if (currentSubTab === 'statuses') itemsToRender = customStatuses;
        else if (currentSubTab === 'mottos') itemsToRender = customMottos;
        else if (currentSubTab === 'intros') itemsToRender = customIntros;
    }

    if (renderType === 'emoji') { _renderEmojiTab(list, itemsToRender); return; }
    if (renderType === 'image') { _renderStickerTab(list, itemsToRender); return; }

    const q = _searchQuery.toLowerCase().trim();
    let filtered = q ? itemsToRender.filter(item => item.toLowerCase().includes(q)) : itemsToRender;

    if (filtered.length === 0) {
        list.innerHTML = renderEmptyState(q ? `未找到"${q}"` : '列表空空如也');
        return;
    }

    if (currentMajorTab === 'reply' && currentSubTab === 'custom') {
        _renderCardViewWithGroups(list, filtered);
    } else {
        _renderAtmosphereList(list, filtered);
    }
}

function _renderModernToolbar() {
    let toolbar = document.getElementById('batch-ops-toolbar');
    const isMainCustom = currentMajorTab === 'reply' && currentSubTab === 'custom';

    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.id = 'batch-ops-toolbar';
        const listEl = document.getElementById('custom-replies-list');
        listEl.parentNode.insertBefore(toolbar, listEl);
    }
    toolbar.style.display = '';

    const disabledSet = _getDisabledItemsSet();
    const totalItems = currentMajorTab === 'reply' && currentSubTab === 'custom' ? customReplies.length : 0;
    const selectedCount = _batchSelectedIndices.size;

    const addBtnLabel = (() => {
        if (!isMainCustom) return '新增';
        return '新增字卡';
    })();

    let groupFilterHtml = '';
    if (isMainCustom && customReplyGroups && customReplyGroups.length > 0) {
        const allCount = customReplies.length;
        const ungroupedCount = customReplies.filter(item =>
            !customReplyGroups.some(g => g.items && g.items.includes(item))
        ).length;
        groupFilterHtml = `
            <div id="group-filter-pills" style="
                display:flex;gap:6px;overflow-x:auto;padding:8px 15px 0;
                scrollbar-width:none;-webkit-overflow-scrolling:touch;flex-shrink:0;
            ">
                <button class="gfp-btn ${_activeGroupFilter === null ? 'gfp-active' : ''}" data-filter="all">
                    全部 <span class="gfp-count">${allCount}</span>
                </button>
                <button class="gfp-btn ${_activeGroupFilter === 'ungrouped' ? 'gfp-active' : ''}" data-filter="ungrouped">
                    未分组 <span class="gfp-count">${ungroupedCount}</span>
                </button>
                ${customReplyGroups.map(g => {
                    const cnt = (g.items || []).filter(item => customReplies.includes(item)).length;
                    return `<button class="gfp-btn ${_activeGroupFilter === g.id ? 'gfp-active' : ''} ${g.disabled ? 'gfp-disabled' : ''}"
                        data-filter="${g.id}"
                        style="${_activeGroupFilter === g.id ? `background:${g.color}22;border-color:${g.color};color:${g.color};` : ''}">
                        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${g.color || '#aaa'};margin-right:4px;flex-shrink:0;vertical-align:middle;"></span>
                        ${g.name} <span class="gfp-count">${cnt}</span>
                        ${g.disabled ? `<span style="font-size:9px;opacity:0.7;margin-left:2px;">${ICONS.eyeOff}</span>` : ''}
                    </button>`;
                }).join('')}
            </div>
        `;
    }

    let batchActionsHtml = '';
    if (_batchModeActive) {
        batchActionsHtml = `
            <div id="batch-action-bar" style="
                display:flex;align-items:center;gap:6px;padding:8px 15px;
                background:rgba(var(--accent-color-rgb,180,140,100),0.06);
                border-bottom:1px solid rgba(var(--accent-color-rgb,180,140,100),0.15);
                flex-wrap:wrap;
            ">
                <button id="batch-select-all-btn" style="
                    padding:5px 12px;border-radius:20px;border:1.5px solid var(--accent-color);
                    background:transparent;color:var(--accent-color);font-size:12px;
                    cursor:pointer;font-family:var(--font-family);font-weight:600;
                    display:flex;align-items:center;gap:5px;
                ">
                    ${ICONS.check}
                    ${selectedCount === totalItems ? '取消全选' : `全选 (${totalItems})`}
                </button>
                <span style="font-size:12px;color:var(--text-secondary);flex:1;min-width:60px;">
                    ${selectedCount > 0 ? `已选 <strong style="color:var(--text-primary);">${selectedCount}</strong> 条` : '点击字卡以选择'}
                </span>
                <button id="batch-group-btn" class="batch-act-pill ${selectedCount === 0 ? 'batch-act-disabled' : ''}" data-tip="分配分组">
                    ${ICONS.tag} 分组
                </button>
                <button id="batch-disable-btn" class="batch-act-pill ${selectedCount === 0 ? 'batch-act-disabled' : ''}" data-tip="屏蔽/启用">
                    ${ICONS.eyeOff} 屏蔽
                </button>
                <button id="batch-delete-btn" class="batch-act-pill batch-act-danger ${selectedCount === 0 ? 'batch-act-disabled' : ''}" data-tip="删除">
                    ${ICONS.trash} 删除
                </button>
            </div>
        `;
    }

    toolbar.innerHTML = `
        <style>
            .gfp-btn {
                display:inline-flex;align-items:center;white-space:nowrap;
                padding:5px 12px;border-radius:20px;border:1.5px solid var(--border-color);
                background:var(--primary-bg);color:var(--text-secondary);
                font-size:12px;cursor:pointer;font-family:var(--font-family);
                transition:all 0.18s;flex-shrink:0;gap:2px;
            }
            .gfp-btn:hover { border-color:var(--accent-color);color:var(--accent-color); }
            .gfp-btn.gfp-active { background:var(--accent-color);border-color:var(--accent-color);color:#fff; }
            .gfp-btn.gfp-disabled { opacity:0.55; }
            .gfp-count { font-size:10px;opacity:0.7;margin-left:2px; }
            .toolbar-icon-btn {
                width:34px;height:34px;border-radius:10px;border:1.5px solid var(--border-color);
                background:var(--primary-bg);color:var(--text-secondary);cursor:pointer;
                display:flex;align-items:center;justify-content:center;transition:all 0.18s;
                flex-shrink:0;
            }
            .toolbar-icon-btn:hover { border-color:var(--accent-color);color:var(--accent-color); }
            .toolbar-icon-btn.active { background:var(--accent-color);border-color:var(--accent-color);color:#fff; }
            .batch-act-pill {
                display:inline-flex;align-items:center;gap:4px;
                padding:5px 11px;border-radius:20px;border:1.5px solid var(--border-color);
                background:var(--primary-bg);color:var(--text-primary);
                font-size:12px;cursor:pointer;font-family:var(--font-family);transition:all 0.18s;
            }
            .batch-act-pill:hover { border-color:var(--accent-color);color:var(--accent-color); }
            .batch-act-danger { border-color:rgba(239,68,68,.3);color:#ef4444; }
            .batch-act-danger:hover { background:rgba(239,68,68,.08); }
            .batch-act-disabled { opacity:0.4;pointer-events:none; }
            .search-input-line {
                display:flex;align-items:center;gap:8px;padding:8px 15px;
                border-bottom:1px solid var(--border-color);animation:slideDown 0.18s ease;
            }
            @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
            .search-input-line input {
                flex:1;padding:7px 12px;border:1.5px solid var(--border-color);
                border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);
                font-size:13px;font-family:var(--font-family);outline:none;transition:border 0.18s;
            }
            .search-input-line input:focus { border-color:var(--accent-color); }
            .group-filter-pills::-webkit-scrollbar { display:none; }
        </style>

        <div style="display:flex;align-items:center;gap:8px;padding:10px 15px;border-bottom:1px solid var(--border-color);">
            <button class="toolbar-icon-btn ${_searchVisible ? 'active' : ''}" id="tb-search-btn" title="搜索">
                ${ICONS.search}
            </button>
${currentSubTab === 'stickers' ? `
            <button class="toolbar-icon-btn" id="tb-batch-url-add-btn" title="批量通过链接添加">
                <i class="fas fa-link"></i>
                <span style="font-size:9px;margin-left:2px;">+</span>
            </button>
            ` : ''}
            ${isMainCustom ? `
            <button class="toolbar-icon-btn" id="tb-groups-btn" title="分组管理">
                ${ICONS.folder}
            </button>` : ''}
            <button class="toolbar-icon-btn" id="tb-dedup-btn" title="一键去重">
                ${ICONS.dedup}
            </button>
            <div style="flex:1;"></div>
            ${isMainCustom ? `
            <button class="toolbar-icon-btn ${_batchModeActive ? 'active' : ''}" id="tb-batch-btn" title="${_batchModeActive ? '退出批量' : '批量管理'}">
                ${ICONS.batch}
            </button>` : ''}
            <button class="toolbar-icon-btn" id="tb-import-btn" title="导入">
                ${ICONS.import}
            </button>
            <button class="toolbar-icon-btn" id="tb-export-btn" title="导出">
                ${ICONS.export}
            </button>
        </div>

        ${_searchVisible ? `
        <div class="search-input-line">
            <div style="color:var(--text-secondary);">${ICONS.search}</div>
            <input type="text" id="rl-search-input" value="${_searchQuery}" placeholder="搜索内容…" autocomplete="off">
            <button class="toolbar-icon-btn" id="tb-search-clear" title="清除" style="width:28px;height:28px;">
                ${ICONS.close}
            </button>
        </div>` : ''}

        ${groupFilterHtml}

        ${batchActionsHtml}
    `;

    toolbar.querySelector('#tb-search-btn').onclick = () => {
        _searchVisible = !_searchVisible;
        if (!_searchVisible) _searchQuery = '';
        renderReplyLibrary();
        if (_searchVisible) setTimeout(() => document.getElementById('rl-search-input')?.focus(), 50);
    };
    if (_searchVisible) {
        const si = toolbar.querySelector('#rl-search-input');
        if (si) {
            si.oninput = (e) => {
                const val = e.target.value;
                clearTimeout(_searchDebounceTimer);
                _searchDebounceTimer = setTimeout(() => {
                    _searchQuery = val;
                    _renderListContentOnly();
                }, 300);
            };
            si.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(_searchDebounceTimer);
                    _searchQuery = e.target.value;
                    _renderListContentOnly();
                } else if (e.key === 'Escape') {
                    clearTimeout(_searchDebounceTimer);
                    _searchVisible = false;
                    _searchQuery = '';
                    renderReplyLibrary();
                }
            };
        }
        toolbar.querySelector('#tb-search-clear').onclick = () => { _searchVisible = false; _searchQuery = ''; renderReplyLibrary(); };
    }

    if (isMainCustom) {
        toolbar.querySelector('#tb-groups-btn')?.addEventListener('click', _showGroupManager);
        const tbBatch = toolbar.querySelector('#tb-batch-btn');
        if (tbBatch) tbBatch.onclick = () => {
            _batchModeActive = !_batchModeActive;
            _batchSelectedIndices.clear();
            renderReplyLibrary();
        };
    }

    toolbar.querySelector('#tb-dedup-btn')?.addEventListener('click', _runDedup);
    toolbar.querySelector('#tb-import-btn')?.addEventListener('click', () => document.getElementById('import-replies-input')?.click());
    toolbar.querySelector('#tb-export-btn')?.addEventListener('click', _showExportUI);

    toolbar.querySelectorAll('.gfp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            _activeGroupFilter = f === 'all' ? null : (f === 'ungrouped' ? 'ungrouped' : parseInt(f));
            renderReplyLibrary();
        });
    });

    if (_batchModeActive) {
        toolbar.querySelector('#batch-select-all-btn')?.addEventListener('click', () => {
            if (_batchSelectedIndices.size === totalItems) _batchSelectedIndices.clear();
            else customReplies.forEach((_, i) => _batchSelectedIndices.add(i));
            renderReplyLibrary();
        });
        toolbar.querySelector('#batch-group-btn')?.addEventListener('click', () => {
            if (_batchSelectedIndices.size === 0) return;
            _showBatchGroupPicker();
        });
        toolbar.querySelector('#batch-disable-btn')?.addEventListener('click', () => {
            if (_batchSelectedIndices.size === 0) return;
            _batchToggleDisable();
        });
        toolbar.querySelector('#batch-delete-btn')?.addEventListener('click', () => {
            if (_batchSelectedIndices.size === 0) return;
            if (!confirm(`确定删除选中的 ${_batchSelectedIndices.size} 条？`)) return;
            const indices = [..._batchSelectedIndices].sort((a, b) => b - a);
            const deletedTexts = indices.map(i => customReplies[i]);
            indices.forEach(i => customReplies.splice(i, 1));
            if (customReplyGroups) {
                customReplyGroups.forEach(g => {
                    if (g.items) g.items = g.items.filter(t => !deletedTexts.includes(t));
                });
            }
            _batchSelectedIndices.clear();
            throttledSaveData();
            renderReplyLibrary();
            showNotification(`已删除 ${indices.length} 条`, 'success');
        });
    }
const batchUrlAddBtn = toolbar.querySelector('#tb-batch-url-add-btn');
    if (batchUrlAddBtn) {
        batchUrlAddBtn.addEventListener('click', () => {
            _showBatchAddStickerByUrlDialog();
        });
    }
}

function _renderCardViewWithGroups(list, items) {
    const disabledSet = _getDisabledItemsSet();
    // 预建索引 Map，避免 indexOf 的 O(n²) 查找
    const replyIndexMap = new Map();
    customReplies.forEach((r, i) => { if (!replyIndexMap.has(r)) replyIndexMap.set(r, i); });
    const itemsWithIdx = items.map(text => ({
        text,
        idx: replyIndexMap.has(text) ? replyIndexMap.get(text) : -1
    }));

    if (_activeGroupFilter === null) {
        if (!customReplyGroups || customReplyGroups.length === 0) {
            _renderCardList(list, itemsWithIdx, disabledSet);
            return;
        }

        const inGroup = new Set();
        customReplyGroups.forEach(g => {
            const groupItems = (g.items || [])
                .map(t => ({ text: t, idx: customReplies.indexOf(t) }))
                .filter(x => x.idx >= 0 && items.includes(x.text));
            groupItems.forEach(x => inGroup.add(x.idx));
            _renderGroupBlock(list, g, groupItems, disabledSet);
        });

        const ungrouped = itemsWithIdx.filter(x => !inGroup.has(x.idx));
        if (ungrouped.length > 0) {
            _renderGroupBlock(list, { id: '__ungrouped', name: '未分组', color: '#868E96', disabled: false }, ungrouped, disabledSet, true);
        }
    } else if (_activeGroupFilter === 'ungrouped') {
        const inGroup = new Set();
        if (customReplyGroups) customReplyGroups.forEach(g => (g.items || []).forEach(t => {
            const i = customReplies.indexOf(t);
            if (i >= 0) inGroup.add(i);
        }));
        const ungrouped = itemsWithIdx.filter(x => !inGroup.has(x.idx));
        if (ungrouped.length === 0) {
            list.innerHTML = renderEmptyState('所有字卡均已分组');
        } else {
            _renderCardList(list, ungrouped, disabledSet);
        }
    } else {
        const g = customReplyGroups.find(g => g.id === _activeGroupFilter);
        if (!g) { list.innerHTML = renderEmptyState('分组不存在'); return; }
        const filtered = itemsWithIdx.filter(x => (g.items || []).includes(x.text));
        if (filtered.length === 0) {
            list.innerHTML = renderEmptyState('此分组暂无内容');
        } else {
            _renderCardList(list, filtered, disabledSet);
        }
    }
}

function _renderGroupBlock(list, group, groupItems, disabledSet, isUngrouped = false) {
    const section = document.createElement('div');
    section.className = 'rl-group-block';
    const isCollapsed = group._collapsed || false;
    const isDisabled = group.disabled;
    const colorDot = group.color || '#868E96';

    section.innerHTML = `
        <div class="rl-group-header${isCollapsed ? ' collapsed' : ''}" id="grp-hdr-${group.id}" style="${isDisabled ? 'opacity:0.5;' : ''}">
            <div class="rl-group-tag" id="grp-tag-${group.id}" title="${isDisabled ? '点击启用此分组' : '点击屏蔽此分组'}">
                <span style="width:8px;height:8px;border-radius:50%;background:${colorDot};flex-shrink:0;"></span>
                <span style="font-size:12px;font-weight:700;color:${colorDot};">${group.name}</span>
                ${isDisabled ? `<span title="已屏蔽" style="color:${colorDot};">${ICONS.eyeOff}</span>` : ''}
            </div>
            <span style="font-size:11px;color:var(--text-secondary);">${groupItems.length} 条</span>
            ${_batchModeActive && groupItems.length > 0 ? (() => {
                const allSel = groupItems.every(x => _batchSelectedIndices.has(x.idx));
                const someSel = !allSel && groupItems.some(x => _batchSelectedIndices.has(x.idx));
                return `<button class="grp-select-all-btn" data-gid="${group.id}" title="${allSel ? '取消本组全选' : '全选本组'}" style="
                    margin-left:auto;flex-shrink:0;padding:3px 9px;border-radius:20px;cursor:pointer;
                    font-size:11px;font-weight:700;font-family:var(--font-family);
                    transition:all 0.15s;
                    border:1.5px solid ${allSel ? 'var(--accent-color)' : someSel ? colorDot : 'var(--border-color)'};
                    background:${allSel ? 'var(--accent-color)' : someSel ? colorDot + '22' : 'var(--primary-bg)'};
                    color:${allSel ? '#fff' : someSel ? colorDot : 'var(--text-secondary)'};
                ">${allSel ? '✓ 全选' : someSel ? `已选${groupItems.filter(x=>_batchSelectedIndices.has(x.idx)).length}` : '全选'}</button>`;
            })() : `<div style="flex:1;"></div>`}
            ${!isUngrouped ? `
            <button class="grp-edit-btn" title="编辑分组" style="
                ${_batchModeActive ? '' : 'margin-left:auto;'}width:26px;height:26px;border-radius:8px;border:1px solid var(--border-color);
                background:var(--primary-bg);color:var(--text-secondary);cursor:pointer;
                display:flex;align-items:center;justify-content:center;flex-shrink:0;
            ">${ICONS.edit}</button>` : ''}
            <div class="grp-chevron" style="color:var(--text-secondary);transition:transform 0.2s;transform:${isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};">
                ${ICONS.chevronD}
            </div>
        </div>
        <div class="rl-group-body" id="grp-body-${group.id}" style="display:${isCollapsed ? 'none' : 'block'};">
        </div>
    `;
    list.appendChild(section);

    const body = section.querySelector(`#grp-body-${group.id}`);
    if (groupItems.length === 0) {
        body.innerHTML = `<div style="padding:18px;text-align:center;font-size:12px;color:var(--text-secondary);opacity:0.6;">此分组暂无内容</div>`;
    } else {
        _renderCardList(body, groupItems, disabledSet);
    }

    section.querySelector('.grp-select-all-btn')?.addEventListener('click', e => {
        e.stopPropagation();
        const allSel = groupItems.every(x => _batchSelectedIndices.has(x.idx));
        if (allSel) {
            groupItems.forEach(x => _batchSelectedIndices.delete(x.idx));
        } else {
            groupItems.forEach(x => _batchSelectedIndices.add(x.idx));
        }
        renderReplyLibrary();
    });

    section.querySelector(`#grp-hdr-${group.id}`).addEventListener('click', e => {
        if (e.target.closest('.grp-edit-btn') || e.target.closest(`#grp-tag-${group.id}`) || e.target.closest('.grp-select-all-btn')) return;
        group._collapsed = !group._collapsed;
        body.style.display = group._collapsed ? 'none' : 'block';
        section.querySelector('.grp-chevron').style.transform = group._collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
        section.querySelector('.rl-group-header').classList.toggle('collapsed', !!group._collapsed);
    });

    const tag = section.querySelector(`#grp-tag-${group.id}`);
    if (tag && !isUngrouped) {
        tag.addEventListener('click', e => {
            e.stopPropagation();
            group.disabled = !group.disabled;
            throttledSaveData();
            renderReplyLibrary();
            showNotification(group.disabled ? `已屏蔽「${group.name}」` : `已启用「${group.name}」`, 'success');
        });
    }

    section.querySelector('.grp-edit-btn')?.addEventListener('click', e => {
        e.stopPropagation();
        _showGroupEditor(group);
    });
}

const _CARD_PAGE_SIZE = 80; // 每次最多渲染 80 张，超过时追加"显示更多"

function _renderCardList(container, itemsWithIdx, disabledSet) {
    const total = itemsWithIdx.length;
    const toRender = itemsWithIdx.slice(0, _CARD_PAGE_SIZE);
    const remaining = total - toRender.length;

    const frag = document.createDocumentFragment();
    toRender.forEach(({ text, idx }) => {
        frag.appendChild(_createCard(text, idx, disabledSet));
    });

    if (remaining > 0) {
        const btn = document.createElement('button');
        btn.style.cssText = 'width:100%;padding:10px;margin-top:4px;border:1.5px dashed var(--border-color);border-radius:12px;background:transparent;color:var(--text-secondary);font-size:12px;cursor:pointer;font-family:var(--font-family);';
        btn.textContent = `显示剩余 ${remaining} 条`;
        btn.onclick = () => {
            btn.remove();
            const moreFrag = document.createDocumentFragment();
            itemsWithIdx.slice(_CARD_PAGE_SIZE).forEach(({ text, idx }) => {
                moreFrag.appendChild(_createCard(text, idx, disabledSet));
            });
            container.appendChild(moreFrag);
        };
        frag.appendChild(btn);
    }

    container.appendChild(frag);
}

function _createCard(item, index, disabledSet) {
    const div = document.createElement('div');
    div.className = 'rl-card';
    const isDisabled = disabledSet && disabledSet.has(item);
    const isSelected = _batchSelectedIndices.has(index);

    const groupBadge = (() => {
        if (!customReplyGroups) return '';
        const g = customReplyGroups.find(grp => grp.items && grp.items.includes(item));
        if (!g) return '';
        return `<span style="
            display:inline-flex;align-items:center;gap:3px;
            padding:1px 7px 1px 4px;border-radius:10px;font-size:10px;
            background:${g.color}18;color:${g.color};border:1px solid ${g.color}30;
            margin-top:5px;flex-shrink:0;
        ">
            <span style="width:5px;height:5px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
            ${g.name}
        </span>`;
    })();

    const itemParts = item.split('|');
    const displayText = itemParts.length > 1
        ? `<span style="font-size:13px;">${itemParts[0]}</span><span style="font-size:11px;opacity:0.6;display:block;margin-top:1px;">${itemParts[1]}</span>`
        : `<span style="font-size:13px;">${item}</span>`;

    if (_batchModeActive) {
        div.style.cssText = 'cursor:pointer;';
        div.className = 'rl-card' + (isSelected ? ' rl-selected' : '');
        div.innerHTML = `
            <div class="rl-batch-check" style="
                border:1.5px solid ${isSelected ? 'var(--accent-color)' : 'var(--border-color)'};
                background:${isSelected ? 'var(--accent-color)' : 'transparent'};
            ">
                ${isSelected ? `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>` : ''}
            </div>
            <div style="flex:1;min-width:0;${isDisabled ? 'opacity:0.4;' : ''}">
                ${displayText}
                ${groupBadge}
            </div>
        `;
        div.addEventListener('click', () => {
            if (_batchSelectedIndices.has(index)) _batchSelectedIndices.delete(index);
            else _batchSelectedIndices.add(index);
            renderReplyLibrary();
        });
        return div;
    }

    div.innerHTML = `
        <div style="flex:1;min-width:0;${isDisabled ? 'opacity:0.4;text-decoration:line-through;' : ''}">
            ${displayText}
            ${groupBadge}
        </div>
        <div class="rl-card-actions">
            <button class="rl-act-btn ${isDisabled ? 'active' : ''}" data-action="disable" title="${isDisabled ? '启用' : '屏蔽'}">
                ${isDisabled ? ICONS.eye : ICONS.eyeOff}
            </button>
            <button class="rl-act-btn" data-action="tag" title="分组">
                ${ICONS.tag}
            </button>
            <button class="rl-act-btn" data-action="edit" title="编辑">
                ${ICONS.edit}
            </button>
            <button class="rl-act-btn danger" data-action="delete" title="删除">
                ${ICONS.trash}
            </button>
        </div>
    `;

    div.querySelector('[data-action="delete"]').onclick = (e) => { e.stopPropagation(); deleteItem(index); };
    div.querySelector('[data-action="edit"]').onclick = (e) => { e.stopPropagation(); editItem(index, item); };
    div.querySelector('[data-action="disable"]').onclick = (e) => { e.stopPropagation(); _toggleItemDisable(item); };
    div.querySelector('[data-action="tag"]').onclick = (e) => { e.stopPropagation(); _showSingleItemGroupPicker(item); };

    return div;
}

function _renderAtmosphereList(list, items) {
    const disabledSet = _getDisabledItemsSet();
    // 预建各数组的索引 Map，避免 O(n²)
    const indexMaps = {
        pokes:    new Map(customPokes.map((r,i)   => [r, i])),
        statuses: new Map(customStatuses.map((r,i) => [r, i])),
        mottos:   new Map(customMottos.map((r,i)   => [r, i])),
        intros:   new Map(customIntros.map((r,i)   => [r, i])),
    };
    const frag = document.createDocumentFragment();
    items.forEach((item, idx) => {
        const realIdx = (indexMaps[currentSubTab] || { get: () => idx }).get(item) ?? idx;
        const div = document.createElement('div');
        div.className = 'custom-reply-item';
        div.innerHTML = `
            <span class="custom-reply-text">${item.replace('|','<br><small style="opacity:.65">')}</span>
            <div class="custom-reply-actions">
                <button class="reply-action-mini edit-btn" title="编辑">${ICONS.edit}</button>
                <button class="reply-action-mini delete-btn" title="删除">${ICONS.trash}</button>
            </div>
        `;
        div.querySelector('.delete-btn').onclick = () => deleteItem(realIdx);
        div.querySelector('.edit-btn').onclick = () => editItem(realIdx, item);
        frag.appendChild(div);
    });
    list.appendChild(frag);
}

function _renderEmojiTab(list, itemsToRender) {
    if (itemsToRender.length === 0 && customEmojis.length === 0) {
        list.innerHTML = renderEmptyState('暂无 Emoji'); return;
    }
    itemsToRender.forEach(item => {
        const div = document.createElement('div');
        div.className = 'emoji-item';
        div.textContent = item;
        list.appendChild(div);
    });
    if (customEmojis.length > 0) {
        const sep = document.createElement('div');
        sep.style.cssText = 'grid-column:1/-1;font-size:11px;color:var(--text-secondary);padding:4px 2px 2px;border-top:1px dashed var(--border-color);margin-top:4px;';
        sep.textContent = '— 自定义 —';
        list.appendChild(sep);
        customEmojis.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'emoji-item';
            div.style.position = 'relative';
            div.innerHTML = `<span style="pointer-events:none;">${item}</span><span class="emoji-custom-del" style="position:absolute;top:-4px;right:-4px;font-size:10px;background:var(--text-secondary);color:#fff;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.2s;">×</span>`;
            div.addEventListener('mouseenter', () => div.querySelector('.emoji-custom-del').style.opacity = '1');
            div.addEventListener('mouseleave', () => div.querySelector('.emoji-custom-del').style.opacity = '0');
            div.querySelector('.emoji-custom-del').addEventListener('click', e => {
                e.stopPropagation();
                customEmojis.splice(idx, 1);
                throttledSaveData();
                renderReplyLibrary();
            });
            list.appendChild(div);
        });
    }
}

function _renderStickerTab(list, itemsToRender) {
    itemsToRender.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'sticker-item';
        div.innerHTML = `<img src="${item}" loading="lazy"><div class="sticker-delete-btn"><i class="fas fa-times"></i></div>`;
        div.querySelector('.sticker-delete-btn').addEventListener('click', e => {
            e.stopPropagation();
            if (confirm('删除此表情？')) {
                stickerLibrary.splice(index, 1);
                throttledSaveData();
                renderReplyLibrary();
            }
        });
        list.appendChild(div);
    });
}
function _getDisabledItemsSet() {
    try {
        const raw = localStorage.getItem('disabledReplyItems');
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

function _saveDisabledItemsSet(set) {
    localStorage.setItem('disabledReplyItems', JSON.stringify([...set]));
}

function _toggleItemDisable(itemText) {
    const set = _getDisabledItemsSet();
    if (set.has(itemText)) { set.delete(itemText); showNotification('已启用', 'success'); }
    else { set.add(itemText); showNotification('已屏蔽（不会出现在随机回复中）', 'info'); }
    _saveDisabledItemsSet(set);
    renderReplyLibrary();
}

function _batchToggleDisable() {
    const set = _getDisabledItemsSet();
    const selectedItems = [..._batchSelectedIndices].map(i => customReplies[i]);
    const allDisabled = selectedItems.every(item => set.has(item));
    if (allDisabled) {
        selectedItems.forEach(item => set.delete(item));
        showNotification(`已启用 ${selectedItems.length} 条`, 'success');
    } else {
        selectedItems.forEach(item => set.add(item));
        showNotification(`已屏蔽 ${selectedItems.length} 条`, 'info');
    }
    _saveDisabledItemsSet(set);
    _batchSelectedIndices.clear();
    renderReplyLibrary();
}

function _runDedup() {
    let totalRemoved = 0;
    const crDedup = deduplicateContentArray(customReplies, CONSTANTS.REPLY_MESSAGES);
    customReplies = crDedup.result; totalRemoved += crDedup.removedCount;
    const cpDedup = deduplicateContentArray(customPokes);
    customPokes = cpDedup.result; totalRemoved += cpDedup.removedCount;
    const csDedup = deduplicateContentArray(customStatuses);
    customStatuses = csDedup.result; totalRemoved += csDedup.removedCount;
    const cmDedup = deduplicateContentArray(customMottos);
    customMottos = cmDedup.result; totalRemoved += cmDedup.removedCount;
    const ciDedup = deduplicateContentArray(customIntros);
    customIntros = ciDedup.result; totalRemoved += ciDedup.removedCount;
    const preEmoji = customEmojis.length;
    customEmojis = [...new Set(customEmojis)];
    totalRemoved += (preEmoji - customEmojis.length);
    if (totalRemoved > 0) {
        throttledSaveData(); renderReplyLibrary();
        showNotification(`🧹 共清理了 ${totalRemoved} 条重复内容`, 'success');
    } else {
        showNotification('✨ 没有重复内容', 'info');
    }
}

function _showGroupManager() {
    const overlay = _makeOverlay();

    const render = () => {
        const noGroups = !customReplyGroups || customReplyGroups.length === 0;
        panel.querySelector('#gm-list').innerHTML = noGroups
            ? `<div style="text-align:center;padding:32px 0;color:var(--text-secondary);font-size:13px;opacity:0.7;">
                    还没有分组<br><span style="font-size:11px;">点击下方按钮创建第一个分组</span>
               </div>`
            : customReplyGroups.map((g, i) => `
                <div style="
                    display:flex;align-items:center;gap:10px;padding:12px 14px;
                    border-radius:13px;border:1.5px solid var(--border-color);
                    background:var(--primary-bg);${g.disabled ? 'opacity:0.55;' : ''}
                    transition:all 0.15s;
                ">
                    <span style="width:12px;height:12px;border-radius:50%;background:${g.color||'#868E96'};flex-shrink:0;box-shadow:0 0 0 2px ${g.color||'#868E96'}30;"></span>
                    <span style="flex:1;font-size:13px;color:var(--text-primary);font-weight:600;">${g.name}</span>
                    <span style="font-size:11px;color:var(--text-secondary);">${(g.items||[]).filter(t=>customReplies.includes(t)).length} 条</span>
                    <button data-action="toggle" data-i="${i}" style="
                        width:28px;height:28px;border-radius:8px;border:1px solid var(--border-color);
                        background:${g.disabled ? 'var(--accent-color)' : 'transparent'};
                        color:${g.disabled ? '#fff' : 'var(--text-secondary)'};
                        cursor:pointer;display:flex;align-items:center;justify-content:center;
                    " title="${g.disabled ? '启用' : '屏蔽'}">${g.disabled ? ICONS.eye : ICONS.eyeOff}</button>
                    <button data-action="edit" data-i="${i}" style="
                        width:28px;height:28px;border-radius:8px;border:1px solid var(--border-color);
                        background:transparent;color:var(--text-secondary);cursor:pointer;
                        display:flex;align-items:center;justify-content:center;
                    " title="编辑">${ICONS.edit}</button>
                    <button data-action="del" data-i="${i}" style="
                        width:28px;height:28px;border-radius:8px;border:1px solid rgba(239,68,68,.25);
                        background:transparent;color:#ef4444;cursor:pointer;
                        display:flex;align-items:center;justify-content:center;
                    " title="删除">${ICONS.trash}</button>
                </div>
            `).join('');

        panel.querySelectorAll('[data-action]').forEach(btn => {
            btn.onclick = () => {
                const i = parseInt(btn.dataset.i);
                const action = btn.dataset.action;
                if (action === 'toggle') {
                    customReplyGroups[i].disabled = !customReplyGroups[i].disabled;
                    throttledSaveData(); render(); renderReplyLibrary();
                } else if (action === 'edit') {
                    overlay.remove();
                    _showGroupEditor(customReplyGroups[i]);
                } else if (action === 'del') {
                    if (confirm(`删除分组「${customReplyGroups[i].name}」？（字卡不会被删除）`)) {
                        customReplyGroups.splice(i, 1);
                        throttledSaveData(); render(); renderReplyLibrary();
                    }
                }
            };
        });
    };

    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:24px;
        width:92%;max-width:400px;max-height:85vh;
        display:flex;flex-direction:column;gap:14px;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;
    panel.innerHTML = `
        <style>
            @keyframes popIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        </style>
        <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="font-size:16px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:8px;">
                ${ICONS.folder} 分组管理
            </div>
            <button id="gm-close" style="width:30px;height:30px;border-radius:50%;border:none;background:var(--primary-bg);color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;">${ICONS.close}</button>
        </div>
        <div id="gm-list" style="display:flex;flex-direction:column;gap:8px;overflow-y:auto;max-height:55vh;"></div>
        <button id="gm-add" style="
            width:100%;padding:12px;border:1.5px dashed var(--accent-color);border-radius:13px;
            background:transparent;color:var(--accent-color);font-size:13px;cursor:pointer;
            font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:7px;
            transition:background 0.15s;
        " onmouseover="this.style.background='rgba(var(--accent-color-rgb),0.06)'" onmouseout="this.style.background='transparent'">
            ${ICONS.plus} 新建分组
        </button>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    render();

    panel.querySelector('#gm-close').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    panel.querySelector('#gm-add').onclick = () => { overlay.remove(); _showGroupEditor(null); };
}

function _showGroupEditor(group) {
    const isNew = !group;
    const overlay = _makeOverlay();
    const initColor = group?.color || GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)];
    let selectedColor = initColor;

    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:24px;
        width:92%;max-width:380px;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;
    panel.innerHTML = `
        <style>@keyframes popIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }</style>
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:18px;">
            ${isNew ? '新建分组' : '编辑分组'}
        </div>

        <div style="margin-bottom:16px;">
            <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:7px;letter-spacing:.5px;">LABEL</label>
            <input id="ge-name" value="${group?.name || ''}" placeholder="分组名称…" style="
                width:100%;box-sizing:border-box;padding:11px 14px;
                border:1.5px solid var(--border-color);border-radius:12px;
                background:var(--primary-bg);color:var(--text-primary);
                font-size:14px;font-family:var(--font-family);outline:none;transition:border 0.18s;
            ">
        </div>

        <div style="margin-bottom:12px;">
            <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:8px;letter-spacing:.5px;">COLOR PRESET</label>
            <div id="ge-presets" style="display:flex;gap:7px;flex-wrap:wrap;">
                ${GROUP_COLORS.map(c => `
                    <div data-preset="${c}" style="
                        width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;
                        border:2.5px solid ${c === selectedColor ? '#fff' : 'transparent'};
                        box-shadow:${c === selectedColor ? `0 0 0 2.5px ${c}` : 'none'};
                        transition:all 0.15s;flex-shrink:0;
                    "></div>
                `).join('')}
            </div>
        </div>

        <div style="margin-bottom:20px;">
            <label style="font-size:12px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:8px;letter-spacing:.5px;">CUSTOM COLOR</label>
            <div style="display:flex;gap:10px;align-items:center;">
                <input type="color" id="ge-colorpicker" value="${selectedColor}" style="
                    width:40px;height:40px;border:none;border-radius:10px;cursor:pointer;
                    padding:2px;background:var(--primary-bg);flex-shrink:0;
                ">
                <input type="text" id="ge-hexinput" value="${selectedColor}" maxlength="7" placeholder="#RRGGBB" style="
                    flex:1;padding:10px 12px;border:1.5px solid var(--border-color);
                    border-radius:10px;background:var(--primary-bg);color:var(--text-primary);
                    font-size:13px;font-family:monospace;outline:none;transition:border 0.18s;
                ">
                <div id="ge-color-preview" style="
                    display:flex;align-items:center;gap:6px;padding:7px 12px;
                    border-radius:20px;border:1.5px solid ${selectedColor}40;
                    background:${selectedColor}18;
                ">
                    <span style="width:8px;height:8px;border-radius:50%;background:${selectedColor};"></span>
                    <span id="ge-preview-name" style="font-size:12px;font-weight:700;color:${selectedColor};">${group?.name || '预览'}</span>
                </div>
            </div>
        </div>

        <div style="display:flex;gap:10px;">
            <button id="ge-cancel" style="
                flex:1;padding:12px;border:1.5px solid var(--border-color);border-radius:13px;
                background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);
            ">取消</button>
            <button id="ge-save" style="
                flex:2;padding:12px;border:none;border-radius:13px;
                background:var(--accent-color);color:#fff;font-size:14px;font-weight:700;
                cursor:pointer;font-family:var(--font-family);transition:opacity 0.15s;
            ">保存</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const updateColor = (color) => {
        selectedColor = color;
        panel.querySelector('#ge-colorpicker').value = color;
        panel.querySelector('#ge-hexinput').value = color;
        const preview = panel.querySelector('#ge-color-preview');
        const previewName = panel.querySelector('#ge-preview-name');
        preview.style.borderColor = color + '40';
        preview.style.background = color + '18';
        previewName.style.color = color;
        const nameInput = panel.querySelector('#ge-name');
        previewName.textContent = nameInput.value || '预览';
        panel.querySelectorAll('[data-preset]').forEach(dot => {
            const isSelected = dot.dataset.preset === color;
            dot.style.border = `2.5px solid ${isSelected ? '#fff' : 'transparent'}`;
            dot.style.boxShadow = isSelected ? `0 0 0 2.5px ${dot.dataset.preset}` : 'none';
        });
    };

    panel.querySelector('#ge-name').addEventListener('input', e => {
        panel.querySelector('#ge-preview-name').textContent = e.target.value || '预览';
    });
    panel.querySelector('#ge-name').addEventListener('focus', e => { e.target.style.borderColor = 'var(--accent-color)'; });
    panel.querySelector('#ge-name').addEventListener('blur', e => { e.target.style.borderColor = 'var(--border-color)'; });

    panel.querySelectorAll('[data-preset]').forEach(dot => {
        dot.onclick = () => updateColor(dot.dataset.preset);
    });

    panel.querySelector('#ge-colorpicker').addEventListener('input', e => updateColor(e.target.value));
    panel.querySelector('#ge-hexinput').addEventListener('input', e => {
        const v = e.target.value.trim();
        if (/^#[0-9A-Fa-f]{6}$/.test(v)) updateColor(v);
    });
    panel.querySelector('#ge-hexinput').addEventListener('focus', e => { e.target.style.borderColor = 'var(--accent-color)'; });
    panel.querySelector('#ge-hexinput').addEventListener('blur', e => { e.target.style.borderColor = 'var(--border-color)'; });

    panel.querySelector('#ge-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    panel.querySelector('#ge-save').onclick = () => {
        const name = panel.querySelector('#ge-name').value.trim();
        if (!name) { showNotification('请输入分组名称', 'warning'); return; }
        if (isNew) {
            if (!window.customReplyGroups) window.customReplyGroups = [];
            customReplyGroups.push({ id: Date.now(), name, color: selectedColor, disabled: false, items: [] });
        } else {
            group.name = name;
            group.color = selectedColor;
        }
        throttledSaveData();
        overlay.remove();
        renderReplyLibrary();
        showNotification(isNew ? '✓ 分组已创建' : '✓ 分组已更新', 'success');
    };
}

function _showSingleItemGroupPicker(itemText) {
    if (!customReplyGroups || customReplyGroups.length === 0) {
        if (confirm('还没有分组，是否立即创建？')) _showGroupEditor(null);
        return;
    }
    const overlay = _makeOverlay();
    const currentGroup = customReplyGroups.find(g => g.items && g.items.includes(itemText));

    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:22px;
        width:92%;max-width:340px;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;
    panel.innerHTML = `
        <style>@keyframes popIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }</style>
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:14px;">选择分组</div>
        <div style="display:flex;flex-direction:column;gap:7px;max-height:55vh;overflow-y:auto;margin-bottom:14px;">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:11px;border:1.5px solid ${!currentGroup ? 'var(--accent-color)' : 'var(--border-color)'};background:${!currentGroup ? 'rgba(var(--accent-color-rgb),0.06)' : 'var(--primary-bg)'};">
                <input type="radio" name="sgp" value="" ${!currentGroup ? 'checked' : ''} style="accent-color:var(--accent-color);">
                <span style="font-size:13px;color:var(--text-secondary);">不分组</span>
            </label>
            ${customReplyGroups.map((g, i) => `
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:11px;border:1.5px solid ${currentGroup?.id === g.id ? g.color : 'var(--border-color)'};background:${currentGroup?.id === g.id ? g.color + '10' : 'var(--primary-bg)'};">
                    <input type="radio" name="sgp" value="${i}" ${currentGroup?.id === g.id ? 'checked' : ''} style="accent-color:${g.color};">
                    <span style="width:9px;height:9px;border-radius:50%;background:${g.color||'#aaa'};flex-shrink:0;"></span>
                    <span style="flex:1;font-size:13px;color:var(--text-primary);font-weight:600;">${g.name}</span>
                    <span style="font-size:11px;color:var(--text-secondary);">${(g.items||[]).length} 条</span>
                </label>
            `).join('')}
        </div>
        <div style="display:flex;gap:10px;">
            <button id="sgp-cancel" style="flex:1;padding:11px;border:1.5px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
            <button id="sgp-save" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-family);">确认</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    panel.querySelector('#sgp-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    panel.querySelector('#sgp-save').onclick = () => {
        const checked = panel.querySelector('input[name="sgp"]:checked');
        if (!checked) return;
        customReplyGroups.forEach(g => { if (g.items) g.items = g.items.filter(t => t !== itemText); });
        if (checked.value !== '') {
            const idx = parseInt(checked.value);
            if (!customReplyGroups[idx].items) customReplyGroups[idx].items = [];
            customReplyGroups[idx].items.push(itemText);
        }
        throttledSaveData();
        overlay.remove();
        renderReplyLibrary();
        showNotification('✓ 分组已更新', 'success');
    };
}

function _showBatchGroupPicker() {
    if (!customReplyGroups || customReplyGroups.length === 0) {
        if (confirm('还没有分组，是否立即创建？')) { _showGroupEditor(null); return; }
        return;
    }
    const selectedItems = [..._batchSelectedIndices].map(i => customReplies[i]);
    const overlay = _makeOverlay();

    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:22px;
        width:92%;max-width:340px;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;
    panel.innerHTML = `
        <style>@keyframes popIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }</style>
        <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">批量分组</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:14px;">将 <strong style="color:var(--text-primary);">${selectedItems.length}</strong> 条字卡移入分组</div>
        <div style="display:flex;flex-direction:column;gap:7px;max-height:50vh;overflow-y:auto;margin-bottom:14px;">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:11px;border:1.5px solid var(--border-color);background:var(--primary-bg);">
                <input type="radio" name="bgp" value="" checked style="accent-color:var(--accent-color);">
                <span style="font-size:13px;color:var(--text-secondary);">移出所有分组</span>
            </label>
            ${customReplyGroups.map((g, i) => `
                <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border-radius:11px;border:1.5px solid var(--border-color);background:var(--primary-bg);">
                    <input type="radio" name="bgp" value="${i}" style="accent-color:${g.color};">
                    <span style="width:9px;height:9px;border-radius:50%;background:${g.color||'#aaa'};flex-shrink:0;"></span>
                    <span style="flex:1;font-size:13px;color:var(--text-primary);font-weight:600;">${g.name}</span>
                    <span style="font-size:11px;color:var(--text-secondary);">${(g.items||[]).length} 条</span>
                </label>
            `).join('')}
        </div>
        <div style="display:flex;gap:10px;">
            <button id="bgp-cancel" style="flex:1;padding:11px;border:1.5px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
            <button id="bgp-save" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-family);">确认</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    panel.querySelector('#bgp-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    panel.querySelector('#bgp-save').onclick = () => {
        const checked = panel.querySelector('input[name="bgp"]:checked');
        if (!checked) return;
        customReplyGroups.forEach(g => { if (g.items) g.items = g.items.filter(t => !selectedItems.includes(t)); });
        if (checked.value !== '') {
            const idx = parseInt(checked.value);
            if (!customReplyGroups[idx].items) customReplyGroups[idx].items = [];
            selectedItems.forEach(item => {
                if (!customReplyGroups[idx].items.includes(item)) customReplyGroups[idx].items.push(item);
            });
        }
        throttledSaveData();
        _batchSelectedIndices.clear();
        overlay.remove();
        renderReplyLibrary();
        showNotification(`✓ 已为 ${selectedItems.length} 条字卡分组`, 'success');
    };
}

function deleteItem(index) {
    if (!confirm('确定删除吗？')) return;
    const item = (currentMajorTab === 'reply' && currentSubTab === 'custom') ? customReplies[index] : null;
    if (currentMajorTab === 'reply' && currentSubTab === 'custom') customReplies.splice(index, 1);
    else if (currentSubTab === 'pokes') customPokes.splice(index, 1);
    else if (currentSubTab === 'statuses') customStatuses.splice(index, 1);
    else if (currentSubTab === 'mottos') customMottos.splice(index, 1);
    else if (currentSubTab === 'intros') customIntros.splice(index, 1);
    if (item && customReplyGroups) {
        customReplyGroups.forEach(g => { if (g.items) g.items = g.items.filter(t => t !== item); });
    }
    throttledSaveData();
    renderReplyLibrary();
}

function editItem(index, oldText) {
    let newText;
    if (currentSubTab === 'intros') {
        const parts = oldText.split('|');
        const l1 = prompt('修改主标题:', parts[0]);
        if (l1 === null) return;
        const l2 = prompt('修改副标题:', parts[1] || '');
        if (l2 === null) return;
        newText = `${l1}|${l2}`;
    } else {
        newText = prompt('修改内容:', oldText);
    }
    if (newText === null || newText.trim() === '') return;
    if (customReplyGroups && currentMajorTab === 'reply' && currentSubTab === 'custom') {
        customReplyGroups.forEach(g => {
            if (g.items) { const i = g.items.indexOf(oldText); if (i >= 0) g.items[i] = newText.trim(); }
        });
    }
    if (currentMajorTab === 'reply' && currentSubTab === 'custom') customReplies[index] = newText.trim();
    else if (currentSubTab === 'pokes') customPokes[index] = newText.trim();
    else if (currentSubTab === 'statuses') customStatuses[index] = newText.trim();
    else if (currentSubTab === 'mottos') customMottos[index] = newText.trim();
    else if (currentSubTab === 'intros') customIntros[index] = newText.trim();
    throttledSaveData();
    renderReplyLibrary();
}

function renderEmptyState(text) {
    return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 0;color:var(--text-secondary);opacity:0.6;grid-column:1/-1;">
        <div style="width:56px;height:56px;background:var(--secondary-bg);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;box-shadow:var(--shadow);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M16.5 16.5L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
        <p style="font-size:14px;font-weight:500;text-align:center;line-height:1.6;">${text}</p>
    </div>`;
}

function _showExportUI() {
    const modules = [
        { id: '_re_replies',  icon: ICONS.comment,   label: '主字卡',    count: customReplies.length,          key: 'customReplies' },
        { id: '_re_pokes',    icon: ICONS.hand,      label: '拍一拍',    count: customPokes.length,            key: 'customPokes' },
        { id: '_re_statuses', icon: ICONS.dot,       label: '对方状态',  count: customStatuses.length,         key: 'customStatuses' },
        { id: '_re_mottos',   icon: ICONS.quote,     label: '顶部格言',  count: customMottos.length,           key: 'customMottos' },
        { id: '_re_intros',   icon: ICONS.play,      label: '开场动画',  count: customIntros.length,           key: 'customIntros' },
        { id: '_re_emojis',   icon: ICONS.smile,     label: 'Emoji 库',  count: customEmojis.length,           key: 'customEmojis' },
        { id: '_re_groups',   icon: ICONS.folderBig, label: '字卡分组',  count: (customReplyGroups||[]).length, key: 'customReplyGroups', extra: true },
    ];

    if (customReplyGroups && customReplyGroups.length > 0) {
        const overlay = _makeOverlay();
        const panel = document.createElement('div');
        panel.style.cssText = `
            background:var(--secondary-bg);border-radius:22px;padding:24px;
            width:92%;max-width:380px;
            box-shadow:0 24px 80px rgba(0,0,0,.45);
            animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
        `;
        panel.innerHTML = `
            <style>@keyframes popIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}</style>
            <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:6px;display:flex;align-items:center;gap:8px;">
                ${ICONS.export} 导出方式
            </div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:18px;">请选择导出模式</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <button id="_exp_all_btn" style="
                    display:flex;align-items:center;gap:12px;padding:14px 16px;
                    border:1.5px solid var(--border-color);border-radius:14px;
                    background:var(--primary-bg);cursor:pointer;text-align:left;transition:border-color 0.15s;
                ">
                    <div style="width:38px;height:38px;border-radius:10px;background:rgba(var(--accent-color-rgb),0.12);display:flex;align-items:center;justify-content:center;color:var(--accent-color);flex-shrink:0;">${ICONS.export}</div>
                    <div>
                        <div style="font-size:13px;font-weight:600;color:var(--text-primary);">全量导出</div>
                        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">自由选择要导出的模块</div>
                    </div>
                </button>
                <button id="_exp_group_btn" style="
                    display:flex;align-items:center;gap:12px;padding:14px 16px;
                    border:1.5px solid var(--border-color);border-radius:14px;
                    background:var(--primary-bg);cursor:pointer;text-align:left;transition:border-color 0.15s;
                ">
                    <div style="width:38px;height:38px;border-radius:10px;background:rgba(var(--accent-color-rgb),0.12);display:flex;align-items:center;justify-content:center;color:var(--accent-color);flex-shrink:0;">${ICONS.folderBig}</div>
                    <div>
                        <div style="font-size:13px;font-weight:600;color:var(--text-primary);">按分组导出</div>
                        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">仅导出指定分组的字卡内容</div>
                    </div>
                </button>
            </div>
            <button id="_exp_cancel_btn" style="
                width:100%;margin-top:14px;padding:12px;border:1.5px solid var(--border-color);
                border-radius:13px;background:none;color:var(--text-secondary);
                font-size:13px;cursor:pointer;font-family:var(--font-family);
            ">取消</button>
        `;
        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        panel.querySelector('#_exp_cancel_btn').onclick = () => overlay.remove();
        overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

        panel.querySelector('#_exp_all_btn').onclick = () => {
            overlay.remove();
            _showIOSheet('导出字卡', '选择要导出的模块', modules, ICONS.export, (selected) => {
                if (!selected.length) { showNotification('请至少选择一项', 'error'); return; }
                _doExport(selected);
            });
        };

        panel.querySelector('#_exp_group_btn').onclick = () => {
            overlay.remove();
            _showGroupExportPicker();
        };
        return;
    }

    _showIOSheet('导出字卡', '选择要导出的模块', modules, ICONS.export, (selected) => {
        if (!selected.length) { showNotification('请至少选择一项', 'error'); return; }
        _doExport(selected);
    });
}

function _doExport(selectedModules) {
    const libraryData = { exportDate: new Date().toISOString(), modules: [] };
    selectedModules.forEach(m => {
        if (m.key === 'customReplies')       { libraryData.customReplies = customReplies; libraryData.modules.push('replies'); }
        else if (m.key === 'customPokes')    { libraryData.customPokes = customPokes; libraryData.modules.push('pokes'); }
        else if (m.key === 'customStatuses') { libraryData.customStatuses = customStatuses; libraryData.modules.push('statuses'); }
        else if (m.key === 'customMottos')   { libraryData.customMottos = customMottos; libraryData.modules.push('mottos'); }
        else if (m.key === 'customIntros')   { libraryData.customIntros = customIntros; libraryData.modules.push('intros'); }
        else if (m.key === 'customEmojis')   { libraryData.customEmojis = customEmojis; libraryData.modules.push('emojis'); }
        else if (m.key === 'customReplyGroups') { libraryData.customReplyGroups = customReplyGroups; libraryData.modules.push('groups'); }
    });
    const fileName = `reply-library-${libraryData.modules.join('+')}-${new Date().toISOString().slice(0,10)}.json`;
    exportDataToMobileOrPC(JSON.stringify(libraryData, null, 2), fileName);
    showNotification('✓ 字卡导出成功', 'success');
}

function _showGroupExportPicker() {
    const overlay = _makeOverlay();
    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:24px;
        width:92%;max-width:380px;max-height:85vh;
        display:flex;flex-direction:column;gap:14px;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;
    panel.innerHTML = `
        <style>@keyframes popIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}</style>
        <div style="font-size:16px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:8px;">
            ${ICONS.folderBig} 选择分组导出
        </div>
        <div style="font-size:12px;color:var(--text-secondary);">勾选要导出的分组，仅导出这些分组的字卡</div>
        <div id="_gep_list" style="display:flex;flex-direction:column;gap:8px;overflow-y:auto;max-height:50vh;"></div>
        <div style="display:flex;gap:10px;">
            <button id="_gep_cancel" style="flex:1;padding:12px;border:1.5px solid var(--border-color);border-radius:13px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
            <button id="_gep_confirm" style="flex:2;padding:12px;border:none;border-radius:13px;background:var(--accent-color);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:8px;">
                ${ICONS.export} 导出
            </button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const listEl = panel.querySelector('#_gep_list');
    customReplyGroups.forEach((g, i) => {
        const cnt = (g.items || []).filter(t => customReplies.includes(t)).length;
        const row = document.createElement('label');
        row.style.cssText = `display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:13px;border:1.5px solid var(--border-color);background:var(--primary-bg);cursor:pointer;transition:border-color 0.15s;`;
        row.innerHTML = `
            <input type="checkbox" value="${i}" style="width:16px;height:16px;accent-color:${g.color};flex-shrink:0;" checked>
            <span style="width:10px;height:10px;border-radius:50%;background:${g.color||'#aaa'};flex-shrink:0;"></span>
            <span style="flex:1;font-size:13px;font-weight:600;color:var(--text-primary);">${g.name}</span>
            <span style="font-size:11px;color:var(--text-secondary);">${cnt} 条</span>
        `;
        listEl.appendChild(row);
    });

    panel.querySelector('#_gep_cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    panel.querySelector('#_gep_confirm').onclick = () => {
        const checked = [...panel.querySelectorAll('input[type=checkbox]:checked')].map(cb => parseInt(cb.value));
        if (!checked.length) { showNotification('请至少选择一个分组', 'warning'); return; }

        const selectedGroups = checked.map(i => customReplyGroups[i]);
        const allItems = new Set();
        const exportGroups = [];
        selectedGroups.forEach(g => {
            const items = (g.items || []).filter(t => customReplies.includes(t));
            items.forEach(t => allItems.add(t));
            exportGroups.push({ ...g, items });
        });

        const libraryData = {
            exportDate: new Date().toISOString(),
            modules: ['replies', 'groups'],
            customReplies: [...allItems],
            customReplyGroups: exportGroups,
            _groupExport: true
        };
        const groupNames = selectedGroups.map(g => g.name).join('+');
        const fileName = `reply-groups-${groupNames}-${new Date().toISOString().slice(0,10)}.json`;
        exportDataToMobileOrPC(JSON.stringify(libraryData, null, 2), fileName);
        overlay.remove();
        showNotification(`✓ 已导出 ${checked.length} 个分组，共 ${allItems.size} 条字卡`, 'success');
    };
}

function _parseFlexibleJSON(text) {
    try { return JSON.parse(text); } catch (_) {}
    let repaired = text
        .replace(/,\s*([}\]])/g, '$1')  
        .replace(/(["\d\w}])\s*\n\s*"/g, (m, p1) => { 
            if (p1 === '}' || p1 === ']') return m;
            return p1 + ',\n"';
        });
    try { return JSON.parse(repaired); } catch (_) {}
    repaired = text.replace(/("(?:[^"\\]|\\.)*")\s*\n(\s*")/g, '$1,\n$2')
                   .replace(/,\s*([}\]])/g, '$1');
    return JSON.parse(repaired);
}

function _normalizeImportData(data) {
    if (!data || typeof data !== 'object') return data;
    const knownKeys = ['customReplies','customPokes','customStatuses','customMottos','customIntros','customEmojis','customReplyGroups','disabledDefaultReplies'];
    const hasNewFormat = knownKeys.some(k => Array.isArray(data[k]));
    if (hasNewFormat) return data;
    if (Array.isArray(data)) {
        return { customReplies: data };
    }
    return data;
}

function _showImportUI(data) {
    const knownFields = ['customReplies','customPokes','customStatuses','customMottos','customIntros','customEmojis','customReplyGroups'];
    const hasValid = knownFields.some(f => Array.isArray(data[f]));
    if (!hasValid) { showNotification('无效的字卡备份文件', 'error'); return; }

    const modules = [
        { id: '_ri_replies',  icon: ICONS.comment,   label: '主字卡',    data: data.customReplies,     key: 'customReplies' },
        { id: '_ri_pokes',    icon: ICONS.hand,      label: '拍一拍',    data: data.customPokes,       key: 'customPokes' },
        { id: '_ri_statuses', icon: ICONS.dot,       label: '对方状态',  data: data.customStatuses,    key: 'customStatuses' },
        { id: '_ri_mottos',   icon: ICONS.quote,     label: '顶部格言',  data: data.customMottos,      key: 'customMottos' },
        { id: '_ri_intros',   icon: ICONS.play,      label: '开场动画',  data: data.customIntros,      key: 'customIntros' },
        { id: '_ri_emojis',   icon: ICONS.smile,     label: 'Emoji 库',  data: data.customEmojis,      key: 'customEmojis' },
        { id: '_ri_groups',   icon: ICONS.folderBig, label: '字卡分组',  data: data.customReplyGroups, key: 'customReplyGroups', extra: true },
    ].filter(m => Array.isArray(m.data));

    _showIOSheet(`导入字卡`, `文件中包含 ${modules.length} 个模块`, modules, ICONS.import, (selected, mode) => {
        if (!selected.length) { showNotification('请至少选择一项', 'error'); return; }
        try {
            const overwrite = mode === 'overwrite';
            let totalAdded = 0;
            if (overwrite) {
                selected.forEach(m => {
                    if (m.key === 'customReplies') { customReplies = data.customReplies; totalAdded += data.customReplies.length; }
                    else if (m.key === 'customPokes') { customPokes = data.customPokes; totalAdded += data.customPokes.length; }
                    else if (m.key === 'customStatuses') { customStatuses = data.customStatuses; totalAdded += data.customStatuses.length; }
                    else if (m.key === 'customMottos') { customMottos = data.customMottos; totalAdded += data.customMottos.length; }
                    else if (m.key === 'customIntros') { customIntros = data.customIntros; totalAdded += data.customIntros.length; }
                    else if (m.key === 'customEmojis') { customEmojis = data.customEmojis; }
                    else if (m.key === 'customReplyGroups') { window.customReplyGroups = data.customReplyGroups; }
                });
            } else {
                selected.forEach(m => {
                    if (m.key === 'customReplies') {
                        const before = customReplies.length;
                        customReplies = deduplicateContentArray([...customReplies, ...data.customReplies], CONSTANTS.REPLY_MESSAGES).result;
                        totalAdded += customReplies.length - before;
                    } else if (m.key === 'customPokes') {
                        const before = customPokes.length;
                        customPokes = deduplicateContentArray([...customPokes, ...data.customPokes]).result;
                        totalAdded += customPokes.length - before;
                    } else if (m.key === 'customStatuses') {
                        const before = customStatuses.length;
                        customStatuses = deduplicateContentArray([...customStatuses, ...data.customStatuses]).result;
                        totalAdded += customStatuses.length - before;
                    } else if (m.key === 'customMottos') {
                        const before = customMottos.length;
                        customMottos = deduplicateContentArray([...customMottos, ...data.customMottos]).result;
                        totalAdded += customMottos.length - before;
                    } else if (m.key === 'customIntros') {
                        const before = customIntros.length;
                        customIntros = deduplicateContentArray([...customIntros, ...data.customIntros]).result;
                        totalAdded += customIntros.length - before;
                    } else if (m.key === 'customEmojis') {
                        customEmojis = [...new Set([...customEmojis, ...data.customEmojis])];
                    } else if (m.key === 'customReplyGroups') {
                        if (!window.customReplyGroups) window.customReplyGroups = [];
                        data.customReplyGroups.forEach(dg => {
                            if (!customReplyGroups.find(g => g.name === dg.name)) customReplyGroups.push(dg);
                        });
                    }
                });
            }
            throttledSaveData();
            if (typeof renderReplyLibrary === 'function') renderReplyLibrary();
            showNotification(`✓ 导入成功（${overwrite ? '覆盖' : '追加'}）${totalAdded > 0 ? `，共 ${totalAdded} 条` : ''}`, 'success', 3000);
        } catch (err) {
            console.error('字卡导入失败:', err);
            showNotification('导入过程中发生错误：' + err.message, 'error');
        }
    }, true);
}

function _showIOSheet(title, subtitle, modules, icon, onConfirm, showMode = false) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease;';

    let modeVal = 'merge';

    overlay.innerHTML = `
        <style>
            @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            @keyframes slideUpSheet { from{transform:translateY(100%)} to{transform:translateY(0)} }
            .io-module-row {
                display:flex;align-items:center;gap:12px;cursor:pointer;
                padding:12px 14px;border-radius:14px;background:var(--primary-bg);
                border:1.5px solid var(--border-color);transition:border-color 0.15s;
            }
            .io-icon-box {
                width:36px;height:36px;border-radius:10px;
                background:rgba(var(--accent-color-rgb,180,140,100),0.12);
                display:flex;align-items:center;justify-content:center;
                color:var(--accent-color);flex-shrink:0;
            }
            .io-toggle {
                width:42px;height:24px;border-radius:12px;background:var(--accent-color);
                position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;
            }
            .io-toggle .knob {
                position:absolute;top:3px;left:3px;width:18px;height:18px;
                border-radius:50%;background:#fff;transition:transform 0.2s;
                transform:translateX(18px);box-shadow:0 1px 3px rgba(0,0,0,.2);
            }
            .io-toggle.off { background:var(--border-color); }
            .io-toggle.off .knob { transform:translateX(0); }
        </style>
        <div style="
            background:var(--secondary-bg);border-radius:24px 24px 0 0;
            width:100%;max-width:500px;padding:0 0 env(safe-area-inset-bottom,0);
            box-shadow:0 -10px 60px rgba(0,0,0,.3);
            animation:slideUpSheet 0.3s cubic-bezier(0.34,1.56,0.64,1);
            max-height:92vh;display:flex;flex-direction:column;
        ">
            <div style="width:36px;height:4px;border-radius:2px;background:var(--border-color);margin:12px auto 0;flex-shrink:0;"></div>
            <div style="padding:18px 22px 8px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">
                <div>
                    <div style="font-size:16px;font-weight:700;color:var(--text-primary);display:flex;align-items:center;gap:8px;">
                        <span style="color:var(--accent-color);">${icon}</span> ${title}
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${subtitle}</div>
                </div>
                <button id="_io_close" style="background:var(--primary-bg);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-secondary);">
                    ${ICONS.close}
                </button>
            </div>
            <div style="overflow-y:auto;padding:8px 22px;display:flex;flex-direction:column;gap:7px;flex:1;">
                ${modules.map(m => `
                    <div class="io-module-row">
                        <div class="io-icon-box">${m.icon}</div>
                        <div style="flex:1;">
                            <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${m.label}</div>
                            <div style="font-size:11px;color:var(--text-secondary);">${m.data ? m.data.length : m.count} 条${m.extra ? ' · 含分组结构' : ''}</div>
                        </div>
                        <div class="io-toggle" data-id="${m.id}"><div class="knob"></div></div>
                        <input type="checkbox" id="${m.id}" checked style="display:none;">
                    </div>
                `).join('')}
            </div>
            ${showMode ? `
            <div style="padding:8px 22px;flex-shrink:0;">
                <div style="display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:13px;background:var(--primary-bg);border:1.5px solid var(--border-color);">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style="color:var(--accent-color);flex-shrink:0;"><path d="M7.5 1v9M4 6l3.5 3L11 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><line x1="2" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                    <span style="font-size:13px;color:var(--text-primary);flex:1;">导入方式</span>
                    <div style="display:flex;background:var(--secondary-bg);border-radius:8px;overflow:hidden;border:1px solid var(--border-color);">
                        <label style="display:flex;align-items:center;gap:4px;padding:5px 12px;cursor:pointer;font-size:12px;color:var(--text-primary);">
                            <input type="radio" name="_io_mode" id="_io_merge" value="merge" checked style="accent-color:var(--accent-color);"> 追加
                        </label>
                        <label style="display:flex;align-items:center;gap:4px;padding:5px 12px;cursor:pointer;font-size:12px;color:var(--text-primary);border-left:1px solid var(--border-color);">
                            <input type="radio" name="_io_mode" id="_io_overwrite" value="overwrite" style="accent-color:var(--accent-color);"> 覆盖
                        </label>
                    </div>
                </div>
            </div>` : ''}
            <div style="padding:10px 22px 22px;display:flex;gap:10px;flex-shrink:0;">
                <button id="_io_cancel" style="flex:1;padding:13px;border:1.5px solid var(--border-color);border-radius:14px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
                <button id="_io_confirm" style="flex:2;padding:13px;border:none;border-radius:14px;background:var(--accent-color);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:8px;">
                    <span style="color:#fff;">${icon}</span> 确认
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('.io-toggle').forEach(sw => {
        sw.onclick = () => {
            const cb = document.getElementById(sw.dataset.id);
            cb.checked = !cb.checked;
            sw.classList.toggle('off', !cb.checked);
        };
    });

    const close = () => { overlay.style.animation = 'fadeOut 0.15s ease forwards'; setTimeout(() => overlay.remove(), 150); };
    overlay.querySelector('#_io_close').onclick = close;
    overlay.querySelector('#_io_cancel').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    overlay.querySelector('#_io_confirm').onclick = () => {
        const selected = modules.filter(m => document.getElementById(m.id)?.checked);
        const mode = showMode ? (document.getElementById('_io_overwrite')?.checked ? 'overwrite' : 'merge') : 'export';
        close();
        onConfirm(selected, mode);
    };
}

function _makeOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;';
    return overlay;
}

function _showBatchAddDialog() {
    const overlay = _makeOverlay();
    const panel = document.createElement('div');
    panel.style.cssText = `
        background:var(--secondary-bg);border-radius:22px;padding:24px;
        width:92%;max-width:420px;
        max-height:88vh;
        display:flex;flex-direction:column;
        box-shadow:0 24px 80px rgba(0,0,0,.45);
        animation:popIn 0.22s cubic-bezier(.34,1.56,.64,1);
    `;

    const hasGroups = customReplyGroups && customReplyGroups.length > 0;
    const groupPillsHTML = hasGroups ? `
        <button class="ba-grp-pill" data-gidx="-1" style="
            padding:5px 13px;border-radius:20px;font-size:12px;font-family:var(--font-family);cursor:pointer;
            border:1.5px solid var(--accent-color);background:var(--accent-color);color:#fff;font-weight:700;
            flex-shrink:0;transition:all .15s;
        ">不分组</button>
        ${customReplyGroups.map((g, i) => `
        <button class="ba-grp-pill" data-gidx="${i}" style="
            padding:5px 13px;border-radius:20px;font-size:12px;font-family:var(--font-family);cursor:pointer;
            border:1.5px solid ${g.color}44;background:${g.color}18;color:${g.color};font-weight:600;
            flex-shrink:0;transition:all .15s;
        ">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${g.color};margin-right:4px;vertical-align:middle;"></span>${g.name}
        </button>`).join('')}
    ` : '';

    panel.innerHTML = `
        <style>
            @keyframes popIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
            @keyframes baGroupSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        </style>
        <div style="flex-shrink:0;font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:6px;">批量添加字卡</div>
        <div style="flex-shrink:0;font-size:12px;color:var(--text-secondary);margin-bottom:14px;line-height:1.6;">每行一条，自动去重</div>

        <div style="flex:1;overflow-y:auto;overflow-x:hidden;min-height:0;">
            <textarea id="batch-add-input" rows="10" placeholder="在此粘贴内容，每行一条…" style="
                width:100%;box-sizing:border-box;padding:12px 14px;
                border:1.5px solid var(--border-color);border-radius:13px;
                background:var(--primary-bg);color:var(--text-primary);
                font-size:13px;font-family:var(--font-family);outline:none;resize:vertical;
                line-height:1.6;transition:border 0.18s;
            "></textarea>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:6px;margin-bottom:12px;">
                <span id="batch-add-count">0 条</span>
            </div>

            ${hasGroups ? `
            <div id="ba-group-section" style="margin-bottom:4px;">
                <button id="ba-group-toggle" style="
                    display:flex;align-items:center;gap:7px;width:100%;
                    padding:9px 12px;border-radius:11px;cursor:pointer;
                    border:1.5px solid var(--border-color);background:var(--primary-bg);
                    color:var(--text-secondary);font-size:12px;font-family:var(--font-family);
                    font-weight:600;transition:all .15s;text-align:left;
                ">
                    <i class="fas fa-folder" style="font-size:12px;color:var(--accent-color);"></i>
                    <span id="ba-toggle-label">添加到分组</span>
                    <span id="ba-toggle-arrow" style="margin-left:auto;font-size:10px;transition:transform .2s;">▼</span>
                </button>
                <div id="ba-group-drawer" style="display:none;overflow-x:auto;overflow-y:hidden;padding:10px 2px 4px;scrollbar-width:none;-webkit-overflow-scrolling:touch;">
                    <div id="ba-group-list" style="display:flex;gap:7px;width:max-content;">
                        ${groupPillsHTML}
                    </div>
                </div>
            </div>` : ''}
        </div>

        <div style="flex-shrink:0;padding-top:14px;display:flex;gap:10px;">
            <button id="ba-cancel" style="flex:1;padding:12px;border:1.5px solid var(--border-color);border-radius:13px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
            <button id="ba-confirm" style="flex:2;padding:12px;border:none;border-radius:13px;background:var(--accent-color);color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font-family);">添加</button>
        </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const ta = panel.querySelector('#batch-add-input');
    const countEl = panel.querySelector('#batch-add-count');
    ta.addEventListener('input', () => {
        const lines = ta.value.split('\n').filter(l => l.trim());
        countEl.textContent = `${lines.length} 条`;
    });
    ta.addEventListener('focus', e => { e.target.style.borderColor = 'var(--accent-color)'; });
    ta.addEventListener('blur', e => { e.target.style.borderColor = 'var(--border-color)'; });

    const groupToggle = panel.querySelector('#ba-group-toggle');
    const groupDrawer = panel.querySelector('#ba-group-drawer');
    const toggleArrow = panel.querySelector('#ba-toggle-arrow');
    const toggleLabel = panel.querySelector('#ba-toggle-label');
    let _drawerOpen = false;
    if (groupToggle && groupDrawer) {
        groupToggle.addEventListener('click', () => {
            _drawerOpen = !_drawerOpen;
            if (_drawerOpen) {
                groupDrawer.style.display = 'block';
                groupDrawer.style.animation = 'baGroupSlide 0.18s ease forwards';
                toggleArrow.style.transform = 'rotate(180deg)';
                groupToggle.style.borderColor = 'var(--accent-color)';
                groupToggle.style.color = 'var(--text-primary)';
            } else {
                groupDrawer.style.display = 'none';
                toggleArrow.style.transform = '';
                groupToggle.style.borderColor = 'var(--border-color)';
                groupToggle.style.color = 'var(--text-secondary)';
            }
        });
    }

    let _selectedGroupIdx = -1; 
    const pillContainer = panel.querySelector('#ba-group-list');
    if (pillContainer) {
        pillContainer.addEventListener('click', e => {
            const pill = e.target.closest('.ba-grp-pill');
            if (!pill) return;
            _selectedGroupIdx = parseInt(pill.dataset.gidx);
            if (toggleLabel) {
                if (_selectedGroupIdx === -1) {
                    toggleLabel.textContent = '添加到分组';
                } else {
                    const g = customReplyGroups[_selectedGroupIdx];
                    toggleLabel.textContent = g ? `分组：${g.name}` : '添加到分组';
                }
            }
            pillContainer.querySelectorAll('.ba-grp-pill').forEach((p, i) => {
                const gidx = parseInt(p.dataset.gidx);
                if (gidx === -1) {
                    const isActive = _selectedGroupIdx === -1;
                    p.style.background = isActive ? 'var(--accent-color)' : 'transparent';
                    p.style.color = isActive ? '#fff' : 'var(--text-secondary)';
                    p.style.borderColor = isActive ? 'var(--accent-color)' : 'var(--border-color)';
                } else {
                    const g = customReplyGroups[gidx];
                    if (!g) return;
                    const isActive = _selectedGroupIdx === gidx;
                    p.style.background = isActive ? g.color : g.color + '18';
                    p.style.color = isActive ? '#fff' : g.color;
                    p.style.borderColor = isActive ? g.color : g.color + '44';
                }
            });
        });
    }

    panel.querySelector('#ba-cancel').onclick = () => overlay.remove();
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    panel.querySelector('#ba-confirm').onclick = () => {
        const lines = ta.value.split('\n').map(l => l.trim()).filter(Boolean);
        if (!lines.length) { showNotification('请输入内容', 'warning'); return; }
        let added = 0, skipped = 0;
        const newItems = [];
        lines.forEach(val => {
            const norm = normalizeStringStrict(val);
            const isDup = currentSubTab === 'custom'
                ? (customReplies.some(r => normalizeStringStrict(r) === norm) || CONSTANTS.REPLY_MESSAGES.some(r => normalizeStringStrict(r) === norm))
                : false;
            if (isDup) { skipped++; return; }
            if (currentSubTab === 'custom') { customReplies.push(val); newItems.push(val); }
            else if (currentSubTab === 'pokes') customPokes.push(val);
            else if (currentSubTab === 'statuses') customStatuses.push(val);
            else if (currentSubTab === 'mottos') customMottos.push(val);
            added++;
        });
        if (currentSubTab === 'custom' && _selectedGroupIdx >= 0 && newItems.length > 0 && customReplyGroups) {
            const targetGroup = customReplyGroups[_selectedGroupIdx];
            if (targetGroup) {
                if (!targetGroup.items) targetGroup.items = [];
                newItems.forEach(item => {
                    if (!targetGroup.items.includes(item)) targetGroup.items.push(item);
                });
            }
        }
        throttledSaveData();
        overlay.remove();
        renderReplyLibrary();
        const groupHint = _selectedGroupIdx >= 0 && customReplyGroups?.[_selectedGroupIdx]
            ? `，已加入「${customReplyGroups[_selectedGroupIdx].name}」` : '';
        showNotification(`✓ 添加 ${added} 条${skipped ? `，跳过 ${skipped} 条重复` : ''}${groupHint}`, 'success');
    };
}

function initReplyLibraryListeners() {
    const entryBtn = document.getElementById('custom-replies-function');
    if (entryBtn) {
        entryBtn.addEventListener('click', () => {
            hideModal(DOMElements.advancedModal.modal);
            currentMajorTab = 'reply';
            currentSubTab = 'custom';
            _batchModeActive = false;
            _batchSelectedIndices.clear();
            _searchVisible = false;
            _searchQuery = '';
            _activeGroupFilter = null;
            document.querySelectorAll('.sidebar-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.major === 'reply');
            });
            renderReplyLibrary();
            showModal(DOMElements.customRepliesModal.modal);
        });
    }

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMajorTab = btn.dataset.major;

            if (currentMajorTab === 'announcement') return;

            const listArea = document.getElementById('custom-replies-list');
            const annPanel = document.getElementById('announcement-panel');
            const crToolbar = document.getElementById('cr-toolbar');
            const subTabs = document.getElementById('cr-sub-tabs');
            const addBtn = document.getElementById('add-custom-reply');
            const titleEl = document.getElementById('cr-modal-title');
            if (listArea) listArea.style.display = '';
            if (annPanel) annPanel.style.display = 'none';
            if (crToolbar) crToolbar.style.display = '';
            if (subTabs) subTabs.style.display = '';
            if (addBtn) addBtn.style.display = '';
            if (titleEl) titleEl.textContent = '内容管理';

            _batchModeActive = false;
            _batchSelectedIndices.clear();
            _searchVisible = false;
            _searchQuery = '';
            _activeGroupFilter = null;
            currentSubTab = LIBRARY_CONFIG[currentMajorTab].tabs[0].id;
            renderReplyLibrary();
        });
    });

    document.addEventListener('click', e => {
        if (e.target.closest('#manage-groups-btn')) _showGroupManager();
    });

    const searchInput = document.getElementById('reply-search-input');
    if (searchInput) searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        clearTimeout(_searchDebounceTimer);
        _searchDebounceTimer = setTimeout(() => {
            _searchQuery = val;
            renderReplyLibrary();
        }, 400);
    });

    const dedupBtn = document.getElementById('dedup-replies-btn');
    if (dedupBtn) dedupBtn.addEventListener('click', _runDedup);

    const exportBtn = document.getElementById('export-replies-btn');
    if (exportBtn) exportBtn.addEventListener('click', _showExportUI);

    const importInput = document.getElementById('import-replies-input');
    if (importInput && !importInput._bound) {
        importInput._bound = true;
        importInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            e.target.value = '';
            if (file.size > 50 * 1024 * 1024) { showNotification('文件过大', 'error'); return; }
            const reader = new FileReader();
            reader.onload = ev => {
                let data;
                try {
                    data = _parseFlexibleJSON(ev.target.result);
                } catch {
                    showNotification('文件解析失败，请检查文件格式', 'error');
                    return;
                }
                data = _normalizeImportData(data);
                _showImportUI(data);
            };
            reader.onerror = () => showNotification('文件读取失败', 'error');
            reader.readAsText(file, 'UTF-8');
        });
    }

    const addBtn = document.getElementById('add-custom-reply');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (currentSubTab === 'stickers') {
                document.getElementById('sticker-file-input')?.click(); return;
            }
            if (currentSubTab === 'emojis') {
                const input = prompt('请输入要添加的 Emoji（支持组合表情）:');
                if (input?.trim()) {
                    customEmojis.push(input.trim());
                    throttledSaveData(); renderReplyLibrary();
                    showNotification('✓ Emoji 已添加', 'success');
                }
                return;
            }
            if (currentSubTab === 'custom') {
                _showBatchAddDialog(); return;
            }
            let input;
            if (currentSubTab === 'intros') {
                const l1 = prompt('请输入主标题 (如: 𝑳𝒐𝒗𝒆):');
                if (!l1) return;
                const l2 = prompt('请输入副标题 (如: 若要由我来谈论爱的话):');
                input = `${l1}|${l2}`;
            } else {
                input = prompt(`请输入新的${getCategoryName(currentSubTab)}:`);
            }
            if (input?.trim()) {
                const val = input.trim();
                const valNorm = normalizeStringStrict(val);
                let isDup = false;
                if (currentSubTab === 'pokes' && customPokes.some(r => normalizeStringStrict(r) === valNorm)) isDup = true;
                else if (currentSubTab === 'statuses' && customStatuses.some(r => normalizeStringStrict(r) === valNorm)) isDup = true;
                else if (currentSubTab === 'mottos' && customMottos.some(r => normalizeStringStrict(r) === valNorm)) isDup = true;
                else if (currentSubTab === 'intros' && customIntros.some(r => normalizeStringStrict(r) === valNorm)) isDup = true;
                if (isDup) { showNotification('该内容已存在', 'warning'); return; }
                if (currentSubTab === 'pokes') customPokes.unshift(val);
                else if (currentSubTab === 'statuses') customStatuses.unshift(val);
                else if (currentSubTab === 'mottos') customMottos.unshift(val);
                else if (currentSubTab === 'intros') customIntros.unshift(val);
                throttledSaveData(); renderReplyLibrary();
                showNotification('✓ 添加成功', 'success');
            }
        });
    }
}

function getCategoryName(tabId) {
    return { custom: '回复', pokes: '拍一拍', statuses: '状态', mottos: '格言', intros: '开场语' }[tabId] || '内容';
}

function updateTabUI() {
    document.querySelectorAll('.reply-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === currentReplyTab);
    });
    const si = document.getElementById('reply-search-input');
    if (si) si.value = '';
}

function initRippleFeedback() {
    const targets = ['.input-btn','.action-btn','.modal-btn','.settings-item','.batch-action-btn','.coin-btn-action','.import-export-btn','.reply-tab-btn','.anniversary-type-btn','.reply-tool-btn','.session-action-btn','.fav-action-btn'];
    document.addEventListener('mousedown', e => {
        const target = e.target.closest(targets.join(','));
        if (target) createRipple(e, target);
    });
    function createRipple(event, button) {
        if (!button.classList.contains('ripple-effect')) button.classList.add('ripple-effect');
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        const rect = button.getBoundingClientRect();
        const cx = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const cy = event.clientY || (event.touches ? event.touches[0].clientY : 0);
        circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${cx-rect.left-radius}px;top:${cy-rect.top-radius}px;`;
        circle.classList.add('ripple-wave');
        button.getElementsByClassName('ripple-wave')[0]?.remove();
        button.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    }
}

function applyAvatarFrame(avatarContainer, frameSettings) {
    let frameElement = avatarContainer.querySelector('.avatar-frame');
    if (frameSettings?.src) {
        if (!frameElement) {
            frameElement = document.createElement('img');
            frameElement.className = 'avatar-frame';
            avatarContainer.appendChild(frameElement);
        }
        frameElement.src = frameSettings.src;
        frameElement.style.width = `${frameSettings.size || 100}%`;
        frameElement.style.height = `${frameSettings.size || 100}%`;
        frameElement.style.transform = `translate(calc(-50% + ${frameSettings.offsetX || 0}px), calc(-50% + ${frameSettings.offsetY || 0}px))`;
        avatarContainer.style.setProperty('overflow', 'visible', 'important');
    } else {
        frameElement?.remove();
        avatarContainer.style.removeProperty('overflow');
    }
}

function setupAvatarFrameSettings() {
    const setupControlsFor = (type) => {
        const preview = document.getElementById(`${type}-frame-preview-2`);
        const uploadBtn = document.getElementById(`${type}-frame-upload-btn-2`);
        const removeBtn = document.getElementById(`${type}-frame-remove-btn-2`);
        const fileInput = document.getElementById(`${type}-frame-file-input-2`);
        const sizeSlider = document.getElementById(`${type}-frame-size-2`);
        const sizeValue = document.getElementById(`${type}-frame-size-value-2`);
        const xSlider = document.getElementById(`${type}-frame-offset-x-2`);
        const xValue = document.getElementById(`${type}-frame-offset-x-value-2`);
        const ySlider = document.getElementById(`${type}-frame-offset-y-2`);
        const yValue = document.getElementById(`${type}-frame-offset-y-value-2`);
        if (!preview || !uploadBtn || !sizeSlider) return;
        const settingsKey = type === 'my' ? 'myAvatarFrame' : 'partnerAvatarFrame';
        const avatarContainer = type === 'my' ? DOMElements.me.avatarContainer : DOMElements.partner.avatarContainer;
        const avatarElement = type === 'my' ? DOMElements.me.avatar : DOMElements.partner.avatar;
        const updatePreview = () => {
            const bgLayer = preview.querySelector('.preview-bg-layer');
            const avatarImg = avatarElement ? avatarElement.querySelector('img') : null;
            if (bgLayer) {
                if (avatarImg && avatarImg.src && !avatarImg.src.endsWith('#') && avatarImg.src !== window.location.href) {
                    bgLayer.innerHTML = `<img src="${avatarImg.src}" alt="avatar">`;
                } else {
                    bgLayer.innerHTML = `<i class="fas fa-user"></i>`;
                }
            }
            let oldFrame = preview.querySelector('.preview-frame');
            if (oldFrame) oldFrame.remove();
            const frameSettings = settings[settingsKey];
            if (frameSettings?.src) {
                const { size = 100, offsetX = 0, offsetY = 0 } = frameSettings;
                const frameImg = document.createElement('img');
                frameImg.src = frameSettings.src;
                frameImg.className = 'preview-frame';
                frameImg.style.cssText = `width:${size}%;height:${size}%;transform:translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px));`;
                preview.appendChild(frameImg);
            }
        };
        const updateControls = () => {
            const frame = settings[settingsKey];
            sizeSlider.value = frame?.size || 100;
            sizeValue.textContent = `${sizeSlider.value}%`;
            xSlider.value = frame?.offsetX || 0;
            xValue.textContent = `${xSlider.value}px`;
            ySlider.value = frame?.offsetY || 0;
            yValue.textContent = `${ySlider.value}px`;
            updatePreview();
        };
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.size > 1024 * 1024) { showNotification('头像框图片大小不能超过1MB', 'error'); return; }
            const reader = new FileReader();
            reader.onload = ev => {
                if (!settings[settingsKey]) settings[settingsKey] = { size: 100, offsetX: 0, offsetY: 0 };
                settings[settingsKey].src = ev.target.result;
                applyAvatarFrame(avatarContainer, settings[settingsKey]);
                updateControls(); throttledSaveData();
            };
            reader.readAsDataURL(file);
        });

        const urlBtn = document.getElementById(`${type}-frame-url-btn-2`);
        if (urlBtn) {
            urlBtn.addEventListener('click', () => {
                const url = prompt('请输入头像框图片的URL地址（支持 png/webp/gif）:');
                if (!url?.trim()) return;
                const trimmed = url.trim();
                const img = new Image();
                img.onload = () => {
                    if (!settings[settingsKey]) settings[settingsKey] = { size: 100, offsetX: 0, offsetY: 0 };
                    settings[settingsKey].src = trimmed;
                    applyAvatarFrame(avatarContainer, settings[settingsKey]);
                    updateControls(); throttledSaveData();
                    showNotification('✓ 头像框已通过URL加载', 'success');
                };
                img.onerror = () => showNotification('URL无法加载图片，请检查链接', 'error');
                img.src = trimmed;
            });
        }
        removeBtn.addEventListener('click', () => {
            settings[settingsKey] = null;
            applyAvatarFrame(avatarContainer, null);
            updateControls(); throttledSaveData();
        });
        [sizeSlider, xSlider, ySlider].forEach(slider => {
            slider.addEventListener('input', () => {
                if (!settings[settingsKey]) return;
                settings[settingsKey].size = parseInt(sizeSlider.value);
                settings[settingsKey].offsetX = parseInt(xSlider.value);
                settings[settingsKey].offsetY = parseInt(ySlider.value);
                applyAvatarFrame(avatarContainer, settings[settingsKey]);
                updateControls();
                if (typeof renderMessages === 'function') renderMessages(true);
            });
            slider.addEventListener('change', throttledSaveData);
        });
        updateControls();
    };
    setupControlsFor('my');
    setupControlsFor('partner');
}

function applyAllAvatarFrames() {
    applyAvatarFrame(DOMElements.me.avatarContainer, settings.myAvatarFrame);
    applyAvatarFrame(DOMElements.partner.avatarContainer, settings.partnerAvatarFrame);
    if (typeof applyAvatarShapeToDOM === 'function') {
        applyAvatarShapeToDOM('my', settings.myAvatarShape || 'circle');
        applyAvatarShapeToDOM('partner', settings.partnerAvatarShape || 'circle');
    }
    if (settings.avatarCornerRadius) {
        document.documentElement.style.setProperty('--avatar-corner-radius', settings.avatarCornerRadius + 'px');
    }
}

function applyAvatarShapeToDOM(type, shape) {
            const SHAPES = ['circle','square'];
            const avatarContainer = type === 'my' ? DOMElements.me.avatarContainer : DOMElements.partner.avatarContainer;
            if (!avatarContainer) return;
            SHAPES.forEach(s => avatarContainer.classList.remove('avatar-shape-' + s));
            if (shape && shape !== 'none') avatarContainer.classList.add('avatar-shape-' + shape);
            
            document.querySelectorAll('.message-wrapper').forEach(wrapper => {
                const isUser = wrapper.classList.contains('sent');
                if ((type === 'my' && isUser) || (type === 'partner' && !isUser)) {
                    const avatarDiv = wrapper.querySelector('.message-avatar');
                    if (avatarDiv) {
                        SHAPES.forEach(s => avatarDiv.classList.remove('shape-' + s));
                        if (shape && shape !== 'none') avatarDiv.classList.add('shape-' + shape);
                    }
                }
            });
        }
        function setupAppearancePanelFrameSettings() {
            const setupFor = (type) => {
                const suffix = '-2';
                const preview = document.getElementById(`${type}-frame-preview${suffix}`);
                const uploadBtn = document.getElementById(`${type}-frame-upload-btn${suffix}`);
                const removeBtn = document.getElementById(`${type}-frame-remove-btn${suffix}`);
                const fileInput = document.getElementById(`${type}-frame-file-input${suffix}`);
                const sizeSlider = document.getElementById(`${type}-frame-size${suffix}`);
                const sizeValue = document.getElementById(`${type}-frame-size-value${suffix}`);
                const xSlider = document.getElementById(`${type}-frame-offset-x${suffix}`);
                const xValue = document.getElementById(`${type}-frame-offset-x-value${suffix}`);
                const ySlider = document.getElementById(`${type}-frame-offset-y${suffix}`);
                const yValue = document.getElementById(`${type}-frame-offset-y-value${suffix}`);
                if (!preview || !uploadBtn) return;

                const settingsKey = type === 'my' ? 'myAvatarFrame' : 'partnerAvatarFrame';
                const avatarContainer = type === 'my' ? DOMElements.me.avatarContainer : DOMElements.partner.avatarContainer;
                const avatarElement = type === 'my' ? DOMElements.me.avatar : DOMElements.partner.avatar;

                const updatePreview2 = () => {
                    let avatarContent = avatarElement.innerHTML;
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = avatarContent;
                    const img = tempDiv.querySelector('img');
                    if (img) avatarContent = `<img src="${img.src}" alt="preview">`;
                    const frameSettings = settings[settingsKey];
                    let frameHtml = '';
                    if (frameSettings && frameSettings.src) {
                        const size = frameSettings.size || 100;
                        const ox = frameSettings.offsetX || 0;
                        const oy = frameSettings.offsetY || 0;
                        frameHtml = `<img src="${frameSettings.src}" class="preview-frame" style="width:${size}%;height:${size}%;transform:translate(calc(-50% + ${ox}px),calc(-50% + ${oy}px));">`;
                    }
                    preview.innerHTML = `<div class="preview-bg-layer">${avatarContent}</div>${frameHtml}`;
                };

                const updateControls2 = () => {
                    const frame = settings[settingsKey];
                    if (sizeSlider) { sizeSlider.value = frame?.size || 100; sizeValue.textContent = `${sizeSlider.value}%`; }
                    if (xSlider) { xSlider.value = frame?.offsetX || 0; xValue.textContent = `${xSlider.value}px`; }
                    if (ySlider) { ySlider.value = frame?.offsetY || 0; yValue.textContent = `${ySlider.value}px`; }
                    updatePreview2();
                };

                uploadBtn.addEventListener('click', () => fileInput && fileInput.click());
                if (fileInput) fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0]; if (!file) return;
                    if (file.size > 1024 * 1024) { showNotification('图片大小不能超过1MB', 'error'); return; }
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        if (!settings[settingsKey]) settings[settingsKey] = { size: 100, offsetX: 0, offsetY: 0 };
                        settings[settingsKey].src = ev.target.result;
                        applyAvatarFrame(avatarContainer, settings[settingsKey]);
                        updateControls2(); throttledSaveData();
                    };
                    reader.readAsDataURL(file);
                });
                if (removeBtn) removeBtn.addEventListener('click', () => {
                    settings[settingsKey] = null;
                    applyAvatarFrame(avatarContainer, null);
                    updateControls2(); throttledSaveData();
                });
                [sizeSlider, xSlider, ySlider].forEach(s => {
                    if (!s) return;
                    s.addEventListener('input', () => {
                        if (!settings[settingsKey]) return;
                        settings[settingsKey].size = parseInt(sizeSlider.value);
                        settings[settingsKey].offsetX = parseInt(xSlider.value);
                        settings[settingsKey].offsetY = parseInt(ySlider.value);
                        applyAvatarFrame(avatarContainer, settings[settingsKey]);
                        updateControls2(); renderMessages(true);
                    });
                    s.addEventListener('change', throttledSaveData);
                });
                updateControls2();
            };
            setupFor('my');
            setupFor('partner');
        }
        const themeColorMappings = {
            '--primary-bg':        '主背景（聊天底色）',
            '--secondary-bg':      '卡片 / 弹窗背景',
            '--header-bg':         '顶栏背景色',
            '--input-area-bg':     '输入框区域背景',
            '--text-primary':      '主要文字颜色',
            '--text-secondary':    '次要文字 / 说明文字',
            '--border-color':      '边框 / 分割线颜色',
            '--accent-color':      '强调色（全局图标/高亮/链接，影响广泛）',
            '--accent-color-dark': '强调色深色变体（深色模式专用）',
            '--message-sent-bg':   '【我方气泡】背景色',
            '--message-sent-text': '【我方气泡】文字 & 图标色（气泡内所有颜色）',
            '--message-received-bg':   '【对方气泡】背景色',
            '--message-received-text': '【对方气泡】文字色',
            '--toolbar-btn-bg':        '工具栏按钮背景（附件/拍照等）',
            '--toolbar-btn-color':     '工具栏按钮图标色',
            '--send-btn-bg':        '发送按钮 背景色',
            '--send-btn-icon-color':'发送按钮 图标色',
            '--favorite-color':    '收藏星标颜色',
            '--timestamp-color':   '时间戳颜色',
        };

        const themeExtraMappings = {
            '--radius': { label: '圆角半径', type: 'range', min: 0, max: 32, unit: 'px', default: '16px' },
            '--message-font-weight': { label: '消息粗细', type: 'select', options: ['300','400','500','600','700'], default: '400' },
            '--message-line-height': { label: '消息行高', type: 'range', min: 1.0, max: 2.5, step: 0.05, unit: '', default: '1.5' },
        };


function initThemeEditor() {
    const openEditorBtn = document.getElementById('open-theme-editor');
    
    if (openEditorBtn) {
        const newBtn = openEditorBtn.cloneNode(true);
        openEditorBtn.parentNode.replaceChild(newBtn, openEditorBtn);

        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("自定义主题编辑器按钮被点击！");
            
            const appearanceModal = document.getElementById('appearance-modal');
            const editorModal = document.getElementById('theme-editor-modal');

            if (appearanceModal) hideModal(appearanceModal);
            
            populateThemeEditor();
            populateThemeSelector();
            
            if (editorModal) showModal(editorModal);
        });
    }

    const closeBtn = document.getElementById('close-theme-editor');
    if (closeBtn) {
        closeBtn.onclick = () => {
            updateUI();
            hideModal(document.getElementById('theme-editor-modal'));
        };
    }

    const resetThemeBtn = document.getElementById('reset-theme-editor');
    if (resetThemeBtn) {
        resetThemeBtn.onclick = () => {
            if (!confirm('重置将清除当前编辑器中的自定义颜色，恢复当前主题方案的默认色彩。\n\n已保存的自定义主题方案不受影响，确定重置吗？')) return;
            settings.customThemeColors = {};
            const root = document.documentElement;
            const allVars = Object.keys(Object.assign({}, themeColorMappings || {}, themeExtraMappings || {}));
            allVars.forEach(v => root.style.removeProperty(v));
            updateUI();
            populateThemeEditor();
            showNotification('已重置为当前主题默认色彩', 'success');
        };
    }
    
    const applyCloseBtn = document.getElementById('apply-close-theme-editor');
    if (applyCloseBtn) {
        applyCloseBtn.onclick = () => {
            const root = document.documentElement;
            const customColors = {};
            for (const variable of Object.keys(themeColorMappings)) {
                const val = root.style.getPropertyValue(variable);
                if (val) customColors[variable] = val.trim();
            }
            for (const variable of Object.keys(themeExtraMappings)) {
                const val = root.style.getPropertyValue(variable);
                if (val) customColors[variable] = val.trim();
            }
            if (customColors['--accent-color']) {
                const hex = customColors['--accent-color'].replace('#','');
                if (/^[0-9a-fA-F]{6}$/.test(hex)) {
                    customColors['--accent-color-rgb'] =
                        `${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)}`;
                }
            }
            settings.customThemeColors = customColors;
            throttledSaveData && throttledSaveData();
            updateUI();
            if (settings.customBubbleCss) {
                try { applyCustomBubbleCss(settings.customBubbleCss); } catch(e) {}
            }
            hideModal(document.getElementById('theme-editor-modal'));
            showNotification('主题已应用 ✓', 'success');
        };
    }
    
    const saveBtn = document.getElementById('save-theme-preset-btn');
    if(saveBtn) saveBtn.onclick = saveCurrentThemeAsPreset;

    const overwriteBtn = document.getElementById('overwrite-theme-preset-btn');
    if(overwriteBtn) overwriteBtn.onclick = function() {
        const selector = document.getElementById('theme-preset-selector');
        const selectedId = selector && selector.value;
        if (!selectedId || !selectedId.startsWith('custom-')) {
            showNotification('请先选择一个自定义方案再覆盖', 'warning');
            return;
        }
        const theme = customThemes.find(t => t.id === selectedId);
        if (!theme) return;
        if (!confirm(`确定要用当前编辑内容覆盖「${theme.name}」吗？`)) return;
        const root = document.documentElement;
        theme.colors = {};
        for (const variable of Object.keys(themeColorMappings)) {
            const val = root.style.getPropertyValue(variable) || getComputedStyle(root).getPropertyValue(variable).trim();
            if (val) theme.colors[variable] = val.trim();
        }
        for (const variable of Object.keys(themeExtraMappings)) {
            const val = root.style.getPropertyValue(variable) || getComputedStyle(root).getPropertyValue(variable).trim();
            if (val) theme.colors[variable] = val.trim();
        }
        saveCustomThemes();
        showNotification(`已覆盖「${theme.name}」`, 'success');
    };
    
    const renameBtn = document.getElementById('rename-theme-preset-btn');
    if(renameBtn) renameBtn.onclick = () => {
        const selector = document.getElementById('theme-preset-selector');
        const selectedId = selector && selector.value;
        if (!selectedId || !selectedId.startsWith('custom-')) {
            showNotification('请先选择一个自定义方案再重命名', 'warning');
            return;
        }
        const theme = customThemes.find(t => t.id === selectedId);
        if (!theme) return;
        const newName = prompt('输入新名称：', theme.name);
        if (!newName || !newName.trim()) return;
        theme.name = newName.trim();
        saveCustomThemes();
        populateThemeSelector();
        showNotification(`已重命名为「${newName}」`, 'success');
    };

    const delBtn = document.getElementById('delete-theme-preset-btn');
    if(delBtn) delBtn.onclick = deleteCurrentPreset;

    const selector = document.getElementById('theme-preset-selector');
    if(selector) {
        selector.onchange = (e) => {
            const selectedValue = e.target.value;
            const owBtn = document.getElementById('overwrite-theme-preset-btn');
            if (owBtn) owBtn.style.display = selectedValue.startsWith('custom-') ? '' : 'none';
            if (selectedValue === "current-editing") return;
            
            if (selectedValue.startsWith('custom-')) {
                const theme = customThemes.find(t => t.id === selectedValue);
                if (theme) {
                    settings.colorTheme = theme.id;
                    applyTheme(theme.colors);
                    populateThemeEditor(theme.colors);
                    throttledSaveData();
                }
            }
        };
    }
}
        
        function resolveColorVar(rawVal, rootStyle) {
            if (!rawVal) return '';
            let val = rawVal.trim();
            if (val.startsWith('var(')) {
                const inner = val.match(/^var\(\s*(--[\w-]+)/);
                if (inner) {
                    const resolved = rootStyle.getPropertyValue(inner[1]).trim();
                    if (resolved && !resolved.startsWith('var(')) val = resolved;
                    else return '';
                }
            }
            if (val.startsWith('rgb')) {
                const m = val.match(/\d+/g);
                if (m && m.length >= 3) {
                    return '#' + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
                }
            }
            if (/^#[0-9a-fA-F]{3,8}$/.test(val)) return val;
            return '';
        }

        function populateThemeEditor(currentColors = null) {
            const grid = document.getElementById('theme-editor-grid');
            grid.innerHTML = '';
            const rootStyle = getComputedStyle(document.documentElement);

            const groups = [
                { label: '🖼 背景颜色',  vars: ['--primary-bg','--secondary-bg','--header-bg','--input-area-bg'] },
                { label: '✏️ 文字 & 线条', vars: ['--text-primary','--text-secondary','--timestamp-color','--border-color'] },
                { label: '✨ 强调色（影响全局）', vars: ['--accent-color','--accent-color-dark'] },
                { label: '💬 我方气泡',  vars: ['--message-sent-bg','--message-sent-text'] },
                { label: '💬 对方气泡',  vars: ['--message-received-bg','--message-received-text'] },
                { label: '🔧 工具栏按钮', vars: ['--toolbar-btn-bg','--toolbar-btn-color'] },
                { label: '📤 发送按钮',  vars: ['--send-btn-bg','--send-btn-icon-color'] },
                { label: '⭐ 其他',       vars: ['--favorite-color'] },
            ];

            groups.forEach(group => {
                const heading = document.createElement('div');
                heading.style.cssText = 'grid-column:1/-1;font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:1.5px;text-transform:uppercase;padding:8px 0 4px;border-bottom:1px solid var(--border-color);margin-top:6px;';
                heading.textContent = group.label;
                grid.appendChild(heading);

                group.vars.forEach(variable => {
                    const label = themeColorMappings[variable];
                    if (!label) return;

                    const rawVal = currentColors
                        ? (currentColors[variable] || rootStyle.getPropertyValue(variable).trim())
                        : rootStyle.getPropertyValue(variable).trim();
                    const colorValue = resolveColorVar(rawVal, rootStyle) || '#888888';

                    const item = document.createElement('div');
                    item.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px;background:var(--primary-bg);padding:8px 10px;border-radius:10px;border:1px solid var(--border-color);';
                    item.innerHTML = `
                        <input type="color" data-variable="${variable}" value="${colorValue}"
                            style="width:38px;height:38px;border-radius:8px;border:2px solid var(--border-color);padding:2px;cursor:pointer;background:none;flex-shrink:0;">
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${label}</div>
                            <div style="font-size:10px;color:var(--text-secondary);font-family:monospace;margin-top:1px;">${variable}</div>
                        </div>
                        <div class="te-swatch" style="width:22px;height:22px;border-radius:5px;border:1px solid var(--border-color);background:${colorValue};flex-shrink:0;"></div>`;

                    const input = item.querySelector('input[type="color"]');
                    const swatch = item.querySelector('.te-swatch');

                    input.addEventListener('input', (e) => {
                        const v = e.target.dataset.variable;
                        const val = e.target.value;
                        document.documentElement.style.setProperty(v, val);
                        swatch.style.background = val;
                        if (v === '--accent-color') {
                            const h = val.replace('#','');
                            document.documentElement.style.setProperty('--accent-color-rgb',
                                `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`);
                        }
                    });

                    grid.appendChild(item);
                });
            });

            const extraHeading = document.createElement('div');
            extraHeading.style.cssText = 'grid-column:1/-1;font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:1.5px;text-transform:uppercase;padding:8px 0 4px;border-bottom:1px solid var(--border-color);margin-top:6px;';
            extraHeading.textContent = '⚙️ 数值 & 字重';
            grid.appendChild(extraHeading);

            for (const [variable, cfg] of Object.entries(themeExtraMappings)) {
                const rawVal = rootStyle.getPropertyValue(variable).trim() || cfg.default;
                const numVal = parseFloat(rawVal);
                const item = document.createElement('div');
                item.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;gap:10px;background:var(--primary-bg);padding:8px 10px;border-radius:10px;border:1px solid var(--border-color);';
                if (cfg.type === 'range') {
                    item.innerHTML = `
                        <label style="font-size:13px;flex:1;">${cfg.label}</label>
                        <input type="range" min="${cfg.min}" max="${cfg.max}" step="${cfg.step||1}" value="${numVal||parseFloat(cfg.default)}"
                            data-variable="${variable}" data-unit="${cfg.unit}"
                            style="flex:2;max-width:140px;accent-color:var(--accent-color);">
                        <span style="width:44px;text-align:right;font-size:12px;color:var(--text-secondary);">${numVal||parseFloat(cfg.default)}${cfg.unit}</span>`;
                    const rangeInput = item.querySelector('input[type="range"]');
                    const valLabel = item.querySelector('span');
                    rangeInput.addEventListener('input', () => {
                        const v = rangeInput.value + cfg.unit;
                        document.documentElement.style.setProperty(variable, v);
                        valLabel.textContent = rangeInput.value + cfg.unit;
                        if (variable === '--radius') { settings.borderRadius = rangeInput.value; throttledSaveData && throttledSaveData(); }
                        if (variable === '--message-line-height') { settings.messageLineHeight = parseFloat(rangeInput.value); throttledSaveData && throttledSaveData(); }
                    });
                } else if (cfg.type === 'select') {
                    const opts = cfg.options.map(o => `<option value="${o}" ${String(numVal||cfg.default)===o?'selected':''}>${o}</option>`).join('');
                    item.innerHTML = `<label style="font-size:13px;flex:1;">${cfg.label}</label><select data-variable="${variable}" style="padding:5px 10px;border-radius:8px;border:1px solid var(--border-color);background:var(--secondary-bg);color:var(--text-primary);font-size:13px;cursor:pointer;">${opts}</select>`;
                    item.querySelector('select').addEventListener('change', (e) => {
                        const newVal = e.target.value;
                        document.documentElement.style.setProperty(variable, newVal);
                        if (variable === '--message-font-weight') { settings.messageFontWeight = newVal; throttledSaveData && throttledSaveData(); }
                        if (variable === '--message-line-height') { settings.messageLineHeight = parseFloat(newVal); throttledSaveData && throttledSaveData(); }
                    });
                }
                grid.appendChild(item);
            }

            const previewHeading = document.createElement('div');
            previewHeading.style.cssText = 'grid-column:1/-1;font-size:11px;font-weight:700;color:var(--text-secondary);letter-spacing:1.5px;text-transform:uppercase;padding:8px 0 4px;border-bottom:1px solid var(--border-color);margin-top:6px;';
            previewHeading.textContent = '👁 实时预览';
            grid.appendChild(previewHeading);

            const previewBox = document.createElement('div');
            previewBox.style.cssText = 'grid-column:1/-1;background:var(--chat-bg,var(--primary-bg));border-radius:14px;padding:14px 12px;border:1px solid var(--border-color);';
            previewBox.innerHTML = `
                <div style="display:flex;align-items:flex-end;gap:8px;margin-bottom:10px;">
                    <div style="width:32px;height:32px;border-radius:50%;background:var(--accent-color);flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-user" style="font-size:12px;color:#fff;"></i>
                    </div>
                    <div class="message message-received" style="max-width:180px;">你是我朝夕相伴触手可及的虚拟</div>
                </div>
                <div style="display:flex;align-items:flex-end;gap:8px;justify-content:flex-end;">
                    <div class="message message-sent" style="max-width:180px;">你是我未曾拥有无法捕捉的亲昵</div>
                    <div style="width:32px;height:32px;border-radius:50%;background:var(--send-btn-bg,var(--accent-color));flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-paper-plane" style="font-size:11px;color:var(--send-btn-icon-color,#fff);"></i>
                    </div>
                </div>`;
            grid.appendChild(previewBox);
        }


        function applyTheme(colors, isReset = false) {
            if (isReset) {
                for (const variable of Object.keys(themeColorMappings)) {
                    document.documentElement.style.removeProperty(variable);
                }
                return;
            }
            if (!colors) return;
            for (const [variable, color] of Object.entries(colors)) {
                document.documentElement.style.setProperty(variable, color);
            }
        }
        
        function saveCurrentThemeAsPreset() {
            const presetName = prompt("请输入新主题方案的名称：");
            if (!presetName || !presetName.trim()) return;

            const newTheme = {
                id: `custom-${Date.now()}`,
                name: presetName.trim(),
                colors: {}
            };
            const root = document.documentElement;
            for (const variable of Object.keys(themeColorMappings)) {
                const val = root.style.getPropertyValue(variable) || getComputedStyle(root).getPropertyValue(variable).trim();
                if (val) newTheme.colors[variable] = val.trim();
            }
            for (const variable of Object.keys(themeExtraMappings)) {
                const val = root.style.getPropertyValue(variable) || getComputedStyle(root).getPropertyValue(variable).trim();
                if (val) newTheme.colors[variable] = val.trim();
            }
            customThemes.push(newTheme);
            settings.colorTheme = newTheme.id;
            saveCustomThemes();
            populateThemeSelector();
            showNotification(`主题 "${presetName}" 已保存`, "success");
        }

        function deleteCurrentPreset() {
            const selector = document.getElementById('theme-preset-selector');
            const selectedId = selector.value;
            if (!selectedId.startsWith('custom-')) {
                showNotification('无法删除预设主题', 'warning');
                return;
            }
            if (confirm(`确定要删除主题 "${selector.options[selector.selectedIndex].text}" 吗？`)) {
                customThemes = customThemes.filter(t => t.id !== selectedId);
                settings.colorTheme = 'gold'; 
                saveCustomThemes();
                updateUI();
                populateThemeSelector();
                populateThemeEditor(); 
                showNotification('主题已删除', 'success');
            }
        }

function populateThemeSelector() {
    const selector = document.getElementById('theme-preset-selector');
    selector.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = "current-editing";
    defaultOption.textContent = "当前编辑中...";
    selector.appendChild(defaultOption);

    if (customThemes.length > 0) {
        const customGroup = document.createElement('optgroup');
        customGroup.label = "我的自定义主题";
        customThemes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = theme.name;
            customGroup.appendChild(option);
        });
        selector.appendChild(customGroup);
    }

    if (settings.colorTheme.startsWith('custom-')) {
        selector.value = settings.colorTheme;
    } else {
        selector.value = "current-editing";
    }
    const overwriteBtn = document.getElementById('overwrite-theme-preset-btn');
    if (overwriteBtn) overwriteBtn.style.display = selector.value.startsWith('custom-') ? '' : 'none';
}
        
        function saveCustomThemes() {
             safeSetItem(`${APP_PREFIX}customThemes`, JSON.stringify(customThemes));
        }

        const THEME_COLOR_NAMES = {
            'gold': '金色', 'blue': '蓝色', 'purple': '紫色', 'green': '绿色',
            'pink': '粉色', 'black-white': '黑白', 'pastel': '柔蓝', 
            'sunset': '夕阳', 'forest': '森林', 'ocean': '深蓝'
        };
        const BUBBLE_STYLE_NAMES_SCM = { standard: '标准', rounded: '圆角', 'rounded-large': '大圆角', square: '方形' };

        async function captureCurrentSchemeAsync() {
            const root = document.documentElement;
            let chatBg = '';
            try {
                chatBg = await localforage.getItem(getStorageKey('chatBackground')) || '';
            } catch(e) {
                chatBg = safeGetItem(getStorageKey('chatBackground')) || '';
            }
            return {
                colorTheme: settings.colorTheme,
                isDarkMode: settings.isDarkMode,
                bubbleStyle: settings.bubbleStyle,
                fontSize: settings.fontSize,
                messageFontFamily: settings.messageFontFamily,
                messageFontWeight: settings.messageFontWeight,
                messageLineHeight: settings.messageLineHeight,
                customFontUrl: settings.customFontUrl || '',
                customBubbleCss: settings.customBubbleCss || '',
                inChatAvatarEnabled: settings.inChatAvatarEnabled,
                inChatAvatarSize: settings.inChatAvatarSize,
                chatBackground: chatBg,
                customColors: (() => {
                    const colors = {};
                    const mapped = Object.keys(themeColorMappings || {});
                    mapped.forEach(v => {
                        const val = root.style.getPropertyValue(v);
                        if (val) colors[v] = val.trim();
                    });
                    return colors;
                })()
            };
        }

        function captureCurrentScheme() {
            const root = document.documentElement;
            const chatBg = safeGetItem(getStorageKey('chatBackground')) || '';
            
            return {
                colorTheme: settings.colorTheme,
                isDarkMode: settings.isDarkMode,
                bubbleStyle: settings.bubbleStyle,
                fontSize: settings.fontSize,
                messageFontFamily: settings.messageFontFamily,
                messageFontWeight: settings.messageFontWeight,
                messageLineHeight: settings.messageLineHeight,
                customFontUrl: settings.customFontUrl || '',
                customBubbleCss: settings.customBubbleCss || '',
                inChatAvatarEnabled: settings.inChatAvatarEnabled,
                inChatAvatarSize: settings.inChatAvatarSize,
                chatBackground: chatBg,
                customColors: (() => {
                    const colors = {};
                    const mapped = Object.keys(themeColorMappings || {});
                    mapped.forEach(v => {
                        const val = root.style.getPropertyValue(v);
                        if (val) colors[v] = val.trim();
                    });
                    return colors;
                })()
            };
        }

        function applyScheme(scheme) {
            settings.colorTheme = scheme.colorTheme;
            settings.isDarkMode = scheme.isDarkMode;
            settings.bubbleStyle = scheme.bubbleStyle;
            settings.fontSize = scheme.fontSize;
            settings.messageFontFamily = scheme.messageFontFamily;
            settings.messageFontWeight = scheme.messageFontWeight;
            settings.messageLineHeight = scheme.messageLineHeight;
            settings.customFontUrl = scheme.customFontUrl || '';
            settings.customBubbleCss = scheme.customBubbleCss || '';
            settings.inChatAvatarEnabled = scheme.inChatAvatarEnabled;
            settings.inChatAvatarSize = scheme.inChatAvatarSize;

            settings.customThemeColors = (scheme.customColors && Object.keys(scheme.customColors).length > 0)
                ? Object.assign({}, scheme.customColors)
                : {};
            
            const root = document.documentElement;
            if (scheme.customColors && Object.keys(scheme.customColors).length > 0) {
                Object.entries(scheme.customColors).forEach(([v, c]) => {
                    root.style.setProperty(v, c);
                });
            } else {
                if (themeColorMappings) {
                    Object.keys(themeColorMappings).forEach(v => root.style.removeProperty(v));
                }
            }
            
            if (scheme.customFontUrl) {
                try { applyCustomFont(scheme.customFontUrl); } catch(e) {}
            } else {
                document.documentElement.style.setProperty('--message-font-family', scheme.messageFontFamily || "'Noto Serif SC', serif");
                document.documentElement.style.setProperty('--font-family', scheme.messageFontFamily || "'Noto Serif SC', serif");
            }
            
            if (scheme.customBubbleCss) {
                try { applyCustomBubbleCss(scheme.customBubbleCss); } catch(e) {}
            }
            
            if (scheme.chatBackground) {
                applyBackground(scheme.chatBackground);
                safeSetItem(getStorageKey('chatBackground'), scheme.chatBackground);
            }

            updateUI();
            throttledSaveData();
            renderThemeSchemesList();
        }

        function getSchemePreviewColors(scheme) {
            const colorMap = {
                gold: ['#c5a47e', '#f5f5f5', '#333333'],
                blue: ['#7FA6CD', '#e8f0f8', '#333333'],
                purple: ['#BB9EC7', '#f3eef7', '#333333'],
                green: ['#7BC8A4', '#edf8f3', '#333333'],
                pink: ['#F4A6B3', '#fef0f3', '#333333'],
                'black-white': ['#333333', '#f9f9f9', '#666666'],
                pastel: ['#A8D8EA', '#edf7fc', '#333333'],
                sunset: ['#FF9A8B', '#fff0ee', '#333333'],
                forest: ['#7BA05B', '#eef5e8', '#333333'],
                ocean: ['#4A90E2', '#e8f1fc', '#333333'],
            };
            const theme = scheme.colorTheme;
            if (theme && theme.startsWith('custom-')) {
                const c = scheme.customColors && scheme.customColors['--accent-color'];
                return [c || '#aaa', scheme.isDarkMode ? '#222' : '#f5f5f5', '#888'];
            }
            return colorMap[theme] || ['#aaa', '#f5f5f5', '#888'];
        }

        function renderThemeSchemesList() {
            const list = document.getElementById('theme-schemes-list');
            const empty = document.getElementById('theme-schemes-empty');
            if (!list) return;
            
            list.querySelectorAll('.theme-scheme-item').forEach(el => el.remove());
            
            if (themeSchemes.length === 0) {
                if (empty) empty.style.display = 'flex';
                return;
            }
            if (empty) empty.style.display = 'none';
            
            themeSchemes.forEach(scheme => {
                const dots = getSchemePreviewColors(scheme);
                const bubbleName = BUBBLE_STYLE_NAMES_SCM[scheme.bubbleStyle] || '标准';
                const darkLabel = scheme.isDarkMode ? '夜' : '昼';
                const themeName = THEME_COLOR_NAMES[scheme.colorTheme] || scheme.colorTheme;
                const meta = `${darkLabel} · ${themeName} · ${bubbleName} · ${scheme.fontSize}px`;
                
                const item = document.createElement('div');
                item.className = 'theme-scheme-item';
                item.dataset.schemeId = scheme.id;
                item.innerHTML = `
                    <div class="scheme-preview-dots">
                        ${dots.map(c => `<div class="scheme-dot" style="background:${c};"></div>`).join('')}
                    </div>
                    <div class="scheme-info">
                        <div class="scheme-name">${scheme.name}</div>
                        <div class="scheme-meta">${meta}</div>
                    </div>
                    <div class="scheme-actions">
                        <button class="scheme-action-btn" title="应用方案" onclick="applyThemeScheme('${scheme.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="scheme-action-btn" title="在编辑器中编辑" onclick="editThemeScheme('${scheme.id}', event)" style="color:var(--accent-color);">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="scheme-action-btn delete" title="删除方案" onclick="deleteThemeScheme('${scheme.id}', event)">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                list.appendChild(item);
            });
        }

        window.applyThemeScheme = function(id) {
            const scheme = themeSchemes.find(s => s.id === id);
            if (!scheme) return;
            applyScheme(scheme);
            showNotification(`✨ 已应用方案「${scheme.name}」`, 'success');
        };

        window.deleteThemeScheme = function(id, event) {
            if (event) event.stopPropagation();
            const scheme = themeSchemes.find(s => s.id === id);
            if (!scheme) return;
            if (confirm(`确定要删除方案「${scheme.name}」吗？`)) {
                themeSchemes = themeSchemes.filter(s => s.id !== id);
                localforage.setItem(`${APP_PREFIX}themeSchemes`, themeSchemes);
                renderThemeSchemesList();
                showNotification('方案已删除', 'success');
            }
        };

        window.editThemeScheme = function(id, event) {
            if (event) event.stopPropagation();
            const scheme = themeSchemes.find(s => s.id === id);
            if (!scheme) return;
            applyScheme(scheme);
            const appearanceModal = document.getElementById('appearance-modal');
            const editorModal = document.getElementById('theme-editor-modal');
            if (appearanceModal) hideModal(appearanceModal);
            populateThemeEditor(scheme.customColors && Object.keys(scheme.customColors).length > 0 ? scheme.customColors : null);
            populateThemeSelector();
            if (editorModal) showModal(editorModal);
            const selector = document.getElementById('theme-preset-selector');
            if (selector && scheme.id.startsWith('custom-')) selector.value = scheme.id;
            showNotification(`正在编辑方案「${scheme.name}」，修改后点击💾保存`, 'info');
        };

        function initThemeSchemes() {
            const saveBtn = document.getElementById('save-theme-scheme-btn');
            if (saveBtn) {
                saveBtn.onclick = async () => {
                    const name = prompt('请为当前主题方案命名：', `方案 ${themeSchemes.length + 1}`);
                    if (!name || !name.trim()) return;
                    const scheme = await captureCurrentSchemeAsync();
                    scheme.id = `scheme-${Date.now()}`;
                    scheme.name = name.trim();
                    scheme.savedAt = Date.now();
                    themeSchemes.push(scheme);
                    localforage.setItem(`${APP_PREFIX}themeSchemes`, themeSchemes);
                    renderThemeSchemesList();
                    showNotification(`✨ 方案「${name}」已保存（含背景图）！`, 'success');
                };
            }
            renderThemeSchemesList();
        }

window.switchStatsTab = function(tab) {
    var statsPanel = document.getElementById('stats-panel');
    var favoritesPanel = document.getElementById('favorites-panel');
    var searchPanel = document.getElementById('search-panel');
    var wordcloudPanel = document.getElementById('wordcloud-panel');
    var allBtns = document.querySelectorAll('.stats-nav-btn');
    allBtns.forEach(function(b) { b.classList.remove('active'); });
    var activeBtn = document.querySelector('.stats-nav-btn[data-tab="' + tab + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    if (statsPanel) statsPanel.style.display = 'none';
    if (favoritesPanel) favoritesPanel.style.display = 'none';
    if (searchPanel) searchPanel.style.display = 'none';
    if (wordcloudPanel) wordcloudPanel.style.display = 'none';

    if (tab === 'stats') {
        if (statsPanel) statsPanel.style.display = 'block';
    } else if (tab === 'search') {
        if (searchPanel) searchPanel.style.display = 'block';
        setTimeout(function() {
            var inp = document.getElementById('msg-search-input');
            if (inp) inp.focus();
        }, 100);
    } else if (tab === 'wordcloud') {
        if (wordcloudPanel) wordcloudPanel.style.display = 'block';
        requestAnimationFrame(function() {
            if (typeof renderWordCloud === 'function') renderWordCloud();
        });
    } else {
        if (favoritesPanel) favoritesPanel.style.display = 'block';
        if (typeof renderFavorites === 'function') renderFavorites();
    }
};

var groupChatSettings = (function() {
    try {
        var saved = JSON.parse(localStorage.getItem('groupChatSettings') || 'null');
        if (!saved) return { enabled: false, showAvatar: true, showName: true, members: [] };
        if (!saved.members) saved.members = [];
        return saved;
    } catch(e) { return { enabled: false, showAvatar: true, showName: true, members: [] }; }
})();
(function loadGroupAvatars() {
    if (!window.localforage) return;
    var members = groupChatSettings.members || [];
    if (members.length === 0) return;
    var promises = members.map(function(m, i) {
        var ref = m.avatarRef || (m.id ? 'gca_' + m.id : 'gca_' + i);
        return localforage.getItem(ref).then(function(avatar) {
            m.avatar = avatar || null;
        }).catch(function() { m.avatar = null; });
    });
    Promise.all(promises).then(function() {
        if (typeof renderGroupMembersList === 'function') renderGroupMembersList();
    });
})();
var _groupMemberAvatarDataUrl = null;

function saveGroupChatSettings() {
    var members = groupChatSettings.members || [];
    var toSave = {
        enabled: groupChatSettings.enabled,
        showAvatar: groupChatSettings.showAvatar,
        showName: groupChatSettings.showName,
        members: members.map(function(m) {
            if (!m.id) m.id = 'gcm_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
            return { name: m.name, id: m.id, avatarRef: 'gca_' + m.id };
        })
    };
    try {
        localStorage.setItem('groupChatSettings', JSON.stringify(toSave));
    } catch(e) {
        console.warn('groupChatSettings localStorage保存失败:', e);
    }
    if (window.localforage) {
        members.forEach(function(m) {
            if (!m.id) m.id = 'gcm_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
            localforage.setItem('gca_' + m.id, m.avatar || null).catch(function(e) {
                console.warn('头像存储失败 id=' + m.id, e);
            });
        });
    }
}

function renderGroupMembersList() {
    var list = document.getElementById('group-members-list');
    if (!list) return;
    if (!groupChatSettings.members || groupChatSettings.members.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);font-size:13px;">暂无成员，点击添加按钮添加</div>';
        return;
    }
    list.innerHTML = groupChatSettings.members.map(function(m, i) {
        var avatarHtml = m.avatar
            ? '<img src="' + m.avatar + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">'
            : '<div style="width:36px;height:36px;border-radius:50%;background:rgba(var(--accent-color-rgb),0.15);display:flex;align-items:center;justify-content:center;"><i class="fas fa-user" style="font-size:14px;color:var(--accent-color);"></i></div>';
        return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--primary-bg);border:1px solid var(--border-color);border-radius:10px;">'
            + avatarHtml
            + '<span style="flex:1;font-size:13px;font-weight:500;">' + (m.name || '成员' + (i+1)) + '</span>'
            + '<button onclick="openEditGroupMember(' + i + ')" style="background:none;border:none;cursor:pointer;color:var(--accent-color);font-size:14px;padding:4px 8px;"><i class="fas fa-edit"></i></button>'
            + '<button onclick="deleteGroupMember(' + i + ')" style="background:none;border:none;cursor:pointer;color:#ff4757;font-size:14px;padding:4px 8px;"><i class="fas fa-trash-alt"></i></button>'
            + '</div>';
    }).join('');
}

function updateGroupModeUI() {
    var pill = document.getElementById('group-mode-pill');
    var knob = document.getElementById('group-mode-knob');
    var status = document.getElementById('group-mode-status');
    var displaySection = document.getElementById('group-display-section');
    var membersSection = document.getElementById('group-members-section');
    if (!pill) return;
    if (groupChatSettings.enabled) {
        pill.style.background = 'var(--accent-color)';
        knob.style.left = '22px';
        status.textContent = '已开启 — 收到的消息随机显示成员';
        displaySection.style.display = 'block';
        membersSection.style.display = 'block';
    } else {
        pill.style.background = 'var(--border-color)';
        knob.style.left = '3px';
        status.textContent = '已关闭 — 点击开启';
        displaySection.style.display = 'none';
        membersSection.style.display = 'none';
    }
    var avatarPill = document.getElementById('group-show-avatar-pill');
    var avatarKnob = document.getElementById('group-show-avatar-knob');
    if (avatarPill) {
        avatarPill.style.background = groupChatSettings.showAvatar ? 'var(--accent-color)' : 'var(--border-color)';
        avatarKnob.style.right = groupChatSettings.showAvatar ? '3px' : '19px';
    }
    var namePill = document.getElementById('group-show-name-pill');
    var nameKnob = document.getElementById('group-show-name-knob');
    if (namePill) {
        namePill.style.background = groupChatSettings.showName ? 'var(--accent-color)' : 'var(--border-color)';
        nameKnob.style.right = groupChatSettings.showName ? '3px' : '19px';
    }
    renderGroupMembersList();
}

document.addEventListener('DOMContentLoaded', function() {
    var groupModeToggle = document.getElementById('group-mode-toggle');
    if (groupModeToggle) {
        groupModeToggle.addEventListener('click', function() {
            groupChatSettings.enabled = !groupChatSettings.enabled;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var showAvatarToggle = document.getElementById('group-show-avatar-toggle');
    if (showAvatarToggle) {
        showAvatarToggle.addEventListener('click', function() {
            groupChatSettings.showAvatar = !groupChatSettings.showAvatar;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var showNameToggle = document.getElementById('group-show-name-toggle');
    if (showNameToggle) {
        showNameToggle.addEventListener('click', function() {
            groupChatSettings.showName = !groupChatSettings.showName;
            saveGroupChatSettings();
            updateGroupModeUI();
        });
    }
    var closeGroupChat = document.getElementById('close-group-chat');
    if (closeGroupChat) {
        closeGroupChat.addEventListener('click', function() {
            var m = document.getElementById('group-chat-modal');
            if (m && typeof hideModal === 'function') hideModal(m);
        });
    }
    setTimeout(updateGroupModeUI, 200);
});

window.openAddGroupMember = function() {
    _groupMemberAvatarDataUrl = null;
    document.getElementById('group-member-edit-title').textContent = '添加成员';
    document.getElementById('group-member-name-input').value = '';
    document.getElementById('group-member-edit-index').value = '';
    var preview = document.getElementById('group-member-avatar-preview');
    preview.innerHTML = '<i class="fas fa-camera" style="font-size:20px;color:var(--text-secondary);"></i>';
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof showModal === 'function') showModal(m);
};

window.openEditGroupMember = function(idx) {
    var member = groupChatSettings.members[idx];
    if (!member) return;
    _groupMemberAvatarDataUrl = member.avatar || null;
    document.getElementById('group-member-edit-title').textContent = '编辑成员';
    document.getElementById('group-member-name-input').value = member.name || '';
    document.getElementById('group-member-edit-index').value = idx;
    var preview = document.getElementById('group-member-avatar-preview');
    if (member.avatar) {
        preview.innerHTML = '<img src="' + member.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    } else {
        preview.innerHTML = '<i class="fas fa-camera" style="font-size:20px;color:var(--text-secondary);"></i>';
    }
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof showModal === 'function') showModal(m);
};

window.closeGroupMemberEdit = function() {
    var m = document.getElementById('group-member-edit-modal');
    if (m && typeof hideModal === 'function') hideModal(m);
};

window.previewGroupMemberAvatar = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        _groupMemberAvatarDataUrl = e.target.result;
        var preview = document.getElementById('group-member-avatar-preview');
        preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
    };
    reader.readAsDataURL(file);
};

window.saveGroupMember = function() {
    var name = (document.getElementById('group-member-name-input').value || '').trim();
    if (!name) { alert('请输入成员名字'); return; }
    var idxVal = document.getElementById('group-member-edit-index').value;
    var member = { name: name, avatar: _groupMemberAvatarDataUrl };
    if (idxVal !== '') {
        groupChatSettings.members[parseInt(idxVal)] = member;
    } else {
        if (!groupChatSettings.members) groupChatSettings.members = [];
        groupChatSettings.members.push(member);
    }
    saveGroupChatSettings();
    renderGroupMembersList();
    window.closeGroupMemberEdit();
};

window.deleteGroupMember = function(idx) {
    if (!confirm('确定删除该成员吗？')) return;
    groupChatSettings.members.splice(idx, 1);
    saveGroupChatSettings();
    renderGroupMembersList();
};

window.getGroupMemberForMessage = function(msgId) {
    if (!groupChatSettings.enabled || !groupChatSettings.members || groupChatSettings.members.length === 0) return null;
    var seed = 0;
    var idStr = String(msgId);
    for (var i = 0; i < idStr.length; i++) seed += idStr.charCodeAt(i) * (i + 1);
    return groupChatSettings.members[seed % groupChatSettings.members.length];
};

document.addEventListener('DOMContentLoaded', function() {
    var exportAllBtn = document.getElementById('export-all-settings');
    var importAllBtn = document.getElementById('import-all-settings');
if (exportAllBtn) {
        exportAllBtn.addEventListener('click', async function() {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
            overlay.innerHTML = `
                <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                    <div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:4px;display:flex;align-items:center;gap:8px;">
                        <i class="fas fa-archive" style="color:var(--accent-color);font-size:14px;"></i>全量备份导出
                    </div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:16px;">图片/头像/背景等二进制文件已自动排除，选择需要备份的模块</div>
                    <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:20px;">
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_msgs" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-comments" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>聊天记录 <span style="font-size:11px;color:var(--text-secondary);">(${messages.length} 条)</span></span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_settings" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sliders-h" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>外观与聊天设置</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_custom" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-reply" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>字卡 / 拍一拍 / 状态 / 格言</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_ann" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-calendar-heart" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>纪念日 / 倒计时</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_themes" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-palette" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>自定义主题 / 方案</span>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:10px 12px;border:1px solid var(--border-color);border-radius:12px;background:var(--primary-bg);font-size:13px;color:var(--text-primary);">
                            <input type="checkbox" id="_bk_dg" checked style="accent-color:var(--accent-color);width:15px;height:15px;">
                            <i class="fas fa-sun" style="color:var(--accent-color);width:16px;text-align:center;"></i>
                            <span>每日公告 / 心情数据</span>
                        </label>
                    </div>
                    <div style="display:flex;gap:10px;">
                        <button id="_bk_cancel" style="flex:1;padding:11px;border:1px solid var(--border-color);border-radius:12px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>
                        <button id="_bk_confirm" style="flex:2;padding:11px;border:none;border-radius:12px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font-family);display:flex;align-items:center;justify-content:center;gap:7px;">
                            <i class="fas fa-download"></i>导出备份
                        </button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);

            function closeBkDialog() { overlay.remove(); }
            overlay.addEventListener('click', ev => { if (ev.target === overlay) closeBkDialog(); });
            document.getElementById('_bk_cancel').onclick = closeBkDialog;

            document.getElementById('_bk_confirm').onclick = async function() {
                const inclMsgs    = document.getElementById('_bk_msgs').checked;
                const inclSet     = document.getElementById('_bk_settings').checked;
                const inclCustom  = document.getElementById('_bk_custom').checked;
                const inclAnn     = document.getElementById('_bk_ann').checked;
                const inclThemes  = document.getElementById('_bk_themes').checked;
                const inclDg      = document.getElementById('_bk_dg').checked;

                if (!inclMsgs && !inclSet && !inclCustom && !inclAnn && !inclThemes && !inclDg) {
                    showNotification('请至少选择一项', 'error');
                    return;
                }
                closeBkDialog();

                try {
                    const skipKeys = [
                        'stickerLibrary', 'myStickerLibrary', 'backgroundGallery',
                        'chatBackground', 'partnerAvatar', 'myAvatar', 'playerCover',
                        'dg_header_bg', 'dg_overlay_bg'
                    ];

                    const moduleSkipPatterns = [];
                    if (!inclMsgs)   moduleSkipPatterns.push('chatMessages');
                    if (!inclSet)    moduleSkipPatterns.push('chatSettings', 'partnerPersonas', 'showPartnerNameInChat');
                    if (!inclCustom) moduleSkipPatterns.push('customReplies', 'customPokes', 'customStatuses', 'customMottos', 'customIntros', 'customEmojis');
                    if (!inclAnn)    moduleSkipPatterns.push('anniversaries');
                    if (!inclThemes) moduleSkipPatterns.push('customThemes', 'themeSchemes');
                    if (!inclDg)     moduleSkipPatterns.push('dg_custom_data', 'dg_status_pool', 'weekly_fortune');

                    function deepCleanLargeData(obj, depth) {
                        depth = depth || 0;
                        if (depth > 10) return obj;
                        if (obj === null || obj === undefined) return obj;
                        if (typeof obj === 'string') {
                            if (obj.startsWith('data:image/') && obj.length > 2000) return '[图片已跳过]';
                            return obj;
                        }
                        if (Array.isArray(obj)) return obj.map(item => deepCleanLargeData(item, depth + 1));
                        if (typeof obj === 'object') {
                            const newObj = {};
                            for (let k in obj) {
                                if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
                                if ((k === 'image' || k === 'decoImg' || k === 'iconImg' || k.includes('Avatar') || k.includes('Cover')) &&
                                    typeof obj[k] === 'string' && obj[k].startsWith('data:image/') && obj[k].length > 2000) continue;
                                newObj[k] = deepCleanLargeData(obj[k], depth + 1);
                            }
                            return newObj;
                        }
                        return obj;
                    }

                    const shouldSkipKey = (k) => {
                        if (skipKeys.some(s => k.includes(s))) return true;
                        if (k.startsWith('annHeaderBg_')) return true;
                        if (moduleSkipPatterns.some(p => k.includes(p))) return true;
                        if (!inclDg && (k === 'dg_custom_data' || k === 'dg_status_pool' || k.startsWith('customWeather_'))) return true;
                        return false;
                    };

                    var backup = {
                        version: 3,
                        type: 'full-backup-lite',
                        timestamp: new Date().toISOString(),
                        modules: { messages: inclMsgs, settings: inclSet, custom: inclCustom, anniversaries: inclAnn, themes: inclThemes, dg: inclDg }
                    };

                    var lsData = {};
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (shouldSkipKey(k)) continue;
                        try {
                            let val = localStorage.getItem(k);
                            try {
                                let parsed = JSON.parse(val);
                                val = JSON.stringify(deepCleanLargeData(parsed));
                            } catch(e) {
                                if (val.startsWith('data:image/') && val.length > 1000) continue;
                            }
                            lsData[k] = val;
                        } catch(e) { console.warn('处理 localStorage 失败:', k); }
                    }
                    backup.localStorage = lsData;

                    if (window.localforage) {
                        var lfData = {};
                        var keys = await localforage.keys();
                        for (var ki = 0; ki < keys.length; ki++) {
                            const key = keys[ki];
                            if (shouldSkipKey(key)) continue;
                            try {
                                const rawVal = await localforage.getItem(key);
                                if (rawVal === null || rawVal === undefined) continue;
                                lfData[key] = deepCleanLargeData(rawVal);
                            } catch(e) { console.warn('处理 localforage 失败:', key, e); }
                        }
                        backup.localforage = lfData;
                        if (typeof SESSION_ID !== 'undefined') backup.sessionId = SESSION_ID;
                    }

                    var dataStr = JSON.stringify(backup, null, 0);
                    var bom = '\uFEFF';
                    var blob = new Blob([bom + dataStr], { type: 'application/json;charset=utf-8' });
                    var exportFileName = 'chatapp-backup-' + new Date().toISOString().slice(0,10) + '.json';

                    if (navigator.share && /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
                        var shareFile = new File([blob], exportFileName, { type: 'application/json' });
                        if (navigator.canShare && navigator.canShare({ files: [shareFile] })) {
                            navigator.share({ files: [shareFile], title: '传讯全量备份', text: '备份日期：' + new Date().toLocaleDateString() })
                                .catch(function() {
                                    var url2 = URL.createObjectURL(blob);
                                    var link2 = document.createElement('a');
                                    link2.href = url2; link2.download = exportFileName;
                                    document.body.appendChild(link2); link2.click(); document.body.removeChild(link2);
                                    setTimeout(() => URL.revokeObjectURL(url2), 2000);
                                });
                            if (typeof showNotification === 'function') showNotification('备份导出成功', 'success');
                            return;
                        }
                    }

                    var url = URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = exportFileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 2000);
                    if (typeof showNotification === 'function') showNotification('备份导出成功', 'success');
                } catch(e) {
                    console.error('全量备份导出失败:', e);
                    if (typeof showNotification === 'function') showNotification('导出失败，请重试', 'error');
                }
            };
        });
    }
if (importAllBtn) {
        importAllBtn.addEventListener('click', function() {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = async function(e) {
                var file = e.target.files[0];
                if (!file) return;
                
                if (file.size > 100 * 1024 * 1024) {
                    if (typeof showNotification === 'function') showNotification('文件过大，请检查是否是正确的备份文件', 'error');
                    return;
                }
                
                var reader = new FileReader();
                reader.onload = async function(ev) {
                    try {
                        var backup;
                        try {
                            var rawText = ev.target.result;
                            if (rawText.charCodeAt(0) === 0xFEFF) rawText = rawText.slice(1);
                            backup = JSON.parse(rawText);
                        } catch(parseErr) {
                            if (typeof showNotification === 'function') showNotification('文件解析失败，文件可能已损坏或不是有效的 JSON', 'error');
                            return;
                        }
                        
                        if (!backup || !backup.type || !backup.type.includes('backup')) throw new Error('不是有效的传讯备份文件');
                        
                        if (!confirm('导入全量备份将覆盖当前的聊天记录和设置。\n\n注：你设备上现有的头像、背景和表情包会被安全保留。\n\n确定继续吗？')) return;
                        
                        if (backup.localStorage) {
                            for (var k in backup.localStorage) {
                                if (!Object.prototype.hasOwnProperty.call(backup.localStorage, k)) continue;
                                try {
                                    var lsVal = backup.localStorage[k];
                                    if (typeof lsVal === 'string' && lsVal.startsWith('data:image/') && lsVal.length > 2000) continue;
                                    localStorage.setItem(k, lsVal);
                                } catch(e) { console.warn('恢复 localStorage 失败:', k); }
                            }
                        }

                        if (window.localforage && backup.localforage) {
                            var lfKeys = Object.keys(backup.localforage);
                            
                            var backupSessionId = backup.sessionId || null;
                            if (!backupSessionId) {
                                var pfxAuto = typeof APP_PREFIX !== 'undefined' ? APP_PREFIX : 'CHAT_APP_V3_';
                                var skipParts = ['MIGRATION', 'sessionList', 'lastSessionId', 'customThemes', 'themeSchemes'];
                                for (var si = 0; si < lfKeys.length; si++) {
                                    var sk = lfKeys[si];
                                    if (!sk.startsWith(pfxAuto)) continue;
                                    if (skipParts.some(function(s) { return sk.startsWith(pfxAuto + s); })) continue;
                                    var afterPfx = sk.slice(pfxAuto.length);
                                    var uIdx = afterPfx.indexOf('_');
                                    if (uIdx > 0) { backupSessionId = afterPfx.slice(0, uIdx); break; }
                                }
                            }

                            var needRemap = backupSessionId && 
                                           typeof SESSION_ID !== 'undefined' && 
                                           SESSION_ID && 
                                           backupSessionId !== SESSION_ID;

                            for (var li = 0; li < lfKeys.length; li++) {
                                var lk = lfKeys[li];
                                var targetKey = lk;
                                if (needRemap && lk.includes(backupSessionId)) {
                                    targetKey = lk.replace(new RegExp(backupSessionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), SESSION_ID);
                                }
                                try {
                                    await localforage.setItem(targetKey, backup.localforage[lk]);
                                } catch(e) { console.warn('恢复 localforage 失败:', targetKey, e); }
                            }
                            if (typeof APP_PREFIX !== 'undefined' && typeof SESSION_ID !== 'undefined') {
                                try { await localforage.setItem(APP_PREFIX + 'lastSessionId', SESSION_ID); } catch(e) {}
                            }
                        }
                        
                        if (typeof showNotification === 'function') showNotification('数据恢复成功，即将刷新页面应用更改', 'success', 2000);
                        setTimeout(function() { location.reload(); }, 2000);
                    } catch(e) {
                        if (typeof showNotification === 'function') showNotification('导入失败：' + e.message, 'error');
                        console.error('导入报错:', e);
                    }
                };
                reader.onerror = function() {
                    if (typeof showNotification === 'function') showNotification('文件读取失败，请重试', 'error');
                };
                reader.readAsText(file, 'UTF-8');
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        });
    }
});

window.startEditDgWeather = function(el) {
    var current = el.textContent.trim();
    var input = document.createElement('input');
    input.type = 'text';
    input.value = current;
    input.maxLength = 20;
    input.style.cssText = 'width:120px;padding:2px 6px;border:1px solid var(--accent-color);border-radius:6px;font-size:13px;background:var(--primary-bg);color:var(--text-primary);outline:none;';
    el.style.display = 'none';
    el.parentNode.insertBefore(input, el.nextSibling);
    input.focus();
    input.select();
    function saveWeather() {
        var val = input.value.trim() || current;
        el.textContent = val;
        el.style.display = '';
        input.remove();
        var now = new Date();
        var dateKey = 'customWeather_' + now.getFullYear() + '_' + (now.getMonth()+1) + '_' + now.getDate();
        localStorage.setItem(dateKey, val);
    }
    input.addEventListener('blur', saveWeather);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); saveWeather(); }
        if (e.key === 'Escape') { el.style.display = ''; input.remove(); }
    });
};

    document.addEventListener('focusin', function(e) {
        if (e.target && (e.target.classList.contains('message-input') || e.target.tagName === 'TEXTAREA')) {
            setTimeout(function() {
                var chat = document.querySelector('.chat-container');
                if (chat) chat.scrollTop = chat.scrollHeight;
            }, 100);
        }
    });


window._runMsgSearch = function() {
    var input = document.getElementById('msg-search-input');
    var dateFrom = document.getElementById('msg-search-date-from');
    var dateTo = document.getElementById('msg-search-date-to');
    var resultsEl = document.getElementById('msg-search-results');
    if (!input || !resultsEl) return;

    var q = input.value.trim().toLowerCase();
    var from = dateFrom && dateFrom.value ? new Date(dateFrom.value) : null;
    var to = dateTo && dateTo.value ? new Date(dateTo.value + 'T23:59:59') : null;

    var allMessages = (typeof messages !== 'undefined' ? messages : [])
        .filter(function(m) { return m.type !== 'system'; });

    var filtered = allMessages.filter(function(m) {
        var matchText = !q || (m.text && m.text.toLowerCase().includes(q)) || (m.image && !q);
        if (q && m.image && !m.text) matchText = false;
        if (q) matchText = m.text && m.text.toLowerCase().includes(q);
        var ts = m.timestamp ? new Date(m.timestamp) : null;
        var matchFrom = !from || (ts && ts >= from);
        var matchTo = !to || (ts && ts <= to);
        return matchText && matchFrom && matchTo;
    });

    if (!q && !from && !to) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-secondary);font-size:13px;">输入关键词或选择日期开始搜索</div>';
        return;
    }

    if (filtered.length === 0) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-secondary);font-size:13px;">未找到相关消息</div>';
        return;
    }

    var myAvatarEl = document.querySelector('#my-avatar img');
    var partnerAvatarEl = document.querySelector('#partner-avatar img');
    var myAvatar = myAvatarEl ? myAvatarEl.src : '';
    var partnerAvatar = partnerAvatarEl ? partnerAvatarEl.src : '';
    var myName = (typeof settings !== 'undefined' && settings.myName) || '我';
    var partnerName = (typeof settings !== 'undefined' && settings.partnerName) || '对方';

    function highlight(text) {
        if (!q || !text) return (text || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var safe = text.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        var safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return safe.replace(new RegExp('(' + safeQ + ')', 'gi'), '<mark style="background:rgba(var(--accent-color-rgb,180,140,100),0.3);border-radius:2px;padding:0 1px;">$1</mark>');
    }

    resultsEl.innerHTML = filtered.map(function(msg) {
        var isUser = msg.sender === 'user';
        var name = isUser ? myName : partnerName;
        var avatar = isUser ? myAvatar : partnerAvatar;

        if (!isUser && typeof groupChatSettings !== 'undefined' && groupChatSettings.enabled && groupChatSettings.members) {
            var member = groupChatSettings.members.find(function(m) { return m.name === msg.sender; });
            if (member) {
                name = member.name;
                avatar = member.avatar || '';
            }
        }

        var ts = msg.timestamp ? new Date(msg.timestamp).toLocaleString('zh-CN', {
            month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'
        }) : '';

        var avatarHtml = avatar
            ? '<img src="' + avatar + '" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0;">'
            : '<div style="width:34px;height:34px;border-radius:50%;background:rgba(var(--accent-color-rgb,180,140,100),0.18);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-user" style="font-size:14px;color:var(--accent-color);"></i></div>';

        var contentHtml = '';
        if (msg.text) contentHtml += '<div style="font-size:13px;color:var(--text-primary);line-height:1.5;word-break:break-word;margin-top:3px;">' + highlight(msg.text) + '</div>';
        if (msg.image) contentHtml += '<img src="' + msg.image + '" style="max-width:120px;max-height:90px;border-radius:8px;display:block;margin-top:5px;cursor:pointer;" onclick="if(typeof viewImage===\'function\')viewImage(\'' + msg.image.replace(/'/g,"\\'") + '\')" loading="lazy">';

        return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:12px;background:var(--primary-bg);border:1px solid var(--border-color);margin-bottom:8px;cursor:pointer;" onclick="if(typeof scrollToMessage===\'function\')scrollToMessage(' + msg.id + ')">'
            + avatarHtml
            + '<div style="flex:1;min-width:0;">'
            + '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">'
            + '<span style="font-size:12px;font-weight:600;color:var(--accent-color);">' + name + '</span>'
            + '<span style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">' + ts + '</span>'
            + '</div>'
            + contentHtml
            + '</div></div>';
    }).join('');

    resultsEl.insertAdjacentHTML('afterbegin',
        '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;padding:0 2px;">共找到 ' + filtered.length + ' 条结果</div>'
    );
};

window.scrollToMessage = function(msgId) {
    var el = document.querySelector('[data-id="' + msgId + '"]');
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'background 0.3s';
        el.style.background = 'rgba(var(--accent-color-rgb,180,140,100),0.18)';
        setTimeout(function() { el.style.background = ''; }, 1500);
    }
};
// js/features/call.js

(function () {
    'use strict';

    const KEY_ENABLED  = 'callFeatureEnabled';
    const KEY_POS      = 'callWindowPos';
    const KEY_SIZE     = 'callWindowSize';
    const KEY_PILL_POS = 'callPillPos';
    const BG_LF_KEY    = 'callBgImageData';

    // 提示音 URL
    const RINGTONE_URL = 'https://www.image2url.com/r2/default/audio/1776588707598-e195d0b2-26fb-4bdc-b77c-c5539c32fb80.mp3';

    const S = {
        enabled:         localStorage.getItem(KEY_ENABLED) !== 'false',
        active:          false,
        startTime:       null,
        elapsed:         0,
        timerRAF:        null,
        minimized:       false,
        immersive:       false,
        bgImage:         null,
        pos:             JSON.parse(localStorage.getItem(KEY_POS)  || 'null'),
        pillPos:         JSON.parse(localStorage.getItem(KEY_PILL_POS) || 'null'),
        size:            JSON.parse(localStorage.getItem(KEY_SIZE) || '{"w":280,"h":440}'),
        dragOff:         null,
        pillDragOff:     null,
        pillDragged:     false,
        resizeInit:      null,
        incomingTimer:   null,
        connectingTimer: null,
        randomCallTimer: null,
        partnerHangupTimer: null,
        isPartnerCall:   false,
        ringtoneAudio:   null,      // 新增：提示音 Audio 对象
        soundEnabled:    true,      // 新增：音效开关（与全局设置同步）
    };

    // 初始化/获取提示音 Audio 对象
    function getRingtoneAudio() {
        if (!S.ringtoneAudio) {
            S.ringtoneAudio = new Audio(RINGTONE_URL);
            S.ringtoneAudio.loop = true;
            S.ringtoneAudio.volume = 0.4; // 适中音量
        }
        return S.ringtoneAudio;
    }

    // 播放提示音（循环）
    function playRingtone() {
        // 检查全局音效开关
        if (typeof settings !== 'undefined' && settings.soundEnabled === false) return;
        if (!S.soundEnabled) return;

        const audio = getRingtoneAudio();
        audio.currentTime = 0;
        audio.play().catch(e => {
            // 自动播放被阻止时，等待用户交互
            console.warn('提示音自动播放被阻止，等待用户交互:', e);
            const unlock = () => {
                audio.play().catch(() => {});
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
            };
            document.addEventListener('click', unlock, { once: true });
            document.addEventListener('touchstart', unlock, { once: true });
        });
    }

    // 停止提示音
    function stopRingtone() {
        if (S.ringtoneAudio) {
            S.ringtoneAudio.pause();
            S.ringtoneAudio.currentTime = 0;
        }
    }

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    function loadBg() {
        if (!window.localforage) return;
        localforage.getItem(BG_LF_KEY).then(v => { if (v) { S.bgImage = v; applyBg(); } }).catch(() => {});
    }
    function saveBg(d) {
        if (!d || !window.localforage) return;
        localforage.setItem(BG_LF_KEY, d).catch(() => {});
    }

    const SVG_HU = `<svg viewBox="0 0 24 24" fill="none" style="display:block;width:100%;height:100%;">
  <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.28-.27.68-.36 1.03-.24 1.1.37 2.3.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.56 21 3 13.44 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.28.2 2.5.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z" fill="white"/>
  <line x1="21" y1="3" x2="3" y2="21" stroke="white" stroke-width="2.4" stroke-linecap="round"/>
</svg>`;

    function injectCSS() {
        if (document.getElementById('call-feature-style')) return;
        const el = document.createElement('style');
        el.id = 'call-feature-style';
        el.textContent = `
#call-incoming-overlay{
    position:fixed;inset:0;z-index:99990;
    display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.62);
    backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);
}
#call-incoming-overlay.visible{display:flex;animation:cFi .35s ease;}
.call-inc-card{
    width:272px;
    background:linear-gradient(160deg,rgba(255,255,255,.11),rgba(255,255,255,.04));
    border:1px solid rgba(255,255,255,.18);border-radius:32px;
    padding:44px 28px 36px;
    display:flex;flex-direction:column;align-items:center;gap:8px;color:#fff;
    box-shadow:0 32px 80px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.15);
    animation:cCu .45s cubic-bezier(.22,1,.36,1);
    position:relative;overflow:hidden;
}
.call-inc-card::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse at 50% 0%,rgba(var(--accent-color-rgb,224,105,138),.28),transparent 65%);
}
.call-inc-ring{position:relative;margin-bottom:8px;width:88px;height:88px;}
.call-inc-ring::before,.call-inc-ring::after{
    content:'';position:absolute;
    top:-12px;left:-12px;right:-12px;bottom:-12px;
    border-radius:50%;border:1.5px solid rgba(255,255,255,.18);
    animation:cRp 2.2s ease-in-out infinite;
}
.call-inc-ring::after{
    top:-22px;left:-22px;right:-22px;bottom:-22px;
    border-color:rgba(255,255,255,.08);animation-delay:.65s;
}
.call-inc-avatar{
    position:absolute;inset:0;
    border-radius:50%;background:var(--accent-color,#e0698a);
    display:flex;align-items:center;justify-content:center;overflow:hidden;
    border:2px solid rgba(255,255,255,.25);box-shadow:0 8px 28px rgba(0,0,0,.36);
}
.call-inc-avatar img{width:100%;height:100%;object-fit:cover;}
.call-inc-avatar i{font-size:34px;color:rgba(255,255,255,.85);}
.call-inc-name{font-size:22px;font-weight:700;margin-top:4px;}
.call-inc-sub{font-size:12.5px;color:rgba(255,255,255,.48);display:flex;align-items:center;gap:6px;}
.call-inc-sub-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.48);animation:cBl 1.1s step-end infinite;}
.call-inc-actions{display:flex;gap:44px;margin-top:26px;}
.call-inc-btn{display:flex;flex-direction:column;align-items:center;gap:7px;background:none;border:none;cursor:pointer;color:#fff;}
.call-inc-circle{
    width:64px;height:64px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    transition:transform .18s;padding:16px;
}
.call-inc-btn:hover .call-inc-circle{transform:scale(1.1);}
.call-inc-btn:active .call-inc-circle{transform:scale(.9);}
.call-inc-reject .call-inc-circle{background:linear-gradient(135deg,#ff5252,#c62828);box-shadow:0 6px 20px rgba(255,82,82,.45);}
.call-inc-accept .call-inc-circle{background:linear-gradient(135deg,#4caf50,#2e7d32);box-shadow:0 6px 20px rgba(76,175,80,.45);padding:18px;}
.call-inc-lbl{font-size:12px;color:rgba(255,255,255,.48);font-weight:500;}

#call-window{
    position:fixed;z-index:99900;
    border-radius:22px;overflow:visible;
    display:none;flex-direction:column;
    box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.1);
    user-select:none;touch-action:none;
    min-width:160px;min-height:240px;
    max-width:90vw;max-height:90vh;
}
#call-window.visible{display:flex;animation:cWi .4s cubic-bezier(.22,1,.36,1);}

#call-window-inner{
    border-radius:22px;overflow:hidden;
    flex:1;display:flex;flex-direction:column;position:relative;
}

#call-window-bg{position:absolute;inset:0;z-index:0;}
.call-bg-grad{position:absolute;inset:0;background:linear-gradient(155deg,#0d1b2a 0%,#1b263b 50%,#415a77 100%);}
#call-window-bg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none;}
.call-orb{position:absolute;border-radius:50%;filter:blur(44px);opacity:.28;animation:cOrb linear infinite;pointer-events:none;}
.call-orb-1{width:130px;height:130px;background:var(--accent-color,#e0698a);top:-25px;left:-25px;animation-duration:18s;}
.call-orb-2{width:90px;height:90px;background:#4a90d9;bottom:10px;right:-10px;animation-duration:23s;animation-delay:-9s;}
.call-orb-3{width:70px;height:70px;background:#9b59b6;top:40%;left:45%;animation-duration:28s;animation-delay:-14s;}
.call-overlay{
    position:absolute;inset:0;z-index:1;transition:opacity .4s;
    background:linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.04) 35%,rgba(0,0,0,.04) 60%,rgba(0,0,0,.65) 100%);
}

#call-window-header{
    position:relative;z-index:10;
    display:flex;align-items:center;justify-content:space-between;
    padding:12px 12px 6px;cursor:grab;transition:opacity .35s;flex-shrink:0;
}
#call-window-header:active{cursor:grabbing;}
.call-badge{
    display:flex;align-items:center;gap:5px;
    background:rgba(0,0,0,.32);backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:4px 10px;
}
.call-rec-dot{
    width:6px;height:6px;border-radius:50%;
    background:#4caf50;box-shadow:0 0 6px #4caf50;
    animation:cBl 1.8s ease-in-out infinite alternate;flex-shrink:0;
}
.call-timer-txt{
    font-size:11px;font-weight:700;letter-spacing:.08em;
    color:rgba(255,255,255,.92);font-variant-numeric:tabular-nums;
}
.call-top-btns{display:flex;gap:3px;}
.call-top-btn{
    width:26px;height:26px;border-radius:50%;border:none;
    background:rgba(255,255,255,.12);backdrop-filter:blur(6px);
    color:rgba(255,255,255,.75);cursor:pointer;font-size:10px;
    display:flex;align-items:center;justify-content:center;
    transition:background .2s,transform .15s;
}
.call-top-btn:hover{background:rgba(255,255,255,.22);transform:scale(1.08);}

#call-connecting-state{
    position:relative;z-index:10;
    display:none;flex-direction:column;align-items:center;
    justify-content:center;flex:1;gap:10px;padding:16px 12px;
}
#call-connecting-state.visible{display:flex;}
.call-conn-dots{display:flex;gap:6px;margin-top:4px;}
.call-conn-dots span{
    width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5);
    animation:cCd .9s ease-in-out infinite;
}
.call-conn-dots span:nth-child(2){animation-delay:.15s;}
.call-conn-dots span:nth-child(3){animation-delay:.3s;}

#call-window-body{
    position:relative;z-index:10;
    flex:1;display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    gap:10px;padding:4px 12px;
}
.call-av-wrap{
    position:relative;
    width:68px;height:68px;  
    flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
}
.call-av-pulse{
    position:absolute;
    top:-10px;left:-10px;right:-10px;bottom:-10px;
    border-radius:50%;
    border:1.5px solid rgba(255,255,255,.22);
    animation:cAp 2.5s ease-in-out infinite;
    pointer-events:none;
}
.call-av-pulse2{
    position:absolute;
    top:-18px;left:-18px;right:-18px;bottom:-18px;
    border-radius:50%;
    border:1px solid rgba(255,255,255,.09);
    animation:cAp 2.5s ease-in-out infinite .65s;
    pointer-events:none;
}
.call-avatar{
    width:68px;height:68px;
    border-radius:50%;
    background:var(--accent-color,#e0698a);
    border:2.5px solid rgba(255,255,255,.28);
    overflow:hidden;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 6px 22px rgba(0,0,0,.4);
    position:relative;z-index:1;  
    flex-shrink:0;
}
.call-avatar img{width:100%;height:100%;object-fit:cover;}
.call-avatar i{font-size:26px;color:rgba(255,255,255,.82);}

.call-name{
    font-size:16px;font-weight:700;color:#fff;
    text-shadow:0 2px 8px rgba(0,0,0,.5);
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    max-width:88%;text-align:center;
}
.call-wave{display:flex;align-items:center;gap:3px;height:18px;}
.call-wave span{width:3px;border-radius:3px;background:rgba(255,255,255,.5);animation:cWv .85s ease-in-out infinite;}
.call-wave span:nth-child(1){height:6px;animation-delay:0s;}
.call-wave span:nth-child(2){height:13px;animation-delay:.1s;}
.call-wave span:nth-child(3){height:18px;animation-delay:.2s;}
.call-wave span:nth-child(4){height:13px;animation-delay:.3s;}
.call-wave span:nth-child(5){height:6px;animation-delay:.4s;}

#call-connecting-state .call-av-wrap{
    width:68px;height:68px;
}
#call-connecting-state .call-avatar{
    width:68px;height:68px;
}

#call-window-controls{
    position:relative;z-index:10;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;
    padding:8px 12px 16px;
}
.call-hangup-btn{
    width:56px;height:56px;
    border-radius:50%;border:none;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    background:linear-gradient(135deg,#ff5252,#c62828);
    box-shadow:0 6px 20px rgba(255,82,82,.5),0 0 0 1px rgba(255,255,255,.1);
    transition:transform .18s,box-shadow .2s;
    padding:14px;
}
.call-hangup-btn:hover{transform:scale(1.1);box-shadow:0 10px 28px rgba(255,82,82,.6);}
.call-hangup-btn:active{transform:scale(.9);}

.call-util-btn{
    position:absolute;z-index:10;
    width:28px;height:28px;border-radius:50%;border:none;
    background:rgba(255,255,255,.13);backdrop-filter:blur(8px);
    color:rgba(255,255,255,.65);cursor:pointer;font-size:10px;
    display:flex;align-items:center;justify-content:center;
    transition:background .2s,color .2s,transform .15s;
}
.call-util-btn:hover{background:rgba(255,255,255,.24);color:#fff;transform:scale(1.1);}
.call-util-btn.active{background:rgba(255,255,255,.28);color:#fff;}
#call-bg-btn{bottom:70px;right:10px;}
#call-immersive-btn{bottom:70px;left:10px;}
#call-bg-file-input{display:none;}

#call-window.immersive #call-window-header,
#call-window.immersive #call-window-body,
#call-window.immersive #call-connecting-state,
#call-window.immersive #call-window-controls,
#call-window.immersive #call-bg-btn,
#call-window.immersive .call-overlay{opacity:0 !important;pointer-events:none !important;}
#call-window.immersive #call-immersive-btn{opacity:.35 !important;pointer-events:all !important;}
#call-window.immersive #call-immersive-btn:hover{opacity:1 !important;}

#call-resize-handle{
    position:absolute;bottom:-2px;right:-2px;z-index:99901;
    width:22px;height:22px;cursor:se-resize;
    display:flex;align-items:flex-end;justify-content:flex-end;
    padding:5px;touch-action:none;
}
#call-resize-handle::after{
    content:'';width:10px;height:10px;
    border-right:2px solid rgba(255,255,255,.35);
    border-bottom:2px solid rgba(255,255,255,.35);
    border-radius:0 0 4px 0;
}

#call-size-presets{
    position:fixed;z-index:99960;
    display:none;flex-direction:column;gap:2px;
    background:rgba(12,18,36,.94);backdrop-filter:blur(18px);
    border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:5px;
    box-shadow:0 12px 38px rgba(0,0,0,.55);min-width:140px;
}
#call-size-presets.open{display:flex;animation:cFi .18s ease;}
.call-size-btn{
    padding:7px 11px;font-size:12px;color:rgba(255,255,255,.8);
    background:none;border:none;border-radius:8px;
    cursor:pointer;white-space:nowrap;text-align:left;
    transition:background .15s;display:flex;align-items:center;gap:8px;
}
.call-size-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
.call-size-btn i{color:var(--accent-color,#e0698a);width:12px;}

#call-mini-pill{
    position:fixed;bottom:82px;right:16px;z-index:99901;
    display:none;align-items:center;gap:9px;
    background:rgba(10,18,38,.92);backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,.12);
    border-radius:30px;padding:8px 14px 8px 10px;
    box-shadow:0 8px 28px rgba(0,0,0,.4);
    cursor:grab;color:#fff;user-select:none;touch-action:none;
}
#call-mini-pill:active{cursor:grabbing;}
#call-mini-pill.visible{display:flex;animation:cPi .3s cubic-bezier(.22,1,.36,1);}
.call-mini-av{
    width:30px;height:30px;border-radius:50%;
    background:var(--accent-color,#e0698a);overflow:hidden;
    display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.call-mini-av img{width:100%;height:100%;object-fit:cover;}
.call-mini-av i{font-size:12px;color:rgba(255,255,255,.82);}
.call-mini-info{display:flex;flex-direction:column;gap:1px;}
.call-mini-name{font-size:12px;font-weight:600;line-height:1.1;}
.call-mini-time{font-size:11px;color:rgba(255,255,255,.5);font-variant-numeric:tabular-nums;font-weight:500;}
.call-mini-dot{width:6px;height:6px;border-radius:50%;background:#4caf50;box-shadow:0 0 5px #4caf50;animation:cBl 1.6s ease-in-out infinite alternate;flex-shrink:0;}
.call-mini-hangup{
    width:30px;height:30px;border-radius:50%;border:none;
    background:rgba(255,82,82,.75);cursor:pointer;
    display:flex;align-items:center;justify-content:center;padding:8px;
    transition:background .2s,transform .15s;flex-shrink:0;
}
.call-mini-hangup:hover{background:#ff5252;transform:scale(1.12);}

#call-toolbar-btn{
    background-color:var(--toolbar-btn-bg, var(--message-received-bg)) !important;
    color:var(--toolbar-btn-color, var(--text-secondary)) !important;
}
#call-toolbar-btn:hover{color:var(--text-primary) !important;}
body.bottom-collapse-mode #call-toolbar-btn{display:none !important;}

html[data-theme="dark"][data-color-theme="black-white"]{
    --accent-color: #c0c0c0;
    --accent-color-rgb: 192,192,192;
    --accent-color-dark: #e0e0e0;
    --message-sent-bg: #3a3a3a;
    --message-sent-text: #ffffff;
}
html:not([data-theme="dark"])[data-color-theme="black-white"] .message-sent{
    color: #ffffff !important;
}

@keyframes cFi{from{opacity:0}to{opacity:1}}
@keyframes cCu{from{opacity:0;transform:translateY(28px) scale(.94)}to{opacity:1;transform:none}}
@keyframes cWi{from{opacity:0;transform:scale(.84) translateY(18px)}to{opacity:1;transform:none}}
@keyframes cPi{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@keyframes cRp{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.12;transform:scale(1.12)}}
@keyframes cAp{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:.12;transform:scale(1.14)}}
@keyframes cBl{from{opacity:1}to{opacity:.18}}
@keyframes cOrb{0%{transform:translate(0,0) rotate(0)}33%{transform:translate(18px,-14px) rotate(120deg)}66%{transform:translate(-10px,18px) rotate(240deg)}100%{transform:translate(0,0) rotate(360deg)}}
@keyframes cWv{0%,100%{transform:scaleY(1);opacity:.5}50%{transform:scaleY(.32);opacity:.22}}
@keyframes cCd{0%,80%,100%{transform:scale(.72);opacity:.3}40%{transform:scale(1.22);opacity:1}}
        `;
        document.head.appendChild(el);
    }

    function injectHTML() {
        if (document.getElementById('call-feature-root')) return;
        const root = document.createElement('div');
        root.id = 'call-feature-root';
        root.innerHTML = `
<div id="call-incoming-overlay">
  <div class="call-inc-card">
    <div class="call-inc-ring">
      <div class="call-inc-avatar" id="call-inc-avatar"><i class="fas fa-user" id="call-inc-av-icon"></i></div>
    </div>
    <div class="call-inc-name" id="call-inc-name">对方</div>
    <div class="call-inc-sub"><span class="call-inc-sub-dot"></span><span>邀请您进行视频通话</span></div>
    <div class="call-inc-actions">
      <button class="call-inc-btn call-inc-reject" id="call-inc-reject">
        <div class="call-inc-circle">${SVG_HU}</div>
        <span class="call-inc-lbl">拒绝</span>
      </button>
      <button class="call-inc-btn call-inc-accept" id="call-inc-accept">
        <div class="call-inc-circle">
          <svg viewBox="0 0 24 24" fill="none" style="display:block;width:100%;height:100%;">
            <path d="M6.6 10.8c1.4 2.8 3.7 5.1 6.5 6.5l2.2-2.2c.28-.27.68-.36 1.03-.24 1.1.37 2.3.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.56 21 3 13.44 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.28.2 2.5.57 3.57.11.35.03.74-.24 1.02L6.6 10.8z" fill="white"/>
          </svg>
        </div>
        <span class="call-inc-lbl">接听</span>
      </button>
    </div>
  </div>
</div>

<div id="call-window">
  <div id="call-window-inner">
    <div id="call-window-bg">
      <div class="call-bg-grad"></div>
      <div class="call-orb call-orb-1"></div>
      <div class="call-orb call-orb-2"></div>
      <div class="call-orb call-orb-3"></div>
      <img id="call-bg-img" src="" alt="">
    </div>
    <div class="call-overlay"></div>

    <div id="call-window-header">
      <div class="call-badge">
        <span class="call-rec-dot"></span>
        <span class="call-timer-txt" id="call-timer-display">00:00</span>
      </div>
      <div class="call-top-btns">
        <button class="call-top-btn" id="call-size-preset-toggle" title="调整大小"><i class="fas fa-expand-alt"></i></button>
        <button class="call-top-btn" id="call-minimize-btn" title="最小化"><i class="fas fa-minus"></i></button>
      </div>
    </div>

    <div id="call-connecting-state">
      <div class="call-av-wrap">
        <div class="call-av-pulse"></div>
        <div class="call-av-pulse2"></div>
        <div class="call-avatar" id="call-conn-avatar"><i class="fas fa-user" id="call-conn-av-icon"></i></div>
      </div>
      <div class="call-name" id="call-conn-name">对方</div>
      <div style="font-size:11px;color:rgba(255,255,255,.4);display:flex;align-items:center;gap:5px;">
        <i class="fas fa-video" style="font-size:9px;"></i> 正在连接
      </div>
      <div class="call-conn-dots"><span></span><span></span><span></span></div>
    </div>

    <div id="call-window-body">
      <div class="call-av-wrap">
        <div class="call-av-pulse"></div>
        <div class="call-av-pulse2"></div>
        <div class="call-avatar" id="call-win-avatar"><i class="fas fa-user" id="call-win-av-icon"></i></div>
      </div>
      <div class="call-name" id="call-win-name">通话中</div>
      <div class="call-wave"><span></span><span></span><span></span><span></span><span></span></div>
    </div>

    <button class="call-util-btn" id="call-immersive-btn" title="沉浸模式"><i class="fas fa-eye-slash"></i></button>
    <button class="call-util-btn" id="call-bg-btn" title="更换背景"><i class="fas fa-image"></i></button>
    <input type="file" id="call-bg-file-input" accept="image/*,.gif">

    <div id="call-window-controls">
      <button class="call-hangup-btn" id="call-hangup-btn">${SVG_HU}</button>
    </div>
  </div>
  <div id="call-resize-handle"></div>
</div>

<div id="call-size-presets">
  <button class="call-size-btn" data-w="160" data-h="240"><i class="fas fa-compress-alt"></i>迷你</button>
  <button class="call-size-btn" data-w="220" data-h="350"><i class="fas fa-minus-square"></i>小</button>
  <button class="call-size-btn" data-w="280" data-h="440"><i class="fas fa-square"></i>标准</button>
  <button class="call-size-btn" data-w="360" data-h="560"><i class="fas fa-expand"></i>大</button>
</div>

<div id="call-mini-pill">
  <div class="call-mini-av" id="call-mini-av"><i class="fas fa-user" id="call-mini-av-icon"></i></div>
  <div class="call-mini-info">
    <div class="call-mini-name" id="call-mini-name">通话中</div>
    <div class="call-mini-time" id="call-mini-timer">00:00</div>
  </div>
  <span class="call-mini-dot"></span>
  <button class="call-mini-hangup" id="call-mini-hangup">${SVG_HU}</button>
</div>
        `;
        document.body.appendChild(root);
    }

    function injectToolbarBtn() {
        if (document.getElementById('call-toolbar-btn')) return;
        const anchor = document.getElementById('attachment-btn');
        if (!anchor) return;
        const btn = document.createElement('button');
        btn.id = 'call-toolbar-btn';
        btn.title = '视频通话';
        btn.className = 'input-btn collapse-hideable';
        btn.style.display = S.enabled ? '' : 'none';
        btn.innerHTML = '<i class="fas fa-video"></i>';
        btn.addEventListener('click', () => {
            if (!S.enabled) return;
            if (S.active) { restoreWindow(); return; }
            startCall(false);
        });
        anchor.parentNode.insertBefore(btn, anchor);
    }

    function fmt(ms) {
        const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
        return h > 0
            ? `${h}:${String(m % 60).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
            : `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
    }
    const getAvSrc = () => {
        const img = document.querySelector('#partner-avatar img,[id*="partner-avatar"] img,.partner-avatar img');
        return img ? img.src : null;
    };
    const getName = () => window.settings?.partnerName || document.getElementById('partner-name')?.textContent.trim() || '对方';

    function fillAv(avId) {
        const av = document.getElementById(avId), src = getAvSrc();
        if (av) av.innerHTML = src
            ? `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:cover;">`
            : `<i class="fas fa-user"></i>`;
    }
    function fillNm(id) { const e = document.getElementById(id); if (e) e.textContent = getName(); }

    function tick() {
        if (!S.active || !S.startTime) return;
        S.elapsed = Date.now() - S.startTime;
        const t = fmt(S.elapsed);
        const a = document.getElementById('call-timer-display');
        const b = document.getElementById('call-mini-timer');
        if (a) a.textContent = t;
        if (b) b.textContent = t;
        S.timerRAF = requestAnimationFrame(tick);
    }

    function applyBg() {
        const img = document.getElementById('call-bg-img');
        if (!img) return;
        if (S.bgImage) { img.src = S.bgImage; img.style.display = 'block'; }
        else { img.src = ''; img.style.display = 'none'; }
    }

    function positionWindow() {
        const win = document.getElementById('call-window');
        if (!win) return;
        win.style.width = S.size.w + 'px';
        win.style.height = S.size.h + 'px';
        if (S.pos) {
            win.style.left   = clamp(S.pos.x, 0, window.innerWidth  - S.size.w) + 'px';
            win.style.top    = clamp(S.pos.y, 0, window.innerHeight - S.size.h) + 'px';
            win.style.right  = 'auto'; win.style.bottom = 'auto';
        } else {
            win.style.right  = '20px'; win.style.top = '72px';
            win.style.left   = 'auto'; win.style.bottom = 'auto';
        }
    }
    function positionPill() {
        const pill = document.getElementById('call-mini-pill');
        if (!pill || !S.pillPos) return;
        pill.style.left   = clamp(S.pillPos.x, 0, window.innerWidth  - (pill.offsetWidth  || 180)) + 'px';
        pill.style.top    = clamp(S.pillPos.y, 0, window.innerHeight - (pill.offsetHeight || 50))  + 'px';
        pill.style.right  = 'auto'; pill.style.bottom = 'auto';
    }

    function sendCallEvent(icon, label, detail) {
        if (typeof window._addCallEvent === 'function') {
            window._addCallEvent(icon, label, detail);
        } else {
            let tries = 0;
            const t = setInterval(() => {
                if (typeof window._addCallEvent === 'function') {
                    clearInterval(t);
                    window._addCallEvent(icon, label, detail);
                }
                if (++tries > 25) clearInterval(t);
            }, 200);
        }
    }

    function sendCallMsg(dur) {
        if (dur < 2000) return;
        sendCallEvent('fa-video', '视频通话已结束', fmt(dur));
    }

    function startCall(isPartner) {
        if (!S.enabled) return;
        S.active = true; S.startTime = null; S.elapsed = 0;
        S.minimized = false; S.isPartnerCall = !!isPartner; S.immersive = false;
        document.getElementById('call-window')?.classList.remove('immersive');

        // 播放提示音（去电时也播放）
        playRingtone();

        ['call-inc-avatar','call-conn-avatar','call-win-avatar','call-mini-av'].forEach(fillAv);
        ['call-conn-name','call-win-name','call-mini-name'].forEach(fillNm);
        applyBg(); positionWindow();

        const win  = document.getElementById('call-window');
        const body = document.getElementById('call-window-body');
        const conn = document.getElementById('call-connecting-state');
        const timerEl = document.getElementById('call-timer-display');
        if (win)    win.classList.add('visible');
        if (conn)   conn.classList.add('visible');
        if (body)   body.style.display = 'none';
        if (timerEl) timerEl.textContent = '连接中';

        clearTimeout(S.connectingTimer);

        if (!isPartner && Math.random() < 0.35) {
            const rejectDelay = 4000 + Math.random() * 8000;
            S.connectingTimer = setTimeout(() => {
                if (!S.active) return;
                S.active = false;
                stopRingtone(); // 停止提示音
                cancelAnimationFrame(S.timerRAF);
                const winEl = document.getElementById('call-window');
                if (winEl) { winEl.classList.remove('visible'); winEl.classList.remove('immersive'); }
                const connEl = document.getElementById('call-connecting-state');
                if (connEl) connEl.classList.remove('visible');
                const bodyEl = document.getElementById('call-window-body');
                if (bodyEl) bodyEl.style.display = '';
                const rejectLabels = [
                    getName() + ' 未接听',
                    getName() + ' 正在忙，无法接听',
                    getName() + ' 拒绝了通话',
                    getName() + ' 暂时无法接听',
                ];
                const lbl = rejectLabels[Math.floor(Math.random() * rejectLabels.length)];
                sendCallEvent('fa-phone-slash', lbl, null);
                if (typeof showNotification === 'function')
                    showNotification(lbl, 'info', 3000);
            }, rejectDelay);
        } else {
            S.connectingTimer = setTimeout(() => {
                if (!S.active) return;
                stopRingtone(); // 接通后停止提示音
                S.startTime = Date.now();
                if (conn) conn.classList.remove('visible');
                if (body) body.style.display = '';
                tick();
                clearTimeout(S.partnerHangupTimer);
                if (settings.partnerHangupEnabled !== false && Math.random() < 0.35) {
                    S.partnerHangupTimer = setTimeout(() => {
                        if (!S.active || !S.startTime) return;
                        const who = getName();
                        endCall(true);
                        sendCallEvent('fa-phone-slash', `${who}主动挂断了通话`, null);
                        if (typeof showNotification === 'function') showNotification(`${who}主动结束了通话`, 'info', 3000);
                    }, 90000 + Math.random() * 390000);
                }
            }, 1400 + Math.random() * 1400);
        }
    }

    function endCall(byPartner = false) {
        if (!S.active) return;
        const dur = S.elapsed;
        S.active = false; S.startTime = null;
        stopRingtone(); // 挂断时停止提示音
        cancelAnimationFrame(S.timerRAF);
        clearTimeout(S.connectingTimer); clearTimeout(S.incomingTimer); clearTimeout(S.partnerHangupTimer);

        ['call-window','call-mini-pill','call-incoming-overlay'].forEach(id => {
            const e = document.getElementById(id);
            if (e) { e.classList.remove('visible'); if (id === 'call-window') e.classList.remove('immersive'); }
        });
        const body = document.getElementById('call-window-body');
        const conn = document.getElementById('call-connecting-state');
        if (body) body.style.display = '';
        if (conn) conn.classList.remove('visible');
        S.immersive = false;
        const iBtn = document.getElementById('call-immersive-btn');
        if (iBtn) { iBtn.classList.remove('active'); iBtn.querySelector('i').className = 'fas fa-eye-slash'; }

        localStorage.setItem(KEY_POS,  JSON.stringify(S.pos));
        localStorage.setItem(KEY_SIZE, JSON.stringify(S.size));
        if (!byPartner) sendCallMsg(dur);
        if (typeof showNotification === 'function' && dur > 1500)
            showNotification(`通话结束 · ${fmt(dur)}`, 'info', 3000);
        else if (typeof showNotification === 'function' && dur <= 1500 && dur > 0)
            showNotification('通话已挂断', 'info', 2000);
    }

    function showIncomingCall() {
        if (!S.enabled || S.active) return;
        if (window.EnhancementUI) window.EnhancementUI.playProfile('invite_videocall');
        const ov = document.getElementById('call-incoming-overlay');
        if (!ov) return;
        fillAv('call-inc-avatar'); fillNm('call-inc-name');
        ov.classList.add('visible');
        
        // 来电时播放提示音
        playRingtone();
        
        clearTimeout(S.incomingTimer);

        const autoRejectChance = 0.30;
        if (Math.random() < autoRejectChance) {
            const rejectDelay = 4000 + Math.random() * 6000;
            S.incomingTimer = setTimeout(() => {
                if (!ov.classList.contains('visible')) return;
                ov.classList.remove('visible');
                stopRingtone(); // 自动拒绝后停止提示音
                const myName = (typeof settings !== 'undefined' && settings.myName) || '我';
                const partnerName = getName();
                const rejectLabels = [
                    `${partnerName} 的来电，${myName}未接听`,
                    `${myName}拒绝了 ${partnerName} 的通话`,
                    `错过了 ${partnerName} 的来电`,
                    `${myName}暂时无法接听 ${partnerName} 的通话`,
                ];
                const label = rejectLabels[Math.floor(Math.random() * rejectLabels.length)];
                sendCallEvent('fa-phone-slash', label, null);
            }, rejectDelay);
        } else {
            S.incomingTimer = setTimeout(() => {
                if (!ov.classList.contains('visible')) return;
                ov.classList.remove('visible');
                stopRingtone(); // 超时未接后停止提示音
                const myName = (typeof settings !== 'undefined' && settings.myName) || '我';
                sendCallEvent('fa-phone-slash', `${myName}未接听 ${getName()} 的来电`, null);
            }, 22000);
        }
    }

    function scheduleRandomCall() {
        clearTimeout(S.randomCallTimer);
        if (!S.enabled) return;
        const ms = (15 + Math.random() * 45) * 60 * 1000;
        S.randomCallTimer = setTimeout(() => {
            if (S.enabled && !S.active && Math.random() < 0.25) showIncomingCall();
            scheduleRandomCall();
        }, ms);
    }

    function minimizeWindow() {
        S.minimized = true;
        document.getElementById('call-window')?.classList.remove('visible');
        const pill = document.getElementById('call-mini-pill');
        if (pill) { pill.classList.add('visible'); positionPill(); }
    }
    function restoreWindow() {
        S.minimized = false;
        const win = document.getElementById('call-window');
        if (win) { positionWindow(); win.classList.add('visible'); }
        document.getElementById('call-mini-pill')?.classList.remove('visible');
    }

    function toggleImmersive() {
        S.immersive = !S.immersive;
        document.getElementById('call-window')?.classList.toggle('immersive', S.immersive);
        const btn = document.getElementById('call-immersive-btn');
        if (btn) {
            btn.classList.toggle('active', S.immersive);
            btn.querySelector('i').className = S.immersive ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
    }

    function openSizePresets() {
        const p = document.getElementById('call-size-presets');
        const b = document.getElementById('call-size-preset-toggle');
        if (!p || !b) return;
        const r = b.getBoundingClientRect();
        p.style.top  = (r.bottom + 8) + 'px';
        p.style.left = Math.max(8, r.left - 40) + 'px';
        p.classList.add('open');
    }

    function initDrag() {
        const hdr = document.getElementById('call-window-header');
        const win = document.getElementById('call-window');
        if (!hdr || !win) return;
        let on = false;
        hdr.addEventListener('pointerdown', e => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            e.preventDefault();
            const r = win.getBoundingClientRect();
            S.dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
            on = true;
            try { hdr.setPointerCapture(e.pointerId); } catch(_) {}
        });
        hdr.addEventListener('pointermove', e => {
            if (!on || !S.dragOff) return; e.preventDefault();
            win.style.left   = clamp(e.clientX - S.dragOff.x, 0, window.innerWidth  - win.offsetWidth)  + 'px';
            win.style.top    = clamp(e.clientY - S.dragOff.y, 0, window.innerHeight - win.offsetHeight) + 'px';
            win.style.right  = 'auto'; win.style.bottom = 'auto';
        });
        const stop = e => {
            if (!on) return; on = false; S.dragOff = null;
            const r = win.getBoundingClientRect(); S.pos = { x: r.left, y: r.top };
            localStorage.setItem(KEY_POS, JSON.stringify(S.pos));
            try { hdr.releasePointerCapture(e.pointerId); } catch(_) {}
        };
        hdr.addEventListener('pointerup', stop);
        hdr.addEventListener('pointercancel', stop);
    }

    function initPillDrag() {
        const pill = document.getElementById('call-mini-pill');
        if (!pill) return;
        let on = false;
        pill.addEventListener('pointerdown', e => {
            if (e.target.closest('.call-mini-hangup')) return;
            e.preventDefault();
            const r = pill.getBoundingClientRect();
            S.pillDragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
            S.pillDragged = false; on = true;
            try { pill.setPointerCapture(e.pointerId); } catch(_) {}
        });
        pill.addEventListener('pointermove', e => {
            if (!on || !S.pillDragOff) return; e.preventDefault();
            S.pillDragged = true;
            pill.style.left   = clamp(e.clientX - S.pillDragOff.x, 0, window.innerWidth  - pill.offsetWidth)  + 'px';
            pill.style.top    = clamp(e.clientY - S.pillDragOff.y, 0, window.innerHeight - pill.offsetHeight) + 'px';
            pill.style.right  = 'auto'; pill.style.bottom = 'auto';
        });
        const stop = e => {
            if (!on) return; on = false;
            if (S.pillDragged) {
                const r = pill.getBoundingClientRect();
                S.pillPos = { x: r.left, y: r.top };
                localStorage.setItem(KEY_PILL_POS, JSON.stringify(S.pillPos));
            }
            S.pillDragOff = null;
            try { pill.releasePointerCapture(e.pointerId); } catch(_) {}
        };
        pill.addEventListener('pointerup', stop);
        pill.addEventListener('pointercancel', stop);
    }

    function initResize() {
        const h = document.getElementById('call-resize-handle');
        const win = document.getElementById('call-window');
        if (!h || !win) return;
        let on = false;
        h.addEventListener('pointerdown', e => {
            e.preventDefault(); e.stopPropagation();
            const r = win.getBoundingClientRect();
            S.resizeInit = { ex: e.clientX, ey: e.clientY, w: r.width, h: r.height };
            on = true;
            try { h.setPointerCapture(e.pointerId); } catch(_) {}
        });
        h.addEventListener('pointermove', e => {
            if (!on || !S.resizeInit) return; e.preventDefault();
            S.size.w = clamp(S.resizeInit.w + (e.clientX - S.resizeInit.ex), 160, 600);
            S.size.h = clamp(S.resizeInit.h + (e.clientY - S.resizeInit.ey), 240, 800);
            win.style.width = S.size.w + 'px'; win.style.height = S.size.h + 'px';
        });
        const stop = e => {
            if (!on) return; on = false; S.resizeInit = null;
            localStorage.setItem(KEY_SIZE, JSON.stringify(S.size));
            try { h.releasePointerCapture(e.pointerId); } catch(_) {}
        };
        h.addEventListener('pointerup', stop);
        h.addEventListener('pointercancel', stop);
    }

    function bindEvents() {
        document.getElementById('call-inc-reject')?.addEventListener('click', () => {
            document.getElementById('call-incoming-overlay')?.classList.remove('visible');
            stopRingtone(); // 拒绝时停止提示音
            clearTimeout(S.incomingTimer);
            const myName = (typeof settings !== 'undefined' && settings.myName) || '我';
            sendCallEvent('fa-phone-slash', `${myName}拒绝了 ${getName()} 的通话`, null);
        });
        document.getElementById('call-inc-accept')?.addEventListener('click', () => {
            document.getElementById('call-incoming-overlay')?.classList.remove('visible');
            stopRingtone(); // 接听时停止提示音
            clearTimeout(S.incomingTimer); startCall(true);
        });

        document.getElementById('call-hangup-btn')?.addEventListener('click', () => endCall());
        document.getElementById('call-mini-hangup')?.addEventListener('click', e => { e.stopPropagation(); endCall(); });
        document.getElementById('call-minimize-btn')?.addEventListener('click', minimizeWindow);
        document.getElementById('call-mini-pill')?.addEventListener('click', e => {
            if (e.target.closest('.call-mini-hangup')) return;
            if (!S.pillDragged) restoreWindow();
        });
        document.getElementById('call-immersive-btn')?.addEventListener('click', e => { e.stopPropagation(); toggleImmersive(); });
        document.getElementById('call-window')?.addEventListener('click', e => {
            if (S.immersive && !e.target.closest('#call-immersive-btn')) toggleImmersive();
        });

        document.getElementById('call-size-preset-toggle')?.addEventListener('click', e => {
            e.stopPropagation();
            const p = document.getElementById('call-size-presets');
            if (!p) return;
            p.classList.contains('open') ? p.classList.remove('open') : openSizePresets();
        });
        document.addEventListener('click', e => {
            const btn = e.target.closest('.call-size-btn'); if (!btn) return;
            S.size.w = +btn.dataset.w; S.size.h = +btn.dataset.h;
            const win = document.getElementById('call-window');
            if (win) { win.style.width = S.size.w + 'px'; win.style.height = S.size.h + 'px'; }
            document.getElementById('call-size-presets')?.classList.remove('open');
            localStorage.setItem(KEY_SIZE, JSON.stringify(S.size));
        });
        document.addEventListener('click', e => {
            if (!e.target.closest('#call-size-preset-toggle') && !e.target.closest('#call-size-presets'))
                document.getElementById('call-size-presets')?.classList.remove('open');
        });

        document.getElementById('call-bg-btn')?.addEventListener('click', () => document.getElementById('call-bg-file-input')?.click());
        document.getElementById('call-bg-file-input')?.addEventListener('change', e => {
            const f = e.target.files?.[0]; if (!f) return;
            const r = new FileReader();
            r.onload = ev => { S.bgImage = ev.target.result; saveBg(S.bgImage); applyBg(); showNotification?.('通话背景已更新 ✓','success',2000); };
            r.readAsDataURL(f); e.target.value = '';
        });

        document.addEventListener('change', e => {
            if (e.target.id !== 'call-enabled-toggle') return;
            S.enabled = e.target.checked;
            localStorage.setItem(KEY_ENABLED, S.enabled);
            const btn = document.getElementById('call-toolbar-btn');
            if (btn) btn.style.display = S.enabled ? '' : 'none';
            const collapsedCallBtn = document.getElementById('collapsed-call-btn');
            if (collapsedCallBtn) collapsedCallBtn.style.display = S.enabled ? '' : 'none';
            if (!S.enabled && S.active) endCall();
            S.enabled ? scheduleRandomCall() : clearTimeout(S.randomCallTimer);
        });

        initDrag(); initPillDrag(); initResize();
    }

    window.callFeature = { startCall, endCall, showIncomingCall, restoreWindow, minimizeWindow };

    function init() {
        injectCSS();
        injectHTML();
        bindEvents();
        loadBg();

        // 同步全局音效设置
        const syncSoundSetting = () => {
            if (typeof settings !== 'undefined') {
                S.soundEnabled = settings.soundEnabled !== false;
            }
        };
        syncSoundSetting();
        setInterval(syncSoundSetting, 1000); // 定期同步音效开关

        const late = () => {
            injectToolbarBtn();
            if (S.enabled) scheduleRandomCall();
            const syncCallToggle = () => {
                const tog = document.getElementById('call-enabled-toggle');
                if (tog) {
                    tog.checked = S.enabled;
                }
                const collapsedCallBtn = document.getElementById('collapsed-call-btn');
                if (collapsedCallBtn) collapsedCallBtn.style.display = S.enabled ? '' : 'none';
            };
            syncCallToggle();
            const chatModal = document.getElementById('chat-modal');
            if (chatModal) {
                new MutationObserver(() => {
                    if (chatModal.style.display === 'flex' || chatModal.style.display === 'block') {
                        setTimeout(syncCallToggle, 50);
                    }
                }).observe(chatModal, { attributes: true, attributeFilter: ['style'] });
            }
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(late, 800));
        else setTimeout(late, 800);
    }

    init();
})();

function renderStatsContent() {
            const statsContent = DOMElements.statsModal.content;

            const partnerMessages = messages.filter(msg =>
                msg.sender !== 'user' && msg.sender !== null &&
                msg.text &&
                msg.type !== 'system'
            );
            
            const myMessages = messages.filter(msg =>
                msg.sender === 'user' &&
                msg.text &&
                msg.type !== 'system'
            );

            if (partnerMessages.length === 0 && myMessages.length === 0) {
                statsContent.innerHTML = `
                    <div class="stats-empty-state">
                        <div class="stats-empty-icon"><i class="fas fa-chart-pie"></i></div>
                        <h3>暂无数据</h3>
                        <p>多聊几句再来看看吧...</p>
                    </div>`;
                return;
            }

            const getTopReplies = (msgs) => {
                const countMap = {};
                msgs.forEach(msg => {
                    const text = msg.text.trim();
                    if (text) {
                        countMap[text] = (countMap[text] || 0) + 1;
                    }
                });
                return Object.entries(countMap)
                    .map(([text, count]) => ({ text, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5); 
            };

            const partnerTop = getTopReplies(partnerMessages);
            const myTop = getTopReplies(myMessages);

            const generateRankHTML = (list) => {
                if (list.length === 0) return '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
                const maxVal = list[0].count;
                return list.map((item, index) => {
                    const percent = (item.count / maxVal) * 100;
                    return `
                    <div class="rank-item">
                        <div class="rank-progress-bg" style="width: ${percent}%; opacity: 0.1; background-color: var(--text-primary);"></div>
                        <div class="rank-info">
                            <div class="rank-number">#${index + 1}</div>
                            <div class="rank-text" title="${item.text}">${item.text}</div>
                            <div class="rank-count">${item.count}次</div>
                        </div>
                    </div>`;
                }).join('');
            };

            const allMsgs = messages.filter(m => m.timestamp);
            const firstMsg = allMsgs.length > 0 ? allMsgs[0] : { timestamp: new Date() };
            const lastMsg = allMsgs.length > 0 ? allMsgs[allMsgs.length - 1] : { timestamp: new Date() };

            const formatDate = (dateObj) => {
                return new Date(dateObj).toLocaleDateString('zh-CN', {
                    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                });
            };

            statsContent.innerHTML = `
                <div class="stats-dashboard">
                    <div class="stats-overview-grid">
                        <div class="overview-item overview-large">
                            <div class="overview-value">${messages.length}</div>
                            <div class="overview-label">总消息数</div>
                        </div>
                        <div class="overview-row-two">
                            <div class="overview-item">
                                <div class="overview-value">${myMessages.length}</div>
                                <div class="overview-label">我发送的</div>
                            </div>
                            <div class="overview-item">
                                <div class="overview-value">${partnerMessages.length}</div>
                                <div class="overview-label">对方发送的</div>
                            </div>
                        </div>
                        <div class="overview-row-dates">
                            <div class="overview-item overview-date">
                                <div class="overview-date-icon"><i class="fas fa-seedling"></i></div>
                                <div>
                                    <div class="overview-date-label">初次相遇</div>
                                    <div class="overview-date-value">${formatDate(firstMsg.timestamp)}</div>
                                </div>
                            </div>
                            <div class="overview-item overview-date">
                                <div class="overview-date-icon"><i class="fas fa-heart"></i></div>
                                <div>
                                    <div class="overview-date-label">最近联络</div>
                                    <div class="overview-date-value">${formatDate(lastMsg.timestamp)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-card">
                        <div style="display:flex; gap:8px; margin-bottom:12px;">
                            <button id="stats-toggle-partner" class="stats-toggle-btn active" onclick="switchStatsView('partner')">
                                <i class="fas fa-user-circle"></i> 对方
                            </button>
                            <button id="stats-toggle-me" class="stats-toggle-btn" onclick="switchStatsView('me')">
                                <i class="fas fa-user"></i> 我方
                            </button>
                        </div>
                        <div class="stats-card-title" id="stats-rank-title">
                            <i class="fas fa-user-circle"></i> 对方高频词 TOP 5
                        </div>
                        <div class="stats-rank-list" id="stats-rank-list">
                            ${generateRankHTML(partnerTop)}
                        </div>
                    </div>
                </div>
            `;

            statsContent._partnerHTML = generateRankHTML(partnerTop);
            statsContent._myHTML = generateRankHTML(myTop);
        }

        window.switchStatsView = function(who) {
            const statsContent = DOMElements.statsModal.content;
            const partnerBtn = document.getElementById('stats-toggle-partner');
            const meBtn = document.getElementById('stats-toggle-me');
            const title = document.getElementById('stats-rank-title');
            const list = document.getElementById('stats-rank-list');
            if (!partnerBtn || !meBtn || !list) return;

            if (who === 'partner') {
                partnerBtn.classList.add('active');
                meBtn.classList.remove('active');
                title.innerHTML = '<i class="fas fa-user-circle"></i> 对方高频词 TOP 5';
                list.innerHTML = statsContent._partnerHTML || '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
            } else {
                meBtn.classList.add('active');
                partnerBtn.classList.remove('active');
                title.innerHTML = '<i class="fas fa-user"></i> 我方高频词 TOP 5';
                list.innerHTML = statsContent._myHTML || '<div style="text-align:center;color:var(--text-secondary);font-size:12px;padding:10px;">暂无数据</div>';
            }
        };
        function renderSessionList() {
            const listContainer = DOMElements.sessionModal.list;
            if (sessionList.length === 0) {
                listContainer.innerHTML = '<div class="stats-empty" style="padding: 20px 0;"><p>还没有会话</p></div>';
                return;
            }
            listContainer.innerHTML = sessionList.map(session => `
            <div class="session-item ${session.id === SESSION_ID ? 'active': ''}" data-id="${session.id}">
            <div class="session-info">
            <div class="session-name">${session.name}</div>
            <div class="session-meta">创建于 ${new Date(session.createdAt).toLocaleDateString()}</div>
            </div>
            <div class="session-actions">
            <button class="session-action-btn rename" title="重命名"><i class="fas fa-pen"></i></button>
            <button class="session-action-btn delete" title="删除"><i class="fas fa-trash"></i></button>
            </div>
            </div>
            `).join('');
        }


async function generateFortune() {
    const today = new Date();
    const todayKey = today.toDateString(); 
    const start = new Date(today.getFullYear(), 0, 1);
    const diff = today - start + (start.getTimezoneOffset() - today.getTimezoneOffset()) * 60000;
    const weekNum = Math.floor(diff / (1000 * 60 * 60 * 24) / 7);
    const weekKey = today.getFullYear() + '-W' + weekNum;

    const storageKey = `${APP_PREFIX}weekly_fortune`;
    let fortuneData = null;

    try {
        const savedData = await localforage.getItem(storageKey);
        if (savedData && savedData.week === weekKey) {
            fortuneData = savedData;
        }
    } catch (e) { console.warn("读取运势失败", e); }

const majorCards = CONSTANTS.TAROT_CARDS;
    if (!fortuneData) {
        const randomIndex = Math.floor(Math.random() * majorCards.length);
        const isUpright = Math.random() > 0.5;
        
        const fixedStars = isUpright ? (Math.floor(Math.random() * 2) + 4) : (Math.floor(Math.random() * 2) + 3);

        fortuneData = {
            week: weekKey,
            cardIndex: randomIndex,
            isUpright: isUpright,
            stars: fixedStars 
        };
        await localforage.setItem(storageKey, fortuneData);
    }

    renderFortunePanel(fortuneData, majorCards, todayKey);
}

function renderFortunePanel(weeklyData, majorCards, todayKey) {
    const content = document.getElementById('fortune-content');
    if (!content) return;

    content.innerHTML = `
        <div class="fortune-sub-tabs" style="display:flex;gap:8px;margin-bottom:14px;">
            <button id="fsub-weekly" class="modal-btn modal-btn-primary" style="flex:1;font-size:12px;padding:7px 0;" onclick="showFortuneSub('weekly')"><i class="fas fa-calendar-week"></i> 每周主牌</button>
            <button id="fsub-daily" class="modal-btn modal-btn-secondary" style="flex:1;font-size:12px;padding:7px 0;" onclick="showFortuneSub('daily')"><i class="fas fa-sun"></i> 每日运势</button>
        </div>
        <div id="fortune-sub-weekly"></div>
        <div id="fortune-sub-daily" style="display:none;"></div>
    `;

    renderWeeklyFortune(weeklyData, majorCards);
    renderDailyFortune(todayKey);

    showModal(document.getElementById('fortune-lenormand-modal'));
}

window.showFortuneSub = function(tab) {
    const weeklyEl = document.getElementById('fortune-sub-weekly');
    const dailyEl = document.getElementById('fortune-sub-daily');
    const weeklyBtn = document.getElementById('fsub-weekly');
    const dailyBtn = document.getElementById('fsub-daily');
    if (tab === 'weekly') {
        if (weeklyEl) weeklyEl.style.display = '';
        if (dailyEl) dailyEl.style.display = 'none';
        if (weeklyBtn) weeklyBtn.className = 'modal-btn modal-btn-primary';
        if (dailyBtn) dailyBtn.className = 'modal-btn modal-btn-secondary';
        weeklyBtn.style.flex = dailyBtn.style.flex = '1';
        weeklyBtn.style.fontSize = dailyBtn.style.fontSize = '12px';
        weeklyBtn.style.padding = dailyBtn.style.padding = '7px 0';
    } else {
        if (weeklyEl) weeklyEl.style.display = 'none';
        if (dailyEl) dailyEl.style.display = '';
        if (weeklyBtn) weeklyBtn.className = 'modal-btn modal-btn-secondary';
        if (dailyBtn) dailyBtn.className = 'modal-btn modal-btn-primary';
        weeklyBtn.style.flex = dailyBtn.style.flex = '1';
        weeklyBtn.style.fontSize = dailyBtn.style.fontSize = '12px';
        weeklyBtn.style.padding = dailyBtn.style.padding = '7px 0';
    }
};

function renderWeeklyFortune(data, majorCards) {
    const el = document.getElementById('fortune-sub-weekly');
    if (!el) return;

    const card = majorCards[data.cardIndex];
    const isUpright = data.isUpright;
    const starCount = data.stars || 3;

    let starsHtml = Array(5).fill(0).map((_, i) => 
        `<i class="fas fa-star" style="color: ${i < starCount ? 'var(--accent-color)' : 'var(--border-color)'}; font-size: 12px; margin: 0 2px;"></i>`
    ).join('');

    el.innerHTML = `
        <div style="text-align:center; margin-bottom:15px; color:var(--text-secondary); font-size:12px; letter-spacing: 1px;">
            <i class="fas fa-sparkles" style="color:var(--accent-color);"></i> 凭直觉点击翻开你的每周主牌
        </div>
        
        <div class="tarot-container-3d" onclick="this.classList.toggle('flipped');">
            <div class="tarot-card-inner">
                <div class="tarot-face tarot-front">
                    <div class="tarot-pattern"><i class="fas fa-star-and-crescent"></i></div>
                </div>
                <div class="tarot-face tarot-back" style="background: linear-gradient(135deg, var(--secondary-bg), rgba(var(--accent-color-rgb), 0.05)); border: 2px solid rgba(var(--accent-color-rgb), 0.3); padding: 14px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-y: auto;">
                    <div class="tarot-visual ${isUpright ? '' : 'reversed'}" style="height:80px; flex-shrink:0;">
                        <i class="fas ${card.icon} tarot-icon-vector" style="font-size:42px; color: var(--accent-color);"></i>
                    </div>
                    <div style="text-align:center; width:100%;">
                        <div class="tarot-card-name" style="font-size:18px; font-weight: 700; margin-bottom:3px;">${card.name}</div>
                        <div style="font-size:10px; color:var(--text-secondary); margin-bottom:6px;">${isUpright ? '正位' : '逆位'}</div>
                        <div style="font-size:12px; color: var(--accent-color); font-weight:600; margin-bottom:6px;">「${card.keyword}」</div>
                        <div style="margin-bottom:8px;">${starsHtml}</div>
                        <div style="font-size:11px; color:var(--text-secondary); line-height:1.6; text-align:left;">${card.meaning}</div>
                    </div>
                </div>
            </div>
        </div>

    `;
}

async function renderDailyFortune(todayKey) {
    const el = document.getElementById('fortune-sub-daily');
    if (!el) return;

    const storageKey = `${APP_PREFIX}daily_fortune_3`;
    let dailyData = null;

    try {
        const saved = await localforage.getItem(storageKey);
        if (saved && saved.day === todayKey) {
            dailyData = saved;
        }
    } catch(e) {}

    if (!dailyData) {
        const deck = [...ALL_78_TAROT_CARDS];
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        const drawn = deck.slice(0, 3).map(card => ({
            name: card.name,
            type: card.type || 'major',
            keyword: card.keyword,
            upright: card.upright || card.meaning,
            reversed: card.reversed || card.meaning,
            icon: card.icon || 'fa-star',
            img: card.img || null,
            isUpright: Math.random() > 0.5
        }));
        dailyData = { day: todayKey, cards: drawn };
        try { await localforage.setItem(storageKey, dailyData); } catch(e) {}
    }

    const positionLabels = ['过去 · 根源', '现在 · 核心', '未来 · 启示'];
    const positionColors = ['rgba(var(--accent-color-rgb),0.6)', 'var(--accent-color)', 'rgba(var(--accent-color-rgb),0.8)'];

    el.innerHTML = `
        <div style="text-align:center; margin-bottom:14px; color:var(--text-secondary); font-size:12px; letter-spacing:1px;">
            <i class="fas fa-moon" style="color:var(--accent-color);"></i> ${new Date().toLocaleDateString('zh-CN', {month:'long',day:'numeric'})} · 三牌展开
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:16px;">
            ${dailyData.cards.map((card, i) => `
                <div style="flex:1;min-width:90px;max-width:130px;text-align:center;">
                    <div style="font-size:10px;color:${positionColors[i]};margin-bottom:6px;font-weight:600;letter-spacing:0.5px;">${positionLabels[i]}</div>
                    <div class="tarot-container-3d tarot-responsive" style="cursor:pointer;margin-bottom:8px;" onclick="this.classList.toggle('flipped'); document.getElementById('daily-interp-${i}').style.display = this.classList.contains('flipped') ? 'block' : 'none';">
                        <div class="tarot-card-inner">
                            <div class="tarot-face tarot-front"><div class="tarot-pattern" style="font-size:18px;"><i class="fas fa-star-and-crescent"></i></div></div>
                            <div class="tarot-face tarot-back" style="background:linear-gradient(135deg,var(--secondary-bg),rgba(var(--accent-color-rgb),0.07));border:1.5px solid rgba(var(--accent-color-rgb),0.3);padding:0;overflow:hidden;">
                                <div class="tarot-visual ${card.isUpright ? '' : 'reversed'}" style="height:100%;width:100%;margin:0;padding:0;">
                                    ${card.img ? `<img src="${card.img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div style="display:none;height:100%;align-items:center;justify-content:center;"><i class="fas ${card.icon}" style="font-size:28px;color:var(--accent-color);"></i></div>` : `<div style="height:100%;display:flex;align-items:center;justify-content:center;"><i class="fas ${card.icon}" style="font-size:28px;color:var(--accent-color);"></i></div>`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="daily-interp-${i}" style="display:none;text-align:left;margin-top:6px;padding:8px 10px;background:rgba(var(--accent-color-rgb),0.06);border-radius:10px;border:1px solid rgba(var(--accent-color-rgb),0.15);">
                        <div style="font-size:11px;font-weight:700;color:var(--accent-color);margin-bottom:4px;">${card.keyword}</div>
                        <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">${card.isUpright ? (card.upright || card.meaning || '') : (card.reversed || card.meaning || '')}</div>
                    </div>
                </div>
            `).join('')}
        </div>
      <div style="margin-bottom:10px;">
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;font-weight:500;">✍️ 今日解读</div>
            <textarea id="daily-fortune-notes" placeholder="写下你对今日牌阵的感悟..." style="width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--primary-bg);color:var(--text-primary);font-size:12px;font-family:var(--font-family);resize:vertical;min-height:72px;outline:none;transition:border 0.18s;line-height:1.6;" onfocus="this.style.borderColor='var(--accent-color)'" onblur="this.style.borderColor='var(--border-color)'">${(function(){try{return localStorage.getItem('dailyFortuneNotes_'+todayKey)||''}catch(e){return ''}}())}</textarea>
            <div style="display:flex;justify-content:flex-end;margin-top:4px;">
                <button onclick="(function(){var t=document.getElementById('daily-fortune-notes');try{localStorage.setItem('dailyFortuneNotes_'+'${todayKey}',t.value);}catch(e){}this.textContent='已保存 ✓';var self=this;setTimeout(function(){self.textContent='保存';},1500);}).call(this)" style="font-size:11px;padding:4px 12px;border:1.5px solid var(--accent-color);border-radius:8px;background:transparent;color:var(--accent-color);cursor:pointer;font-family:var(--font-family);">保存</button>
            </div>
        </div>
        <div style="font-size:11px;color:var(--text-secondary);text-align:center;padding:8px;background:rgba(var(--accent-color-rgb),0.05);border-radius:8px;">
            <i class="fas fa-sync-alt" style="color:var(--accent-color);margin-right:4px;"></i>每日零时自动更新 · 点击牌背翻开查看解读
        </div>
    `;
}

let lenormandSystem = 36;
let lenormandCount = 1;

const LENORMAND_CARDS_40 = [
    { num: 1, name: "骑士", icon: "🏇", keyword: "消息·速度", meaning: "快速到来的消息，行动迅速，使者，短途旅行。" },
    { num: 2, name: "四叶草", icon: "🍀", keyword: "幸运·机遇", meaning: "小幸运，偶然的好运，短暂的喜悦，乐观面对生活。" },
    { num: 3, name: "帆船", icon: "⛵", keyword: "旅行·方向", meaning: "旅行，冒险，追寻目标，人生的航向。" },
    { num: 4, name: "房屋", icon: "🏠", keyword: "家庭·安稳", meaning: "家，稳定，安全感，家庭关系，房产。" },
    { num: 5, name: "大树", icon: "🌳", keyword: "健康·根基", meaning: "健康，生命力，成长，根基，长久稳固。" },
    { num: 6, name: "乌云", icon: "☁️", keyword: "困惑·障碍", meaning: "困惑，不确定，暂时的阴霾，需要耐心等待。" },
    { num: 7, name: "蛇", icon: "🐍", keyword: "诱惑·迂回", meaning: "竞争者，诱惑，迂回的道路，复杂的女性。" },
    { num: 8, name: "棺材", icon: "⚰️", keyword: "结束·转变", meaning: "结束，转变，某事告一段落，低落期，疾病。" },
    { num: 9, name: "花束", icon: "💐", keyword: "礼物·喜悦", meaning: "礼物，惊喜，喜悦，美好的关系，感激之情。" },
    { num: 10, name: "镰刀", icon: "🌾", keyword: "决断·收割", meaning: "突然的决定，危险，收割，结束，手术。" },
    { num: 11, name: "鞭子", icon: "⚡", keyword: "争执·激情", meaning: "争论，冲突，重复，激情，体育运动。" },
    { num: 12, name: "鸟儿", icon: "🐦", keyword: "对话·焦虑", meaning: "对话，流言，消息，焦虑，一对情侣。" },
    { num: 13, name: "孩童", icon: "🧒", keyword: "新开始·纯真", meaning: "新的开始，纯真，孩子，小事，新鲜感。" },
    { num: 14, name: "狐狸", icon: "🦊", keyword: "狡猾·工作", meaning: "狡猾，策略，工作，谨防欺骗，自我保护。" },
    { num: 15, name: "熊", icon: "🐻", keyword: "力量·权威", meaning: "强大的力量，老板，财务，母性，保护者。" },
    { num: 16, name: "星星", icon: "⭐", keyword: "希望·指引", meaning: "希望，梦想，灵感，指引，清晰，美好未来。" },
    { num: 17, name: "鹳鸟", icon: "🕊️", keyword: "变化·移动", meaning: "变化，移动，适应，新的生活阶段，迁徙。" },
    { num: 18, name: "狗", icon: "🐕", keyword: "友谊·忠诚", meaning: "忠诚的朋友，友谊，可靠，支持，宠物。" },
    { num: 19, name: "高塔", icon: "🏰", keyword: "孤独·机构", meaning: "孤独，边界，机构，官方，距离，自我保护。" },
    { num: 20, name: "花园", icon: "🌺", keyword: "社交·公众", meaning: "社交场合，公众，聚会，开放的空间。" },
    { num: 21, name: "山丘", icon: "⛰️", keyword: "障碍·挑战", meaning: "障碍，挑战，延迟，竞争，需要攀越的困难。" },
    { num: 22, name: "十字路口", icon: "🛤️", keyword: "选择·方向", meaning: "选择，岔路，可能性，多条道路，决策时刻。" },
    { num: 23, name: "老鼠", icon: "🐀", keyword: "损耗·压力", meaning: "损失，压力，焦虑，偷走，逐渐减少，担忧。" },
    { num: 24, name: "心", icon: "❤️", keyword: "爱情·感情", meaning: "爱，感情，关怀，真心，情感的核心。" },
    { num: 25, name: "指环", icon: "💍", keyword: "承诺·契约", meaning: "承诺，契约，婚姻，合作，循环往复。" },
    { num: 26, name: "书", icon: "📚", keyword: "秘密·知识", meaning: "秘密，知识，学习，隐藏的信息，需要深入了解。" },
    { num: 27, name: "信件", icon: "✉️", keyword: "沟通·文件", meaning: "通讯，文件，信息，书面合同，重要的消息。" },
    { num: 28, name: "男士", icon: "👨", keyword: "男性·当事人", meaning: "主要男性人物，男性提问者或重要男性。" },
    { num: 29, name: "女士", icon: "👩", keyword: "女性·当事人", meaning: "主要女性人物，女性提问者或重要女性。" },
    { num: 30, name: "百合", icon: "🌸", keyword: "纯洁·平静", meaning: "纯洁，平静，和谐，成熟的感情，高尚的品格。" },
    { num: 31, name: "太阳", icon: "☀️", keyword: "成功·活力", meaning: "成功，活力，快乐，温暖，光明，积极能量。" },
    { num: 32, name: "月亮", icon: "🌙", keyword: "荣誉·直觉", meaning: "荣誉，名声，直觉，情感波动，创造力，梦境。" },
    { num: 33, name: "钥匙", icon: "🔑", keyword: "答案·解锁", meaning: "答案，解决方案，重要发现，开启新的可能。" },
    { num: 34, name: "鱼", icon: "🐟", keyword: "财富·流动", meaning: "财富，生意，流动，丰盛，商业活动，资源。" },
    { num: 35, name: "锚", icon: "⚓", keyword: "稳定·坚持", meaning: "稳定，坚持，目标，长期，踏实，工作。" },
    { num: 36, name: "十字架", icon: "✝️", keyword: "命运·担当", meaning: "命运，责任，痛苦，信仰，接受，精神使命。" },
    { num: 37, name: "灵体", icon: "💭", keyword: "高我·感受", meaning: "直觉，感受，觉察，因果规律，灵魂伴侣，。" },
    { num: 38, name: "香炉", icon: "⚖️", keyword: "清除·归零", meaning: "清除，净化，消散，弥漫，清净之地，氛围感。" },
    { num: 39, name: "床", icon: "🛏", keyword: "舒适·休息", meaning: "睡觉，回避，躺平，舒适，卧室，性关系。" },
    { num: 40, name: "市场", icon: "🏪", keyword: "交易·工作", meaning: "工作，交易，维护，运营，势均力敌，出去游玩。" }
];

function getLenormandCards() {
    return LENORMAND_CARDS_40.slice(0, lenormandSystem);
}

function setLenormandSystem(n) {
    lenormandSystem = n;
}

function setLenormandCount(n) {
    lenormandCount = n;
    document.querySelectorAll('.lenormand-num-btn').forEach(btn => {
        const numEl = btn.querySelector('.leno-btn-num');
        btn.classList.toggle('active', numEl && parseInt(numEl.textContent) === n);
    });
    updateLenoNumDesc(n);
}

function updateLenoNumDesc(n) {
    const desc = document.getElementById('leno-num-desc');
    if (!desc) return;
    if (n === 1) desc.textContent = '单张牌 · 直达答案';
    else if (n === 3) desc.textContent = '三张牌 · 洞察全局';
}

function switchFLTab(tab) {
    document.querySelectorAll('.fl-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.fl-panel').forEach(panel => panel.classList.remove('fl-panel-active'));
    const activeTab = document.getElementById('fl-tab-' + tab);
    const activePanel = document.getElementById('fl-panel-' + tab);
    if (activeTab) activeTab.classList.add('active');
    if (activePanel) activePanel.classList.add('fl-panel-active');
}

function openLenormandModal() {
    resetLenormand();
    switchFLTab('lenormand');
    showModal(document.getElementById('fortune-lenormand-modal'));
}

function resetLenormand() {
    const setup = document.getElementById('lenormand-setup');
    const result = document.getElementById('lenormand-result');
    const resetBtn = document.getElementById('lenormand-reset-btn');
    const qInput = document.getElementById('lenormand-question');
    if (setup) setup.style.display = '';
    if (result) result.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (qInput) qInput.value = '';
    lenormandSystem = 40;
    lenormandCount = 1;
    document.querySelectorAll('.lenormand-num-btn').forEach(btn => {
        const num = btn.querySelector('.leno-btn-num');
        btn.classList.toggle('active', num && num.textContent.trim() === '1');
    });
    updateLenoNumDesc(1);
}

function startLenormandDraw() {
    const cards = getLenormandCards();
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, lenormandCount);
    const question = document.getElementById('lenormand-question').value.trim();

    let cardsHTML = drawn.map((card, i) => `
        <div class="lenormand-card-item" style="animation-delay:${i * 0.1}s;">
            <span class="lenormand-card-icon">${card.icon}</span>
            <div class="lenormand-card-name">${card.name}</div>
            <div class="lenormand-card-num">No.${card.num}</div>
            <div class="lenormand-card-keyword">「${card.keyword}」</div>
            <div class="lenormand-card-meaning">${card.meaning}</div>
        </div>
    `).join('');

    let synthesisHTML = '';
    if (drawn.length > 1) {
        const keywords = drawn.map(c => c.keyword.split('·')[0]).join('、');
        const energies = drawn.map(c => c.name).join(' + ');
        const m0 = drawn[0].meaning.split('，')[0];
        const m2 = drawn.length >= 3 ? drawn[2].meaning.split('，')[0] : '';
        const n0 = drawn[0].name, n1 = drawn[1].name, n2 = drawn.length >= 3 ? drawn[2].name : '';
        
        const templates3 = [
            `「${n0}」的能量如同${m0}的底色，与「${n1}」相互呼应；「${n2}」则带来${m2}的质感。三张牌的能量流动，共同编织出一段关于${keywords}的故事。`,
            `星盘之上，「${n0}」、「${n1}」、「${n2}」三张牌依次展开——各自携带的能量在此汇聚，悄悄低语。${keywords}，是此刻需要关注的核心能量。`,
            `「${n0}」与「${n1}」、「${n2}」共同呈现：${m0}的力量与${m2}的方向在这里交织，等待你迈出那一步。愿三张牌的能量，成为你此刻的指引。`,
            `三张牌共同呈现了一段旅程：「${n0}」、「${n1}」、「${n2}」依次展开，${keywords}的主题贯穿其中，指引着前行的方向。`,
            `宇宙借${energies}的能量，向你传递信息：${m0}的力量与${m2}的可能性已悄然开启，请相信这段旅程有其深意。`
        ];
        const templates2 = [
            `「${n0}」与「${n1}」的能量相遇，${keywords}的主题在此交汇。${m0}的力量遇见了新的可能，共同描绘出当下局势的面貌。`,
            `两张牌携手而来：「${n0}」带着${m0}的底色，「${n1}」带来新的视角。它们共同指向一个关于${keywords}的答案，等待你细细品味。`,
            `${energies}——两种能量在你的问题上留下印记。${m0}与对方的能量相互作用，当前局面因此充满了${keywords}的质感。静下心来，答案已在其中。`,
            `牌与牌之间总有呼应。「${n0}」和「${n1}」的组合，像是宇宙特意为你排列的密码，${keywords}便是解读这段缘分的钥匙。`
        ];
        
        const templates = drawn.length === 3 ? templates3 : templates2;
        const chosenText = templates[Math.floor(Math.random() * templates.length)];
        
        synthesisHTML = `
        <div class="lenormand-synthesis">
            <div class="lenormand-synthesis-title">✦ 综合解读</div>
            ${chosenText}
        </div>`;
    }

    const questionDisplay = question ? `<div class="lenormand-question-show">「${question}」</div>` : '';

    document.getElementById('lenormand-result').innerHTML = `
        ${questionDisplay}
        <div style="text-align:center; font-size:12px; color:var(--text-secondary); margin-bottom:12px;">
            <i class="fas fa-moon"></i> 雷诺曼轻声说 · 爱能克服远距离
        </div>
        <div class="lenormand-cards-row">${cardsHTML}</div>
        ${synthesisHTML}
    `;

    document.getElementById('lenormand-setup').style.display = 'none';
    document.getElementById('lenormand-result').style.display = '';
    document.getElementById('lenormand-reset-btn').style.display = '';

    const lCards = drawn.map(c => ({ name: c.name, keyword: c.keyword, position: '', isReversed: false, meaning: c.meaning }));
    saveDiviHistory({ type: `雷诺曼${lenormandCount === 1 ? '单张' : '三张'}`, question, cards: lCards });
}

const ALL_78_TAROT_CARDS = [
    { name: "愚人", num: "0", type: "major", eng: "The Fool", keyword: "流浪", upright: "全新的开始、冒险精神、天真无邪、活在当下、无限可能、信任直觉、大胆尝试、不受约束", reversed: "愚蠢的决定、鲁莽行事、逃避责任、犹豫不决、缺乏方向感、错失良机、不切实际", img: "https://i.postimg.cc/hGv9scYL/96e54bea7c980b53d1f2904d6de1139b.jpg" },
    { name: "魔术师", num: "I", type: "major", eng: "The Magician", keyword: "创造", upright: "创造力爆发、技能娴熟、意志力强大、化腐朽为神奇、行动力强、专注目标、资源整合、自信满满", reversed: "欺骗手段、操纵他人、能力未充分发挥、意图不纯、缺乏自信、拖延行动、滥用天赋", img: "https://i.postimg.cc/156PgF5Q/bb1a94f3f1b8beaae766b320d766ff7b.jpg" },
    { name: "女祭司", num: "II", type: "major", eng: "The High Priestess", keyword: "智慧", upright: "直觉敏锐、潜意识觉醒、神秘力量、内在智慧、静待时机、倾听内心、保持沉默、精神觉醒", reversed: "秘密暴露、压抑直觉、信息隐藏、非理性判断、抗拒内在声音、表面化、情感封闭", img: "https://i.postimg.cc/Vs2mLg1z/522ea5704ba75a6b17a2bd1ad94c7843.jpg" },
    { name: "女帝", num: "III", type: "major", eng: "The Empress", keyword: "丰收", upright: "丰饶富足、母性光辉、自然力量、感官享受、创造力旺盛、孕育新生、艺术灵感、爱与关怀", reversed: "过度依赖、创意阻塞、过分保护、忽视自我需求、创造力枯竭、情感空虚、放纵", img: "https://i.postimg.cc/FFwNspmX/94c11c30f386c5f3b307fb73e931e0ff.jpg" },
    { name: "皇帝", num: "IV", type: "major", eng: "The Emperor", keyword: "支配", upright: "权威力量、结构秩序、控制能力、稳定可靠、父亲形象、领导才能、理性决策、建立规则", reversed: "专横跋扈、刚愎自用、滥用权力、缺乏弹性、控制欲过强、优柔寡断、失去威信", img: "https://i.postimg.cc/c1P04hWj/acc86a61cbac497830cc9b5e3f5eedbf.jpg" },
    { name: "教皇", num: "V", type: "major", eng: "The Hierophant", keyword: "援助", upright: "传统价值、信仰力量、教导他人、精神指引、遵循制度、寻求导师、群体归属、仪式感", reversed: "叛逆传统、个人信仰觉醒、突破规范、独立思想、质疑权威、脱离束缚、寻找新路", img: "https://i.postimg.cc/L4G26DSb/45bd1da5e8e05458ac85deba2dcf1b4c.jpg" },
    { name: "恋人", num: "VI", type: "major", eng: "The Lovers", keyword: "结合", upright: "真爱降临、和谐关系、价值观选择、灵魂伴侣、情感连接、吸引力强烈、重要抉择、平衡", reversed: "关系失衡、误判对方、价值观冲突、分离危机、犹豫不决、情感考验、选择困难", img: "https://i.postimg.cc/tR8pCkbv/c8e193de2db78acd8d6b0f4b94ceb9eb.jpg" },
    { name: "战车", num: "VII", type: "major", eng: "The Chariot", keyword: "胜利", upright: "意志力坚定、胜利在望、决心强大、自我掌控、勇往直前、克服障碍、明确目标、自信", reversed: "失去控制、方向迷失、挫败感强、固执己见、内在冲突、停滞不前、缺乏自律", img: "https://i.postimg.cc/XNt47LW2/9952b0b90e242125af82412d43a3ddfc.jpg" },
    { name: "力量", num: "VIII", type: "major", eng: "Strength", keyword: "意志", upright: "勇气可嘉、耐心等待、内在力量、温柔坚定、同理心强、情绪管理、化解冲突、自信", reversed: "自我怀疑、软弱无力、压抑内在力量、失去信心、恐惧支配、情绪失控、退缩", img: "https://i.postimg.cc/SQHkNd4G/bbf5a7098702778a0d3f96a7f8ff356e.jpg" },
    { name: "隐士", num: "IX", type: "major", eng: "The Hermit", keyword: "探索", upright: "内省深思、孤独旅程、寻求真理、内在指引、智慧积累、自我探索、独处需要、导师", reversed: "孤立无援、拒绝帮助、过度孤独、逃避现实、与社会脱节、封闭自我、不愿成长", img: "https://i.postimg.cc/2j1CDJst/28e4666f91395d530d5e2e754edf723d.jpg" },
    { name: "命运之轮", num: "X", type: "major", eng: "Wheel of Fortune", keyword: "轮回", upright: "命运转折、循环往复、好运降临、因果报应、机遇来临、顺势而为、变化将至、意外", reversed: "逆境来袭、抗拒改变、恶性循环、运气不佳、错失良机、无法掌控、命运捉弄", img: "https://i.postimg.cc/59XfVGhk/794c115c0d699838ca5be1775e93ad20.jpg" },
    { name: "正义", num: "XI", type: "major", eng: "Justice", keyword: "均衡", upright: "公正裁决、真相大白、因果报应、法律事务、诚实守信、平衡判断、责任承担、公平", reversed: "不公正待遇、逃避责任、不诚实行为、法律纠纷、失衡状态、偏见歧视、后果", img: "https://i.postimg.cc/v84GsjJX/1be9b7793332da671dd8843bc13134a4.jpg" },
    { name: "倒吊人", num: "XII", type: "major", eng: "The Hanged Man", keyword: "奉献", upright: "牺牲精神、新视角看问题、等待时机、放下执念、顿悟时刻、换位思考、暂停", reversed: "拖延症、无谓牺牲、停滞不前、抗拒改变、无法放手、固执己见、错失顿悟", img: "https://i.postimg.cc/XNrnbhRg/55b46df567a1b9a4c4e6d3e8c90f8114.jpg" },
    { name: "死神", num: "XIII", type: "major", eng: "Death", keyword: "结束", upright: "结束与开始、转变来临、重生机会、放手过去、蜕变成长、不可抗拒的变化、新生", reversed: "抗拒改变、无法放手、腐朽停滞、恐惧新生、固执不变、拒绝结束、拖延", img: "https://i.postimg.cc/G34bCNWk/f9f117b116ed89070375ff8b2b8f2906.jpg" },
    { name: "节制", num: "XIV", type: "major", eng: "Temperance", keyword: "净化", upright: "平衡之道、适度原则、耐心等待、调和矛盾、中庸智慧、情绪管理、调和", reversed: "失衡状态、过度放纵、缺乏耐心、极端行为、矛盾激化、无法调和、冲动", img: "https://i.postimg.cc/HWrTgKqX/f6bba5a04896b1eafd85e4b414e5e7fe.jpg" },
    { name: "恶魔", num: "XV", type: "major", eng: "The Devil", keyword: "诱惑", upright: "束缚关系、物质主义、欲望诱惑、沉迷享乐、阴暗面显现、执着成瘾、被困", reversed: "解脱束缚、重获自由、自我觉醒、放下执念、摆脱控制、认清真相、解放", img: "https://i.postimg.cc/ZYWJSgG9/0193aa497922eb37bdef24da7e82fc5c.jpg" },
    { name: "高塔", num: "XVI", type: "major", eng: "The Tower", keyword: "毁灭", upright: "突变降临、混乱局面、启示觉醒、破坏重建、真相大白、意外打击、崩塌", reversed: "延迟变化、避免灾难、内在崩溃、抗拒真相、恐惧改变、压抑爆发、缓慢", img: "https://i.postimg.cc/RCWvB8kW/b3aa6bb2075c9333cd2fe88ffe6b8845.jpg" },
    { name: "星星", num: "XVII", type: "major", eng: "The Star", keyword: "希望", upright: "希望之光、灵感涌现、平静安宁、治愈能量、信念坚定、心灵指引、乐观", reversed: "绝望情绪、失去信仰、悲观消极、灵感枯竭、信心动摇、迷茫无助、失望", img: "https://i.postimg.cc/fWVMNFGy/efc1373d89e1fb57fd39ba46809a5d6e.jpg" },
    { name: "月亮", num: "XVIII", type: "major", eng: "The Moon", keyword: "不安", upright: "幻觉迷惑、恐惧心理、焦虑情绪、潜意识浮现、不确定性、梦境启示、直觉", reversed: "恐惧消散、真相浮现、走出迷惘、看清现实、克服焦虑、方向明确、稳定", img: "https://i.postimg.cc/PfCdjcg5/f91356263746aaf0574a4074b5c75a71.jpg" },
    { name: "太阳", num: "XIX", type: "major", eng: "The Sun", keyword: "生命", upright: "快乐洋溢、成功在望、活力充沛、清晰明朗、正能量满满、积极向上、成就", reversed: "悲观情绪、自我怀疑、短暂挫折、快乐受阻、缺乏自信、阴霾笼罩、暂时", img: "https://i.postimg.cc/NF3JqL3t/cc7920c1085e317299e6022f7c11418f.jpg" },
    { name: "审判", num: "XX", type: "major", eng: "Judgement", keyword: "复活", upright: "复活重生、觉醒时刻、号召来临、重要决定、自我评价、因果报应、召唤", reversed: "自我怀疑、拒绝接受审判、过去纠缠、逃避责任、后悔自责、无法觉醒", img: "https://i.postimg.cc/ZnG7t01X/2af3b253975f72db648372f5f67b19c8.jpg" },
    { name: "世界", num: "XXI", type: "major", eng: "The World", keyword: "达成", upright: "完成圆满、整合统一、成就达成、世界在脚下、旅途终点、成功实现、圆满", reversed: "未完成事项、拖延症、缺乏完结感、停滞不前、未能整合、遗憾残留", img: "https://i.postimg.cc/tJKSQ7LD/7f69519939b241e131dbd58d7bb8b648.jpg" },
    { name: "权杖一", num: "Ace", type: "wands", eng: "Ace of Wands", keyword: "灵感", upright: "新灵感迸发、创意火花、激情开始、行动欲望、创业精神、能量涌现、新项目", reversed: "创意受阻、缺乏动力、计划搁浅、拖延行动、热情消退、不敢开始", img: "https://i.postimg.cc/8zh3GBk9/ed2ce5320ab2882ead4f42a9492923ae.jpg" },
    { name: "权杖二", num: "2", type: "wands", eng: "Two of Wands", keyword: "规划", upright: "规划未来、展望远方、个人力量、决策时刻、探索可能、离开舒适区、勇敢", reversed: "恐惧未知、缺乏计划、自我设限、犹豫不决、停滞不前、害怕改变", img: "https://i.postimg.cc/pLD7vYVq/181ffcef5e2caec52135f3fd3bb60e60.jpg" },
    { name: "权杖三", num: "3", type: "wands", eng: "Three of Wands", keyword: "扩展", upright: "扩展视野、远见卓识、探索精神、等待成果、贸易合作、海外机会、领导", reversed: "障碍出现、延迟到来、预期未达、合作受阻、远见不足、耐心缺失", img: "https://i.postimg.cc/XYwhWcNk/170261009cbe95510da1b5ab7c3ecdcc.jpg" },
    { name: "权杖四", num: "4", type: "wands", eng: "Four of Wands", keyword: "庆典", upright: "庆祝时刻、稳定基础、家庭幸福、里程碑达成、和谐团聚、安居乐业、丰收", reversed: "不稳定状态、家庭矛盾、延迟庆祝、基础动摇、和谐被打破、暂缓", img: "https://i.postimg.cc/VkjTwBsq/a4480049b7630cec92c1245db9b65035.jpg" },
    { name: "权杖五", num: "5", type: "wands", eng: "Five of Wands", keyword: "竞争", upright: "竞争激烈、冲突不断、挑战重重、意见分歧、斗争状态、能量争夺、混乱", reversed: "内部冲突、避免对抗、达成协议、和解可能、放下争执、寻求共识", img: "https://i.postimg.cc/zGnMNSDn/71341bdf2261a50098c9cf5b4763e238.jpg" },
    { name: "权杖六", num: "6", type: "wands", eng: "Six of Wands", keyword: "凯旋", upright: "胜利凯旋、获得认可、成功喜悦、公众赞誉、自信满满、领导地位、好消息", reversed: "私下的成功、不稳定的成功、傲慢自大、失去支持、期待落空、延迟", img: "https://i.postimg.cc/0yp3vd5m/02c1bb07bb55c9c7ad18daea4ea4732a.jpg" },
    { name: "权杖七", num: "7", type: "wands", eng: "Seven of Wands", keyword: "坚守", upright: "防御姿态、坚守立场、面对挑战、坚持信念、不畏艰难、迎难而上、勇气", reversed: "放弃抵抗、被压倒、自我怀疑、无力应对、屈服压力、退缩逃避", img: "https://i.postimg.cc/Mpy4wbZB/b2437558d88e7ad755ab686ca5c16f44.jpg" },
    { name: "权杖八", num: "8", type: "wands", eng: "Eight of Wands", keyword: "速度", upright: "迅速行动、进展加速、旅行将至、消息传来、能量释放、快速发展、冲刺", reversed: "延误延迟、等待过程、障碍出现、计划受阻、缓慢进展、消息迟到", img: "https://i.postimg.cc/sgp8z9fv/8dedf2bca5a629d0778f1260d812868f.jpg" },
    { name: "权杖九", num: "9", type: "wands", eng: "Nine of Wands", keyword: "坚韧", upright: "坚韧不拔、弹性恢复、最后挑战、边界意识、谨慎戒备、准备迎战、耐力", reversed: "偏执多疑、顽固不化、不愿妥协、防卫过度、精疲力竭、被迫放弃", img: "https://i.postimg.cc/13pTScRt/79248609ebe669bfdbbf0bb8a6f3baf4.jpg" },
    { name: "权杖十", num: "10", type: "wands", eng: "Ten of Wands", keyword: "重担", upright: "责任过重、负担压力、努力奋斗、接近终点、承担过多、疲惫不堪、坚持", reversed: "放下重担、委派任务、精简生活、解脱压力、学会放手、减轻负担", img: "https://i.postimg.cc/RZr82bmq/d6e15b8d05aa8769a873f91cefa5a340.jpg" },
    { name: "权杖侍者", num: "Page", type: "wands", eng: "Page of Wands", keyword: "热情", upright: "热情洋溢、探索精神、新消息将至、好奇心强、创意潜力、冒险尝试、活力", reversed: "轻率决定、三分钟热度、缺乏方向、消息延迟、创意受阻、热情消退", img: "https://i.postimg.cc/Mpk4grwK/3375196008b411d59a8ef6b218a706d8.jpg" },
    { name: "权杖骑士", num: "Knight", type: "wands", eng: "Knight of Wands", keyword: "冒险", upright: "冒险精神、充沛能量、勇敢行动、自信进取、旅行出发、追求激情、冲动", reversed: "鲁莽行事、分散注意力、缺乏耐心、冲动后果、半途而废、能量耗尽", img: "https://i.postimg.cc/2SpJgXYk/47f44a5727edbaf82f76c243387bcf41.jpg" },
    { name: "权杖女王", num: "Queen", type: "wands", eng: "Queen of Wands", keyword: "魅力", upright: "魅力四射、自信满满、热情洋溢、独立自主、领袖气质、吸引他人、阳光", reversed: "自私自利、嫉妒心强、内向退缩、缺乏自信、热情熄灭、控制欲强", img: "https://i.postimg.cc/4xCMjFGX/82d378bbafc5c9a257c91a40e5a0deaf.jpg" },
    { name: "权杖国王", num: "King", type: "wands", eng: "King of Wands", keyword: "领袖", upright: "领袖风范、愿景远大、创业精神、激励他人、果断决策、成熟稳重、权威", reversed: "专横霸道、冲动行事、高压控制、滥用权力、决策失误、失去威信", img: "https://i.postimg.cc/MKfNPJC8/08f0f33165febd7ee79ac12ec795ad7e.jpg" },
    { name: "圣杯一", num: "Ace", type: "cups", eng: "Ace of Cups", keyword: "爱涌现", upright: "新恋情萌芽、情感开始流动、灵性连接、直觉增强、丰盛喜悦、爱满溢", reversed: "情感封闭、爱的阻塞、内心空虚、无法付出、情感枯竭、缺乏共鸣", img: "https://i.postimg.cc/nryRbM6k/273ec8e6e58eeb6ee63a63fd4f639b1f.jpg" },
    { name: "圣杯二", num: "2", type: "cups", eng: "Two of Cups", keyword: "联结", upright: "联结关系、伙伴关系、相互吸引、和谐互动、平等相爱、心灵相通、合作", reversed: "失衡关系、误解误会、分离倾向、单相思、情感不公、关系破裂", img: "https://i.postimg.cc/ZnG7t01P/e74f7e6d4e351965dc2b0ef1b3442d93.jpg" },
    { name: "圣杯三", num: "3", type: "cups", eng: "Three of Cups", keyword: "庆祝", upright: "庆祝欢聚、友情深厚、社群温暖、喜悦分享、创意合作、姐妹情谊、派对", reversed: "过度放纵、孤立自己、朋友冲突、表面和谐、情感消耗、团体矛盾", img: "https://i.postimg.cc/0jTWRrL0/832c9a5200494a0c807429cc93952286.jpg" },
    { name: "圣杯四", num: "4", type: "cups", eng: "Four of Cups", keyword: "冥想", upright: "冥想状态、无聊倦怠、重新评估、内省时刻、错过眼前机会、不满现状", reversed: "新机会出现、重新参与生活、走出冷漠、接受馈赠、打开心扉、觉醒", img: "https://i.postimg.cc/6q2jmC1M/15d1185a92f07038c32528152d7f73d0.jpg" },
    { name: "圣杯五", num: "5", type: "cups", eng: "Five of Cups", keyword: "失落", upright: "失落感强、悲伤情绪、后悔自责、专注负面、遗憾过去、无法释怀、痛苦", reversed: "从失去中恢复、学会接受、继续前进、看到希望、宽恕他人、放下", img: "https://i.postimg.cc/rs0nP5Yg/49dffe658b336e3f72b6c8e08d34eb24.jpg" },
    { name: "圣杯六", num: "6", type: "cups", eng: "Six of Cups", keyword: "怀旧", upright: "怀旧情绪、过去回忆、天真烂漫、收到礼物、童年记忆、重逢时刻、单纯", reversed: "困在过去、不切实际、成长受阻、无法前进、沉溺回忆、拒绝长大", img: "https://i.postimg.cc/J0D62jd3/1b73e7a42135de2e8bf75ec7d5731355.jpg" },
    { name: "圣杯七", num: "7", type: "cups", eng: "Seven of Cups", keyword: "幻想", upright: "幻想重重、选择过多、白日做梦、愿望投射、迷失方向、不切实际、诱惑", reversed: "聚焦目标、从幻想回归现实、决断时刻、看清真相、选择明确、落地", img: "https://i.postimg.cc/brDCB1Fk/6b9cba94ba7e150fee51a0deedbdfeca.jpg" },
    { name: "圣杯八", num: "8", type: "cups", eng: "Eight of Cups", keyword: "离去", upright: "离开现状、追寻更深意义、放下过去、踏上旅程、告别过去、探索精神", reversed: "逃避问题、放弃责任、停滞不前、不敢离开、犹豫不决、无处可去", img: "https://i.postimg.cc/KjkqHtsg/9d037a30311a7c71d8b112066e90a90a.jpg" },
    { name: "圣杯九", num: "9", type: "cups", eng: "Nine of Cups", keyword: "满足", upright: "满足感强、愿望成真、幸福满满、感恩之心、丰盛富足、自我实现、快乐", reversed: "不满足感、物质主义、过分自满、贪婪欲望、表面光鲜、内心空虚", img: "https://i.postimg.cc/Gt875vS8/2ee0bc4068be0dc8dc916a3d602da2af.jpg" },
    { name: "圣杯十", num: "10", type: "cups", eng: "Ten of Cups", keyword: "圆满", upright: "情感圆满、家庭幸福、内心平和、真爱永恒、和谐关系、幸福归宿、喜悦", reversed: "家庭矛盾、不和谐音、幸福幻灭、关系紧张、情感裂痕、失去和谐", img: "https://i.postimg.cc/ZnB7M6DR/28cf2538308f40a6a6bc321a45e80ba2.jpg" },
    { name: "圣杯侍者", num: "Page", type: "cups", eng: "Page of Cups", keyword: "直觉", upright: "创意涌现、直觉信息、情感探索、艺术灵感、梦境启示、温柔敏感、消息", reversed: "情绪化严重、逃避现实、创意受阻、幼稚行为、情感混乱、不成熟", img: "https://i.postimg.cc/9MNgbL14/362ea49a1b85f4e980578e652a2e5097.jpg" },
    { name: "圣杯骑士", num: "Knight", type: "cups", eng: "Knight of Cups", keyword: "浪漫", upright: "浪漫多情、魅力四射、艺术气质、追求理想、情感冒险、温柔体贴、邀请", reversed: "多愁善感、幻想破灭、无法兑现诺言、情感欺骗、不切实际、逃避", img: "https://i.postimg.cc/85nX4Zwj/a194c456550d36f2c798a6b2ec24a9af.jpg" },
    { name: "圣杯女王", num: "Queen", type: "cups", eng: "Queen of Cups", keyword: "慈悲", upright: "同理心强、慈悲为怀、直觉敏锐、情感成熟、关怀他人、温柔包容、滋养", reversed: "情绪失控、不安全感强、依赖他人、情感勒索、过度敏感、脆弱", img: "https://i.postimg.cc/Sst1dgVK/80204fb42105c75a3ed665961917b0c4.jpg" },
    { name: "圣杯国王", num: "King", type: "cups", eng: "King of Cups", keyword: "情感智慧", upright: "情感平衡、智慧圆融、外交手腕、慷慨大方、情感成熟、包容稳定、温和", reversed: "情绪操控、冷漠无情、情绪不稳定、喜怒无常、压抑情感、虚假", img: "https://i.postimg.cc/G2SgKXzd/94e1246d36f6e13dc303bd3144b2896f.jpg" },
    { name: "宝剑一", num: "Ace", type: "swords", eng: "Ace of Swords", keyword: "真相", upright: "真相大白、思维清晰、突破困境、新思想涌现、正义伸张、理智战胜、洞察", reversed: "混乱思维、谎言欺骗、思维混乱、无法决断、真相被掩、误解重重", img: "https://i.postimg.cc/25GKbkZv/8796ef62d2135917b2585380ef1e403d.jpg" },
    { name: "宝剑二", num: "2", type: "swords", eng: "Two of Swords", keyword: "僵局", upright: "僵持不下、难以决断、封闭心门、逃避真相、拒绝看见、内心矛盾、平衡", reversed: "信息显现、做出决定、困境解除、看清真相、打开心扉、释放压力", img: "https://i.postimg.cc/yNjbg1ZJ/46a8207ec3f77e0436bdd2d958d85153.jpg" },
    { name: "宝剑三", num: "3", type: "swords", eng: "Three of Swords", keyword: "心碎", upright: "心碎欲绝、悲伤难抑、失去之痛、分离打击、痛苦折磨、泪水流淌、失望", reversed: "从悲伤恢复、宽恕他人、疗愈开始、接受现实、释放心痛、重新开始", img: "https://i.postimg.cc/bvgBDytZ/3f88e25f2caa455fab226c8e9b71e2b7.jpg" },
    { name: "宝剑四", num: "4", type: "swords", eng: "Four of Swords", keyword: "休养", upright: "休息恢复、静默冥想、暂时撤退、休养生息、独处充电、等待时机、安宁", reversed: "重返活动、再次激活、不耐烦休息、提前行动、精力恢复、躁动不安", img: "https://i.postimg.cc/3w1c48vN/0b76c577cc2f356ab474fde5c653a4f8.jpg" },
    { name: "宝剑五", num: "5", type: "swords", eng: "Five of Swords", keyword: "冲突", upright: "冲突升级、失败收场、空洞胜利、不诚实手段、争吵不断、胜之不武、损失", reversed: "和解可能、超越冲突、走向和平、放下争执、接受失败、寻求共识", img: "https://i.postimg.cc/XvLzGjCv/c7e327ad086f503b55be7b22a8ec7805.jpg" },
    { name: "宝剑六", num: "6", type: "swords", eng: "Six of Swords", keyword: "过渡", upright: "过渡时期、逃离困境、平静旅程、向前迈进、艰难前行、希望在前、疗愈", reversed: "抗拒改变、无处可逃、困难过渡、停滞不前、反复挣扎、无法摆脱", img: "https://i.postimg.cc/fbCrtz9M/c4d36a80ec72fcc67689b64f536e6c5a.jpg" },
    { name: "宝剑七", num: "7", type: "swords", eng: "Seven of Swords", keyword: "策略", upright: "策略计划、欺骗隐瞒、单独行动、不诚实手段、智取逃避、偷偷摸摸、机智", reversed: "真相揭露、良心发现、归还所得、承认错误、放弃欺骗、面对后果", img: "https://i.postimg.cc/jjcFwx7b/a3f6098c94ec09059bfc931d09bd6b16.jpg" },
    { name: "宝剑八", num: "8", type: "swords", eng: "Eight of Swords", keyword: "束缚", upright: "受困束缚、限制重重、负面思维、无助感强、自我设限、无法挣脱、恐惧", reversed: "重获自由、新视角出现、接受帮助、打破枷锁、释放自我、看清真相", img: "https://i.postimg.cc/MGqLpMvT/04fcc588cd33657692a92619aea39ed7.jpg" },
    { name: "宝剑九", num: "9", type: "swords", eng: "Nine of Swords", keyword: "焦虑", upright: "焦虑不安、噩梦连连、担忧过度、内心痛苦、罪恶感强、失眠困扰、绝望", reversed: "从绝望走出、寻求帮助、希望重现、减轻焦虑、放下负担、自我宽恕", img: "https://i.postimg.cc/cJ0zLgr4/e81e8ab062e810198907252f14b0b2f2.jpg" },
    { name: "宝剑十", num: "10", type: "swords", eng: "Ten of Swords", keyword: "终结", upright: "终结时刻、失败打击、被背叛感、最低谷期、痛苦结束、崩溃边缘、绝望", reversed: "从失败恢复、抗拒接受、新开始萌芽、慢慢起身、教训吸取、重生", img: "https://i.postimg.cc/FKN6Hd7h/227daf3b9af1be2460550dca58bded74.jpg" },
    { name: "宝剑侍者", num: "Page", type: "swords", eng: "Page of Swords", keyword: "洞察", upright: "好奇心强、洞察力敏锐、机警灵活、新想法涌现、警觉性高、学习迅速、消息", reversed: "散漫无序、粗心大意、言语伤人、八卦传播、缺乏重点、沟通不畅", img: "https://i.postimg.cc/yNsG8gk4/f3bac9ab5a52947e4b66a4ac632d70ef.jpg" },
    { name: "宝剑骑士", num: "Knight", type: "swords", eng: "Knight of Swords", keyword: "冲劲", upright: "行动力强、冲劲十足、直接果断、野心勃勃、智慧战斗、快速前进、勇气", reversed: "鲁莽行事、仓促决定、过于好斗、言语尖刻、不顾后果、急躁冲动", img: "https://i.postimg.cc/1zsd3n42/522975dc24a7604bd9446badf86a42d1.jpg" },
    { name: "宝剑女王", num: "Queen", type: "swords", eng: "Queen of Swords", keyword: "独立", upright: "独立自主、清晰思考、直接坦率、聪明睿智、设立界限、理性决策、诚实", reversed: "刻薄无情、过于批判、痛苦过往、冷漠疏离、心胸狭隘、报复心强", img: "https://i.postimg.cc/KYxW8k4V/7e8f572137114fa7dc96882b66dfc560.jpg" },
    { name: "宝剑国王", num: "King", type: "swords", eng: "King of Swords", keyword: "理性", upright: "理性权威、思维清晰、道德标准高、客观决策、公正判断、智慧领导、经验", reversed: "操控他人、专横霸道、滥用权力、冷酷无情、判断失误、刚愎自用", img: "https://i.postimg.cc/7LwRZGbN/b0f5d9218e2e4ef9a4652df089b97b9a.jpg" },
    { name: "星币一", num: "Ace", type: "pentacles", eng: "Ace of Pentacles", keyword: "机遇", upright: "新物质机遇、丰盛富足、财富开始、安全感增强、实用开端、踏实起步、礼物", reversed: "错失良机、财务不稳、固执己见、投资失误、缺乏规划、机会溜走", img: "https://i.postimg.cc/9MNgbL1V/94448c6a431ceb9959491624fea0e38a.jpg" },
    { name: "星币二", num: "2", type: "pentacles", eng: "Two of Pentacles", keyword: "平衡", upright: "多任务处理、适应性强、时间管理、收支平衡、灵活应对、忙中有序、节奏", reversed: "失去平衡、混乱无序、过度承诺、财务紧张、手忙脚乱、无法兼顾", img: "https://i.postimg.cc/G2SgKXK6/757698797cf41a491b3ab99d688854dc.jpg" },
    { name: "星币三", num: "3", type: "pentacles", eng: "Three of Pentacles", keyword: "协作", upright: "团队合作、技能提升、协作共赢、学习成长、学徒阶段、共同目标、认可", reversed: "缺乏团队精神、品质不达标、孤立工作、沟通不畅、技术不足、合作失败", img: "https://i.postimg.cc/Kzspf0fp/a452903cc09ba4daa5cab2093c51a5c3.jpg" },
    { name: "星币四", num: "4", type: "pentacles", eng: "Four of Pentacles", keyword: "守护", upright: "安全感需求、节俭储蓄、守护财富、控制欲强、固守现状、保守稳重、积累", reversed: "过度节俭、贪婪成性、财务损失、抓得太紧、不愿分享、害怕失去", img: "https://i.postimg.cc/k45hW0NP/26b157d62962905f2dc877344c61e1b9.jpg" },
    { name: "星币五", num: "5", type: "pentacles", eng: "Five of Pentacles", keyword: "艰难", upright: "艰难时期、物质损失、孤立无援、健康问题、贫困感强、被排斥外、担忧", reversed: "从艰难恢复、寻求帮助、好转迹象、重获支持、走出低谷、改善", img: "https://i.postimg.cc/TwPHnzVz/d4f448dd9e6eac42bd34952713f8b35a.jpg" },
    { name: "星币六", num: "6", type: "pentacles", eng: "Six of Pentacles", keyword: "给予", upright: "慷慨给予、接受馈赠、平衡施受、慈善行为、财富流动、帮助他人、分享", reversed: "债务缠身、吝啬小气、权力不平衡、索取过度、依赖他人、不公", img: "https://i.postimg.cc/ZRqD6G82/68b1beb7020af71fa4e727c28dc610d6.jpg" },
    { name: "星币七", num: "7", type: "pentacles", eng: "Seven of Pentacles", keyword: "耕耘", upright: "长期投资、耐心等待、成果评估、持续努力、耕耘收获、审视进度、坚持", reversed: "缺乏远见、焦虑不安、无效努力、回报不足、灰心丧气、放弃坚持", img: "https://i.postimg.cc/cHJ5fpRD/4e78f21fb36d384b237ce384885a5fb0.jpg" },
    { name: "星币八", num: "8", type: "pentacles", eng: "Eight of Pentacles", keyword: "精进", upright: "工匠精神、技能提升、投入工作、专注细节、精益求精、学习钻研、勤奋", reversed: "完美主义、缺乏专注、质量下降、工作倦怠、敷衍了事、技能不足", img: "https://i.postimg.cc/JnhdjfNp/dde01f64fc66e6c7446edc3750f81cb0.jpg" },
    { name: "星币九", num: "9", type: "pentacles", eng: "Nine of Pentacles", keyword: "优雅", upright: "丰盛富足、优雅从容、自给自足、物质享受、独立自信、花园丰收、宁静", reversed: "过度劳累、物质主义、虚假繁荣、孤独空虚、依赖他人、表面光鲜", img: "https://i.postimg.cc/4d3FpD65/68db2a7d50d230a020feb7f6f404efa3.jpg" },
    { name: "星币十", num: "10", type: "pentacles", eng: "Ten of Pentacles", keyword: "圆满", upright: "家族传承、长期稳定、财富圆满、遗产继承、世代繁荣、根基深厚、归属", reversed: "家族冲突、财务不稳、传统破裂、遗产纠纷、失去根基、离散", img: "https://i.postimg.cc/tTgmFK3d/40492228d3d7b1658ef883153e8d6e3b.jpg" },
    { name: "星币侍者", num: "Page", type: "pentacles", eng: "Page of Pentacles", keyword: "学习", upright: "学习热情、实际技能、计划制定、谨慎踏实、新工作开始、专注努力、潜力", reversed: "缺乏进展、不切实际、懒惰拖延、学习受阻、目标不明、浪费时间", img: "https://i.postimg.cc/76LQSF3S/372d86040b237875ac164802856a4432.jpg" },
    { name: "星币骑士", num: "Knight", type: "pentacles", eng: "Knight of Pentacles", keyword: "务实", upright: "勤勉可靠、务实稳重、责任心强、按部就班、耐心坚持、工作努力、守护", reversed: "停滞不前、无聊乏味、过于保守、缺乏冒险、效率低下、固执不变", img: "https://i.postimg.cc/G2pSvWFD/f9dedf51440bafc9ddb64b8ecf45362a.jpg" },
    { name: "星币女王", num: "Queen", type: "pentacles", eng: "Queen of Pentacles", keyword: "滋养", upright: "务实养育、富足慷慨、关爱家庭、接地气的生活、物质与情感平衡、舒适", reversed: "工作与生活失衡、嫉妒他人、过度物质、忽视情感、操劳过度、焦虑", img: "https://i.postimg.cc/xCdFLwvN/9aa38a0ab78af98aeb73d93a00b74573.jpg" },
    { name: "星币国王", num: "King", type: "pentacles", eng: "King of Pentacles", keyword: "繁荣", upright: "物质成功、财务安全、商业头脑、可靠稳重、富足丰盛、投资有道、成就", reversed: "固执己见、物质主义、冒险财务、贪婪腐败、失去判断、投资失败", img: "https://i.postimg.cc/MG5FM6Q0/c8093dafa7eb0921bb16f32c77df51f6.jpg" }
];const TAROT_TYPE_NAMES = { major: '大阿卡纳', wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };

let currentTarotSpread = 'single';

function setTarotSpread(spread) {
    currentTarotSpread = spread;
    document.querySelectorAll('.tarot-spread-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.spread === spread);
    });
    const desc = document.getElementById('tarot-spread-desc');
    if (spread === 'single') {
        if (desc) desc.textContent = '单张牌 · 直指当下';
    } else if (spread === 'three') {
        if (desc) desc.textContent = '三张牌 · 洞察全局';
    }
}

function resetTarotDivination() {
    const setup = document.getElementById('tarot-setup');
    const result = document.getElementById('tarot-result');
    const resetBtn = document.getElementById('tarot-reset-btn');
    const qInput = document.getElementById('tarot-question');
    if (setup) setup.style.display = '';
    if (result) result.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'none';
    if (qInput) qInput.value = '';
    currentTarotSpread = 'single';
    document.querySelectorAll('.tarot-spread-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.spread === 'single');
    });
    const desc = document.getElementById('tarot-spread-desc');
    if (desc) desc.textContent = '单张牌 · 直指当下';
}

function startTarotDraw() {
    const shuffled = [...ALL_78_TAROT_CARDS].sort(() => Math.random() - 0.5);
    const question = (document.getElementById('tarot-question') || {}).value || '';
    const questionTrimmed = question.trim();
    const drawnCards = [];

function cardHTML(card, position, labelOverride) {
        const isReversed = Math.random() > 0.5;
        const meaning = isReversed ? card.reversed : card.upright;
        const posLabel = labelOverride || position;
        
        drawnCards.push({ name: card.name, keyword: card.keyword, position: posLabel, isReversed, meaning });

        const frontContent = card.img 
            ? `<img src="${card.img}" style="width: 100%; height: 100%; object-fit: cover; ${isReversed ? 'transform: rotate(180deg);' : ''}">`
            : `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:var(--primary-bg); color:var(--text-secondary);">
                 <i class="fas ${card.icon}" style="font-size:40px; margin-bottom:10px; ${isReversed ? 'transform: rotate(180deg);' : ''}"></i>
                 <div style="font-size:14px; font-weight:bold;">${card.name}</div>
                 <div style="font-size:10px; margin-top:5px;"></div>
               </div>`;

return `
        <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <div class="tarot-container-3d tarot-responsive" style="margin-bottom: 10px; cursor: pointer;" onclick="this.classList.toggle('flipped');">
                <div class="tarot-card-inner">
                    <div class="tarot-face tarot-front" style="padding: 0; overflow: hidden; border: 2px solid var(--border-color); background: var(--secondary-bg);">
                        ${frontContent}
                    </div>

                    <div class="tarot-face tarot-back" style="background: linear-gradient(135deg, var(--secondary-bg), rgba(var(--accent-color-rgb), 0.05)); border: 2px solid rgba(var(--accent-color-rgb), 0.3); padding: 15px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow-y: auto;">
                        <div style="font-size:10px; color:var(--text-secondary); margin-bottom:6px;">${posLabel}</div>
                        <div class="tarot-card-name" style="font-size:16px; font-weight: 700;">${card.name}</div>
                        <div class="tarot-position-badge ${isReversed ? 'reversed' : 'upright'}" style="margin:4px auto; font-size:10px; padding: 2px 8px; background: var(--primary-bg);">${isReversed ? '逆位' : '正位'}</div>
                        <div style="font-weight: bold; color: var(--accent-color); font-size:12px; margin: 8px 0 4px;">「${card.keyword}」</div>
                        <div style="font-size: 11px; text-align: left; line-height: 1.6; color: var(--text-primary); width: 100%;">${meaning}</div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    let resultHTML = '';
    const qDisplay = questionTrimmed ? `<div class="lenormand-question-show">「${questionTrimmed}」</div>` : '';
    let spreadLabel = '';

    if (currentTarotSpread === 'single') {
        spreadLabel = '单张塔罗';
        const card = shuffled[0];
        resultHTML = `${qDisplay}
        <div style="text-align:center;font-size:12px;color:var(--text-secondary);margin-bottom:12px;"><i class="fas fa-star-and-crescent"></i> 塔罗为你揭示 · 一切皆有答案</div>
        <div class="tarot-row single-card">${cardHTML(card, '当下')}</div>`;
    } else if (currentTarotSpread === 'three') {
        spreadLabel = '三张塔罗';
        const [card1, card2, card3] = shuffled.slice(0, 3);
        resultHTML = `${qDisplay}
        <div style="text-align:center;font-size:12px;color:var(--text-secondary);margin-bottom:12px;"><i class="fas fa-star-and-crescent"></i> 三张牌为你揭示 · 洞见能量流动</div>
        <div class="tarot-row">${cardHTML(card1, '牌一')}${cardHTML(card2, '牌二')}${cardHTML(card3, '牌三')}</div>`;
    }

    const resultEl = document.getElementById('tarot-result');
    const setupEl = document.getElementById('tarot-setup');
    const resetBtn = document.getElementById('tarot-reset-btn');
    if (resultEl) { resultEl.innerHTML = resultHTML; resultEl.style.display = ''; }
    if (setupEl) setupEl.style.display = 'none';
    if (resetBtn) resetBtn.style.display = '';

    saveDiviHistory({ type: spreadLabel, question: questionTrimmed, cards: drawnCards });
}

document.addEventListener('click', function(e) {
    const btn = e.target.closest('.tarot-spread-btn');
    if (!btn) return;
    setTarotSpread(btn.dataset.spread);
});
document.addEventListener('click', function(e) {
    if (e.target.id === 'close-tarot-divination') {
        const modal = document.getElementById('fortune-lenormand-modal');
        if (modal) hideModal(modal);
    }
});

const DIVI_HISTORY_KEY = 'diviHistory_v1';
const DIVI_HISTORY_MAX = 50;

function getDiviHistory() {
    try { return JSON.parse(localStorage.getItem(DIVI_HISTORY_KEY) || '[]'); } catch(e) { return []; }
}

function saveDiviHistory(entry) {
    const history = getDiviHistory();
    entry.id = Date.now();
    entry.time = new Date().toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    history.unshift(entry);
    if (history.length > DIVI_HISTORY_MAX) history.splice(DIVI_HISTORY_MAX);
    localStorage.setItem(DIVI_HISTORY_KEY, JSON.stringify(history));
}

function clearDiviHistory() {
    if (!confirm('确定要清空所有占卜记录吗？')) return;
    localStorage.removeItem(DIVI_HISTORY_KEY);
    renderDiviHistory();
}

function renderDiviHistory() {
    const list = document.getElementById('divi-history-list');
    const empty = document.getElementById('divi-history-empty');
    if (!list) return;
    const history = getDiviHistory();
    if (!history.length) {
        list.innerHTML = '';
        if (empty) empty.style.display = '';
        return;
    }
    if (empty) empty.style.display = 'none';
    list.innerHTML = history.map(entry => {
        const cardTags = (entry.cards || []).map(c =>
            `<span class="divi-history-card-tag ${c.isReversed ? 'reversed' : ''}">
                ${c.isReversed ? '<i class="fas fa-arrow-down" style="font-size:9px;"></i>' : '<i class="fas fa-arrow-up" style="font-size:9px;"></i>'}
                ${c.name}
            </span>`
        ).join('');
        const detailLines = (entry.cards || []).map(c =>
            `<div style="margin-bottom:6px;"><b>${c.name}${c.isReversed ? ' 逆位' : ' 正位'}</b><br>${c.keyword} — ${c.meaning}</div>`
        ).join('');
        return `
        <div class="divi-history-item">
            <div class="divi-history-meta">
                <span class="divi-history-type">${entry.type || '占卜'}</span>
                <span class="divi-history-time">${entry.time || ''}</span>
            </div>
            ${entry.question ? `<div class="divi-history-question">「${entry.question}」</div>` : ''}
            <div class="divi-history-cards">${cardTags}</div>
            ${detailLines ? `<button class="divi-history-expand-btn" onclick="toggleDiviDetail(this)">查看解读 ▾</button>
            <div class="divi-history-detail">${detailLines}</div>` : ''}
        </div>`;
    }).join('');
}
function toggleDiviDetail(btn) {
    const detail = btn.nextElementSibling;
    if (!detail) return;
    const open = detail.classList.toggle('open');
    btn.textContent = open ? '收起 ▴' : '查看解读 ▾';
}

const _origSwitchFLTab = switchFLTab;
window.switchFLTab = function(tab) {
    _origSwitchFLTab(tab);
    if (tab === 'divihistory') renderDiviHistory();
};

document.addEventListener('click', function(e) {
    if (e.target.id === 'close-divihistory') {
        const modal = document.getElementById('fortune-lenormand-modal');
        if (modal) hideModal(modal);
    }
});

function renderFavorites() {
    const list = document.getElementById('favorites-list');
    if (!list) return;

    const favoritedMessages = (typeof messages !== 'undefined' ? messages : [])
        .filter(m => m.favorited && m.type !== 'system');

    if (favoritedMessages.length === 0) {
        list.innerHTML = `
            <div class="stats-empty-state">
                <div class="stats-empty-icon"><i class="fas fa-star"></i></div>
                <h3>收藏夹空空如也</h3>
                <p>点击消息旁的 ☆ 星标即可收藏</p>
            </div>`;
        return;
    }

    list.innerHTML = favoritedMessages.map(msg => {
        const isUser = msg.sender === 'user';
        const senderName = isUser
            ? ((typeof settings !== 'undefined' && settings.myName) || '我')
            : ((typeof settings !== 'undefined' && settings.partnerName) || msg.sender || '对方');
        const ts = msg.timestamp ? new Date(msg.timestamp).toLocaleString('zh-CN', {
            month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        }) : '';
        const content = msg.text
            ? msg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
            : (msg.image ? `<img src="${msg.image}" style="max-width:100%;max-height:180px;border-radius:8px;display:block;margin-top:4px;cursor:pointer;" onclick="if(typeof viewImage==='function')viewImage('${msg.image.replace(/'/g,'\\\'')}')" loading="lazy">` : '');
        const avatarEl = isUser
            ? (typeof DOMElements !== 'undefined' ? DOMElements.me.avatar : null)
            : (typeof DOMElements !== 'undefined' ? DOMElements.partner.avatar : null);
        const avatarImg = avatarEl ? avatarEl.querySelector('img') : null;
        const avatarHtml = avatarImg
            ? `<img src="${avatarImg.src}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
            : `<div style="width:28px;height:28px;border-radius:50%;background:rgba(var(--accent-color-rgb),0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-user" style="font-size:11px;color:var(--accent-color);"></i></div>`;
        return `
            <div class="fav-item" style="
                display:flex;flex-direction:column;gap:4px;
                padding:12px 14px;border-radius:12px;
                background:var(--primary-bg);
                border:1px solid var(--border-color);
                margin-bottom:10px;
                position:relative;
            ">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    ${avatarHtml}
                    <span style="font-size:12px;font-weight:600;color:var(--accent-color);">${senderName}</span>
                    <span style="font-size:11px;color:var(--text-secondary);margin-left:auto;padding-right:24px;">${ts}</span>
                </div>
                <div style="font-size:13px;color:var(--text-primary);line-height:1.5;word-break:break-word;">${content}</div>
                <button class="fav-remove-btn" data-id="${msg.id}" style="
                    position:absolute;top:8px;right:10px;
                    background:none;border:none;cursor:pointer;
                    color:var(--text-secondary);font-size:14px;padding:2px 4px;
                    opacity:0.6;
                " title="取消收藏"><i class="fas fa-star" style="color:var(--accent-color);"></i></button>
            </div>`;
    }).join('');

    list.querySelectorAll('.fav-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.id);
            const msg = (typeof messages !== 'undefined' ? messages : []).find(m => m.id === id);
            if (msg) {
                msg.favorited = false;
                if (typeof throttledSaveData === 'function') throttledSaveData();
                if (typeof showNotification === 'function') showNotification('已取消收藏', 'success', 1500);
                renderFavorites();
            }
        });
    });
}
window.renderFavorites = renderFavorites;

window._runMsgSearch = function() {
    const input = document.getElementById('msg-search-input');
    const dateFrom = document.getElementById('msg-search-date-from');
    const dateTo = document.getElementById('msg-search-date-to');
    const resultsEl = document.getElementById('msg-search-results');
    if (!resultsEl) return;

    const q = (input ? input.value.trim() : '').toLowerCase();
    const from = dateFrom && dateFrom.value ? new Date(dateFrom.value) : null;
    const to = dateTo && dateTo.value ? new Date(dateTo.value + 'T23:59:59') : null;

    if (!q && !from && !to) {
        resultsEl.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-secondary);font-size:13px;">输入关键词或选择日期开始搜索</div>';
        return;
    }

    const allMessages = typeof messages !== 'undefined' ? messages : [];
    const results = allMessages.filter(m => {
        if (m.type === 'system') return false;
        const ts = m.timestamp ? new Date(m.timestamp) : null;
        if (from && ts && ts < from) return false;
        if (to && ts && ts > to) return false;
        if (q && m.text && m.text.toLowerCase().includes(q)) return true;
        if (q && !m.text && m.image) return false; 
        return !q; 
    });

    if (results.length === 0) {
        resultsEl.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-secondary);font-size:13px;">未找到 "${q || '相关'}" 的消息</div>`;
        return;
    }

    const myAvatarEl = typeof DOMElements !== 'undefined' ? DOMElements.me.avatar : null;
    const partnerAvatarEl = typeof DOMElements !== 'undefined' ? DOMElements.partner.avatar : null;
    const myImg = myAvatarEl ? myAvatarEl.querySelector('img') : null;
    const partnerImg = partnerAvatarEl ? partnerAvatarEl.querySelector('img') : null;

    function getAvatarHtml(isUser) {
        const img = isUser ? myImg : partnerImg;
        if (img) return `<img src="${img.src}" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;">`;
        return `<div style="width:28px;height:28px;border-radius:50%;background:rgba(var(--accent-color-rgb),0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-user" style="font-size:11px;color:var(--accent-color);"></i></div>`;
    }

    function highlight(text, keyword) {
        if (!keyword) return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const re = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return escaped.replace(re, '<mark style="background:rgba(var(--accent-color-rgb),0.25);color:var(--accent-color);border-radius:2px;padding:0 1px;">$1</mark>');
    }

    resultsEl.innerHTML = results.slice(0, 100).map(msg => {
        const isUser = msg.sender === 'user';
        const senderName = isUser
            ? ((typeof settings !== 'undefined' && settings.myName) || '我')
            : ((typeof settings !== 'undefined' && settings.partnerName) || msg.sender || '对方');
        const ts = msg.timestamp ? new Date(msg.timestamp).toLocaleString('zh-CN', {
            month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
        }) : '';
        const content = msg.text
            ? highlight(msg.text, q)
            : (msg.image ? `<img src="${msg.image}" style="max-height:60px;border-radius:6px;display:block;margin-top:4px;" loading="lazy">` : '');
        return `<div style="display:flex;gap:10px;align-items:flex-start;padding:11px 12px;border-radius:12px;background:var(--primary-bg);border:1px solid var(--border-color);margin-bottom:8px;cursor:pointer;"
            onclick="if(typeof showNotification==='function')showNotification('已定位消息', 'info', 1500); if(typeof scrollToQuotedMessage==='function'){var el=document.createElement('div');el.dataset.replyId='${msg.id}';scrollToQuotedMessage(el);}">
            ${getAvatarHtml(isUser)}
            <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
                    <span style="font-size:12px;font-weight:600;color:var(--accent-color);">${senderName}</span>
                    <span style="font-size:11px;color:var(--text-secondary);">${ts}</span>
                </div>
                <div style="font-size:13px;color:var(--text-primary);line-height:1.5;word-break:break-word;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">${content}</div>
            </div>
        </div>`;
    }).join('') + (results.length > 100 ? `<div style="text-align:center;padding:10px;font-size:12px;color:var(--text-secondary);">仅显示前100条，共找到 ${results.length} 条</div>` : '');
};

let wheelOptions = ["是", "否", "再想一想", "听你的"];
let wheelResultText = "";

function initDecisionModule() {
    const entryBtn = document.getElementById('decision-function'); 
    if(entryBtn) {
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);
        newBtn.addEventListener('click', () => {
            hideModal(document.getElementById('advanced-modal'));
            showModal(document.getElementById('decision-menu-modal'));
        });
    }

    const openCoinBtn = document.getElementById('open-coin-toss');
    const openWheelBtn = document.getElementById('open-wheel');
    const closeMenuBtn = document.getElementById('close-decision-menu');
    const closeWheelBtn = document.getElementById('close-wheel');
    const addOptionBtn = document.getElementById('add-wheel-option');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const sendResultBtn = document.getElementById('send-wheel-result');

    if (openCoinBtn && !openCoinBtn.dataset.initialized) {
        openCoinBtn.addEventListener('click', () => {
            hideModal(document.getElementById('decision-menu-modal'));
            handleCoinToss();
        });
        openCoinBtn.dataset.initialized = 'true';
    }

    if (openWheelBtn && !openWheelBtn.dataset.initialized) {
        openWheelBtn.addEventListener('click', () => {
            hideModal(document.getElementById('decision-menu-modal'));
            initPicker();
            showModal(document.getElementById('wheel-modal'));
        });
        openWheelBtn.dataset.initialized = 'true';
    }
    
    if (closeMenuBtn && !closeMenuBtn.dataset.initialized) {
        closeMenuBtn.addEventListener('click', () => hideModal(document.getElementById('decision-menu-modal')));
        closeMenuBtn.dataset.initialized = 'true';
    }

    if (closeWheelBtn && !closeWheelBtn.dataset.initialized) {
        closeWheelBtn.addEventListener('click', () => hideModal(document.getElementById('wheel-modal')));
        closeWheelBtn.dataset.initialized = 'true';
    }

    if (addOptionBtn && !addOptionBtn.dataset.initialized) {
        addOptionBtn.addEventListener('click', () => {
            wheelOptions.push(`选项 ${wheelOptions.length + 1}`);
            renderPickerOptions();
            renderPickerCards();
        });
        addOptionBtn.dataset.initialized = 'true';
    }

    if (spinBtn && !spinBtn.dataset.initialized) {
        spinBtn.addEventListener('click', doPick);
        spinBtn.dataset.initialized = 'true';
    }
    
    if (sendResultBtn && !sendResultBtn.dataset.initialized) {
        sendResultBtn.addEventListener('click', () => {
            if(wheelResultText) {
                sendMessage(`✨ 随机抽签结果：${wheelResultText}`, 'normal');
                hideModal(document.getElementById('wheel-modal'));
                wheelResultText = "";
                sendResultBtn.style.display = 'none';
                const resultEl = document.getElementById('wheel-result');
                if (resultEl) { resultEl.textContent = ""; resultEl.classList.remove('show'); }
                spinBtn.disabled = false;
            }
        });
        sendResultBtn.dataset.initialized = 'true';
    }
}

function initPicker() {
    renderPickerOptions();
    renderPickerCards();
    const result = document.getElementById('wheel-result');
    const sendBtn = document.getElementById('send-wheel-result');
    const spinBtn = document.getElementById('spin-wheel-btn');
    if (result) { result.textContent = ""; result.classList.remove('show'); }
    if (sendBtn) sendBtn.style.display = 'none';
    if (spinBtn) spinBtn.disabled = false;
    wheelResultText = "";
}

function renderPickerOptions() {
    const list = document.getElementById('wheel-options-list');
    if (!list) return;
    list.innerHTML = '';
    const colors = ['#FFD93D','#FF6B6B','#6BCB77','#4D96FF','#E0C3FC','#FF9A8B','#A8D8EA','#C44569'];
    wheelOptions.forEach((opt, index) => {
        const item = document.createElement('div');
        item.className = 'picker-option-item';
        item.innerHTML = `
            <div class="picker-option-color-dot" style="background:${colors[index % colors.length]}"></div>
            <input type="text" class="picker-option-input" value="${opt}" placeholder="输入选项...">
            <span class="picker-option-remove"><i class="fas fa-times"></i></span>
        `;
        item.querySelector('input').addEventListener('input', (e) => {
            wheelOptions[index] = e.target.value;
            renderPickerCards();
        });
        item.querySelector('.picker-option-remove').addEventListener('click', () => {
            if(wheelOptions.length <= 2) {
                showNotification('至少保留两个选项', 'warning');
                return;
            }
            wheelOptions.splice(index, 1);
            renderPickerOptions();
            renderPickerCards();
        });
        list.appendChild(item);
    });
}

function renderPickerCards(selectedIndex = -1) {
    const row = document.getElementById('picker-cards-row');
    if (!row) return;
    const colors = ['#FFD93D','#FF6B6B','#6BCB77','#4D96FF','#E0C3FC','#FF9A8B','#A8D8EA','#C44569'];
    row.innerHTML = '';
    wheelOptions.forEach((opt, i) => {
        const card = document.createElement('div');
        card.className = 'picker-card';
        if (selectedIndex >= 0) {
            if (i === selectedIndex) card.classList.add('selected');
            else card.classList.add('unselected');
        }
        if (selectedIndex >= 0 && i === selectedIndex) {
            card.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i+2) % colors.length]})`;
        } else {
            card.style.borderTop = `3px solid ${colors[i % colors.length]}`;
        }
        card.style.animationDelay = (i * 0.06) + 's';
        const label = opt || `选项${i+1}`;
        card.textContent = label.length > 6 ? label.slice(0,5) + '…' : label;
        row.appendChild(card);
    });
}

function doPick() {
    if (wheelOptions.length < 2) {
        showNotification("请至少添加两个选项", "warning");
        return;
    }
    const spinBtn = document.getElementById('spin-wheel-btn');
    const resultDisplay = document.getElementById('wheel-result');
    const sendBtn = document.getElementById('send-wheel-result');
    
    spinBtn.disabled = true;
    sendBtn.style.display = 'none';
    resultDisplay.classList.remove('show');
    resultDisplay.textContent = "";

    let flashCount = 0;
    const totalFlashes = 16 + Math.floor(Math.random() * 8);
    const finalIndex = Math.floor(Math.random() * wheelOptions.length);
    
    function flash() {
        const row = document.getElementById('picker-cards-row');
        if (!row) return;
        const cards = row.querySelectorAll('.picker-card');
        cards.forEach(c => c.style.transform = '');
        
        let showIdx;
        if (flashCount < totalFlashes - 3) {
            showIdx = Math.floor(Math.random() * wheelOptions.length);
        } else {
            showIdx = finalIndex;
        }
        
        cards.forEach((c, i) => {
            if (i === showIdx) {
                c.style.transform = 'translateY(-4px) scale(1.06)';
                c.style.background = `linear-gradient(135deg, var(--accent-color), rgba(var(--accent-color-rgb),0.7))`;
                c.style.borderColor = 'transparent';
                c.style.color = '#fff';
            } else {
                c.style.transform = '';
                c.style.background = '';
                c.style.borderColor = '';
                c.style.color = '';
            }
        });
        
        flashCount++;
        const delay = flashCount < 8 ? 80 : flashCount < 14 ? 130 : 250;
        if (flashCount < totalFlashes) {
            setTimeout(flash, delay);
        } else {
            setTimeout(() => {
                renderPickerCards(finalIndex);
                wheelResultText = wheelOptions[finalIndex];
                resultDisplay.innerHTML = `<i class="fas fa-star" style="font-size:14px; margin-right:6px;"></i>${wheelResultText}`;
                resultDisplay.classList.add('show');
                spinBtn.disabled = false;
                sendBtn.style.display = 'inline-block';
                playSound('favorite');
            }, 300);
        }
    }
    
    flash();
}

function handleCoinToss() {
    const overlay = DOMElements.coinTossOverlay;
    if (!overlay) return;
    overlay.classList.remove('finished');
    overlay.classList.add('visible');
    const resultText = DOMElements.coinResultText;
    if (resultText) resultText.textContent = '';
    const sendBtn = DOMElements.sendCoinResult;
    if (sendBtn) sendBtn.style.display = 'none';
    const retryBtn = document.getElementById('retry-coin-toss');
    if (retryBtn) retryBtn.style.display = 'none';
    if (DOMElements.animatedCoin) DOMElements.animatedCoin.style.transform = '';
    startCoinFlipAnimation();
}
window.handleCoinToss = handleCoinToss;

function startCoinFlipAnimation() {
    const coin = DOMElements.animatedCoin;
    const resultText = DOMElements.coinResultText;
    const overlay = DOMElements.coinTossOverlay;
    if (!coin || !overlay) return;

    overlay.classList.remove('finished');
    if (resultText) resultText.textContent = '';
    const sendBtn = DOMElements.sendCoinResult;
    if (sendBtn) sendBtn.style.display = 'none';
    const retryBtn = document.getElementById('retry-coin-toss');
    if (retryBtn) retryBtn.style.display = 'none';

    const isHeads = Math.random() < 0.5;
    const result = isHeads ? '正面 ☀️' : '反面 🌙';
    lastCoinResult = result;

    coin.classList.remove('flipping-heads', 'flipping-tails', 'coin-show-front', 'coin-show-back');
    void coin.offsetWidth;
    coin.classList.add(isHeads ? 'flipping-heads' : 'flipping-tails');
    setTimeout(() => {
        coin.classList.remove('flipping-heads', 'flipping-tails');
        coin.style.transform = isHeads ? 'rotateY(0deg)' : 'rotateY(180deg)';
        if (resultText) resultText.textContent = result;
        overlay.classList.add('finished');
        if (sendBtn) sendBtn.style.display = '';
        if (retryBtn) retryBtn.style.display = '';
        if (typeof playSound === 'function') playSound('favorite');
    }, 3050);
}
window.startCoinFlipAnimation = startCoinFlipAnimation;

function initComboMenu() {
    const comboBtn = document.getElementById('combo-btn');
    const picker = document.getElementById('user-sticker-picker');
    const contentArea = document.getElementById('combo-content-area');
    
    if (!comboBtn || !picker) return;
    
    if (comboBtn.dataset.initialized) return;
    
    comboBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = picker.classList.contains('active');
        
        if (isActive) {
            picker.classList.remove('active');
        } else {
            switchTab('my-sticker');
            picker.classList.add('active');
        }
    });
    
    comboBtn.dataset.initialized = 'true';

    document.addEventListener('click', (e) => {
        if (!picker.contains(e.target) && !comboBtn.contains(e.target)) {
            picker.classList.remove('active');
        }
    });

    const tabs = picker.querySelectorAll('.combo-tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });

    function updateAddBtnVisibility(tabId) {
        const addBtn = document.getElementById('sticker-add-btn');
        if (addBtn) addBtn.style.display = (tabId === 'my-sticker') ? 'flex' : 'none';
    }

    function switchTab(tabId) {
        tabs.forEach(b => b.classList.remove('active'));
        const activeBtn = Array.from(tabs).find(b => b.dataset.tab === tabId);
        if (activeBtn) activeBtn.classList.add('active');
        updateAddBtnVisibility(tabId);

        if (tabId === 'my-sticker') {
            renderMyStickerLibrary();
        } else if (tabId === 'partner-sticker') {
            renderPartnerStickerLibrary();
        } else {
            renderUserPokeMenu();
        }
    }

    function makeStickerItem(src, onClick) {
        const item = document.createElement('div');
        item.className = 'sticker-grid-item';
        item.innerHTML = `<img src="${src}" loading="lazy">`;
        item.onclick = (e) => { e.stopPropagation(); onClick(); };
        return item;
    }

    function makeDeletableStickerItem(src, onClick, onDelete) {
        const item = document.createElement('div');
        item.className = 'sticker-grid-item';
        item.style.position = 'relative';
        item.innerHTML = `<img src="${src}" loading="lazy"><div class="sticker-delete-btn" title="删除"><i class="fas fa-times"></i></div>`;
        item.querySelector('img').onclick = (e) => { e.stopPropagation(); onClick(); };
        item.querySelector('.sticker-delete-btn').onclick = (e) => { e.stopPropagation(); onDelete(); };
        return item;
    }

    function renderMyStickerLibrary() {
        contentArea.innerHTML = '';
        if (!myStickerLibrary || myStickerLibrary.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-sticker-tip">
                    <i class="fas fa-user-circle"></i>
                    还没有我的专属表情哦<br>
                    点击右上角"添加"按钮上传图片~
                </div>
            `;
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'sticker-grid-view';
        myStickerLibrary.forEach((src, idx) => {
            const item = makeDeletableStickerItem(src, () => {
                addMessage({ id: Date.now(), sender: 'user', text: '', timestamp: new Date(), image: src, status: 'sent', type: 'normal' });
                playSound('send');
                picker.classList.remove('active');
                const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                setTimeout(simulateReply, settings.replyDelayMin + Math.random() * delayRange);
            }, () => {
                myStickerLibrary.splice(idx, 1);
                localforage.setItem(getStorageKey('myStickerLibrary'), myStickerLibrary);
                showNotification('✓ 已删除', 'success');
                renderMyStickerLibrary();
            });
            grid.appendChild(item);
        });
        contentArea.appendChild(grid);
    }

    function renderPartnerStickerLibrary() {
        contentArea.innerHTML = '';
        if (!stickerLibrary || stickerLibrary.length === 0) {
            contentArea.innerHTML = `
                <div class="empty-sticker-tip">
                    <i class="far fa-images"></i>
                    对方表情库还是空的哦<br>
                    请去"高级功能"->"自定义回复"->"表情库"中添加图片~
                </div>
            `;
            return;
        }
        const grid = document.createElement('div');
        grid.className = 'sticker-grid-view';
        stickerLibrary.forEach(src => {
            const item = makeStickerItem(src, () => {
                addMessage({ id: Date.now(), sender: 'user', text: '', timestamp: new Date(), image: src, status: 'sent', type: 'normal' });
                playSound('send');
                picker.classList.remove('active');
                const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                setTimeout(simulateReply, settings.replyDelayMin + Math.random() * delayRange);
            });
            grid.appendChild(item);
        });
        contentArea.appendChild(grid);
    }

    function renderStickerLibrary() { renderMyStickerLibrary(); }
    function renderUserPokeMenu() {
        contentArea.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'poke-list-view';

        const customBtn = document.createElement('button');
        customBtn.className = 'custom-poke-btn';
        customBtn.innerHTML = '<i class="fas fa-pen"></i> 自定义动作';
        customBtn.onclick = (e) => {
            e.stopPropagation();
            picker.classList.remove('active');
            showModal(DOMElements.pokeModal.modal, DOMElements.pokeModal.input);
        };
        wrapper.appendChild(customBtn);

        const userPresets = [
            "拍了拍对方的头",
            "戳了戳对方的脸颊",
            "抱住了对方",
            "给对方比了个心",
            "牵起了对方的手",
            "看着对方发呆"
        ];

        const title = document.createElement('div');
        title.style.fontSize = '12px';
        title.style.color = 'var(--text-secondary)';
        title.style.marginBottom = '5px';
        title.innerText = '快捷动作';
        wrapper.appendChild(title);

        const quickPokes = window.PokeLibraryFeature
            ? window.PokeLibraryFeature.getQuick(customPokes.length ? customPokes : userPresets)
            : userPresets;

        quickPokes.forEach(text => {
            const item = document.createElement('div');
            item.className = 'poke-quick-item';
            item.innerText = text;
            item.onclick = (e) => {
                e.stopPropagation();
                addMessage({
                    id: Date.now(),
                    text: _formatPokeText(`${settings.myName} ${text}`), 
                    timestamp: new Date(),
                    type: 'system' 
                });
                picker.classList.remove('active');
                
                setTimeout(simulateReply, 1500);
            };
            wrapper.appendChild(item);
        });

        const libraryBtn = document.createElement('button');
        libraryBtn.className = 'poke-library-entry';
        libraryBtn.innerHTML = '<i class="fas fa-box-archive"></i><span>我的拍一拍库</span><i class="fas fa-chevron-right"></i>';
        libraryBtn.onclick = (e) => {
            e.stopPropagation();
            picker.classList.remove('active');
            if (window.PokeLibraryFeature) window.PokeLibraryFeature.open();
        };
        wrapper.appendChild(libraryBtn);

        contentArea.appendChild(wrapper);
    }
}

(function() {
    var STOP_WORDS = new Set([
        '的','了','是','我','你','他','她','它','们','这','那','有','在','就','也','都',
        '和','与','或','但','不','没','很','太','更','最','已','被','让','把','对','从',
        '到','于','以','为','之','其','而','则','所','等','啊','哦','嗯','哈','呢','吧',
        '吗','嘛','呀','哇','哎','唉','嗯嗯','哈哈','嘻嘻','呵呵','哦哦','啊啊','哈哈哈',
        '一','二','三','四','五','六','七','八','九','十','个','次','条','件','种',
        '好','行','可以','可','又','再','还','来','去','说','想','知道','觉得','感觉',
        '什么','怎么','为什么','哪','谁','哪里','怎样','如何','这么','那么',
        '然后','因为','所以','如果','虽然','但是','而且','不过','只是','只有',
        '没有','不是','还是','就是','真的','对啊','好的','好吧','那个','这个',
        '今天','昨天','明天','现在','以前','以后','时候','时间','一下','一直','一个',
        'ok','OK','Ok','yes','no','hh','hhhh','hhh','嗯','额',
        '图片','表情','语音','【图片】','【表情】','【语音】','撤回了一条消息','已撤回'
    ]);

    function tokenize(text) {
        text = text
            .replace(/https?:\/\/\S+/g, '')
            .replace(/\[.*?\]/g, '')
            .replace(/<[^>]+>/g, '')
            .replace(/[^\u4e00-\u9fa5a-zA-Z]/g, ' ')
            .toLowerCase();
        var words = {};
        var cn = text.replace(/[a-z ]/g, '');
        // 使用非重叠分词：优先提取长词，避免"我想你"同时产生"我想"和"想你"
        // 策略：对每个起点只取一次最长匹配（4>3>2），跳过已覆盖字符
        var covered = new Array(cn.length).fill(false);
        // 先扫一遍提取4字词
        for (var i = 0; i + 4 <= cn.length; i++) {
            var w4 = cn.slice(i, i + 4);
            if (!STOP_WORDS.has(w4)) {
                words[w4] = (words[w4] || 0) + 2.4;
                covered[i] = covered[i+1] = covered[i+2] = covered[i+3] = true;
                i += 3; // 跳过已覆盖字符
            }
        }
        // 再扫3字词（跳过已覆盖位置）
        covered = new Array(cn.length).fill(false); // 重置，用于3字
        for (var j = 0; j + 3 <= cn.length; j++) {
            var w3 = cn.slice(j, j + 3);
            if (!STOP_WORDS.has(w3)) {
                words[w3] = (words[w3] || 0) + 1.8;
                j += 2;
            }
        }
        // 2字词：步长2，非重叠，不与已有词重复计数
        for (var k = 0; k + 2 <= cn.length; k += 2) {
            var w2 = cn.slice(k, k + 2);
            if (!STOP_WORDS.has(w2)) {
                words[w2] = (words[w2] || 0) + 1;
            }
        }
        // 英文单词（长度≥3）
        (text.match(/[a-z]{3,}/g) || []).forEach(function(w) {
            if (!STOP_WORDS.has(w)) words[w] = (words[w] || 0) + 1;
        });
        return words;
    }

    function mergeFreq(a, b) {
        var o = Object.assign({}, a);
        Object.keys(b).forEach(function(k) { o[k] = (o[k] || 0) + b[k]; });
        return o;
    }

    function topWords(freq, n) {
        var min = Object.keys(freq).length > 60 ? 2 : 1;
        return Object.entries(freq)
            .filter(function(e) { return e[1] >= min && e[0].length >= 2; })
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, n)
            .map(function(e) { return { word: e[0], count: e[1] }; });
    }

    function resolveFont() {
        var el = document.createElement('span');
        el.style.cssText = 'position:absolute;visibility:hidden;font-family:var(--font-family)';
        document.body.appendChild(el);
        var f = getComputedStyle(el).fontFamily || '"PingFang SC","Microsoft YaHei",sans-serif';
        document.body.removeChild(el);
        return f;
    }

    function hex3(hex) {
        hex = hex.replace('#','');
        if (hex.length === 3) hex = hex.split('').map(function(c){return c+c;}).join('');
        var n = parseInt(hex, 16);
        return [(n>>16)&255, (n>>8)&255, n&255];
    }
    function drawWordCloud(canvas, words) {
        var ctx   = canvas.getContext('2d');
        var dpr   = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var W = canvas.width / dpr;
        var H = canvas.height / dpr;

        var cs     = getComputedStyle(document.documentElement);
        var accent = cs.getPropertyValue('--accent-color').trim() || '#c5a47e';
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        var rgb    = hex3(accent);
        var font   = resolveFont();

        ctx.fillStyle = isDark ? '#141414' : '#ffffff';
        ctx.fillRect(0, 0, W, H);

        if (!words.length) return;

        var maxC = words[0].count;
        var minC = words[words.length - 1].count;
        var placed = [];

        var MIN_F = 11, MAX_F = 54;

        function fontSize(c) {
            if (maxC === minC) return 24;
            var t = Math.log(1 + c - minC) / Math.log(1 + maxC - minC);
            return Math.round(MIN_F + t * (MAX_F - MIN_F));
        }

        function wordAlpha(idx, total) {
            if (idx === 0) return 1.0;
            if (idx < 3)   return 0.82;
            if (idx < 8)   return 0.64;
            if (idx < 20)  return 0.46;
            return Math.max(0.20, 0.46 - (idx - 20) / total * 0.25);
        }

        function tilt(word, idx) {
            if (idx < 5) return 0;
            var h = 0;
            for (var i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) | 0;
            return (Math.abs(h) % 6 === 0) ? (Math.PI / 2) : 0;
        }

        function overlaps(x, y, w, h, pad) {
            for (var i = 0; i < placed.length; i++) {
                var p = placed[i];
                if (x - pad < p.x + p.w && x + w + pad > p.x &&
                    y - pad < p.y + p.h && y + h + pad > p.y) return true;
            }
            return false;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;

        words.forEach(function(item, idx) {
            var fs  = fontSize(item.count);
            var fw  = idx < 2 ? '800' : idx < 8 ? '600' : '400';
            var rot = tilt(item.word, idx);
            var a   = wordAlpha(idx, words.length);

            ctx.font = fw + ' ' + fs + 'px ' + font;
            var tw = ctx.measureText(item.word).width;
            var th = fs * 1.25;

            var bw = rot !== 0 ? th + 2 : tw;
            var bh = rot !== 0 ? tw + 2 : th;
            var pad = idx < 3 ? 9 : idx < 12 ? 4 : 2;

            var placed_ = false;
            var cx = W / 2, cy = H / 2;

            for (var t = 0; t < 320; t += 0.09) {
                var ang = t * 2.2;
                var r   = 1.8 * ang;
                var bx  = cx + r * Math.cos(ang) * 1.2 - bw / 2;
                var by  = cy + r * Math.sin(ang) * 0.88 - bh / 2;

                if (bx >= pad && by >= pad && bx + bw <= W - pad && by + bh <= H - pad) {
                    if (!overlaps(bx, by, bw, bh, pad)) {
                        ctx.save();
                        ctx.globalAlpha = a;
                        ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                        ctx.translate(bx + bw/2, by + bh/2);
                        ctx.rotate(rot);
                        ctx.fillText(item.word, 0, 0);
                        ctx.restore();
                        placed.push({ x: bx, y: by, w: bw, h: bh });
                        placed_ = true;
                        break;
                    }
                }
            }

            if (!placed_) {
                var fsS = Math.max(10, fs * 0.58);
                ctx.font = '400 ' + fsS + 'px ' + font;
                var tw2 = ctx.measureText(item.word).width + 2;
                var th2 = fsS * 1.25;
                for (var fb = 0; fb < 60; fb++) {
                    var fx = 6 + Math.random() * (W - tw2 - 12);
                    var fy = 6 + Math.random() * (H - th2 - 12);
                    if (!overlaps(fx, fy, tw2, th2, 2)) {
                        ctx.save();
                        ctx.globalAlpha = Math.min(a, 0.32);
                        ctx.fillStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
                        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                        ctx.fillText(item.word, fx, fy);
                        ctx.restore();
                        placed.push({ x: fx, y: fy, w: tw2, h: th2 });
                        break;
                    }
                }
            }
        });
    }

    window.renderWordCloud = function() {
        var container = document.getElementById('wordcloud-container');
        if (!container) return;

        if (typeof messages === 'undefined' || !messages || !messages.length) {
            container.innerHTML = '<div class="wc-empty"><i class="fas fa-ghost"></i><p>还没有聊天记录</p><span>多聊几句，词云就会出现～</span></div>';
            return;
        }

        var pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '对方';
        var mName = (typeof settings !== 'undefined' && settings.myName)      ? settings.myName      : '我';

        var partnerMsgs = messages.filter(function(m) { return m.sender !== 'user' && m.text && m.type !== 'system' && m.type !== 'call-event'; });
        var myMsgs      = messages.filter(function(m) { return m.sender === 'user' && m.text && m.type !== 'system' && m.type !== 'call-event'; });

        var pFreq = {}, mFreq = {};
        partnerMsgs.forEach(function(m) { pFreq = mergeFreq(pFreq, tokenize(m.text)); });
        myMsgs.forEach(function(m)      { mFreq = mergeFreq(mFreq, tokenize(m.text)); });
        var aFreq = mergeFreq(pFreq, mFreq);

        var pTop = topWords(pFreq, 60);
        var mTop = topWords(mFreq, 60);
        var aTop = topWords(aFreq, 60);

        var cur = container._currentView || 'all';

        function data(v) {
            if (v === 'partner') return { words: pTop, total: partnerMsgs.length };
            if (v === 'me')      return { words: mTop, total: myMsgs.length };
            return { words: aTop, total: partnerMsgs.length + myMsgs.length };
        }

        function renderRank(words) {
            var el = container.querySelector('.wc-rank-list');
            if (!el) return;
            if (!words.length) { el.innerHTML = '<div class="wc-rank-empty">暂无数据</div>'; return; }
            var cs     = getComputedStyle(document.documentElement);
            var accent = cs.getPropertyValue('--accent-color').trim() || '#c5a47e';
            var rgb    = hex3(accent);
            var max    = words[0].count;
            el.innerHTML = words.slice(0, 10).map(function(item, i) {
                var pct = Math.round(item.count / max * 100);
                var numStyle = i < 3
                    ? 'color:rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+');font-weight:700;'
                    : 'color:var(--text-secondary);font-weight:500;';
                return '<div class="wc-rank-item">'
                    + '<span class="wc-rank-num" style="'+numStyle+'">' + (i < 9 ? '0'+(i+1) : i+1) + '</span>'
                    + '<span class="wc-rank-word">' + item.word + '</span>'
                    + '<div class="wc-rank-bar-wrap">'
                    +   '<div class="wc-rank-bar" style="width:'+pct+'%;background:rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+(0.2+pct/100*0.6)+');"></div>'
                    + '</div>'
                    + '<span class="wc-rank-count">' + Math.round(item.count) + '</span>'
                    + '</div>';
            }).join('');
        }

        function renderSummary(d) {
            var el = container.querySelector('.wc-summary');
            if (!el) return;
            el.innerHTML =
                '<span class="wc-summary-pill"><i class="fas fa-comment-dots"></i> ' + d.total + ' 条</span>'
                + '<span class="wc-summary-pill"><i class="fas fa-font"></i> ' + d.words.length + ' 词</span>';
        }

        function renderView(v) {
            container._currentView = v;
            container.querySelectorAll('.wc-view-btn').forEach(function(b) {
                b.classList.toggle('active', b.dataset.view === v);
            });
            var canvas = container.querySelector('#wc-canvas');
            if (!canvas) return;
            var d = data(v);
            drawWordCloud(canvas, d.words);
            renderRank(d.words);
            renderSummary(d);
        }

        if (!container.querySelector('#wc-canvas')) {
            var dpr = window.devicePixelRatio || 1;
            var cw  = Math.min(container.offsetWidth || (container.parentElement && container.parentElement.offsetWidth) || 340, 500);
            var ch  = Math.round(cw * 0.72);

            container.innerHTML =
                '<div class="wc-header">'
                +   '<div class="wc-tabs"><div class="wc-tabs-track">'
                +     '<button class="wc-view-btn'+(cur==='all'?' active':'')+'" data-view="all">全部</button>'
                +     '<button class="wc-view-btn'+(cur==='partner'?' active':'')+'" data-view="partner">'+pName+'</button>'
                +     '<button class="wc-view-btn'+(cur==='me'?' active':'')+'" data-view="me">'+mName+'</button>'
                +   '</div></div>'
                +   '<button class="wc-regen-btn" title="换一种布局"><i class="fas fa-redo"></i></button>'
                + '</div>'
                + '<div class="wc-summary"></div>'
                + '<div class="wc-canvas-wrap">'
                +   '<canvas id="wc-canvas" width="'+(cw*dpr)+'" height="'+(ch*dpr)+'" style="width:'+cw+'px;height:'+ch+'px;display:block;"></canvas>'
                + '</div>'
                + '<div class="wc-rank-section">'
                +   '<div class="wc-rank-title"><i class="fas fa-bars"></i> 高频词 Top 10</div>'
                +   '<div class="wc-rank-list"></div>'
                + '</div>';

            container.querySelector('.wc-tabs-track').addEventListener('click', function(e) {
                var b = e.target.closest('.wc-view-btn');
                if (b) renderView(b.dataset.view);
            });
            container.querySelector('.wc-regen-btn').addEventListener('click', function() {
                var canvas = container.querySelector('#wc-canvas');
                var d = data(container._currentView);
                var shuffled = d.words.slice().sort(function(a, b) {
                    return a.count !== b.count ? b.count - a.count : Math.random() - 0.5;
                });
                drawWordCloud(canvas, shuffled);
            });
        }

        renderView(cur);
    };

})();

(function() {
    var MY_SYM_KEY   = 'pokeSym_my';
    var PTR_SYM_KEY  = 'pokeSym_partner';
    var MY_CUST_KEY  = 'pokeSym_my_custom';
    var PTR_CUST_KEY = 'pokeSym_partner_custom';

    var PRESETS = [
        { value: 'none',    label: '无装饰',   sym: '' },
        { value: 'star4',   label: '✦ 四角星', sym: '✦' },
        { value: 'star5',   label: '✧ 镂空星', sym: '✧' },
        { value: 'dot',     label: '· 圆点',   sym: '·' },
        { value: 'wave',    label: '～ 波浪',  sym: '～' },
        { value: 'heart',   label: '♡ 爱心',   sym: '♡' },
        { value: 'flower',  label: '✿ 花朵',   sym: '✿' },
        { value: 'sparkle', label: '✨ 闪光',  sym: '✨' },
        { value: 'custom',  label: '自定义…',  sym: null }
    ];

    function _getSym(key, customKey) {
        var v = localStorage.getItem(key) || 'star4';
        if (v === 'custom') return localStorage.getItem(customKey) || '✦';
        var p = PRESETS.find(function(x){ return x.value === v; });
        return p ? p.sym : '✦';
    }

    window._formatPokeText = function(text) {
        var sym = _getSym(MY_SYM_KEY, MY_CUST_KEY);
        return sym ? (sym + ' ' + text + ' ' + sym) : text;
    };
    window._formatPartnerPokeText = function(text) {
        var sym = _getSym(PTR_SYM_KEY, PTR_CUST_KEY);
        return sym ? (sym + ' ' + text + ' ' + sym) : text;
    };

    function _esc(s) {
        return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    window._openPokeSymSettings = function() {
        var old = document.getElementById('poke-sym-modal');
        if (old) old.remove();

        var mySel    = localStorage.getItem(MY_SYM_KEY) || 'star4';
        var ptrSel   = localStorage.getItem(PTR_SYM_KEY) || 'star4';
        var myCustom = localStorage.getItem(MY_CUST_KEY) || '';
        var ptrCustom= localStorage.getItem(PTR_CUST_KEY) || '';

        function opts(sel) {
            return PRESETS.map(function(p){
                return '<option value="'+p.value+'"'+(sel===p.value?' selected':'')+'>'+p.label+'</option>';
            }).join('');
        }

        var wrap = document.createElement('div');
        wrap.id = 'poke-sym-modal';
        wrap.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
        wrap.innerHTML = [
            '<div style="background:var(--primary-bg);border-radius:20px;padding:22px 20px;width:min(340px,92vw);box-shadow:0 20px 60px rgba(0,0,0,0.28);border:1px solid var(--border-color);">',
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">',
                '<span style="font-size:15px;font-weight:700;color:var(--text-primary);font-family:var(--font-family);">戳一戳装饰符号</span>',
                '<button id="psm-close" style="background:none;border:none;font-size:18px;color:var(--text-secondary);cursor:pointer;padding:2px 6px;border-radius:6px;">✕</button>',
              '</div>',
              '<div style="font-size:11px;color:var(--text-secondary);font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:5px;">我发出的</div>',
              '<select id="psm-my" style="width:100%;padding:9px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;font-family:var(--font-family);margin-bottom:8px;">'+opts(mySel)+'</select>',
              '<div id="psm-my-cw" style="margin-bottom:12px;display:'+(mySel==='custom'?'block':'none')+';">',
                '<input id="psm-my-ci" type="text" maxlength="4" placeholder="输入 1-2 个字符" value="'+_esc(myCustom)+'" style="width:100%;padding:8px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box;font-family:var(--font-family);">',
              '</div>',
              '<div style="font-size:11px;color:var(--text-secondary);font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:5px;">对方发出的</div>',
              '<select id="psm-ptr" style="width:100%;padding:9px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;font-family:var(--font-family);margin-bottom:8px;">'+opts(ptrSel)+'</select>',
              '<div id="psm-ptr-cw" style="margin-bottom:14px;display:'+(ptrSel==='custom'?'block':'none')+';">',
                '<input id="psm-ptr-ci" type="text" maxlength="4" placeholder="输入 1-2 个字符" value="'+_esc(ptrCustom)+'" style="width:100%;padding:8px 10px;border:1.5px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-primary);font-size:13px;outline:none;box-sizing:border-box;font-family:var(--font-family);">',
              '</div>',
              '<div id="psm-preview" style="background:var(--secondary-bg);border-radius:10px;padding:10px 14px;font-size:12.5px;color:var(--text-secondary);margin-bottom:16px;border:1px dashed var(--border-color);line-height:1.7;"></div>',
              '<div style="display:flex;gap:8px;">',
                '<button id="psm-cancel" style="flex:1;padding:9px;border:1px solid var(--border-color);border-radius:10px;background:var(--secondary-bg);color:var(--text-secondary);font-size:13px;cursor:pointer;font-family:var(--font-family);">取消</button>',
                '<button id="psm-save" style="flex:2;padding:9px;border:none;border-radius:10px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--font-family);">保存</button>',
              '</div>',
            '</div>'
        ].join('');
        document.body.appendChild(wrap);

        function preview() {
            var mv = document.getElementById('psm-my').value;
            var pv = document.getElementById('psm-ptr').value;
            var ms = mv==='custom'?(document.getElementById('psm-my-ci').value||'✦'):((PRESETS.find(function(x){return x.value===mv;})||{}).sym||'');
            var ps = pv==='custom'?(document.getElementById('psm-ptr-ci').value||'✦'):((PRESETS.find(function(x){return x.value===pv;})||{}).sym||'');
            var myN  = (typeof settings!=='undefined'&&settings.myName)||'我';
            var pN   = (typeof settings!=='undefined'&&settings.partnerName)||'对方';
            var mt   = ms?(ms+' '+myN+' 拍了拍你 '+ms):(myN+' 拍了拍你');
            var pt   = ps?(ps+' '+pN+' 拍了拍你 '+ps):(pN+' 拍了拍你');
            document.getElementById('psm-preview').innerHTML =
                '<div style="color:var(--text-primary);">我：'+_esc(mt)+'</div>'+
                '<div style="color:var(--text-primary);margin-top:3px;">对方：'+_esc(pt)+'</div>';
        }

        document.getElementById('psm-my').addEventListener('change', function(){
            document.getElementById('psm-my-cw').style.display = this.value==='custom'?'block':'none'; preview();
        });
        document.getElementById('psm-ptr').addEventListener('change', function(){
            document.getElementById('psm-ptr-cw').style.display = this.value==='custom'?'block':'none'; preview();
        });
        document.getElementById('psm-my-ci').addEventListener('input', preview);
        document.getElementById('psm-ptr-ci').addEventListener('input', preview);
        preview();

        function close(){ wrap.remove(); }
        document.getElementById('psm-close').addEventListener('click', close);
        document.getElementById('psm-cancel').addEventListener('click', close);
        wrap.addEventListener('click', function(e){ if(e.target===wrap) close(); });
        document.getElementById('psm-save').addEventListener('click', function(){
            var mv = document.getElementById('psm-my').value;
            var pv = document.getElementById('psm-ptr').value;
            localStorage.setItem(MY_SYM_KEY, mv);
            localStorage.setItem(PTR_SYM_KEY, pv);
            if(mv==='custom') localStorage.setItem(MY_CUST_KEY, document.getElementById('psm-my-ci').value.trim());
            if(pv==='custom') localStorage.setItem(PTR_CUST_KEY, document.getElementById('psm-ptr-ci').value.trim());
            close();
            if(window._syncPokeDesc) window._syncPokeDesc();
            if(typeof showNotification==='function') showNotification('戳一戳符号已保存 ✓','success',1800);
        });
    };

    function _syncPokeDesc() {
        var ms = localStorage.getItem(MY_SYM_KEY)||'star4';
        var ps = localStorage.getItem(PTR_SYM_KEY)||'star4';
        var ml = (PRESETS.find(function(p){return p.value===ms;})||{}).label||ms;
        var pl = (PRESETS.find(function(p){return p.value===ps;})||{}).label||ps;
        var d = document.getElementById('poke-symbol-desc');
        if(d) d.textContent = '我: '+ml+'  /  对方: '+pl;
    }
    window._syncPokeDesc = _syncPokeDesc;
    document.addEventListener('DOMContentLoaded', _syncPokeDesc);
    setTimeout(_syncPokeDesc, 600);
})();

(function() {
    var KEY = 'headerAlwaysClear';
    function _get() { return localStorage.getItem(KEY) === 'true'; }

    function _applyHeader() {
        var en = _get();
        var id = 'header-clear-override';
        var t  = document.getElementById(id);
        if (!t) { t = document.createElement('style'); t.id = id; document.head.appendChild(t); }
        if (en) {
            t.textContent = '.header { opacity: 1 !important; }';
        } else {
            t.textContent = [
                '.header { opacity: 0.5 !important; transition: opacity 0.3s ease !important; }',
                '.header:hover { opacity: 1 !important; }'
            ].join(' ');
        }
    }

    function _syncUI() {
        var en  = _get();
        var row = document.getElementById('header-opacity-toggle');
        if (row) row.classList.toggle('active', en);
        var spans = document.querySelectorAll('#header-opacity-toggle .setting-pill-label span');
        if (spans.length) spans[0].textContent = en ? '已开启，始终清晰' : '关闭后悬停才清晰';
    }

    window._toggleHeaderOpacity = function() {
        localStorage.setItem(KEY, String(!_get()));
        _applyHeader(); _syncUI();
        if (typeof showNotification === 'function')
            showNotification(_get() ? '顶部栏已常驻清晰 ✓' : '顶部栏已恢复悬停清晰', 'success', 1800);
    };

    _applyHeader();
    document.addEventListener('DOMContentLoaded', function(){ _applyHeader(); _syncUI(); });
    setTimeout(function(){ _applyHeader(); _syncUI(); }, 500);
    setTimeout(function(){ _applyHeader(); _syncUI(); }, 1500);
})();

(function() {
    var KEY = 'keepaliveAudioEnabled';
    var SRC = 'https://img.heliar.top/file/1772885159972_silence.m4a';
    var _audio = null;
    var _unlockBound = false;

    function _get() { return localStorage.getItem(KEY) === 'true'; }

    function _createAudio() {
        if (_audio) return _audio;
        _audio = new Audio(SRC);
        _audio.loop   = true;
        _audio.volume = 0.01;
        _audio.preload = 'auto';
        _audio.addEventListener('play',  function(){ _setUI(true);  });
        _audio.addEventListener('pause', function(){ _setUI(false); });
        return _audio;
    }

    function _setUI(playing) {
        var dot  = document.getElementById('keepalive-dot');
        var desc = document.getElementById('keepalive-audio-desc');
        var sw   = document.getElementById('keepalive-audio-switch');
        var row  = document.getElementById('keepalive-bar-row');

        if (sw)   sw.classList.toggle('active', _get());
        if (dot) {
            dot.className = 'keepalive-dot' + (playing ? ' alive' : '');
        }
        if (desc) {
            if (!_get())      desc.textContent = '静音循环音频，防止页面被系统挂起';
            else if (playing) desc.textContent = '运行中 · 页面已保活';
            else              desc.textContent = '等待交互后启动…';
        }
        if (row)  row.style.display = _get() ? 'flex' : 'none';
        var bars = document.querySelectorAll('.keepalive-wave-bar');
        bars.forEach(function(b){ b.style.animationPlayState = playing ? 'running' : 'paused'; });
    }

    function _start() {
        var a = _createAudio();
        var p = a.play();
        if (p && p.then) {
            p.catch(function(){
                _setUI(false);
                if (!_unlockBound) {
                    _unlockBound = true;
                    function unlock(){ if(_get()) a.play().catch(function(){}); _unlockBound=false; }
                    document.addEventListener('touchstart', unlock, { once:true });
                    document.addEventListener('click',      unlock, { once:true });
                }
            });
        }
    }

    function _stop() {
        if (_audio) { _audio.pause(); _audio.currentTime = 0; }
        _setUI(false);
    }

    window._toggleKeepaliveAudio = function() {
        var next = !_get();
        localStorage.setItem(KEY, String(next));
        if (next) {
            _start();
            if (typeof showNotification === 'function') showNotification('保活音频已开启 🎵', 'success', 2000);
        } else {
            _stop();
            if (typeof showNotification === 'function') showNotification('保活音频已关闭', 'info', 1500);
        }
        _setUI(next && _audio && !_audio.paused);
    };

    document.addEventListener('visibilitychange', function(){
        if (_get() && document.visibilityState === 'visible' && _audio && _audio.paused) {
            _audio.play().catch(function(){});
        }
    });

    document.addEventListener('DOMContentLoaded', function(){
        _setUI(false);
        if (_get()) _start();
    });
    setTimeout(function(){
        _setUI(_get() && !!_audio && !_audio.paused);
        if (_get() && (!_audio || _audio.paused)) _start();
    }, 1800);
})();

(function() {
    window._runMsgSearch = function() {
        var inp  = document.getElementById('msg-search-input');
        var from = document.getElementById('msg-search-date-from');
        var to   = document.getElementById('msg-search-date-to');
        var out  = document.getElementById('msg-search-results');
        if (!out) return;

        var q  = inp  ? inp.value.trim().toLowerCase() : '';
        var fd = from && from.value ? new Date(from.value+'T00:00:00') : null;
        var td = to   && to.value   ? new Date(to.value  +'T23:59:59') : null;

        if (!q && !fd && !td) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-search"></i><span>输入关键词或选择日期范围</span></div>';
            return;
        }
        if (typeof messages === 'undefined' || !messages || !messages.length) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-inbox"></i><span>暂无聊天记录</span></div>';
            return;
        }

        var res = messages.filter(function(m){
            if (m.type === 'system') return false;
            var ts = m.timestamp ? new Date(m.timestamp) : null;
            if (fd && ts && ts < fd) return false;
            if (td && ts && ts > td) return false;
            if (q) return m.text && m.text.toLowerCase().indexOf(q) !== -1;
            return true;
        });

        if (!res.length) {
            out.innerHTML = '<div class="sri-empty"><i class="fas fa-inbox"></i><span>未找到匹配消息</span></div>';
            return;
        }

        function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
        function hi(t,k){
            if(!k||!t) return esc(t||'');
            return esc(t).replace(new RegExp('('+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark style="background:rgba(var(--accent-color-rgb),.28);color:var(--text-primary);border-radius:3px;padding:0 2px;">$1</mark>');
        }
        function fmt(ts){
            if(!ts) return '';
            var d=new Date(ts);
            return d.getFullYear()+'/'+(d.getMonth()+1+'').padStart(2,'0')+'/'+(d.getDate()+'').padStart(2,'0')+' '+(d.getHours()+'').padStart(2,'0')+':'+(d.getMinutes()+'').padStart(2,'0');
        }
        function nm(m){ return m.sender==='user'?((typeof settings!=='undefined'&&settings.myName)||'我'):((typeof settings!=='undefined'&&settings.partnerName)||'对方'); }

        var _myAvSrc = (function(){
            var el = document.querySelector('#my-avatar img,[id*="my-avatar"] img');
            return el ? el.src : null;
        })();
        var _partnerAvSrc = (function(){
            var el = document.querySelector('#partner-avatar img,[id*="partner-avatar"] img,.partner-avatar img');
            return el ? el.src : null;
        })();
        function _avHtml(isMe) {
            var src = isMe ? _myAvSrc : _partnerAvSrc;
            if (src) return '<img src="'+src+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
            return '<i class="fas fa-'+(isMe?'user':'user-circle')+'" style="font-size:16px;color:rgba(255,255,255,.8);"></i>';
        }
        var html = '<div style="font-size:12px;color:var(--text-secondary);padding:0 2px 8px;">共 <b style="color:var(--accent-color)">'+res.length+'</b> 条</div>';
        html += res.slice(0,200).map(function(m){
            var isMe = m.sender==='user';
            var preview = m.text?(m.text.length>100?m.text.slice(0,100)+'…':m.text):(m.image?'[图片]':'');
            return '<div class="search-result-item" onclick="window._scrollToMsg&&window._scrollToMsg('+m.id+')">'+
                '<div class="sri-avatar '+(isMe?'sri-me':'sri-partner')+'">'+_avHtml(isMe)+'</div>'+
                '<div class="sri-body">'+
                  '<div class="sri-meta"><span class="sri-name">'+esc(nm(m))+'</span><span class="sri-time">'+fmt(m.timestamp)+'</span></div>'+
                  '<div class="sri-text">'+hi(preview,q)+'</div>'+
                '</div>'+
            '</div>';
        }).join('');
        if (res.length>200) html+='<div style="text-align:center;font-size:12px;color:var(--text-secondary);padding:6px 0">仅显示前 200 条</div>';
        out.innerHTML = html;
    };

    window._scrollToMsg = function(id) {
        var el = document.querySelector('[data-id="'+id+'"]') || document.querySelector('[data-message-id="'+id+'"]');
        if (el) {
            el.scrollIntoView({behavior:'smooth',block:'center'});
            el.style.transition='background .3s ease';
            el.style.background='rgba(var(--accent-color-rgb),.14)';
            setTimeout(function(){ el.style.background=''; }, 1800);
            var m = document.getElementById('stats-modal');
            if (m && typeof hideModal==='function') setTimeout(function(){ hideModal(m); }, 350);
        } else {
            if (typeof showNotification==='function') showNotification('消息不在当前视图中','info',2000);
        }
    };
})();

function renderComboMenu() {
    const content = document.getElementById('user-sticker-content');
    content.innerHTML = '';
    
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex; gap:8px; padding:8px; border-bottom:1px solid var(--border-color);';
    tabBar.innerHTML = `
        <button class="combo-tab active" data-tab="emoji" style="flex:1; padding:8px; border:none; background:var(--accent-color); color:#fff; border-radius:8px; cursor:pointer;">
            😊 表情
        </button>
        <button class="combo-tab" data-tab="poke" style="flex:1; padding:8px; border:none; background:var(--secondary-bg); color:var(--text-primary); border-radius:8px; cursor:pointer;">
            ✨ 拍一拍
        </button>
    `;
    
    const contentArea = document.createElement('div');
    contentArea.id = 'combo-content-area';
    contentArea.style.cssText = 'padding:10px; max-height:240px; overflow-y:auto;';
    
    content.appendChild(tabBar);
    content.appendChild(contentArea);
    
    showEmojiTab();
    
    tabBar.querySelectorAll('.combo-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            tabBar.querySelectorAll('.combo-tab').forEach(b => {
                b.style.background = 'var(--secondary-bg)';
                b.style.color = 'var(--text-primary)';
                b.classList.remove('active');
            });
            btn.style.background = 'var(--accent-color)';
            btn.style.color = '#fff';
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'emoji') {
                showEmojiTab();
            } else {
                showPokeTab();
            }
        });
    });
}

function showEmojiTab() {
    const area = document.getElementById('combo-content-area');
    area.innerHTML = '';
    area.style.display = 'grid';
    area.style.gridTemplateColumns = 'repeat(5, 1fr)';
    area.style.gap = '8px';
    
    CONSTANTS.REPLY_EMOJIS.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<span style="font-size:24px;">${emoji}</span>`;
        item.onclick = () => {
            const input = document.getElementById('message-input');
            input.value += emoji;
            document.getElementById('user-sticker-picker').classList.remove('active');
            input.focus();
        };
        area.appendChild(item);
    });
    customEmojis.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<span style="font-size:24px;">${emoji}</span>`;
        item.onclick = () => {
            const input = document.getElementById('message-input');
            input.value += emoji;
            document.getElementById('user-sticker-picker').classList.remove('active');
            input.focus();
        };
        area.appendChild(item);
    });

    stickerLibrary.forEach(src => {
        const item = document.createElement('div');
        item.className = 'picker-item';
        item.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
        item.onclick = () => {
            if (isBatchMode) {
                batchMessages.push({ id: Date.now() + batchMessages.length, text: '', image: src });
                updateBatchPreview();
                showNotification('已添加到批量发送', 'success', 1200);
            } else {
                addMessage({
                    id: Date.now(),
                    sender: 'user',
                    text: '',
                    timestamp: new Date(),
                    image: src,
                    status: 'sent',
                    type: 'normal'
                });
                playSound('send');
                
                const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                if (window._pendingReplyTimer) clearTimeout(window._pendingReplyTimer);
                window._pendingReplyTimer = setTimeout(() => { window._pendingReplyTimer = null; simulateReply(); }, randomDelay);
            }
            document.getElementById('user-sticker-picker').classList.remove('active');
        };
        area.appendChild(item);
    });
}

function showPokeTab() {
    const area = document.getElementById('combo-content-area');
    area.innerHTML = '';
    area.style.display = 'flex';
    area.style.flexDirection = 'column';
    area.style.gap = '8px';
    
    const quickPokes = window.PokeLibraryFeature
        ? window.PokeLibraryFeature.getQuick(customPokes)
        : customPokes.slice(0, 6);
    
    quickPokes.forEach(pokeText => {
        const btn = document.createElement('button');
        btn.textContent = pokeText;
        btn.style.cssText = `
            padding: 10px 14px;
            background: linear-gradient(135deg, var(--secondary-bg), rgba(var(--accent-color-rgb),0.04));
            border: 1px solid rgba(var(--accent-color-rgb),0.15);
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            font-size: 13px;
            transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
            color: var(--text-primary);
            font-family: var(--font-family);
            width: 100%;
        `;
        btn.addEventListener('mouseover', () => {
            btn.style.background = 'linear-gradient(135deg, rgba(var(--accent-color-rgb),0.12), rgba(var(--accent-color-rgb),0.06))';
            btn.style.borderColor = 'var(--accent-color)';
            btn.style.transform = 'translateX(4px)';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.background = 'linear-gradient(135deg, var(--secondary-bg), rgba(var(--accent-color-rgb),0.04))';
            btn.style.borderColor = 'rgba(var(--accent-color-rgb),0.15)';
            btn.style.transform = '';
        });
        btn.onclick = () => {
            addMessage({
                id: Date.now(), 
                text: _formatPokeText(`${settings.myName} ${pokeText}`), 
                timestamp: new Date(), 
                type: 'system'
            });
            document.getElementById('user-sticker-picker').classList.remove('active');
            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
            setTimeout(simulateReply, randomDelay);
        };
        area.appendChild(btn);
    });
    
    const libraryBtn = document.createElement('button');
    libraryBtn.className = 'poke-library-entry';
    libraryBtn.innerHTML = '<i class="fas fa-box-archive"></i><span>我的拍一拍库</span><i class="fas fa-chevron-right"></i>';
    libraryBtn.onclick = () => {
        document.getElementById('user-sticker-picker').classList.remove('active');
        if (window.PokeLibraryFeature) window.PokeLibraryFeature.open();
    };
    area.appendChild(libraryBtn);

    const customBtn = document.createElement('button');
    customBtn.innerHTML = '<i class="fas fa-edit"></i> 自定义拍一拍';
    customBtn.style.cssText = `
        padding: 11px 14px;
        background: linear-gradient(135deg, var(--accent-color), rgba(var(--accent-color-rgb),0.8));
        color: #fff;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        width: 100%;
        letter-spacing: 0.3px;
        margin-top: 4px;
        box-shadow: 0 4px 14px rgba(var(--accent-color-rgb), 0.25);
    `;
    customBtn.onclick = () => {
        document.getElementById('user-sticker-picker').classList.remove('active');
        showModal(DOMElements.pokeModal.modal, DOMElements.pokeModal.input);
    };
    area.appendChild(customBtn);
}
        function initCoreListeners() {


            DOMElements.chatContainer.addEventListener('scroll', () => {
                const container = DOMElements.chatContainer;


                if (container.scrollTop < 50 && !isLoadingHistory && messages.length > displayedMessageCount) {
                    isLoadingHistory = true;


                    const loader = document.getElementById('history-loader');
                    if (loader) loader.classList.add('visible');


                    setTimeout(() => {

                        displayedMessageCount += HISTORY_BATCH_SIZE;


                        renderMessages(true);


                        if (loader) loader.classList.remove('visible');
                        isLoadingHistory = false;
                    },
                        600);
                }
            });

            DOMElements.sendBtn.addEventListener('click', () => isBatchMode ? addToBatch(): sendMessage());
            DOMElements.messageInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); isBatchMode ? addToBatch(): sendMessage();
                }
            });
            DOMElements.messageInput.addEventListener('input', () => {
                DOMElements.messageInput.style.height = 'auto'; DOMElements.messageInput.style.height = `${Math.min(DOMElements.messageInput.scrollHeight, 120)}px`;
            });


            DOMElements.attachmentBtn.addEventListener('click', () => {

                const modal = document.createElement('div');
                modal.className = 'modal image-upload-modal';
                modal.style.cssText = `
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
            opacity: 0;
            transition: opacity 0.3s ease;
            `;

                modal.innerHTML = `
            <div class="modal-content" style="
            z-index: 10000;
            position: relative;
            background-color: var(--secondary-bg);
            border-radius: var(--radius);
            padding: 24px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            ">
            <div class="modal-title"><i class="fas fa-image"></i><span>发送图片</span></div>
            <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="modal-btn modal-btn-secondary upload-mode-btn active" id="upload-image-file-btn" style="flex: 1;">选择文件</button>
            <button class="modal-btn modal-btn-secondary upload-mode-btn" id="paste-image-url-btn" style="flex: 1;">粘贴URL</button>
            </div>
            <input type="file" class="modal-input" id="image-file-input" accept="image/*">
            <input type="text" class="modal-input" id="image-url-input" placeholder="输入图片URL地址" style="display: none;">
            <div id="image-preview" style="text-align: center; margin-top: 10px; display: none;">
            <img id="preview-chat-image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--border-color);">
            </div>
            </div>
            <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" id="cancel-image">取消</button>
            <button class="modal-btn modal-btn-primary" id="send-image" disabled>发送</button>
            </div>
            </div>
            `;

                document.body.appendChild(modal);


                setTimeout(() => {
                    modal.style.opacity = '1';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 10);

                const fileInput = document.getElementById('image-file-input');
                const urlInput = document.getElementById('image-url-input');
                const uploadBtn = document.getElementById('upload-image-file-btn');
                const pasteUrlBtn = document.getElementById('paste-image-url-btn');
                const previewDiv = document.getElementById('image-preview');
                const previewImg = document.getElementById('preview-chat-image');
                const sendBtn = document.getElementById('send-image');
                const cancelBtn = document.getElementById('cancel-image');
                const uploadModeBtns = document.querySelectorAll('.upload-mode-btn');

                let currentImageData = null;


                function switchUploadMode(isFileMode) {
                    uploadModeBtns.forEach(btn => btn.classList.remove('active'));
                    if (isFileMode) {
                        uploadBtn.classList.add('active');
                        fileInput.style.display = 'block';
                        urlInput.style.display = 'none';
                    } else {
                        pasteUrlBtn.classList.add('active');
                        fileInput.style.display = 'none';
                        urlInput.style.display = 'block';
                        urlInput.focus();
                    }

                    previewDiv.style.display = 'none';
                    sendBtn.disabled = true;
                    currentImageData = null;
                }


                uploadBtn.addEventListener('click', () => switchUploadMode(true));


                pasteUrlBtn.addEventListener('click', () => switchUploadMode(false));


                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > MAX_IMAGE_SIZE) {
                            showNotification('图片大小不能超过5MB', 'error');
                            return;
                        }
                        showNotification('正在优化图片...', 'info', 1500);
                        optimizeImage(file).then(optimizedData => {
                            currentImageData = optimizedData;
                            previewImg.src = currentImageData;
                            previewDiv.style.display = 'block';
                            sendBtn.disabled = false;
                        }).catch(() => {
                            showNotification('图片处理失败', 'error');
                        });
                    }
                });


                urlInput.addEventListener('input',
                    function() {
                        const url = urlInput.value.trim();
                        if (url) {

                            if (/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp))$/i.test(url)) {
                                previewImg.src = url;
                                previewDiv.style.display = 'block';
                                currentImageData = url;
                                sendBtn.disabled = false;


                                const img = new Image();
                                img.onload = function() {

                                    previewImg.src = url;
                                    showNotification('图片URL有效', 'success', 1000);
                                };
                                img.onerror = function() {
                                    showNotification('图片URL无效或无法访问', 'error');
                                    sendBtn.disabled = true;
                                    previewDiv.style.display = 'none';
                                };
                                img.src = url;
                            } else {
                                sendBtn.disabled = true;
                                previewDiv.style.display = 'none';
                            }
                        } else {
                            sendBtn.disabled = true;
                            previewDiv.style.display = 'none';
                        }
                    });


                sendBtn.addEventListener('click',
                    () => {
                        if (currentImageData) {

                            addMessage({
                                id: Date.now(),
                                sender: 'user',
                                text: '',
                                timestamp: new Date(),
                                image: currentImageData,
                                status: 'sent',
                                favorited: false,
                                note: null,
                                replyTo: currentReplyTo,
                                type: 'normal'
                            });
                            playSound('send');
                            currentReplyTo = null;
                            updateReplyPreview();
                            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                            setTimeout(simulateReply, randomDelay);


                            closeModal();
                        }
                    });


                cancelBtn.addEventListener('click',
                    closeModal);


                function closeModal() {
                    modal.style.opacity = '0';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    },
                        300);
                }


                modal.addEventListener('click',
                    (e) => {
                        if (e.target === modal) {
                            closeModal();
                        }
                    });


                modal.querySelector('.modal-content').addEventListener('click',
                    (e) => {
                        e.stopPropagation();
                    });


                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };
                document.addEventListener('keydown', handleEscKey);


                modal.addEventListener('close', () => {
                    document.removeEventListener('keydown', handleEscKey);
                });
            });


            DOMElements.imageInput.addEventListener('change', () => {
                if (DOMElements.imageInput.files[0]) {
                    if (isBatchMode) {
                        showNotification('批量模式不支持图片', 'warning');
                        DOMElements.imageInput.value = '';
                    } else {
                        sendMessage();
                    }
                }
            });

            DOMElements.continueBtn.addEventListener('click', simulateReply);
            DOMElements.batchBtn.addEventListener('click', toggleBatchMode);
        }

window._dailyGreetingReady = false;

function _getDailyGreetingData() {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();

    var timeLabel = '早上好', timeEmoji = '🌅';
    if (hour >= 12 && hour < 18) { timeLabel = '下午好'; timeEmoji = '☀️'; }
    else if (hour >= 18 && hour < 22) { timeLabel = '傍晚好'; timeEmoji = '🌇'; }
    else if (hour >= 22 || hour < 6) { timeLabel = '晚上好'; timeEmoji = '🌙'; }

var festivals = [
    { m:1, d:1, name:'元旦', emoji:'🎆', label:'NEW YEAR', note:'新年快乐！愿新的一年里，你们的爱情越来越甜蜜，每一天都充满幸福与惊喜～' },
    { m:1, d:5, name:'小寒', emoji:'❄️', label:'MINOR COLD', note:'小寒至，春不远。有你在身边，心里总是暖暖的。' },
    { m:1, d:20, name:'大寒', emoji:'🧊', label:'MAJOR COLD', note:'大寒快乐，记得添衣保暖。你的拥抱就是最暖的炉火。' },

    { m:2, d:4, name:'立春', emoji:'🌱', label:'START OF SPRING', note:'立春快乐！春天来了，我们的爱也像新芽一样蓬勃生长。' },
    { m:2, d:14, name:'情人节', emoji:'💝', label:'VALENTINES DAY', note:'情人节快乐，亲爱的！你是我最美好的礼物，爱你哦～' },
    { m:2, d:16, name:'除夕', emoji:'🧧', label:'CHINESE NEW YEAR EVE', note:'除夕快乐！辞旧迎新，愿你们携手跨入幸福的新一年，万事如意！' },
    { m:2, d:17, name:'春节', emoji:'🎊', label:'SPRING FESTIVAL', note:'新年快乐！新的一年，愿你们相爱如初，甜蜜长久。' },
    { m:2, d:18, name:'雨水', emoji:'☔', label:'RAIN WATER', note:'雨水节气，愿幸福像春雨一样滋润你的每一天。' },

    { m:3, d:3, name:'元宵节', emoji:'🏮', label:'LANTERN FESTIVAL', note:'元宵节快乐！花灯映月，你是我心里最亮的那盏灯。' },
    { m:3, d:5, name:'惊蛰', emoji:'⚡', label:'AWAKENING OF INSECTS', note:'惊蛰春雷响，万物复苏，你是我最美的春天。' },
    { m:3, d:8, name:'妇女节', emoji:'🌹', label:'WOMENS DAY', note:'今天是属于你的节日，愿你永远被温柔相待，被爱守护。' },
    { m:3, d:12, name:'植树节', emoji:'🌳', label:'TREE PLANTING DAY', note:'今天种下一棵树，也在心里种下对你不变的爱。' },
    { m:3, d:20, name:'春分', emoji:'🌸', label:'SPRING EQUINOX', note:'春分昼夜平分，我的爱对你从不偏心——永远满分。' },

    { m:4, d:1, name:'愚人节', emoji:'🤡', label:'APRIL FOOLS', note:'今天可以骗你说“我不爱你了”，但我的心骗不了自己～' },
    { m:4, d:5, name:'清明节', emoji:'🌧', label:'QINGMING FESTIVAL', note:'慎终追远，珍惜眼前。有你在，每一天都格外温暖。' },
    { m:4, d:20, name:'谷雨', emoji:'🌾', label:'GRAIN RAIN', note:'谷雨生百谷，你是我生命里最饱满的那颗。' },

    { m:5, d:1, name:'劳动节', emoji:'🛠️', label:'LABOR DAY', note:'劳动最光荣，但我更光荣的是能拥有你。' },
    { m:5, d:4, name:'青年节', emoji:'✨', label:'YOUTH DAY', note:'青春正好，与你共度。愿我们永远年轻，永远热泪盈眶。' },
    { m:5, d:5, name:'立夏', emoji:'☀️', label:'START OF SUMMER', note:'立夏快乐！愿我们的爱像夏天一样热情。' },
    { m:5, d:20, name:'520', emoji:'💕', label:'I LOVE YOU', note:'520，我爱你！感谢你出现在我的生命里，你是我最好的选择。' },
    { m:5, d:21, name:'小满', emoji:'🌾', label:'GRAIN BUDS', note:'小满未满，万物可期。我对你的爱永远在增长的季节。' },

    { m:6, d:1, name:'儿童节', emoji:'🎈', label:'CHILDRENS DAY', note:'愿你永远保持那颗童心，和我一起做个快乐的大小孩。' },
    { m:6, d:5, name:'芒种', emoji:'🌽', label:'GRAIN IN EAR', note:'芒种忙种，有你在的日子，每天都是收获。' },
    { m:6, d:19, name:'端午节', emoji:'🛶', label:'DRAGON BOAT FESTIVAL', note:'粽子软糯，你更甜～端午安康！' },
    { m:6, d:21, name:'夏至', emoji:'🍉', label:'SUMMER SOLSTICE', note:'夏至最长的一天，我的思念比它还长。' },

    { m:7, d:6, name:'小暑', emoji:'🌡️', label:'MINOR HEAT', note:'小暑入伏天，你的怀抱是最清凉的风。' },
    { m:7, d:23, name:'大暑', emoji:'🔥', label:'MAJOR HEAT', note:'大暑炎炎，你是我心里的冰镇西瓜。' },

    { m:8, d:7, name:'立秋', emoji:'🍁', label:'START OF AUTUMN', note:'立秋快乐，愿与你共赏每一片秋叶。' },
    { m:8, d:19, name:'七夕节', emoji:'🌌', label:'QIXI FESTIVAL', note:'七夕快乐！牛郎织女一年只见一次，而我们每天都在一起，真幸运。' },
    { m:8, d:23, name:'处暑', emoji:'🌬️', label:'END OF HEAT', note:'处暑出暑，炎热渐消，爱意不减。' },

    { m:9, d:7, name:'白露', emoji:'💧', label:'WHITE DEW', note:'白露为霜，所谓伊人，在我身旁。' },
    { m:9, d:10, name:'教师节', emoji:'📚', label:'TEACHERS DAY', note:'你是我人生中最特别的老师，教会了我什么是爱。' },
    { m:9, d:23, name:'秋分', emoji:'🍂', label:'AUTUMN EQUINOX', note:'秋分昼夜均，你是我心里的天平。' },
    { m:9, d:25, name:'中秋节', emoji:'🌕', label:'MID AUTUMN FESTIVAL', note:'月圆人团圆，有你才叫团圆。中秋快乐！' },

    { m:10, d:1, name:'国庆节', emoji:'🎑', label:'NATIONAL DAY', note:'国庆快乐！和你在一起的每一天都像节日，爱你。' },
    { m:10, d:8, name:'寒露', emoji:'🍃', label:'COLD DEW', note:'寒露凝霜，有你在心里总是暖的。' },
    { m:10, d:23, name:'霜降', emoji:'❄️', label:'FROST DESCENT', note:'霜降叶落，我的爱却常青。' },
    { m:10, d:31, name:'万圣夜', emoji:'🎃', label:'HALLOWEEN', note:'不给糖就捣蛋，但你给了我全世界最甜的糖——你的爱。' },

    { m:11, d:7, name:'立冬', emoji:'🧣', label:'START OF WINTER', note:'立冬快乐，你的拥抱是冬天里最暖的阳光。' },
    { m:11, d:11, name:'光棍节', emoji:'👫', label:'SINGLES DAY', note:'幸好我们不用过这个节，因为我有你。' },
    { m:11, d:22, name:'小雪', emoji:'⛄', label:'MINOR SNOW', note:'小雪飘飘，你是我心里最暖的那团火。' },
    { m:11, d:26, name:'感恩节', emoji:'🙏', label:'THANKSGIVING', note:'感谢生命中有你，每一天都是恩赐。' },

    { m:12, d:7, name:'大雪', emoji:'☃️', label:'MAJOR SNOW', note:'大雪封门，封不住我对你的想念。' },
    { m:12, d:22, name:'冬至', emoji:'🥟', label:'WINTER SOLSTICE', note:'冬至快乐，记得吃饺子，但记得想我。' },
    { m:12, d:24, name:'平安夜', emoji:'🎄', label:'CHRISTMAS EVE', note:'平安夜快乐！愿你平平安安，我们的爱情也岁岁常安。' },
    { m:12, d:25, name:'圣诞节', emoji:'🎅', label:'MERRY CHRISTMAS', note:'圣诞快乐！你就是我收到的最好的礼物，永远爱你。' },
    { m:12, d:31, name:'跨年夜', emoji:'🎆', label:'NEW YEAR EVE', note:'再见这一年，你是我最好的收获。新的一年，继续爱你。' }
];
var festival = null;
    for (var fi = 0; fi < festivals.length; fi++) {
        if (festivals[fi].m === month && festivals[fi].d === day) { festival = festivals[fi]; break; }
    }

  var weathers = [
    '晴空万里',
    '多云转晴',
    '阴天有云',
    '细雨蒙蒙',
    '春风和煦',
    '微微寒冷',
    '清风徐徐',
    '雨后初晴',
    '夜色宁静',
    '月光皎洁',
    '晴间多云',
    '大雨滂沱',
    '雷雨交加',
    '小雪纷飞',
    '微风拂面',
    '多云天气',
    '雾气朦胧',
    '星光璀璨',
    '朝霞满天',
    '夕阳西下',
    '海风轻拂',
    '山间清爽',
    '秋叶飘落',
    '花香四溢',
    '绿意盎然',
    '雨后清新',
    '雪花飞舞',
    '阳光明媚'
];

var statusPool = [
    '正在想你 💭',
    '忙碌中，但心里有你',
    '好好的，别担心 ✨',
    '期待见到你',
    '有点想你了',
    '在努力变更好',
    '今天挺安静的',
    '心情不错哦 🌱',
    '一切都好，你呢？',
    '看月亮，想到你 🌙',
    '今天有点想你',
    '刚刚看到一朵云像你 ☁️',
    '工作再忙也会想你的',
    '今天你开心吗？',
    '梦里见 💤',
    '好好吃饭了吗？',
    '记得多喝水哦 💧',
    '今天有没有照顾好自己',
    '想你，但不说 🤫',
    '全世界你最可爱',
    '今天天气不错，适合想你',
    '吃饱喝足，开始想你',
    '今天也想牵你的手',
    '你有没有想我',
    '今天比昨天更想你',
    '看到好吃的想分享给你 🍜',
    '听到一首歌想到你 🎵',
    '今天也要加油鸭',
    '晚安，我的全世界 🌙',
    '早安，又是想你的一天'
];
    var todayKey = String(now.getFullYear()) + String(month) + String(day);
    // 为每个安装生成唯一 salt，确保每位用户每天的天气/状态各不相同
    var userSalt = localStorage.getItem('_dgUserSalt');
    if (!userSalt) {
        userSalt = String(Math.floor(Math.random() * 999983) + 1);
        localStorage.setItem('_dgUserSalt', userSalt);
    }
    var seed = 0;
    var saltedKey = todayKey + userSalt;
    for (var si = 0; si < saltedKey.length; si++) seed += saltedKey.charCodeAt(si) * (si + 1);
    function seededRandDg(s, offset) {
        var x = Math.sin(s * 9301 + offset * 49297 + 233) * 1000003;
        return x - Math.floor(x);
    }
    var defaultWeather = weathers[Math.floor(seededRandDg(seed, 0) * weathers.length)];
    var customWeatherKey = 'customWeather_' + now.getFullYear() + '_' + month + '_' + day;
    var weather = localStorage.getItem(customWeatherKey) || defaultWeather;

    // 混合系统预设 + 用户自定义状态池
    var userStatusPool = [];
    try { userStatusPool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e) {}
    var userStatusTexts = userStatusPool.map(function(item) { return item.status || item; }).filter(Boolean);
    var mixedStatusPool = statusPool.concat(userStatusTexts);
    var status = mixedStatusPool[Math.floor(seededRandDg(seed, 1) * mixedStatusPool.length)];

    return { timeLabel: timeLabel, timeEmoji: timeEmoji, festival: festival, weather: weather, status: status };
}

function _buildDailyGreeting() {
    try {
        var data = _getDailyGreetingData();
        var festival = data.festival;
        var timeLabel = data.timeLabel;
        var timeEmoji = data.timeEmoji;
        var weather = data.weather;
        var status = data.status;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');

        var moodDataRaw = window.moodData || {};
        var todayMood = moodDataRaw[todayStr];
        var allMoods = (typeof getAllMoodOptions === 'function') ? getAllMoodOptions() : [];

        var pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        var mName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        var partnerMoodText = pName + ' 今天还没有记录';
        var partnerMoodIcon = null; 
        var partnerMoodNote = '';

        if (todayMood && todayMood.partner) {
            for (var pi = 0; pi < allMoods.length; pi++) {
                if (allMoods[pi].key === todayMood.partner) {
                    partnerMoodText = allMoods[pi].kaomoji + '  ' + allMoods[pi].label;
                    partnerMoodIcon = allMoods[pi].kaomoji;
                    break;
                }
            }
            partnerMoodNote = todayMood.partnerNote || '';
        }

        var h = now.getHours();
        var mainTitle = festival ? (festival.name + '快乐') : timeLabel;
        var festLabel = festival ? festival.label : ('GOOD ' + (h < 12 ? 'MORNING' : h < 18 ? 'AFTERNOON' : 'EVENING'));
        var noteText = festival ? festival.note : '今天也要元气满满，我在这里陪着你 ✦';

        var customData = {};
        try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e2) {}
        
        var now2 = new Date();
        var dailySeed = now2.getFullYear() * 10000 + (now2.getMonth()+1) * 100 + now2.getDate();
        function seededRandom(seed) { return (Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % 233280) / 233280; }
        var todaySeedForText = dailySeed;

        var defaultTitles = festival ? [(festival.name + '快乐')] : [timeLabel, '今天也要开心哦', '你在我心里呀', '想你'];
        var defaultNotes = festival ? [festival.note] : ['今天也要元气满满，我在这里陪着你 ✦', '每一天都因为有你而特别 ✦', '想到你就觉得很安心 ✦', '你是我最喜欢的人 ✦'];

        var mixedTitles = (customData.titles && customData.titles.length > 0) ? [...customData.titles, ...defaultTitles] : 
                          (customData.title ? [customData.title, ...defaultTitles] : defaultTitles);
        var mixedNotes = (customData.notes && customData.notes.length > 0) ? [...customData.notes, ...defaultNotes] :
                         (customData.note ? [customData.note, ...defaultNotes] : defaultNotes);

        mainTitle = mixedTitles[Math.floor(seededRandom(todaySeedForText) * mixedTitles.length)];
        noteText = mixedNotes[Math.floor(seededRandom(todaySeedForText + 1) * mixedNotes.length)];

        function setEl(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; }
        function setElHTML(id, val) { var el = document.getElementById(id); if (el) el.innerHTML = val; }

        var emojiEl = document.getElementById('dg-emoji');
        if (emojiEl) {
            if (festival) {
                emojiEl.textContent = festival.emoji;
            }
        }

        var moodIconEl = document.getElementById('dg-partner-mood-icon');
        if (moodIconEl) {
            if (partnerMoodIcon) {
                moodIconEl.textContent = partnerMoodIcon;
                moodIconEl.style.fontSize = '32px';
            }
        }

        setEl('dg-festival', festLabel);
        setEl('dg-title', mainTitle);
        setEl('dg-partner-mood', partnerMoodText);
        setEl('dg-partner-mood-note', partnerMoodNote || (todayMood && todayMood.partner ? pName + ' 记录了今天的心情 ☆' : ''));

        var statusPoolData = [];
        try { statusPoolData = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
        // 将系统预设 + 用户自定义混合后，按今日种子选取
        var systemStatusItems = (function() {
            var sysPool = [];
            // 将系统状态文本包装成与 statusPoolData 兼容的格式
            var baseStatus = (typeof status !== 'undefined') ? status : '';
            if (baseStatus) sysPool.push({ status: baseStatus, icon: null, iconImg: null });
            return sysPool;
        })();
        var fullPool = systemStatusItems.concat(statusPoolData);
        if (fullPool.length > 0) {
            var poolItem = fullPool[Math.floor(seededRandom(todaySeedForText + 2) * fullPool.length)];
            if (poolItem) {
                setEl('dg-festival', poolItem.label || festLabel);
                setEl('dg-status', poolItem.status || status);
                var emojiEl2 = document.getElementById('dg-emoji');
                if (emojiEl2) {
                    if (poolItem.iconImg) {
                        emojiEl2.textContent = '';
                        emojiEl2.style.backgroundImage = 'url(' + poolItem.iconImg + ')';
                        emojiEl2.style.backgroundSize = 'cover';
                        emojiEl2.style.backgroundPosition = 'center';
                    } else if (poolItem.icon) {
                        emojiEl2.style.backgroundImage = '';
                        emojiEl2.textContent = poolItem.icon;
                    }
                }
            }
        } else {
            setEl('dg-status', status);
        }
        setEl('dg-weather', weather);

        var noteTextEl = document.getElementById('dg-note-text');
        if (noteTextEl) noteTextEl.textContent = noteText;
        var wBadge = document.getElementById('dg-note-weather-badge');
        if (wBadge) wBadge.style.display = 'none';

        setEl('dg-section-label-partner', pName + ' 今日状态');
        setEl('dg-weather-label', pName + ' 的天气');
        setEl('dg-status-label', pName + ' 的状态');

        var months = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
        setEl('dg-date-stamp', now.getFullYear() + ' · ' + months[now.getMonth()] + '月' + now.getDate() + '日');

        var headerBg = localStorage.getItem('dg_header_bg');
        var bgEl = document.getElementById('dg-header-band-bg');
        if (bgEl && headerBg) {
            bgEl.style.backgroundImage = 'url(' + headerBg + ')';
            bgEl.classList.add('has-img');
        }

        var overlayBg = localStorage.getItem('dg_overlay_bg');
        if (overlayBg) { applyDgOverlayBg(overlayBg); }

        var decoImg = customData.decoImg;
        var decoWrap2 = document.getElementById('dg-deco-img-wrap');
        var decoImgEl2 = document.getElementById('dg-deco-img');
        if (decoWrap2 && decoImgEl2) {
            if (decoImg) {
                decoImgEl2.src = decoImg;
                decoWrap2.style.display = 'block';
            } else {
                decoWrap2.style.display = 'none';
            }
        }
    } catch(e) { console.warn('Daily greeting build error:', e); }
}

window.toggleImmersiveMode = function(force) {
    var isOn = (force !== undefined) ? force : !document.body.classList.contains('immersive-mode');
    document.body.classList.toggle('immersive-mode', isOn);
    var toggle = document.getElementById('immersive-toggle');
    if (toggle) toggle.classList.toggle('active', isOn);
    try { localStorage.setItem('immersive_mode', isOn ? '1' : '0'); } catch(e) {}
    if (!isOn && typeof showNotification === 'function') showNotification('已退出沉浸式模式', 'info');
};

(function() {
    var btn = document.getElementById('immersive-exit-btn');
    if (!btn) return;
    var isDragging = false, hasMoved = false;
    var startX, startY, origRight, origBottom;
    
    function getRight() { return parseInt(btn.style.right) || 20; }
    function getBottom() { return parseInt(btn.style.bottom) || 100; }
    
    function onStart(e) {
        isDragging = true; hasMoved = false;
        btn.classList.add('dragging');
        var touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        origRight = getRight();
        origBottom = getBottom();
        e.preventDefault();
    }
    function onMove(e) {
        if (!isDragging) return;
        var touch = e.touches ? e.touches[0] : e;
        var dx = touch.clientX - startX;
        var dy = touch.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
        var newRight = Math.max(10, Math.min(window.innerWidth - 54, origRight - dx));
        var newBottom = Math.max(10, Math.min(window.innerHeight - 54, origBottom - dy));
        btn.style.right = newRight + 'px';
        btn.style.bottom = newBottom + 'px';
        btn.style.left = 'auto';
        btn.style.top = 'auto';
        e.preventDefault();
    }
    function onEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        btn.classList.remove('dragging');
        if (!hasMoved) {
            window.toggleImmersiveMode(false);
        }
    }
    btn.addEventListener('mousedown', onStart, {passive: false});
    btn.addEventListener('touchstart', onStart, {passive: false});
    document.addEventListener('mousemove', onMove, {passive: false});
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
    
    btn.removeAttribute('onclick');
})();
(function() {
    try {
        if (localStorage.getItem('immersive_mode') === '1') {
            document.body.classList.add('immersive-mode');
            var t = document.getElementById('immersive-toggle');
            if (t) t.classList.add('active');
        }
    } catch(e) {}
})();

window.openDailyGreetingEditor = function() {
    var modal = document.getElementById('dg-editor-modal');
    if (!modal) return;
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    var titleEl = document.getElementById('dg-edit-title');
    var noteEl = document.getElementById('dg-edit-note');
    if (titleEl) titleEl.value = (customData.titles && customData.titles.length) ? customData.titles.join('\n') : (customData.title || '');
    if (noteEl) noteEl.value = (customData.notes && customData.notes.length) ? customData.notes.join('\n') : (customData.note || '');

    if (customData.decoImg) {
        var prev = document.getElementById('dg-deco-preview');
        var prevImg = document.getElementById('dg-deco-preview-img');
        if (prev && prevImg) { prevImg.src = customData.decoImg; prev.style.display = 'block'; }
    }

    modal.style.display = 'flex';
    modal.classList.add('active');
};
window.closeDailyGreetingEditor = function() {
    var modal = document.getElementById('dg-editor-modal');
    if (modal) { modal.style.display = 'none'; modal.classList.remove('active'); }
};
window.saveDailyGreetingCustom = function() {
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    var titleEl = document.getElementById('dg-edit-title');
    var noteEl = document.getElementById('dg-edit-note');
    if (titleEl && titleEl.value.trim()) {
        var titles = titleEl.value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
        customData.titles = titles;
        customData.title = titles[0];
    } else { delete customData.titles; delete customData.title; }
    if (noteEl && noteEl.value.trim()) {
        var notes = noteEl.value.split('\n').map(function(s){ return s.trim(); }).filter(Boolean);
        customData.notes = notes;
        customData.note = notes[0]; 
    } else { delete customData.notes; delete customData.note; }
    localStorage.setItem('dg_custom_data', JSON.stringify(customData));
    closeDailyGreetingEditor();
    if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
    if (typeof showNotification === 'function') showNotification('公告已保存 ✦', 'success');
};
window.clearDgDecoImg = function() {
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e) {}
    delete customData.decoImg;
    localStorage.setItem('dg_custom_data', JSON.stringify(customData));
    var prev = document.getElementById('dg-deco-preview');
    if (prev) prev.style.display = 'none';
    var wrap = document.getElementById('dg-deco-img-wrap');
    if (wrap) wrap.style.display = 'none';
};
window.clearDgHeaderBg = function() {
    localStorage.removeItem('dg_header_bg');
    var bgEl = document.getElementById('dg-header-band-bg');
    if (bgEl) { bgEl.style.backgroundImage = ''; bgEl.classList.remove('has-img'); }
};

window.onDgOverlayOpacityChange = function(val) {
    var tint = parseInt(val) / 100;
    localStorage.setItem('dg_overlay_bg_tint', tint);
    var valEl = document.getElementById('dg-overlay-opacity-val');
    if (valEl) valEl.textContent = val + '%';
    var tintLayer = document.getElementById('dg-card-tint-overlay');
    if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,' + tint + ')';
};

window.handleDgOverlayBgUpload = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var data = ev.target.result;
        localStorage.setItem('dg_overlay_bg', data);
        applyDgOverlayBg(data);
        var prev = document.getElementById('dg-overlay-bg-preview');
        var prevImg = document.getElementById('dg-overlay-bg-preview-img');
        if (prev && prevImg) { prevImg.src = data; prev.style.display = 'block'; }
        var opRow = document.getElementById('dg-overlay-opacity-row');
        if (opRow) opRow.style.display = 'block';
        var savedTint = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
        var pct = isNaN(savedTint) ? 25 : Math.round(savedTint * 100);
        var slider = document.getElementById('dg-overlay-opacity-slider');
        var valEl = document.getElementById('dg-overlay-opacity-val');
        if (slider) slider.value = pct;
        if (valEl) valEl.textContent = pct + '%';
    };
    reader.readAsDataURL(file);
};

window.clearDgOverlayBg = function() {
    localStorage.removeItem('dg_overlay_bg');
    applyDgOverlayBg(null);
    var prev = document.getElementById('dg-overlay-bg-preview');
    if (prev) prev.style.display = 'none';
    var opRow = document.getElementById('dg-overlay-opacity-row');
    if (opRow) opRow.style.display = 'none';
    if (typeof showNotification === 'function') showNotification('全屏背景已清除', 'success');
};

function applyDgOverlayBg(data, tintOpacity) {
    var card = document.getElementById('daily-greeting-card');
    var bgLayer = document.getElementById('dg-card-bg-layer');
    var tintLayer = document.getElementById('dg-card-tint-overlay');
    if (!card || !bgLayer) return;
    if (tintOpacity === undefined || tintOpacity === null) {
        var saved = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
        tintOpacity = isNaN(saved) ? 0.25 : saved;
    }
    if (data) {
        bgLayer.style.backgroundImage = 'url(' + data + ')';
        bgLayer.style.opacity = '1';
        if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,' + tintOpacity + ')';
        card.classList.add('has-card-bg');
        card.style.backgroundImage = '';
        card.style.backgroundSize = '';
        card.style.backgroundPosition = '';
        card.style.backgroundRepeat = '';
    } else {
        bgLayer.style.backgroundImage = '';
        bgLayer.style.opacity = '';
        if (tintLayer) tintLayer.style.background = 'rgba(0,0,0,0)';
        card.classList.remove('has-card-bg');
    }
}

(function() {
    var savedOverlayBg = localStorage.getItem('dg_overlay_bg');
    if (savedOverlayBg) {
        document.addEventListener('DOMContentLoaded', function() {
            applyDgOverlayBg(savedOverlayBg);
            var prev = document.getElementById('dg-overlay-bg-preview');
            var prevImg = document.getElementById('dg-overlay-bg-preview-img');
            if (prev && prevImg) { prevImg.src = savedOverlayBg; prev.style.display = 'block'; }
            var opRow = document.getElementById('dg-overlay-opacity-row');
            if (opRow) opRow.style.display = 'block';
            var savedOp = parseFloat(localStorage.getItem('dg_overlay_bg_tint'));
            var pct = isNaN(savedOp) ? 25 : Math.round(savedOp * 100);
            var slider = document.getElementById('dg-overlay-opacity-slider');
            var valEl = document.getElementById('dg-overlay-opacity-val');
            if (slider) slider.value = pct;
            if (valEl) valEl.textContent = pct + '%';
        });
    }
})();

window.switchToAnnouncementPanel = function() {
    var listArea = document.getElementById('custom-replies-list');
    var annPanel = document.getElementById('announcement-panel');
    var toolbar = document.getElementById('cr-toolbar');
    var subTabs = document.getElementById('cr-sub-tabs');
    var addBtn = document.getElementById('add-custom-reply');
    var titleEl = document.getElementById('cr-modal-title');
    if (listArea) listArea.style.display = 'none';
    if (annPanel) { annPanel.style.display = 'block'; annPanel.scrollTop = 0; }
    if (toolbar) toolbar.style.display = 'none';
    if (subTabs) subTabs.style.display = 'none';
    if (addBtn) addBtn.style.display = 'none';
    if (titleEl) titleEl.textContent = '今日公告配置';
    var customData = {};
    try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(e2) {}
    var titleInput = document.getElementById('dg-edit-title');
    var noteInput = document.getElementById('dg-edit-note');
    if (titleInput) titleInput.value = (customData.titles && customData.titles.length) ? customData.titles.join('\n') : (customData.title || '');
    if (noteInput) noteInput.value = (customData.notes && customData.notes.length) ? customData.notes.join('\n') : (customData.note || '');
    if (customData.decoImg) {
        var prev = document.getElementById('dg-deco-preview');
        var prevImg = document.getElementById('dg-deco-preview-img');
        if (prev && prevImg) { prevImg.src = customData.decoImg; prev.style.display = 'block'; }
    }
    var savedOverlayBg2 = localStorage.getItem('dg_overlay_bg');
    if (savedOverlayBg2) {
        var overlayPrev = document.getElementById('dg-overlay-bg-preview');
        var overlayPrevImg = document.getElementById('dg-overlay-bg-preview-img');
        if (overlayPrev && overlayPrevImg) { overlayPrevImg.src = savedOverlayBg2; overlayPrev.style.display = 'block'; }
    }
    renderAnnStatusPool();
};

window.renderAnnStatusPool = function() {
    var listEl = document.getElementById('ann-status-pool-list');
    if (!listEl) return;
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    listEl.innerHTML = '';
    if (pool.length === 0) {
        listEl.innerHTML = '<div style="font-size:12px;color:var(--text-secondary);text-align:center;padding:10px 0;opacity:0.6;">暂无条目，添加后将随机抽取</div>';
        return;
    }
    pool.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:9px 12px;background:linear-gradient(135deg,rgba(var(--accent-color-rgb),0.05),rgba(var(--accent-color-rgb),0.02));border-radius:12px;border:1px solid rgba(var(--accent-color-rgb),0.15);font-size:13px;transition:box-shadow 0.2s;';
        var iconHtml = item.iconImg
            ? '<img src="' + item.iconImg + '" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0;">'
            : '<span style="font-size:18px;min-width:26px;text-align:center;flex-shrink:0;">' + (item.icon || '✦') + '</span>';
        row.innerHTML = iconHtml
            + '<div style="flex:1;min-width:0;">'
            + '<div style="color:var(--text-primary);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (item.status || '—') + '</div>'
            + (item.label ? '<div style="color:var(--accent-color);font-size:10px;letter-spacing:1.5px;margin-top:2px;opacity:0.8;">' + item.label + '</div>' : '')
            + '</div>'
            + '<button onclick="removeAnnStatusPoolItem(' + idx + ')" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:14px;padding:3px 5px;border-radius:6px;opacity:0.6;transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">✕</button>';
        listEl.appendChild(row);
    });
};

window.addAnnStatusPoolItem = function() {
    var statusInput = document.getElementById('ann-status-pool-input');
    var labelInput = document.getElementById('ann-status-label-input');
    var iconInput = document.getElementById('ann-status-icon-input');
    var status = statusInput ? statusInput.value.trim() : '';
    var label = labelInput ? labelInput.value.trim() : '';
    var icon = iconInput ? iconInput.value.trim() : '';
    var iconImg = iconInput ? (iconInput.dataset.imgSrc || '') : '';
    if (!status && !label) { if (typeof showNotification === 'function') showNotification('请至少填写状态或标签', 'warning'); return; }
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    var entry = { status: status, label: label, icon: icon || '✦' };
    if (iconImg) entry.iconImg = iconImg;
    pool.push(entry);
    localStorage.setItem('dg_status_pool', JSON.stringify(pool));
    if (statusInput) statusInput.value = '';
    if (labelInput) labelInput.value = '';
    if (iconInput) { iconInput.value = ''; delete iconInput.dataset.imgSrc; }
    renderAnnStatusPool();
    if (typeof showNotification === 'function') showNotification('已添加到随机库', 'success');
};

window.handleAnnStatusIconUpload = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
        var iconInput = document.getElementById('ann-status-icon-input');
        if (iconInput) {
            iconInput.dataset.imgSrc = ev.target.result;
            iconInput.value = '[图片]';
            iconInput.style.fontSize = '10px';
        }
    };
    reader.readAsDataURL(file);
};

window.removeAnnStatusPoolItem = function(idx) {
    var pool = [];
    try { pool = JSON.parse(localStorage.getItem('dg_status_pool') || '[]'); } catch(e2) {}
    pool.splice(idx, 1);
    localStorage.setItem('dg_status_pool', JSON.stringify(pool));
    renderAnnStatusPool();
};

document.addEventListener('DOMContentLoaded', function() {
    var headerInput = document.getElementById('dg-header-img-input');
    if (headerInput) {
        headerInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var data = ev.target.result;
                localStorage.setItem('dg_header_bg', data);
                var bgEl = document.getElementById('dg-header-band-bg');
                if (bgEl) { bgEl.style.backgroundImage = 'url(' + data + ')'; bgEl.classList.add('has-img'); }
            };
            reader.readAsDataURL(file);
        });
    }
    var decoInput = document.getElementById('dg-deco-img-input');
    if (decoInput) {
        decoInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(ev) {
                var data = ev.target.result;
                var customData = {};
                try { customData = JSON.parse(localStorage.getItem('dg_custom_data') || '{}'); } catch(ex) {}
                customData.decoImg = data;
                localStorage.setItem('dg_custom_data', JSON.stringify(customData));
                var prev = document.getElementById('dg-deco-preview');
                var prevImg = document.getElementById('dg-deco-preview-img');
                if (prev && prevImg) { prevImg.src = data; prev.style.display = 'block'; }
            };
            reader.readAsDataURL(file);
        });
    }
});

window.updateDynamicNames = function() {
    try {
        var pName = (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
        var mName = (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';

        var tabPartner = document.getElementById('mood-tab-partner');
        if (tabPartner) tabPartner.textContent = pName + '的记录';
        var tabMe = document.getElementById('mood-tab-me');
        if (tabMe) tabMe.textContent = mName + '的记录';

        var detailPartnerTitle = document.getElementById('detail-partner-title');
        if (detailPartnerTitle) detailPartnerTitle.textContent = pName + '的';

        var partnerNoRec = document.getElementById('detail-partner-no-record');
        if (partnerNoRec) {
            var msgEl = partnerNoRec;
            if (!msgEl.querySelector('span')) msgEl.textContent = pName + ' 这天还没有留下记录';
        }

        var editPartnerBtn = document.getElementById('edit-partner-mood');
        if (editPartnerBtn) editPartnerBtn.textContent = '修改' + pName;
        var deletePartnerBtn = document.getElementById('delete-partner-mood');
        if (deletePartnerBtn) deletePartnerBtn.textContent = '删除' + pName;

        var continueBtn = document.getElementById('continue-btn');
        if (continueBtn) continueBtn.title = '让' + pName + '继续说';

        var envInfo = document.querySelector('.env-send-info');
        if (envInfo) {
            var textNodes = Array.from(envInfo.childNodes).filter(n => n.nodeType === 3);
            textNodes.forEach(function(n) {
                if (n.textContent.includes('对方将在') || n.textContent.includes('小时内回信')) {
                    n.textContent = pName + ' 将在 10-24 小时内回信（8-12 句话）';
                }
            });
        }

        setDgLabel('dg-section-label-partner', pName + ' 今日状态');
        setDgLabel('dg-weather-label', pName + ' 的天气');
        setDgLabel('dg-status-label', pName + ' 的状态');

        var envInfoSpan = document.getElementById('env-reply-time-info');
        if (envInfoSpan) envInfoSpan.textContent = pName + ' 将在 10-24 小时内回信（8-12 句话）';

        var pokeInput = document.getElementById('poke-input');
        if (pokeInput) pokeInput.placeholder = '例如：拍了拍"' + pName + '"的肩膀';

        document.querySelectorAll('[data-name-partner]').forEach(function(el) {
            el.textContent = pName + '的记录';
        });
        document.querySelectorAll('[data-name-me]').forEach(function(el) {
            el.textContent = mName + '的记录';
        });
        document.querySelectorAll('[data-delete-partner]').forEach(function(el) {
            el.textContent = '删除' + pName;
        });
        document.querySelectorAll('[data-edit-partner]').forEach(function(el) {
            el.textContent = '修改' + pName;
        });
    } catch(e) { console.warn('updateDynamicNames error:', e); }
};
function setDgLabel(id, txt) {
    var el = document.getElementById(id);
    if (el && el.tagName !== 'INPUT') el.textContent = txt;
}

window.closeDailyGreeting = function() {
    try {
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                modal.classList.add('hidden');
                modal.style.opacity = '';
                modal.style.transition = '';
            }, 320);
        }
        localStorage.setItem('dailyGreetingShown', new Date().toDateString());
    } catch(e) {}
};

window.reopenDailyGreeting = function() {
    try {
        if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.classList.remove('hidden');
            requestAnimationFrame(function() {
                modal.style.transition = 'opacity 0.3s ease';
                modal.style.opacity = '1';
            });
        }
    } catch(e) {}
};

window.tryShowDailyGreeting = function() {
    try {
        if (localStorage.getItem('dailyGreetingShown') === new Date().toDateString()) return;

        var now = new Date();
        var todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
        var moodDataRaw = window.moodData || {};
        var todayMood = moodDataRaw[todayStr];

        if (!todayMood || !todayMood.partner) {
            setTimeout(function() {
                var refreshedMood = (window.moodData || {})[todayStr];
                _buildDailyGreeting(); 
                var modal = document.getElementById('daily-greeting-modal');
                if (modal) modal.classList.remove('hidden');
                localStorage.setItem('dailyGreetingShown', new Date().toDateString());
            }, 45000);
            return;
        }

        _buildDailyGreeting();
        var modal = document.getElementById('daily-greeting-modal');
        if (modal) modal.classList.remove('hidden');
    } catch(e) { console.warn('Daily greeting show error:', e); }
};

(function () {
    'use strict';
    (function blockDm6CSS() {
        if (document.getElementById('dm6-style')) return; 
        var s = document.createElement('style');
        s.id = 'dm6-style'; 
        s.textContent = '/* dm6-style blocked by data-modal v9 */';
        document.head.appendChild(s);
    })();

    var INNER_HTML =
        '<div class="dm-topbar">'
        +   '<div class="dm-topbar-left">'
        +     '<button class="dm-topbar-back" id="back-data"><i class="fas fa-arrow-left"></i></button>'
        +     '<span class="dm-topbar-title">数据管理</span>'
        +   '</div>'
        +   '<button class="dm-topbar-close" id="close-data"><i class="fas fa-xmark"></i></button>'
        + '</div>'

        + '<div class="dm-body">'

        +   '<div class="dm-storage-card">'
        +     '<div class="dm-storage-header">'
        +       '<span class="dm-storage-title"><i class="fas fa-database" style="margin-right:5px;opacity:0.55"></i>存储用量</span>'
        +       '<span class="dm-storage-label" id="dm-storage-total">计算中…</span>'
        +     '</div>'
        +     '<div class="dm-stats-grid">'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:var(--accent-color)"><i class="fas fa-comments"></i></div><div class="dm-stat-pill-val" id="dm-stat-msgs">—</div><div class="dm-stat-pill-key">聊天记录</div></div>'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:#9C6FD4"><i class="fas fa-sliders"></i></div><div class="dm-stat-pill-val" id="dm-stat-settings">—</div><div class="dm-stat-pill-key">设置数据</div></div>'
        +       '<div class="dm-stat-block"><div class="dm-stat-block-icon" style="color:#3BC8A4"><i class="fas fa-images"></i></div><div class="dm-stat-pill-val" id="dm-stat-media">—</div><div class="dm-stat-pill-key">图片媒体</div></div>'
        +     '</div>'
        +     '<div class="dm-progress-track"><div class="dm-progress-fill" id="dm-storage-bar" style="width:0%"></div></div>'
        +   '</div>'

        +   '<div class="dm-section-label"><i class="fas fa-comments"></i> 会话与记录</div>'
        +   '<div class="dm-row-card">'
        +     '<div class="dm-row-item" id="dm-session-manager" style="cursor:pointer">'
        +       '<div class="dm-row-icon violet"><i class="fas fa-comments"></i></div>'
        +       '<div class="dm-row-info"><div class="dm-row-title">会话管理</div><div class="dm-row-desc">新建、切换或整理聊天会话</div></div>'
        +       '<button class="dm-nav-btn" aria-label="打开会话管理"><i class="fas fa-chevron-right"></i></button>'
        +     '</div>'
        +   '</div>'

        +   '<div class="dm-section-label"><i class="fas fa-cloud-upload-alt"></i> 备份与恢复</div>'
        +   '<div class="dm-grid">'
        +     '<div class="dm-tile" id="dm-tile-full-backup">'
        +       '<div class="dm-tile-icon blue"><i class="fas fa-layer-group"></i></div>'
        +       '<div class="dm-tile-info"><div class="dm-tile-title">全量备份</div><div class="dm-tile-desc">所有设置与数据</div></div>'
        +       '<i class="fas fa-chevron-right dm-tile-arrow"></i>'
        +     '</div>'
        +     '<div class="dm-tile" id="dm-tile-chat-backup">'
        +       '<div class="dm-tile-icon teal"><i class="fas fa-comments"></i></div>'
        +       '<div class="dm-tile-info"><div class="dm-tile-title">聊天记录</div><div class="dm-tile-desc">消息内容单独备份</div></div>'
        +       '<i class="fas fa-chevron-right dm-tile-arrow"></i>'
        +     '</div>'
        +   '</div>'

        +   '<div style="display:none">'
        +     '<button id="export-all-settings"></button>'
        +     '<button id="import-all-settings"></button>'
        +     '<button id="export-chat-btn"></button>'
        +     '<button id="import-chat-btn"></button>'
        +   '</div>'

        +   '<div class="dm-section-label"><i class="fas fa-bell"></i> 通知与关于</div>'
        +   '<div class="dm-row-card">'
        +     '<div class="dm-row-item">'
        +       '<div class="dm-row-icon amber"><i class="fas fa-bell"></i></div>'
        +       '<div class="dm-row-info"><div class="dm-row-title">后台消息推送</div><div class="dm-row-desc" id="notif-status-text">收到新消息时弹出提醒</div></div>'
        +       '<label class="dm-toggle-pill"><input type="checkbox" id="notif-permission-toggle" onchange="handleNotifToggle(this)"><span class="dm-toggle-slider"></span></label>'
        +     '</div>'
        +     '<div class="dm-row-item" id="replay-tutorial-btn-row" style="cursor:pointer">'
        +       '<div class="dm-row-icon slate"><i class="fas fa-compass"></i></div>'
        +       '<div class="dm-row-info"><div class="dm-row-title">重放新手引导</div><div class="dm-row-desc">重新播放功能介绍教程</div></div>'
        +       '<button class="dm-nav-btn" id="replay-tutorial-btn"><i class="fas fa-play"></i></button>'
        +     '</div>'
        +     '<div class="dm-row-item" id="open-credits-row" style="cursor:pointer">'
        +       '<div class="dm-row-icon violet"><i class="fas fa-scroll"></i></div>'
        +       '<div class="dm-row-info"><div class="dm-row-title">声明与致谢</div><div class="dm-row-desc">开源声明、致谢名单</div></div>'
        +       '<button class="dm-nav-btn" id="open-credits-btn"><i class="fas fa-chevron-right"></i></button>'
        +     '</div>'
        +   '</div>'

        +   '<div class="dm-section-label danger-label"><i class="fas fa-triangle-exclamation"></i> 危险操作</div>'
        +   '<div class="dm-danger-cards dm-danger-cards-row">'
        +     '<button class="dm-danger-card dm-danger-card-orange dm-danger-card-half" id="clear-chat-only">'
        +       '<div class="dm-danger-card-icon"><i class="fas fa-eraser"></i></div>'
        +       '<div class="dm-danger-card-body">'
        +         '<div class="dm-danger-card-title">清除会话</div>'
        +         '<div class="dm-danger-card-desc">删除本会话消息</div>'
        +       '</div>'
        +     '</button>'
        +     '<button class="dm-danger-card dm-danger-card-red dm-danger-card-half" id="clear-storage">'
        +       '<div class="dm-danger-card-icon"><i class="fas fa-skull-crossbones"></i></div>'
        +       '<div class="dm-danger-card-body">'
        +         '<div class="dm-danger-card-title">重置数据</div>'
        +         '<div class="dm-danger-card-desc">清空所有，不可撤销</div>'
        +       '</div>'
        +     '</button>'
        +   '</div>'
// 在危险操作区域后面添加
    +   '<div class="dm-section-label" style="margin-top:16px;"><i class="fas fa-gift"></i> 礼物盲盒</div>'
    +   '<div class="dm-danger-cards dm-danger-cards-row">'
    +     '<button class="dm-danger-card dm-danger-card-orange dm-danger-card-half" id="reset-gift-count-btn">'
    +       '<div class="dm-danger-card-icon"><i class="fas fa-sync-alt"></i></div>'
    +       '<div class="dm-danger-card-body">'
    +         '<div class="dm-danger-card-title">重置今日礼物计数</div>'
    +         '<div class="dm-danger-card-desc">今日可再次收到礼物</div>'
    +       '</div>'
    +     '</button>'
    +     '<button class="dm-danger-card dm-danger-card-orange dm-danger-card-half" id="force-send-gift-btn">'
    +       '<div class="dm-danger-card-icon"><i class="fas fa-gift"></i></div>'
    +       '<div class="dm-danger-card-body">'
    +         '<div class="dm-danger-card-title">立即发送礼物</div>'
    +         '<div class="dm-danger-card-desc">立刻随机赠送一个礼物</div>'
    +       '</div>'
    +     '</button>'
    +   '</div>'
        + '</div>'
        ;

    var DRAWER_FULL_HTML =
        '<div class="dm-action-drawer" id="dm-drawer-full">'
        +   '<div class="dm-drawer-backdrop" id="dm-drawer-full-backdrop"></div>'
        +   '<div class="dm-drawer-sheet">'
        +     '<div class="dm-drawer-handle"></div>'
        +     '<div class="dm-drawer-title">'
        +       '<div class="dm-drawer-title-icon blue" style="background:linear-gradient(135deg,#4A90E2,#3576C8);color:#fff"><i class="fas fa-layer-group"></i></div>'
        +       '<div><div class="dm-drawer-title-text">全量备份</div><div class="dm-drawer-subtitle">包含所有设置、外观、字卡等数据</div></div>'
        +     '</div>'
        +     '<div class="dm-drawer-actions">'
        +       '<button class="dm-drawer-action-btn primary" id="export-all-settings-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-download"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导出备份</div><div class="dm-drawer-btn-desc">将数据保存为文件</div></div>'
        +       '</button>'
        +       '<button class="dm-drawer-action-btn" id="import-all-settings-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-upload"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">从文件恢复</div><div class="dm-drawer-btn-desc">选择之前导出的备份文件</div></div>'
        +       '</button>'
        +     '</div>'
        +     '<button class="dm-drawer-cancel" id="dm-drawer-full-cancel">取消</button>'
        +   '</div>'
        + '</div>';

    var DRAWER_CHAT_HTML =
        '<div class="dm-action-drawer" id="dm-drawer-chat">'
        +   '<div class="dm-drawer-backdrop" id="dm-drawer-chat-backdrop"></div>'
        +   '<div class="dm-drawer-sheet">'
        +     '<div class="dm-drawer-handle"></div>'
        +     '<div class="dm-drawer-title">'
        +       '<div class="dm-drawer-title-icon" style="background:linear-gradient(135deg,#3BC8A4,#20A882);color:#fff"><i class="fas fa-comments"></i></div>'
        +       '<div><div class="dm-drawer-title-text">聊天记录</div><div class="dm-drawer-subtitle">仅包含消息内容</div></div>'
        +     '</div>'
        +     '<div class="dm-drawer-actions">'
        +       '<button class="dm-drawer-action-btn primary" id="export-chat-btn-real" style="background:linear-gradient(135deg,#3BC8A4,#20A882);border-color:#3BC8A4">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-download"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导出聊天</div><div class="dm-drawer-btn-desc">将消息记录保存为文件</div></div>'
        +       '</button>'
        +       '<button class="dm-drawer-action-btn" id="import-chat-btn-real">'
        +         '<div class="dm-drawer-btn-icon"><i class="fas fa-upload"></i></div>'
        +         '<div class="dm-drawer-btn-text"><div class="dm-drawer-btn-title">导入聊天</div><div class="dm-drawer-btn-desc">从文件恢复历史消息</div></div>'
        +       '</button>'
        +     '</div>'
        +     '<button class="dm-drawer-cancel" id="dm-drawer-chat-cancel">取消</button>'
        +   '</div>'
        + '</div>';

    function isCorrect(mc) {
        return mc.querySelector('.dm-topbar') !== null
            && mc.querySelector('.dm-storage-card') !== null
            && mc.querySelector('.dm6') === null
            && mc.querySelector('.dm6-tabs') === null;
    }

    function ensureDrawersOnBody() {
        var DRAWER_IDS = ['dm-drawer-full', 'dm-drawer-chat'];
        DRAWER_IDS.forEach(function(id) {
            var existing = document.getElementById(id);
            if (existing && existing.parentElement === document.body) return;
            if (existing) {
                document.body.appendChild(existing);
                return;
            }
            var dummy = document.createElement('div');
            if (id === 'dm-drawer-full') dummy.innerHTML = DRAWER_FULL_HTML;
            else dummy.innerHTML = DRAWER_CHAT_HTML;
            document.body.appendChild(dummy.firstElementChild);
        });
    }

    function writeHTML(mc) {
        mc.innerHTML = INNER_HTML;
        mc.dataset.dm6Built = 'v9'; 
        ensureDrawersOnBody();
        bindAll(mc);
    }

    function ensureHTML(mc) {
        if (!mc) return;
        mc.dataset.dm6Built = 'v9'; 
        if (!isCorrect(mc)) writeHTML(mc);
        else ensureDrawersOnBody(); 
    }

    function fmt(b) {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(2) + ' MB';
    }

    function applyStats(total, msgs, cfg, media) {
        var pct = Math.min(100, total / (5 * 1024 * 1024) * 100);
        var g = function (id) { return document.getElementById(id); };
        var bar = g('dm-storage-bar');
        if (bar) {
            bar.style.width = pct.toFixed(1) + '%';
            bar.style.background = pct > 80
                ? 'linear-gradient(90deg,#FF3B30,#CC0000)'
                : pct > 50
                ? 'linear-gradient(90deg,#FF9F0A,#E07000)'
                : 'linear-gradient(90deg,var(--accent-color),rgba(var(--accent-color-rgb),0.6))';
        }
        if (g('dm-storage-total')) g('dm-storage-total').textContent = fmt(total) + ' / ~5 MB';
        if (g('dm-stat-msgs'))     g('dm-stat-msgs').textContent     = fmt(msgs);
        if (g('dm-stat-settings')) g('dm-stat-settings').textContent = fmt(cfg);
        if (g('dm-stat-media'))    g('dm-stat-media').textContent    = fmt(media);
    }

    function updateStats() {
        var total = 0, msgs = 0, cfg = 0, media = 0;
        var processLS = function () {
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i) || '';
                var v = localStorage.getItem(k) || '';
                var bytes = (k.length + v.length) * 2;
                total += bytes;
                if (/messages|msgs|session/i.test(k)) msgs += bytes;
                else if (v.startsWith('data:image') || v.startsWith('data:video')) media += bytes;
                else cfg += bytes;
            }
            applyStats(total, msgs, cfg, media);
        };
        try {
            if (window.localforage) {
                localforage.keys().then(function (keys) {
                    var promises = keys.map(function (k) {
                        return localforage.getItem(k).then(function (raw) {
                            if (raw == null) return { k: k, b: 0 };
                            var str = typeof raw === 'string' ? raw : JSON.stringify(raw);
                            return { k: k, b: (k.length + str.length) * 2 };
                        });
                    });
                    Promise.all(promises).then(function (results) {
                        results.forEach(function (r) {
                            total += r.b;
                            if (/messages|msgs|session/i.test(r.k)) msgs += r.b;
                            else if (/avatar|image|photo|bg|background|wallpaper/i.test(r.k)) media += r.b;
                            else cfg += r.b;
                        });
                        applyStats(total, msgs, cfg, media);
                    }).catch(processLS);
                }).catch(processLS);
            } else { processLS(); }
        } catch (e) { processLS(); }
    }

    function syncToggles() {
        var n = document.getElementById('notif-permission-toggle');
        if (n) n.checked = localStorage.getItem('notifEnabled') === '1'
                        && 'Notification' in window
                        && Notification.permission === 'granted';
    }

    function openDrawer(drawerId) {
        var drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer(drawerId) {
        var drawer = document.getElementById(drawerId);
        if (!drawer) return;
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    function bindAll(mc) {
        var closeBtn = mc.querySelector('#close-data');
        if (closeBtn) closeBtn.addEventListener('click', function () {
            var modal = document.getElementById('data-modal');
            if (modal && typeof hideModal === 'function') hideModal(modal);
        });

        var backBtn = mc.querySelector('#back-data');
        if (backBtn) backBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            var settingsModal = document.getElementById('settings-modal');
            if (settingsModal && typeof showModal === 'function') showModal(settingsModal);
        });

        var sessionManagerBtn = mc.querySelector('#dm-session-manager');
        if (sessionManagerBtn) sessionManagerBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            if (typeof renderSessionList === 'function') renderSessionList();
            var sessionModal = document.getElementById('session-modal');
            if (sessionModal && typeof showModal === 'function') showModal(sessionModal);
        });

        var tileFullBackup = mc.querySelector('#dm-tile-full-backup');
        if (tileFullBackup) tileFullBackup.addEventListener('click', function () { openDrawer('dm-drawer-full'); });

        var tileChatBackup = mc.querySelector('#dm-tile-chat-backup');
        if (tileChatBackup) tileChatBackup.addEventListener('click', function () { openDrawer('dm-drawer-chat'); });

        var fullDrawer = document.getElementById('dm-drawer-full');
        if (fullDrawer) {
            var backdrop1 = fullDrawer.querySelector('#dm-drawer-full-backdrop');
            if (backdrop1) backdrop1.addEventListener('click', function () { closeDrawer('dm-drawer-full'); });
            var cancelBtn1 = fullDrawer.querySelector('#dm-drawer-full-cancel');
            if (cancelBtn1) cancelBtn1.addEventListener('click', function () { closeDrawer('dm-drawer-full'); });
            var exportAllReal = fullDrawer.querySelector('#export-all-settings-real');
            if (exportAllReal) exportAllReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-full');
                if (typeof exportAllData === 'function') exportAllData();
            });
            var importAllReal = fullDrawer.querySelector('#import-all-settings-real');
            if (importAllReal) importAllReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-full');
                var inp = document.createElement('input');
                inp.type = 'file';
                    inp.accept = '*/*';          // 修改为接受所有文件
                    inp.onchange = function (e) {
                        var f = e.target.files && e.target.files[0];
                        if (!f) return;
                        if (!f.name.toLowerCase().endsWith('.json')) {
                            showNotification('请选择 .json 格式的备份文件', 'error');
                            return;
                        }
                        if (typeof importAllData === 'function') importAllData(f);
                    };
                    inp.click();
            });
        }

        var chatDrawer = document.getElementById('dm-drawer-chat');
        if (chatDrawer) {
            var backdrop2 = chatDrawer.querySelector('#dm-drawer-chat-backdrop');
            if (backdrop2) backdrop2.addEventListener('click', function () { closeDrawer('dm-drawer-chat'); });
            var cancelBtn2 = chatDrawer.querySelector('#dm-drawer-chat-cancel');
            if (cancelBtn2) cancelBtn2.addEventListener('click', function () { closeDrawer('dm-drawer-chat'); });
            var exportChatReal = chatDrawer.querySelector('#export-chat-btn-real');
            if (exportChatReal) exportChatReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-chat');
                if (typeof exportChatHistory === 'function') exportChatHistory();
            });
            var importChatReal = chatDrawer.querySelector('#import-chat-btn-real');
            if (importChatReal) importChatReal.addEventListener('click', function () {
                closeDrawer('dm-drawer-chat');
                var inp = document.createElement('input');
               inp.type = 'file';
                   inp.accept = '*/*';          // 修改为接受所有文件
                   inp.onchange = function (e) {
                       var f = e.target.files && e.target.files[0];
                       if (!f) return;
                       if (!f.name.toLowerCase().endsWith('.json')) {
                           showNotification('请选择 .json 格式的备份文件', 'error');
                           return;
                       }
                       if (typeof importAllData === 'function') importAllData(f);
                   };
                   inp.click();
            });
        }

        var clearChatBtn = mc.querySelector('#clear-chat-only');
        if (clearChatBtn) clearChatBtn.addEventListener('click', function () {
            if (!confirm('确定要清除当前会话的所有消息吗？\n\n所有设置、头像、字卡等数据将保留，仅聊天记录会被删除。\n\n此操作无法恢复！')) return;
            // 修复：直接赋值 let messages（window.messages 赋值不影响 let 绑定）
            messages = [];
            displayedMessageCount = typeof HISTORY_BATCH_SIZE !== 'undefined' ? HISTORY_BATCH_SIZE : 20;
            try { localStorage.removeItem('BACKUP_V1_critical'); } catch(e) {}
            try { localStorage.removeItem('BACKUP_V1_timestamp'); } catch(e) {}
            if (window.localforage && typeof getStorageKey === 'function') {
                localforage.setItem(getStorageKey('chatMessages'), []).catch(function() {});
            }
            if (typeof renderMessages === 'function') renderMessages();
            if (typeof showNotification === 'function') showNotification('聊天记录已清除', 'success');
        });

        var clearBtn = mc.querySelector('#clear-storage');
        if (clearBtn) clearBtn.addEventListener('click', function () {
            if (!confirm('⚠️ 确定要清空全部数据吗？\n\n所有消息、设置、字卡、头像等将被永久删除，不可恢复！')) return;
            if (!confirm('最后确认：清空后页面将自动刷新，无法撤销，继续吗？')) return;
            window._skipBackup = true;
            var doReset = function () {
                localStorage.clear();
                if (typeof showNotification === 'function') showNotification('所有数据已清空，即将刷新…', 'info', 2000);
                setTimeout(function () { window.location.href = window.location.pathname + '?reset=' + Date.now(); }, 2000);
            };
            window.localforage ? localforage.clear().then(doReset).catch(doReset) : doReset();
        });
// 新增：重置今日礼物计数
var resetGiftBtn = mc.querySelector('#reset-gift-count-btn');
if (resetGiftBtn) {
    resetGiftBtn.addEventListener('click', function() {
        if (confirm('确定要重置今日礼物计数吗？\n\n重置后，今日可以继续收到新的随机礼物。\n此操作不会删除已收到的礼物记录。')) {
            localStorage.removeItem('gift_daily_count');
            if (typeof showNotification === 'function') {
                showNotification('✅ 今日礼物计数已重置，梦角可以继续送你礼物啦 ', 'success', 3000);
            }
        }
    });
}

// 新增：立即发送礼物
var forceSendBtn = mc.querySelector('#force-send-gift-btn');
if (forceSendBtn) {
    forceSendBtn.addEventListener('click', function() {
        if (confirm('确定要立即发送一个随机礼物吗？\n\n此操作会立即生成一份礼物并出现在聊天记录中。')) {
            if (typeof window.sendRandomGift === 'function') {
                window.sendRandomGift();
                if (typeof showNotification === 'function') {
                    showNotification(' 礼物已随机送出，快去聊天区看看吧~', 'success', 3000);
                }
            } else {
                if (typeof showNotification === 'function') {
                    showNotification('礼物功能未初始化，请刷新页面重试', 'error');
                }
            }
        }
    });
}
        var exportAll = mc.querySelector('#export-all-settings');
        if (exportAll) exportAll.addEventListener('click', function () {
            if (typeof exportAllData === 'function') exportAllData();
        });

        var importAll = mc.querySelector('#import-all-settings');
        if (importAll) importAll.addEventListener('click', function () {
            var inp = document.createElement('input');
            inp.type = 'file';
                inp.accept = '*/*';          // 修改为接受所有文件
                inp.onchange = function (e) {
                    var f = e.target.files && e.target.files[0];
                    if (!f) return;
                    if (!f.name.toLowerCase().endsWith('.json')) {
                        showNotification('请选择 .json 格式的备份文件', 'error');
                        return;
                    }
                    if (typeof importAllData === 'function') importAllData(f);
                };
                inp.click();
        });

        var exportChat = mc.querySelector('#export-chat-btn');
        if (exportChat) exportChat.addEventListener('click', function () {
            if (typeof exportChatHistory === 'function') exportChatHistory();
        });

        var importChat = mc.querySelector('#import-chat-btn');
        if (importChat) importChat.addEventListener('click', function () {
            var inp = document.createElement('input');
           inp.type = 'file';
               inp.accept = '*/*';          // 修改为接受所有文件
               inp.onchange = function (e) {
                   var f = e.target.files && e.target.files[0];
                   if (!f) return;
                   if (!f.name.toLowerCase().endsWith('.json')) {
                       showNotification('请选择 .json 格式的备份文件', 'error');
                       return;
                   }
                   if (typeof importAllData === 'function') importAllData(f);
               };
               inp.click();
        });

        var creditsBtn = mc.querySelector('#open-credits-btn');
        if (creditsBtn) creditsBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            var disc = document.getElementById('disclaimer-modal');
            if (disc && typeof showModal === 'function') showModal(disc);
        });

        var tutorialBtn = mc.querySelector('#replay-tutorial-btn');
        if (tutorialBtn) tutorialBtn.addEventListener('click', function () {
            var dataModal = document.getElementById('data-modal');
            if (dataModal && typeof hideModal === 'function') hideModal(dataModal);
            if (typeof startTour === 'function') {
                if (window.localforage && window.APP_PREFIX) {
                    localforage.removeItem(APP_PREFIX + 'tour_seen').then(startTour).catch(startTour);
                } else { startTour(); }
            }
        });
    }

    function onModalOpen(modal) {
        var mc = modal.querySelector('.modal-content');
        if (!mc) return;
        ensureHTML(mc);
        requestAnimationFrame(function () {
            mc.style.opacity = '1';
            mc.style.transform = 'none';
        });
        setTimeout(function () {
            updateStats();
            syncToggles();
        }, 60);
    }

    var _styleObserver = null;
    var _contentObserver = null;

    function init() {
        var modal = document.getElementById('data-modal');
        if (!modal) return;

        var mc = modal.querySelector('.modal-content');
        if (mc) mc.dataset.dm6Built = 'v9';

        if (_styleObserver) { _styleObserver.disconnect(); _styleObserver = null; }
        if (_contentObserver) { _contentObserver.disconnect(); _contentObserver = null; }

        _styleObserver = new MutationObserver(function () {
            var d = modal.style.display;
            if (d === 'flex' || d === 'block') onModalOpen(modal);
        });
        _styleObserver.observe(modal, { attributes: true, attributeFilter: ['style'] });

        if (mc) {
            _contentObserver = new MutationObserver(function () {
                var mc2 = modal.querySelector('.modal-content');
                if (mc2 && !isCorrect(mc2)) {
                    mc2.dataset.dm6Built = 'v9';
                    writeHTML(mc2);
                }
            });
            _contentObserver.observe(mc, { childList: true, subtree: false });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
    } else {
        init();
    }

})();

function updateStorageUsageBar() {
    var bar   = document.getElementById('dm-storage-bar')   || document.getElementById('storage-usage-fill');
    var text  = document.getElementById('dm-storage-total') || document.getElementById('storage-usage-text');
    if (!bar && !text) return;

    try {
        if (window.localforage && window.APP_PREFIX) {
            localforage.keys().then(function(keys) {
                var promises = keys.map(function(k) {
                    return localforage.getItem(k).then(function(v) {
                        if (v === null || v === undefined) return 0;
                        var str = typeof v === 'string' ? v : JSON.stringify(v);
                        return (k.length + str.length) * 2;
                    });
                });
                Promise.all(promises).then(function(sizes) {
                    var total   = sizes.reduce(function(a,b){return a+b;},0);
                    var usedKB  = (total / 1024).toFixed(1);
                    var maxBytes = 5 * 1024 * 1024;
                    var pct     = Math.min(total / maxBytes * 100, 100).toFixed(1);
                    var fmt     = function(b) { return b<1024 ? b+' B' : b<1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(2)+' MB'; };

                    if (bar) {
                        bar.style.width = pct + '%';
                        if (parseFloat(pct) > 80)
                            bar.style.background = 'linear-gradient(90deg,#FF3B30,#CC0000)';
                        else if (parseFloat(pct) > 50)
                            bar.style.background = 'linear-gradient(90deg,#FF9F0A,#E07000)';
                        else
                            bar.style.background = 'linear-gradient(90deg,var(--accent-color),rgba(var(--accent-color-rgb),0.6))';
                    }
                    if (text) text.textContent = fmt(total) + ' / ~5 MB (' + pct + '%)';
                });
            }).catch(function() {
                var ls = 0;
                for (var i = 0; i < localStorage.length; i++) {
                    var k = localStorage.key(i) || '';
                    var v = localStorage.getItem(k) || '';
                    ls += (k.length + v.length) * 2;
                }
                var pct = Math.min(ls / (5*1024*1024) * 100, 100).toFixed(1);
                if (bar) bar.style.width = pct + '%';
                if (text) text.textContent = (ls/1024).toFixed(1) + ' KB (localStorage)';
            });
        } else {
            if (text) text.textContent = '暂无数据';
            if (bar)  bar.style.width  = '0%';
        }
    } catch(e) {
        if (text) text.textContent = '无法读取';
    }
}

(function() {
    var orig = window.showModal;
    if (typeof orig === 'function') {
        window.showModal = function(el) {
            orig.apply(this, arguments);
            if (el && el.id === 'data-modal') {
                setTimeout(updateStorageUsageBar, 250);
            }
        };
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('data-settings');
    if (btn) {
        btn.addEventListener('click', function() { setTimeout(updateStorageUsageBar, 350); });
    }
});

window._sendPartnerNotification = function(title, body) {
    try {
        if (localStorage.getItem('notifEnabled') !== '1') return;

        // ★ 如果在 5+ App 环境，用 plus.push 创建本地通知
        if (window.plus && plus.push) {
            plus.push.createMessage(
                title + ': ' + (body || ''),
                'partner-msg',
                { cover: false }      // cover=false 表示不覆盖之前的通知
            );
            return;
        }

        // ★ 否则降级回浏览器 Notification（PC/普通浏览器）
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;

        var notif = new Notification(title || '传讯', {
            body: body || '对方发来了消息',
            icon: (document.querySelector('#partner-avatar img') || {}).src,
            tag: 'partner-msg',
            renotify: true
        });

        // 点击通知回到网页
        notif.onclick = function(e) {
            e.preventDefault();
            window.focus();
            window.blur();
            window.focus();
            notif.close();
        };
    } catch(e) {}
};

window.handleNotifToggle = function(checkbox) {
    var statusEl = document.getElementById('notif-status-text');
        // ★ 在 5+ App 中，直接允许开启，不需要浏览器权限
        if (window.plus && plus.push) {
            if (checkbox.checked) {
                if (statusEl) statusEl.textContent = '✅ 消息推送已开启';
                localStorage.setItem('notifEnabled', '1');
            } else {
                if (statusEl) statusEl.textContent = '消息推送已关闭';
                localStorage.setItem('notifEnabled', '0');
            }
            return;
        }
        // ★ 以下保留原来的浏览器通知逻辑（PC/普通浏览器）
        if (!('Notification' in window)) {
            checkbox.checked = false;
            if (statusEl) statusEl.textContent = '⚠️ 您的浏览器不支持通知功能，请更换浏览器';
            return;
        }
    if (checkbox.checked) {
        Notification.requestPermission().then(function(perm) {
            if (perm === 'granted') {
                if (statusEl) statusEl.textContent = '✅ 已开启 — 当页面在后台时，收到消息会弹出系统通知';
                localStorage.setItem('notifEnabled', '1');
                try { new Notification('传讯通知已开启 ✨', { body: '你现在可以在后台收到消息提醒了', tag: 'notif-test' }); } catch(e) {}
            } else if (perm === 'denied') {
                checkbox.checked = false;
                if (statusEl) statusEl.textContent = '❌ 权限被拒绝，请自行搜索如何开启';
                localStorage.setItem('notifEnabled', '0');
            } else {
                checkbox.checked = false;
                if (statusEl) statusEl.textContent = '⚠️ 未做出选择，请重试';
                localStorage.setItem('notifEnabled', '0');
            }
        }).catch(function() {
            checkbox.checked = false;
            if (statusEl) statusEl.textContent = '❌ 请求权限失败，请自行搜索如何打开';
            localStorage.setItem('notifEnabled', '0');
        });
    } else {
        if (statusEl) statusEl.textContent = '已关闭 — 后台将不再弹出消息提醒';
        localStorage.setItem('notifEnabled', '0');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    var toggle   = document.getElementById('notif-permission-toggle');
    var statusEl = document.getElementById('notif-status-text');
    if (!toggle) return;
    var enabled = localStorage.getItem('notifEnabled') === '1';
    var granted = ('Notification' in window) && Notification.permission === 'granted';
    toggle.checked = enabled && granted;
    if (!statusEl) return;
    if (toggle.checked) {
        statusEl.textContent = '✅ 已开启 — 当页面在后台时，收到消息会弹出系统通知';
    } else if ('Notification' in window && Notification.permission === 'denied') {
        statusEl.textContent = '❌ 通知权限已被浏览器屏蔽，请自行搜索如何开启';
    } else {
        statusEl.textContent = '关闭状态 — 开启后可在后台接收消息提醒';
    }
});

(function() {
    var TI_AVATAR_KEY = 'tiSettings_showAvatar';
    var TI_TEXT_KEY = 'tiSettings_customText';
    var tiShowAvatar = localStorage.getItem(TI_AVATAR_KEY) !== 'false';
    var tiCustomText = localStorage.getItem(TI_TEXT_KEY) || '';

    function applyTiAvatarVisibility() {
        var avatarEl = document.getElementById('typing-indicator-avatar');
        if (!avatarEl) return;
        avatarEl.style.display = tiShowAvatar ? '' : 'none';
    }

    function getTiLabel() {
        if (tiCustomText) return tiCustomText;
        var name = (window.settings && settings.partnerName) ? settings.partnerName : '对方';
        return name + ' 正在输入';
    }

    function updatePreview() {
        var previewText = document.getElementById('ti-preview-text');
        var previewAvatar = document.getElementById('ti-preview-avatar');
        if (previewText) previewText.textContent = getTiLabel();
        if (previewAvatar) previewAvatar.style.display = tiShowAvatar ? '' : 'none';
        var label = document.getElementById('typing-indicator-label');
        if (label && label.textContent) label.textContent = getTiLabel();
        var actualAvatar = document.getElementById('typing-indicator-avatar');
        if (actualAvatar) actualAvatar.style.display = tiShowAvatar ? '' : 'none';
    }

    function syncPillUI() {
        var row = document.getElementById('ti-avatar-toggle');
        if (!row) return;
        if (tiShowAvatar) {
            row.classList.add('active');
        } else {
            row.classList.remove('active');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        applyTiAvatarVisibility();
    });

    var _origSetLabel = null;
    function patchTypingLabel() {
        var label = document.getElementById('typing-indicator-label');
        if (label && tiCustomText) {
            label.textContent = tiCustomText;
        }
    }
    var labelEl = null;
    function initLabelObserver() {
        labelEl = document.getElementById('typing-indicator-label');
        if (!labelEl || labelEl._tiObserved) return;
        labelEl._tiObserved = true;
        var obs = new MutationObserver(function() {
            if (tiCustomText && labelEl.textContent !== tiCustomText) {
                labelEl.textContent = tiCustomText;
            }
        });
        obs.observe(labelEl, { childList: true, characterData: true, subtree: true });
    }
    setTimeout(initLabelObserver, 1000);

    document.addEventListener('click', function(e) {
        var ti = e.target.closest('.typing-indicator');
        if (!ti) return;
        e.stopPropagation();
        initLabelObserver();
        var modal = document.getElementById('ti-settings-modal');
        if (!modal) return;
        var input = document.getElementById('ti-text-input');
        if (input) input.value = tiCustomText;
        syncPillUI();
        updatePreview();
        var partnerImg = document.querySelector('#partner-info .message-avatar img') ||
                         document.querySelector('.partner-avatar img') ||
                         document.querySelector('[id*="partner"] img');
        var previewAvatar = document.getElementById('ti-preview-avatar');
        if (previewAvatar && partnerImg) {
            previewAvatar.innerHTML = '<img src="' + partnerImg.src + '" style="width:100%;height:100%;object-fit:cover;">';
        }
        modal.classList.add('open');
    });

    document.addEventListener('click', function(e) {
        var modal = document.getElementById('ti-settings-modal');
        if (!modal || !modal.classList.contains('open')) return;
        if (e.target === modal) modal.classList.remove('open');
    });
    document.addEventListener('click', function(e) {
        if (e.target.id === 'ti-settings-close-btn') {
            var modal = document.getElementById('ti-settings-modal');
            if (modal) modal.classList.remove('open');
        }
    });

    document.addEventListener('click', function(e) {
        var row = e.target.closest('#ti-avatar-toggle');
        if (!row) return;
        tiShowAvatar = !tiShowAvatar;
        localStorage.setItem(TI_AVATAR_KEY, tiShowAvatar);
        syncPillUI();
        updatePreview();
        applyTiAvatarVisibility();
    });

    document.addEventListener('click', function(e) {
        if (e.target.id !== 'ti-text-save-btn') return;
        var input = document.getElementById('ti-text-input');
        if (!input) return;
        tiCustomText = input.value.trim();
        localStorage.setItem(TI_TEXT_KEY, tiCustomText);
        updatePreview();
        e.target.textContent = '已保存 ✓';
        setTimeout(function() { e.target.textContent = '保存'; }, 1200);
    });

    document.addEventListener('click', function(e) {
        if (e.target.id !== 'ti-text-reset-btn') return;
        tiCustomText = '';
        localStorage.removeItem(TI_TEXT_KEY);
        var input = document.getElementById('ti-text-input');
        if (input) input.value = '';
        updatePreview();
    });

    document.addEventListener('DOMContentLoaded', function() { syncPillUI(); });
    setTimeout(syncPillUI, 800);
})();


(function() {
    var PLEDGE_KEY = 'splashPledgeSigned_v3';
    var TOTAL = 6;
    var PLEDGE_TEXT = '我绝不盈利、造谣、污蔑或嘲讽，并对自己的使用行为负完全责任';
    var cur = 0;

    function initSplash() {
        var splash = document.getElementById('splash-declaration');
        if (!splash) return;

        localStorage.removeItem('splashPledgeSigned_v2');
        localStorage.removeItem('splashPledgeSigned_v1');
        localStorage.removeItem('splashPledgeSigned');

        if (localStorage.getItem(PLEDGE_KEY) === 'true') {
            splash.style.display = 'none';
            return;
        }

        var starsEl = document.getElementById('splash-stars');
        if (starsEl) {
            var html = '';
            for (var i = 0; i < 70; i++) {
                var x = (Math.random() * 100).toFixed(1);
                var y = (Math.random() * 100).toFixed(1);
                var sz = Math.random() > 0.75 ? '3px' : '2px';
                var del = (Math.random() * 4).toFixed(2);
                var dur = (2 + Math.random() * 3).toFixed(1);
                html += '<span style="left:'+x+'%;top:'+y+'%;width:'+sz+';height:'+sz+';animation-delay:'+del+'s;animation-duration:'+dur+'s;"></span>';
            }
            starsEl.innerHTML = html;
        }

        var dotsEl = document.getElementById('splash-dots');
        if (dotsEl) {
            var dhtml = '';
            for (var d = 0; d < TOTAL; d++) {
                dhtml += '<div class="splash-dot'+(d===0?' active done':'')+'" data-dot="'+d+'"></div>';
            }
            dotsEl.innerHTML = dhtml;
        }

        var prevBtn   = document.getElementById('splash-prev-btn');
        var nextBtn   = document.getElementById('splash-next-btn');
        var enterBtn  = document.getElementById('splash-enter-btn');
        var pledgeInp = document.getElementById('splash-pledge-input');

        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (cur > 0) goTo(cur - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (cur < TOTAL - 1) goTo(cur + 1);
            });
        }
        if (enterBtn) {
            enterBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (enterBtn.classList.contains('ready')) enterSite();
            });
        }
        if (pledgeInp) {
            pledgeInp.addEventListener('input', function() {
                var val = pledgeInp.value;
                var hint = document.getElementById('splash-pledge-hint');
                if (val === PLEDGE_TEXT) {
                    pledgeInp.classList.add('correct');
                    if (hint) { hint.textContent = '✓ 承诺已确认，可以进入了'; hint.className = 'splash-pledge-hint ok'; }
                    if (enterBtn) enterBtn.classList.add('ready');
                } else {
                    pledgeInp.classList.remove('correct');
                    if (hint) { hint.textContent = '请完整输入上方承诺后方可进入'; hint.className = 'splash-pledge-hint'; }
                    if (enterBtn) enterBtn.classList.remove('ready');
                }
            });
            pledgeInp.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && enterBtn && enterBtn.classList.contains('ready')) {
                    enterSite();
                }
            });
        }

        if (dotsEl) {
            dotsEl.addEventListener('click', function(e) {
                var dot = e.target.closest('.splash-dot');
                if (dot) goTo(parseInt(dot.getAttribute('data-dot')));
            });
        }

        updateUI();
    }

    function goTo(idx) {
        var slides = document.querySelectorAll('.splash-slide');
        var dots   = document.querySelectorAll('.splash-dot');
        var prevIdx = cur;

        if (slides[prevIdx]) {
            slides[prevIdx].classList.remove('active');
            slides[prevIdx].classList.add('exit-left');
            var exitEl = slides[prevIdx];
            setTimeout(function() { exitEl.classList.remove('exit-left'); }, 420);
        }

        cur = idx;

        if (slides[cur]) {
            slides[cur].classList.add('active');
        }

        dots.forEach(function(dot, i) {
            dot.classList.toggle('active', i === cur);
            dot.classList.toggle('done', i < cur);
        });

        updateUI();

        if (cur === TOTAL - 1) {
            setTimeout(function() {
                var inp = document.getElementById('splash-pledge-input');
                if (inp) inp.focus();
            }, 450);
        }
    }

    function updateUI() {
        var prevBtn  = document.getElementById('splash-prev-btn');
        var nextBtn  = document.getElementById('splash-next-btn');
        var enterBtn = document.getElementById('splash-enter-btn');
        var pageNum  = document.getElementById('splash-page-num');

        if (pageNum) pageNum.textContent = (cur + 1) + ' / ' + TOTAL;
        if (prevBtn) { prevBtn.disabled = (cur === 0); }
        if (cur === TOTAL - 1) {
            if (nextBtn)  nextBtn.style.display  = 'none';
            if (enterBtn) enterBtn.style.display = '';
        } else {
            if (nextBtn)  nextBtn.style.display  = '';
            if (enterBtn) enterBtn.style.display = 'none';
        }
    }

    function enterSite() {
        localStorage.setItem(PLEDGE_KEY, 'true');
        var splash = document.getElementById('splash-declaration');
        if (splash) {
            splash.classList.add('splash-fade-out');
            setTimeout(function() { splash.style.display = 'none'; }, 950);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSplash);
    } else {
        initSplash();
    }
})();

const tourOverlay = document.getElementById('tour-overlay');
const tourPopover = document.getElementById('tour-popover');
const tourHighlightBox = document.getElementById('tour-highlight-box');
const tourTitle = document.getElementById('tour-title');
const tourContent = document.getElementById('tour-content');
const tourStepCounter = document.getElementById('tour-step-counter');
const tourNextBtn = document.getElementById('tour-next-btn');
const tourPrevBtn = document.getElementById('tour-prev-btn');
const tourSkipBtn = document.getElementById('tour-skip-btn');


let currentTourStep = 0;
let isTourActive = false;

const tourSteps = [
    {
        title: "✨ 欢迎来到「传讯」",
        content: "这里是你们专属的私密空间。<br><br>这个教程共 <b>20 步</b>，带你从头到尾认识每一个功能，建议完整看完哦🥺<br><br>点击「下一步」开始吧！",
        position: 'center'
    },
    {
        element: '#my-avatar',
        title: "📷 你的头像",
        content: "这是<b>你的头像</b>。<br><br>点击它可以上传图片作为你的头像。",
        position: 'bottom'
    },
    {
        element: '#my-name',
        title: "✏️ 你的昵称",
        content: "这里显示的是<b>你的名字</b>。<br><br>点击名字可以直接修改。",
        position: 'bottom'
    },
    {
        element: '#my-status-container',
        title: "💬 你的状态签名",
        content: "这里是你的<b>状态签名</b>。<br><br>点击可以编辑，一般而言对方是能看见的哦～",
        position: 'bottom'
    },
    {
        element: '#partner-avatar',
        title: "Ta 的头像",
        content: "这里是<b>梦角的头像</b>，同样点击可以上传更换。",
        position: 'bottom'
    },
    {
        element: '#partner-name',
        title: "Ta 的昵称",
        content: "这是<b>梦角的昵称</b>，同样点击可以修改。",
        position: 'bottom'
    },
    {
        element: '.header-motto',
        title: "🌸 顶部格言",
        content: "这里显示着格言～自定义回复里可修改。",
        position: 'bottom'
    },
    {
        element: '#message-input',
        title: "⌨️ 消息输入框",
        content: "在这里<b>输入你想说的话</b>，按回车键或点击右边的发送按钮就能发出去。",
        position: 'top'
    },
    {
        element: '#send-btn',
        title: "🚀 发送消息",
        content: "点击这个<b>纸飞机按钮</b>就能发送消息。<br><br>发送后对方会在几秒内给你回复，你可以在「聊天设置」里调整回复的速度快慢哦。",
        position: 'top'
    },
    {
        element: '#attachment-btn',
        title: "🖼️ 发送图片 / 表情包",
        content: "点击这里可以<b>发送图片</b>，支持相册图片和表情包。<br><br>你还可以在「高级功能 → 回复库」中上传自定义的表情，到时候对方也会发给你！",
        position: 'top'
    },
    {
        element: '#poke-btn',
        title: "👋 拍一拍互动",
        content: "这是「<b>拍一拍</b>」功能，发出后会显示一条互动消息，比如「轻拍了你一下」。<br><br>可以在「高级功能 → 自定义拍一拍」里添加更多的动作！",
        position: 'top'
    },
    {
        element: '#continue-btn',
        title: "让 Ta 继续说",
        content: "不知道说什么了？或者想让 Ta 多说几句？<br><br>点击这个按钮，<b>梦角会主动找你说话。",
        position: 'top'
    },
    {
        element: '#batch-btn',
        title: "📦 批量发送模式",
        content: "开启<b>批量模式</b>后，你可以先写好多条消息，再一次性全部发出去<br><br>点击按钮开启，编辑完成后再次点击「发送全部」即可。",
        position: 'top'
    },
    {
        element: '#settings-btn',
        title: "⚙️ 设置中心",
        content: "所有个性化配置都在这个<b>设置按钮</b>里，我们点进去看一下！<br>",
        position: 'bottom',
        onBefore: () => { if (isTourActive) document.querySelectorAll('.modal').forEach(m => hideModal(m)); }
    },
    {
        element: '#appearance-settings',
        title: "🎨 外观设置",
        content: "<b>外观设置</b>里可以：<br>• 切换 10 款主题配色（金/蓝/粉…）<br>• 调整字体大小<br>• 更换聊天背景图<br>• 自定义气泡样式 CSS<br>",
        position: 'bottom',
        onBefore: () => { if (isTourActive) showModal(DOMElements.settingsModal.modal); }
    },
    {
        element: '#chat-settings',
        title: "💬 聊天设置",
        content: "<b>聊天设置</b>里可以调整：<br>• 消息音效开关<br>• 已读回执显示<br>• 对方回复速度（快/慢）<br>• 消息气泡样式（圆角/方形）",
        position: 'bottom'
    },
    {
        element: '#advanced-settings',
        title: "🚀 高级功能 — 必看！",
        content: "<b>高级功能</b>是整个应用最强大的板块，里面有：<br>• <b>心晴手账</b>：记录每天的心情<br>• <b>信封投递</b>：给梦角写一封信<br>• <b>纪念日</b>：倒计时 / 纪念天数<br>• <b>运势占卜</b>：每日运势<br>• <b>自定义回复</b>：让梦角说你想听的话<br>• <b>音乐播放器</b>：背景音乐",
        position: 'bottom'
    },
    {
        element: '#data-settings',
        title: "💾 数据管理",
        content: "<b>数据管理</b>里可以：<br>• 导出聊天记录（备份到本地）<br>• 导入之前备份的记录<br>• 查看存储空间占用<br>• 开启后台消息通知推送<br>• 重置所有数据<br>• 重放本教程",
        position: 'top'
    },
    {
        element: '#theme-toggle',
        title: "🌙 日 / 夜模式切换",
        content: "这个按钮可以快速<b>切换白天 / 夜晚</b>模式。<br><br>夜晚模式下整体变成深色背景，对眼睛更友好，睡前聊天必备！✨",
        position: 'bottom',
        onBefore: () => { if (isTourActive) hideModal(DOMElements.settingsModal.modal); }
    },
    {
        element: '#favorites-btn',
        title: "⭐ 收藏夹",
        content: "长按或点击一条消息，会弹出操作菜单，可以把消息<b>收藏</b>起来。<br><br>所有收藏的消息都会保存在这个收藏夹里，随时可以翻阅回味～",
        position: 'bottom'
    },
    {
        element: '#dm-session-manager',
        title: "📂 会话管理",
        content: "你可以创建<b>多个独立的聊天会话</b>，每个会话都有独立的聊天记录。<br>",
        position: 'top',
        onBefore: () => {
            if (!isTourActive) return;
            document.querySelectorAll('.modal').forEach(m => hideModal(m));
            showModal(DOMElements.dataModal.modal);
        }
    },
    {
        title: "✋ 消息操作提示",
        content: "点击任意一条消息，会出现操作菜单：<br>• ⭐ <b>收藏</b>：保存到收藏夹<br>• ↩️ <b>回复</b>：引用这条消息回复<br>• 📝 <b>注释</b>：给消息添加备注<br>• 🗑️ <b>删除</b>：删除这条消息",
        position: 'center'
    },
    {
        title: "🎉 你已掌握所有功能！",
        content: "恭喜你完成了新手引导！现在你已经了解了「传讯」的全部功能。<br><br>希望你们在这里收获满满的爱与幸福 🥺💕",
        position: 'center'
    }
];

function startTour() {
    isTourActive = true;
    tourOverlay.style.display = 'block';
    setTimeout(() => tourOverlay.classList.add('active'), 10);
    currentTourStep = 0;
    showTourStep(currentTourStep);
}

function endTour() {
    isTourActive = false;
    tourOverlay.classList.remove('active');
    tourPopover.classList.remove('visible');
    setTimeout(() => {
        tourOverlay.style.display = 'none';
        tourHighlightBox.style.width = '0px';
        tourHighlightBox.style.height = '0px';
        tourHighlightBox.style.opacity = '0';
    }, 300);
    localforage.setItem(APP_PREFIX + 'tour_seen', 'true');
    document.querySelectorAll('.modal').forEach(m => hideModal(m));
    setTimeout(function() {
        if (typeof window.tryShowDailyGreeting === 'function') {
            window.tryShowDailyGreeting();
        }
    }, 900);
}

function showTourStep(index) {
    if (index < 0 || index >= tourSteps.length) {
        endTour();
        return;
    }
    const step = tourSteps[index];
    if (step.onBefore) {
        step.onBefore();
    }
    setTimeout(() => {
        tourTitle.textContent = step.title;
        tourContent.innerHTML = step.content;
        tourStepCounter.textContent = `${index + 1} / ${tourSteps.length}`;
        tourPopover.classList.remove('visible');
        tourPrevBtn.style.visibility = (index === 0) ? 'hidden' : 'visible';
        if (index === tourSteps.length - 1) {
            tourNextBtn.innerHTML = '完成 <i class="fas fa-check"></i>';
        } else {
            tourNextBtn.innerHTML = '下一步 <i class="fas fa-arrow-right"></i>';
        }
        const targetElement = step.element ? document.querySelector(step.element) : null;
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            tourHighlightBox.style.width = `${rect.width + 10}px`;
            tourHighlightBox.style.height = `${rect.height + 10}px`;
            tourHighlightBox.style.top = `${rect.top - 5}px`;
            tourHighlightBox.style.left = `${rect.left - 5}px`;
            tourHighlightBox.style.opacity = '1';
            positionPopover(rect, step.position);
        } else {
            tourHighlightBox.style.opacity = '0';
            tourHighlightBox.style.width = '0px';
            tourHighlightBox.style.height = '0px';
            tourPopover.style.top = '50%';
            tourPopover.style.left = '50%';
            tourPopover.style.transform = 'translate(-50%, -50%)';
        }
        setTimeout(() => tourPopover.classList.add('visible'), 50);
    }, (step.onBefore ? 400 : 0));
}

function positionPopover(rect, position) {
    const popoverRect = tourPopover.getBoundingClientRect();
    const spacing = 15;
    let top, left;
    switch (position) {
        case 'top':
            top = rect.top - popoverRect.height - spacing;
            left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
            break;
        case 'bottom':
            top = rect.bottom + spacing;
            left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - (popoverRect.height / 2);
            left = rect.left - popoverRect.width - spacing;
            break;
        case 'right':
            top = rect.top + (rect.height / 2) - (popoverRect.height / 2);
            left = rect.right + spacing;
            break;
        default:
            top = '50%';
            left = '50%';
            tourPopover.style.transform = 'translate(-50%, -50%)';
            tourPopover.style.top = top;
            tourPopover.style.left = left;
            return;
    }
    if (top < 10) top = 10;
    if (left < 10) left = 10;
    if (left + popoverRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popoverRect.width - 10;
    }
    if (top + popoverRect.height > window.innerHeight - 10) {
        top = window.innerHeight - popoverRect.height - 10;
    }
    tourPopover.style.top = `${top}px`;
    tourPopover.style.left = `${left}px`;
    tourPopover.style.transform = 'none';
}

function nextTourStep() {
    currentTourStep++;
    showTourStep(currentTourStep);
}

async function createNewSession(switchToIt = true) {
    const newId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newSession = {
        id: newId,
        name: `会话 ${new Date().toLocaleDateString()}`,
        createdAt: Date.now()
    };

    sessionList.push(newSession);
    await localforage.setItem(`${APP_PREFIX}sessionList`, sessionList);

    if (switchToIt) {
        window.location.hash = newId;
        window.location.reload();
    }
    
    return newId;
}

window.selectAnnType = function(type) {
    currentAnniversaryType = type;
    currentAnnType = type; 
    document.querySelectorAll('.anniversary-type-btn').forEach(btn => {
        if(btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const hint = document.getElementById('ann-type-desc');
    if(hint) {
        hint.textContent = type === 'anniversary' 
            ? '计算从过去某一天到现在已经过了多少天 (例如: 恋爱纪念日)' 
            : '计算从现在到未来某一天还剩下多少天 (例如: 对方生日)';
    }
};

window.deleteAnniversary = function(id, event) {
    if(event) event.stopPropagation();
    
    if(confirm('确定要删除这个纪念日吗？')) {
        anniversaries = anniversaries.filter(a => a.id !== id);
        throttledSaveData();
        renderAnniversariesList();
        showNotification('纪念日已删除', 'success');
    }
};

let activeAnnId = null;

async function fillAnnHeaderCard(ann) {
    const headerCard = document.getElementById('ann-header-card');
    const toolbar = document.getElementById('ann-card-toolbar');
    if (!ann || !headerCard) return;

    activeAnnId = ann.id;
    headerCard.style.display = 'block';
    if (toolbar) toolbar.style.display = 'flex';

    const now = new Date();
    const isCountdown = ann.type === 'countdown';
    const targetDate = new Date(ann.date);
    let diffDays;
    if (isCountdown) {
        diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) diffDays = 0;
    } else {
        diffDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) diffDays = 0;
    }

    const iconEl = document.getElementById('ann-header-icon');
    const labelEl = document.getElementById('ann-header-label');
    if (iconEl) iconEl.textContent = isCountdown ? '♡' : '♥';
    if (labelEl) labelEl.textContent = isCountdown ? 'COUNTDOWN' : 'ANNIVERSARY';
    document.getElementById('ann-header-title').textContent = ann.name;
    document.getElementById('ann-header-date').textContent = ann.date;
    const daysEl = document.getElementById('ann-header-days');
    daysEl.innerHTML = `${diffDays.toLocaleString('zh-CN')}<span class="ann-header-days-unit">${isCountdown ? '天后' : '天'}</span>`;

    const milestonesEl = document.getElementById('ann-header-milestones');
    if (milestonesEl) {
        milestonesEl.innerHTML = '';
        if (!isCountdown) {
            const milestones = [];
            if (diffDays >= 100) { const n = Math.floor(diffDays / 100); milestones.push(`🎉 第 ${n * 100} 天`); }
            if (diffDays >= 365) { const n = Math.floor(diffDays / 365); milestones.push(`🎊 ${n} 周年`); }
            if (diffDays > 0 && diffDays < 100) { milestones.push(`💫 距 100 天还有 ${100 - diffDays} 天`); }
            milestones.forEach(m => milestonesEl.insertAdjacentHTML('beforeend', `<span class="ann-milestone-chip">${m}</span>`));
        }
    }

    const bgEl = document.getElementById('ann-header-card-bg');
    if (bgEl) {
        const savedBg = await localforage.getItem(getStorageKey(`annHeaderBg_${ann.id}`));
        bgEl.style.backgroundImage = savedBg ? `url(${savedBg})` : '';
    }

    document.querySelectorAll('.ann-item-card').forEach(el => el.classList.remove('ann-item-active'));
    const activeEl = document.querySelector(`.ann-item-card[data-ann-id="${ann.id}"]`);
    if (activeEl) activeEl.classList.add('ann-item-active');
}

function renderAnniversariesList() {
    const listContainer = document.getElementById('ann-list-container');
    const headerCard = document.getElementById('ann-header-card');
    const toolbar = document.getElementById('ann-card-toolbar');
    
    if (!listContainer) return;
    listContainer.innerHTML = '';

    anniversaries.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (anniversaries.length === 0) {
        if (headerCard) headerCard.style.display = 'none';
        if (toolbar) toolbar.style.display = 'none';
        listContainer.innerHTML = `
            <div class="ann-empty">
                <div class="ann-empty-icon">💝</div>
                <p>还没有纪念日<br>去添加一个属于你们的日子吧~</p>
            </div>`;
        return;
    }

    const now = new Date();
    const defaultAnn = anniversaries.find(a => a.type === 'anniversary') || anniversaries[0];
    fillAnnHeaderCard(defaultAnn);

    anniversaries.forEach(ann => {
        const targetDate = new Date(ann.date);
        let diffDays = 0;
        let typeClass = '';
        let typeLabel = '';
        let dayLabel = '';

        if (ann.type === 'countdown') {
            typeClass = 'type-future';
            typeLabel = '倒数';
            dayLabel = '天后';
            diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
            if(diffDays < 0) diffDays = 0;
        } else {
            typeClass = 'type-past';
            typeLabel = '已过';
            dayLabel = '天';
            diffDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
        }

        const formattedDays = diffDays.toLocaleString('zh-CN');

        const html = `
            <div class="ann-item-card ${typeClass}" data-ann-id="${ann.id}" onclick="selectAnnCard(${ann.id})" style="cursor:pointer;">
                <div class="ann-item-left">
                    <div class="ann-item-name">${ann.name}</div>
                    <div class="ann-item-date">
                        <span class="ann-tag">${typeLabel}</span>
                        ${ann.date}
                    </div>
                </div>
                <div style="display:flex; align-items:center;">
                    <div class="ann-item-right">
                        <div class="ann-item-days">${formattedDays}</div>
                        <div class="ann-item-days-unit">${dayLabel}</div>
                    </div>
                    <div class="ann-delete-btn" onclick="event.stopPropagation(); deleteAnniversaryItem(${ann.id})">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML('beforeend', html);
    });
}

window.selectAnnCard = function(id) {
    const ann = anniversaries.find(a => a.id === id);
    if (ann) fillAnnHeaderCard(ann);
};

window.clearAnnCardBg = async function() {
    if (!activeAnnId) return;
    await localforage.removeItem(getStorageKey(`annHeaderBg_${activeAnnId}`));
    const bgEl = document.getElementById('ann-header-card-bg');
    if (bgEl) bgEl.style.backgroundImage = '';
    showNotification('封面图已清除', 'success');
};


function initAnniversaryModule() {
    const entryBtn = document.getElementById('anniversary-function');
    
    if (entryBtn) {
        const newBtn = entryBtn.cloneNode(true);
        entryBtn.parentNode.replaceChild(newBtn, entryBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('重要日按钮被点击');
            
            const advancedModal = document.getElementById('advanced-modal');
            const annModal = document.getElementById('anniversary-modal');
            
            if (advancedModal) hideModal(advancedModal);
            renderAnniversariesList();
            if (annModal) showModal(annModal);
        });
    }

    const closeBtn = document.getElementById('close-anniversary-modal');
    if (closeBtn) {
        const newClose = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newClose, closeBtn);
        newClose.addEventListener('click', () => hideModal(document.getElementById('anniversary-modal')));
    }

    const openAddBtn = document.getElementById('open-ann-add-btn');
    const editorSlide = document.getElementById('ann-editor-slide');
    if (openAddBtn) {
        openAddBtn.onclick = () => {
            document.getElementById('ann-input-name').value = '';
            document.getElementById('ann-input-date').value = '';
            window.selectAnnType('anniversary');
            if (editorSlide) editorSlide.classList.add('active');
        };
    }

    const closeEditorBtn = document.getElementById('close-ann-editor');
    if (closeEditorBtn) {
        closeEditorBtn.onclick = () => {
            if (editorSlide) editorSlide.classList.remove('active');
        };
    }

    const saveBtn = document.getElementById('save-ann-btn');
    if (saveBtn) {
        const newSave = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSave, saveBtn);
        
        newSave.addEventListener('click', () => {
            addAnniversary(); 
            if (editorSlide) editorSlide.classList.remove('active');
        });
    }

    const annBgInput = document.getElementById('ann-header-bg-input');
    if (annBgInput) {
        annBgInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!activeAnnId) { showNotification('请先选择一个纪念日', 'warning'); return; }
            const reader = new FileReader();
            reader.onload = async (ev) => {
                const dataUrl = ev.target.result;
                const bgEl = document.getElementById('ann-header-card-bg');
                if (bgEl) bgEl.style.backgroundImage = `url(${dataUrl})`;
                await localforage.setItem(getStorageKey(`annHeaderBg_${activeAnnId}`), dataUrl);
                showNotification('封面图已更新 ', 'success');
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }
}
function prevTourStep() {
    currentTourStep--;
    showTourStep(currentTourStep);
}

function setupTutorialListeners() {
    tourNextBtn.addEventListener('click', nextTourStep);
    tourPrevBtn.addEventListener('click', prevTourStep);
    tourSkipBtn.addEventListener('click', endTour);

    const replayBtn = document.getElementById('replay-tutorial-btn');
    if(replayBtn) {
        replayBtn.addEventListener('click', () => {
            hideModal(DOMElements.dataModal.modal);
            setTimeout(() => {
                if (confirm('确定要重新开始新手引导教程吗？')) {
                    startTour();
                }
            }, 300);
        });
    }
}


function setupEventListeners() {
    try {
        initCoreListeners();
        initModalListeners();
        initChatActionListeners();
        initHeaderAndSettingsListeners();
        initDataManagementListeners();
        initNewFeatureListeners();
        setupTutorialListeners();
        initMoodListeners();
        initDecisionModule(); 
        initAnniversaryModule(); 
        initThemeEditor(); 
        initThemeSchemes();
        
        initComboMenu(); 
        
    } catch (e) {
        console.error("事件绑定过程中发生错误:", e);
    }
}

function initChatActionListeners() {
            DOMElements.chatContainer.addEventListener('click', (e) => {
// 在现有的 DOMElements.chatContainer 'click' 事件处理器内部，合适位置添加：
const voiceMsg = e.target.closest('.voice-message');
if (voiceMsg) {
  const wrapper = voiceMsg.closest('.message-wrapper');
  if (wrapper) {
    const msgId = Number(wrapper.dataset.id);
    const msg = messages.find(m => m.id === msgId);
    if (msg && msg.type === 'voice') {
      e.stopPropagation();
      e.preventDefault();
      handleVoiceBubbleClick(msg);
      return;
    }
  }
}
                if (isBatchFavoriteMode) {
                    const wrapper = e.target.closest('.message-wrapper');
                    if (wrapper && !e.target.closest('.message-meta-actions')) {
                        const messageId = Number(wrapper.dataset.id);
                        const index = selectedMessages.indexOf(messageId);

                        if (index > -1) {
                            selectedMessages.splice(index, 1);
                            wrapper.classList.remove('selected');
                        } else {
                            selectedMessages.push(messageId);
                            wrapper.classList.add('selected');
                        }

                        const confirmBtn = document.getElementById('confirm-batch-favorite');
                        if (confirmBtn) {
                            confirmBtn.textContent = `确认收藏 (${selectedMessages.length})`;
                        }
                        return;
                    }
                }

                const favoriteBtn = e.target.closest('.favorite-action-btn'); 
                if (favoriteBtn) {
                    const wrapper = e.target.closest('.message-wrapper');
                    const messageId = Number(wrapper.dataset.id);
                    const message = messages.find(m => m.id === messageId);
                    
                    if (message) {
                        message.favorited = !message.favorited;
                        
                        showNotification(message.favorited ? '已收藏': '已取消收藏', 'success', 1500);
                        playSound('favorite');
                        
                        throttledSaveData();
                        
                        renderMessages(true);
                    }
                    return;
                }

                const target = e.target.closest('.meta-action-btn');
                if (!target) return;
                
                const wrapper = e.target.closest('.message-wrapper');
                if (!wrapper) return; 
                
                const messageId = Number(wrapper.dataset.id);
                const message = messages.find(m => m.id === messageId);
                if (!message) return;

if (target.classList.contains('delete-btn')) {
    if (confirm('确定要删除这条消息吗？')) {
        const index = messages.findIndex(m => m.id === messageId);
        if (index > -1) {
            const savedScrollTop = DOMElements.chatContainer.scrollTop;
            messages.splice(index, 1); 
            throttledSaveData(); 
            renderMessages(true);
            requestAnimationFrame(() => {
                DOMElements.chatContainer.scrollTop = savedScrollTop;
            });
            showNotification('消息已删除', 'success');
        }
    }
    return;
}

                if (target.classList.contains('reply-btn')) {
                    currentReplyTo = {
                        id: message.id,
                        sender: message.sender,
                        text: message.text
                    };
                    updateReplyPreview();
                    DOMElements.messageInput.focus();
                    const targetMessageElement = DOMElements.chatContainer.querySelector(`[data-id="${message.id}"]`);
                    if (targetMessageElement) targetMessageElement.scrollIntoView({
                        behavior: 'smooth', block: 'center'
                    });
                    return;
                } 
                throttledSaveData();
            });

            DOMElements.batchPreview.addEventListener('click', (e) => {
                const removeBtn = e.target.closest('.batch-preview-remove');
                if (removeBtn) {
                    const index = removeBtn.closest('.batch-preview-item').dataset.index;
                    batchMessages.splice(index, 1); updateBatchPreview();
                    return;
                }
                const editBtn = e.target.closest('.batch-preview-edit');
                if (editBtn) {
                    const item = editBtn.closest('.batch-preview-item');
                    const index = parseInt(item.dataset.index);
                    const msg = batchMessages[index];
                    if (!msg || msg.image) return;
                    const newText = prompt('编辑内容：', msg.text);
                    if (newText !== null) {
                        batchMessages[index].text = newText.trim();
                        updateBatchPreview();
                    }
                    return;
                }
                const sendBtn = e.target.closest('.batch-send-btn');
                if (sendBtn && !sendBtn.disabled) sendBatchMessages();
                if (e.target.matches('.batch-cancel-btn')) {
                    isBatchMode = false; DOMElements.batchBtn.classList.remove('active');
                    DOMElements.batchPreview.style.display = 'none';
                    const placeholder = "";
                    DOMElements.messageInput.placeholder = placeholder.length > 20 ? placeholder.substring(0, 20) + "...": placeholder;
                    batchMessages = [];
                }
            });
        }

        function initModalListeners() {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                const cancelBtns = modal.querySelectorAll('.modal-buttons .modal-btn-secondary');
                cancelBtns.forEach(cancelBtn => {
                    if (!cancelBtn.getAttribute('onclick') && !cancelBtn.dataset.noAutoClose) {
                        cancelBtn.addEventListener('click', () => hideModal(modal));
                    }
                });
            });

            const closeChatBtn = document.getElementById('close-chat');
            if (closeChatBtn) {
                closeChatBtn.addEventListener('click', () => {
                    hideModal(DOMElements.chatModal.modal);
                });
            }

            const closeDataBtn = document.getElementById('close-data');
            if (closeDataBtn) {
                closeDataBtn.addEventListener('click', () => {
                    hideModal(DOMElements.dataModal.modal);
                });
            }

            DOMElements.editModal.input.addEventListener('input', () => {
                DOMElements.editModal.save.disabled = !DOMElements.editModal.input.value.trim();
            });
            DOMElements.pokeModal.save.addEventListener('click', () => {
                let pokeText = DOMElements.pokeModal.input.value.trim() || `${settings.myName} 拍了拍 ${settings.partnerName}`;
                addMessage({
                    id: Date.now(), text: _formatPokeText(pokeText), timestamp: new Date(), type: 'system'
                });
                hideModal(DOMElements.pokeModal.modal);
                DOMElements.pokeModal.input.value = '';
                const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                setTimeout(simulateReply, randomDelay);
            });


            DOMElements.cancelCoinResult.addEventListener('click', () => {
                DOMElements.coinTossOverlay.classList.remove('visible', 'finished');
                lastCoinResult = null;
            });


            DOMElements.sendCoinResult.addEventListener('click', () => {
                if (lastCoinResult) {
                    sendMessage(`🎲 抛硬币结果：${lastCoinResult}`, 'normal');
                    DOMElements.coinTossOverlay.classList.remove('visible', 'finished');
                    lastCoinResult = null;
                }
            });


            const retryBtn = document.getElementById('retry-coin-toss');

            if (retryBtn) {
                retryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    startCoinFlipAnimation();
                });
            }
        }


        function initHeaderAndSettingsListeners() {

            const openNameModal = (isPartner) => {
                const modal = DOMElements.editModal;
                showModal(modal.modal, modal.input);
                modal.title.textContent = `修改${isPartner ? (settings.partnerName || '对方'): '我'}的昵称`;
                modal.input.value = isPartner ? settings.partnerName: settings.myName;
                modal.save.disabled = !modal.input.value.trim();
                modal.save.onclick = () => {
                    const newName = modal.input.value.trim();
                    if (newName) {
                        isPartner ? settings.partnerName = newName: settings.myName = newName;
                        throttledSaveData();
                        updateUI();
                        showNotification('昵称已更新', 'success');
                    }
                    hideModal(modal.modal);
                };
            };

            const openAvatarModal = (isPartner) => {
                const modal = DOMElements.avatarModal;

                modal.modal.querySelector('.modal-content').innerHTML = `
            <div class="modal-title"><i class="fas fa-portrait"></i><span>上传${isPartner ? '对方': '我'}的头像</span></div>
            <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="modal-btn modal-btn-secondary" id="upload-file-btn" style="flex: 1;">选择文件</button>
            <button class="modal-btn modal-btn-secondary" id="paste-url-btn" style="flex: 1;">粘贴URL</button>
            </div>
            <input type="file" class="modal-input" id="avatar-file-input" accept="image/*" style="display: none;">
            <input type="text" class="modal-input" id="avatar-url-input" placeholder="输入图片URL地址" style="display: none;">
            <div id="avatar-preview" style="text-align: center; margin-top: 10px; display: none;">
            <img id="preview-image" style="max-width: 100px; max-height: 100px; border-radius: 50%; border: 2px solid var(--border-color);">
            </div>
            </div>
            <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" id="cancel-avatar">取消</button>
            <button class="modal-btn modal-btn-primary" id="save-avatar" disabled>保存</button>
            </div>
            `;

                showModal(modal.modal);

                const fileInput = document.getElementById('avatar-file-input');
                const urlInput = document.getElementById('avatar-url-input');
                const uploadBtn = document.getElementById('upload-file-btn');
                const pasteUrlBtn = document.getElementById('paste-url-btn');
                const previewDiv = document.getElementById('avatar-preview');
                const previewImg = document.getElementById('preview-image');
                const saveBtn = document.getElementById('save-avatar');
                const cancelBtn = document.getElementById('cancel-avatar');

                let currentAvatarData = null;


                uploadBtn.addEventListener('click', () => {
                    fileInput.click();
                    urlInput.style.display = 'none';
                    uploadBtn.classList.add('active');
                    pasteUrlBtn.classList.remove('active');
                });


                pasteUrlBtn.addEventListener('click', () => {
                    urlInput.style.display = 'block';
                    fileInput.style.display = 'none';
                    pasteUrlBtn.classList.add('active');
                    uploadBtn.classList.remove('active');
                    urlInput.focus();
                });


fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > MAX_AVATAR_SIZE) {
            showNotification('头像图片不能超过2MB', 'error');
            return;
        }

        showNotification('正在裁剪处理...', 'info', 1000);
        
        cropImageToSquare(file, 300).then(base64Data => {
            currentAvatarData = base64Data;
            previewImg.src = currentAvatarData;
            previewDiv.style.display = 'block';
            saveBtn.disabled = false;
        }).catch(err => {
            console.error(err);
            showNotification('图片处理失败', 'error');
        });
    }
});


                urlInput.addEventListener('input',
                    function() {
                        const url = urlInput.value.trim();
                        if (url) {

                            if (/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(url)) {
                                previewImg.src = url;
                                previewDiv.style.display = 'block';
                                currentAvatarData = url;
                                saveBtn.disabled = false;


                                const img = new Image();
                                img.onload = function() {

                                    previewImg.src = url;
                                };
                                img.onerror = function() {
                                    showNotification('图片URL无效或无法访问', 'error');
                                    saveBtn.disabled = true;
                                };
                                img.src = url;
                            } else {
                                saveBtn.disabled = true;
                            }
                        } else {
                            saveBtn.disabled = true;
                            previewDiv.style.display = 'none';
                        }
                    });


                saveBtn.addEventListener('click',
                    () => {
                        if (currentAvatarData) {
                            updateAvatar(isPartner ? DOMElements.partner.avatar: DOMElements.me.avatar, currentAvatarData);
                            throttledSaveData();
                            showNotification('头像已更新', 'success');
                            hideModal(modal.modal);
                        }
                    });


                cancelBtn.addEventListener('click',
                    () => {
                        hideModal(modal.modal);
                    });
            };

            DOMElements.partner.name.addEventListener('click', () => openNameModal(true));
            DOMElements.me.name.addEventListener('click', () => openNameModal(false));
            DOMElements.partner.avatar.addEventListener('click', () => openAvatarModal(true));
            DOMElements.me.avatar.addEventListener('click', () => openAvatarModal(false));

            DOMElements.me.statusContainer.addEventListener('click', () => {
                const statusTextElement = DOMElements.me.statusText; const statusContainer = DOMElements.me.statusContainer;
                if (statusContainer.querySelector('input')) return;
                const input = document.createElement('input'); input.type = 'text'; input.id = 'my-status-input'; input.value = statusTextElement.textContent;
                const saveStatus = () => {
                    const newStatus = input.value.trim();
                    if (newStatus) {
                        settings.myStatus = newStatus; showNotification('状态已更新', 'success');
                    } else {
                        settings.myStatus = "在线";
                    }
                    statusTextElement.textContent = settings.myStatus;
                    statusContainer.innerHTML = '';
                    statusContainer.appendChild(statusTextElement);
                    throttledSaveData();
                };
                input.addEventListener('blur', saveStatus);
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') input.blur();
                });
                statusContainer.innerHTML = ''; statusContainer.appendChild(input); input.focus();
            });

            DOMElements.themeToggle.addEventListener('click', () => {
                settings.isDarkMode = !settings.isDarkMode; throttledSaveData(); updateUI(); showNotification(`已切换到${settings.isDarkMode ? '夜': '昼'}模式`,
                    'success');
            });
            DOMElements.settingsModal.settingsBtn.addEventListener('click', () => {
                showModal(DOMElements.settingsModal.modal);
            });
            if (DOMElements.favoritesModal.favoritesBtn) {
                DOMElements.favoritesModal.favoritesBtn.addEventListener('click', () => {
                    showModal(document.getElementById('group-chat-modal'));
                });
            }


window.setReadReceiptStyle = function(style) {
    settings.readReceiptStyle = style;
    throttledSaveData();
    const iconBtn = document.getElementById('rr-style-icon');
    const textBtn = document.getElementById('rr-style-text');
    if (iconBtn) { iconBtn.className = style === 'icon' ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary'; iconBtn.style.cssText = 'padding:5px 12px;font-size:12px;'; }
    if (textBtn) { textBtn.className = style === 'text' ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary'; textBtn.style.cssText = 'padding:5px 12px;font-size:12px;'; }
    renderMessages();
    showNotification('已读回执样式已更新', 'success');
};

const _chatSettingsEl = document.getElementById('chat-settings');
if (_chatSettingsEl) _chatSettingsEl.addEventListener('click', () => {
    hideModal(DOMElements.settingsModal.modal);
    
    const toggleSyncMap = {
        '#reply-toggle': { prop: 'replyEnabled', name: '引用回复' },
        '#sound-toggle': { prop: 'soundEnabled', name: '音效' },
        '#read-receipts-toggle': { prop: 'readReceiptsEnabled', name: '已读回执' },
        '#typing-indicator-toggle': { prop: 'typingIndicatorEnabled', name: '正在输入' },
        '#read-no-reply-toggle': { prop: 'allowReadNoReply', name: '已读不回' },
        '#emoji-mix-toggle': { prop: 'emojiMixEnabled', name: '表情消息' }
    };
    for (const [selector, { prop }] of Object.entries(toggleSyncMap)) {
        const el = document.querySelector(selector);
        const val = prop === 'emojiMixEnabled' ? (settings[prop] !== false) : !!settings[prop];
        if (el) el.classList.toggle('active', val);
    }
    const svSlider = document.getElementById('sound-volume-slider');
    const svVal = document.getElementById('sound-volume-value');
    if (svSlider) { svSlider.value = Math.round((settings.soundVolume || 0.15) * 100); if (svVal) svVal.textContent = svSlider.value + '%'; }
    const csi = document.getElementById('custom-sound-url-input');
    if (csi) csi.value = settings.customSoundUrl || '';
    document.querySelectorAll('.time-fmt-opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.fmt === (settings.timeFormat || 'HH:mm'));
    });
    const autoToggle = document.getElementById('auto-send-toggle');
    if (autoToggle) autoToggle.classList.toggle('active', !!settings.autoSendEnabled);
    updateAutoSendUI();
    updateDelayUI();
    const immToggle = document.getElementById('immersive-toggle');
    if (immToggle) immToggle.classList.toggle('active', document.body.classList.contains('immersive-mode'));
    const rrStyle = settings.readReceiptStyle || 'icon';
    const rrIconBtn = document.getElementById('rr-style-icon');
    const rrTextBtn = document.getElementById('rr-style-text');
    if (rrIconBtn) { rrIconBtn.className = rrStyle === 'icon' ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary'; rrIconBtn.style.cssText = 'padding:5px 12px;font-size:12px;'; }
    if (rrTextBtn) { rrTextBtn.className = rrStyle === 'text' ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary'; rrTextBtn.style.cssText = 'padding:5px 12px;font-size:12px;'; }
    
    showModal(DOMElements.chatModal.modal);
    setupAvatarFrameSettings();
});
            const _advancedEl = document.getElementById('advanced-settings');
            if (_advancedEl) _advancedEl.addEventListener('click', () => {
                hideModal(DOMElements.settingsModal.modal);
                showModal(DOMElements.advancedModal.modal);
            });

            const _dataSettingsEl = document.getElementById('data-settings');
            if (_dataSettingsEl) _dataSettingsEl.addEventListener('click', () => {
                hideModal(DOMElements.settingsModal.modal);
                showModal(DOMElements.dataModal.modal);
                (async function calcDmStorage() {
                    try {
                        let total = 0, msgsSize = 0, settingsSize = 0, mediaSize = 0;
                        const keys = await localforage.keys();
                        for (const k of keys) {
                            const raw = await localforage.getItem(k);
                            const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
                            const bytes = new Blob([str]).size;
                            total += bytes;
                            if (/messages|msgs/i.test(k)) msgsSize += bytes;
                            else if (/avatar|image|photo|bg|background|wallpaper/i.test(k)) mediaSize += bytes;
                            else settingsSize += bytes;
                        }
                        const fmt = b => b > 1048576 ? (b/1048576).toFixed(1)+'MB' : b > 1024 ? (b/1024).toFixed(0)+'KB' : b+'B';
                        const MAX = 5 * 1024 * 1024;
                        const pct = Math.min(100, Math.round(total / MAX * 100));
                        const barEl = document.getElementById('dm-storage-bar');
                        const totalEl = document.getElementById('dm-storage-total');
                        if (barEl) barEl.style.width = pct + '%';
                        if (totalEl) totalEl.textContent = fmt(total);
                        const msgsEl = document.getElementById('dm-stat-msgs');
                        const setEl = document.getElementById('dm-stat-settings');
                        const medEl = document.getElementById('dm-stat-media');
                        if (msgsEl) msgsEl.textContent = fmt(msgsSize);
                        if (setEl) setEl.textContent = fmt(settingsSize);
                        if (medEl) medEl.textContent = fmt(mediaSize);
                    } catch(e) {
                        const totalEl = document.getElementById('dm-storage-total');
                        if (totalEl) totalEl.textContent = '无法读取';
                    }
                })();
            });
            const exportChatBtnDm = document.getElementById('export-chat-btn');
            const importChatBtnDm = document.getElementById('import-chat-btn');
            if (exportChatBtnDm) {
                exportChatBtnDm.addEventListener('click', () => {
                    if (typeof exportChatHistory === 'function') exportChatHistory();
                    else showNotification('功能暂不可用', 'error');
                });
            }
            if (importChatBtnDm) {
                importChatBtnDm.addEventListener('click', () => {
                    const inp = document.createElement('input');
                    inp.type = 'file';
                        inp.accept = '*/*';          // 修改为接受所有文件
                        inp.onchange = function (e) {
                            var f = e.target.files && e.target.files[0];
                            if (!f) return;
                            if (!f.name.toLowerCase().endsWith('.json')) {
                                showNotification('请选择 .json 格式的备份文件', 'error');
                                return;
                            }
                            if (typeof importAllData === 'function') importAllData(f);
                        };
                        inp.click();
                });
            }


            document.querySelectorAll('.theme-color-btn').forEach(btn => {
                btn.addEventListener('click',
                    () => {
                        settings.colorTheme = btn.dataset.theme;
                        throttledSaveData();
                        updateUI();
                        showNotification(`主题颜色已切换`, 'success');
                    });
            });


            document.querySelectorAll('[data-bubble-style]').forEach(item => {
                item.addEventListener('click',
                    () => {
                        settings.bubbleStyle = item.dataset.bubbleStyle;
                        throttledSaveData();
                        updateUI();
                        showNotification(`气泡样式已切换为${getBubbleStyleName(settings.bubbleStyle)}`, 'success');
                    });
            });

            const fontUrlInput = document.getElementById('custom-font-url');
            const applyFontBtn = document.getElementById('apply-font-btn');
            
            if (fontUrlInput) fontUrlInput.value = settings.customFontUrl || "";

            if (applyFontBtn) {
                applyFontBtn.addEventListener('click', () => {
                    const url = fontUrlInput.value.trim();
                    settings.customFontUrl = url;
                    
                    showNotification('正在尝试加载字体...', 'info', 1000);
                    applyCustomFont(url).then(() => {
                        throttledSaveData();
                        if(url) showNotification('字体已应用', 'success');
                        else showNotification('已恢复默认字体', 'success');
                    });
                });
            }

            
            const followSystemBtn = document.getElementById('follow-system-font-btn');
            if (followSystemBtn) {
                followSystemBtn.addEventListener('click', () => {
                    
                    const systemFontStack = 'system-ui, -apple-system, sans-serif';
                    
                    
                    if (fontUrlInput) fontUrlInput.value = "";
                    
                    
                    settings.customFontUrl = "";
                    
                    
                    settings.messageFontFamily = systemFontStack;
                    
                    
                    document.documentElement.style.setProperty('--font-family', systemFontStack);
                    document.documentElement.style.setProperty('--message-font-family', systemFontStack);
                    
                    
                    throttledSaveData();
                    
                    
                    renderMessages(true);
                    
                    showNotification('已应用跟随系统字体', 'success');
                });
            }
            
            const cssTextarea = document.getElementById('custom-bubble-css');
            const applyCssBtn = document.getElementById('apply-css-btn');
            const resetCssBtn = document.getElementById('reset-css-btn');

            if (cssTextarea) cssTextarea.value = settings.customBubbleCss || "";

            function updateCssLivePreview() {
                const previewStyle = document.getElementById('css-live-preview-style');
                if (!previewStyle) return;
                const raw = (cssTextarea ? cssTextarea.value : '') || '';
                const scoped = raw.replace(/([^{}]+)\{/g, (match, selector) => {
                    const parts = selector.split(',').map(s => `#css-live-preview ${s.trim()}`);
                    return parts.join(', ') + ' {';
                });
                previewStyle.textContent = scoped;
            }

            if (cssTextarea) {
                cssTextarea.addEventListener('input', updateCssLivePreview);
                updateCssLivePreview();
            }

            if (applyCssBtn) {
                applyCssBtn.addEventListener('click', () => {
                    const css = cssTextarea.value;
                    settings.customBubbleCss = css;
                    applyCustomBubbleCss(css);
                    throttledSaveData();
                    showNotification('自定义样式已应用', 'success');
                });
            }

            if (resetCssBtn) {
                resetCssBtn.addEventListener('click', () => {
                    cssTextarea.value = "";
                    settings.customBubbleCss = "";
                    applyCustomBubbleCss("");
                    if (document.getElementById('css-live-preview-style')) document.getElementById('css-live-preview-style').textContent = '';
                    throttledSaveData();
                    showNotification('自定义样式已清除', 'success');
                });
            }

            const globalCssTextarea = document.getElementById('custom-global-css');
            const applyGlobalCssBtn = document.getElementById('apply-global-css-btn');
            const resetGlobalCssBtn = document.getElementById('reset-global-css-btn');
            const globalCssLiveToggle = document.getElementById('global-css-live-toggle');
            const globalCssStatus = document.getElementById('global-css-status');

            if (globalCssTextarea) {
                globalCssTextarea.value = settings.customGlobalCss || '';

                globalCssTextarea.addEventListener('input', () => {
                    if (globalCssLiveToggle && globalCssLiveToggle.checked) {
                        applyGlobalThemeCss(globalCssTextarea.value);
                        if (globalCssStatus) {
                            globalCssStatus.style.display = 'block';
                            globalCssStatus.textContent = '● 实时应用中';
                            globalCssStatus.style.color = 'var(--accent-color)';
                        }
                    }
                });
            }

            if (applyGlobalCssBtn) {
                applyGlobalCssBtn.addEventListener('click', () => {
                    const css = globalCssTextarea ? globalCssTextarea.value : '';
                    settings.customGlobalCss = css;
                    applyGlobalThemeCss(css);
                    throttledSaveData();
                    showNotification('全局主题 CSS 已应用', 'success');
                    if (globalCssStatus) {
                        globalCssStatus.style.display = 'block';
                        globalCssStatus.textContent = '✓ 已应用到全局';
                        globalCssStatus.style.color = '#51cf66';
                        setTimeout(() => { if (globalCssStatus) globalCssStatus.style.display = 'none'; }, 2000);
                    }
                });
            }

            if (resetGlobalCssBtn) {
                resetGlobalCssBtn.addEventListener('click', () => {
                    if (globalCssTextarea) globalCssTextarea.value = '';
                    settings.customGlobalCss = '';
                    applyGlobalThemeCss('');
                    throttledSaveData();
                    showNotification('全局主题 CSS 已清除', 'success');
                    if (globalCssStatus) globalCssStatus.style.display = 'none';
                });
            }

            const fontSizeSlider = document.getElementById('font-size-slider');
            const fontSizeValue = document.getElementById('font-size-value');

            fontSizeSlider.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}px`;

            fontSizeSlider.addEventListener('input', (e) => {
                settings.fontSize = parseInt(e.target.value);
                document.documentElement.style.setProperty('--font-size',
                    `${settings.fontSize}px`);
                fontSizeValue.textContent = `${settings.fontSize}px`;
            });

            fontSizeSlider.addEventListener('change', throttledSaveData);

            const avatarToggle = document.getElementById('in-chat-avatar-toggle-2');
            const avatarSizeControl = document.getElementById('in-chat-avatar-size-control-2');
            const avatarPositionControl = document.getElementById('in-chat-avatar-position-control-2');
            const avatarPreview = document.getElementById('avatar-bubble-preview');
            const avatarSizeSlider = document.getElementById('in-chat-avatar-size-slider-2');
            const avatarSizeValue = document.getElementById('in-chat-avatar-size-value-2');

            if (!settings.inChatAvatarPosition) settings.inChatAvatarPosition = 'center';


            function updateBubblePreview() {
                const receivedBubble = document.getElementById('preview-bubble-received');
                const sentBubble = document.getElementById('preview-bubble-sent');
                if (!receivedBubble || !sentBubble) return;
                const style = settings.bubbleStyle || 'standard';
                const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-rgb').trim() || '100,150,255';
                const styleMap = {
                    'standard':      { recv: '16px 16px 16px 4px',  sent: '16px 16px 4px 16px',  recvShadow: '0 2px 10px rgba(0,0,0,0.08)', sentShadow: `0 3px 12px rgba(${accentRgb},0.22)` },
                    'rounded':       { recv: '18px 18px 18px 6px',  sent: '18px 18px 6px 18px',  recvShadow: '0 2px 10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)', sentShadow: `0 3px 12px rgba(${accentRgb},0.25), 0 1px 3px rgba(${accentRgb},0.1)` },
                    'rounded-large': { recv: '24px 24px 24px 4px',  sent: '24px 24px 4px 24px',  recvShadow: '0 4px 16px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)', sentShadow: `0 4px 16px rgba(${accentRgb},0.28), 0 2px 4px rgba(${accentRgb},0.12)` },
                    'square':        { recv: '4px 4px 4px 0',       sent: '4px 4px 0 4px',       recvShadow: '0 3px 10px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)', sentShadow: `0 3px 10px rgba(${accentRgb},0.2), 0 1px 2px rgba(${accentRgb},0.08)` }
                };
                const radii = styleMap[style] || styleMap['standard'];
                receivedBubble.style.borderRadius = radii.recv;
                receivedBubble.style.boxShadow = radii.recvShadow;
                sentBubble.style.borderRadius = radii.sent;
                sentBubble.style.boxShadow = radii.sentShadow;
                const recvBg = getComputedStyle(document.documentElement).getPropertyValue('--message-received-bg').trim();
                const recvText = getComputedStyle(document.documentElement).getPropertyValue('--message-received-text').trim();
                const sentBg = getComputedStyle(document.documentElement).getPropertyValue('--message-sent-bg').trim();
                const sentText = getComputedStyle(document.documentElement).getPropertyValue('--message-sent-text').trim();
                if (recvBg) receivedBubble.style.background = recvBg;
                if (recvText) receivedBubble.style.color = recvText;
                if (sentBg) sentBubble.style.background = sentBg;
                if (sentText) sentBubble.style.color = sentText;
                receivedBubble.style.fontFamily = settings.messageFontFamily || '';
                sentBubble.style.fontFamily = settings.messageFontFamily || '';
                receivedBubble.style.fontSize = (settings.fontSize || 16) + 'px';
                sentBubble.style.fontSize = (settings.fontSize || 16) + 'px';
                const customCss = (document.getElementById('custom-bubble-css') || {}).value || '';
                let previewStyle = document.getElementById('bubble-preview-custom-style');
                if (!previewStyle) {
                    previewStyle = document.createElement('style');
                    previewStyle.id = 'bubble-preview-custom-style';
                    document.head.appendChild(previewStyle);
                }
                previewStyle.textContent = customCss;
            }

            function updateAvatarSettingsUI() {
                const enabled = settings.inChatAvatarEnabled;
                const pill = document.getElementById('avatar-toggle-pill-2');
                const knob = document.getElementById('avatar-toggle-knob-2');
                const statusText = document.getElementById('avatar-toggle-status-2');
                if (pill) pill.style.background = enabled ? 'var(--accent-color)' : 'var(--border-color)';
                if (knob) knob.style.right = enabled ? '3px' : '23px';
                if (statusText) statusText.textContent = enabled ? '已开启 — 消息旁显示头像' : '已关闭';

                if (avatarSizeControl) avatarSizeControl.style.display = enabled ? 'flex' : 'none';
                if (avatarPositionControl) avatarPositionControl.style.display = enabled ? 'block' : 'none';
                if (avatarPreview) avatarPreview.style.display = enabled ? 'block' : 'none';

                if (avatarSizeSlider) avatarSizeSlider.value = settings.inChatAvatarSize;
                if (avatarSizeValue) avatarSizeValue.textContent = `${settings.inChatAvatarSize}px`;
                document.documentElement.style.setProperty('--in-chat-avatar-size', `${settings.inChatAvatarSize}px`);

                const pos = settings.inChatAvatarPosition || 'center';
                const alignMap = { 'top': 'flex-start', 'center': 'center', 'bottom': 'flex-end', 'custom': 'flex-start' };
                document.documentElement.style.setProperty('--avatar-align', alignMap[pos] || 'center');
                document.body.dataset.avatarPos = pos;
                document.querySelectorAll('.preview-msg-row').forEach(row => {
                    row.style.alignItems = alignMap[pos] || 'flex-start';
                });
                const topBtn = document.getElementById('avatar-pos-top-2');
                const centerBtn = document.getElementById('avatar-pos-center-2');
                const bottomBtn = document.getElementById('avatar-pos-bottom-2');
                const customBtn = document.getElementById('avatar-pos-custom-2');
                [topBtn, centerBtn, bottomBtn, customBtn].forEach(btn => {
                    if (!btn) return;
                    btn.className = btn.dataset.pos === pos ? 'modal-btn modal-btn-primary' : 'modal-btn modal-btn-secondary';
                    btn.style.flex = '1'; btn.style.fontSize = '12px'; btn.style.padding = '7px 0';
                });

                const customOffsetCtrl = document.getElementById('avatar-custom-offset-control');
                if (customOffsetCtrl) customOffsetCtrl.style.display = pos === 'custom' ? 'block' : 'none';
                if (pos === 'custom') {
                    const offset = settings.inChatAvatarCustomOffset || 0;
                    document.documentElement.style.setProperty('--avatar-custom-offset', offset + 'px');
                    const sl = document.getElementById('avatar-custom-offset-slider');
                    const vl = document.getElementById('avatar-custom-offset-value');
                    if (sl) sl.value = offset;
                    if (vl) vl.textContent = offset + 'px';
                    const previewPartner = document.getElementById('preview-partner-avatar');
                    if (previewPartner) previewPartner.style.marginTop = offset + 'px';
                    const previewMy = document.getElementById('preview-my-avatar');
                    if (previewMy) previewMy.style.marginTop = offset + 'px';
                } else {
                    document.documentElement.style.removeProperty('--avatar-custom-offset');
                    const previewPartner = document.getElementById('preview-partner-avatar');
                    if (previewPartner) previewPartner.style.marginTop = '';
                    const previewMy = document.getElementById('preview-my-avatar');
                    if (previewMy) previewMy.style.marginTop = '';
                }

                const alwaysPill = document.getElementById('always-avatar-pill');
                const alwaysKnob = document.getElementById('always-avatar-knob');
                const alwaysStatus = document.getElementById('always-avatar-status');
                const alwaysOn = !!settings.alwaysShowAvatar;
                if (alwaysPill) alwaysPill.style.background = alwaysOn ? 'var(--accent-color)' : 'var(--border-color)';
                if (alwaysKnob) alwaysKnob.style.right = alwaysOn ? '3px' : '23px';
                if (alwaysStatus) alwaysStatus.textContent = alwaysOn ? '已开启 — 每条消息都显示头像' : '已关闭 — 仅首条消息显示';
                document.body.classList.toggle('always-show-avatar', alwaysOn);

                const namePill = document.getElementById('partner-name-chat-pill');
                const nameKnob = document.getElementById('partner-name-chat-knob');
                const nameStatus = document.getElementById('partner-name-chat-status');
                const nameOn = !!settings.showPartnerNameInChat;
                if (namePill) namePill.style.background = nameOn ? 'var(--accent-color)' : 'var(--border-color)';
                if (nameKnob) nameKnob.style.right = nameOn ? '3px' : '23px';
                if (nameStatus) nameStatus.textContent = nameOn ? '已开启 — 消息旁显示对方名字' : '已关闭';
                showPartnerNameInChat = nameOn;
                document.body.classList.toggle('show-partner-name', nameOn);

                updateAvatarPreview();
            }
            updateAvatarSettingsUI();

            if (avatarToggle) {
                avatarToggle.addEventListener('click', () => {
                    settings.inChatAvatarEnabled = !settings.inChatAvatarEnabled;
                    updateAvatarSettingsUI();
                    renderMessages(true);
                    throttledSaveData();
                });
            }

            if (avatarSizeSlider) {
                avatarSizeSlider.addEventListener('input', (e) => {
                    settings.inChatAvatarSize = parseInt(e.target.value, 10);
                    updateAvatarSettingsUI();
                    renderMessages(true); 
                });
                avatarSizeSlider.addEventListener('change', throttledSaveData);
            }

            ['avatar-pos-top-2','avatar-pos-center-2','avatar-pos-bottom-2','avatar-pos-custom-2'].forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) {
                    btn.addEventListener('click', () => {
                        settings.inChatAvatarPosition = btn.dataset.pos;
                        updateAvatarSettingsUI();
                        renderMessages(true);
                        throttledSaveData();
                    });
                }
            });

            const customOffsetSlider = document.getElementById('avatar-custom-offset-slider');
            const customOffsetValue = document.getElementById('avatar-custom-offset-value');
            if (customOffsetSlider) {
                customOffsetSlider.value = settings.inChatAvatarCustomOffset || 0;
                if (customOffsetValue) customOffsetValue.textContent = (settings.inChatAvatarCustomOffset || 0) + 'px';
                customOffsetSlider.addEventListener('input', () => {
                    const val = parseInt(customOffsetSlider.value, 10);
                    settings.inChatAvatarCustomOffset = val;
                    if (customOffsetValue) customOffsetValue.textContent = val + 'px';
                    document.documentElement.style.setProperty('--avatar-custom-offset', val + 'px');
                    document.querySelectorAll('.preview-msg-row').forEach(row => {
                        row.style.alignItems = 'flex-start';
                    });
                    const previewPartner = document.getElementById('preview-partner-avatar');
                    if (previewPartner) previewPartner.style.marginTop = val + 'px';
                    const previewMy = document.getElementById('preview-my-avatar');
                    if (previewMy) previewMy.style.marginTop = val + 'px';
                    renderMessages(true);
                });
                customOffsetSlider.addEventListener('change', throttledSaveData);
            }

            const alwaysAvatarToggle = document.getElementById('always-avatar-toggle');
            if (alwaysAvatarToggle) {
                alwaysAvatarToggle.addEventListener('click', () => {
                    settings.alwaysShowAvatar = !settings.alwaysShowAvatar;
                    updateAvatarSettingsUI();
                    renderMessages(true);
                    throttledSaveData();
                });
            }

            const partnerNameChatToggle = document.getElementById('partner-name-chat-toggle');
            if (partnerNameChatToggle) {
                partnerNameChatToggle.addEventListener('click', () => {
                    settings.showPartnerNameInChat = !settings.showPartnerNameInChat;
                    updateAvatarSettingsUI();
                    throttledSaveData();
                });
            }

            function updateAvatarPreview(shape, cornerRadius) {
                const previewPartner = document.getElementById('preview-partner-avatar');
                const previewMy = document.getElementById('preview-my-avatar');
                if (!previewPartner || !previewMy) return;
                const sz = `${settings.inChatAvatarSize || 36}px`;
                previewPartner.style.width = sz;
                previewPartner.style.height = sz;
                previewMy.style.width = sz;
                previewMy.style.height = sz;
                const partnerImg = DOMElements.partner && DOMElements.partner.avatar ? DOMElements.partner.avatar.querySelector('img') : null;
                const myImg = DOMElements.me && DOMElements.me.avatar ? DOMElements.me.avatar.querySelector('img') : null;
                const currentShape = shape || settings.myAvatarShape || 'circle';
                
                function applyToPreviewEl(el, img, shp, cr) {
                    if (img && img.src) {
                        el.innerHTML = `<img src="${img.src}" style="width:100%;height:100%;object-fit:cover;">`;
                    }
                    if (shp === 'circle') {
                        el.style.borderRadius = '50%';
                    } else if (shp === 'square') {
                        el.style.borderRadius = (cr || 8) + 'px';
                    }
                }
                const cr = cornerRadius !== undefined ? cornerRadius : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--avatar-corner-radius') || '8') || 8;
                applyToPreviewEl(previewPartner, partnerImg, currentShape, cr);
                applyToPreviewEl(previewMy, myImg, currentShape, cr);
                if (typeof updateBubblePreview === 'function') updateBubblePreview();
            }

            function updateAvatarShapeBtns() {
                const shape = settings.myAvatarShape || 'circle';
                document.querySelectorAll('.avatar-shape-btn-2').forEach(b => {
                    b.classList.toggle('modal-btn-primary', b.dataset.shape === shape);
                    b.classList.toggle('modal-btn-secondary', b.dataset.shape !== shape);
                });
                const radiusCtrl = document.getElementById('avatar-corner-radius-control-2');
                if (radiusCtrl) radiusCtrl.style.display = shape === 'square' ? '' : 'none';
                updateAvatarPreview(shape);
            }
            document.querySelectorAll('.avatar-shape-btn-2').forEach(btn => {
                btn.addEventListener('click', () => {
                    const shape = btn.dataset.shape;
                    settings.myAvatarShape = shape;
                    settings.partnerAvatarShape = shape;
                    applyAvatarShapeToDOM && applyAvatarShapeToDOM('my', shape);
                    applyAvatarShapeToDOM && applyAvatarShapeToDOM('partner', shape);
                    updateAvatarShapeBtns();
                    updateAvatarPreview(shape);
                    renderMessages(true);
                    throttledSaveData();
                });
            });
            const cornerSlider = document.getElementById('avatar-corner-radius-slider-2');
            const cornerVal = document.getElementById('avatar-corner-radius-value-2');
            if (cornerSlider) {
                cornerSlider.value = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--avatar-corner-radius') || '8') || 8;
                if (cornerVal) cornerVal.textContent = cornerSlider.value + 'px';
                cornerSlider.addEventListener('input', () => {
                    const r = cornerSlider.value;
                    if (cornerVal) cornerVal.textContent = r + 'px';
                    document.documentElement.style.setProperty('--avatar-corner-radius', r + 'px');
                    updateAvatarPreview(settings.myAvatarShape || 'circle', parseInt(r));
                    renderMessages(true);
                });
                cornerSlider.addEventListener('change', () => {
                    settings.avatarCornerRadius = cornerSlider.value;
                    throttledSaveData();
                });
            }
            updateAvatarShapeBtns();

            document.querySelectorAll('[data-bubble-style]').forEach(item => {
                item.addEventListener('click', () => {
                    setTimeout(updateBubblePreview, 100);
                });
            });
            
            const minDelaySlider = document.getElementById('reply-delay-min-slider');
            const minDelayValue = document.getElementById('reply-delay-min-value');
            const maxDelaySlider = document.getElementById('reply-delay-max-slider');
            const maxDelayValue = document.getElementById('reply-delay-max-value');

            window.switchCsTab = function switchCsTab(btn) {
                document.querySelectorAll('.cs-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.cs-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById(btn.dataset.panel);
                if (panel) panel.classList.add('active');
            };

            function updateDelayUI() {
                minDelaySlider.value = settings.replyDelayMin;
                const minSec = settings.replyDelayMin / 1000;
                minDelayValue.textContent = minSec >= 60 ? `${(minSec/60).toFixed(1)}分钟` : `${minSec.toFixed(0)}s`;
                maxDelaySlider.value = settings.replyDelayMax;
                const maxSec = settings.replyDelayMax / 1000;
                maxDelayValue.textContent = maxSec >= 60 ? `${(maxSec/60).toFixed(1)}分钟` : `${maxSec.toFixed(0)}s`;
                maxDelaySlider.min = settings.replyDelayMin; 
            }
            updateDelayUI();

            minDelaySlider.addEventListener('input', (e) => {
                settings.replyDelayMin = parseInt(e.target.value, 10);
                if (settings.replyDelayMin > settings.replyDelayMax) {
                    settings.replyDelayMax = settings.replyDelayMin;
                }
                updateDelayUI();
            });
            minDelaySlider.addEventListener('change', throttledSaveData);

            maxDelaySlider.addEventListener('input', (e) => {
                settings.replyDelayMax = parseInt(e.target.value, 10);
                 if (settings.replyDelayMax < settings.replyDelayMin) {
                    settings.replyDelayMin = settings.replyDelayMax;
                }
                updateDelayUI();
            });
            maxDelaySlider.addEventListener('change', throttledSaveData);

            const settingToggles = {
                '#reply-toggle': {
                    prop: 'replyEnabled', name: '引用回复'
                },
                '#sound-toggle': {
                    prop: 'soundEnabled', name: '音效'
                },
                '#read-receipts-toggle': {
                    prop: 'readReceiptsEnabled', name: '已读回执'
                },
                '#typing-indicator-toggle': {
                    prop: 'typingIndicatorEnabled', name: '正在输入'},
                    '#read-no-reply-toggle': { prop: 'allowReadNoReply', name: '已读不回' },
                    '#emoji-mix-toggle': { prop: 'emojiMixEnabled', name: '表情混入消息' }
};

            for (const [selector, {
                prop, name
            }] of Object.entries(settingToggles)) {
                const element = document.querySelector(selector);
                if (!element) continue;

                const _initVal = prop === 'emojiMixEnabled' ? (settings[prop] !== false) : !!settings[prop];
                element.classList.toggle('active', _initVal);

                element.addEventListener('click', () => {
                    if (prop === 'emojiMixEnabled' && settings[prop] === undefined) settings[prop] = true;
                    settings[prop] = !settings[prop];
                    throttledSaveData();
                    updateUI();
                    element.classList.toggle('active', !!settings[prop]);
                    if (prop !== 'soundEnabled') renderMessages(true);
                    showNotification(`${name}已${settings[prop] ? '开启': '关闭'}`, 'success');
                });
            }

            const soundVolSlider = document.getElementById('sound-volume-slider');
            const soundVolVal = document.getElementById('sound-volume-value');
            if (soundVolSlider) {
                soundVolSlider.value = Math.round((settings.soundVolume || 0.15) * 100);
                if (soundVolVal) soundVolVal.textContent = soundVolSlider.value + '%';
                soundVolSlider.addEventListener('input', (e) => {
                    settings.soundVolume = parseInt(e.target.value) / 100;
                    if (soundVolVal) soundVolVal.textContent = e.target.value + '%';
                });
                soundVolSlider.addEventListener('change', throttledSaveData);
            }
            const customSoundInput = document.getElementById('custom-sound-url-input');
            if (customSoundInput) {
                customSoundInput.value = settings.customSoundUrl || '';
                customSoundInput.addEventListener('change', () => {
                    settings.customSoundUrl = customSoundInput.value.trim();
                    throttledSaveData();
                });
            }
            const testSoundBtn = document.getElementById('test-sound-btn');
            if (testSoundBtn) {
                testSoundBtn.addEventListener('click', () => { playSound('message'); });
            }
            document.querySelectorAll('.time-fmt-opt').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.fmt === (settings.timeFormat || 'HH:mm'));
                opt.addEventListener('click', () => {
                    document.querySelectorAll('.time-fmt-opt').forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    settings.timeFormat = opt.dataset.fmt;
                    throttledSaveData();
                    renderMessages(true);
                    showNotification('时间格式已更新', 'success');
                });
            });


            const _appearanceEl = document.getElementById('appearance-settings');
            if (_appearanceEl) _appearanceEl.addEventListener('click', () => {
                hideModal(DOMElements.settingsModal.modal);
                window.hideAppearancePanel && window.hideAppearancePanel();
                renderBackgroundGallery();
                renderThemeSchemesList();
                
                const fontSizeSliderEl = document.getElementById('font-size-slider');
                const fontSizeValueEl = document.getElementById('font-size-value');
                if (fontSizeSliderEl) {
                    fontSizeSliderEl.value = settings.fontSize;
                    if (fontSizeValueEl) fontSizeValueEl.textContent = `${settings.fontSize}px`;
                }
                const fontUrlInputEl = document.getElementById('custom-font-url');
                if (fontUrlInputEl) fontUrlInputEl.value = settings.customFontUrl || '';
                const cssTextareaEl = document.getElementById('custom-bubble-css');
                if (cssTextareaEl) cssTextareaEl.value = settings.customBubbleCss || '';
                const globalCssTextareaEl = document.getElementById('custom-global-css');
                if (globalCssTextareaEl) globalCssTextareaEl.value = settings.customGlobalCss || '';
                
                document.querySelectorAll('[data-bubble-style]').forEach(item => {
                    item.classList.toggle('active', item.dataset.bubbleStyle === settings.bubbleStyle);
                });
                
                document.querySelectorAll('.theme-color-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.theme === settings.colorTheme);
                });
                
                showModal(DOMElements.appearanceModal.modal);
                setTimeout(() => { 
                    updateAvatarSettingsUI && updateAvatarSettingsUI(); 
                    setupAppearancePanelFrameSettings && setupAppearancePanelFrameSettings();
                }, 100);
            });
            DOMElements.appearanceModal.closeBtn.addEventListener('click', () => {
                    hideModal(DOMElements.appearanceModal.modal);
                });

            const bgInput = document.getElementById('bg-gallery-input');
            if (bgInput) {
                bgInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                        showNotification('背景图片不能超过10MB', 'error');
                        return;
                    }
                    if (file.size > 5 * 1024 * 1024) {
                        showNotification('文件较大，正在处理中...', 'info', 2000);
                    }
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64 = event.target.result;
                        savedBackgrounds.push({
                            id: `user-${Date.now()}`,
                            type: file.type === 'image/gif' ? 'gif' : 'image',
                            value: base64
                        });
                        saveBackgroundGallery();
                        renderBackgroundGallery();
                        applyBackground(base64);
                        localforage.setItem(getStorageKey('chatBackground'), base64);
                        showNotification('新背景已添加并应用', 'success');
                    };
                    reader.readAsDataURL(file);
                    e.target.value = '';
                });
            }

const autoSendToggle = document.getElementById('auto-send-toggle');
const autoSendControl = document.getElementById('auto-send-control');
const autoSendSlider = document.getElementById('auto-send-slider');
const autoSendValue = document.getElementById('auto-send-value');

const updateAutoSendUI = () => {
    autoSendToggle.classList.toggle('active', !!settings.autoSendEnabled);
    autoSendControl.style.display = settings.autoSendEnabled ? "flex" : "none";
    const currentVal = settings.autoSendInterval || 5;
    autoSendSlider.value = currentVal;
    autoSendValue.textContent = `${currentVal}分钟`;
};

updateAutoSendUI();

autoSendToggle.addEventListener('click', () => {
    settings.autoSendEnabled = !settings.autoSendEnabled;
    updateAutoSendUI();
    manageAutoSendTimer(); 
    throttledSaveData();
    showNotification(`主动发送已${settings.autoSendEnabled ? '开启' : '关闭'}`, 'success');
});

autoSendSlider.value = settings.autoSendInterval || 5;
autoSendValue.textContent = `${settings.autoSendInterval || 5}分钟`;

autoSendSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    settings.autoSendInterval = val;
    autoSendValue.textContent = `${val}分钟`;
});

autoSendSlider.addEventListener('change', () => {
    manageAutoSendTimer(); 
    throttledSaveData();
});

            const resetBgBtn = document.getElementById('reset-default-bg');
            if (resetBgBtn) {
                resetBgBtn.addEventListener('click', () => {
                    removeBackground();
                    renderBackgroundGallery();
                    showNotification('已移除背景图', 'success');
                });
            }
        }



        function initNewFeatureListeners() {
            const flEntry = document.getElementById('fortune-lenormand-function');
            if (flEntry) {
                flEntry.addEventListener('click', () => {
                    hideModal(DOMElements.advancedModal.modal);
                    generateFortune();
                    switchFLTab('fortune');
                    showModal(document.getElementById('fortune-lenormand-modal'));
                });
            }

            const _closeLenormandEl = document.getElementById('close-lenormand');
            if (_closeLenormandEl) _closeLenormandEl.addEventListener('click', () => {
                hideModal(document.getElementById('fortune-lenormand-modal'));
            });
    const envelopeEntryBtn = document.getElementById('envelope-function');
    if (envelopeEntryBtn) {
        envelopeEntryBtn.addEventListener('click', async () => {
            hideModal(DOMElements.advancedModal.modal);
            await loadEnvelopeData();
            await checkEnvelopeStatus();
            currentEnvTab = 'outbox';
            document.getElementById('env-tab-outbox').classList.add('active');
            document.getElementById('env-tab-inbox').classList.remove('active');
            document.getElementById('env-outbox-section').style.display = 'block';
            document.getElementById('env-inbox-section').style.display = 'none';
            document.getElementById('env-compose-form').style.display = 'none';
            document.getElementById('env-main-close-btn').style.display = 'flex';
            renderEnvelopeLists();
            showModal(document.getElementById('envelope-modal'));
        });
    }
    const galleryBanner = document.getElementById('gallery-banner-entry');
    if (galleryBanner) {
        galleryBanner.addEventListener('click', () => {
            window.open('https://aielin17.github.io/-/', '_blank');
        });
        galleryBanner.addEventListener('mousedown', () => { galleryBanner.style.transform = 'scale(0.97)'; });
        galleryBanner.addEventListener('mouseup', () => { galleryBanner.style.transform = 'scale(1)'; });
        galleryBanner.addEventListener('mouseleave', () => { galleryBanner.style.transform = 'scale(1)'; });
    }
const _sendEnvEl = document.getElementById('send-envelope');
if (_sendEnvEl) _sendEnvEl.addEventListener('click', handleSendEnvelope);

const _cancelEnvEl = document.getElementById('cancel-envelope');
if (_cancelEnvEl) _cancelEnvEl.addEventListener('click', () => {
    hideModal(document.getElementById('envelope-modal'));
});
            const closeFortune = document.getElementById('close-fortune');
            if (closeFortune) {
                closeFortune.addEventListener('click', () => {
                    hideModal(document.getElementById('fortune-lenormand-modal'));
                });
            }


            const _batchFavEl = document.getElementById('batch-favorite-function');
            if (_batchFavEl) _batchFavEl.addEventListener('click', () => {
                hideModal(DOMElements.favoritesModal.modal);
                toggleBatchFavoriteMode();
            });

            initReplyLibraryListeners();


            
            DOMElements.anniversaryAnimation.closeBtn.addEventListener('click', () => {
                DOMElements.anniversaryAnimation.modal.classList.remove('active');
            });


            const _statsFuncEl = document.getElementById('stats-function');
            if (_statsFuncEl) _statsFuncEl.addEventListener('click', () => {
                hideModal(DOMElements.advancedModal.modal);
                renderStatsContent();
                showModal(DOMElements.statsModal.modal);
            });

            const coinFunctionBtn = document.getElementById('coin-function');
            if (coinFunctionBtn) {
                coinFunctionBtn.addEventListener('click', () => {
                    hideModal(DOMElements.advancedModal.modal);
                    handleCoinToss();
                });
            }
            const musicToggle = document.getElementById('music-player-toggle');
            musicToggle.addEventListener('click', () => {
                settings.musicPlayerEnabled = !settings.musicPlayerEnabled;
                throttledSaveData();

                const player = document.getElementById('player');
                if (settings.musicPlayerEnabled) {
                    player.classList.add('visible');
                    showNotification('音乐播放器已开启', 'success');
                } else {
                    player.classList.remove('visible');
                    document.getElementById('playlist').classList.remove('active');
                    const audio = document.getElementById('audio');
                    if (audio) audio.pause();
                    showNotification('音乐播放器已关闭', 'info');
                }
                hideModal(DOMElements.advancedModal.modal);
            });
        }
    const annToggleBtn = document.getElementById('ann-toggle-btn');
    const annFormWrapper = document.getElementById('ann-form-wrapper');

    if (annToggleBtn && annFormWrapper) {
        annToggleBtn.addEventListener('click', () => {
            const isActive = annFormWrapper.classList.contains('active');
            
            if (isActive) {
                annFormWrapper.classList.remove('active');
                annToggleBtn.classList.remove('active');
            } else {
                annFormWrapper.classList.add('active');
                annToggleBtn.classList.add('active');
                
                setTimeout(() => {
                    annFormWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });
    }

        function getBubbleStyleName(style) {
            const names = {
                'standard': '标准',
                'rounded': '圆角',
                'rounded-large': '大圆角',
                'square': '方形'
            };
            return names[style] || '标准';
        }


        function initDataManagementListeners() {

            const _clearStorageEl = document.getElementById('clear-storage');
            if (_clearStorageEl) _clearStorageEl.addEventListener('click', clearAllAppData);
            const creditsBtn = document.getElementById('open-credits-btn');
            if (creditsBtn) {
                creditsBtn.addEventListener('click', () => {

                    hideModal(DOMElements.dataModal.modal);


                    const disclaimerModal = document.getElementById('disclaimer-modal');


                    if (disclaimerModal) {
                        showModal(disclaimerModal);
                    }
                });
            }

        }



        if (DOMElements.sessionModal.managerBtn) {
            DOMElements.sessionModal.managerBtn.addEventListener('click', () => {
                renderSessionList(); showModal(DOMElements.sessionModal.modal);
            });
        }
        DOMElements.sessionModal.createBtn.addEventListener('click', async () => {
            await createNewSession(false);
            renderSessionList();
            showNotification('新会话已创建', 'success');
        });

        DOMElements.sessionModal.list.addEventListener('click', (e) => {
            const item = e.target.closest('.session-item');
            if (!item) return;
            const sessionId = item.dataset.id;

            if (e.target.closest('.rename')) {
                const session = sessionList.find(s => s.id === sessionId);
                const newName = prompt('输入新的会话名称:', session.name);
                if (newName && newName.trim()) {
                    session.name = newName.trim();
                    localforage.setItem(`${APP_PREFIX}sessionList`, sessionList); 
                    renderSessionList();
                    showNotification('会话已重命名', 'success');
                }
            } else if (e.target.closest('.delete')) {
                if (sessionList.length <= 1) {
                    showNotification('无法删除最后一个会话', 'warning');
                    return;
                }
                if (confirm('确定要删除此会话及其所有聊天记录吗？此操作不可恢复')) {

                    const currentSessionId = SESSION_ID;

                    sessionList = sessionList.filter(s => s.id !== sessionId);
localforage.setItem(`${APP_PREFIX}sessionList`, sessionList);

// 同时清除 localStorage 和 localforage 中该会话的所有键
Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${APP_PREFIX}${sessionId}_`)) safeRemoveItem(key);
});
localforage.keys().then(keys => {
    keys.forEach(key => {
        if (key.startsWith(`${APP_PREFIX}${sessionId}_`)) {
            localforage.removeItem(key).catch(() => {});
        }
    });
}).catch(() => {});

if (sessionId === currentSessionId) {
    const newCurrentId = sessionList[0].id;
    localforage.setItem(`${APP_PREFIX}customThemes`, customThemes);
    window.location.hash = newCurrentId;
    window.location.reload();
} else {
    renderSessionList();
    showNotification('会话已删除', 'success');
}
                }
            } else {

                if (sessionId !== SESSION_ID) {
                    if (confirm('切换会话将刷新页面，确定要继续吗？')) {
                        window.location.hash = sessionId;
                        window.location.reload();
                    }
                }
            }
        });

        const initMusicPlayer = async () => {
    const latestSystemSongs = [{
                title: "虚拟", sub: "你是我朝夕相伴触手可及的虚拟", url: "https://files.catbox.moe/6s65mp.mp3"
            },
                {
                    title: "多远都要在一起", sub: "爱能克服远距离", url: "https://files.catbox.moe/06k9ra.mp3"
                },
                {
                    title: "永不失联的爱", sub: "这一辈子都不想失联的爱", url: "https://files.catbox.moe/uvucav.mp3"
                },
                {
                    title: "稳稳的幸福", sub: "这是我想要的幸福", url: "https://files.catbox.moe/inb22a.mp3"
                },
                {
                    title: "有我呢", sub: "我会让你习惯 多一个人陪伴", url: "https://files.catbox.moe/hrazjt"
                },
                {
                    title: "一千零一夜", sub: "梦里能到达的地方啊 有一天脚步也能到达", url: "https://files.catbox.moe/syfuon.mp3"
                },
                {
                    title: "月亮与六便士", sub: "我的世界由你建立 因你崩塌", url: "https://files.catbox.moe/98quqc.mp3"
                },
                {
                    title: "次元恋人", sub: "约好了隔着次元也吻住泪眼", url: "https://files.catbox.moe/5u5dy0.mp3"
                },
                {
                    title: "阳光下的星星", sub: "如果爱上你只是一个梦境", url: "https://files.catbox.moe/dxgqsk.mp3"
                },
                {
                    title: "周边", sub: "灵魂里空缺的那段", url: "https://files.catbox.moe/a7k5wd.mp3"
                },
                {
                    title: "恋爱ing", sub: "让我重新认识L O V E", url: "https://files.catbox.moe/94slcd.mp3"
                },
                {
                    title: "一点一滴", sub: "你让爱一点一滴汇成河", url: "https://files.catbox.moe/958qzg.mp3"
                },
                {
                    title: "关键词", sub: "让我见识爱情可以慷慨又自私", url: "https://files.catbox.moe/9yl5ic.mp3"
                },
                {
                    title: "想见你想见你想见你", sub: "穿越了千个万个时间线里人海里相依", url: "https://files.catbox.moe/co58d7.mp3"
                },
                {
                    title: "star crossing night", sub: "这里没有你", url: "https://files.catbox.moe/i3f86b.mp3"
                },
                {
                    title: "sea temple", sub: "If we have each other", url: "https://files.catbox.moe/c57gxs.mp3"
                },
                {
                    title: "我想要占据你", sub: "占据你的⼀切且无可厚非", url: "https://files.catbox.moe/1fp6eg.mp3"
                },
                {
                    title: "特别的人", sub: "我们是对方特别的人", url: "https://files.catbox.moe/a0n0l7.mp3"
                },
                {
                    title: "麦恩莉", sub: "在广阔寂寞漩涡解脱", url: "https://files.catbox.moe/2inae2.mp3"
                },
                {
                    title: "会呼吸的痛", sub: "想念是会呼吸的痛", url: "https://files.catbox.moe/0uhmxr.mp3"
                },
                {
                    title: "一生的爱", sub: "我只想要给你我一生的爱", url: "https://files.catbox.moe/f0e93c.mp3"
                },
                {
                    title: "身骑白马", sub: "追赶要我爱的不保留", url: "https://files.catbox.moe/iywfe2.mp3"
                },
                {
                    title: "爱情讯息", sub: "想念变成空气在叹息", url: "https://files.catbox.moe/4dl0t2.mp3"
                },
                {
                    title: "你在 不在", sub: "你在我心里面 陪我失眠", url: "https://files.catbox.moe/povyqa.mp3"
                },
                {
                    title: "你是我的风景", sub: "爱让悬崖变平地", url: "https://files.catbox.moe/fnwtf8.mp3"
                },
                {
                    title: "life with u", sub: "Now I know that you're the one", url: "https://files.catbox.moe/zqfxvd.mp3"
                },
                {
                    title: "勾指起誓", sub: "你是理所当然的奇迹", url: "https://files.catbox.moe/4spgo5.mp3"
                },
                {
                    title: "牵一半", sub: "你的存在是我唯一依赖", url: "https://files.catbox.moe/bk21gu.mp3"
                },
                {
                    title: "rove", sub: "Oh we are in the War of Love on Rove", url: "https://files.catbox.moe/sfwsuk.mp3"
                },
                {
                    title: "唯一", sub: "我真的爱你 句句不轻易", url: "https://files.catbox.moe/69g4fe.mp3"
                },
            { title: "致爱 Your Song", sub: "我只想每个落日 身边都有你", url: "https://files.catbox.moe/01bmnf.mp3" },
            { title: "一首想不通的古风", sub: "画地为牢 画命为符 铸成下一世坚守", url: "https://files.catbox.moe/9b4lh7.mp3" },
            { title: "茉莉雨", sub: "琴声里愁几许关于你", url: "https://files.catbox.moe/7ml83u.mp3" },
            { title: "怎么唱情歌", sub: "海 变的苦涩 灼伤一片温柔", url: "https://files.catbox.moe/isqax9.mp3" },
            { title: "岸边客", sub: "你回来我心未改 你不在我还等待", url: "https://files.catbox.moe/9oud6s.mp3" },
            { title: "江南雪", sub: "相思再无药解 从此万般风月都是我心结", url: "https://files.catbox.moe/hhjwek.mp3" },
            { title: "不死之身", sub: "我仍爱你爱得不知天高地厚", url: "https://files.catbox.moe/g960ev.mp3" },
            { title: "我们的明天", sub: "爱从不曾保留 才勇敢了我", url: "https://files.catbox.moe/a3yjvv.mp3" },
            { title: "难解", sub: "点炷高香敬予神明 被人嘲笑矢志不渝", url: "https://files.catbox.moe/1u8m3r.mp3" },
            { title: "最好的我 & 50 Feet", sub: "试着伸手 却连你的影子我都无法靠近", url: "https://files.catbox.moe/clsiyi.mp3" },
            { title: "同手同脚", sub: "也是存在在这个世界 唯一的唯一", url: "https://files.catbox.moe/b8hss3.mp3" },
            { title: "同花顺", sub: "只要肯爱得深 是不是就有这可能", url: "https://files.catbox.moe/28mw5d.mp3" },
            { title: "轻舞", sub: "轻舞吧 过往如裙纱", url: "https://files.catbox.moe/8n9lhi.mp3" },
            { title: "绝对占有 相对自由", sub: "赞美你包容你都是我的使命", url: "https://files.catbox.moe/zi4gxo.mp3" },
            { title: "千万次想象", sub: "我千万次想象 千万次模仿 思念的形状", url: "https://files.catbox.moe/4jtex8.mp3" },
            { title: "辞家千里", sub: "穿过无人问津去见山海万顷", url: "https://files.catbox.moe/2quy44.mp3" },
            { title: "Ryukyuvania", sub: "----", url: "https://files.catbox.moe/utmbqp.mp3" },
            { title: "沦陷", sub: "圈它在黑暗中逃不出的梦魇", url: "https://files.catbox.moe/0bhl3i.mp3" },
            { title: "晚枫歌", sub: "你又怎知我从未放手", url: "https://files.catbox.moe/xhwrwy.mp3" },
            { title: "I Need U", sub: "I need you girl", url: "https://files.catbox.moe/v1k4h8.mp3" },
            { title: "若梦", sub: "日升月落 此生依旧难舍", url: "https://files.catbox.moe/6uysqy.mp3" },
            { title: "爱人", sub: "可是恨的人没死成 爱的人没可能", url: "https://files.catbox.moe/wtbdxe.mp3" },
            { title: "星河叹", sub: "我盼孤身纵马 笛声漫天 四海任我游", url: "https://files.catbox.moe/de7g2m.mp3" },
            { title: "爱殇", sub: "假欢畅 又何妨 无人共享", url: "https://files.catbox.moe/or2hm7.mp3" },
            { title: "Una mattina", sub: "----", url: "https://files.catbox.moe/nf8o90.mp3" },
            { title: "顺其自然", sub: "You light up my heart", url: "https://files.catbox.moe/na01cn.mp3" },
            { title: "初见", sub: "若如初见 为谁而归", url: "https://files.catbox.moe/bumolx.mp3" },
            { title: "我好像在哪见过你", sub: "人们把难言的爱都埋入土壤里", url: "https://files.catbox.moe/vcidpc.mp3" },
            { title: "别回头", sub: "爱是年少时不堪其重 渗透灵魂的一阵剧痛", url: "https://files.catbox.moe/h1hwo5.mp3" },
            { title: "大鱼", sub: "怕你飞远去 怕你离我而去", url: "https://files.catbox.moe/jlcvkg.mp3" },
            { title: "人鱼的眼泪", sub: "Baby Don't cry", url: "https://files.catbox.moe/40fm4j.mp3" },
            { title: "九张机", sub: "我愿化作望断天涯那一方青石", url: "https://files.catbox.moe/hql6w5.mp3" },
            { title: "梦幻诛仙", sub: "来世若再会还与你双双对对", url: "https://files.catbox.moe/r6btwp.mp3" },
            { title: "寻常歌", sub: "所幸不过是 寻常人间事", url: "https://files.catbox.moe/ntcqvr.mp3" },
{ title: "公示情书", sub: "有种微妙确定的幸福 叫对方正在输入", url: "https://files.catbox.moe/rptwer.mp3" },
{ title: "现在那边是几点", sub: "请问你现在那边是几点 会不会还放有我的照片", url: "https://files.catbox.moe/icv2aa.mp3" },
{ title: "情人", sub: "气氛开始升温 危险又迷人", url: "https://files.catbox.moe/iqairg.mp3" },
{ title: "怜悯", sub: "我要带着爱意着恨你", url: "https://files.catbox.moe/242a1h.mp3" },
{ title: "疑心病", sub: "你终于说出口你对我感情也很重", url: "https://files.catbox.moe/jc1umm.mp3" },
{ title: "诀爱", sub: "若灵魂相结在天地之间", url: "https://files.catbox.moe/quqaws.mp3" },
{ title: "彼岸", sub: "她捧起镜花水月 一刹那湮灭", url: "https://files.catbox.moe/zxepep.mp3" },
{ title: "问情", sub: "当爱恨如潮生多残忍", url: "https://files.catbox.moe/erds0n.mp3" },
{ title: "同进退", sub: "我会牵着你手同进退 佛前立誓不后悔", url: "https://files.catbox.moe/vb6chf.mp3" },
{ title: "招摇", sub: "一句此生不换", url: "https://files.catbox.moe/oc86ih.mp3" },
{ title: "你要的全拿走", sub: "好聚好散听着也楚楚可怜", url: "https://files.catbox.moe/ok2e3s.mp3" },
{ title: "云裳羽衣曲", sub: "故事鲜艳而缘分却太浅", url: "https://files.catbox.moe/njnbhv.mp3" },
{ title: "大梦归离", sub: "终于听风儿说 知道你在哪里", url: "https://files.catbox.moe/5z67vs.mp3" },
{ title: "偏向", sub: "为何会两败俱伤", url: "https://files.catbox.moe/i37f39.mp3" },
{ title: "Love me like you do", sub: "You're the only thing I wanna touch", url: "https://files.catbox.moe/arym0i.mp3" },
{ title: "Not snow,but U", sub: "我期待的不是雪而是有你的冬天", url: "https://files.catbox.moe/6rk4gw.mp3" },
{ title: "The Evergreen", sub: "我恍然明了我所需的一切已尽数摆在眼前", url: "https://files.catbox.moe/ca3rim.mp3" },
{ title: "冥河螺旋", sub: "我如此希望 我伴你左右", url: "https://files.catbox.moe/xtj8db.mp3" },
{ title: "熄灭", sub: "你总问我在一起会不会感到厌倦", url: "https://files.catbox.moe/wnzxou.mp3" },
{ title: "爱人错过", sub: "我肯定在几百年前就说过爱你", url: "https://files.catbox.moe/q2nx16.mp3" },
{ title: "我想念", sub: "我想念你说过的那种永远", url: "https://files.catbox.moe/3qxads.mp3" },
{ title: "此生不换", sub: "再有一万年深情也不变", url: "https://files.catbox.moe/72ik88.mp3" },
{ title: "鳥の詩", sub: "----", url: "https://files.catbox.moe/966u00.mp3" }

    ];

    const uploadCoverBtn = document.getElementById('upload-cover-btn');
    const coverInput = document.getElementById('cover-input');
    const vinylRecord = document.getElementById('vinyl-record-visual');

    const applyPlayerCover = (base64Data) => {
        if (base64Data) {
            vinylRecord.style.backgroundImage = `url(${base64Data})`;
            vinylRecord.style.backgroundSize = 'cover';
            vinylRecord.style.backgroundPosition = 'center';
            vinylRecord.style.backgroundColor = 'transparent';
            vinylRecord.classList.add('has-cover');
            vinylRecord.style.borderWidth = '1px';
        } else {
            vinylRecord.style.backgroundImage = '';
            vinylRecord.style.backgroundColor = '';
            vinylRecord.classList.remove('has-cover');
            vinylRecord.style.borderWidth = '2px';
        }
    };

const savedCover = safeGetItem(APP_PREFIX + 'playerCover');

    localforage.getItem(APP_PREFIX + 'playerCover').then(cover => { if(cover) applyPlayerCover(cover); });
    if (savedCover) applyPlayerCover(savedCover);

    uploadCoverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (vinylRecord.classList.contains('has-cover')) {
            if (confirm('想要重置回默认的【主题色黑胶】样式吗？\n\n• 点击【确定】恢复默认\n• 点击【取消】选择新图片')) {
                localforage.removeItem(APP_PREFIX + 'playerCover');
                applyPlayerCover(null);
                showNotification('已恢复默认黑胶样式', 'success');
                return;
            }
        }
        coverInput.click();
    });

    coverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            showNotification('图片太大了，请上传 2MB 以内的图片', 'error');
            return;
        }
        cropImageToSquare(file, 200).then(base64Data => {
            try {
                localforage.setItem(APP_PREFIX + 'playerCover', base64Data);
                applyPlayerCover(base64Data);
                showNotification('专辑封面设置成功！', 'success');
            } catch (err) {
                console.error(err);
                showNotification('图片存储失败（可能超出了浏览器限制）', 'error');
            }
        }).catch(() => {
            showNotification('图片处理失败，请重试', 'error');
        });
        e.target.value = '';
    });
// 在 initMusicPlayer 函数内部，找到变量声明区域（约在 let songs = [] 附近），添加以下代码：

// 搜索相关状态
let searchResults = [];           // 搜索结果
let isSearchingOnline = false;    // 是否正在搜索在线歌曲
let searchDebounceTimer = null;   // 搜索防抖
    let songs = [];
    try {
        const savedSongs = await localforage.getItem(APP_PREFIX + 'customSongs');
        if (savedSongs && Array.isArray(savedSongs) && savedSongs.length > 0) {
            songs = savedSongs;
        } else if (savedSongs && typeof savedSongs === 'string') {
            songs = JSON.parse(savedSongs);
            await localforage.setItem(APP_PREFIX + 'customSongs', songs);
        } else {
            const legacyStr = safeGetItem(APP_PREFIX + 'customSongs');
            if (legacyStr) {
                try {
                    songs = JSON.parse(legacyStr);
                    await localforage.setItem(APP_PREFIX + 'customSongs', songs);
                    safeRemoveItem(APP_PREFIX + 'customSongs');
                } catch(e) {
                    songs = [...latestSystemSongs];
                }
            } else {
                songs = [...latestSystemSongs];
            }
        }
    } catch(e) {
        console.error('加载歌单失败，使用默认歌单', e);
        songs = [...latestSystemSongs];
    }

    const player = document.getElementById('player');
    const miniView = document.getElementById('mini-view');
    const playlist = document.getElementById('playlist');
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const progressArea = document.getElementById('progress-area');

    const addSongModal = document.getElementById('add-song-modal');
    const newSongTitle = document.getElementById('new-song-title');
    const newSongSub = document.getElementById('new-song-sub');
    const newSongUrl = document.getElementById('new-song-url');
    const confirmAddSongBtn = document.getElementById('confirm-add-song');
    const cancelAddSongBtn = document.getElementById('cancel-add-song');
    const modalTitleElem = addSongModal.querySelector('.modal-title span');

    let currentIndex = 0;
    let isPlaying = false;
    let playMode = 'sequence';
    let editModeIndex = -1;
    let searchTerm = '';
    let isSearchVisible = false;

    function loadSong(index) {
        if (songs.length === 0) return;
        if (index >= songs.length) index = 0;
        if (index < 0) index = songs.length - 1;

        const song = songs[index];
        document.getElementById('music-title').innerText = song.title;
        document.getElementById('music-subtitle').innerText = song.sub;
        
        if (song.url) audio.src = song.url;
        updatePlaylistHighlight();
    }

    function togglePlay() {
        if (songs.length === 0) {
            showNotification('播放列表为空', 'warning');
            return;
        }
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            document.getElementById('icon-play').style.display = 'block';
            document.getElementById('icon-pause').style.display = 'none';
            player.classList.remove('playing');
        } else {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    isPlaying = true;
                    document.getElementById('icon-play').style.display = 'none';
                    document.getElementById('icon-pause').style.display = 'block';
                    player.classList.add('playing');
                }).catch(error => {
                    console.error(error);
                    showNotification('播放失败，请检查网络或链接是否有效', 'error');
                });
            }
        }
    }

    function nextSong() {
        if (songs.length === 0) return;
        if (playMode === 'single') { loadSong(currentIndex); }
        else if (playMode === 'shuffle') currentIndex = Math.floor(Math.random() * songs.length);
        else currentIndex = (currentIndex + 1) % songs.length;
        if (playMode !== 'single') loadSong(currentIndex);
        if (isPlaying) audio.play();
    }

    function prevSong() {
        if (songs.length === 0) return;
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(currentIndex);
        if (isPlaying) audio.play();
    }

    function savePlaylist() {
        localforage.setItem(APP_PREFIX + 'customSongs', songs).catch(e => {
            console.error('歌单保存失败', e);
            showNotification('歌单保存失败，存储空间可能已满', 'error');
        });
        renderPlaylist();
    }

    function openEditModal(index) {
        const song = songs[index];
        if (!song) return;
        editModeIndex = index;
        newSongTitle.value = song.title;
        newSongSub.value = song.sub;
        newSongUrl.value = song.url;
        modalTitleElem.innerText = "编辑歌曲信息";
        confirmAddSongBtn.innerText = "保存修改";
        showModal(addSongModal);
    }

    function openAddModal() {
        editModeIndex = -1;
        newSongTitle.value = '';
        newSongSub.value = '';
        newSongUrl.value = '';
        modalTitleElem.innerText = "添加自定义歌曲";
        confirmAddSongBtn.innerText = "添加播放";
        showModal(addSongModal);
    }

    function renderPlaylist() {
        playlist.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'playlist-header';
        header.innerHTML = `
    <div class="pl-header-title">˙°ʚᕱ⑅ᕱɞ°˙</div>
    <div class="pl-header-actions">
        <button class="pl-icon-btn" id="pl-manage-btn" title="歌单管理"><i class="fas fa-folder-open"></i></button>
        <button class="pl-icon-btn ${isSearchVisible ? 'active' : ''}" id="pl-search-toggle" title="搜索"><i class="fas fa-search"></i></button>
        <button class="pl-icon-btn" id="pl-add-btn" title="添加歌曲"><i class="fas fa-plus"></i></button>
    </div>
    <input type="file" id="pl-import-input" accept=".json" style="display:none">
`;
        playlist.appendChild(header);

        const searchWrapper = document.createElement('div');
        searchWrapper.className = `playlist-search-wrapper ${isSearchVisible ? 'active' : ''}`;
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'playlist-search-input';
        searchInput.placeholder = '';
        searchInput.value = searchTerm;
        
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderListContent(contentDiv);
        });
        
        searchWrapper.appendChild(searchInput);
        playlist.appendChild(searchWrapper);

        const contentDiv = document.createElement('div');
        contentDiv.className = 'playlist-content';
        playlist.appendChild(contentDiv);

        renderListContent(contentDiv);

        header.querySelector('#pl-add-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openAddModal();
            newSongTitle.focus();
        });
        header.querySelector('#pl-manage-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
            overlay.innerHTML = `
                <div style="background:var(--secondary-bg);border-radius:16px;padding:20px;width:280px;box-shadow:0 10px 40px rgba(0,0,0,0.3);border:1px solid var(--border-color);display:flex;flex-direction:column;gap:12px;">
                    <div style="text-align:center;font-weight:600;margin-bottom:5px;">歌单管理</div>
                    
                    <button id="_pl_opt_import" style="padding:12px;border-radius:10px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);cursor:pointer;display:flex;align-items:center;gap:10px;font-size:14px;transition:0.2s;">
                        <div style="width:32px;height:32px;background:rgba(var(--accent-color-rgb),0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--accent-color);"><i class="fas fa-file-import"></i></div>
                        导入歌单文件
                    </button>
                 <button id="_pl_opt_search" style="padding:12px;border-radius:10px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);cursor:pointer;display:flex;align-items:center;gap:10px;font-size:14px;transition:0.2s;">
    <div style="width:32px;height:32px;background:rgba(var(--accent-color-rgb),0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--accent-color);"><i class="fas fa-search"></i></div>
    在线搜索歌曲
</button>
                    <button id="_pl_opt_export" style="padding:12px;border-radius:10px;border:1px solid var(--border-color);background:var(--primary-bg);color:var(--text-primary);cursor:pointer;display:flex;align-items:center;gap:10px;font-size:14px;transition:0.2s;">
                        <div style="width:32px;height:32px;background:rgba(var(--accent-color-rgb),0.1);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--accent-color);"><i class="fas fa-file-export"></i></div>
                        导出当前歌单
                    </button>
                    
                    <button id="_pl_opt_cancel" style="padding:10px;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:13px;margin-top:5px;">取消</button>
                </div>
            `;
            document.body.appendChild(overlay);

            const closeOpt = () => overlay.remove();
            overlay.addEventListener('click', (ev) => { if(ev.target === overlay) closeOpt(); });
            document.getElementById('_pl_opt_cancel').onclick = closeOpt;

            document.getElementById('_pl_opt_export').onclick = () => {
                closeOpt();
                if (songs.length === 0) {
                    showNotification('歌单为空，无法导出', 'warning');
                    return;
                }
                const dataStr = JSON.stringify(songs, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `music-playlist-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showNotification('歌单导出成功', 'success');
            };
// 在 document.getElementById('_pl_opt_export').onclick 之后添加：

document.getElementById('_pl_opt_search').onclick = () => {
    closeOpt();
    showOnlineSearchDialog();
};
            document.getElementById('_pl_opt_import').onclick = () => {
                closeOpt();
                const input = header.querySelector('#pl-import-input');
                if (input) input.click();
            };
        });
        header.querySelector('#pl-import-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const importedSongs = JSON.parse(ev.target.result);
                    if (!Array.isArray(importedSongs)) throw new Error('格式错误');
                    
                    if (confirm(`检测到 ${importedSongs.length} 首歌曲。\n点击【确定】覆盖当前歌单\n点击【取消】追加到当前歌单末尾`)) {
                        songs = importedSongs;
                        showNotification('歌单已覆盖', 'success');
                    } else {
                        songs = [...songs, ...importedSongs];
                        showNotification(`已追加 ${importedSongs.length} 首歌曲`, 'success');
                    }
                    
                    savePlaylist();
                    if (songs.length > 0 && currentIndex >= songs.length) {
                        currentIndex = 0;
                        loadSong(0);
                    }
                } catch (err) {
                    console.error(err);
                    showNotification('导入失败：文件格式不正确', 'error');
                }
            };
            reader.readAsText(file);
            e.target.value = ''; 
        });
        header.querySelector('#pl-search-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            isSearchVisible = !isSearchVisible;
            searchWrapper.classList.toggle('active', isSearchVisible);
            e.currentTarget.classList.toggle('active', isSearchVisible);
            if (isSearchVisible) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }

    function renderListContent(container) {
        container.innerHTML = '';
        
        const filteredSongs = songs.map((s, i) => ({...s, originalIndex: i}))
                                   .filter(s => s.title.toLowerCase().includes(searchTerm) || 
                                                s.sub.toLowerCase().includes(searchTerm));

        if (filteredSongs.length === 0) {
            container.innerHTML = `<div class="empty-search-result">未找到 "${searchTerm}" 相关歌曲</div>`;
            return;
        }

        filteredSongs.forEach((song) => {
            const realIndex = song.originalIndex;

            const div = document.createElement('div');
            div.className = 'playlist-item';
            if (realIndex === currentIndex) div.classList.add('playing');

            const highlightText = (text, term) => {
                if (!term) return text;
                const regex = new RegExp(`(${term})`, 'gi');
                return text.replace(regex, '<span class="highlight">$1</span>');
            };

            const displayTitle = highlightText(song.title, searchTerm);
            const displaySub = highlightText(song.sub, searchTerm);

            div.innerHTML = `
                <div class="song-info">
                    <div class="song-title-row">${displayTitle}</div>
                    <div class="song-sub-row">${displaySub}</div>
                </div>
                <div class="item-actions">
                    ${song.isCustom ? '<span class="custom-tag" title="自定义歌曲"></span>' : ''}
                    <span class="action-icon-btn delete" title="移除">&times;</span>
                </div>
            `;

            if (song.isCustom) {
                div.querySelector('.custom-tag').addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditModal(realIndex);
                });
            }

            div.querySelector('.delete').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`确定移除《${song.title}》吗？`)) {
                    songs.splice(realIndex, 1);
                    savePlaylist();
                    
                    if (realIndex === currentIndex) {
                        if (songs.length > 0) {
                            currentIndex = realIndex % songs.length;
                            loadSong(currentIndex);
                            if (isPlaying) audio.play();
                        } else {
                            audio.pause();
                            isPlaying = false;
                            loadSong(0);
                        }
                    } else if (realIndex < currentIndex) {
                        currentIndex--;
                    }
                }
            });

            div.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = realIndex;
                loadSong(currentIndex);
                if (!isPlaying) togglePlay();
                else audio.play();
            });

            container.appendChild(div);
        });
    }

    function updatePlaylistHighlight() {
        const contentDiv = playlist.querySelector('.playlist-content');
        if (contentDiv) renderListContent(contentDiv);
    }

    confirmAddSongBtn.addEventListener('click', () => {
        const title = newSongTitle.value.trim();
        const sub = newSongSub.value.trim();
        const url = newSongUrl.value.trim();

        if (!title || !url) {
            showNotification('歌名和链接不能为空', 'error');
            return;
        }

        const songData = {
            title,
            sub: sub || '未知艺术家',
            url,
            isCustom: true
        };

        if (editModeIndex >= 0) {
            songs[editModeIndex] = songData;
            showNotification('歌曲信息已修改', 'success');
        } else {
            songs.unshift(songData);
            showNotification('歌曲已添加', 'success');
            if (songs.length === 1) loadSong(0);
        }

        searchTerm = '';
        savePlaylist();
        newSongTitle.value = '';
        newSongSub.value = '';
        newSongUrl.value = '';
        hideModal(addSongModal);
    });

    cancelAddSongBtn.addEventListener('click', () => {
        hideModal(addSongModal);
    });

    function setupDrag() {
        let isDragging = false, startX, startY, initialLeft, initialTop, hasMoved = false;
        const dragStart = (e) => {
            if (e.target.closest('.btn') || e.target.closest('.progress-wrapper') || e.target.closest('.playlist-popup')) return;
            const event = e.type === 'touchstart' ? e.touches[0] : e;
            isDragging = true; hasMoved = false;
            startX = event.clientX; startY = event.clientY;
            const rect = player.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            player.style.transition = 'none';
            playlist.style.transition = 'none';
        };
        const dragMove = (e) => {
            if (!isDragging) return;
            if (e.cancelable) e.preventDefault();
            const event = e.type === 'touchmove' ? e.touches[0] : e;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;
            const maxLeft = window.innerWidth - player.offsetWidth;
            const maxTop = window.innerHeight - player.offsetHeight;
            player.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            player.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            const rect = player.getBoundingClientRect();
            playlist.style.left = rect.left + 'px';
playlist.style.top = (rect.top + (player.classList.contains('collapsed') ? 65 : 155)) + 'px';
};
        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            player.style.transition = '';
            playlist.style.transition = '';
        };
        player.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        player.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);

        miniView.addEventListener('click', () => {
            if (!hasMoved && player.classList.contains('collapsed')) {
                player.classList.remove('collapsed');
                setTimeout(() => {
                    const rect = player.getBoundingClientRect();
                    playlist.style.top = (rect.top + 150) + 'px';
                }, 300);
            }
        });
    }

    playBtn.addEventListener('click', togglePlay);
    const _next_btnEl = document.getElementById('next-btn');
    if (_next_btnEl) _next_btnEl.addEventListener('click', nextSong);
    const _prev_btnEl = document.getElementById('prev-btn');
    if (_prev_btnEl) _prev_btnEl.addEventListener('click', prevSong);
    const _minimize_btnEl = document.getElementById('minimize-btn');
    if (_minimize_btnEl) _minimize_btnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        player.classList.add('collapsed');
        playlist.classList.remove('active');
    });

    progressArea.addEventListener('click', (e) => {
        const width = progressArea.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) audio.currentTime = (clickX / width) * duration;
    });

    audio.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.target;
        if (duration) document.getElementById('progress-bar').style.width = `${(currentTime / duration) * 100}%`;
    });
    audio.addEventListener('ended', nextSong);

    const _mode_btnEl = document.getElementById('mode-btn');
    if (_mode_btnEl) _mode_btnEl.addEventListener('click', () => {
        if (playMode === 'sequence') { playMode = 'single'; }
        else if (playMode === 'single') { playMode = 'shuffle'; }
        else { playMode = 'sequence'; }
        document.getElementById('icon-loop').style.display   = playMode === 'sequence' ? 'block' : 'none';
        document.getElementById('icon-single').style.display = playMode === 'single'   ? 'block' : 'none';
        document.getElementById('icon-shuffle').style.display= playMode === 'shuffle'  ? 'block' : 'none';
        const labels = { sequence: '顺序播放', single: '单曲循环', shuffle: '随机播放' };
        showNotification(labels[playMode], 'info', 1000);
    });

    const listBtn = document.getElementById('list-btn');
    listBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = player.getBoundingClientRect();
        playlist.style.left = rect.left + 'px';
        playlist.style.top = (rect.top + (player.classList.contains('collapsed') ? 62 : 150)) + 'px';
        playlist.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!playlist.contains(e.target) && !listBtn.contains(e.target) && !player.contains(e.target) && !e.target.closest('#add-song-modal')) {
            playlist.classList.remove('active');
        }
    });
// 显示在线搜索对话框
function showOnlineSearchDialog() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
    
    overlay.innerHTML = `
        <div style="
            background:var(--secondary-bg);border-radius:20px;padding:24px;
            width:92%;max-width:450px;max-height:85vh;
            display:flex;flex-direction:column;
            box-shadow:0 20px 60px rgba(0,0,0,0.4);
            animation:modalContentSlideIn 0.3s ease forwards;
        ">
            <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px;flex-shrink:0;">
                <i class="fas fa-music" style="color:var(--accent-color);"></i>
                <span>在线搜索歌曲</span>
            </div>
            
            <div style="display:flex;gap:8px;margin-bottom:16px;flex-shrink:0;">
                <input type="text" id="online-search-input" placeholder="输入歌曲名或歌手..." style="
                    flex:1;padding:12px 16px;border:1.5px solid var(--border-color);
                    border-radius:12px;background:var(--primary-bg);color:var(--text-primary);
                    font-size:14px;font-family:var(--font-family);outline:none;
                    transition:border-color 0.2s;
                ">
                <button id="online-search-btn" style="
                    padding:0 20px;border:none;border-radius:12px;
                    background:var(--accent-color);color:#fff;
                    font-size:14px;font-weight:600;cursor:pointer;
                    font-family:var(--font-family);display:flex;
                    align-items:center;gap:6px;white-space:nowrap;
                ">
                    <i class="fas fa-search"></i> 搜索
                </button>
            </div>
            
            <div id="search-loading" style="display:none;text-align:center;padding:40px;color:var(--text-secondary);flex:1;">
                <div class="history-spinner" style="margin:0 auto;"></div>
                <p style="margin-top:15px;">正在搜索...</p>
            </div>
            
            <div id="search-results-container" style="
                flex:1;overflow-y:auto;min-height:200px;
                display:flex;flex-direction:column;gap:8px;
            ">
                <div style="text-align:center;padding:40px;color:var(--text-secondary);font-size:13px;">
                    <i class="fas fa-search" style="font-size:32px;opacity:0.3;margin-bottom:12px;display:block;"></i>
                    输入关键词开始搜索
                </div>
            </div>
            
            <div style="display:flex;gap:10px;margin-top:16px;flex-shrink:0;">
                <button id="search-cancel" style="
                    flex:1;padding:12px;border:1.5px solid var(--border-color);
                    border-radius:12px;background:none;color:var(--text-secondary);
                    font-size:13px;cursor:pointer;font-family:var(--font-family);
                ">关闭</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const searchInput = overlay.querySelector('#online-search-input');
    const searchBtn = overlay.querySelector('#online-search-btn');
    const loadingEl = overlay.querySelector('#search-loading');
    const resultsContainer = overlay.querySelector('#search-results-container');
    const cancelBtn = overlay.querySelector('#search-cancel');
    
    const closeDialog = () => overlay.remove();
    
    cancelBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
    
    // 执行搜索
    async function performSearch() {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            showNotification('请输入搜索关键词', 'warning');
            return;
        }
        
        resultsContainer.style.display = 'none';
        loadingEl.style.display = 'block';
        
        try {
            const results = await searchOnlineSongs(keyword);
            loadingEl.style.display = 'none';
            resultsContainer.style.display = 'flex';
            
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div style="text-align:center;padding:40px;color:var(--text-secondary);font-size:13px;">
                        <i class="fas fa-music" style="font-size:32px;opacity:0.3;margin-bottom:12px;display:block;"></i>
                        未找到相关歌曲
                    </div>
                `;
                return;
            }
            
            renderSearchResults(results, resultsContainer, closeDialog);
        } catch (error) {
            console.error('搜索失败:', error);
            loadingEl.style.display = 'none';
            resultsContainer.style.display = 'flex';
            resultsContainer.innerHTML = `
                <div style="text-align:center;padding:40px;color:#ff6b6b;font-size:13px;">
                    <i class="fas fa-exclamation-circle" style="font-size:32px;opacity:0.5;margin-bottom:12px;display:block;"></i>
                    搜索失败，请重试
                </div>
            `;
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    // 自动聚焦
    setTimeout(() => searchInput.focus(), 100);
}

// 搜索在线歌曲（调用网易云API）
async function searchOnlineSongs(keyword) {
    const API_BASE = 'https://api.bugpk.com/api/163_music';
    
    try {
        const response = await fetch(`${API_BASE}?type=search&keywords=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        
        if (data.code === 200 && data.data && data.data.songs) {
            return data.data.songs.map(song => ({
                id: song.id,
                title: song.name || '未知歌曲',
                sub: song.artists || '未知歌手',
                url: null, // URL需要单独获取
                picUrl: song.picUrl || null,
                isCustom: true,
                source: 'netease'
            }));
        }
        return [];
    } catch (error) {
        console.error('在线搜索失败:', error);
        throw error;
    }
}

// 获取歌曲播放URL
async function getSongUrl(songId) {
    const API_BASE = 'https://api.bugpk.com/api/163_music';
    
    try {
        const response = await fetch(`${API_BASE}?type=url&id=${songId}`);
        const data = await response.json();
        
        if (data.code === 200 && data.data && data.data[0] && data.data[0].url) {
            return data.data[0].url;
        }
        return null;
    } catch (error) {
        console.error('获取歌曲URL失败:', error);
        return null;
    }
}

// 渲染搜索结果
function renderSearchResults(results, container, closeDialog) {
    container.innerHTML = '';
    
    results.forEach((song, index) => {
        const item = document.createElement('div');
        item.style.cssText = `
            display:flex;align-items:center;gap:12px;padding:12px;
            border-radius:12px;border:1px solid var(--border-color);
            background:var(--primary-bg);cursor:pointer;
            transition:all 0.2s;
        `;
        item.onmouseover = () => { item.style.background = 'var(--secondary-bg)'; item.style.borderColor = 'var(--accent-color)'; };
        item.onmouseout = () => { item.style.background = 'var(--primary-bg)'; item.style.borderColor = 'var(--border-color)'; };
        
        item.innerHTML = `
            ${song.picUrl ? `
                <img src="${song.picUrl}" style="width:48px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;">
            ` : `
                <div style="width:48px;height:48px;border-radius:8px;background:rgba(var(--accent-color-rgb),0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i class="fas fa-music" style="color:var(--accent-color);"></i>
                </div>
            `}
            <div style="flex:1;min-width:0;">
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${song.title}</div>
                <div style="font-size:12px;color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${song.sub}</div>
            </div>
            <button class="add-song-btn" data-index="${index}" style="
                padding:6px 14px;border:none;border-radius:8px;
                background:var(--accent-color);color:#fff;
                font-size:12px;cursor:pointer;white-space:nowrap;
            ">
                <i class="fas fa-plus"></i> 添加
            </button>
        `;
        
        container.appendChild(item);
        
        // 添加按钮事件
        item.querySelector('.add-song-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            const btn = e.target.closest('.add-song-btn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 获取中';
            
            try {
                const url = await getSongUrl(song.id);
                if (!url) {
                    showNotification('无法获取歌曲播放链接', 'error');
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-plus"></i> 添加';
                    return;
                }
                
                // 添加到歌单
                const newSong = {
                    title: song.title,
                    sub: song.sub,
                    url: url,
                    isCustom: true
                };
                
                songs.unshift(newSong);
                savePlaylist();
                
                showNotification(`已添加「${song.title}」到歌单`, 'success');
                
                // 如果歌单之前为空，自动播放
                if (songs.length === 1) {
                    currentIndex = 0;
                    loadSong(0);
                }
                
                btn.innerHTML = '<i class="fas fa-check"></i> 已添加';
                btn.style.background = '#51cf66';
                
            } catch (error) {
                console.error('添加失败:', error);
                showNotification('添加失败，请重试', 'error');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-plus"></i> 添加';
            }
        });
        
        // 点击整行也可以预览（可选）
        item.addEventListener('click', async (e) => {
            if (e.target.closest('.add-song-btn')) return;
            
            // 预览功能：获取URL并播放
            const url = await getSongUrl(song.id);
            if (url) {
                // 临时播放预览
                const tempAudio = new Audio(url);
                tempAudio.play().catch(() => {
                    showNotification('预览播放失败', 'warning');
                });
            }
        });
    });
}
    loadSong(0);
    renderPlaylist();
    setupDrag();

    if (settings.musicPlayerEnabled) {
        player.classList.add('visible');
    }
};

        function initCoreListeners() {


            DOMElements.chatContainer.addEventListener('scroll', () => {
                const container = DOMElements.chatContainer;


                if (container.scrollTop < 50 && !isLoadingHistory && messages.length > displayedMessageCount) {
                    isLoadingHistory = true;


                    const loader = document.getElementById('history-loader');
                    if (loader) loader.classList.add('visible');


                    setTimeout(() => {

                        displayedMessageCount += HISTORY_BATCH_SIZE;


                        renderMessages(true);


                        if (loader) loader.classList.remove('visible');
                        isLoadingHistory = false;
                    },
                        600);
                }
            });

            DOMElements.sendBtn.addEventListener('click', () => isBatchMode ? addToBatch(): sendMessage());
            DOMElements.messageInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); isBatchMode ? addToBatch(): sendMessage();
                }
            });
            DOMElements.messageInput.addEventListener('input', () => {
                DOMElements.messageInput.style.height = 'auto'; DOMElements.messageInput.style.height = `${Math.min(DOMElements.messageInput.scrollHeight, 120)}px`;
            });


            DOMElements.attachmentBtn.addEventListener('click', () => {

                const modal = document.createElement('div');
                modal.className = 'modal image-upload-modal';
                modal.style.cssText = `
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
            opacity: 0;
            transition: opacity 0.3s ease;
            `;

                modal.innerHTML = `
            <div class="modal-content" style="
            z-index: 10000;
            position: relative;
            background-color: var(--secondary-bg);
            border-radius: var(--radius);
            padding: 24px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            ">
            <div class="modal-title"><i class="fas fa-image"></i><span>发送图片</span></div>
            <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button class="modal-btn modal-btn-secondary upload-mode-btn active" id="upload-image-file-btn" style="flex: 1;">选择文件</button>
            <button class="modal-btn modal-btn-secondary upload-mode-btn" id="paste-image-url-btn" style="flex: 1;">粘贴URL</button>
            </div>
            <input type="file" class="modal-input" id="image-file-input" accept="image/*">
            <input type="text" class="modal-input" id="image-url-input" placeholder="输入图片URL地址" style="display: none;">
            <div id="image-preview" style="text-align: center; margin-top: 10px; display: none;">
            <img id="preview-chat-image" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--border-color);">
            </div>
            </div>
            <div class="modal-buttons">
            <button class="modal-btn modal-btn-secondary" id="cancel-image">取消</button>
            <button class="modal-btn modal-btn-primary" id="send-image" disabled>发送</button>
            </div>
            </div>
            `;

                document.body.appendChild(modal);


                setTimeout(() => {
                    modal.style.opacity = '1';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }, 10);

                const fileInput = document.getElementById('image-file-input');
                const urlInput = document.getElementById('image-url-input');
                const uploadBtn = document.getElementById('upload-image-file-btn');
                const pasteUrlBtn = document.getElementById('paste-image-url-btn');
                const previewDiv = document.getElementById('image-preview');
                const previewImg = document.getElementById('preview-chat-image');
                const sendBtn = document.getElementById('send-image');
                const cancelBtn = document.getElementById('cancel-image');
                const uploadModeBtns = document.querySelectorAll('.upload-mode-btn');

                let currentImageData = null;


                function switchUploadMode(isFileMode) {
                    uploadModeBtns.forEach(btn => btn.classList.remove('active'));
                    if (isFileMode) {
                        uploadBtn.classList.add('active');
                        fileInput.style.display = 'block';
                        urlInput.style.display = 'none';
                    } else {
                        pasteUrlBtn.classList.add('active');
                        fileInput.style.display = 'none';
                        urlInput.style.display = 'block';
                        urlInput.focus();
                    }

                    previewDiv.style.display = 'none';
                    sendBtn.disabled = true;
                    currentImageData = null;
                }


                uploadBtn.addEventListener('click', () => switchUploadMode(true));


                pasteUrlBtn.addEventListener('click', () => switchUploadMode(false));


                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        if (file.size > MAX_IMAGE_SIZE) {
                            showNotification('图片大小不能超过5MB', 'error');
                            return;
                        }
                        showNotification('正在优化图片...', 'info', 1500);
                        optimizeImage(file).then(optimizedData => {
                            currentImageData = optimizedData;
                            previewImg.src = currentImageData;
                            previewDiv.style.display = 'block';
                            sendBtn.disabled = false;
                        }).catch(() => {
                            showNotification('图片处理失败', 'error');
                        });
                    }
                });


                urlInput.addEventListener('input',
                    function() {
                        const url = urlInput.value.trim();
                        if (url) {

                            if (/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp))$/i.test(url)) {
                                previewImg.src = url;
                                previewDiv.style.display = 'block';
                                currentImageData = url;
                                sendBtn.disabled = false;


                                const img = new Image();
                                img.onload = function() {

                                    previewImg.src = url;
                                    showNotification('图片URL有效', 'success', 1000);
                                };
                                img.onerror = function() {
                                    showNotification('图片URL无效或无法访问', 'error');
                                    sendBtn.disabled = true;
                                    previewDiv.style.display = 'none';
                                };
                                img.src = url;
                            } else {
                                sendBtn.disabled = true;
                                previewDiv.style.display = 'none';
                            }
                        } else {
                            sendBtn.disabled = true;
                            previewDiv.style.display = 'none';
                        }
                    });


                sendBtn.addEventListener('click',
                    () => {
                        if (currentImageData) {

                            addMessage({
                                id: Date.now(),
                                sender: 'user',
                                text: '',
                                timestamp: new Date(),
                                image: currentImageData,
                                status: 'sent',
                                favorited: false,
                                note: null,
                                replyTo: currentReplyTo,
                                type: 'normal'
                            });
                            playSound('send');
                            currentReplyTo = null;
                            updateReplyPreview();
                            const delayRange = settings.replyDelayMax - settings.replyDelayMin;
                            const randomDelay = settings.replyDelayMin + Math.random() * delayRange;
                            setTimeout(simulateReply, randomDelay);


                            closeModal();
                        }
                    });


                cancelBtn.addEventListener('click',
                    closeModal);


                function closeModal() {
                    modal.style.opacity = '0';
                    const content = modal.querySelector('.modal-content');
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (modal.parentNode) {
                            modal.parentNode.removeChild(modal);
                        }
                    },
                        300);
                }


                modal.addEventListener('click',
                    (e) => {
                        if (e.target === modal) {
                            closeModal();
                        }
                    });


                modal.querySelector('.modal-content').addEventListener('click',
                    (e) => {
                        e.stopPropagation();
                    });


                const handleEscKey = (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };
                document.addEventListener('keydown', handleEscKey);


                modal.addEventListener('close', () => {
                    document.removeEventListener('keydown', handleEscKey);
                });
            });


            DOMElements.imageInput.addEventListener('change', () => {
                if (DOMElements.imageInput.files[0]) {
                    if (isBatchMode) {
                        showNotification('批量模式不支持图片', 'warning');
                        DOMElements.imageInput.value = '';
                    } else {
                        sendMessage();
                    }
                }
            });

            DOMElements.continueBtn.addEventListener('click', simulateReply);
            DOMElements.batchBtn.addEventListener('click', toggleBatchMode);
        }



function _applyCollapseState(on) {
    document.body.classList.toggle('bottom-collapse-mode', on);
    const csToggle = document.getElementById('bottom-collapse-cs-toggle');
    if (csToggle) csToggle.classList.toggle('active', on);
    if (!on) {
        const panel = document.getElementById('collapsed-extras-panel');
        if (panel) panel.style.display = 'none';
        const expandBtn = document.getElementById('collapse-expand-btn');
        if (expandBtn) expandBtn.classList.remove('open');
    }
}

window._toggleBottomCollapse = function() {
    const isOn = !document.body.classList.contains('bottom-collapse-mode');
    if (typeof settings !== 'undefined') settings.bottomCollapseMode = isOn;
    _applyCollapseState(isOn);
    if (typeof throttledSaveData === 'function') throttledSaveData();
    if (typeof showNotification === 'function')
        showNotification(isOn ? '底部栏已收纳 — 点击 ⌃ 展开更多' : '已退出收纳模式', 'success', 2000);
};

window.toggleCollapsedExtras = function() {
    const panel = document.getElementById('collapsed-extras-panel');
    const btn = document.getElementById('collapse-expand-btn');
    if (!panel) return;
    const willOpen = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = willOpen ? 'block' : 'none';
    if (btn) btn.classList.toggle('open', willOpen);

    function wireExtra(extraId, primaryId) {
        const extra = document.getElementById(extraId);
        const primary = document.getElementById(primaryId);
        if (extra && primary && !extra._linked) {
            extra._linked = true;
            extra.addEventListener('click', (e) => { e.stopPropagation(); primary.click(); });
        }
    }
    wireExtra('combo-btn-extra', 'combo-btn');
    wireExtra('batch-btn-extra', 'batch-btn');
};

window.exitCollapseMode = function() {
    if (typeof settings !== 'undefined') settings.bottomCollapseMode = false;
    _applyCollapseState(false);
    if (typeof throttledSaveData === 'function') throttledSaveData();
    if (typeof showNotification === 'function') showNotification('已退出收纳模式', 'success', 2000);
};

(function initCollapseMode() {
    function tryApply() {
        if (typeof settings !== 'undefined') {
            if (settings.bottomCollapseMode) _applyCollapseState(true);
        } else {
            setTimeout(tryApply, 300);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryApply);
    } else {
        setTimeout(tryApply, 400);
    }
})();

document.addEventListener('DOMContentLoaded', async () => {
    const loaderBar = document.getElementById('loader-tech-bar');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle-scramble');
    const welcomeScreen = document.getElementById('welcome-animation');
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const acceptDisclaimerBtn = document.getElementById('accept-disclaimer');

    const updateLoader = (text, width) => {
        if (welcomeSubtitle) welcomeSubtitle.textContent = text;
        if (loaderBar) loaderBar.style.width = width;
    };

    const hideWelcomeScreen = () => {
        if (!welcomeScreen) return;
        welcomeScreen.classList.add('hidden');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 800);
    };

    const safeAwait = async (promise, fallback = null) => {
        try {
            return await promise;
        } catch (error) {
            console.error('操作失败:', error);
            return fallback;
        }
    };

    try {
        try { setupEventListeners?.(); } catch(e) { console.error('setupEventListeners:', e); }

        if (typeof localforage === 'undefined') {
            console.warn('LocalForage 未加载，将使用 localStorage 降级方案');
        }

        updateLoader('正在建立安全连接...', '10%');
        await safeAwait(initializeSession());

        updateLoader('正在读取记忆存档...', '40%');
        await safeAwait(loadData());

        updateLoader('正在渲染我们的世界...', '70%');
        
        await Promise.allSettled([
            safeAwait(initializeRandomUI?.()),
            safeAwait(initMusicPlayer?.())
        ]);

        setInterval(checkStatusChange, 60000);

        if (disclaimerModal) {
            const tourSeen = await safeAwait(localforage?.getItem(APP_PREFIX + 'tour_seen'), false);
            
            if (!tourSeen) {
                showModal(disclaimerModal);
                
                if (acceptDisclaimerBtn && !acceptDisclaimerBtn._bound) {
                    acceptDisclaimerBtn._bound = true;
                    acceptDisclaimerBtn.addEventListener('click', () => {
                        hideModal(disclaimerModal);
                        localforage?.setItem(APP_PREFIX + 'tour_seen', true).catch(() => {});
                        startTour?.();
                    }, { once: true });
                }
            }
        }

        updateLoader('连接成功，欢迎回来。', '100%');
        setTimeout(hideWelcomeScreen, 3500);

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                clearTimeout(saveTimeout);
                saveData().catch(e => console.error('[visibilitychange] 保存失败:', e));
            }
        });

        window.addEventListener('pagehide', () => {
            _backupCriticalData(); 
        });

        window.addEventListener('beforeunload', () => {
            _backupCriticalData();
        });
window.addEventListener('beforeunload', () => {
  Object.values(_voiceAudioCache).forEach(c => {
    if (c.audioUrl) URL.revokeObjectURL(c.audioUrl);
  });
});
        setInterval(() => {
            saveData().catch(e => console.warn('[autoBackup] 定时保存失败:', e));
        }, 3 * 60 * 1000);

        (() => {
            const REMIND_KEY = 'exportReminderLastShown';
            const last = parseInt(localStorage.getItem(REMIND_KEY) || '0', 10);
            const daysSince = (Date.now() - last) / (1000 * 60 * 60 * 24);
            if (daysSince >= 7) {
                setTimeout(() => {
                    showNotification('建议定期导出备份，防止数据意外丢失', 'info', 7000);
                    localStorage.setItem(REMIND_KEY, String(Date.now()));
                }, 8000);
            }
        })();

        setTimeout(async () => {
            if ('Notification' in window && Notification.permission === 'default') {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        showNotification('已开启系统通知，收到消息时会提醒你', 'success', 3000);
                    }
                } catch(e) {
                    console.warn('通知权限请求失败:', e);
                }
            }
        }, 3000);

    } catch (err) {
        console.error('严重初始化错误:', err);
        updateLoader('加载遇到问题，已强制进入...', '100%');
        setTimeout(hideWelcomeScreen, 3500);
    }
});
const stickerInput = document.getElementById('sticker-file-input');
            if (stickerInput) {
                stickerInput.addEventListener('change', async (e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;

                    const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
                    if (oversized.length > 0) {
                        showNotification(oversized.length + ' 张图片超过 2MB 限制，已跳过', 'warning');
                    }

                    const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
                    if (!validFiles.length) return;

                    showNotification('正在批量处理 ' + validFiles.length + ' 张图片...', 'info');

                    let successCount = 0;
                    let failCount = 0;

                    for (const file of validFiles) {
                        try {
                            const base64 = await optimizeImage(file, 300, 0.8);
                            stickerLibrary.push(base64);
                            successCount++;
                        } catch (err) {
                            console.error(err);
                            failCount++;
                        }
                    }

                    throttledSaveData();
                    renderReplyLibrary();

                    if (failCount > 0) {
                        showNotification('上传完成：' + successCount + ' 张成功，' + failCount + ' 张失败', 'warning');
                    } else {
                        showNotification('上传成功，共 ' + successCount + ' 张', 'success');
                    }

                    e.target.value = '';
                });
            }
const myStickerQuickUpload = document.getElementById('my-sticker-quick-upload');
if (myStickerQuickUpload) {
    myStickerQuickUpload.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        const oversized = files.filter(f => f.size > 2 * 1024 * 1024);
        if (oversized.length > 0) showNotification(oversized.length + ' 张图片超过 2MB，已跳过', 'warning');
        const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);
        if (!validFiles.length) return;
        showNotification('正在处理 ' + validFiles.length + ' 张...', 'info');
        let ok = 0, fail = 0;
        for (const file of validFiles) {
            try {
                const base64 = await optimizeImage(file, 300, 0.8);
                myStickerLibrary.push(base64);
                ok++;
            } catch(err) { fail++; }
        }
        throttledSaveData();
        if (typeof renderComboContent === 'function') renderComboContent('my-sticker');
        showNotification(fail > 0 ? `上传完成：${ok} 成功 ${fail} 失败` : `✓ 已添加 ${ok} 张到我的表情库`, fail > 0 ? 'warning' : 'success');
        e.target.value = '';
    });
}

window.addEventListener('load', function() {
    setTimeout(function() {
        try {
            if (localStorage.getItem('dailyGreetingShown') === new Date().toDateString()) return;
            try { if (typeof checkPartnerDailyMood === 'function') checkPartnerDailyMood(); } catch(e2) { console.warn('checkPartnerDailyMood error:', e2); }
            if (typeof _buildDailyGreeting === 'function') _buildDailyGreeting();
            if (window.localforage && window.APP_PREFIX) {
                localforage.getItem(window.APP_PREFIX + 'tour_seen').then(function(seen) {
                    if (seen) {
                        var modal = document.getElementById('daily-greeting-modal');
                        if (modal) modal.classList.remove('hidden');
                        localStorage.setItem('dailyGreetingShown', new Date().toDateString());
                    }
                }).catch(function() {
                    var modal = document.getElementById('daily-greeting-modal');
                    if (modal) modal.classList.remove('hidden');
                    localStorage.setItem('dailyGreetingShown', new Date().toDateString());
                });
            } else {
                var modal = document.getElementById('daily-greeting-modal');
                if (modal) modal.classList.remove('hidden');
                localStorage.setItem('dailyGreetingShown', new Date().toDateString());
            }
        } catch(e) { console.warn('Daily greeting timing error:', e); }
    }, 4500);
}, { once: true });
// 小红书解析功能
let currentXhsData = null;

function initXhsParser() {
    const entryBtn = document.getElementById('xhs-parser-function');
    const modal = document.getElementById('xhs-parser-modal');
    const closeBtn = document.getElementById('close-xhs-parser');
    const parseBtn = document.getElementById('xhs-parse-btn');
    const linkInput = document.getElementById('xhs-link-input');
    const resultContainer = document.getElementById('xhs-result-container');
    const resultContent = document.getElementById('xhs-result-content');
    const loadingEl = document.getElementById('xhs-loading');
    
    if (!entryBtn || !modal) return;
    
    entryBtn.addEventListener('click', () => {
        hideModal(DOMElements.advancedModal.modal);
        resetXhsModal();
        showModal(modal);
    });
    
    closeBtn.addEventListener('click', () => hideModal(modal));
    
    // 支持回车解析
    linkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') parseBtn.click();
    });
    
    parseBtn.addEventListener('click', async () => {
        const url = linkInput.value.trim();
        if (!url) {
            showNotification('请输入小红书分享链接', 'warning');
            return;
        }
        
        // 简单验证链接格式
        if (!url.includes('xhslink.com') && !url.includes('xiaohongshu.com')) {
            showNotification('请输入有效的小红书链接', 'warning');
            return;
        }
        
        resultContainer.style.display = 'block';
        loadingEl.style.display = 'block';
        resultContent.innerHTML = '';
        resultContent.appendChild(loadingEl);
        
        try {
            const data = await parseXhsLink(url);
            loadingEl.style.display = 'none';
            currentXhsData = data;
            renderXhsResult(data);
        } catch (error) {
            loadingEl.style.display = 'none';
            resultContent.innerHTML = `
                <div class="xhs-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>解析失败</p>
                    <p style="font-size:12px;opacity:0.7;">${error.message || '请检查链接是否正确'}</p>
                </div>
            `;
            showNotification('解析失败，请重试', 'error');
        }
    });
}

function resetXhsModal() {
    const resultContainer = document.getElementById('xhs-result-container');
    const linkInput = document.getElementById('xhs-link-input');
    if (resultContainer) resultContainer.style.display = 'none';
    if (linkInput) linkInput.value = '';
    currentXhsData = null;
}

async function parseXhsLink(url) {
    // 使用你的API接口
    const apiUrl = 'https://api.bugpk.com/api/xhsjx';
    
    try {
        const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 根据API返回格式调整
        if (data.code === 200 || data.success) {
            return {
                title: data.data?.title || data.title || '小红书笔记',
                desc: data.data?.desc || data.desc || '',
                author: {
                    name: data.data?.author?.name || data.author || '小红书用户',
                    avatar: data.data?.author?.avatar || data.avatar || ''
                },
                media: data.data?.images || data.images || [],
                video: data.data?.video || data.video || null,
                likes: data.data?.likes || data.likes || 0,
                comments: data.data?.comments || data.comments || 0,
                collects: data.data?.collects || data.collects || 0,
                time: data.data?.time || data.time || '',
                raw: data
            };
        } else {
            throw new Error(data.msg || '解析失败');
        }
    } catch (error) {
        console.error('小红书解析错误:', error);
        throw error;
    }
}

function renderXhsResult(data) {
    const resultContent = document.getElementById('xhs-result-content');
    
    // 作者信息
    const authorHtml = `
        <div class="xhs-author">
            ${data.author.avatar ? `
                <div class="xhs-author-avatar">
                    <img src="${data.author.avatar}" alt="${data.author.name}" style="width:100%;height:100%;object-fit:cover;">
                </div>
            ` : ''}
            <div class="xhs-author-info">
                <span class="xhs-author-name">${data.author.name}</span>
                ${data.time ? `<span class="xhs-time">${data.time}</span>` : ''}
            </div>
        </div>
    `;
    
    // 标题
    const titleHtml = data.title ? `<div class="xhs-title">${data.title}</div>` : '';
    
    // 媒体内容（图片/视频）
    let mediaHtml = '';
    if (data.video) {
        mediaHtml = `
            <div class="xhs-media-grid">
                <div class="xhs-media-item" onclick="viewImage('${data.video}')">
                    <video src="${data.video}" controls style="width:100%;height:100%;object-fit:cover;"></video>
                </div>
            </div>
        `;
    } else if (data.media && data.media.length > 0) {
        mediaHtml = `
            <div class="xhs-media-grid">
                ${data.media.map(img => `
                    <div class="xhs-media-item" onclick="viewImage('${img}')">
                        <img src="${img}" alt="图片" loading="lazy">
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 描述
    const descHtml = data.desc ? `<div class="xhs-desc">${data.desc}</div>` : '';
    
    // 统计数据
    const statsHtml = `
        <div class="xhs-stats">
            ${data.likes ? `<span><i class="fas fa-heart"></i> ${formatNumber(data.likes)}</span>` : ''}
            ${data.comments ? `<span><i class="fas fa-comment"></i> ${formatNumber(data.comments)}</span>` : ''}
            ${data.collects ? `<span><i class="fas fa-star"></i> ${formatNumber(data.collects)}</span>` : ''}
        </div>
    `;
    
    // 发送按钮
    const sendBtnHtml = `
        <button class="xhs-send-btn" onclick="sendXhsToChat()">
            <i class="fas fa-paper-plane"></i> 发送到聊天
        </button>
    `;
    
    resultContent.innerHTML = authorHtml + titleHtml + mediaHtml + descHtml + statsHtml + sendBtnHtml;
}

function formatNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
}

function sendXhsToChat() {
    if (!currentXhsData) return;
    
    const data = currentXhsData;
    
    // 构建小红书风格的卡片HTML
    const cardHtml = buildXhsCardHtml(data);
    
    // 发送卡片消息
    addMessage({
        id: Date.now(),
        sender: 'user',
        text: cardHtml,
        timestamp: new Date(),
        status: 'sent',
        type: 'normal',
        isHtml: true, // 标记为HTML内容
        xhsCard: true  // 标记为小红书卡片
    });
    
    playSound('send');
    
    // 关闭模态框
    hideModal(document.getElementById('xhs-parser-modal'));
    showNotification('已发送到聊天', 'success');
}

function buildXhsCardHtml(data) {
    // 构建图片轮播HTML
    const imagesHtml = data.media && data.media.length > 0 
        ? buildImageSlider(data.media) 
        : (data.video ? buildVideoPlayer(data.video) : '');
    
    return `
        <div class="xhs-share-card">
            <!-- 博主信息 -->
            <div class="xhs-card-header">
                <div class="xhs-card-avatar">
                    ${data.author.avatar 
                        ? `<img src="${data.author.avatar}" alt="${data.author.name}">` 
                        : `<i class="fas fa-user"></i>`
                    }
                </div>
                <div class="xhs-card-author-info">
                    <span class="xhs-card-author-name">${escapeHtml(data.author.name || '小红书用户')}</span>
                    <span class="xhs-card-badge">小红书</span>
                </div>
            </div>
            
            <!-- 图片/视频区域 -->
            ${imagesHtml}
            
            <!-- 标题 -->
            <div class="xhs-card-title">${escapeHtml(data.title || '')}</div>
            
            <!-- 内容描述 -->
            <div class="xhs-card-desc">${escapeHtml(data.desc || '').replace(/\n/g, '<br>')}</div>
            
            <!-- 底部来源标识 -->
            <div class="xhs-card-footer">
                <span class="xhs-card-source">🔗 来自小红书</span>
            </div>
        </div>
    `;
}

function buildImageSlider(images) {
    if (images.length === 0) return '';
    
    // 单张图片
    if (images.length === 1) {
        return `
            <div class="xhs-card-media xhs-card-single">
                <img src="${images[0]}" alt="笔记图片" onclick="viewImage('${images[0]}')">
                <div class="xhs-card-image-badge">
                    <i class="fas fa-image"></i>
                </div>
            </div>
        `;
    }
    
    // 多张图片 - 横向滑动
    const imageItems = images.map((img, index) => `
        <div class="xhs-card-slide-item" onclick="viewImage('${img}')">
            <img src="${img}" alt="图片${index + 1}" loading="lazy">
        </div>
    `).join('');
    
    return `
        <div class="xhs-card-media xhs-card-slider">
            <div class="xhs-card-slider-container">
                ${imageItems}
            </div>
            <div class="xhs-card-slider-indicator">
                <span class="xhs-card-image-count">
                    <i class="fas fa-image"></i> 1/${images.length}
                </span>
                <div class="xhs-card-slider-dots">
                    ${images.map((_, i) => `<span class="xhs-card-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function buildVideoPlayer(videoUrl) {
    return `
        <div class="xhs-card-media xhs-card-video">
            <video src="${videoUrl}" poster="" controls preload="metadata">
                您的浏览器不支持视频播放
            </video>
            <div class="xhs-card-video-badge">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `;
}

// HTML转义函数
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 在DOMContentLoaded中初始化
document.addEventListener('DOMContentLoaded', () => {
    initXhsParser();
initWebEmbed();
});
// 网页嵌入功能
let currentEmbedUrl = '';
let currentEmbedValid = false;

function initWebEmbed() {
    const entryBtn = document.getElementById('web-embed-function');
    const modal = document.getElementById('web-embed-modal');
    const closeBtn = document.getElementById('close-web-embed');
    const previewBtn = document.getElementById('web-embed-btn');
    const sendBtn = document.getElementById('send-web-embed');
    const urlInput = document.getElementById('web-embed-input');
    const previewContainer = document.getElementById('web-embed-preview');
    const previewContent = document.getElementById('web-embed-preview-content');
    
    if (!entryBtn || !modal) return;
    
    entryBtn.addEventListener('click', () => {
        if (DOMElements.advancedModal && DOMElements.advancedModal.modal) {
            hideModal(DOMElements.advancedModal.modal);
        }
        resetWebEmbed();
        showModal(modal);
        setTimeout(() => urlInput.focus(), 100);
    });
    
    closeBtn.addEventListener('click', () => hideModal(modal));
    
    // 输入时清空预览
    urlInput.addEventListener('input', () => {
        previewContainer.style.display = 'none';
        sendBtn.disabled = true;
        currentEmbedValid = false;
    });
    
    // 回车预览
    urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            previewBtn.click();
        }
    });
    
    // 预览按钮
    previewBtn.addEventListener('click', () => {
        let url = urlInput.value.trim();
        if (!url) {
            showNotification('请输入网址', 'warning');
            return;
        }
        
        // 自动补全协议
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        // 验证 URL 格式
        try {
            new URL(url);
        } catch (e) {
            showNotification('无效的网址格式', 'error');
            return;
        }
        
        currentEmbedUrl = url;
        
        // 显示加载状态
        previewContainer.style.display = 'block';
        previewContent.innerHTML = `
            <div class="web-embed-loading">
                <div class="spinner"></div>
                <span>加载预览中...</span>
            </div>
        `;
        
        // 检测网站是否可嵌入
        checkIfEmbeddable(url).then(canEmbed => {
            currentEmbedValid = true;
            sendBtn.disabled = false;
            
            // 渲染预览
            const cardHtml = buildWebEmbedCard(url, canEmbed, true);
            previewContent.innerHTML = cardHtml;
            
            // 如果是可嵌入的，绑定 iframe 加载事件
            if (canEmbed) {
                const iframe = previewContent.querySelector('iframe');
                if (iframe) {
                    iframe.addEventListener('load', () => {
                        // iframe 加载完成
                    });
                    iframe.addEventListener('error', () => {
                        // 如果 iframe 加载失败，切换为不可嵌入模式
                        const newCard = buildWebEmbedCard(url, false, true);
                        previewContent.innerHTML = newCard;
                    });
                }
            }
        }).catch(() => {
            // 检测失败，默认为可嵌入（让 iframe 自己处理）
            currentEmbedValid = true;
            sendBtn.disabled = false;
            const cardHtml = buildWebEmbedCard(url, true, true);
            previewContent.innerHTML = cardHtml;
        });
    });
    
    // 发送按钮
    sendBtn.addEventListener('click', () => {
        if (!currentEmbedUrl || !currentEmbedValid) {
            showNotification('请先预览网页', 'warning');
            return;
        }
        
        // 构建卡片 HTML
        const cardHtml = buildWebEmbedCard(currentEmbedUrl, true, false);
        
        // 发送消息
        addMessage({
            id: Date.now(),
            sender: 'user',
            text: cardHtml,
            timestamp: new Date(),
            status: 'sent',
            type: 'normal',
            webEmbed: true,
            embedUrl: currentEmbedUrl
        });
        
        playSound('send');
        hideModal(modal);
        showNotification('已发送到聊天', 'success');
    });
}

function resetWebEmbed() {
    const urlInput = document.getElementById('web-embed-input');
    const previewContainer = document.getElementById('web-embed-preview');
    const sendBtn = document.getElementById('send-web-embed');
    
    if (urlInput) urlInput.value = '';
    if (previewContainer) previewContainer.style.display = 'none';
    if (sendBtn) sendBtn.disabled = true;
    
    currentEmbedUrl = '';
    currentEmbedValid = false;
}

// 检测 URL 是否可嵌入（通过发送 HEAD 请求检查 X-Frame-Options）
async function checkIfEmbeddable(url) {
    try {
        // 使用 CORS 代理发送请求
        const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
        const response = await fetch(proxyUrl, { method: 'HEAD' });
        
        // 检查 X-Frame-Options 头
        const frameOptions = response.headers.get('X-Frame-Options');
        if (frameOptions) {
            const lower = frameOptions.toLowerCase();
            if (lower === 'deny' || lower === 'sameorigin') {
                return false;
            }
        }
        
        // 检查 CSP 头中的 frame-ancestors
        const csp = response.headers.get('Content-Security-Policy');
        if (csp && csp.includes('frame-ancestors')) {
            // 如果有限制，大概率不能嵌入
            if (csp.includes("frame-ancestors 'none'") || csp.includes("frame-ancestors 'self'")) {
                return false;
            }
        }
        
        return true;
    } catch (e) {
        console.warn('检测嵌入性失败:', e);
        return true; // 默认认为可以嵌入
    }
}

// 构建网页嵌入卡片 HTML
function buildWebEmbedCard(url, attemptEmbed = true, isPreview = false) {
    let domain = '';
    try {
        domain = new URL(url).hostname.replace('www.', '');
    } catch (e) {
        domain = url;
    }
    
    const escapedUrl = escapeHtml(url);
    const escapedDomain = escapeHtml(domain);
    
    // 如果尝试嵌入，使用 iframe
    if (attemptEmbed) {
        // 使用 sandbox 属性提高安全性，同时允许必要的功能
        const sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
        
        return `
            <div class="web-embed-card" data-embed-url="${escapedUrl}">
                <div class="web-embed-header">
                    <div class="web-embed-url">
                        <i class="fas fa-globe"></i>
                        <span title="${escapedUrl}">${escapedDomain}</span>
                    </div>
                    <div class="web-embed-actions">
                        <button class="web-embed-btn-icon" onclick="window.open('${escapedUrl}', '_blank')" title="在浏览器中打开">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                        ${isPreview ? '' : `
                        <button class="web-embed-btn-icon" onclick="this.closest('.web-embed-card').querySelector('.web-embed-content').style.display='none';this.closest('.web-embed-card').querySelector('.web-embed-blocked-fallback').style.display='flex'" title="收起">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                        `}
                    </div>
                </div>
                <div class="web-embed-content">
                    <iframe src="${escapedUrl}" 
                            sandbox="${sandbox}"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            loading="lazy"
                            onerror="this.style.display='none'; this.parentElement.querySelector('.web-embed-blocked-fallback').style.display='flex'">
                    </iframe>
                </div>
                <div class="web-embed-blocked-fallback" style="display: none;">
                    <div class="web-embed-blocked">
                        <i class="fas fa-globe"></i>
                        <p>此网页无法在应用内显示</p>
                        <div class="web-embed-domain">${escapedDomain}</div>
                        <button class="web-embed-open-btn" onclick="window.open('${escapedUrl}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> 在浏览器中打开
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 直接显示"无法嵌入"状态
        return `
            <div class="web-embed-card" data-embed-url="${escapedUrl}">
                <div class="web-embed-header">
                    <div class="web-embed-url">
                        <i class="fas fa-globe"></i>
                        <span title="${escapedUrl}">${escapedDomain}</span>
                    </div>
                    <div class="web-embed-actions">
                        <button class="web-embed-btn-icon" onclick="window.open('${escapedUrl}', '_blank')" title="在浏览器中打开">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="web-embed-blocked">
                    <i class="fas fa-lock"></i>
                    <p>出于安全原因，此网页无法嵌入显示</p>
                    <div class="web-embed-domain">${escapedDomain}</div>
                    <button class="web-embed-open-btn" onclick="window.open('${escapedUrl}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> 在浏览器中打开
                    </button>
                </div>
            </div>
        `;
    }
}

// HTML 转义
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}// ==================== 梦向问卷功能 ====================
let dreamQuestionnaires = [];  // 创建的问卷列表
let dqCurrentType = 'choice';  // 当前编辑的问卷类型
let dqCurrentReplyTime = 'immediate'; // 当前编辑的回复时间
let dqQuestions = [];  // 当前编辑的题目列表
let dqEditingId = null; // 正在编辑的问卷 ID

// 修改 loadDQData 函数
async function loadDQData() {
    try {
        const saved = await localforage.getItem(getStorageKey('dreamQuestionnaires'));
        if (saved && Array.isArray(saved)) dreamQuestionnaires = saved;
    } catch(e) {
        dreamQuestionnaires = [];
    }
    
    // 检查所有待回复的问卷
    setTimeout(checkAllPendingDQs, 1000);
}

function saveDQData() {
    localforage.setItem(getStorageKey('dreamQuestionnaires'), dreamQuestionnaires).catch(() => {});
}

// 渲染问卷列表
function renderDQList() {
    const list = document.getElementById('dq-list');
    if (!list) return;

    if (dreamQuestionnaires.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                <i class="fas fa-clipboard-list" style="font-size: 40px; opacity: 0.3; margin-bottom: 12px; display: block;"></i>
                <p style="font-size: 14px; font-weight: 500;">还没有问卷</p>
                <p style="font-size: 12px; opacity: 0.6;">点击"创建新问卷"开始吧~</p>
            </div>`;
    } else {
        list.innerHTML = dreamQuestionnaires.map((dq, index) => {
            const typeBadge = dq.type === 'choice' 
                ? '<span class="dq-card-badge choice">📋 选择题</span>'
                : '<span class="dq-card-badge fill">✏️ 填空题</span>';
            const statusBadge = dq.answer 
                ? '<span class="dq-card-badge answered">✓ 已回复</span>'
                : (dq.sent ? '<span class="dq-card-badge pending">⏳ 等待回复</span>' : '');
            const questionCount = dq.questions ? dq.questions.length : 0;
            const replyTimeLabel = dq.replyTime === 'immediate' ? '立即回复' : '随机时间';
            const answerPreview = dq.answer ? '点击查看回复 →' : (dq.sent ? '等待中...' : '点击发送 →');
            
            return `
                <div class="dq-card" onclick="handleDQCardClick('${dq.id}')">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="flex: 1; min-width: 0;">
                            <div class="dq-card-header">
                                <span class="dq-card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(dq.title || '未命名问卷')}</span>
                            </div>
                            <div class="dq-card-meta">
                                <span>${questionCount} 题</span>
                                <span>·</span>
                                ${typeBadge}
                                <span>·</span>
                                <span>${replyTimeLabel}</span>
                            </div>
                            <div style="font-size: 11px; color: var(--accent-color); margin-top: 4px; opacity: 0.8;">${answerPreview}</div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-left: 10px;">
                            ${statusBadge}
                            <button class="dq-delete-btn" onclick="event.stopPropagation(); deleteDQ('${dq.id}')" title="删除">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    }

    // 渲染收到的回复列表
    renderDQReceived();
}

// 渲染收到的问卷回复
function renderDQReceived() {
    const receivedList = document.getElementById('dq-received-list');
    const receivedSection = document.getElementById('dq-received');
    if (!receivedList || !receivedSection) return;

    const answeredDQs = dreamQuestionnaires.filter(dq => dq.answer);
    
    if (answeredDQs.length === 0) {
        receivedSection.style.display = 'none';
        return;
    }
    
    receivedSection.style.display = 'block';
    receivedList.innerHTML = answeredDQs.map(dq => `
        <div class="dq-card" onclick="viewDQAnswer('${dq.id}')" style="margin-bottom: 6px;">
            <div class="dq-card-header">
                <span class="dq-card-title">${escapeHtml(dq.title || '未命名问卷')}</span>
                <span class="dq-card-badge answered">✓ 已回复</span>
            </div>
            <div class="dq-card-meta">
                ${dq.questions ? dq.questions.length : 0} 题 · ${dq.type === 'choice' ? '选择题' : '填空题'}
            </div>
        </div>
    `).join('');
}

// 处理问卷卡片点击
function handleDQCardClick(id) {
    const dq = dreamQuestionnaires.find(q => q.id === id);
    if (!dq) return;
    
    // 先检查是否需要生成回复（处理页面刷新后定时器丢失的情况）
    if (dq.sent && !dq.answer && dq.expectedReplyAt) {
        checkAndGenerateDQReply(dq);
    }
    
    // 重新获取最新状态
    const updatedDq = dreamQuestionnaires.find(q => q.id === id);
    if (!updatedDq) return;
    
    if (updatedDq.answer) {
        viewDQAnswer(id);
    } else if (!updatedDq.sent) {
        openDQEditor(id);
    } else {
        // 显示等待中的提示
        const remainingMinutes = updatedDq.expectedReplyAt 
            ? Math.max(0, Math.ceil((updatedDq.expectedReplyAt - Date.now()) / 60000))
            : 0;
        showNotification(`问卷已发送，梦角预计 ${remainingMinutes} 分钟内回复`, 'info', 3000);
    }
}

// 在页面加载时检查所有待回复的问卷
function checkAllPendingDQs() {
    dreamQuestionnaires.forEach(dq => {
        if (dq.sent && !dq.answer && dq.expectedReplyAt) {
            checkAndGenerateDQReply(dq);
        }
    });
}

// 打开编辑器
function openDQEditor(id = null) {
    dqEditingId = id;
    const editorView = document.getElementById('dq-editor-view');
    const mainView = document.getElementById('dq-main-view');
    const answerView = document.getElementById('dq-answer-view');
    
    if (id) {
        const dq = dreamQuestionnaires.find(q => q.id === id);
        if (!dq) return;
        dqCurrentType = dq.type || 'choice';
        dqCurrentReplyTime = dq.replyTime || 'immediate';
        dqQuestions = JSON.parse(JSON.stringify(dq.questions || []));
        document.getElementById('dq-title-input').value = dq.title || '';
    } else {
        dqCurrentType = 'choice';
        dqCurrentReplyTime = 'immediate';
        dqQuestions = [];
        document.getElementById('dq-title-input').value = '';
    }

    mainView.style.display = 'none';
    answerView.style.display = 'none';
    editorView.style.display = 'block';
    
    updateDQTypeButtons();
    updateDQReplyTimeButtons();
    renderDQQuestions();
    
    document.getElementById('dq-create-btn').style.display = 'none';
    document.getElementById('dq-save-btn').style.display = '';
    document.getElementById('dq-send-btn').style.display = '';
    document.getElementById('dq-back-btn').style.display = '';
    document.getElementById('close-dq-modal').style.display = 'none';
    document.getElementById('dq-send-btn').style.display = id ? (dreamQuestionnaires.find(q => q.id === id)?.sent ? 'none' : '') : '';
    document.getElementById('dq-save-btn').style.display = id ? (dreamQuestionnaires.find(q => q.id === id)?.sent ? 'none' : '') : '';
}

// 返回主视图
function backToDQMain() {
    document.getElementById('dq-editor-view').style.display = 'none';
    document.getElementById('dq-answer-view').style.display = 'none';
    document.getElementById('dq-main-view').style.display = '';
    document.getElementById('dq-create-btn').style.display = '';
    document.getElementById('dq-save-btn').style.display = 'none';
    document.getElementById('dq-send-btn').style.display = 'none';
    document.getElementById('dq-back-btn').style.display = 'none';
    document.getElementById('close-dq-modal').style.display = '';
    dqEditingId = null;
    renderDQList();
}

// 更新类型按钮
function updateDQTypeButtons() {
    document.querySelectorAll('.dq-type-btn').forEach(btn => {
        if (btn.dataset.type === dqCurrentType) {
            btn.className = 'modal-btn modal-btn-primary dq-type-btn';
        } else {
            btn.className = 'modal-btn modal-btn-secondary dq-type-btn';
        }
    });
}

// 更新回复时间按钮
function updateDQReplyTimeButtons() {
    document.querySelectorAll('.dq-reply-time-btn').forEach(btn => {
        if (btn.dataset.time === dqCurrentReplyTime) {
            btn.className = 'modal-btn modal-btn-primary dq-reply-time-btn';
        } else {
            btn.className = 'modal-btn modal-btn-secondary dq-reply-time-btn';
        }
    });
    document.getElementById('dq-random-hint').style.display = 
        dqCurrentReplyTime === 'random' ? 'block' : 'none';
}

// 渲染题目列表
function renderDQQuestions() {
    const container = document.getElementById('dq-questions-container');
    if (!container) return;

    if (dqQuestions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--text-secondary); font-size: 13px; opacity: 0.6;">
                暂无题目，点击下方按钮添加
            </div>`;
        return;
    }

    container.innerHTML = dqQuestions.map((q, index) => `
        <div class="dq-question-block">
            <div class="dq-question-header">
                <div class="dq-question-number">${index + 1}</div>
                <input type="text" class="dq-question-input" value="${escapeHtml(q.question)}" 
                    placeholder="输入题目..." data-qindex="${index}" onchange="updateDQQuestion(${index}, 'question', this.value)">
                <button class="dq-option-remove" onclick="removeDQQuestion(${index})" title="删除题目">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${dqCurrentType === 'choice' ? renderDQOptions(q, index) : ''}
        </div>
    `).join('');
}

// 渲染选项
function renderDQOptions(question, qIndex) {
    const options = question.options || [];
    
    return `
        <div style="padding-left: 34px;">
            ${options.map((opt, oIndex) => `
                <div class="dq-option-row">
                    <span style="font-size: 11px; color: var(--text-secondary); min-width: 18px;">${String.fromCharCode(65 + oIndex)}.</span>
                    <input type="text" class="dq-option-input" value="${escapeHtml(opt)}" 
                        placeholder="选项 ${oIndex + 1}" onchange="updateDQOption(${qIndex}, ${oIndex}, this.value)">
                    <button class="dq-option-remove" onclick="removeDQOption(${qIndex}, ${oIndex})" title="删除选项">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
            <button onclick="addDQOption(${qIndex})" style="background: none; border: 1px dashed var(--border-color); border-radius: 6px; padding: 5px 10px; font-size: 11px; color: var(--text-secondary); cursor: pointer; width: 100%; margin-top: 4px;">
                <i class="fas fa-plus"></i> 添加选项
            </button>
        </div>
    `;
}

// 添加题目
function addDQQuestion() {
    const newQuestion = {
        question: '',
        options: dqCurrentType === 'choice' ? ['', ''] : []
    };
    dqQuestions.push(newQuestion);
    renderDQQuestions();
}

// 删除题目
function removeDQQuestion(index) {
    dqQuestions.splice(index, 1);
    renderDQQuestions();
}

// 更新题目
function updateDQQuestion(index, field, value) {
    if (dqQuestions[index]) {
        dqQuestions[index][field] = value;
    }
}

// 添加选项
function addDQOption(qIndex) {
    if (dqQuestions[qIndex] && dqQuestions[qIndex].options) {
        dqQuestions[qIndex].options.push('');
        renderDQQuestions();
    }
}

// 删除选项
function removeDQOption(qIndex, oIndex) {
    if (dqQuestions[qIndex] && dqQuestions[qIndex].options) {
        dqQuestions[qIndex].options.splice(oIndex, 1);
        renderDQQuestions();
    }
}

// 更新选项
function updateDQOption(qIndex, oIndex, value) {
    if (dqQuestions[qIndex] && dqQuestions[qIndex].options) {
        dqQuestions[qIndex].options[oIndex] = value;
    }
}

// 保存问卷
function saveDQ() {
    const title = document.getElementById('dq-title-input').value.trim();
    if (!title) {
        showNotification('请输入问卷标题', 'warning');
        return;
    }
    
    // 更新题目内容
    document.querySelectorAll('.dq-question-input').forEach(input => {
        const index = parseInt(input.dataset.qindex);
        if (!isNaN(index) && dqQuestions[index]) {
            dqQuestions[index].question = input.value;
        }
    });
    document.querySelectorAll('.dq-option-input').forEach((input, i) => {
        // 通过 DOM 结构解析
        const optionRow = input.closest('.dq-option-row');
        const questionBlock = input.closest('.dq-question-block');
        if (questionBlock) {
            const qInput = questionBlock.querySelector('.dq-question-input');
            if (qInput) {
                const qIndex = parseInt(qInput.dataset.qindex);
                const allOptionInputs = questionBlock.querySelectorAll('.dq-option-input');
                const oIndex = Array.from(allOptionInputs).indexOf(input);
                if (!isNaN(qIndex) && dqQuestions[qIndex] && dqQuestions[qIndex].options) {
                    dqQuestions[qIndex].options[oIndex] = input.value;
                }
            }
        }
    });

    const validQuestions = dqQuestions.filter(q => q.question.trim());
    if (validQuestions.length === 0) {
        showNotification('请至少添加一道有效题目', 'warning');
        return;
    }
    if (dqCurrentType === 'choice') {
        const invalidOptions = validQuestions.some(q => 
            !q.options || q.options.filter(o => o.trim()).length < 2
        );
        if (invalidOptions) {
            showNotification('选择题每题至少需要两个选项', 'warning');
            return;
        }
    }

    const dqData = {
        id: dqEditingId || ('dq_' + Date.now()),
        title,
        type: dqCurrentType,
        replyTime: dqCurrentReplyTime,
        questions: validQuestions.map(q => ({
            question: q.question.trim(),
            options: dqCurrentType === 'choice' ? q.options.map(o => o.trim()).filter(o => o) : []
        })),
        sent: false,
        answer: null,
        createdAt: Date.now()
    };

    if (dqEditingId) {
        const index = dreamQuestionnaires.findIndex(q => q.id === dqEditingId);
        if (index >= 0) {
            dreamQuestionnaires[index] = dqData;
        } else {
            dreamQuestionnaires.push(dqData);
        }
    } else {
        dreamQuestionnaires.push(dqData);
    }

    saveDQData();
    backToDQMain();
    showNotification('问卷已保存 ✓', 'success');
}

// 发送问卷
function sendDQ() {
    if (!dqEditingId) {
        showNotification('请先保存问卷', 'warning');
        return;
    }
    
    const dq = dreamQuestionnaires.find(q => q.id === dqEditingId);
    if (!dq) return;
    
    if (dq.sent) {
        showNotification('该问卷已发送', 'warning');
        return;
    }
    
    // 保存最新内容
    saveDQWithoutClose(dq);
    
    // 立即标记为已发送，并记录发送时间
    dq.sent = true;
    dq.sentAt = Date.now();
    
    // 如果是随机时间，记录期望的回复时间范围
    if (dq.replyTime === 'random') {
        const delayMinutes = Math.floor(Math.random() * 300); // 0-300 分钟
        dq.expectedReplyAt = Date.now() + delayMinutes * 60 * 1000;
        dq.replyDelayMinutes = delayMinutes;
    } else {
        dq.expectedReplyAt = Date.now() + 3000; // 立即回复，约3秒
        dq.replyDelayMinutes = 0;
    }
    
    saveDQData();
    
    // 检查是否应该立即回复
    checkAndGenerateDQReply(dq);
    
    backToDQMain();
    
    if (dq.replyTime === 'immediate') {
        showNotification('问卷已发送！梦角正在填写... ✉️', 'success');
    } else {
        showNotification(`问卷已发送！梦角将在 ${dq.replyDelayMinutes} 分钟内回复 ✉️`, 'success');
    }
}

// 检查并生成回复（替代 setTimeout）
function checkAndGenerateDQReply(dq) {
    if (!dq || !dq.sent || dq.answer) return;
    
    const now = Date.now();
    const expectedTime = dq.expectedReplyAt || 0;
    
    if (now >= expectedTime) {
        // 时间到了，立即生成回复
        generateDQAnswerNow(dq);
    } else {
        // 还没到时间，设置定时器
        const delay = expectedTime - now;
        setTimeout(() => {
            // 重新从数组中获取最新数据
            const currentDq = dreamQuestionnaires.find(q => q.id === dq.id);
            if (currentDq && currentDq.sent && !currentDq.answer) {
                generateDQAnswerNow(currentDq);
            }
        }, delay);
    }
}

// 无需关闭的保存
function saveDQWithoutClose(targetDQ) {
    const title = document.getElementById('dq-title-input').value.trim();
    if (title) targetDQ.title = title;
    targetDQ.type = dqCurrentType;
    targetDQ.replyTime = dqCurrentReplyTime;
    
    document.querySelectorAll('.dq-question-input').forEach(input => {
        const index = parseInt(input.dataset.qindex);
        if (!isNaN(index) && dqQuestions[index]) {
            dqQuestions[index].question = input.value;
        }
    });
    
    targetDQ.questions = dqQuestions.filter(q => q.question.trim()).map(q => ({
        question: q.question.trim(),
        options: dqCurrentType === 'choice' ? (q.options || []).map(o => o.trim()).filter(o => o) : []
    }));
}

// 安排回复
function scheduleDQReply(dq) {
    let delay;
    if (dq.replyTime === 'immediate') {
        delay = 2000 + Math.random() * 3000;
    } else {
        delay = Math.floor(Math.random() * 300 * 60 * 1000); // 0-300 分钟
    }
    
    setTimeout(() => {
        generateDQAnswer(dq);
    }, delay);
}

// 立即生成回复
function generateDQAnswerNow(dq) {
    if (!dq || !dq.questions) return;
    if (dq.answer) return; // 已经有答案了，不重复生成
    
    const answers = dq.questions.map(q => {
        if (dq.type === 'choice') {
            const options = q.options || [];
            if (options.length === 0) return { question: q.question, answer: '(无选项)' };
            const randomIndex = Math.floor(Math.random() * options.length);
            return { question: q.question, answer: options[randomIndex] };
        } else {
            // 填空题：从主字卡中随机抽取 1-3 句话
            const replyPool = customReplies && customReplies.length > 0 
                ? customReplies 
                : (typeof CONSTANTS !== 'undefined' && CONSTANTS.REPLY_MESSAGES && CONSTANTS.REPLY_MESSAGES.length > 0
                    ? CONSTANTS.REPLY_MESSAGES
                    : ['一切安好', '今天很开心', '想你']);
            const sentenceCount = 1 + Math.floor(Math.random() * 3); // 1-3 句
            const selected = [];
            const shuffled = [...replyPool].sort(() => Math.random() - 0.5);
            for (let i = 0; i < Math.min(sentenceCount, shuffled.length); i++) {
                selected.push(shuffled[i]);
            }
            return { question: q.question, answer: selected.join('。') + (selected.length > 0 ? '。' : '') };
        }
    });
    
    dq.answer = {
        answers,
        answeredAt: Date.now()
    };
    saveDQData();
    
    // 如果问卷列表当前可见，刷新显示
    const dqList = document.getElementById('dq-list');
    if (dqList && document.getElementById('dream-questionnaire-modal').style.display !== 'none') {
        renderDQList();
    }
    
    // 通知用户
    showNotification(`梦角已填写问卷「${dq.title}」✨`, 'success', 4000);
}

// 查看问卷答案
function viewDQAnswer(id) {
    const dq = dreamQuestionnaires.find(q => q.id === id);
    if (!dq || !dq.answer) return;
    
    const mainView = document.getElementById('dq-main-view');
    const editorView = document.getElementById('dq-editor-view');
    const answerView = document.getElementById('dq-answer-view');
    const answerContent = document.getElementById('dq-answer-content');
    
    mainView.style.display = 'none';
    editorView.style.display = 'none';
    answerView.style.display = 'block';
    
    answerContent.innerHTML = `
        <div style="margin-bottom: 16px;">
            <div style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">${escapeHtml(dq.title)}</div>
            <div style="font-size: 11px; color: var(--text-secondary);">
                ${new Date(dq.answer.answeredAt).toLocaleString('zh-CN')} · 梦角填写
            </div>
        </div>
        ${dq.answer.answers.map((a, i) => `
            <div class="dq-qa-item">
                <div class="dq-qa-question">${i + 1}. ${escapeHtml(a.question)}</div>
                <div class="dq-qa-answer ${dq.type === 'fill' ? 'fill-answer' : ''}">${escapeHtml(a.answer)}</div>
            </div>
        `).join('')}
    `;
    
    document.getElementById('dq-create-btn').style.display = 'none';
    document.getElementById('dq-save-btn').style.display = 'none';
    document.getElementById('dq-send-btn').style.display = 'none';
    document.getElementById('dq-back-btn').style.display = '';
    document.getElementById('close-dq-modal').style.display = 'none';
}

// 删除问卷
function deleteDQ(id) {
    if (!confirm('确定要删除这个问卷吗？')) return;
    dreamQuestionnaires = dreamQuestionnaires.filter(q => q.id !== id);
    saveDQData();
    renderDQList();
    showNotification('问卷已删除', 'success');
}

// 初始化问卷事件
function initDQListeners() {
    // 创建按钮
    document.getElementById('dq-create-btn').addEventListener('click', () => openDQEditor(null));
    
    // 返回按钮
    document.getElementById('dq-back-btn').addEventListener('click', backToDQMain);
    
    // 保存按钮
    document.getElementById('dq-save-btn').addEventListener('click', saveDQ);
    
    // 发送按钮
    document.getElementById('dq-send-btn').addEventListener('click', sendDQ);
    
    // 关闭按钮
    document.getElementById('close-dq-modal').addEventListener('click', () => {
        hideModal(document.getElementById('dream-questionnaire-modal'));
    });
    
    // 类型按钮
    document.querySelectorAll('.dq-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dqCurrentType = btn.dataset.type;
            updateDQTypeButtons();
            renderDQQuestions();
        });
    });
    
    // 回复时间按钮
    document.querySelectorAll('.dq-reply-time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dqCurrentReplyTime = btn.dataset.time;
            updateDQReplyTimeButtons();
        });
    });
    
    // 添加题目按钮
    document.getElementById('dq-add-question-btn').addEventListener('click', addDQQuestion);
    
    // 高级功能入口
    const dqEntry = document.getElementById('dream-questionnaire-function');
    if (dqEntry) {
        dqEntry.addEventListener('click', async () => {
            if (DOMElements.advancedModal && DOMElements.advancedModal.modal) {
                hideModal(DOMElements.advancedModal.modal);
            }
            if (window.QuestionnaireFeature && typeof window.QuestionnaireFeature.open === 'function') {
                window.QuestionnaireFeature.open();
                return;
            }
            await loadDQData();
            renderDQList();
            showModal(document.getElementById('dream-questionnaire-modal'));
        });
    }
}

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initDQListeners, 500);
});
// ==================== 修改后的书架功能 ====================
let bookshelf = [];
let currentReaderBook = null;
let readerPageSize = 800;
let readerFontSize = 15;
let readerCurrentPage = 0;
let readerPages = [];
let readerIsMinimized = false;  // 是否最小化

const BOOKSHELF_STORAGE_KEY = 'userBookshelf';
const READER_WINDOW_STATE_KEY = 'readerWindowState';

// 加载书架数据
async function loadBookshelf() {
    try {
        const saved = await localforage.getItem(BOOKSHELF_STORAGE_KEY);
        if (saved && Array.isArray(saved)) {
            bookshelf = saved;
        }
    } catch(e) {
        bookshelf = [];
    }
    
    // 恢复阅读器状态（如果之前有打开的书籍）
    await restoreReaderState();
}

// 恢复阅读器状态
async function restoreReaderState() {
    try {
        const state = await localforage.getItem(READER_WINDOW_STATE_KEY);
        if (state && state.bookId && state.isMinimized) {
            const book = bookshelf.find(b => b.id === state.bookId);
            if (book) {
                currentReaderBook = book;
                readerCurrentPage = state.currentPage || 0;
                readerFontSize = state.fontSize || 15;
                readerIsMinimized = true;
                
                paginateBook(book);
                updateMiniPill();
                showMiniPill();
                
                // 设置阅读器内容（为展开做准备）
                document.getElementById('reader-title').textContent = book.name;
                document.getElementById('reader-content').style.fontSize = readerFontSize + 'px';
                document.getElementById('reader-font-size').textContent = readerFontSize + 'px';
                if (readerCurrentPage >= readerPages.length) readerCurrentPage = 0;
                renderCurrentPage();
                updateReaderNav();
                updateReaderProgress();
            }
        }
    } catch(e) {
        // 忽略恢复错误
    }
}

// 保存阅读器状态
function saveReaderState() {
    if (currentReaderBook && readerIsMinimized) {
        localforage.setItem(READER_WINDOW_STATE_KEY, {
            bookId: currentReaderBook.id,
            currentPage: readerCurrentPage,
            fontSize: readerFontSize,
            isMinimized: true,
            timestamp: Date.now()
        }).catch(() => {});
    } else {
        localforage.removeItem(READER_WINDOW_STATE_KEY).catch(() => {});
    }
}

// 保存书架数据
function saveBookshelf() {
    localforage.setItem(BOOKSHELF_STORAGE_KEY, bookshelf).catch(() => {});
}

// 渲染书架
function renderBookshelf() {
    const grid = document.getElementById('bookshelf-grid');
    if (!grid) return;

    if (bookshelf.length === 0) {
        grid.innerHTML = `
            <div class="bookshelf-empty" style="grid-column: 1 / -1;">
                <i class="fas fa-book-open"></i>
                <p>书架空空如也</p>
                <span>点击"导入小说"添加你的第一本书吧~</span>
            </div>`;
        return;
    }

    grid.innerHTML = bookshelf.map((book, index) => {
        const progress = book.totalPages > 0 
            ? Math.round((book.currentPage / book.totalPages) * 100) 
            : 0;
        const coverHtml = book.cover 
            ? `<img src="${book.cover}" alt="${escapeHtml(book.name)}">`
            : `<i class="fas fa-book book-cover-icon"></i>`;

        // 标记当前正在阅读的书籍
        const isReading = currentReaderBook && currentReaderBook.id === book.id;
        const readingBadge = isReading ? `<span style="position:absolute;top:6px;left:6px;background:var(--accent-color);color:#fff;font-size:9px;padding:2px 6px;border-radius:10px;z-index:2;">阅读中</span>` : '';

        return `
            <div class="book-item" onclick="openReader('${book.id}')">
                <div class="book-cover">
                    ${coverHtml}
                    ${readingBadge}
                    <div class="book-item-actions">
                        <button class="book-action-btn" onclick="event.stopPropagation(); editBookName('${book.id}')" title="修改书名">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="book-action-btn" onclick="event.stopPropagation(); changeBookCover('${book.id}')" title="更换封面">
                            <i class="fas fa-image"></i>
                        </button>
                        <button class="book-action-btn danger" onclick="event.stopPropagation(); deleteBook('${book.id}')" title="删除">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="book-name">${escapeHtml(book.name)}</div>
                ${book.totalPages > 0 ? `<div class="book-progress">${progress}%</div>` : ''}
            </div>`;
    }).join('');
}

// 导入TXT小说
function importBook(file) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
        showNotification('请选择 TXT 文件', 'error');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showNotification('文件太大，请选择 10MB 以内的文件', 'error');
        return;
    }

    showNotification('正在处理文件...', 'info', 1500);

    const reader = new FileReader();
    reader.onload = function(e) {
        let content = e.target.result;
        
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        const bookName = file.name.replace(/\.txt$/i, '');
        
        const book = {
            id: 'book_' + Date.now(),
            name: bookName,
            cover: null,
            content: content,
            currentPage: 0,
            totalPages: 0,
            addedAt: Date.now()
        };

        book.totalPages = Math.ceil(content.length / readerPageSize);
        bookshelf.unshift(book);
        saveBookshelf();
        renderBookshelf();
        showNotification(`「${bookName}」已添加到书架 ✨`, 'success');
    };
    
    reader.onerror = function() {
        showNotification('文件读取失败，请重试', 'error');
    };

    reader.readAsText(file, 'UTF-8');
}

// 打开阅读器
function openReader(bookId) {
    const book = bookshelf.find(b => b.id === bookId);
    if (!book) return;

    currentReaderBook = book;
    readerIsMinimized = false;

    // 如果书架模态框打开，关闭它
    const bsModal = document.getElementById('bookshelf-modal');
    if (bsModal && bsModal.style.display !== 'none') {
        hideModal(bsModal);
    }

    // 分页
    paginateBook(book);

    // 设置阅读器
    document.getElementById('reader-title').textContent = book.name;
    document.getElementById('reader-content').style.fontSize = readerFontSize + 'px';
    document.getElementById('reader-font-size').textContent = readerFontSize + 'px';

    // 定位到上次阅读位置
    readerCurrentPage = book.currentPage || 0;
    if (readerCurrentPage >= readerPages.length) readerCurrentPage = 0;

    renderCurrentPage();
    updateReaderNav();
    updateReaderProgress();

    // 显示阅读器窗口，隐藏悬浮球
    const readerWindow = document.getElementById('reader-window');
    positionReaderWindow();
    readerWindow.classList.add('visible');
    hideMiniPill();

    // 关闭书架模态框
    hideModal(document.getElementById('bookshelf-modal'));

    // 保存状态
    saveReaderState();
}

// 分页处理
function paginateBook(book) {
    const content = book.content || '';
    readerPages = [];
    
    let start = 0;
    while (start < content.length) {
        let end = start + readerPageSize;
        if (end < content.length) {
            const searchEnd = Math.min(end + 200, content.length);
            const breakPos = content.indexOf('\n', end);
            if (breakPos !== -1 && breakPos < searchEnd) {
                end = breakPos + 1;
            }
        }
        readerPages.push(content.slice(start, Math.min(end, content.length)));
        start = end;
    }

    book.totalPages = readerPages.length;
}

// 渲染当前页
function renderCurrentPage() {
    const contentEl = document.getElementById('reader-content');
    if (!contentEl) return;

    if (readerPages.length === 0) {
        contentEl.textContent = '(无内容)';
        return;
    }

    const pageContent = readerPages[Math.min(readerCurrentPage, readerPages.length - 1)] || '';
    contentEl.textContent = pageContent;
    contentEl.scrollTop = 0;
}

// 更新阅读器导航按钮
function updateReaderNav() {
    const prevBtn = document.getElementById('reader-prev-btn');
    const nextBtn = document.getElementById('reader-next-btn');
    const pageInfo = document.getElementById('reader-page-info');

    if (prevBtn) prevBtn.disabled = readerCurrentPage <= 0;
    if (nextBtn) nextBtn.disabled = readerCurrentPage >= readerPages.length - 1;
    if (pageInfo) {
        const totalPages = readerPages.length || 1;
        pageInfo.textContent = `第 ${Math.min(readerCurrentPage + 1, totalPages)}/${totalPages} 页`;
    }
}

// 更新进度条
function updateReaderProgress() {
    const progressBar = document.getElementById('reader-progress-bar');
    if (progressBar && readerPages.length > 0) {
        const percent = ((readerCurrentPage + 1) / readerPages.length) * 100;
        progressBar.style.width = percent + '%';
    }
}

// 翻页
function readerNextPage() {
    if (readerCurrentPage < readerPages.length - 1) {
        readerCurrentPage++;
        renderCurrentPage();
        updateReaderNav();
        updateReaderProgress();
        saveReadingProgress();
        updateMiniPill();  // 更新悬浮球信息
    }
}

function readerPrevPage() {
    if (readerCurrentPage > 0) {
        readerCurrentPage--;
        renderCurrentPage();
        updateReaderNav();
        updateReaderProgress();
        saveReadingProgress();
        updateMiniPill();  // 更新悬浮球信息
    }
}

// 保存阅读进度
function saveReadingProgress() {
    if (currentReaderBook) {
        currentReaderBook.currentPage = readerCurrentPage;
        saveBookshelf();
        saveReaderState();
    }
}

// 定位阅读器窗口
function positionReaderWindow() {
    const readerWindow = document.getElementById('reader-window');
    if (!readerWindow) return;

    const w = Math.min(420, window.innerWidth - 40);
    const h = Math.min(560, window.innerHeight - 100);
    const left = Math.max(20, (window.innerWidth - w) / 2);
    const top = Math.max(60, (window.innerHeight - h) / 2);

    readerWindow.style.width = w + 'px';
    readerWindow.style.height = h + 'px';
    readerWindow.style.left = left + 'px';
    readerWindow.style.top = top + 'px';
    readerWindow.style.right = 'auto';
    readerWindow.style.bottom = 'auto';
}

// ==================== 最小化/恢复功能 ====================

// 显示最小化悬浮球
function showMiniPill() {
    const pill = document.getElementById('reader-mini-pill');
    if (pill) {
        pill.classList.add('visible');
        updateMiniPill();
    }
}

// 隐藏最小化悬浮球
function hideMiniPill() {
    const pill = document.getElementById('reader-mini-pill');
    if (pill) {
        pill.classList.remove('visible');
    }
}

// 更新悬浮球信息
function updateMiniPill() {
    if (!currentReaderBook) return;
    
    const titleEl = document.getElementById('reader-mini-title');
    const pageEl = document.getElementById('reader-mini-page');
    
    if (titleEl) {
        titleEl.textContent = currentReaderBook.name;
    }
    if (pageEl) {
        const totalPages = readerPages.length || 1;
        pageEl.textContent = `第 ${Math.min(readerCurrentPage + 1, totalPages)}/${totalPages} 页`;
    }
}

// 关闭阅读器（从悬浮球关闭）
function closeReaderFromPill() {
    if (confirm('确定要关闭阅读器吗？阅读进度已自动保存。')) {
        saveReadingProgress();
        currentReaderBook = null;
        readerPages = [];
        readerIsMinimized = false;
        hideMiniPill();
        
        // 清除阅读器内容
        const readerWindow = document.getElementById('reader-window');
        if (readerWindow) {
            readerWindow.classList.remove('visible');
        }
        document.getElementById('reader-content').textContent = '';
        
        saveReaderState();
    }
}

function closeReader() {
    if (!currentReaderBook) return;
    
    saveReadingProgress();
    
    // 隐藏阅读器窗口
    const readerWindow = document.getElementById('reader-window');
    if (readerWindow) {
        readerWindow.classList.remove('visible');
    }
    
    // 隐藏悬浮球
    hideMiniPill();
    
    // 清除阅读状态
    currentReaderBook = null;
    readerPages = [];
    readerIsMinimized = false;
    
    // 清除阅读器内容
    const contentEl = document.getElementById('reader-content');
    if (contentEl) {
        contentEl.textContent = '';
    }
    document.getElementById('reader-title').textContent = '小说名称';
    
    // 清除持久化状态
    saveReaderState();
    
    showNotification('阅读器已关闭', 'info');
}

function minimizeReader() {
    if (!currentReaderBook) return;
    
    saveReadingProgress();
    
    // 隐藏阅读器窗口
    const readerWindow = document.getElementById('reader-window');
    if (readerWindow) {
        readerWindow.classList.remove('visible');
    }
    
    // 设置为最小化状态
    readerIsMinimized = true;
    
    // 更新并显示悬浮球
    updateMiniPill();
    showMiniPill();
    saveReaderState();
    
    showNotification('阅读器已最小化，点击悬浮球继续阅读', 'success');
}

// 从悬浮球恢复阅读器
function restoreReader() {
    if (!currentReaderBook) return;
    
    readerIsMinimized = false;
    hideMiniPill();

    // 确保阅读器内容已设置
    document.getElementById('reader-title').textContent = currentReaderBook.name;
    document.getElementById('reader-content').style.fontSize = readerFontSize + 'px';
    document.getElementById('reader-font-size').textContent = readerFontSize + 'px';
    
    if (readerCurrentPage >= readerPages.length) readerCurrentPage = 0;
    renderCurrentPage();
    updateReaderNav();
    updateReaderProgress();

    // 显示阅读器窗口
    const readerWindow = document.getElementById('reader-window');
    positionReaderWindow();
    readerWindow.classList.add('visible');
    
    saveReaderState();
}

// 修改书名
function editBookName(bookId) {
    const book = bookshelf.find(b => b.id === bookId);
    if (!book) return;

    const newName = prompt('请输入新书名：', book.name);
    if (newName !== null && newName.trim()) {
        book.name = newName.trim();
        saveBookshelf();
        renderBookshelf();
        
        // 如果正在阅读这本书，更新标题
        if (currentReaderBook && currentReaderBook.id === bookId) {
            document.getElementById('reader-title').textContent = book.name;
            updateMiniPill();
        }
        
        showNotification('书名已更新', 'success');
    }
}

// 更换封面
function changeBookCover(bookId) {
    const book = bookshelf.find(b => b.id === bookId);
    if (!book) return;

    const coverInput = document.getElementById('bs-cover-input');
    if (!coverInput) return;

    coverInput.dataset.bookId = bookId;
    coverInput.click();
}

// 处理封面图片上传
function handleBookCoverUpload(file) {
    const coverInput = document.getElementById('bs-cover-input');
    const bookId = coverInput ? coverInput.dataset.bookId : null;
    if (!bookId || !file) return;

    const book = bookshelf.find(b => b.id === bookId);
    if (!book) return;

    if (file.size > 2 * 1024 * 1024) {
        showNotification('封面图片不能超过 2MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        book.cover = e.target.result;
        saveBookshelf();
        renderBookshelf();
        showNotification('封面已更新 ✨', 'success');
    };
    reader.readAsDataURL(file);

    if (coverInput) {
        coverInput.value = '';
        delete coverInput.dataset.bookId;
    }
}

// 删除书籍
function deleteBook(bookId) {
    if (!confirm('确定要删除这本书吗？此操作不可恢复。')) return;

    bookshelf = bookshelf.filter(b => b.id !== bookId);

    // 如果正在阅读这本书，关闭阅读器
    if (currentReaderBook && currentReaderBook.id === bookId) {
        currentReaderBook = null;
        readerPages = [];
        readerIsMinimized = false;
        hideMiniPill();
        document.getElementById('reader-window')?.classList.remove('visible');
        document.getElementById('reader-content').textContent = '';
        saveReaderState();
    }

    saveBookshelf();
    renderBookshelf();
    showNotification('书籍已删除', 'success');
}

// 阅读器拖拽功能
function initReaderDrag() {
    const readerWindow = document.getElementById('reader-window');
    const header = document.getElementById('reader-header');
    if (!readerWindow || !header) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onStart = function(e) {
        if (e.target.closest('.reader-header-btn') || e.target.closest('.reader-font-controls')) return;
        
        isDragging = true;
        readerWindow.style.transition = 'none';
        
        const point = e.touches ? e.touches[0] : e;
        const rect = readerWindow.getBoundingClientRect();
        startX = point.clientX;
        startY = point.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;
        
        e.preventDefault();
    };

    const onMove = function(e) {
        if (!isDragging) return;
        
        const point = e.touches ? e.touches[0] : e;
        const dx = point.clientX - startX;
        const dy = point.clientY - startY;
        
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;
        
        const maxLeft = window.innerWidth - readerWindow.offsetWidth;
        const maxTop = window.innerHeight - readerWindow.offsetHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        readerWindow.style.left = newLeft + 'px';
        readerWindow.style.top = newTop + 'px';
        readerWindow.style.right = 'auto';
        readerWindow.style.bottom = 'auto';
    };

    const onEnd = function() {
        if (isDragging) {
            isDragging = false;
            readerWindow.style.transition = '';
        }
    };

    header.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    header.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
}

// 初始化悬浮球点击事件
function initMiniPillEvents() {
    const pill = document.getElementById('reader-mini-pill');
    if (!pill) return;

    // 点击悬浮球恢复阅读器
    pill.addEventListener('click', function(e) {
        // 如果点击的是关闭按钮，不触发恢复
        if (e.target.closest('#reader-mini-close-btn')) return;
        restoreReader();
    });

    // 关闭按钮
    const closeBtn = document.getElementById('reader-mini-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeReaderFromPill();
        });
    }

    // 禁止拖拽时触发点击
    let hasMoved = false;
    let startX, startY;

    pill.addEventListener('pointerdown', function(e) {
        if (e.target.closest('#reader-mini-close-btn')) return;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
    });

    pill.addEventListener('pointermove', function(e) {
        if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) {
            hasMoved = true;
        }
    });

    pill.addEventListener('pointerup', function(e) {
        // 如果移动了就不触发点击
        if (hasMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

// 初始化书架功能
function initBookshelf() {
    // 邀约入口
    const entryBtn = document.getElementById('bookshelf-function');
    if (entryBtn) {
        entryBtn.addEventListener('click', async () => {
            const inviteModal = document.getElementById('invite-modal');
            if (inviteModal) hideModal(inviteModal);
            await loadBookshelf();
            renderBookshelf();
            showModal(document.getElementById('bookshelf-modal'));
        });
    }

    // 关闭书架按钮
    const closeBtn = document.getElementById('close-bookshelf');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideModal(document.getElementById('bookshelf-modal'));
        });
    }

    // 导入按钮
    const importBtn = document.getElementById('bs-import-btn');
    const txtInput = document.getElementById('bs-txt-input');
    if (importBtn && txtInput) {
        importBtn.addEventListener('click', () => txtInput.click());
        txtInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                importBook(file);
                e.target.value = '';
            }
        });
    }

    // 封面上传
    const coverInput = document.getElementById('bs-cover-input');
    if (coverInput) {
        coverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleBookCoverUpload(file);
            }
        });
    }

   // 阅读器控制按钮 - 修正的事件绑定
document.getElementById('reader-prev-btn')?.addEventListener('click', readerPrevPage);
document.getElementById('reader-next-btn')?.addEventListener('click', readerNextPage);

// 【重要】关闭按钮 → 完全关闭
document.getElementById('reader-close-btn')?.addEventListener('click', () => {
    closeReader();  // 完全关闭，不显示悬浮球
});

// 【重要】最小化按钮 → 缩成悬浮球
document.getElementById('reader-minimize-btn')?.addEventListener('click', () => {
    minimizeReader();  // 最小化，显示悬浮球
});

    // 字体大小调整
    document.getElementById('reader-font-plus')?.addEventListener('click', () => {
        if (readerFontSize < 24) {
            readerFontSize += 2;
            document.getElementById('reader-content').style.fontSize = readerFontSize + 'px';
            document.getElementById('reader-font-size').textContent = readerFontSize + 'px';
            if (currentReaderBook) {
                readerPageSize = Math.round(800 * (15 / readerFontSize));
                paginateBook(currentReaderBook);
                if (readerCurrentPage >= readerPages.length) readerCurrentPage = 0;
                renderCurrentPage();
                updateReaderNav();
                updateReaderProgress();
            }
        }
    });

    document.getElementById('reader-font-minus')?.addEventListener('click', () => {
        if (readerFontSize > 10) {
            readerFontSize -= 2;
            document.getElementById('reader-content').style.fontSize = readerFontSize + 'px';
            document.getElementById('reader-font-size').textContent = readerFontSize + 'px';
            if (currentReaderBook) {
                readerPageSize = Math.round(800 * (15 / readerFontSize));
                paginateBook(currentReaderBook);
                if (readerCurrentPage >= readerPages.length) readerCurrentPage = 0;
                renderCurrentPage();
                updateReaderNav();
                updateReaderProgress();
            }
        }
    });

    // 键盘翻页
    document.addEventListener('keydown', (e) => {
        const readerWindow = document.getElementById('reader-window');
        if (!readerWindow || !readerWindow.classList.contains('visible')) return;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            readerNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            readerPrevPage();
        } else if (e.key === 'Escape') {
            closeReader();
        }
    });

    // 初始化拖拽
    initReaderDrag();
    
    // 初始化悬浮球事件
    initMiniPillEvents();

    // 页面加载时恢复阅读器状态
    loadBookshelf().then(() => {
        // 状态已在 loadBookshelf -> restoreReaderState 中恢复
    });
}

// 在DOMContentLoaded中初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initBookshelf, 600);
});
// ==================== 礼物盲盒功能 ====================
(function() {
    'use strict';

    // ---------- 礼物图片库 ----------
     const GIFT_IMAGES = [   
  'https://i.postimg.cc/66jdgMH7/image-1779352458274.png',
  'https://i.postimg.cc/HnhXMLJy/image-1779352462383.png',
  'https://i.postimg.cc/T1wnhb3B/image-1779352474092.png',
  'https://i.postimg.cc/QtSpXmhq/image-1779352483166.png',
  'https://i.postimg.cc/MTz72N2G/image-1779352492254.png',
  'https://i.postimg.cc/LsttWRWT/image-1779352511217.png',
  'https://i.postimg.cc/tg33cyck/image-1779352580093.png',
  'https://i.postimg.cc/6QJVzTMh/image-1779352583517.png',
  'https://i.postimg.cc/TPMjQhtV/image-1779352893855.png',
  'https://i.postimg.cc/6QJVzTMC/image-1779352897628.png',
  'https://i.postimg.cc/jj06vCMz/image-1779352914437.png',
  'https://i.postimg.cc/W4LmSt5F/image-1779352918642.png',
  'https://i.postimg.cc/hGW8Mh2X/image-1779352927165.png',
  'https://i.postimg.cc/xdDGgq6d/image-1779352931965.png',
  'https://i.postimg.cc/9f5P1zLF/image-1779352937325.png',
  'https://i.postimg.cc/52Fqw8SH/image-1779352951012.png',
  'https://i.postimg.cc/tCcNZBWH/image-1779352954121.png',
  'https://i.postimg.cc/HsN9c653/image-1779352965723.png',
  'https://i.postimg.cc/rsFNWbQJ/image-1779353158151.png',
  'https://i.postimg.cc/PxMMChzW/image-1779353161720.png',
  'https://i.postimg.cc/MTYYnxbZ/image-1779353169802.png',
  'https://i.postimg.cc/bvkgj1ZC/image-1779353175894.png',
  'https://i.postimg.cc/zfK71Ty0/image-1779353181113.png',
  'https://i.postimg.cc/L8rD7x8X/image-1779353190263.png',
  'https://i.postimg.cc/QdRmPfdq/image-1779353197471.png',
  'https://i.postimg.cc/ZKsVPbkF/image-1779353201977.png',
  'https://i.postimg.cc/qMv1CtFC/image-1779353218581.png',
  'https://i.postimg.cc/J7qTn3p4/image-1779353221617.png',
  'https://i.postimg.cc/2jwH6d2t/image-1779353225170.png',
  'https://i.postimg.cc/8ctw0D7D/image-1779353231000.png',
  'https://i.postimg.cc/J0PK2msM/image-1779353235773.png',
  'https://i.postimg.cc/FzDGBm7w/image-1779353240854.png',
  'https://i.postimg.cc/cCXTbZrz/image-1779353304321.png',
  'https://i.postimg.cc/d3q46Dt6/image-1779353435283.png',
  'https://i.postimg.cc/j2sZcCdX/image-1779353439919.png',
  'https://i.postimg.cc/wM6023TD/image-1779353448223.png',
  'https://i.postimg.cc/nzK3qqZ4/image-1779353462716.png',
  'https://i.postimg.cc/d1R5GGv8/image-1779353466204.png',
  'https://i.postimg.cc/d1R5GGvd/image-1779353471821.png',
  'https://i.postimg.cc/pTQsKKxr/image-1779353476794.png',
  'https://i.postimg.cc/9MPLyyVz/image-1779353480108.png',
  'https://i.postimg.cc/RF1gww9F/image-1779353504441.png',
  'https://i.postimg.cc/C1CcbbY0/image-1779353509645.png',
  'https://i.postimg.cc/9XJpVmfC/IMG-20260521-164340.png',
  'https://i.postimg.cc/qqbXGLFs/IMG-20260521-164401.png',
  'https://i.postimg.cc/Kjqr5NH6/IMG-20260521-164415.png',
  'https://i.postimg.cc/GthxYNXb/IMG-20260521-164432.png',
  'https://i.postimg.cc/prXJ87s2/IMG-20260521-164500.png',
  'https://i.postimg.cc/VvLWMTKy/IMG-20260521-164513.png',
  'https://i.postimg.cc/J045JgP5/IMG-20260521-164532.png',
  'https://i.postimg.cc/3NXdZCxg/image-1779352368523.png',
  'https://i.postimg.cc/QCGF5nhZ/image-1779352373273.png',
  'https://i.postimg.cc/x8DXHFYF/image-1779352377414.png',
  'https://i.postimg.cc/76TC5yvB/image-1779352384759.png',
  'https://i.postimg.cc/GhPyPr4K/image-1779352388125.png',
  'https://i.postimg.cc/L6k1kRJC/image-1779352394700.png',
  'https://i.postimg.cc/3rvpR2Y4/image-1779352424044.png',
  'https://i.postimg.cc/FHDkqZgJ/image-1779352450457.png',
  'https://i.postimg.cc/C1Wq7xCs/image-1779352453900.png',
  'https://i.postimg.cc/LXZgPTHN/image-1781177009996.png',
  'https://i.postimg.cc/8z1vYMHJ/image-1781178032420.png',
  'https://i.postimg.cc/qMcnQj2P/image-1781178128662.png',
  'https://i.postimg.cc/3wNv8hVL/image-1781178161844.png',
  'https://i.postimg.cc/1XwFkK2P/image-1781529988870.png',
  'https://i.postimg.cc/j2PfphmL/image-1781529993126.png',
  'https://i.postimg.cc/rsx4B93x/image-1781529997116.png',
  'https://i.postimg.cc/Xqd5Rgmj/image-1781530000766.png',
  'https://i.postimg.cc/C5k834Xs/image-1781530004283.png',
  'https://i.postimg.cc/ryr5R8mP/image-1781530008021.png',
  'https://i.postimg.cc/G3yvTct0/image-1781530011433.png',
  'https://i.postimg.cc/HWyb8pnm/image-1781530015125.png',
  'https://i.postimg.cc/9X7ywW0c/image-1781530018797.png',
  'https://i.postimg.cc/fW9YSwyb/image-1781530025711.png',
  'https://i.postimg.cc/X76dwTBN/image-1781530029779.png',
  'https://i.postimg.cc/gkyR4N3M/image-1781530034015.png',
  'https://i.postimg.cc/qR9nDFm5/image-1781530038089.png',
  'https://i.postimg.cc/Y9JgDPXT/image-1781530044505.png',
  'https://i.postimg.cc/ZR13sQ7m/image-1781530048291.png',
  'https://i.postimg.cc/C1dHQkwj/image-1781530166686.png',
  'https://i.postimg.cc/hjwbWvGs/image-1781530219624.png',
  'https://i.postimg.cc/B6yc9b69/image-1781530242288.png',
  'https://i.postimg.cc/nrDKHxsg/image-1781530276844.png',
  'https://i.postimg.cc/9fQGDZwj/image-1781530318131.png',
  'https://i.postimg.cc/h4kb2X6K/image-1781530356003.png',
  'https://i.postimg.cc/y8BhzwVs/image-1781530380477.png',
  'https://i.postimg.cc/NFH8gt9K/image-1781530423467.png',
  'https://i.postimg.cc/5t2wXLQf/image-1781530463297.png',
  'https://i.postimg.cc/JhYjZ0j4/image-1781530482804.png',
  'https://i.postimg.cc/vB1fzyv4/image-1781530513514.png',
  'https://i.postimg.cc/tT1W5bzz/image-1781530561241.png',
  'https://i.postimg.cc/vB1fzyv7/image-1781530574901.png',
  'https://i.postimg.cc/LXqLTSVx/image-1781530592944.png',
  'https://i.postimg.cc/fL6XqPHB/image-1781530607954.png',
  'https://i.postimg.cc/50jqRLf4/image-1781532414460.png',
  'https://i.postimg.cc/sX19N73B/image-1781532445483.png',
  'https://i.postimg.cc/0QrdBD9j/image-1781532452844.png',
  'https://i.postimg.cc/9MztnZcD/image-1781532507094.png'
    ];

    // ---------- 情话文案库 ----------
    const GIFT_TEXTS = [      
      '你是我新鲜又永恒的春天，是唯一贯穿我所有诗篇的韵脚。',
      '你最可爱，我说时来不及思索。而思索之后，还是这样说。',
      '如果你还在这个世界存在着，那么这个世界无论什么样，对我都是有意义的。',
      '自从我们相遇，你是我白日的白昼，夜晚的星辰，战栗中我全部的青春。',
      '你是我灵魂最后一块拼图，是我所有流浪的终点。',
      '你哄哄我我哄哄你，我们就这样喵喵咪咪汪汪嗷嗷在一起一辈子',
      '该怎么开口呢，是说天气，还是说好想你',
      '当我感到脆弱的时候，就重复你的名字',
      '我毕生的愿望，就是可以和一个人达成同谋，我在你身上找到了这种感觉，同时也找到了我生命的新的意义',
      '我每天都感谢命运让我遇到你，没有你，我的一部分将永远待在黑暗里',
      '我想给你打电话，告诉你天气晴朗，告诉你我爱你，就像人们爱希望和爱确定一样',
      '有一个可以想念的人，就是幸福。',
      '喜欢的东西很贵，喜欢的人很完美，恰好，喜欢的人是你。',
      '我嫉妒你身边每一个无关紧要的人，他们就那样轻而易举见到我朝思暮想的你。',
      '不管怎样，你要多多来信——收信的日子便是节日。吻你。完全属于你、等着你的小狗。吻你吻你再吻你。',
      '你偶然闯入了我并不引以为傲的生活，从那天起，我的生活开始发生变化。我的呼吸变得顺畅了，我讨厌的东西减少了，我可以自由地欣赏值得欣赏的东西了。',
      '说你需要我，依赖我，想我，喜欢我。',
      '我喜欢你给我分享的所有事，即使是小事，我也想听，那样我们的距离就不会远。',
  '上天让我遇到你，我很幸福，所以我万般珍惜不想让幸福从我手中溜走。',
  '那些见不到你的日子都成了爱情的养料，现在在你身边的我比任何时候都确信所有的等待都值得。',
  '我说幸福万万岁，我说你拥有幸福万万年。',
  '爱的成本太高了，要时间，要见面，要担心，要经历异地会猜疑，会掉眼泪，会胡思乱想，会没有安全感，会敏感，但我想说的是我爱你，也请你给我更多一些耐心，请爱我，好吗？',
  '谢谢你在世界的角落找到我。',
  '你一直說我很好，其實一直很好的人是你。',
  '转动戒指像是抚摸我的异地恋人。',
  '其实我远比你想象中的更需要你，因为我真的很在意你，你总能左右我的情绪，我喜欢每天早上醒来看到你的消息，我喜欢你看到好看的视频时与我分享的样子，我喜欢你大事小事都跟我说让我感觉到被需要，无论相隔多远，都能让我感受到内心的炽热，我想和你一直走下去，期待你的每一天，更期待和你一起做更多有意义的事，我爱你。',
  '不喜欢我的人或许很多，但你不可以，因为我在意。',
  '你没有什么要改变的，我只想爱你，爱你的过去、现在和未来。',
  '卖萌好累啊，我就站在这里呼吸两下拜托你一直爱我好不好。',
  '我本不想和风讨论你，可风说可以替我见你。',
  '我好想你。',
  '可不可以不要不依赖我。'
    ];

    const MAX_DAILY_GIFTS = 3;  // 每天最多3个礼物
    const GIFT_MIN_INTERVAL = 30 * 60 * 1000;   // 最小间隔10分钟
    const GIFT_MAX_INTERVAL = 120 * 60 * 1000;   // 最大间隔45分钟

    let giftTimer = null;

    // 获取今日已发送次数
    function getTodayGiftCount() {
        const today = new Date().toDateString();
        const stored = localStorage.getItem('gift_daily_count');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                if (data.date === today) return data.count;
            } catch(e) {}
        }
        return 0;
    }

    function incrementGiftCount() {
        const today = new Date().toDateString();
        let count = getTodayGiftCount();
        count++;
        localStorage.setItem('gift_daily_count', JSON.stringify({ date: today, count: count }));
    }

    function canSendGiftToday() {
        return getTodayGiftCount() < MAX_DAILY_GIFTS;
    }

    // 随机发送一个礼物
    function sendRandomGift() {
        console.log('[礼物] sendRandomGift 被调用');
        
        if (!canSendGiftToday()) {
            console.log('[礼物] 今日已达上限');
            showNotification('今日礼物已送完，明天再来看看吧 ', 'info', 3000);
            return;
        }

        const randomImage = GIFT_IMAGES[Math.floor(Math.random() * GIFT_IMAGES.length)];
        const randomText = GIFT_TEXTS[Math.floor(Math.random() * GIFT_TEXTS.length)];

        const giftMsg = {
            id: Date.now() + Math.random(),
            type: 'gift',
            image: randomImage,
            text: randomText,
            opened: false,
            timestamp: new Date(),
            sender: 'partner'
        };

        if (typeof messages !== 'undefined') {
            messages.push(giftMsg);
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(false);
            incrementGiftCount();
            showNotification(' 收到一份神秘礼物！快去看看吧~', 'success', 3000);
            console.log('[礼物] 礼物已发送');
        } else {
            console.error('[礼物] messages 未定义');
        }
    }

    // 将函数挂载到 window 对象
    window.sendRandomGift = sendRandomGift;

    // 点击礼物卡片
    function handleGiftCardClick(messageId) {
        if (typeof messages === 'undefined') return;
        const msg = messages.find(m => m.id === messageId && m.type === 'gift');
        if (!msg) return;

        openGiftModal(msg.image, msg.text);

        if (!msg.opened) {
            msg.opened = true;
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(true);
        }
    }
    window.handleGiftCardClick = handleGiftCardClick;

    function openGiftModal(imageUrl, text) {
        const modal = document.getElementById('gift-modal');
        if (!modal) return;
        const imgEl = modal.querySelector('.gift-modal-image');
        const textEl = modal.querySelector('.gift-modal-text');
        if (imgEl) imgEl.src = imageUrl;
        if (textEl) textEl.textContent = text;
        modal.style.display = 'flex';
    }

    function closeGiftModal(event) {
        const modal = document.getElementById('gift-modal');
        if (!modal) return;
        if (!event || event.target === modal || (event.target.closest && event.target.closest('.gift-close-btn'))) {
            modal.style.display = 'none';
        }
    }
    window.closeGiftModal = closeGiftModal;

    // 初始化定时器
    function initGiftFeature() {
        console.log('[礼物] 初始化礼物功能');
        const firstDelay = 10 * 60 * 1000 + Math.random() *30 * 60 * 1000; // 30-90秒后发送第一个礼物
        setTimeout(function() {
            if (canSendGiftToday()) {
                sendRandomGift();
            }
            function scheduleNext() {
                if (giftTimer) clearTimeout(giftTimer);
                const interval = GIFT_MIN_INTERVAL + Math.random() * (GIFT_MAX_INTERVAL - GIFT_MIN_INTERVAL);
                giftTimer = setTimeout(function() {
                    if (canSendGiftToday()) {
                        sendRandomGift();
                    }
                    scheduleNext();
                }, interval);
            }
            scheduleNext();
        }, firstDelay);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGiftFeature);
    } else {
        initGiftFeature();
    }
})();

// ==================== 礼物管理功能（数据管理界面）====================
function initGiftManagement() {
    console.log('[礼物管理] 初始化');
    
    // 重置今日礼物计数
    const resetBtn = document.getElementById('reset-gift-count-btn');
    if (resetBtn) {
        // 移除旧的事件监听器
        const newResetBtn = resetBtn.cloneNode(true);
        resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
        
        newResetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[礼物管理] 重置按钮被点击');
            if (confirm('确定要重置今日礼物计数吗？\n\n重置后，今日可以继续收到新的随机礼物。\n此操作不会删除已收到的礼物记录。')) {
                localStorage.removeItem('gift_daily_count');
                localStorage.removeItem('gift_daily_count_old');
                if (typeof showNotification === 'function') {
                    showNotification(' 今日礼物计数已重置，梦角可以继续送你礼物啦 ', 'success', 3000);
                }
                console.log('[礼物管理] 计数已重置');
            }
        });
    } else {
        console.log('[礼物管理] 未找到 reset-gift-count-btn 按钮');
    }

    // 立即发送礼物
    const forceSendBtn = document.getElementById('force-send-gift-btn');
    if (forceSendBtn) {
        // 移除旧的事件监听器
        const newForceSendBtn = forceSendBtn.cloneNode(true);
        forceSendBtn.parentNode.replaceChild(newForceSendBtn, forceSendBtn);
        
        newForceSendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[礼物管理] 立即发送按钮被点击');
            if (confirm('确定要立即发送一份礼物吗？\n\n此操作会立即生成一份礼物并出现在聊天记录中。')) {
                if (typeof window.sendRandomGift === 'function') {
                    window.sendRandomGift();
                    if (typeof showNotification === 'function') {
                        showNotification(' 礼物已送出，快去聊天区看看吧~', 'success', 3000);
                    }
                    console.log('[礼物管理] 已调用 sendRandomGift');
                } else {
                    console.error('[礼物管理] sendRandomGift 未定义');
                    if (typeof showNotification === 'function') {
                        showNotification('礼物功能未初始化，请刷新页面重试', 'error');
                    }
                }
            }
        });
    } else {
        console.log('[礼物管理] 未找到 force-send-gift-btn 按钮');
    }
}

// 确保在数据管理模态框打开时也重新绑定
function bindGiftManagementOnModalOpen() {
    const dataModal = document.getElementById('data-modal');
    if (!dataModal) {
        console.log('[礼物管理] data-modal 不存在');
        return;
    }

    // 监听模态框打开
    const observer = new MutationObserver(function(mutations) {
        if (dataModal.style.display === 'flex' || dataModal.style.display === 'block') {
            console.log('[礼物管理] data-modal 已打开');
            initGiftManagement();
        }
    });
    observer.observe(dataModal, { attributes: true, attributeFilter: ['style'] });
    
    // 立即执行一次
    initGiftManagement();
}

// 在 DOMContentLoaded 或合适时机调用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindGiftManagementOnModalOpen);
} else {
    bindGiftManagementOnModalOpen();
}
