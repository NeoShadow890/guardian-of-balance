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


    // --- Skill Database (Detailed Version) ---
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

    // --- Initialization Function ---
    function initialize() {
        playOpeningAnimation();
        populateSkillGrid(); // Populate skills first
        setupEventListeners(); // Then setup listeners on the new elements
        initCustomCursor();
        initBackground();
    }

    // --- Core Functions ---

    function playOpeningAnimation() {
        setTimeout(() => { openingTitle.style.opacity = '1'; }, 500);
        setTimeout(() => { openingSubtitle.style.opacity = '1'; }, 1500);
        setTimeout(() => { startButton.style.opacity = '1'; }, 2500);
    }

    function enterMainSite() {
        openingSection.style.opacity = '0';
        mainContent.style.opacity = '1';
        setTimeout(() => {
            openingSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1000);
    }

    function populateSkillGrid() {
        if (!skillGrid) return;
        let skillsHtml = '';
        for (const category in skillDatabase) {
            for (const skillId in skillDatabase[category]) {
                const skill = skillDatabase[category][skillId];
                skillsHtml += `
                    <div class="skill-node glass p-4 text-center cursor-pointer hover:border-arcane-gold transition-all duration-300 transform hover:scale-105" data-skill-id="${skillId}">
                        <i class="${skill.icon} fa-2x text-aurora-green mb-2"></i>
                        <h3 class="font-pridi text-sm">${skill.name}</h3>
                        <p class="text-xs text-arcane-gold">${skill.rank}</p>
                    </div>
                `;
            }
        }
        skillGrid.innerHTML = skillsHtml;
    }

    function openSkillModal(skillId) {
        let skillData = null;
        for (const category in skillDatabase) {
            if(skillDatabase[category][skillId]) {
                skillData = skillDatabase[category][skillId];
                break;
            }
        }

        if (!skillData) return;

        skillModalContent.innerHTML = `
            <div class="flex items-center mb-4">
                <i class="${skillData.icon} fa-3x text-aurora-green mr-4"></i>
                <div>
                    <h2 class="font-pridi text-2xl text-arcane-gold">${skillData.name} (${skillData.rank})</h2>
                    <p class="text-gray-400">${skillData.details}</p>
                </div>
            </div>
            <p class="text-gray-300 leading-relaxed">${skillData.lore}</p>
        `;
        skillModal.classList.add('visible');
    }

    function closeSkillModal() {
        skillModal.classList.remove('visible');
    }

    function initCustomCursor() {
        window.addEventListener('mousemove', e => {
            cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }
    
    function initBackground() {
        if (!backgroundContainer) return;
        backgroundContainer.innerHTML = `
            <video autoplay loop muted playsinline class="fixed top-0 left-0 w-full h-full object-cover z-[-2]">
                <source src="https://firebasestorage.googleapis.com/v0/b/digital-art-101.appspot.com/o/nebula_background.mp4?alt=media&token=c2f21051-0536-4993-b78f-6c1332f83a45" type="video/mp4">
            </video>
        `;
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        startButton.addEventListener('click', enterMainSite);

        // Add event listeners to each skill node
        const skillNodes = document.querySelectorAll('.skill-node');
        skillNodes.forEach(node => {
            node.addEventListener('click', () => {
                const skillId = node.dataset.skillId;
                openSkillModal(skillId);
            });
        });

        // Listeners for closing the modal
        skillModalClose.addEventListener('click', closeSkillModal);
        skillModal.addEventListener('click', (event) => {
            if (event.target === skillModal) {
                closeSkillModal();
            }
        });
    }

    // --- Start the journey ---
    initialize();

});
