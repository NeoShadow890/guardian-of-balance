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
    theoryButton: document.querySelector('#theory .magic-button'),
    chatWindow: document.getElementById('chat-window'),
    chatInput: document.getElementById('chat-input'),
    chat
