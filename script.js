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

    // --- Skill Database (Foundation) ---
    const skillDatabase = {
        active: {
            resolveBurst: { name: "Resolve Burst", rank: "SSR", icon: "fa-solid fa-burst" },
            precisionStrike: { name: "Precision Strike", rank: "S", icon: "fa-solid fa-crosshairs" },
            quickAnalysis: { name: "Quick Analysis", rank: "SSR", icon: "fa-solid fa-magnifying-glass-chart" },
            creativeSpark: { name: "Creative Spark", rank: "S", icon: "fa-solid fa-lightbulb" },
        },
        passive: {
            shadowWalk: { name: "Shadow Walk", rank: "SSR", icon: "fa-solid fa-moon" },
            fearWalker: { name: "Fear Walker", rank: "SSR", icon: "fa-solid fa-shoe-prints" },
            emotionalIntelligence: { name: "Emotional Intelligence", rank: "S", icon: "fa-solid fa-brain" },
        },
        dormant: {
            dimensionalShift: { name: "Dimensional Shift", rank: "SSS", icon: "fa-solid fa-atom" },
            ancestralCall: { name: "Ancestral Call", rank: "SSS", icon: "fa-solid fa-dna" },
        }
    };

    // --- Initialization Function ---
    function initialize() {
        playOpeningAnimation();
        setupEventListeners();
        populateSkillGrid();
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
            document.body.style.overflow = 'auto'; // Allow scrolling
        }, 1000);
    }

    function populateSkillGrid() {
        let skillsHtml = '';
        for (const category in skillDatabase) {
            for (const skillId in skillDatabase[category]) {
                const skill = skillDatabase[category][skillId];
                skillsHtml += `
                    <div class="skill-node glass p-4 text-center cursor-pointer hover:border-arcane-gold transition-all duration-300" data-skill-id="${skillId}">
                        <i class="${skill.icon} fa-2x text-aurora-green mb-2"></i>
                        <h3 class="font-pridi text-sm">${skill.name}</h3>
                        <p class="text-xs text-arcane-gold">${skill.rank}</p>
                    </div>
                `;
            }
        }
        skillGrid.innerHTML = skillsHtml;
    }

    function initCustomCursor() {
        window.addEventListener('mousemove', e => {
            cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });
    }
    
    function initBackground() {
        // For now, it's a simple function. We'll add complex canvas/video logic later.
        backgroundContainer.innerHTML = `
            <video autoplay loop muted class="fixed top-0 left-0 w-full h-full object-cover z-[-2]">
                <source src="https://firebasestorage.googleapis.com/v0/b/digital-art-101.appspot.com/o/nebula_background.mp4?alt=media&token=c2f21051-0536-4993-b78f-6c1332f83a45" type="video/mp4">
            </video>
        `;
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        startButton.addEventListener('click', enterMainSite);

        // We will add event listeners for skill nodes in the next phase
    }

    // --- Start the journey ---
    initialize();

});
