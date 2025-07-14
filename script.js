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
    const skillDatabase = { /* ... SKILL DATA FROM PREVIOUS STEP ... */ }; // Placeholder for brevity
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
        drawnCard: null
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
        const savedState = JSON.parse(localStorage.getItem('guardianOfBalanceState'));
        if (savedState) {
            const today = new Date().toDateString();
            if (savedState.lastDrawDate === today) {
                appState = savedState;
            } else {
                // It's a new day, clear the old draw state
                localStorage.removeItem('guardianOfBalanceState');
            }
        }
    }

    function saveState() {
        appState.lastDrawDate = new Date().toDateString();
        localStorage.setItem('guardianOfBalanceState', JSON.stringify(appState));
    }
    
    function playOpeningAnimation() { /* ... Function from previous step ... */ }
    function enterMainSite() { /* ... Function from previous step ... */ }
    function populateSkillGrid() { /* ... Function from previous step ... */ }
    function openSkillModal(skillId) { /* ... Function from previous step ... */ }
    function closeSkillModal() { /* ... Function from previous step ... */ }
    function initCustomCursor() { /* ... Function from previous step ... */ }
    function initBackground() { /* ... Function from previous step ... */ }

    function initTarotState() {
        if (appState.drawnCard) {
            const cardData = tarotDeck.find(c => c.name === appState.drawnCard.name);
            if(cardData) {
                tarotCard.classList.add('flipped');
                const cardFront = tarotCard.querySelector('.tarot-front');
                cardFront.innerHTML = `<i class="${cardData.icon} fa-5x text-arcane-gold"></i><h3 class="font-pridi mt-4">${cardData.name}</h3>`;
                dailyBoonBar.textContent = `พรสำหรับวันนี้: ${cardData.boon}`;
                dailyBoonBar.classList.remove('translate-y-full');
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
        appState.drawnCard = drawnCard;
        
        saveState();
        initTarotState(); // Display the card and boon
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        startButton.addEventListener('click', enterMainSite);

        // Skill Node Listeners
        const skillNodes = document.querySelectorAll('.skill-node');
        skillNodes.forEach(node => {
            node.addEventListener('click', () => {
                const skillId = node.dataset.skillId;
                openSkillModal(skillId);
            });
        });

        // Modal Close Listeners
        skillModalClose.addEventListener('click', closeSkillModal);
        skillModal.addEventListener('click', (event) => {
            if (event.target === skillModal) {
                closeSkillModal();
            }
        });

        // Tarot Card Listener
        if(tarotCard) {
            tarotCard.addEventListener('click', drawTarotCard);
        }
    }

    // --- Start the journey ---
    initialize();

});
