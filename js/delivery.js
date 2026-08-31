(function() {
    const DELIVERY_KEY = 'delivery_data_v2';
    const DELIVERY_DB_KEY = 'CHAT_APP_V3_delivery_data_v3';
    const DELIVERY_CART_KEY = 'delivery_cart';
    const DELIVERY_CART_DB_KEY = 'CHAT_APP_V3_delivery_cart_v2';
    
    const CATEGORIES = {
        food: { name: '美食', icon: 'fa-utensils' },
        drinks: { name: '甜点饮品', icon: 'fa-coffee' },
        fruits: { name: '蔬菜水果', icon: 'fa-apple-alt' },
        medicine: { name: '药品', icon: 'fa-capsules' },
        flowers: { name: '浪漫鲜花', icon: 'fa-leaf' },
        leisure: { name: '休闲玩乐', icon: 'fa-gamepad' }
    };
    
    const defaultDeliveryData = {
        products: {
            food: [],
            drinks: [],
            fruits: [],
            medicine: [],
            flowers: [],
            leisure: []
        },
        orders: [],
        partnerOrders: [],
        leisureOrders: []
    };
    
    let deliveryData = JSON.parse(JSON.stringify(defaultDeliveryData));
    let currentCart = [];
    let currentCategory = 'food';
    let currentView = 'home';
    let currentEditingProduct = null;
    let currentEditingCategory = null;
    let currentEditingIndex = null;
    let currentImageData = null;
    let deliveryHydrated = false;
    let deliveryLoadPromise = null;
    let deliverySaveChain = Promise.resolve();
    let cartSaveChain = Promise.resolve();
    
    function getPartnerName() {
        return (typeof settings !== 'undefined' && settings.partnerName) ? settings.partnerName : '梦角';
    }
    
    function getMyName() {
        return (typeof settings !== 'undefined' && settings.myName) ? settings.myName : '我';
    }
    
    function normalizeDeliveryData(parsed) {
        const normalized = JSON.parse(JSON.stringify(defaultDeliveryData));
        parsed = parsed && typeof parsed === 'object' ? parsed : {};
        if (parsed.products) {
            Object.keys(normalized.products).forEach(cat => {
                if (Array.isArray(parsed.products[cat])) {
                    normalized.products[cat] = parsed.products[cat];
                }
            });
        }
        if (Array.isArray(parsed.orders)) normalized.orders = parsed.orders;
        if (Array.isArray(parsed.partnerOrders)) normalized.partnerOrders = parsed.partnerOrders;
        if (Array.isArray(parsed.leisureOrders)) normalized.leisureOrders = parsed.leisureOrders;
        return normalized;
    }

    function cloneDeliveryData(data) {
        return JSON.parse(JSON.stringify(data));
    }

    async function loadDeliveryData() {
        if (deliveryHydrated) return deliveryData;
        if (deliveryLoadPromise) return deliveryLoadPromise;

        deliveryLoadPromise = (async () => {
            let parsed = null;
            let parsedCart = null;
            let loadedLegacyData = false;
            let loadedLegacyCart = false;

            if (window.localforage) {
                try {
                    [parsed, parsedCart] = await Promise.all([
                        localforage.getItem(DELIVERY_DB_KEY),
                        localforage.getItem(DELIVERY_CART_DB_KEY)
                    ]);
                } catch (e) {
                    console.error('从 IndexedDB 加载外卖数据失败', e);
                }
            }

            if (!parsed) {
                try {
                    const saved = localStorage.getItem(DELIVERY_KEY);
                    if (saved) {
                        parsed = JSON.parse(saved);
                        loadedLegacyData = true;
                    }
                } catch (e) {
                    console.error('加载旧版外卖数据失败', e);
                }
            }

            if (!parsedCart) {
                try {
                    const savedCart = localStorage.getItem(DELIVERY_CART_KEY);
                    if (savedCart) {
                        parsedCart = JSON.parse(savedCart);
                        loadedLegacyCart = true;
                    }
                } catch (e) {
                    console.error('加载旧版购物车失败', e);
                }
            }

            deliveryData = normalizeDeliveryData(parsed);
            currentCart = Array.isArray(parsedCart) ? parsedCart : [];
            deliveryHydrated = true;

            // 自动迁移旧版 localStorage 数据，避免 Base64 商品图撑爆容量。
            if (window.localforage) {
                try {
                    if (loadedLegacyData) {
                        await localforage.setItem(DELIVERY_DB_KEY, cloneDeliveryData(deliveryData));
                        localStorage.removeItem(DELIVERY_KEY);
                    }
                    if (loadedLegacyCart) {
                        await localforage.setItem(DELIVERY_CART_DB_KEY, cloneDeliveryData(currentCart));
                        localStorage.removeItem(DELIVERY_CART_KEY);
                    }
                } catch (e) {
                    console.error('迁移外卖数据失败', e);
                }
            }

            return deliveryData;
        })().finally(() => {
            deliveryLoadPromise = null;
        });

        return deliveryLoadPromise;
    }
    
    function saveDeliveryData() {
        const snapshot = {
            products: cloneDeliveryData(deliveryData.products),
            orders: cloneDeliveryData(deliveryData.orders),
            partnerOrders: cloneDeliveryData(deliveryData.partnerOrders),
            leisureOrders: cloneDeliveryData(deliveryData.leisureOrders)
        };

        if (window.localforage) {
            deliverySaveChain = deliverySaveChain
                .catch(() => {})
                .then(() => localforage.setItem(DELIVERY_DB_KEY, snapshot))
                .then(() => {
                    try { localStorage.removeItem(DELIVERY_KEY); } catch (e) {}
                    return true;
                })
                .catch((e) => {
                    console.error('保存外卖数据失败', e);
                    if (typeof showNotification === 'function') {
                        showNotification('商品保存失败，请检查浏览器存储权限', 'error');
                    }
                    return false;
                });
            return deliverySaveChain;
        }

        try {
            localStorage.setItem(DELIVERY_KEY, JSON.stringify(snapshot));
            return Promise.resolve(true);
        } catch(e) {
            console.error('保存外卖数据失败', e);
            if (typeof showNotification === 'function') {
                showNotification('商品图片过大，当前浏览器无法保存', 'error');
            }
            return Promise.resolve(false);
        }
    }
    
    function saveCart() {
        const snapshot = cloneDeliveryData(currentCart);

        if (window.localforage) {
            cartSaveChain = cartSaveChain
                .catch(() => {})
                .then(() => localforage.setItem(DELIVERY_CART_DB_KEY, snapshot))
                .then(() => {
                    try { localStorage.removeItem(DELIVERY_CART_KEY); } catch (e) {}
                    return true;
                })
                .catch((e) => {
                    console.error('保存购物车失败', e);
                    return false;
                });
            return cartSaveChain;
        }

        try {
            localStorage.setItem(DELIVERY_CART_KEY, JSON.stringify(snapshot));
            return Promise.resolve(true);
        } catch(e) {
            console.error('保存购物车失败', e);
            return Promise.resolve(false);
        }
    }
    
    function getCartTotalCount() {
        return currentCart.reduce((sum, item) => sum + (item.qty || 0), 0);
    }
    
    function renderHome() {
        const container = document.getElementById('delivery-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="delivery-category-grid">
                ${Object.entries(CATEGORIES).map(([key, cat]) => `
                    <div class="delivery-category-card" data-category="${key}">
                        <div class="delivery-category-icon"><i class="fas ${cat.icon}"></i></div>
                        <div class="delivery-category-name">${cat.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.querySelectorAll('.delivery-category-card').forEach(card => {
            card.addEventListener('click', () => {
                currentCategory = card.dataset.category;
                renderCategoryView();
            });
        });
    }
    
    function renderProductCard(product, idx, isLeisure) {
        const scheduledTime = product.scheduledTime;
        const hasTime = scheduledTime && scheduledTime > Date.now();
        
        return `
            <div class="delivery-product-card" data-index="${idx}">
                <img src="${escapeHtml(product.image)}" class="delivery-product-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                <div class="delivery-product-info">
                    <div class="delivery-product-name">${escapeHtml(product.name)}</div>
                    ${isLeisure ? (hasTime ? `<div class="delivery-order-meta" style="margin-top: 4px;">时间：${new Date(scheduledTime).toLocaleString()}</div>` : 
                        `<div class="delivery-order-meta" style="margin-top: 4px; color: #ff9500;">请先设置项目时间</div>`) : ''}
                    <div class="delivery-product-actions" style="margin-top: 8px;">
                        <button class="delivery-qty-btn dec-qty" data-index="${idx}">-</button>
                        <span class="delivery-qty-num" id="qty-${idx}">0</span>
                        <button class="delivery-qty-btn inc-qty" data-index="${idx}">+</button>
                        <button class="delivery-add-cart ${isLeisure ? 'add-leisure-cart' : 'add-cart-btn'}" data-index="${idx}" ${isLeisure && !hasTime ? 'disabled style="opacity:0.5;"' : ''}>${isLeisure ? '预约' : '添加'}</button>
                    </div>
                    <div class="delivery-manage-btns">
                        <button class="delivery-manage-btn edit-product" data-index="${idx}"><i class="fas fa-edit"></i> 编辑</button>
                        <button class="delivery-manage-btn danger delete-product" data-index="${idx}"><i class="fas fa-trash"></i> 删除</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderCategoryView() {
        const container = document.getElementById('delivery-content');
        const cat = CATEGORIES[currentCategory];
        const products = deliveryData.products[currentCategory] || [];
        
        currentView = 'category';
        document.getElementById('delivery-header-title').textContent = cat.name;
        
        const isLeisure = currentCategory === 'leisure';
        
        container.innerHTML = `
            <div style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
                <button id="delivery-add-product" class="delivery-manage-btn" style="padding: 8px 16px;">
                    <i class="fas fa-plus"></i> 添加${isLeisure ? '项目' : '商品'}
                </button>
            </div>
            <div class="delivery-product-grid">
                ${products.length === 0 ? `<div class="delivery-empty" style="grid-column: 1 / -1;"><i class="fas fa-box-open"></i><p>暂无${isLeisure ? '项目' : '商品'}，点击上方按钮添加</p></div>` : ''}
                ${products.map((product, idx) => renderProductCard(product, idx, isLeisure)).join('')}
            </div>
            <div style="margin-top: 20px;">
                <button id="delivery-view-cart" class="delivery-checkout-btn" style="background: var(--accent-color);">
                    <i class="fas fa-shopping-cart"></i> 查看${isLeisure ? '预约单' : '购物车'} (${getCartTotalCount()})
                </button>
            </div>
        `;
        
        bindCategoryEvents(container, products, isLeisure);
    }
    
    function bindCategoryEvents(container, products, isLeisure) {
        container.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                const qtySpan = document.getElementById(`qty-${idx}`);
                let currentQty = parseInt(qtySpan.textContent) || 0;
                if (currentQty > 0) {
                    currentQty--;
                    qtySpan.textContent = currentQty;
                }
            });
        });
        
        container.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                const qtySpan = document.getElementById(`qty-${idx}`);
                let currentQty = parseInt(qtySpan.textContent) || 0;
                currentQty++;
                qtySpan.textContent = currentQty;
            });
        });
        
        container.querySelectorAll('.add-cart-btn, .add-leisure-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (btn.disabled) {
                    showNotification('请先设置项目时间', 'warning');
                    return;
                }
                const idx = parseInt(btn.dataset.index);
                const product = products[idx];
                const qtySpan = document.getElementById(`qty-${idx}`);
                const qty = parseInt(qtySpan.textContent) || 0;
                
                if (qty === 0) {
                    showNotification('请选择数量', 'warning');
                    return;
                }
                
                const existing = currentCart.find(item => item.productId === `${currentCategory}_${idx}`);
                if (existing) {
                    existing.qty += qty;
                } else {
                    currentCart.push({
                        productId: `${currentCategory}_${idx}`,
                        category: currentCategory,
                        product: Object.assign({}, product),
                        qty: qty,
                        scheduledTime: product.scheduledTime || null
                    });
                }
                qtySpan.textContent = '0';
                saveCart();
                showNotification(`已${isLeisure ? '预约' : '添加'} ${qty} ${isLeisure ? '次' : '份'} ${product.name}`, 'success');
                
                updateCartButton(isLeisure);
            });
        });
        
        container.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                openProductModal('edit', currentCategory, idx);
            });
        });
        
        container.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.index);
                if (confirm('确定要删除吗？')) {
                    deliveryData.products[currentCategory].splice(idx, 1);
                    saveDeliveryData();
                    renderCategoryView();
                    showNotification('已删除', 'success');
                }
            });
        });
        
        const addBtn = document.getElementById('delivery-add-product');
        if (addBtn) {
            const newAddBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newAddBtn, addBtn);
            newAddBtn.addEventListener('click', () => openProductModal('add', currentCategory));
        }
        
        const cartBtn = document.getElementById('delivery-view-cart');
        if (cartBtn) {
            const newCartBtn = cartBtn.cloneNode(true);
            cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);
            newCartBtn.addEventListener('click', () => renderCartView());
        }
    }
    
    function updateCartButton(isLeisure) {
        const cartBtn = document.getElementById('delivery-view-cart');
        if (cartBtn) {
            const total = getCartTotalCount();
            cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> 查看${isLeisure ? '预约单' : '购物车'} (${total})`;
        }
    }
    
    function openProductModal(mode, category, index) {
        currentEditingCategory = category || currentCategory;
        currentEditingIndex = index !== undefined ? index : null;
        currentEditingProduct = mode === 'edit' ? deliveryData.products[currentEditingCategory][index] : null;
        
        const modal = document.getElementById('delivery-product-modal');
        const title = document.getElementById('delivery-product-modal-title');
        const nameInput = document.getElementById('delivery-product-name-input');
        const previewDiv = document.getElementById('delivery-product-preview');
        const previewImg = document.getElementById('delivery-preview-img');
        const fileInput = document.getElementById('delivery-product-file-input');
        const urlInput = document.getElementById('delivery-product-url-input');
        const uploadBtn = document.getElementById('delivery-upload-file-btn');
        const pasteUrlBtn = document.getElementById('delivery-paste-url-btn');
        const saveBtn = document.getElementById('delivery-product-save');
        const datetimeContainer = document.getElementById('leisure-datetime-container');
        const datetimeInput = document.getElementById('leisure-datetime-input');
        
        const isLeisure = category === 'leisure';
        
        title.textContent = isLeisure ? (mode === 'edit' ? '编辑项目' : '添加项目') : (mode === 'edit' ? '编辑商品' : '添加商品');
        nameInput.value = currentEditingProduct ? currentEditingProduct.name : '';
        
        if (currentEditingProduct && currentEditingProduct.image) {
            previewDiv.style.display = 'block';
            previewImg.src = currentEditingProduct.image;
            currentImageData = currentEditingProduct.image;
        } else {
            previewDiv.style.display = 'none';
            currentImageData = null;
        }
        
        if (datetimeContainer) {
            datetimeContainer.style.display = isLeisure ? 'block' : 'none';
        }
        
        if (datetimeInput) {
            if (currentEditingProduct && currentEditingProduct.scheduledTime) {
                const d = new Date(currentEditingProduct.scheduledTime);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                datetimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            } else {
                datetimeInput.value = '';
            }
        }
        
        function switchMode(isFileMode) {
            uploadBtn.classList.toggle('active', isFileMode);
            pasteUrlBtn.classList.toggle('active', !isFileMode);
            fileInput.style.display = isFileMode ? 'block' : 'none';
            urlInput.style.display = isFileMode ? 'none' : 'block';
            if (!isFileMode) urlInput.focus();
        }
        
        uploadBtn.onclick = () => switchMode(true);
        pasteUrlBtn.onclick = () => switchMode(false);
        
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('图片大小不能超过2MB', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    currentImageData = ev.target.result;
                    previewImg.src = currentImageData;
                    previewDiv.style.display = 'block';
                    validateSaveBtn();
                };
                reader.readAsDataURL(file);
            }
        };
        
        urlInput.oninput = () => {
            const url = urlInput.value.trim();
            if (url && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)) {
                currentImageData = url;
                previewImg.src = url;
                previewDiv.style.display = 'block';
            }
            validateSaveBtn();
        };
        
        nameInput.oninput = validateSaveBtn;
        if (datetimeInput) datetimeInput.oninput = validateSaveBtn;
        
        function validateSaveBtn() {
            const hasName = nameInput.value.trim().length > 0;
            const hasImage = !!currentImageData;
            if (isLeisure) {
                const hasDateTime = datetimeInput && datetimeInput.value;
                saveBtn.disabled = !hasName || !hasImage || !hasDateTime;
            } else {
                saveBtn.disabled = !hasName || !hasImage;
            }
        }
        
        saveBtn.onclick = async () => {
            const name = nameInput.value.trim();
            if (!name || !currentImageData) return;
            
            const product = { name: name, image: currentImageData };
            
            if (isLeisure && datetimeInput && datetimeInput.value) {
                product.scheduledTime = new Date(datetimeInput.value).getTime();
            }
            
            if (mode === 'edit' && currentEditingIndex !== null) {
                deliveryData.products[currentEditingCategory][currentEditingIndex] = product;
            } else {
                deliveryData.products[currentEditingCategory].push(product);
            }
            
            saveBtn.disabled = true;
            const saved = await saveDeliveryData();
            if (!saved) {
                validateSaveBtn();
                return;
            }
            hideModal(modal);
            renderCategoryView();
            showNotification(mode === 'edit' ? '已更新' : '已添加', 'success');
            
            fileInput.value = '';
            urlInput.value = '';
            switchMode(true);
            currentImageData = null;
            currentEditingProduct = null;
            currentEditingIndex = null;
        };
        
        document.getElementById('delivery-product-cancel').onclick = () => {
            hideModal(modal);
            currentImageData = null;
            currentEditingProduct = null;
            currentEditingIndex = null;
        };
        
        showModal(modal);
        validateSaveBtn();
    }
    
    function renderCartView() {
        const container = document.getElementById('delivery-content');
        document.getElementById('delivery-header-title').textContent = '购物车';
        currentView = 'cart';
        
        if (currentCart.length === 0) {
            container.innerHTML = `
                <div class="delivery-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>购物车还是空的</p>
                    <button id="delivery-back-to-shop" class="delivery-checkout-btn" style="background: var(--accent-color); margin-top: 20px;">去逛逛</button>
                </div>
            `;
            const backBtn = document.getElementById('delivery-back-to-shop');
            if (backBtn) backBtn.addEventListener('click', () => {
                currentView = 'category';
                document.getElementById('delivery-header-title').textContent = CATEGORIES[currentCategory].name;
                renderCategoryView();
            });
            return;
        }
        
        const deliveryCart = currentCart.filter(item => item.category !== 'leisure');
        const leisureCart = currentCart.filter(item => item.category === 'leisure');
        const hasLeisure = leisureCart.length > 0;
        const hasDelivery = deliveryCart.length > 0;
        const totalItems = getCartTotalCount();
        
        container.innerHTML = `
            <div id="delivery-cart-list">
                ${hasDelivery ? `
                    <div style="margin-bottom: 12px;">
                        <div style="font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">外卖商品</div>
                        ${deliveryCart.map(item => {
                            const globalIdx = currentCart.indexOf(item);
                            return `
                                <div class="delivery-cart-item">
                                    <img src="${escapeHtml(item.product.image)}" class="delivery-cart-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                                    <div class="delivery-cart-info">
                                        <div class="delivery-cart-name">${escapeHtml(item.product.name)}</div>
                                        <div class="delivery-cart-qty">
                                            <button class="delivery-qty-btn cart-dec" data-idx="${globalIdx}">-</button>
                                            <span class="delivery-qty-num" id="cart-qty-${globalIdx}">${item.qty}</span>
                                            <button class="delivery-qty-btn cart-inc" data-idx="${globalIdx}">+</button>
                                        </div>
                                    </div>
                                    <div class="delivery-cart-total">${item.qty} 份</div>
                                    <button class="delivery-cart-remove cart-remove" data-idx="${globalIdx}"><i class="fas fa-trash"></i></button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
                ${hasLeisure ? `
                    <div style="margin-top: ${hasDelivery ? '16px' : '0'};">
                        <div style="font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">游乐项目</div>
                        ${leisureCart.map(item => {
                            const globalIdx = currentCart.indexOf(item);
                            const timeStr = item.scheduledTime ? new Date(item.scheduledTime).toLocaleString() : '未设置时间';
                            return `
                                <div class="delivery-cart-item">
                                    <img src="${escapeHtml(item.product.image)}" class="delivery-cart-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                                    <div class="delivery-cart-info">
                                        <div class="delivery-cart-name">${escapeHtml(item.product.name)}</div>
                                        <div class="delivery-order-meta">时间：${timeStr}</div>
                                        <div class="delivery-cart-qty">
                                            <button class="delivery-qty-btn cart-dec" data-idx="${globalIdx}">-</button>
                                            <span class="delivery-qty-num" id="cart-qty-${globalIdx}">${item.qty}</span>
                                            <button class="delivery-qty-btn cart-inc" data-idx="${globalIdx}">+</button>
                                        </div>
                                    </div>
                                    <div class="delivery-cart-total">${item.qty} 次</div>
                                    <button class="delivery-cart-remove cart-remove" data-idx="${globalIdx}"><i class="fas fa-trash"></i></button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="delivery-cart-footer">
                <div class="delivery-cart-total-row">
                    <span class="delivery-cart-total-label">共</span>
                    <span class="delivery-cart-total-price">${totalItems} 件</span>
                </div>
                <button id="delivery-go-checkout" class="delivery-checkout-btn">去结算</button>
            </div>
        `;
        
        container.querySelectorAll('.cart-dec').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                if (idx >= 0 && idx < currentCart.length) {
                    if (currentCart[idx].qty > 1) {
                        currentCart[idx].qty--;
                    } else {
                        currentCart.splice(idx, 1);
                    }
                    saveCart();
                    renderCartView();
                }
            });
        });
        
        container.querySelectorAll('.cart-inc').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                if (idx >= 0 && idx < currentCart.length) {
                    currentCart[idx].qty++;
                    saveCart();
                    renderCartView();
                }
            });
        });
        
        container.querySelectorAll('.cart-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                if (idx >= 0 && idx < currentCart.length) {
                    currentCart.splice(idx, 1);
                    saveCart();
                    renderCartView();
                }
            });
        });
        
        const checkoutBtn = document.getElementById('delivery-go-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => renderCheckoutView());
        }
    }
    
    function renderCheckoutView() {
        const container = document.getElementById('delivery-content');
        document.getElementById('delivery-header-title').textContent = '结算';
        currentView = 'checkout';
        
        let totalItems = getCartTotalCount();
        let selectedRecipient = 'me';
        const hasLeisure = currentCart.some(item => item.category === 'leisure');
        const hasDelivery = currentCart.some(item => item.category !== 'leisure');
        const partnerName = getPartnerName();
        
        function renderCheckout() {
            container.innerHTML = `
                ${!hasLeisure ? `
                    <div class="delivery-checkout-options">
                        <div class="delivery-checkout-option ${selectedRecipient === 'me' ? 'active' : ''}" data-recipient="me">
                            <i class="fas fa-user"></i>
                            <span>送给自己</span>
                        </div>
                        <div class="delivery-checkout-option ${selectedRecipient === 'partner' ? 'active' : ''}" data-recipient="partner">
                            <i class="fas fa-heart"></i>
                            <span>送给${partnerName}</span>
                        </div>
                    </div>
                ` : ''}
                <div style="margin-bottom: 16px;">
                    ${currentCart.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
                            <span>${escapeHtml(item.product.name)} x ${item.qty}</span>
                            <span>${item.qty} ${item.category === 'leisure' ? '次' : '份'}</span>
                        </div>
                    `).join('')}
                </div>
                ${hasDelivery ? `
                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; display: block;">备注</label>
                        <textarea id="delivery-remark-input" class="delivery-textarea" placeholder="留言..." style="min-height: 60px;"></textarea>
                    </div>
                ` : ''}
                <div class="delivery-cart-total-row" style="margin-bottom: 20px;">
                    <span class="delivery-cart-total-label">总计</span>
                    <span class="delivery-cart-total-price">${totalItems} ${hasLeisure ? '次活动' : '件商品'}</span>
                </div>
                <button id="delivery-confirm-order" class="delivery-checkout-btn">确认下单</button>
            `;
            
            if (!hasLeisure) {
                container.querySelectorAll('.delivery-checkout-option').forEach(opt => {
                    opt.addEventListener('click', () => {
                        selectedRecipient = opt.dataset.recipient;
                        renderCheckout();
                    });
                });
            }
            
            const confirmBtn = document.getElementById('delivery-confirm-order');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    const remark = document.getElementById('delivery-remark-input')?.value.trim() || '';
                    confirmOrder(selectedRecipient, remark);
                });
            }
        }
        
        renderCheckout();
    }
    
    function confirmOrder(recipient, remark = '') {
        loadDeliveryData();
        
        const partnerName = getPartnerName();
        const myName = getMyName();
        const now = new Date();
        const orderTime = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
        
        const newOrders = [];
        const newLeisureOrders = [];
        const newPartnerOrders = [];
        
        for (const cartItem of currentCart) {
            for (let i = 0; i < cartItem.qty; i++) {
                if (cartItem.category === 'leisure') {
                    const leisureOrder = {
                        id: Date.now() + Math.floor(Math.random() * 10000) + i,
                        product: Object.assign({}, cartItem.product),
                        orderTime: orderTime,
                        scheduledTime: cartItem.scheduledTime,
                        status: 'pending',
                        statusText: '待邀请',
                        recipient: 'me',
                        orderer: myName,
                        createdAt: now.getTime(),
                        remark: remark || '',
                        invitationStatus: 'pending',
                        invitationSent: false,
                        invitationAccepted: false,
                        invitationRejected: false,
                        completedAt: null
                    };
                    newLeisureOrders.push(leisureOrder);
                } else {
                    const deliveryMinutes = 10 + Math.floor(Math.random() * 20);
                    const estimatedTime = new Date(now.getTime() + deliveryMinutes * 60 * 1000);
                    const estimatedTimeStr = `${estimatedTime.getHours().toString().padStart(2,'0')}:${estimatedTime.getMinutes().toString().padStart(2,'0')}`;
                    
                    const order = {
                        id: Date.now() + Math.floor(Math.random() * 10000) + i,
                        product: Object.assign({}, cartItem.product),
                        orderTime: orderTime,
                        estimatedTime: estimatedTimeStr,
                        estimatedArrival: estimatedTime.getTime(),
                        status: 'delivering',
                        statusText: '配送中',
                        recipient: recipient,
                        orderer: myName,
                        targetName: recipient === 'me' ? myName : partnerName,
                        createdAt: now.getTime(),
                        remark: remark || '',
                        review: null,
                        partnerReview: null
                    };
                    
                    if (recipient === 'me') {
                        newOrders.push(order);
                    } else {
                        newPartnerOrders.push(order);
                    }
                }
            }
        }
        
        // 保存订单
        if (newOrders.length > 0) {
            deliveryData.orders = deliveryData.orders.concat(newOrders);
        }
        if (newPartnerOrders.length > 0) {
            deliveryData.partnerOrders = deliveryData.partnerOrders.concat(newPartnerOrders);
        }
        if (newLeisureOrders.length > 0) {
            deliveryData.leisureOrders = deliveryData.leisureOrders.concat(newLeisureOrders);
        }
        
        saveDeliveryData();
        
        // 设置送达定时器
        newOrders.forEach(order => {
            scheduleOrderDelivery(order.id, 'me', order.estimatedArrival, order.product.name, false);
        });
        newPartnerOrders.forEach(order => {
            scheduleOrderDelivery(order.id, 'partner', order.estimatedArrival, order.product.name, false);
        });
        
        const totalNewOrders = newOrders.length + newLeisureOrders.length + newPartnerOrders.length;
        
        // 清空购物车
        currentCart = [];
        saveCart();
        
        // 提示成功
        if (newOrders.length > 0 && recipient === 'me') {
            showNotification(`已下单，外卖正在送往自己`, 'success', 3000);
        }
        if (newOrders.length > 0 && recipient === 'partner') {
            showNotification(`已下单，外卖正在送往${partnerName}`, 'success', 3000);
        }
        if (newPartnerOrders.length > 0) {
            showNotification(`已下单，外卖正在送往${partnerName}`, 'success', 3000);
        }
        if (newLeisureOrders.length > 0) {
            showNotification(`已预约 ${newLeisureOrders.length} 个游乐项目，请在"我的订单"中发送邀请`, 'success', 4000);
        }
        
        // 切换到订单界面
        if (newPartnerOrders.length > 0 && newOrders.length === 0 && newLeisureOrders.length === 0) {
            renderPartnerOrdersView();
            document.querySelectorAll('.delivery-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === 'partner');
            });
        } else {
            renderMyOrdersView();
            document.querySelectorAll('.delivery-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === 'my');
            });
        }
    }
    
    function sendInvitationCard(orderId) {
        loadDeliveryData();
        
        const order = deliveryData.leisureOrders.find(o => String(o.id) === String(orderId));
        if (!order) return;
        
        if (order.invitationSent) {
            showNotification('邀请已发送过', 'warning');
            return;
        }
        
        const partnerName = getPartnerName();
        const myName = getMyName();
        const timeStr = order.scheduledTime ? new Date(order.scheduledTime).toLocaleString() : '时间待定';
        
        const cardHtml = `
            <div class="xhs-share-card invitation-card" data-invite-id="${order.id}" style="max-width: 280px; margin: 8px 0;">
                <div class="xhs-card-header" style="padding: 12px;">
                    <div class="xhs-card-avatar" style="background: linear-gradient(135deg, var(--accent-color), rgba(var(--accent-color-rgb),0.7));">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="xhs-card-author-info">
                        <span class="xhs-card-author-name">${escapeHtml(myName)}</span>
                        <span class="xhs-card-badge">邀请</span>
                    </div>
                </div>
                <div class="xhs-card-media" style="padding: 0 12px;">
                    <img src="${escapeHtml(order.product.image)}" style="width: 100%; border-radius: 12px; aspect-ratio: 1; object-fit: cover;">
                </div>
                <div class="xhs-card-title" style="padding: 12px 12px 6px;">邀请你一起去${escapeHtml(order.product.name)}</div>
                <div class="xhs-card-desc" style="padding: 0 12px 10px;">
                    <div>时间：${timeStr}</div>
                    ${order.remark ? `<div style="margin-top: 6px;">备注：${escapeHtml(order.remark)}</div>` : ''}
                </div>
                <div class="xhs-card-footer" style="padding: 8px 12px 12px;">
                    <div style="display: flex; gap: 8px;">
                        <button class="invite-accept-btn" data-id="${order.id}" style="flex: 1; padding: 8px; border: none; border-radius: 8px; background: var(--accent-color); color: #fff; cursor: pointer;">接受</button>
                        <button class="invite-reject-btn" data-id="${order.id}" style="flex: 1; padding: 8px; border: 1px solid var(--border-color); border-radius: 8px; background: transparent; color: var(--text-secondary); cursor: pointer;">拒绝</button>
                    </div>
                </div>
            </div>
        `;
        
        if (typeof addMessage === 'function') {
            addMessage({
                id: Date.now(),
                sender: 'user',
                text: cardHtml,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                isInvitationCard: true,
                inviteId: order.id
            });
        } else if (typeof messages !== 'undefined') {
            messages.push({
                id: Date.now(),
                sender: 'user',
                text: cardHtml,
                timestamp: new Date(),
                status: 'sent',
                type: 'normal',
                isInvitationCard: true,
                inviteId: order.id
            });
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(false);
        }
        
        order.invitationSent = true;
        order.invitationStatus = 'sent';
        order.status = 'invited';
        order.statusText = '已邀请';
        saveDeliveryData();
        
        const responseDelay = Math.random() * 60 * 60 * 1000;
        const timerId = setTimeout(() => {
            loadDeliveryData();
            const currentOrder = deliveryData.leisureOrders.find(o => String(o.id) === String(orderId));
            if (currentOrder && currentOrder.invitationStatus === 'sent' && !currentOrder.invitationAccepted && !currentOrder.invitationRejected) {
                const isRejected = Math.random() < 0.1;
                if (isRejected) {
                    currentOrder.invitationStatus = 'rejected';
                    currentOrder.invitationRejected = true;
                    currentOrder.status = 'rejected';
                    currentOrder.statusText = '已拒绝';
                    saveDeliveryData();
                    addSystemMessage(`${partnerName} 拒绝了你的邀请，不去${currentOrder.product.name}了`);
                    if (currentView === 'my') renderMyOrdersView();
                } else {
                    currentOrder.invitationStatus = 'accepted';
                    currentOrder.invitationAccepted = true;
                    currentOrder.status = 'waiting';
                    currentOrder.statusText = '等待开始';
                    saveDeliveryData();
                    addSystemMessage(`${partnerName} 接受了你的邀请！一起去${currentOrder.product.name}吧`);
                    if (currentView === 'my') renderMyOrdersView();
                    
                    updateInvitationCardStatus(orderId, 'accepted');
                    
                    if (currentOrder.scheduledTime && currentOrder.scheduledTime > Date.now()) {
                        const timeToStart = currentOrder.scheduledTime - Date.now();
                        if (timeToStart > 0) {
                            setTimeout(() => {
                                loadDeliveryData();
                                const finalOrder = deliveryData.leisureOrders.find(o => String(o.id) === String(orderId));
                                if (finalOrder && finalOrder.status === 'waiting') {
                                    finalOrder.status = 'completed';
                                    finalOrder.statusText = '已完成';
                                    finalOrder.completedAt = Date.now();
                                    saveDeliveryData();
                                    addSystemMessage(`该去和${partnerName}一起${finalOrder.product.name}啦！`);
                                    if (currentView === 'my') renderMyOrdersView();
                                }
                            }, timeToStart);
                        }
                    }
                }
            }
        }, responseDelay);
        
        order.responseTimerId = timerId;
        saveDeliveryData();
        
        showNotification(`邀请已发送给${partnerName}`, 'success');
        renderMyOrdersView();
    }
    
    function updateInvitationCardStatus(orderId, status) {
        const cards = document.querySelectorAll('.invitation-card');
        for (const card of cards) {
            if (card.dataset.inviteId === String(orderId)) {
                const footer = card.querySelector('.xhs-card-footer');
                if (footer) {
                    if (status === 'accepted') {
                        footer.innerHTML = '<div style="text-align: center; padding: 8px; color: var(--accent-color);"><i class="fas fa-check-circle"></i> 已接受邀请</div>';
                    } else if (status === 'rejected') {
                        footer.innerHTML = '<div style="text-align: center; padding: 8px; color: #ff4757;"><i class="fas fa-times-circle"></i> 已拒绝邀请</div>';
                    }
                }
            }
        }
    }
    
    window.handleInvitationResponse = function(orderId, accept) {
        loadDeliveryData();
        
        const order = deliveryData.leisureOrders.find(o => String(o.id) === String(orderId));
        if (!order) return;
        
        if (order.invitationStatus !== 'sent') {
            showNotification('邀请已处理过了', 'warning');
            return;
        }
        
        if (order.responseTimerId) {
            clearTimeout(order.responseTimerId);
            order.responseTimerId = null;
        }
        
        const partnerName = getPartnerName();
        
        if (accept) {
            order.invitationStatus = 'accepted';
            order.invitationAccepted = true;
            order.status = 'waiting';
            order.statusText = '等待开始';
            saveDeliveryData();
            addSystemMessage(`${partnerName} 接受了你的邀请！一起去${order.product.name}吧`);
            
            if (order.scheduledTime && order.scheduledTime > Date.now()) {
                const timeToStart = order.scheduledTime - Date.now();
                if (timeToStart > 0) {
                    setTimeout(() => {
                        loadDeliveryData();
                        const finalOrder = deliveryData.leisureOrders.find(o => String(o.id) === String(orderId));
                        if (finalOrder && finalOrder.status === 'waiting') {
                            finalOrder.status = 'completed';
                            finalOrder.statusText = '已完成';
                            finalOrder.completedAt = Date.now();
                            saveDeliveryData();
                            addSystemMessage(`该去和${partnerName}一起${finalOrder.product.name}啦！`);
                            if (currentView === 'my') renderMyOrdersView();
                        }
                    }, timeToStart);
                }
            }
        } else {
            order.invitationStatus = 'rejected';
            order.invitationRejected = true;
            order.status = 'rejected';
            order.statusText = '已拒绝';
            saveDeliveryData();
            addSystemMessage(`${partnerName} 拒绝了你的邀请，不去${order.product.name}了`);
        }
        
        updateInvitationCardStatus(orderId, accept ? 'accepted' : 'rejected');
        if (currentView === 'my') renderMyOrdersView();
        showNotification(accept ? '邀请已被接受' : '邀请已被拒绝', 'info');
    };
    
    document.addEventListener('click', function(e) {
        const acceptBtn = e.target.closest('.invite-accept-btn');
        const rejectBtn = e.target.closest('.invite-reject-btn');
        
        if (acceptBtn) {
            e.preventDefault();
            e.stopPropagation();
            const orderId = acceptBtn.dataset.id;
            window.handleInvitationResponse(orderId, true);
        } else if (rejectBtn) {
            e.preventDefault();
            e.stopPropagation();
            const orderId = rejectBtn.dataset.id;
            window.handleInvitationResponse(orderId, false);
        }
    });
    
    function addReviewToOrder(orderId, reviewText, isPartnerOrder = false) {
        loadDeliveryData();
        
        const targetOrders = isPartnerOrder ? deliveryData.partnerOrders : deliveryData.orders;
        const order = targetOrders.find(o => String(o.id) === String(orderId));
        if (order && order.status === 'delivered') {
            if (order.review) {
                if (confirm('已有评价，是否覆盖？')) {
                    order.review = reviewText;
                    saveDeliveryData();
                    showNotification('评价已更新', 'success');
                    if (currentView === 'my') renderMyOrdersView();
                    else if (currentView === 'partner') renderPartnerOrdersView();
                }
            } else {
                order.review = reviewText;
                saveDeliveryData();
                showNotification('评价已保存', 'success');
                if (currentView === 'my') renderMyOrdersView();
                else if (currentView === 'partner') renderPartnerOrdersView();
            }
        } else {
            showNotification('订单还未送达，暂不能评价', 'warning');
        }
    }
    
    function getRandomReplyText(minCount, maxCount = null) {
        const replyPool = (typeof customReplies !== 'undefined' && customReplies.length > 0) 
            ? customReplies 
            : (typeof CONSTANTS !== 'undefined' && CONSTANTS.REPLY_MESSAGES && CONSTANTS.REPLY_MESSAGES.length > 0
                ? CONSTANTS.REPLY_MESSAGES
                : ['很好吃', '味道不错', '下次还点', '很满意', '配送很快', '非常喜欢']);
        
        const count = maxCount !== null ? minCount + Math.floor(Math.random() * (maxCount - minCount + 1)) : minCount;
        const shuffled = [...replyPool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        return selected.join('。') + (selected.length > 0 ? '。' : '');
    }
    
    function addPartnerReviewToOrder(orderId) {
        loadDeliveryData();
        
        const order = deliveryData.partnerOrders.find(o => String(o.id) === String(orderId));
        if (order && order.status === 'delivered' && !order.partnerReview && order.partnerReviewTime) {
            const now = Date.now();
            const delay = order.partnerReviewTime - now;
            
            if (delay > 0) {
                const timerId = setTimeout(() => {
                    loadDeliveryData();
                    const currentOrder = deliveryData.partnerOrders.find(o => String(o.id) === String(orderId));
                    if (currentOrder && currentOrder.status === 'delivered' && !currentOrder.partnerReview) {
                        const reviewText = getRandomReplyText(2, 3);
                        currentOrder.partnerReview = reviewText;
                        currentOrder.partnerReviewTimerId = null;
                        saveDeliveryData();
                        
                        const partnerName = getPartnerName();
                        addSystemMessage(`${partnerName}对「${currentOrder.product.name}」评价道：${reviewText}`);
                        
                        if (currentView === 'partner') renderPartnerOrdersView();
                    }
                }, delay);
                
                order.partnerReviewTimerId = timerId;
                saveDeliveryData();
                    } else {
            // ★ 修复：无论过了多久，只要评价时间已到就立即生成
            const reviewText = getRandomReplyText(2, 3);
            order.partnerReview = reviewText;
            order.partnerReviewTimerId = null;
            saveDeliveryData();
            
            const partnerName = getPartnerName();
            addSystemMessage(`${partnerName}对「${order.product.name}」评价道：${reviewText}`);
            
            if (currentView === 'partner') renderPartnerOrdersView();
        }
        }
    }
    
    function updateOrderStatus(orderId, ownerType) {
        loadDeliveryData();
        
        const targetOrders = ownerType === 'me' ? deliveryData.orders : deliveryData.partnerOrders;
        const order = targetOrders.find(o => String(o.id) === String(orderId));
        
        if (order && order.status === 'delivering') {
            order.status = 'delivered';
            order.statusText = '已送达';
            
            if (ownerType === 'partner' && !order.partnerReview) {
                if (!order.partnerReviewTime) {
                    order.partnerReviewTime = Date.now() + 30 * 60 * 1000 + Math.random() * 30 * 60 * 1000;
                }
                addPartnerReviewToOrder(orderId);
            }
            
            saveDeliveryData();
            
            if (currentView === 'my' && ownerType === 'me') renderMyOrdersView();
            else if (currentView === 'partner' && ownerType === 'partner') renderPartnerOrdersView();
        }
    }
    
    function addSystemMessage(text) {
        if (typeof addMessage === 'function') {
            addMessage({
                id: Date.now(),
                sender: 'system',
                text: text,
                timestamp: new Date(),
                type: 'system'
            });
        } else if (typeof messages !== 'undefined') {
            messages.push({
                id: Date.now(),
                sender: 'system',
                text: text,
                timestamp: new Date(),
                type: 'system'
            });
            if (typeof throttledSaveData === 'function') throttledSaveData();
            if (typeof renderMessages === 'function') renderMessages(false);
        }
    }
    
    function renderMyOrdersView() {
        loadDeliveryData();
        
        const container = document.getElementById('delivery-content');
        document.getElementById('delivery-header-title').textContent = '我的订单';
        currentView = 'my';
        
        const myOrders = deliveryData.orders.slice().reverse();
        const myLeisureOrders = deliveryData.leisureOrders.slice().reverse();
        const hasOrders = myOrders.length > 0 || myLeisureOrders.length > 0;
        
        if (!hasOrders) {
            container.innerHTML = '<div class="delivery-empty"><i class="fas fa-receipt"></i><p>暂无订单</p></div>';
            return;
        }
        
        let html = '';
        
        if (myOrders.length > 0) {
            html += `<div style="margin-bottom: 16px;"><div style="font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">外卖订单 (${myOrders.length})</div>`;
            html += myOrders.map(order => `
                <div class="delivery-order-item" data-order-id="${order.id}">
                    <div class="delivery-order-header">
                        <img src="${escapeHtml(order.product.image)}" class="delivery-order-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                        <div class="delivery-order-info">
                            <div class="delivery-order-name">${escapeHtml(order.product.name)}</div>
                            <div class="delivery-order-meta">下单人：${escapeHtml(order.orderer)}</div>
                            <div class="delivery-order-meta">下单时间：${order.orderTime}</div>
                            ${order.remark ? `<div class="delivery-order-meta">备注：${escapeHtml(order.remark)}</div>` : ''}
                        </div>
                        <div class="delivery-order-status ${order.status}">${order.statusText}</div>
                    </div>
                    ${order.status === 'delivering' ? `<div class="delivery-order-detail">预计送达时间：${order.estimatedTime}</div>` : ''}
                    ${order.status === 'delivered' ? `
                        <div class="delivery-order-detail">
                            ${order.review ? `<div><span style="font-weight: 600;">我的评价：</span>${escapeHtml(order.review)}</div>` : 
                                `<button class="delivery-review-btn" data-id="${order.id}" data-type="delivery" style="padding: 4px 12px; border-radius: 8px; border: 1px solid var(--accent-color); background: transparent; color: var(--accent-color); font-size: 11px; cursor: pointer;">写下评价</button>`}
                        </div>
                    ` : ''}
                    <div class="delivery-order-footer">
                        <button class="delivery-order-delete" data-id="${order.id}" data-type="delivery"><i class="fas fa-trash"></i> 删除</button>
                    </div>
                </div>
            `).join('');
            html += `</div>`;
        }
        
        if (myLeisureOrders.length > 0) {
            html += `<div style="margin-top: 16px;"><div style="font-size: 13px; font-weight: 600; color: var(--accent-color); margin-bottom: 8px;">游乐项目 (${myLeisureOrders.length})</div>`;
            html += myLeisureOrders.map(order => {
                let statusClass = order.status === 'completed' ? 'delivered' : (order.status === 'waiting' ? 'delivering' : '');
                let statusBg = order.status === 'completed' || order.status === 'waiting' ? 'rgba(76,217,100,0.15)' : (order.status === 'rejected' ? 'rgba(255,71,87,0.15)' : 'rgba(var(--accent-color-rgb),0.15)');
                let statusColor = order.status === 'completed' || order.status === 'waiting' ? '#4cd964' : (order.status === 'rejected' ? '#ff4757' : 'var(--accent-color)');
                
                return `
                    <div class="delivery-order-item" data-order-id="${order.id}">
                        <div class="delivery-order-header">
                            <img src="${escapeHtml(order.product.image)}" class="delivery-order-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                            <div class="delivery-order-info">
                                <div class="delivery-order-name">${escapeHtml(order.product.name)}</div>
                                <div class="delivery-order-meta">时间：${order.scheduledTime ? new Date(order.scheduledTime).toLocaleString() : '未设置'}</div>
                                <div class="delivery-order-meta">下单时间：${order.orderTime}</div>
                                ${order.remark ? `<div class="delivery-order-meta">备注：${escapeHtml(order.remark)}</div>` : ''}
                            </div>
                            <div class="delivery-order-status ${statusClass}" style="background: ${statusBg}; color: ${statusColor};">${order.statusText}</div>
                        </div>
                        ${order.status === 'pending' ? `
                            <div class="delivery-order-footer" style="justify-content: space-between;">
                                <button class="delivery-invite-btn" data-id="${order.id}" style="padding: 6px 12px; border-radius: 8px; border: none; background: var(--accent-color); color: #fff; font-size: 11px; cursor: pointer;"><i class="fas fa-envelope"></i> 发送邀请</button>
                                <button class="delivery-order-delete" data-id="${order.id}" data-type="leisure"><i class="fas fa-trash"></i> 删除</button>
                            </div>
                        ` : order.status === 'rejected' ? `
                            <div class="delivery-order-detail" style="color: #ff4757;">邀请已被拒绝</div>
                            <div class="delivery-order-footer">
                                <button class="delivery-order-delete" data-id="${order.id}" data-type="leisure"><i class="fas fa-trash"></i> 删除</button>
                            </div>
                        ` : order.status === 'waiting' ? `
                            <div class="delivery-order-detail" style="color: #4cd964;">已接受邀请，等待时间到达</div>
                            <div class="delivery-order-footer">
                                <button class="delivery-order-delete" data-id="${order.id}" data-type="leisure"><i class="fas fa-trash"></i> 删除</button>
                            </div>
                        ` : order.status === 'completed' ? `
                            <div class="delivery-order-detail" style="color: #4cd964;">已完成</div>
                            <div class="delivery-order-footer">
                                <button class="delivery-order-delete" data-id="${order.id}" data-type="leisure"><i class="fas fa-trash"></i> 删除</button>
                            </div>
                        ` : `
                            <div class="delivery-order-footer">
                                <button class="delivery-order-delete" data-id="${order.id}" data-type="leisure"><i class="fas fa-trash"></i> 删除</button>
                            </div>
                        `}
                    </div>
                `;
            }).join('');
            html += `</div>`;
        }
        
        container.innerHTML = html;
        
        container.querySelectorAll('.delivery-order-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = btn.dataset.id;
                const orderType = btn.dataset.type;
                if (confirm('确定要删除这个订单记录吗？')) {
                    loadDeliveryData();
                    if (orderType === 'leisure') {
                        deliveryData.leisureOrders = deliveryData.leisureOrders.filter(o => String(o.id) !== String(orderId));
                    } else {
                        deliveryData.orders = deliveryData.orders.filter(o => String(o.id) !== String(orderId));
                    }
                    saveDeliveryData();
                    renderMyOrdersView();
                    showNotification('订单已删除', 'success');
                }
            });
        });
        
        container.querySelectorAll('.delivery-invite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = btn.dataset.id;
                sendInvitationCard(orderId);
            });
        });
        
        container.querySelectorAll('.delivery-review-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = btn.dataset.id;
                showReviewDialog(orderId, false);
            });
        });
    }
    
       function renderPartnerOrdersView() {
        loadDeliveryData();
        
        // ★ 每次查看 TA 的订单时，自动补上遗漏的评价
        retroactivelyFixMissingPartnerReviews();
        loadDeliveryData(); // 重新加载以获取最新数据
        
        const container = document.getElementById('delivery-content');
        const partnerName = getPartnerName();
        document.getElementById('delivery-header-title').textContent = `${partnerName}的订单`;
        currentView = 'partner';
        
        const partnerOrders = deliveryData.partnerOrders.slice().reverse();
        
        if (partnerOrders.length === 0) {
            container.innerHTML = '<div class="delivery-empty"><i class="fas fa-receipt"></i><p>暂无订单</p></div>';
            return;
        }
        
        container.innerHTML = partnerOrders.map(order => `
            <div class="delivery-order-item" data-order-id="${order.id}">
                <div class="delivery-order-header">
                    <img src="${escapeHtml(order.product.image)}" class="delivery-order-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%23ccc%27%3E%3Cpath d=%27M4 4h16v16H4z%27/%3E%3C/svg%3E'">
                    <div class="delivery-order-info">
                        <div class="delivery-order-name">${escapeHtml(order.product.name)}</div>
                        <div class="delivery-order-meta">下单人：${escapeHtml(order.orderer)}</div>
                        <div class="delivery-order-meta">下单时间：${order.orderTime}</div>
                        ${order.remark ? `<div class="delivery-order-meta">备注：${escapeHtml(order.remark)}</div>` : ''}
                    </div>
                    <div class="delivery-order-status ${order.status}">${order.statusText}</div>
                </div>
                ${order.status === 'delivering' ? `<div class="delivery-order-detail">预计送达时间：${order.estimatedTime}</div>` : ''}
                ${order.status === 'delivered' ? `
                    <div class="delivery-order-detail">
                        ${order.partnerReview ? `<div><span style="font-weight: 600;">${partnerName}的评价：</span>${escapeHtml(order.partnerReview)}</div>` : 
                            `<div style="font-size: 11px; color: var(--text-secondary);">梦角还在思考评价...</div>`}
                    </div>
                ` : ''}
                <div class="delivery-order-footer">
                    <button class="delivery-order-delete" data-id="${order.id}" data-type="partner"><i class="fas fa-trash"></i> 删除</button>
                </div>
            </div>
        `).join('');
        
        container.querySelectorAll('.delivery-order-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const orderId = btn.dataset.id;
                if (confirm('确定要删除这个订单记录吗？')) {
                    loadDeliveryData();
                    deliveryData.partnerOrders = deliveryData.partnerOrders.filter(o => String(o.id) !== String(orderId));
                    saveDeliveryData();
                    renderPartnerOrdersView();
                    showNotification('订单已删除', 'success');
                }
            });
        });
    }
    
    function showReviewDialog(orderId, isPartnerOrder) {
        loadDeliveryData();
        
        const currentReview = isPartnerOrder 
            ? deliveryData.partnerOrders.find(o => String(o.id) === String(orderId))?.review || ''
            : deliveryData.orders.find(o => String(o.id) === String(orderId))?.review || '';
        
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease;';
        
        overlay.innerHTML = `
            <div style="background:var(--secondary-bg);border-radius:20px;padding:24px;width:88%;max-width:360px;box-shadow:0 20px 60px rgba(0,0,0,0.4);animation:modalContentSlideIn 0.3s ease forwards;">
                <div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                    <i class="fas fa-star" style="color:var(--accent-color);"></i>
                    <span>评价订单</span>
                </div>
                <textarea id="review-text-input" class="delivery-textarea" placeholder="写下你的评价..." style="min-height: 80px; margin-bottom: 16px;">${escapeHtml(currentReview)}</textarea>
                <div style="display:flex;gap:10px;">
                    <button id="review-cancel" style="flex:1;padding:10px;border:1px solid var(--border-color);border-radius:10px;background:none;color:var(--text-secondary);font-size:13px;cursor:pointer;">取消</button>
                    <button id="review-submit" style="flex:2;padding:10px;border:none;border-radius:10px;background:var(--accent-color);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">提交评价</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const textarea = overlay.querySelector('#review-text-input');
        const cancelBtn = overlay.querySelector('#review-cancel');
        const submitBtn = overlay.querySelector('#review-submit');
        
        const closeDialog = () => overlay.remove();
        
        cancelBtn.addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
        
        submitBtn.addEventListener('click', () => {
            const reviewText = textarea.value.trim();
            if (!reviewText) {
                showNotification('请填写评价内容', 'warning');
                return;
            }
            addReviewToOrder(orderId, reviewText, isPartnerOrder);
            closeDialog();
        });
    }
    
    function scheduleOrderDelivery(orderId, ownerType, estimatedArrival, productName, isPartnerGift = false) {
        const now = Date.now();
        const delay = estimatedArrival - now;
        
        if (delay > 0) {
            setTimeout(() => {
                updateOrderStatus(orderId, ownerType);
                const partnerName = getPartnerName();
                if (ownerType === 'me') {
                    addSystemMessage(isPartnerGift ? `${partnerName}给您点的外卖「${productName}」已送达` : `您的外卖「${productName}」已送达`);
                } else {
                    addSystemMessage(`送给${partnerName}的外卖「${productName}」已送达`);
                }
            }, delay);
        } else if (delay <= 0 && delay > -60000) {
            updateOrderStatus(orderId, ownerType);
            const partnerName = getPartnerName();
            if (ownerType === 'me') {
                addSystemMessage(isPartnerGift ? `${partnerName}给您点的外卖「${productName}」已送达` : `您的外卖「${productName}」已送达`);
            } else {
                addSystemMessage(`送给${partnerName}的外卖「${productName}」已送达`);
            }
        }
    }
    
        function retroactivelyFixMissingPartnerReviews() {
        loadDeliveryData();
        let fixedCount = 0;
        
        deliveryData.partnerOrders.forEach(order => {
            if (order.status === 'delivered' && !order.partnerReview) {
                const reviewText = getRandomReplyText(2, 3);
                order.partnerReview = reviewText;
                if (!order.partnerReviewTime) {
                    order.partnerReviewTime = Date.now();
                }
                fixedCount++;
            }
        });
        
        if (fixedCount > 0) {
            saveDeliveryData();
            console.log(`[Delivery] 已为 ${fixedCount} 个遗漏订单补上评价`);
        }
    }
    
    function restorePendingOrders() {
        loadDeliveryData();
        
        const now = Date.now();
        
        deliveryData.leisureOrders.forEach(order => {
            if (order.invitationStatus === 'sent' && !order.invitationAccepted && !order.invitationRejected && !order.responseTimerId) {
                const sentTime = order.createdAt || 0;
                const elapsed = now - sentTime;
                const responseDelay = Math.random() * 60 * 60 * 1000;
                const remainingDelay = Math.max(0, responseDelay - elapsed);
                
                if (remainingDelay > 0) {
                    const timerId = setTimeout(() => {
                        loadDeliveryData();
                        const currentOrder = deliveryData.leisureOrders.find(o => String(o.id) === String(order.id));
                        if (currentOrder && currentOrder.invitationStatus === 'sent' && !currentOrder.invitationAccepted && !currentOrder.invitationRejected) {
                            const isRejected = Math.random() < 0.1;
                            if (isRejected) {
                                currentOrder.invitationStatus = 'rejected';
                                currentOrder.invitationRejected = true;
                                currentOrder.status = 'rejected';
                                currentOrder.statusText = '已拒绝';
                                saveDeliveryData();
                                addSystemMessage(`${getPartnerName()} 拒绝了你的邀请`);
                            } else {
                                currentOrder.invitationStatus = 'accepted';
                                currentOrder.invitationAccepted = true;
                                currentOrder.status = 'waiting';
                                currentOrder.statusText = '等待开始';
                                saveDeliveryData();
                                addSystemMessage(`${getPartnerName()} 接受了你的邀请！`);
                            }
                        }
                    }, remainingDelay);
                    order.responseTimerId = timerId;
                }
            } else if (order.invitationStatus === 'accepted' && order.status === 'waiting' && order.scheduledTime && order.scheduledTime > now) {
                const timeToStart = order.scheduledTime - now;
                if (timeToStart > 0) {
                    setTimeout(() => {
                        loadDeliveryData();
                        const finalOrder = deliveryData.leisureOrders.find(o => String(o.id) === String(order.id));
                        if (finalOrder && finalOrder.status === 'waiting') {
                            finalOrder.status = 'completed';
                            finalOrder.statusText = '已完成';
                            finalOrder.completedAt = Date.now();
                            saveDeliveryData();
                            addSystemMessage(`该去和${getPartnerName()}一起${finalOrder.product.name}啦！`);
                        }
                    }, timeToStart);
                }
            }
        });
        
        saveDeliveryData();
                // ★ 页面加载时补上所有遗漏的评价
        setTimeout(() => {
            retroactivelyFixMissingPartnerReviews();
        }, 1000);
        deliveryData.orders.forEach(order => {
            if (order.status === 'delivering' && order.estimatedArrival) {
                scheduleOrderDelivery(order.id, 'me', order.estimatedArrival, order.product.name, order.orderer === getPartnerName());
            }
        });
        
        deliveryData.partnerOrders.forEach(order => {
            if (order.status === 'delivering' && order.estimatedArrival) {
                scheduleOrderDelivery(order.id, 'partner', order.estimatedArrival, order.product.name, false);
            }
            if (order.status === 'delivered' && !order.partnerReview && order.partnerReviewTime) {
                addPartnerReviewToOrder(order.id);
            }
        });
    }
    
    function switchTab(tabId) {
        currentView = tabId;
        document.querySelectorAll('.delivery-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        if (tabId === 'home') {
            document.getElementById('delivery-header-title').textContent = '外卖';
            renderHome();
        } else if (tabId === 'my') {
            document.getElementById('delivery-header-title').textContent = '我的订单';
            renderMyOrdersView();
        } else if (tabId === 'partner') {
            renderPartnerOrdersView();
        }
    }
    
    function goBack() {
        if (currentView === 'cart') {
            currentView = 'category';
            renderCategoryView();
        } else if (currentView === 'checkout') {
            currentView = 'cart';
            renderCartView();
        } else if (currentView === 'my' || currentView === 'partner') {
            currentView = 'home';
            document.getElementById('delivery-header-title').textContent = '外卖';
            renderHome();
            document.querySelectorAll('.delivery-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === 'home');
            });
        } else if (currentView === 'category') {
            currentView = 'home';
            document.getElementById('delivery-header-title').textContent = '外卖';
            renderHome();
        } else if (currentView === 'home') {
            hideModal(document.getElementById('delivery-modal'));
        } else {
            currentView = 'home';
            document.getElementById('delivery-header-title').textContent = '外卖';
            renderHome();
        }
    }
    
    function schedulePartnerOrder() {
        loadDeliveryData();
        
        const rand = Math.random();
        let orderCount;
        if (rand < 0.70) orderCount = 0;
        else if (rand < 0.85) orderCount = 1;
        else if (rand < 0.95) orderCount = 2;
        else orderCount = 3;
        
        if (orderCount === 0) return;
        
        let allProducts = [];
        Object.keys(CATEGORIES).forEach(cat => {
            if (cat !== 'leisure') {
                deliveryData.products[cat].forEach(product => {
                    allProducts.push(Object.assign({}, product, { category: cat }));
                });
            }
        });
        
        if (allProducts.length === 0) return;
        
        const partnerName = getPartnerName();
        const now = new Date();
        
        for (let i = 0; i < orderCount; i++) {
            const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
            const qty = 1 + Math.floor(Math.random() * 3);
            
            const orderTime = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
            const deliveryMinutes = 10 + Math.floor(Math.random() * 20);
            const estimatedTime = new Date(now.getTime() + deliveryMinutes * 60 * 1000);
            const estimatedTimeStr = `${estimatedTime.getHours().toString().padStart(2,'0')}:${estimatedTime.getMinutes().toString().padStart(2,'0')}`;
            const partnerRemark = getRandomReplyText(1, 2);
            
            for (let j = 0; j < qty; j++) {
                const order = {
                    id: Date.now() + Math.floor(Math.random() * 10000) + i + j,
                    product: Object.assign({}, randomProduct),
                    orderTime: orderTime,
                    estimatedTime: estimatedTimeStr,
                    estimatedArrival: estimatedTime.getTime(),
                    status: 'delivering',
                    statusText: '配送中',
                    recipient: 'me',
                    orderer: partnerName,
                    targetName: getMyName(),
                    createdAt: now.getTime(),
                    remark: partnerRemark,
                    review: null,
                    partnerReview: null
                };
                deliveryData.orders.push(order);
                scheduleOrderDelivery(order.id, 'me', order.estimatedArrival, order.product.name, true);
            }
            
            addSystemMessage(`${partnerName}给您点了 ${qty} 份「${randomProduct.name}」，备注：${partnerRemark}，正在配送中～`);
        }
        
        saveDeliveryData();
        if (currentView === 'my') renderMyOrdersView();
        showNotification(`${partnerName}给您点了外卖！`, 'success', 4000);
    }
    
    function startPartnerOrderScheduler() {
        const checkInterval = 30 * 60 * 1000 + Math.random() * 60 * 60 * 1000;
        setTimeout(() => {
            schedulePartnerOrder();
            startPartnerOrderScheduler();
        }, checkInterval);
    }
    
    function initDeliveryFunction() {
        const deliveryEntry = document.getElementById('delivery-function');
        if (!deliveryEntry || deliveryEntry.dataset.deliveryBound === '1') return;
        deliveryEntry.dataset.deliveryBound = '1';
        
        deliveryEntry.addEventListener('click', async () => {
            const inviteModal = document.getElementById('invite-modal');
            if (inviteModal) hideModal(inviteModal);
            await loadDeliveryData();
            currentView = 'home';
            document.getElementById('delivery-header-title').textContent = '外卖';
            renderHome();
            showModal(document.getElementById('delivery-modal'));
            
            const partnerTab = document.getElementById('delivery-partner-tab');
            if (partnerTab) partnerTab.textContent = `${getPartnerName()}的`;
        });
    }
    
    function bindDeliveryEvents() {
        const modal = document.getElementById('delivery-modal');
        const closeBtn = document.getElementById('delivery-close');
        const backBtn = document.getElementById('delivery-back-home');
        const tabs = document.querySelectorAll('.delivery-tab');
        
        if (closeBtn) closeBtn.addEventListener('click', () => hideModal(modal));
        if (backBtn) backBtn.addEventListener('click', goBack);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
    }
    
    window.deliveryFunction = { schedulePartnerOrder };
    
    async function init() {
        await loadDeliveryData();
        bindDeliveryEvents();
        initDeliveryFunction();
        restorePendingOrders();
        startPartnerOrderScheduler();
        
        setInterval(() => {
            loadDeliveryData();
            const now = Date.now();
            let hasChanges = false;
            
            deliveryData.orders.forEach(order => {
                if (order.status === 'delivering' && order.estimatedArrival && now >= order.estimatedArrival) {
                    order.status = 'delivered';
                    order.statusText = '已送达';
                    hasChanges = true;
                }
            });
            
            deliveryData.partnerOrders.forEach(order => {
                if (order.status === 'delivering' && order.estimatedArrival && now >= order.estimatedArrival) {
                    order.status = 'delivered';
                    order.statusText = '已送达';
                    hasChanges = true;
                }
            });
            
            if (hasChanges) {
                saveDeliveryData();
                if (currentView === 'my') renderMyOrdersView();
                else if (currentView === 'partner') renderPartnerOrdersView();
            }
        }, 60000);
        
        setInterval(() => {
            const partnerTab = document.getElementById('delivery-partner-tab');
            const modal = document.getElementById('delivery-modal');
            if (partnerTab && modal && modal.style.display !== 'none') {
                partnerTab.textContent = `${getPartnerName()}的`;
            }
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
