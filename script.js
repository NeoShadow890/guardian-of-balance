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
    const skillModal = document.getElementById('skill-modal');
    const skillModalContent = document.getElementById('skill-modal-content');
    const skillModalClose = document.getElementById('skill-modal-close');
    const tarotCard = document.getElementById('tarot-card');
    const dailyBoonBar = document.getElementById('daily-boon-bar');

    // --- Databases ---
    const skillDatabase = {
        active: {
            resolveBurst: { name: "Resolve Burst", rank: "SSR", icon: "fa-solid fa-burst", lore: "ไม่ใช่แค่การระเบิดพลัง แต่คือการเร่งกระบวนการเผาผลาญ 'แก่นกายา' ในระดับเซลล์ โดยใช้ 'เจตจำนง' เป็นตัวจุดชนวน...", details: "Cost: แก่นกายา | Synergy: Fear Walker | Drawback: อ่อนล้าอย่างหนัก" },
            quickAnalysis: { name: "Quick Analysis", rank: "SSR", icon: "fa-solid fa-magnifying-glass-chart", lore: "คือความสามารถในการทำให้กระแสความคิดเข้าสู่สภาวะ 'Quantum Coherence' ชั่วขณะ...", details: "Cost: แก่นปัญญา | Synergy: Precision Strike | Drawback: ใช้สมาธิสูง" }
        },
        passive: {
            shadowWalk: { name: "Shadow Walk", rank: "SSR", icon: "fa-solid fa-moon", lore: "เรียนรู้ที่จะกลมกลืนไปกับเงา ไม่ใช่การล่องหน แต่คือการทำความเข้าใจในธรรมชาติของแสงและเงา...", details: "Cost: ไม่มี | Synergy: - | Drawback: ใช้ได้ผลดีในที่แสงน้อย" },
            fearWalker: { name: "Fear Walker", rank: "SSR", icon: "fa-solid fa-shoe-prints", lore: "ผู้ที่เข้าใจสมดุลจะไม่ปฏิเสธความมืด แต่จะเรียนรู้ที่จะเดินผ่านมันไปโดยไม่ให้มันกลืนกิน...", details: "Cost: ไม่มี | Synergy: Resolve Burst | Drawback: ต้องยอมรับความกลัวจากใจจริง" }
        },
        dormant: {
            dimensionalShift: { name: "Dimensional Shift", rank: "SSS", icon: "fa-solid fa-atom", lore: "ทักษะขั้นสูงสุดที่ไม่ได้เป็นการ 'เคลื่อนย้าย' แต่คือการ 'พับ' ปริภูมิ-เวลา (Spacetime) เข้าหากัน...", details: "Cost: แก่นจักรวาลทั้งหมด | Synergy: - | Drawback: เสี่ยงต่อการหลงทางในมิติ" }
        }
    };
    const tarotDeck = [
        { name: "The Balance", boon: "วันนี้พลังทุกด้านของท่านสมดุล...", icon: "fa-solid fa-yin-yang" },
        { name: "The Shadow", boon: "เงาจะนำทางท่านในวันนี้...", icon: "fa-solid fa-moon" },
        { name: "The Cosmos", boon: "จักรวาลส่งพลังมาให้ท่านโดยตรง...", icon: "fa-solid fa-meteor" }
    ];

    // --- State Management ---
    let appState = { lastDrawDate: null, drawnCardName: null };

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
            console.error("Error loading state:", e);
            localStorage.removeItem('guardianOfBalanceState');
        }
    }

    function saveState() {
        appState.lastDrawDate = new Date().toDateString();
        localStorage.setItem('guardianOfBalanceState', JSON.stringify(appState));
    }

    function playOpeningAnimation() {
        if(openingTitle) setTimeout(() => { openingTitle.style.opacity = '1'; }, 500);
        if(openingSubtitle) setTimeout(() => { openingSubtitle.style.opacity = '1'; }, 1500);
        if(startButton) setTimeout(() => { startButton.style.opacity = '1'; }, 2500);
    }

    function enterMainSite() {
        if(openingSection) openingSection.style.opacity = '0';
        if(mainContent) mainContent.classList.remove('opacity-0');
        setTimeout(() => {
            if(openingSection) openingSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }

    function populateSkillGrid() {
        if (!skillGrid) return;
        let skillsHtml = '';
        for (const category in skillDatabase) {
            for (const skillId in skillDatabase[category]) {
                const skill = skillDatabase[category][skillId];
                skillsHtml += `<div class="skill-node glass p-4 text-center cursor-pointer hover:border-arcane-gold transition-all duration-300 transform hover:scale-105" data-skill-id="${skillId}">
                        <i class="${skill.icon} fa-2x text-aurora-green mb-2"></i>
                        <h3 class="font-pridi text-sm">${skill.name}</h3>
                        <p class="text-xs text-arcane-gold">${skill.rank}</p>
                    </div>`;
            }
        }
        skillGrid.innerHTML = skillsHtml;
    }

    function openSkillModal(skillId) {
        let skillData = null;
        for (const category in skillDatabase) {
            if (skillDatabase[category][skillId]) {
                skillData = skillDatabase[category][skillId];
                break;
            }
        }
        if (!skillData || !skillModalContent) return;
        skillModalContent.innerHTML = `<div class="flex items-center mb-4">
                <i class="${skillData.icon} fa-3x text-aurora-green mr-4"></i>
                <div>
                    <h2 class="font-pridi text-2xl text-arcane-gold">${skillData.name} (${skillData.rank})</h2>
                    <p class="text-gray-400">${skillData.details}</p>
                </div>
            </div>
            <p class="text-gray-300 leading-relaxed">${skillData.lore}</p>`;
        if(skillModal) skillModal.classList.add('visible');
    }

    function closeSkillModal() {
        if(skillModal) skillModal.classList.remove('visible');
    }

    function initCustomCursor() {
        window.addEventListener('mousemove', e => {
            if(cursorDot) cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            if(cursorFollower) cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }

    function initBackground() {
        if (!backgroundContainer) return;
        backgroundContainer.innerHTML = `<video autoplay loop muted playsinline class="fixed top-0 left-0 w-full h-full object-cover z-[-2]">
                <source src="https://firebasestorage.googleapis.com/v0/b/digital-art-101.appspot.com/o/nebula_background.mp4?alt=media&token=c2f21051-0536-4993-b78f-6c1332f83a45" type="video/mp4">
            </video>`;
    }

    function initTarotState() {
        if (appState.drawnCardName && tarotCard) {
            const cardData = tarotDeck.find(c => c.name === appState.drawnCardName);
            if(cardData) {
                const cardFront = tarotCard.querySelector('.tarot-front');
                if(cardFront) cardFront.innerHTML = `<i class="${cardData.icon} fa-5x text-arcane-gold"></i><h3 class="font-pridi mt-4">${cardData.name}</h3>`;
                tarotCard.classList.add('flipped');
                if(dailyBoonBar) {
                    dailyBoonBar.textContent = `พรสำหรับวันนี้: ${cardData.boon}`;
                    dailyBoonBar.classList.remove('translate-y-full');
                }
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

    function setupEventListeners() {
        if(startButton) startButton.addEventListener('click', enterMainSite);

        document.querySelectorAll('.skill-node').forEach(node => {
            node.addEventListener('click', () => openSkillModal(node.dataset.skillId));
        });

        if(skillModalClose) skillModalClose.addEventListener('click', closeSkillModal);
        if(skillModal) skillModal.addEventListener('click', (e) => {
            if (e.target === skillModal) closeSkillModal();
        });

        if(tarotCard) tarotCard.addEventListener('click', drawTarotCard);
    }

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

    initialize();
});

