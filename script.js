document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const openingSection = document.getElementById('opening');
    const openingTitle = document.getElementById('opening-title');
    const openingSubtitle = document.getElementById('opening-subtitle');
    const startButton = document.getElementById('start-button');
    const mainContent = document.getElementById('main-content');
    const skillGrid = document.getElementById('skill-grid');
    const cursorFollower = document.getElementById('cursor-follower');
    const cursorDot = document.getElementById('cursor-dot');
    const backgroundContainer = document.getElementById('background-container');
    
    // Modal Elements
    const skillModal = document.getElementById('skill-modal');
    const skillModalContent = document.getElementById('skill-modal-content');
    const skillModalClose = document.getElementById('skill-modal-close');

    // Tarot Elements
    const tarotCard = document.getElementById('tarot-card');
    const dailyBoonBar = document.getElementById('daily-boon-bar');

    // --- Databases ---
    const skillDatabase = {
        active: {
            resolveBurst: { 
                name: "Resolve Burst", 
                rank: "SSR", 
                icon: "fa-solid fa-burst",
                lore: "ไม่ใช่แค่การระเบิดพลัง แต่คือการเร่งกระบวนการเผาผลาญ 'แก่นกายา' ในระดับเซลล์ โดยใช้ 'เจตจำนง' เป็นตัวจุดชนวน ทำให้เกิดพลังมหาศาลในชั่วพริบตา สะท้อนถึงปรากฏการณ์ Supernova ของดวงดาว.",
                details: "Cost: แก่นกายา | Synergy: Fear Walker | Drawback: อ่อนล้าอย่างหนัก"
            },
            quickAnalysis: { 
                name: "Quick Analysis", 
                rank: "SSR", 
                icon: "fa-solid fa-magnifying-glass-chart",
                lore: "คือความสามารถในการทำให้กระแสความคิดเข้าสู่สภาวะ 'Quantum Coherence' ชั่วขณะ ทำให้สามารถประมวลผลข้อมูลที่ซับซ้อนได้พร้อมกันในทุกมิติ คล้ายกับหลักการของ Quantum Computing.",
                details: "Cost: แก่นปัญญา | Synergy: Precision Strike | Drawback: ใช้สมาธิสูง"
            },
        },
        passive: {
            shadowWalk: { 
                name: "Shadow Walk", 
                rank: "SSR", 
                icon: "fa-solid fa-moon",
                lore: "เรียนรู้ที่จะกลมกลืนไปกับเงา ไม่ใช่การล่องหน แต่คือการทำความเข้าใจในธรรมชาติของแสงและเงา จนสามารถเป็นส่วนหนึ่งของมันได้.",
                details: "Cost: ไม่มี | Synergy: - | Drawback: ใช้ได้ผลดีในที่แสงน้อย"
            },
            fearWalker: { 
                name: "Fear Walker", 
                rank: "SSR", 
                icon: "fa-solid fa-shoe-prints",
                lore: "ผู้ที่เข้าใจสมดุลจะไม่ปฏิเสธความมืด แต่จะเรียนรู้ที่จะเดินผ่านมันไปโดยไม่ให้มันกลืนกิน ทำให้จิตใจสงบนิ่งเมื่อเผชิญหน้ากับความกลัว.",
                details: "Cost: ไม่มี | Synergy: Resolve Burst | Drawback: ต้องยอมรับความกลัวจากใจจริง"
            },
        },
        dormant: {
            dimensionalShift: { 
                name: "Dimensional Shift", 
                rank: "SSS", 
                icon: "fa-solid fa-atom",
                lore: "ทักษะขั้นสูงสุดที่ไม่ได้เป็นการ 'เคลื่อนย้าย' แต่คือการ 'พับ' ปริภูมิ-เวลา (Spacetime) เข้าหากันโดยใช้ 'แก่นจักรวาล' เป็นจุดศูนย์กลาง ทำให้สามารถก้าวข้ามจากจุดหนึ่งไปยังอีกจุดหนึ่งได้ในพริบตา.",
                details: "Cost: แก่นจักรวาลทั้งหมด | Synergy: - | Drawback: เสี่ยงต่อการหลงทางในมิติ"
            },
        }
    };
    const tarotDeck = [
        { 
            name: "The Balance", 
            boon: "วันนี้พลังทุกด้านของท่านสมดุล ทำให้การใช้ทักษะทุกอย่างมีประสิทธิภาพสูงสุด",
            icon: "fa-solid fa-yin-yang"
        },
        { 
            name: "The Shadow", 
            boon: "เงาจะนำทางท่านในวันนี้ ทำให้ทักษะที่เกี่ยวกับเงามีพลังมากขึ้นเป็นพิเศษ",
            icon: "fa-solid fa-moon"
        },
        { 
            name: "The Cosmos", 
            boon: "จักรวาลส่งพลังมาให้ท่านโดยตรง 'แก่นจักรวาล' ของท่านจะฟื้นฟูอย่างรวดเร็ว",
            icon: "fa-solid fa-meteor" 
        }
    ];

    // --- State Management ---
    let appState = {
        lastDrawDate: null,
        drawnCardName: null
    };

    // --- Initialization Function ---
    function initialize() {
        loadState();
        playOpeningAnimation();
        populateSkillGrid();
        setupEventListeners();
        initCustomCursor();
        initBackground();
        initTarotState();
    }

    // --- Core Functions ---

    function loadState() {
        try {
            const savedState = JSON.parse(localStorage.getItem('guardianOfBalanceState'));
            if (savedState) {
                const today = new Date().toDateString();
                if (savedState.lastDrawDate === today) {
                    appState = savedState;
                } else {
                    localStorage.removeItem('guardianOfBalanceState');
                }
            }
        } catch (e) {
            console.error("Error loading state from localStorage", e);
            localStorage.removeItem('guardianOfBalanceState');
        }
    }

    function saveState() {
        appState.lastDrawDate = new Date().toDateString();
        localStorage.setItem('guardianOfBalanceState', JSON.stringify(appState));
    }
    
    function playOpeningAnimation() { /* ... Function from previous steps ... */ }
    function enterMainSite() { /* ... Function from previous steps ... */ }
    function populateSkillGrid() { /* ... Function from previous steps ... */ }
    function openSkillModal(skillId) { /* ... Function from previous steps ... */ }
    function closeSkillModal() { /* ... Function from previous steps ... */ }
    function initCustomCursor() { /* ... Function from previous steps ... */ }
    function initBackground() { /* ... Function from previous steps ... */ }

    function initTarotState() {
        if (appState.drawnCardName) {
            const cardData = tarotDeck.find(c => c.name === appState.drawnCardName);
            if(cardData) {
                const cardFront = tarotCard.querySelector('.tarot-front');
                cardFront.innerHTML = `<i class="${cardData.icon} fa-5x text-arcane-gold"></i><h3 class="font-pridi mt-4">${cardData.name}</h3>`;
                tarotCard.classList.add('flipped');
                dailyBoonBar.textContent = `พรสำหรับวันนี้: ${cardData.boon}`;
                dailyBoonBar.classList.add('visible');
            }
        }
    }

    function drawTarotCard() {
        const today = new Date().toDateString();
        if (appState.lastDrawDate === today) {
            alert("คุณได้รับพรสำหรับวันนี้ไปแล้ว");
            return;
        }

        const drawnCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
        appState.drawnCardName = drawnCard.name;
        
        saveState();
        initTarotState(); 
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        startButton.addEventListener('click', enterMainSite);

        document.querySelectorAll('.skill-node').forEach(node => {
            node.addEventListener('click', () => openSkillModal(node.dataset.skillId));
        });

        skillModalClose.addEventListener('click', closeSkillModal);
        skillModal.addEventListener('click', (e) => {
            if (e.target === skillModal) closeSkillModal();
        });

        if(tarotCard) {
            tarotCard.addEventListener('click', drawTarotCard);
        }
    }

    // --- Start the journey ---
    initialize();

});

