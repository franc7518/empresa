/**
 * Café Ancestral - Sabor Ancestral 2.0
 * Logic & Interactivity (Mobile-First)
 */

// ==========================================================================
// DATABASE: MENU DIGITAL VIVO
// ==========================================================================
const MENU_ITEMS = [
    {
        id: 'latte',
        name: 'Latte de Especialidad',
        category: 'cafe',
        price: 11.00,
        img: 'assets/latte.png',
        desc: 'Café de especialidad con leche texturizada al punto exacto. Tazas de origen cusqueño.',
        stock: 8,
        isHot: true
    },
    {
        id: 'espresso',
        name: 'Espresso Doble',
        category: 'cafe',
        price: 8.50,
        img: 'assets/latte.png', // Fallback to latte for demo simplicity
        desc: 'Extracción limpia de café 100% Arábica con notas de chocolate oscuro y frutos rojos.',
        stock: 14,
        isHot: true
    },
    {
        id: 'croissant',
        name: 'Croissant Artesanal',
        category: 'postres',
        price: 9.00,
        img: 'assets/croissant.png',
        desc: 'Hojaldrado clásico de pura mantequilla, crujiente por fuera y aireado por dentro.',
        stock: 3,
        isHot: false
    },
    {
        id: 'tarta-higo',
        name: 'Tarta Rustica de Higo',
        category: 'postres',
        price: 12.00,
        img: 'assets/croissant.png', // Fallback to croissant for demo simplicity
        desc: 'Base crujiente rellena de crema de almendras y decorada con higos frescos locales.',
        stock: 5,
        isHot: false
    },
    {
        id: 'pack-estudio',
        name: 'Pack Estudiante Productivo',
        category: 'estudio',
        price: 18.00,
        img: 'assets/hero_bar.png',
        desc: '1 Latte Grande + 1 Croissant + 1 Cupón de WiFi Premium de ultra velocidad.',
        stock: 10,
        isHot: false
    },
    {
        id: 'pack-cowork',
        name: 'Prensa & Estudio para Dos',
        category: 'estudio',
        price: 32.00,
        img: 'assets/hero_bar.png',
        desc: 'Prensa Francesa grande para compartir + 2 Alfajores de la casa. Mesa reservada.',
        stock: 4,
        isHot: false
    }
];

// Recommender pairings mappings
const RECOMMENDATIONS = {
    'latte': {
        pairId: 'croissant',
        reason: 'El hojaldre mantequilloso del Croissant equilibra perfectamente la textura sedosa de la leche de tu Latte.'
    },
    'espresso': {
        pairId: 'tarta-higo',
        reason: 'La acidez limpia del Espresso corta y resalta el dulzor frutal y aromático de la tarta de higo.'
    },
    'croissant': {
        pairId: 'espresso',
        reason: 'La riqueza del hojaldre pide a gritos la intensidad limpia y estimulante de nuestro Espresso Doble.'
    },
    'tarta-higo': {
        pairId: 'latte',
        reason: 'Las notas dulces del higo maridan de forma exquisita con el dulzor lácteo natural de un Latte templado.'
    },
    'pack-estudio': {
        pairId: 'espresso',
        reason: '¿Sesión larga de estudio? Añade un shot extra de Espresso para mantener tu enfoque al 100%.'
    },
    'pack-cowork': {
        pairId: 'tarta-higo',
        reason: 'Ideal para compartir en pareja o amigos. Una porción extra de tarta rústica cierra el maridaje perfecto.'
    }
};

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================
let appState = {
    // Fila Virtual
    queue: {
        inQueue: false,
        name: '',
        guests: 2,
        peopleAhead: 3,
        estimatedTime: 12, // in minutes
        originalTime: 12,
        status: 'Esperando turno...',
        timerInterval: null,
        ticket: 'A-24'
    },
    // Weather & Crowd (Simulated dynamic factors)
    factors: {
        temp: 16,
        condition: 'Garúa',
        crowd: 'Media-Alta'
    },
    // Selected product for recommendations
    selectedProductId: null,
    // Current menu filter category
    menuFilter: 'todos',
    // Search query
    searchQuery: ''
};

// ==========================================================================
// DOM ELEMENTS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeDrawer = document.getElementById('close-drawer');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    
    // Fila Virtual
    const formJoinQueue = document.getElementById('form-join-queue');
    const widgetStateIdle = document.getElementById('widget-state-idle');
    const widgetStateActive = document.getElementById('widget-state-active');
    const clientNameSpan = document.getElementById('client-name-span');
    const activeWaitTime = document.getElementById('active-wait-time');
    const activeGuestsCount = document.getElementById('active-guests-count');
    const activePeopleAhead = document.getElementById('active-people-ahead');
    const activeStatusText = document.getElementById('active-status-text');
    const btnLeaveQueue = document.getElementById('btn-leave-queue');
    const timerProgress = document.getElementById('timer-progress');
    const waitTimeValue = document.getElementById('wait-time-value');
    const peopleCountValue = document.getElementById('people-count-value');
    const widgetLastUpdate = document.getElementById('widget-last-update');
    const liveWeather = document.getElementById('live-weather');
    const liveCrowd = document.getElementById('live-crowd');
    
    // Carta Dinámica
    const productsContainer = document.getElementById('products-container');
    const menuTabs = document.getElementById('menu-tabs');
    const menuSearch = document.getElementById('menu-search');
    
    // AI Recommendations
    const selectedProductContainer = document.getElementById('selected-product-container');
    const recommendedProductContainer = document.getElementById('recommended-product-container');
    const userSelectionBox = document.querySelector('.user-selection-box');
    const recommendedPairBox = document.querySelector('.recommended-pair-box');
    
    // Sostenibilidad Counter
    const statSavedKg = document.getElementById('stat-saved-kg');
    
    // Contact button
    const footerContactBtn = document.getElementById('footer-contact-btn');
    
    // PWA Toast
    const pwaInstallToast = document.getElementById('pwa-install-toast');
    const btnPwaCancel = document.getElementById('btn-pwa-cancel');
    const btnPwaInstall = document.getElementById('btn-pwa-install');

    // ==========================================================================
    // INITIALIZATION & EVENT LISTENERS
    // ==========================================================================
    initApp();

    // Drawer Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
    });

    closeDrawer.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
    });

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    });

    // Form Join Queue
    if (formJoinQueue) {
        formJoinQueue.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('queue-name');
            const guestsSelect = document.getElementById('queue-guests');
            
            joinQueue(nameInput.value, parseInt(guestsSelect.value));
        });
    }

    // Leave Queue
    if (btnLeaveQueue) {
        btnLeaveQueue.addEventListener('click', leaveQueue);
    }

    // Menu Tabs Filtering
    if (menuTabs) {
        menuTabs.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                appState.menuFilter = e.target.dataset.category;
                renderProducts();
            }
        });
    }

    // Search bar filter
    if (menuSearch) {
        menuSearch.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }

    // Contact Button
    if (footerContactBtn) {
        footerContactBtn.addEventListener('click', () => {
            showToast('¡Escríbenos directamente por WhatsApp al +51 987 654 321! Te responderemos en segundos.', 'success');
        });
    }

    // ==========================================================================
    // MODULE: FILA VIRTUAL CONTROLLER
    // ==========================================================================
    function initApp() {
        renderProducts();
        simulateAtmosphere();
        simulateStockFluctuations();
        setupSVGProgressTrack();
        
        // Dynamic stats counters increment
        setInterval(() => {
            if (statSavedKg) {
                let current = parseFloat(statSavedKg.textContent);
                statSavedKg.textContent = (current + 0.1).toFixed(1);
            }
        }, 12000); // Saved food counter updates realistically in real-time
    }

    function setupSVGProgressTrack() {
        if (timerProgress) {
            // Set circle circumference
            const radius = timerProgress.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
            timerProgress.style.strokeDashoffset = circumference;
        }
    }

    function updateRadialProgress(percent) {
        if (timerProgress) {
            const radius = timerProgress.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            timerProgress.style.strokeDashoffset = offset;
        }
    }

    function joinQueue(name, guests) {
        appState.queue.inQueue = true;
        appState.queue.name = name;
        appState.queue.guests = guests;
        
        // Random ticket ID
        const ticketNum = Math.floor(Math.random() * 80) + 10;
        appState.queue.ticket = `A-${ticketNum}`;
        
        // Reset wait timers
        appState.queue.originalTime = appState.queue.estimatedTime;
        
        // Render Active Interface
        widgetStateIdle.classList.add('hidden');
        widgetStateActive.classList.remove('hidden');
        
        // Set dynamic names/values
        clientNameSpan.textContent = name;
        activeGuestsCount.textContent = `${guests} persona${guests > 1 ? 's' : ''}`;
        activePeopleAhead.textContent = appState.queue.peopleAhead;
        document.querySelector('.ticket-badge').textContent = `Tu Turno: #${appState.queue.ticket}`;
        
        showToast(`Te has unido a la fila virtual. Turno #${appState.queue.ticket}`, 'success');
        
        // Start simulated high-speed queue progression (1 minute = 6 seconds for demonstration)
        let totalSeconds = appState.queue.estimatedTime * 6; // e.g. 72 seconds
        let secondsRemaining = totalSeconds;
        
        updateRadialProgress(100);
        
        appState.queue.timerInterval = setInterval(() => {
            secondsRemaining--;
            
            // Calculate virtual minutes remaining
            const virtualMin = Math.ceil(secondsRemaining / 6);
            appState.queue.estimatedTime = virtualMin;
            activeWaitTime.textContent = virtualMin;
            
            // Percentage for circular SVG
            const pct = (secondsRemaining / totalSeconds) * 100;
            updateRadialProgress(pct);
            
            // Simulating people ahead decreasing
            if (virtualMin === 8 && appState.queue.peopleAhead === 3) {
                appState.queue.peopleAhead = 2;
                activePeopleAhead.textContent = 2;
                showToast('¡Fila en movimiento! Persona delante de ti ingresó.', 'success');
            } else if (virtualMin === 4 && appState.queue.peopleAhead === 2) {
                appState.queue.peopleAhead = 1;
                activePeopleAhead.textContent = 1;
                appState.queue.status = 'Tu mesa se está liberando';
                activeStatusText.textContent = appState.queue.status;
                activeStatusText.style.backgroundColor = 'var(--accent-terracotta-light)';
                activeStatusText.style.color = 'var(--accent-terracotta)';
                showToast('Tu mesa se está liberando. Acércate a la barra.', 'info');
            } else if (secondsRemaining <= 0) {
                clearInterval(appState.queue.timerInterval);
                appState.queue.estimatedTime = 0;
                appState.queue.peopleAhead = 0;
                activeWaitTime.textContent = '0';
                activePeopleAhead.textContent = '0';
                appState.queue.status = '¡Mesa Lista!';
                activeStatusText.textContent = appState.queue.status;
                activeStatusText.style.backgroundColor = '#27AE60';
                activeStatusText.style.color = '#FFF';
                
                showToast('¡Mesa Lista! Tienes 5 minutos para presentarte.', 'success');
                triggerVibration();
            }
        }, 1000);
    }

    function leaveQueue() {
        if (appState.queue.timerInterval) {
            clearInterval(appState.queue.timerInterval);
        }
        
        appState.queue.inQueue = false;
        appState.queue.estimatedTime = 12; // Reset
        appState.queue.peopleAhead = 3;
        appState.queue.status = 'Esperando turno...';
        
        widgetStateActive.classList.add('hidden');
        widgetStateIdle.classList.remove('hidden');
        
        // Reset form inputs
        document.getElementById('queue-name').value = '';
        
        showToast('Has cancelado tu turno en la Fila Virtual.', 'info');
    }

    // ==========================================================================
    // MODULE: ATMOSPHERE & CLIMATE SIMULATOR (Dynamic UI Elements)
    // ==========================================================================
    function simulateAtmosphere() {
        const climates = [
            { temp: 15, cond: 'Garúa fina', time: 13, crowd: 'Alta' },
            { temp: 16, cond: 'Neblina costera', time: 11, crowd: 'Media' },
            { temp: 18, cond: 'Templado', time: 9, crowd: 'Media-Baja' },
            { temp: 17, cond: 'Despejado', time: 14, crowd: 'Alta' }
        ];

        // Periodically adjust the weather to show users the live connection
        setInterval(() => {
            if (appState.queue.inQueue) return; // Don't disrupt active timer
            
            const randomClimate = climates[Math.floor(Math.random() * climates.length)];
            appState.factors.temp = randomClimate.temp;
            appState.factors.condition = randomClimate.cond;
            appState.factors.crowd = randomClimate.crowd;
            
            appState.queue.estimatedTime = randomClimate.time;
            appState.queue.peopleAhead = randomClimate.time === 14 ? 4 : (randomClimate.time === 9 ? 2 : 3);
            
            // Update UI elements
            if (liveWeather) liveWeather.textContent = `${randomClimate.temp}°C, ${randomClimate.cond}`;
            if (liveCrowd) liveCrowd.textContent = randomClimate.crowd;
            if (waitTimeValue) waitTimeValue.textContent = `${randomClimate.time} min`;
            if (peopleCountValue) peopleCountValue.textContent = appState.queue.peopleAhead;
            
            if (widgetLastUpdate) {
                const now = new Date();
                widgetLastUpdate.textContent = `Act. ahora`;
                setTimeout(() => {
                    widgetLastUpdate.textContent = `Act. hace 10s`;
                }, 10000);
            }
        }, 30000);
    }

    // ==========================================================================
    // MODULE: MENU LIVE stock fluctuations
    // ==========================================================================
    function simulateStockFluctuations() {
        setInterval(() => {
            // Pick a random product
            const randIdx = Math.floor(Math.random() * MENU_ITEMS.length);
            const product = MENU_ITEMS[randIdx];
            
            // Randomly decrease or increase slightly
            if (Math.random() > 0.4) {
                if (product.stock > 1) {
                    product.stock -= 1;
                    if (product.stock === 2 || product.stock === 1) {
                        showToast(`¡Solo quedan ${product.stock} unidades de ${product.name}!`, 'info');
                    }
                } else {
                    product.stock = Math.floor(Math.random() * 8) + 5; // Restock
                }
            } else {
                product.stock += 1;
            }
            
            // Re-render only matching card or update badge in DOM to avoid rebuilding everything
            const badge = document.getElementById(`stock-badge-${product.id}`);
            if (badge) {
                badge.textContent = product.stock <= 3 ? `Solo quedan ${product.stock}` : `Stock en vivo: ${product.stock}`;
                if (product.stock <= 3) {
                    badge.classList.add('warning');
                } else {
                    badge.classList.remove('warning');
                }
            }
        }, 15000);
    }

    // ==========================================================================
    // MODULE: PRODUCT RENDERING & SEARCH
    // ==========================================================================
    function renderProducts() {
        if (!productsContainer) return;
        
        productsContainer.innerHTML = '';
        
        // Filter
        let filtered = MENU_ITEMS;
        if (appState.menuFilter !== 'todos') {
            filtered = filtered.filter(item => item.category === appState.menuFilter);
        }
        
        // Search
        if (appState.searchQuery !== '') {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(appState.searchQuery) ||
                item.desc.toLowerCase().includes(appState.searchQuery)
            );
        }

        if (filtered.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products-wrapper" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                    <i class="bi bi-search" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 12px; display: inline-block;"></i>
                    <p style="color: var(--text-secondary);">No encontramos productos que coincidan con tu búsqueda.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = `product-card ${appState.selectedProductId === item.id ? 'selected' : ''}`;
            card.dataset.id = item.id;
            
            const isLowStock = item.stock <= 3;
            
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <span class="stock-badge ${isLowStock ? 'warning' : ''}" id="stock-badge-${item.id}">
                        ${isLowStock ? `Solo quedan ${item.stock}` : `Stock en vivo: ${item.stock}`}
                    </span>
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-desc">${item.desc}</p>
                    <div class="product-meta">
                        <span class="product-price">S/ ${item.price.toFixed(2)}</span>
                        <button class="btn-add-product" aria-label="Seleccionar producto">
                            <i class="bi ${appState.selectedProductId === item.id ? 'bi-check-lg' : 'bi-plus-lg'}"></i>
                        </button>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                selectProduct(item.id);
            });
            
            productsContainer.appendChild(card);
        });
    }

    // ==========================================================================
    // MODULE: IA MENU RECOMMENDATIONS
    // ==========================================================================
    function selectProduct(productId) {
        appState.selectedProductId = productId;
        
        // Re-render grid to highlight selected
        document.querySelectorAll('.product-card').forEach(card => {
            if (card.dataset.id === productId) {
                card.classList.add('selected');
                card.querySelector('.btn-add-product i').className = 'bi bi-check-lg';
            } else {
                card.classList.remove('selected');
                card.querySelector('.btn-add-product i').className = 'bi bi-plus-lg';
            }
        });

        // Trigger AI Recommender display
        const product = MENU_ITEMS.find(item => item.id === productId);
        const pairing = RECOMMENDATIONS[productId];
        
        if (product && pairing) {
            const pairedProduct = MENU_ITEMS.find(item => item.id === pairing.pairId);
            
            // Set User selection UI
            userSelectionBox.classList.add('active');
            selectedProductContainer.innerHTML = `
                <div class="selected-item-display">
                    <img class="selected-item-img" src="${product.img}" alt="${product.name}">
                    <div>
                        <span class="selected-item-name">${product.name}</span>
                    </div>
                </div>
            `;
            
            // Set Recommended item UI
            recommendedPairBox.classList.add('active');
            recommendedProductContainer.innerHTML = `
                <div class="selected-item-display">
                    <img class="selected-item-img" src="${pairedProduct.img}" alt="${pairedProduct.name}">
                    <div>
                        <span class="selected-item-name">${pairedProduct.name}</span>
                        <p style="font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-top: 4px; line-height: 1.25;">
                            ${pairing.reason}
                        </p>
                    </div>
                </div>
            `;
            
            // Auto scroll slightly down to recommender module if on mobile
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    document.getElementById('ai-recommender').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 400);
            }
            
            showToast(`IA: Maridaje sugerido para tu ${product.name}.`, 'success');
        }
    }

    // ==========================================================================
    // NOTIFICATION TOASTS
    // ==========================================================================
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'success' : ''}`;
        
        const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill';
        
        toast.innerHTML = `
            <i class="bi ${icon} toast-icon"></i>
            <div class="toast-content">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s reverse forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }

    // ==========================================================================
    // PROGRESSIVE WEB APP INSTALLATION TOAST
    // ==========================================================================
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Show PWA installation prompt
        if (pwaInstallToast) {
            pwaInstallToast.classList.remove('hidden');
        }
    });

    if (btnPwaCancel) {
        btnPwaCancel.addEventListener('click', () => {
            if (pwaInstallToast) {
                pwaInstallToast.classList.add('hidden');
            }
        });
    }

    if (btnPwaInstall) {
        btnPwaInstall.addEventListener('click', () => {
            if (!deferredPrompt) return;
            // Hide our install banner
            pwaInstallToast.classList.add('hidden');
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    showToast('¡Café Ancestral añadida con éxito a tu pantalla de inicio!', 'success');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }

    // Simulation helper for vibration
    function triggerVibration() {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }
});

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered successfully in scope:', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    });
}
