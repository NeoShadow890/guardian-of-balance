document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const elements = {
        openingSection: document.getElementById('opening'),
        openingTitle: document.getElementById('opening-title'),
        openingSubtitle: document.getElementById('opening-subtitle'),
        startButton: document.getElementById('start-button'),
        mainContent: document.getElementById('main-content'),
        skillGrid: document.getElementById('skill-grid'),
        cursorFollower: document.getElementById('cursor-follower'),
        cursorDot: document.getElementById('cursor-dot'),
        backgroundContainer: document.getElementById('background-container'),
        skillModal: document.getElementById('skill-modal'),
        skillModalContent: document.getElementById('skill-modal-content'),
        skillModalClose: document.getElementById('skill-modal-close'),
        tarotCard: document.getElementById('tarot-card'),
        dailyBoonBar: document.getElementById('daily-boon-bar'),
        navLinks: document.querySelectorAll('header a'),
        theoryButton: document.querySelector('#theory .magic-button')
    };

    // --- Databases ---
    const skillDatabase = {
        active: {
            resolveBurst: { name: "Resolve Burst", rank: "SSR", icon: "fa-solid fa-burst", lore: "ไม่ใช่แค่การระเบิดพลัง แต่คือการเร่งกระบวนการเผาผลาญ 'แก่นกายา' ในระดับเซลล์...", details: "Cost: แก่นกายา | Synergy: Fear Walker | Drawback: อ่อนล้าอย่างหนัก" },
            quickAnalysis: { name: "Quick Analysis", rank: "SSR", icon: "fa-solid fa-magnifying-glass-chart", lore: "คือความสามารถในการทำให้กระแสความคิดเข้าสู่สภาวะ 'Quantum Coherence' ชั่วขณะ...", details: "Cost: แก่นปัญญา | Synergy: Precision Strike | Drawback: ใช้สมาธิสูง" }
        },
        passive: {
            shadowWalk: { name: "Shadow Walk", rank: "SSR", icon: "fa-solid fa-moon", lore: "เรียนรู้ที่จะกลมกลืนไปกับเงา ไม่ใช่การล่องหน...", details: "Cost: ไม่มี | Synergy: - | Drawback: ใช้ได้ผลดีในที่แสงน้อย" },
            fearWalker: { name: "Fear Walker", rank: "SSR", icon: "fa-solid fa-shoe-prints", lore: "ผู้ที่เข้าใจสมดุลจะไม่ปฏิเสธความมืด แต่จะเรียนรู้ที่จะเดินผ่านมันไป...", details: "Cost: ไม่มี | Synergy: Resolve Burst | Drawback: ต้องยอมรับความกลัวจากใจจริง" }
        },
        dormant: {
            dimensionalShift: { name: "Dimensional Shift", rank: "SSS", icon: "fa-solid fa-atom", lore: "ทักษะขั้นสูงสุดที่ไม่ได้เป็นการ 'เคลื่อนย้าย' แต่คือการ 'พับ' ปริภูมิ-เวลา...", details: "Cost: แก่นจักรวาลทั้งหมด | Synergy: - | Drawback: เสี่ยงต่อการหลงทางในมิติ" }
        }
    };
    const tarotDeck = [
        { name: "The Balance", boon: "วันนี้พลังทุกด้านของท่านสมดุล...", icon: "fa-solid fa-yin-yang" },
        { name: "The Shadow", boon: "เงาจะนำทางท่านในวันนี้...", icon: "fa-solid fa-moon" },
        { name: "The Cosmos", boon: "จักรวาลส่งพลังมาให้ท่านโดยตรง...", icon: "fa-solid fa-meteor" }
    ];
    const quizDatabase = [
        { question: "องค์ประกอบใดที่ไม่ใช่ส่วนหนึ่งของ 'ทฤษฎีมหาสมดุล'?", answers: ["จิต", "จักรวาล", "เจตจำนง", "ความว่างเปล่า"], correctAnswer: 3 },
        { question: "ทักษะใดสะท้อนถึงปรากฏการณ์ Supernova?", answers: ["Dimensional Shift", "Resolve Burst", "Shadow Walk", "Quick Analysis"], correctAnswer: 1 }
    ];

    // --- State Management ---
    let appState = { lastDrawDate: null, drawnCardName: null };

    // --- Core Functions ---
    const functions = {
        loadState: () => {
            try {
                const savedState = JSON.parse(localStorage.getItem('guardianOfBalanceState'));
                if (savedState) {
                    const today = new Date().toDateString();
                    if (savedState.lastDrawDate === today) appState = savedState;
                    else localStorage.removeItem('guardianOfBalanceState');
                }
            } catch (e) { console.error("Error loading state:", e); }
        },
        saveState: () => {
            appState.lastDrawDate = new Date().toDateString();
            localStorage.setItem('guardianOfBalanceState', JSON.stringify(appState));
        },
        playOpeningAnimation: () => {
            setTimeout(() => elements.openingTitle?.classList.remove('opacity-0'), 500);
            setTimeout(() => elements.openingSubtitle?.classList.remove('opacity-0'), 1500);
            setTimeout(() => elements.startButton?.classList.remove('opacity-0'), 2500);
        },
        enterMainSite: () => {
            elements.openingSection?.classList.add('opacity-0');
            elements.mainContent?.classList.remove('opacity-0');
            setTimeout(() => {
                elements.openingSection.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 1000);
        },
        populateSkillGrid: () => {
            if (!elements.skillGrid) return;
            elements.skillGrid.innerHTML = Object.values(skillDatabase).flatMap(cat => Object.entries(cat)).map(([id, skill]) => `
                <div class="skill-node glass p-4 text-center cursor-pointer hover:border-arcane-gold transition-all duration-300 transform hover:scale-105" data-skill-id="${id}">
                    <i class="${skill.icon} fa-2x text-aurora-green mb-2"></i>
                    <h3 class="font-pridi text-sm">${skill.name}</h3>
                    <p class="text-xs text-arcane-gold">${skill.rank}</p>
                </div>`).join('');
        },
        openSkillModal: (skillId) => {
            const skillData = Object.values(skillDatabase).flatMap(cat => Object.entries(cat)).find(([id]) => id === skillId)?.[1];
            if (!skillData || !elements.skillModalContent) return;
            elements.skillModalContent.innerHTML = `
                <div class="flex items-center mb-4">
                    <i class="${skillData.icon} fa-3x text-aurora-green mr-4"></i>
                    <div>
                        <h2 class="font-pridi text-2xl text-arcane-gold">${skillData.name} (${skillData.rank})</h2>
                        <p class="text-gray-400">${skillData.details}</p>
                    </div>
                </div>
                <p class="text-gray-300 leading-relaxed">${skillData.lore}</p>`;
            elements.skillModal?.classList.add('visible');
        },
        closeSkillModal: () => elements.skillModal?.classList.remove('visible'),
        initCustomCursor: () => {
            window.addEventListener('mousemove', e => {
                elements.cursorDot?.style.setProperty('transform', `translate(${e.clientX}px, ${e.clientY}px)`);
                elements.cursorFollower?.style.setProperty('transform', `translate(${e.clientX}px, ${e.clientY}px)`);
            });
        },
        initBackground: () => {
            if (elements.backgroundContainer) elements.backgroundContainer.innerHTML = `<video autoplay loop muted playsinline class="fixed top-0 left-0 w-full h-full object-cover z-[-2]"><source src="https://firebasestorage.googleapis.com/v0/b/digital-art-101.appspot.com/o/nebula_background.mp4?alt=media&token=c2f21051-0536-4993-b78f-6c1332f83a45" type="video/mp4"></video>`;
        },
        initTarotState: () => {
            if (appState.drawnCardName && elements.tarotCard) {
                const cardData = tarotDeck.find(c => c.name === appState.drawnCardName);
                if (cardData) {
                    const cardFront = elements.tarotCard.querySelector('.tarot-front');
                    if(cardFront) cardFront.innerHTML = `<i class="${cardData.icon} fa-5x text-arcane-gold"></i><h3 class="font-pridi mt-4">${cardData.name}</h3>`;
                    elements.tarotCard.classList.add('flipped');
                    if (elements.dailyBoonBar) {
                        elements.dailyBoonBar.textContent = `พรสำหรับวันนี้: ${cardData.boon}`;
                        elements.dailyBoonBar.classList.remove('translate-y-full');
                    }
                }
            }
        },
        drawTarotCard: () => {
            if (appState.lastDrawDate === new Date().toDateString()) return alert("คุณได้รับพรสำหรับวันนี้ไปแล้ว");
            const drawnCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
            appState.drawnCardName = drawnCard.name;
            functions.saveState();
            functions.initTarotState();
        },
        navigateToZone: (zoneId) => {
            const targetSection = document.getElementById(zoneId);
            targetSection?.scrollIntoView({ behavior: 'smooth' });
        },
        startBossBattle: () => {
            alert("บททดสอบแห่งมหาสมดุลได้เริ่มขึ้นแล้ว!");
            // Boss battle logic will be implemented here in a more visual way later
        }
    };

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        elements.startButton?.addEventListener('click', functions.enterMainSite);
        elements.skillGrid?.addEventListener('click', e => {
            const node = e.target.closest('.skill-node');
            if (node) functions.openSkillModal(node.dataset.skillId);
        });
        elements.skillModalClose?.addEventListener('click', functions.closeSkillModal);
        elements.skillModal?.addEventListener('click', e => {
            if (e.target === elements.skillModal) functions.closeSkillModal();
        });
        elements.tarotCard?.addEventListener('click', functions.drawTarotCard);
        elements.navLinks?.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                functions.navigateToZone(link.getAttribute('href').substring(1));
            });
        });
        if (elements.theoryButton) {
            elements.theoryButton.textContent = "เริ่มบททดสอบ";
            elements.theoryButton.addEventListener('click', functions.startBossBattle);
        }
    }

    // --- Initialization ---
    function initialize() {
        functions.loadState();
        functions.playOpeningAnimation();
        functions.populateSkillGrid();
        setupEventListeners();
        functions.initCustomCursor();
        functions.initBackground();
        functions.initTarotState();
        functions.navigateToZone('nexus');
    }

    initialize();
});
