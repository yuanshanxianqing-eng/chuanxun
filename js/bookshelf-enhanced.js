/* 书架增强：TXT / DOCX、书籍详情、章节、四档阅读尺寸与纯概率一起阅读。 */
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const STORE_BOOKS = 'userBookshelf';
    const STORE_PREFS = 'readerPreferencesV2';
    const STORE_STATE = 'readerWindowStateV2';
    const CHAPTER_RE = /^\s*(第[零〇一二三四五六七八九十百千万两0-9]+[章节回卷部篇](?:\s+.{0,36})?|chapter\s+\d+(?:\s*[:：.\-]\s*.*)?|序章|楔子|番外(?:\s+.*)?|后记)\s*$/i;

    let books = [];
    let prefs = { promptOnLaunch: false, defaultSize: 'half' };
    let currentBook = null;
    let currentChapter = 0;
    let currentPage = 0;
    let readerPages = [];
    let readerFontSize = 15;
    let readerSize = 'half';
    let partnerReading = false;
    let readingTick = null;
    let partnerRollTick = null;
    let pendingTick = null;
    let detailBookId = null;
    let detailStars = 0;

    const escapeHtml = value => {
        const el = document.createElement('div');
        el.textContent = String(value == null ? '' : value);
        return el.innerHTML;
    };
    const notify = (text, type) => {
        if (typeof showNotification === 'function') showNotification(text, type || 'info', 2600);
    };
    const readStore = async (key, fallback) => {
        try {
            const value = window.localforage ? await localforage.getItem(key) : JSON.parse(localStorage.getItem(key));
            return value == null ? fallback : value;
        } catch (_) { return fallback; }
    };
    const writeStore = (key, value) => {
        try {
            if (window.localforage) return localforage.setItem(key, value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) { console.warn('[bookshelf] 保存失败', error); }
    };
    const partnerName = () => {
        try { return (typeof settings === 'object' && settings.partnerName) || '梦角'; } catch (_) { return '梦角'; }
    };
    const myName = () => {
        try { return (typeof settings === 'object' && settings.myName) || '我'; } catch (_) { return '我'; }
    };

    function migrateBook(book) {
        book.id = book.id || ('book_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
        book.name = book.name || '未命名小说';
        book.author = book.author || '';
        book.description = book.description || '';
        book.cover = book.cover || null;
        book.comments = Array.isArray(book.comments) ? book.comments : [];
        book.pendingPartnerComments = Array.isArray(book.pendingPartnerComments) ? book.pendingPartnerComments : [];
        if (!Array.isArray(book.chapters) || !book.chapters.length) {
            book.chapters = buildChapters(String(book.content || ''));
        }
        book.chapters = book.chapters.map((chapter, index) => ({
            id: chapter.id || `${book.id}_chapter_${index}`,
            title: chapter.title || (book.chapters.length === 1 ? '正文' : `第 ${index + 1} 章`),
            content: String(chapter.content || ''),
            userReadSeconds: Number(chapter.userReadSeconds) || 0,
            partnerReadSeconds: Number(chapter.partnerReadSeconds) || 0,
            partnerCommentRolled: !!chapter.partnerCommentRolled
        }));
        book.currentChapter = Math.min(Number(book.currentChapter) || 0, book.chapters.length - 1);
        book.currentPage = Number(book.currentPage) || 0;
        book.content = book.chapters.map(ch => `${ch.title}\n${ch.content}`).join('\n\n');
        return book;
    }

    function buildChapters(text, paragraphMeta) {
        const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
        const chapters = [];
        let current = null;
        lines.forEach((raw, index) => {
            const line = raw.trimEnd();
            const markedHeading = paragraphMeta && paragraphMeta[index] && paragraphMeta[index].heading;
            if ((markedHeading || CHAPTER_RE.test(line.trim())) && line.trim()) {
                if (current) chapters.push(current);
                current = { title: line.trim(), content: '' };
            } else {
                if (!current) current = { title: '正文', content: '' };
                current.content += (current.content ? '\n' : '') + line;
            }
        });
        if (current) chapters.push(current);
        if (!chapters.length) chapters.push({ title: '正文', content: String(text || '') });
        return chapters.map((chapter, index) => ({
            id: `chapter_${Date.now()}_${index}`,
            title: chapter.title,
            content: chapter.content.trim(),
            userReadSeconds: 0,
            partnerReadSeconds: 0,
            partnerCommentRolled: false
        }));
    }

    function avatarHtml(isPartner) {
        const selector = isPartner ? '#partner-avatar img' : '#my-avatar img';
        const src = document.querySelector(selector)?.src || '';
        const name = isPartner ? partnerName() : myName();
        return src
            ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(name)}">`
            : `<span>${escapeHtml((name || '我').slice(0, 1))}</span>`;
    }

    function enhanceDom() {
        const toolbar = document.querySelector('.bookshelf-toolbar');
        if (toolbar && !$('bs-resume-setting')) {
            const setting = document.createElement('label');
            setting.id = 'bs-resume-setting';
            setting.className = 'bs-resume-setting';
            setting.innerHTML = '<span><i class="fas fa-bookmark"></i><b>启动时询问续读</b><small>关闭后不会再弹出固定询问</small></span><input type="checkbox" id="bs-resume-toggle"><i class="bs-switch"></i>';
            toolbar.insertAdjacentElement('afterend', setting);
        }
        const importBtn = $('bs-import-btn');
        if (importBtn) importBtn.innerHTML = '<i class="fas fa-file-arrow-up"></i> 导入 TXT / Word';

        const header = $('reader-header');
        if (header && !$('reader-together-bar')) {
            header.insertAdjacentHTML('afterend', `
                <div class="reader-together-bar" id="reader-together-bar">
                    <div class="reader-person" id="reader-me-person"><span class="reader-person-avatar" id="reader-me-avatar"></span><span><b id="reader-me-name">我</b><small id="reader-me-status"></small></span></div>
                    <div class="reader-together-center"><i class="fas fa-book-open"></i><span>一起阅读</span><i class="reader-link-line"></i></div>
                    <div class="reader-person reader-person-partner" id="reader-partner-person"><span><b id="reader-partner-name">梦角</b><small id="reader-partner-status"></small></span><span class="reader-person-avatar" id="reader-partner-avatar"></span></div>
                </div>`);
            const actions = header.querySelector('.reader-header-actions');
            actions?.insertAdjacentHTML('afterbegin', `
                <div class="reader-size-controls" id="reader-size-controls" aria-label="阅读窗口大小">
                    <button data-reader-size="small" title="小屏">小</button><button data-reader-size="half" title="半屏">半</button><button data-reader-size="large" title="大屏">大</button><button data-reader-size="full" title="全屏"><i class="fas fa-expand"></i></button>
                </div>`);
        }

        if (!$('book-detail-modal')) {
            document.body.insertAdjacentHTML('beforeend', `
                <div class="modal" id="book-detail-modal"><div class="modal-content book-detail-modal-content">
                    <button class="book-detail-close" id="book-detail-close" aria-label="关闭"><i class="fas fa-times"></i></button>
                    <div id="book-detail-body"></div>
                </div></div>
                <div class="modal" id="reader-resume-modal"><div class="modal-content reader-resume-card">
                    <div class="reader-resume-mark"><i class="fas fa-book-open"></i></div>
                    <div class="reader-resume-kicker">CONTINUE READING</div><h3 id="reader-resume-title">继续上次阅读？</h3>
                    <p id="reader-resume-meta"></p>
                    <div class="modal-buttons"><button class="modal-btn modal-btn-secondary" id="reader-resume-later">暂不继续</button><button class="modal-btn modal-btn-primary" id="reader-resume-go">继续阅读</button></div>
                </div></div>`);
        }
    }

    async function loadData() {
        const saved = await readStore(STORE_BOOKS, []);
        books = (Array.isArray(saved) ? saved : []).map(migrateBook);
        prefs = Object.assign(prefs, await readStore(STORE_PREFS, {}));
        readerSize = prefs.defaultSize || 'half';
        await saveBooks();
    }
    function saveBooks() { return writeStore(STORE_BOOKS, books); }
    function savePrefs() { return writeStore(STORE_PREFS, prefs); }
    function findBook(id) { return books.find(book => String(book.id) === String(id)); }

    function renderBookshelf() {
        const grid = $('bookshelf-grid');
        if (!grid) return;
        $('bs-resume-toggle').checked = !!prefs.promptOnLaunch;
        if (!books.length) {
            grid.innerHTML = '<div class="bookshelf-empty"><div class="bs-empty-orbit"><i class="fas fa-book-open"></i></div><p>书架还空着</p><span>可以导入 TXT 或 Word 小说</span></div>';
            return;
        }
        grid.innerHTML = books.map(book => {
            const chapters = book.chapters.length;
            const read = book.chapters.reduce((sum, chapter) => sum + (chapter.userReadSeconds > 0 ? 1 : 0), 0);
            const progress = chapters ? Math.round(read / chapters * 100) : 0;
            return `<article class="book-item bs-book-card" data-book-id="${escapeHtml(book.id)}">
                <div class="book-cover">${book.cover ? `<img src="${escapeHtml(book.cover)}" alt="">` : '<div class="bs-generated-cover"><i class="fas fa-feather-pointed"></i><span>FICTION</span></div>'}<span class="bs-book-progress-ring" style="--progress:${progress * 3.6}deg">${progress}%</span></div>
                <div class="book-name">${escapeHtml(book.name)}</div><div class="book-progress">${chapters} 章 · ${book.author ? escapeHtml(book.author) : '作者未填写'}</div>
            </article>`;
        }).join('');
        grid.querySelectorAll('[data-book-id]').forEach(card => card.addEventListener('click', () => openBookDetail(card.dataset.bookId)));
    }

    function averageRating(book) {
        const rated = book.comments.filter(comment => Number(comment.stars));
        return rated.length ? rated.reduce((sum, comment) => sum + Number(comment.stars), 0) / rated.length : 0;
    }
    function openBookDetail(bookId) {
        const book = findBook(bookId); if (!book) return;
        detailBookId = book.id;
        detailStars = 0;
        renderBookDetail();
        if (typeof showModal === 'function') showModal($('book-detail-modal')); else $('book-detail-modal').style.display = 'flex';
    }
    function closeBookDetail() {
        if (typeof hideModal === 'function') hideModal($('book-detail-modal')); else $('book-detail-modal').style.display = 'none';
    }
    function renderBookDetail() {
        const book = findBook(detailBookId), body = $('book-detail-body'); if (!book || !body) return;
        const avg = averageRating(book);
        const comments = book.comments.slice().sort((a, b) => b.ts - a.ts);
        body.innerHTML = `
            <section class="book-detail-hero">
                <div class="book-detail-cover">${book.cover ? `<img src="${escapeHtml(book.cover)}" alt="">` : '<i class="fas fa-book-open"></i>'}</div>
                <div class="book-detail-meta"><span class="book-detail-kicker">MY DIGITAL LIBRARY</span><h2>${escapeHtml(book.name)}</h2><p>${escapeHtml(book.author || '作者未填写')}</p>
                    <div class="book-detail-score"><span>${avg ? avg.toFixed(1) : '—'}</span><i>${avg ? '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg)) : '暂无评分'}</i><small>${book.comments.length} 条评论</small></div>
                    <div class="book-detail-actions"><button id="bs-detail-read"><i class="fas fa-book-reader"></i> ${book.currentPage || book.currentChapter ? '继续阅读' : '开始阅读'}</button><button id="bs-detail-edit"><i class="fas fa-pen"></i> 编辑资料</button><button id="bs-detail-cover"><i class="fas fa-image"></i> 封面</button><button id="bs-detail-delete" class="danger"><i class="fas fa-trash"></i></button></div>
                </div>
            </section>
            <section class="book-detail-section"><div class="book-detail-section-title"><span>内容简介</span><small>SYNOPSIS</small></div><p class="book-synopsis">${escapeHtml(book.description || '还没有填写简介，可以点击“编辑资料”补充。')}</p>
                <div class="book-detail-edit-panel" id="book-detail-edit-panel"><label>书名<input id="bs-edit-name" value="${escapeHtml(book.name)}"></label><label>作者<input id="bs-edit-author" value="${escapeHtml(book.author)}"></label><label>简介<textarea id="bs-edit-description">${escapeHtml(book.description)}</textarea></label><button id="bs-edit-save">保存资料</button></div>
            </section>
            <section class="book-detail-section"><div class="book-detail-section-title"><span>章节目录</span><small>${book.chapters.length} CHAPTERS</small></div><div class="book-chapter-list">${book.chapters.map((chapter, index) => `<button data-read-chapter="${index}"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(chapter.title)}</b><small>${chapter.userReadSeconds >= 15 ? '<i class="fas fa-check"></i> 已阅读' : '未阅读'}</small></button>`).join('')}</div></section>
            <section class="book-detail-section book-comments-section"><div class="book-detail-section-title"><span>读者评论</span><small>BOOK REVIEWS</small></div>
                <div class="book-comment-compose"><select id="bs-comment-chapter">${book.chapters.map((chapter, index) => `<option value="${index}">${escapeHtml(chapter.title)}</option>`).join('')}</select><div class="book-comment-stars" id="bs-comment-stars">${[1,2,3,4,5].map(n => `<button data-detail-star="${n}">★</button>`).join('')}</div><textarea id="bs-comment-text" placeholder="读过这一章后，写下你的想法……"></textarea><button id="bs-comment-send">发表评分与评论</button><small id="bs-comment-lock"></small></div>
                <div class="book-comment-list">${comments.length ? comments.map(commentHtml).join('') : '<div class="book-comment-empty"><i class="far fa-comment-dots"></i><span>读完章节后，这里会慢慢留下两个人的想法。</span></div>'}</div>
            </section>`;
        bindDetailEvents();
        updateCommentLock();
    }
    function commentHtml(comment) {
        const isPartner = comment.author === 'partner';
        const name = isPartner ? partnerName() : myName();
        const book = findBook(detailBookId);
        const chapter = book?.chapters[Number(comment.chapterIndex) || 0];
        return `<article class="book-comment ${isPartner ? 'partner' : 'mine'}"><div class="book-comment-avatar">${avatarHtml(isPartner)}</div><div><div class="book-comment-head"><b>${escapeHtml(name)}</b><span>${'★'.repeat(Number(comment.stars) || 0)}${'☆'.repeat(5 - (Number(comment.stars) || 0))}</span><small>${new Date(comment.ts).toLocaleDateString('zh-CN')}</small></div><p>${escapeHtml(comment.text)}</p><em>${escapeHtml(chapter?.title || '正文')}</em></div></article>`;
    }
    function bindDetailEvents() {
        const book = findBook(detailBookId); if (!book) return;
        $('bs-detail-read')?.addEventListener('click', () => openReader(book.id, book.currentChapter || 0));
        $('bs-detail-edit')?.addEventListener('click', () => $('book-detail-edit-panel')?.classList.toggle('show'));
        $('bs-edit-save')?.addEventListener('click', () => {
            book.name = $('bs-edit-name').value.trim() || book.name;
            book.author = $('bs-edit-author').value.trim();
            book.description = $('bs-edit-description').value.trim();
            saveBooks(); renderBookshelf(); renderBookDetail(); notify('书籍资料已保存', 'success');
        });
        $('bs-detail-cover')?.addEventListener('click', () => { const input = $('bs-cover-input'); input.dataset.bookId = book.id; input.click(); });
        $('bs-detail-delete')?.addEventListener('click', () => {
            if (!confirm('确定删除这本书吗？')) return;
            books = books.filter(item => item.id !== book.id); saveBooks(); closeBookDetail(); renderBookshelf(); notify('书籍已删除', 'success');
        });
        document.querySelectorAll('[data-read-chapter]').forEach(btn => btn.addEventListener('click', () => openReader(book.id, Number(btn.dataset.readChapter))));
        document.querySelectorAll('[data-detail-star]').forEach(btn => btn.addEventListener('click', () => {
            detailStars = Number(btn.dataset.detailStar);
            document.querySelectorAll('[data-detail-star]').forEach(star => star.classList.toggle('on', Number(star.dataset.detailStar) <= detailStars));
        }));
        $('bs-comment-chapter')?.addEventListener('change', updateCommentLock);
        $('bs-comment-send')?.addEventListener('click', submitUserComment);
    }
    function updateCommentLock() {
        const book = findBook(detailBookId), index = Number($('bs-comment-chapter')?.value || 0), chapter = book?.chapters[index];
        const lock = $('bs-comment-lock'), send = $('bs-comment-send'); if (!chapter || !lock || !send) return;
        const remain = Math.max(0, 15 - chapter.userReadSeconds);
        lock.textContent = remain ? `阅读该章节满15秒后可以评论，还差约 ${Math.ceil(remain)} 秒。` : '已满足阅读条件，可以发表评论。';
        send.disabled = remain > 0;
    }
    function submitUserComment() {
        const book = findBook(detailBookId), index = Number($('bs-comment-chapter')?.value || 0), chapter = book?.chapters[index];
        if (!book || !chapter || chapter.userReadSeconds < 15) return notify('需要先阅读这一章', 'info');
        const text = $('bs-comment-text').value.trim();
        if (!detailStars || !text) return notify('请点亮星星并写下评论', 'warning');
        const old = book.comments.find(comment => comment.author === 'user' && Number(comment.chapterIndex) === index);
        if (old) { old.stars = detailStars; old.text = text; old.ts = Date.now(); }
        else book.comments.push({ id: 'review_user_' + Date.now(), author: 'user', chapterIndex: index, stars: detailStars, text, ts: Date.now() });
        saveBooks(); detailStars = 0; renderBookDetail(); notify(old ? '评论已更新' : '评论已发布', 'success');
    }

    async function importBook(file) {
        if (!file) return;
        const lower = file.name.toLowerCase();
        if (!lower.endsWith('.txt') && !lower.endsWith('.docx')) return notify('请选择 TXT 或 DOCX 文件', 'error');
        if (file.size > 20 * 1024 * 1024) return notify('文件请控制在20MB以内', 'error');
        notify('正在整理章节……', 'info');
        try {
            let text = '', meta = null;
            if (lower.endsWith('.docx')) {
                if (!window.JSZip) throw new Error('DOCX 解析组件未加载');
                const zip = await JSZip.loadAsync(await file.arrayBuffer());
                const xmlFile = zip.file('word/document.xml');
                if (!xmlFile) throw new Error('Word 正文不存在');
                const xml = new DOMParser().parseFromString(await xmlFile.async('string'), 'application/xml');
                const paragraphs = [...xml.getElementsByTagNameNS('*', 'p')];
                const rows = paragraphs.map(paragraph => {
                    const value = [...paragraph.getElementsByTagNameNS('*', 't')].map(node => node.textContent || '').join('');
                    const style = paragraph.getElementsByTagNameNS('*', 'pStyle')[0]?.getAttributeNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'val') || paragraph.getElementsByTagNameNS('*', 'pStyle')[0]?.getAttribute('w:val') || '';
                    return { text: value, heading: /heading|title|标题/i.test(style) };
                });
                text = rows.map(row => row.text).join('\n'); meta = rows;
            } else {
                text = await file.text();
                if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
            }
            const name = file.name.replace(/\.(txt|docx)$/i, '');
            const book = migrateBook({ id: 'book_' + Date.now(), name, author: '', description: '', cover: null, chapters: buildChapters(text, meta), comments: [], addedAt: Date.now() });
            books.unshift(book); await saveBooks(); renderBookshelf(); notify(`「${name}」已导入，共 ${book.chapters.length} 章`, 'success');
        } catch (error) {
            console.warn('[bookshelf] 导入失败', error); notify('文件解析失败，请确认Word文件未加密', 'error');
        }
    }

    function paginateChapter() {
        const chapter = currentBook?.chapters[currentChapter];
        const text = chapter?.content || '';
        const pageSize = Math.max(360, Math.round(880 * (15 / readerFontSize)));
        readerPages = [];
        let start = 0;
        while (start < text.length) {
            let end = Math.min(text.length, start + pageSize);
            if (end < text.length) {
                const br = text.indexOf('\n', end);
                if (br > end && br < end + 180) end = br + 1;
            }
            readerPages.push(text.slice(start, end)); start = end;
        }
        if (!readerPages.length) readerPages = ['（本章暂无正文）'];
    }
    function openReader(bookId, chapterIndex) {
        const book = findBook(bookId); if (!book) return;
        const requestedChapter = chapterIndex == null ? (Number(book.currentChapter) || 0) : (Number(chapterIndex) || 0);
        currentBook = book; currentChapter = Math.max(0, Math.min(requestedChapter, book.chapters.length - 1));
        currentPage = currentChapter === book.currentChapter ? Number(book.currentPage) || 0 : 0;
        readerFontSize = Number(book.readerFontSize) || 15;
        readerSize = book.readerSize || prefs.defaultSize || 'half';
        paginateChapter(); if (currentPage >= readerPages.length) currentPage = 0;
        closeBookDetail(); if (typeof hideModal === 'function') hideModal($('bookshelf-modal'));
        $('reader-window').classList.add('visible'); $('reader-mini-pill').classList.remove('visible');
        $('reader-content').style.fontSize = readerFontSize + 'px'; $('reader-font-size').textContent = readerFontSize + 'px';
        setReaderSize(readerSize, false); renderReaderPage(); refreshReaderIdentity(); startReadingTimers(); saveReaderState();
    }
    function renderReaderPage() {
        if (!currentBook) return;
        const chapter = currentBook.chapters[currentChapter];
        $('reader-title').textContent = `${currentBook.name} · ${chapter.title}`;
        $('reader-content').textContent = readerPages[currentPage] || '';
        $('reader-content').scrollTop = 0;
        $('reader-page-info').textContent = `${chapter.title}　${currentPage + 1}/${readerPages.length}`;
        $('reader-prev-btn').disabled = currentChapter === 0 && currentPage === 0;
        $('reader-next-btn').disabled = currentChapter === currentBook.chapters.length - 1 && currentPage === readerPages.length - 1;
        const chapterProgress = (currentPage + 1) / readerPages.length;
        const totalProgress = ((currentChapter + chapterProgress) / currentBook.chapters.length) * 100;
        $('reader-progress-bar').style.width = totalProgress + '%';
        refreshReaderStatus();
    }
    function readerNext() {
        if (!currentBook) return;
        if (currentPage < readerPages.length - 1) currentPage++;
        else if (currentChapter < currentBook.chapters.length - 1) { currentChapter++; currentPage = 0; paginateChapter(); }
        renderReaderPage(); saveReaderState();
    }
    function readerPrev() {
        if (!currentBook) return;
        if (currentPage > 0) currentPage--;
        else if (currentChapter > 0) { currentChapter--; paginateChapter(); currentPage = readerPages.length - 1; }
        renderReaderPage(); saveReaderState();
    }
    function setReaderSize(size, save) {
        if (!['small', 'half', 'large', 'full'].includes(size)) size = 'half';
        readerSize = size;
        const win = $('reader-window');
        win.classList.remove('reader-size-small', 'reader-size-half', 'reader-size-large', 'reader-size-full');
        win.classList.add('reader-size-' + size);
        document.querySelectorAll('[data-reader-size]').forEach(btn => btn.classList.toggle('active', btn.dataset.readerSize === size));
        if (currentBook) currentBook.readerSize = size;
        if (save !== false) { prefs.defaultSize = size; savePrefs(); saveBooks(); saveReaderState(); }
        if (size === 'small') partnerReading = false; else if (!partnerReading) partnerReading = Math.random() < .42;
        refreshReaderStatus();
    }
    function refreshReaderIdentity() {
        $('reader-me-name').textContent = myName(); $('reader-partner-name').textContent = partnerName();
        $('reader-me-avatar').innerHTML = avatarHtml(false); $('reader-partner-avatar').innerHTML = avatarHtml(true);
        refreshReaderStatus();
    }
    function refreshReaderStatus() {
        const userReading = !!currentBook && $('reader-window').classList.contains('visible') && readerSize !== 'small';
        $('reader-me-person')?.classList.toggle('reading', userReading);
        $('reader-partner-person')?.classList.toggle('reading', partnerReading && userReading);
        if ($('reader-me-status')) $('reader-me-status').textContent = userReading ? '阅读中' : '';
        if ($('reader-partner-status')) $('reader-partner-status').textContent = partnerReading && userReading ? '阅读中' : '';
        $('reader-together-bar')?.classList.toggle('linked', partnerReading && userReading);
    }
    function saveReaderState() {
        if (!currentBook) return;
        currentBook.currentChapter = currentChapter; currentBook.currentPage = currentPage; currentBook.readerFontSize = readerFontSize; currentBook.readerSize = readerSize;
        saveBooks(); writeStore(STORE_STATE, { bookId: currentBook.id, chapter: currentChapter, page: currentPage, fontSize: readerFontSize, size: readerSize, ts: Date.now() });
    }
    function closeReader() {
        saveReaderState(); stopReadingTimers(); $('reader-window').classList.remove('visible'); $('reader-mini-pill').classList.remove('visible'); partnerReading = false; refreshReaderStatus(); currentBook = null;
    }
    function minimizeReader() {
        if (!currentBook) return; saveReaderState(); stopReadingTimers(); $('reader-window').classList.remove('visible'); $('reader-mini-pill').classList.add('visible');
        $('reader-mini-title').textContent = currentBook.name; $('reader-mini-page').textContent = `${currentBook.chapters[currentChapter].title} · ${currentPage + 1}/${readerPages.length}`;
    }
    function restoreReader() {
        if (!currentBook) return; $('reader-mini-pill').classList.remove('visible'); $('reader-window').classList.add('visible'); setReaderSize(readerSize, false); refreshReaderIdentity(); startReadingTimers();
    }

    function startReadingTimers() {
        stopReadingTimers();
        partnerReading = readerSize !== 'small' && Math.random() < .46;
        readingTick = setInterval(() => {
            if (!currentBook || !$('reader-window').classList.contains('visible') || readerSize === 'small') return;
            const chapter = currentBook.chapters[currentChapter]; chapter.userReadSeconds = (Number(chapter.userReadSeconds) || 0) + 1;
            if (partnerReading) {
                chapter.partnerReadSeconds = (Number(chapter.partnerReadSeconds) || 0) + 1;
                if (chapter.partnerReadSeconds >= 15 && !chapter.partnerCommentRolled) schedulePartnerComments(currentBook, currentChapter);
            }
            if (chapter.userReadSeconds % 5 === 0) saveReaderState();
        }, 1000);
        partnerRollTick = setInterval(() => {
            if (!currentBook || readerSize === 'small') return;
            if (partnerReading) { if (Math.random() < .16) partnerReading = false; }
            else if (Math.random() < .28) partnerReading = true;
            refreshReaderStatus();
        }, 30000 + Math.floor(Math.random() * 25000));
    }
    function stopReadingTimers() { clearInterval(readingTick); clearInterval(partnerRollTick); readingTick = null; partnerRollTick = null; }
    function schedulePartnerComments(book, chapterIndex) {
        const chapter = book.chapters[chapterIndex]; if (!chapter || chapter.partnerCommentRolled) return;
        chapter.partnerCommentRolled = true;
        if (Math.random() >= .46) { saveBooks(); return; }
        const roll = Math.random(); const count = roll < .68 ? 1 : roll < .91 ? 2 : 3;
        for (let i = 0; i < count; i++) {
            book.pendingPartnerComments.push({ id: 'pending_review_' + Date.now() + '_' + i, chapterIndex, dueAt: Date.now() + 15000 + Math.floor(Math.random() * 15000) + i * 2500 });
        }
        saveBooks();
    }
    function processPendingComments() {
        const pool = Array.isArray(window._customReplies) ? window._customReplies.filter(text => String(text || '').trim()) : [];
        if (!pool.length) return;
        let changed = false, visibleChanged = false;
        books.forEach(book => {
            const remain = [];
            (book.pendingPartnerComments || []).forEach(pending => {
                if (pending.dueAt > Date.now()) return remain.push(pending);
                const existing = book.comments.filter(comment => comment.author === 'partner' && Number(comment.chapterIndex) === Number(pending.chapterIndex)).length;
                if (existing >= 3) { changed = true; return; }
                const text = String(pool[Math.floor(Math.random() * pool.length)]).trim();
                const stars = 2 + Math.ceil(Math.random() * 3);
                book.comments.push({ id: 'review_partner_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5), author: 'partner', chapterIndex: pending.chapterIndex, stars, text, ts: Date.now() });
                changed = true; if (String(detailBookId) === String(book.id)) visibleChanged = true;
                notify(`${partnerName()}在书里留下了一条评论`, 'info');
            });
            book.pendingPartnerComments = remain;
        });
        if (changed) saveBooks(); if (visibleChanged && $('book-detail-modal')?.style.display !== 'none') renderBookDetail();
    }

    function showResumePrompt() {
        if (!prefs.promptOnLaunch || !books.length) return;
        readStore(STORE_STATE, null).then(state => {
            const book = state && findBook(state.bookId); if (!book) return;
            $('reader-resume-title').textContent = `继续读《${book.name}》？`;
            const chapter = book.chapters[Math.min(Number(state.chapter) || 0, book.chapters.length - 1)];
            $('reader-resume-meta').textContent = `${chapter.title} · 上次读到第 ${(Number(state.page) || 0) + 1} 页`;
            $('reader-resume-go').dataset.bookId = book.id;
            if (typeof showModal === 'function') showModal($('reader-resume-modal')); else $('reader-resume-modal').style.display = 'flex';
        });
    }

    function bindEvents() {
        $('bookshelf-function')?.addEventListener('click', async () => {
            if (typeof hideModal === 'function') hideModal($('invite-modal'));
            renderBookshelf(); if (typeof showModal === 'function') showModal($('bookshelf-modal')); else $('bookshelf-modal').style.display = 'flex';
        });
        $('close-bookshelf')?.addEventListener('click', () => typeof hideModal === 'function' ? hideModal($('bookshelf-modal')) : $('bookshelf-modal').style.display = 'none');
        $('bs-import-btn')?.addEventListener('click', () => $('bs-txt-input')?.click());
        $('bs-txt-input')?.addEventListener('change', event => { const file = event.target.files?.[0]; if (file) importBook(file); event.target.value = ''; });
        $('bs-cover-input')?.addEventListener('change', event => {
            const file = event.target.files?.[0], book = findBook(event.target.dataset.bookId); if (!file || !book) return;
            const reader = new FileReader(); reader.onload = () => { book.cover = String(reader.result || ''); saveBooks(); renderBookshelf(); if (String(detailBookId) === String(book.id)) renderBookDetail(); }; reader.readAsDataURL(file); event.target.value = '';
        });
        $('bs-resume-toggle')?.addEventListener('change', event => { prefs.promptOnLaunch = event.target.checked; savePrefs(); notify(event.target.checked ? '已开启启动续读询问' : '已关闭启动续读询问', 'success'); });
        $('book-detail-close')?.addEventListener('click', closeBookDetail);
        $('reader-prev-btn')?.addEventListener('click', readerPrev); $('reader-next-btn')?.addEventListener('click', readerNext);
        $('reader-close-btn')?.addEventListener('click', closeReader); $('reader-minimize-btn')?.addEventListener('click', minimizeReader);
        $('reader-mini-pill')?.addEventListener('click', event => { if (!event.target.closest('#reader-mini-close-btn')) restoreReader(); });
        $('reader-mini-close-btn')?.addEventListener('click', event => { event.stopPropagation(); closeReader(); });
        document.querySelectorAll('[data-reader-size]').forEach(btn => btn.addEventListener('click', () => setReaderSize(btn.dataset.readerSize)));
        $('reader-font-plus')?.addEventListener('click', () => { if (readerFontSize < 25) { readerFontSize += 2; $('reader-content').style.fontSize = readerFontSize + 'px'; $('reader-font-size').textContent = readerFontSize + 'px'; paginateChapter(); currentPage = Math.min(currentPage, readerPages.length - 1); renderReaderPage(); saveReaderState(); } });
        $('reader-font-minus')?.addEventListener('click', () => { if (readerFontSize > 11) { readerFontSize -= 2; $('reader-content').style.fontSize = readerFontSize + 'px'; $('reader-font-size').textContent = readerFontSize + 'px'; paginateChapter(); currentPage = Math.min(currentPage, readerPages.length - 1); renderReaderPage(); saveReaderState(); } });
        $('reader-resume-later')?.addEventListener('click', () => typeof hideModal === 'function' ? hideModal($('reader-resume-modal')) : $('reader-resume-modal').style.display = 'none');
        $('reader-resume-go')?.addEventListener('click', event => { if (typeof hideModal === 'function') hideModal($('reader-resume-modal')); openReader(event.currentTarget.dataset.bookId); });
        document.addEventListener('keydown', event => {
            if (!$('reader-window')?.classList.contains('visible')) return;
            if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); readerNext(); }
            if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); readerPrev(); }
            if (event.key === 'Escape') closeReader();
        });
    }

    async function init() {
        enhanceDom(); await loadData(); bindEvents(); renderBookshelf(); processPendingComments();
        pendingTick = setInterval(processPendingComments, 5000);
        setTimeout(showResumePrompt, 900);
    }

    window.EnhancedBookshelf = { open: openBookDetail, importBook, refresh: renderBookshelf };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 80)); else setTimeout(init, 80);
})();
