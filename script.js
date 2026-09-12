// =========================================================================
// ONN NOKKATTE — SPOT THE DIFFERENCE FRIDGE MEMORY GAME & EXPERIMENT
// =========================================================================

// --- Web Audio API Sound Generator (No external audio file dependencies) ---
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem('fridge_soundEnabled') !== 'false';
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('fridge_soundEnabled', this.enabled);
        return this.enabled;
    }

    playDoorOpen() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Suction pop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);

        // Air hum / hiss
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
    }

    playDoorClose() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Low thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);

        // Magnetic latch click
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(800, now + 0.08);
        clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.14);

        clickGain.gain.setValueAtTime(0.2, now + 0.08);
        clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now + 0.08);
        clickOsc.stop(now + 0.16);
    }

    playTick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.04);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
    }

    playCorrect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.3, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.4);
        });
    }

    playWrong() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(180, now);
        osc2.frequency.setValueAtTime(174, now);
        osc1.frequency.exponentialRampToValueAtTime(110, now + 0.28);
        osc2.frequency.exponentialRampToValueAtTime(105, now + 0.28);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.32);
        osc2.stop(now + 0.32);
    }

    playHint() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [880, 1174.66, 1396.91, 1760]; // A5, D6, F6, A6

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);

            gain.gain.setValueAtTime(0.2, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.3);
        });
    }

    playGameOver() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [392.00, 349.23, 329.63, 261.63]; // G4, F4, E4, C4

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.18);

            gain.gain.setValueAtTime(0.25, now + idx * 0.18);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.18);
            osc.stop(now + idx * 0.18 + 0.4);
        });
    }

    playBrush() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.4;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(950, now + 0.1);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    playColorPop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.exponentialRampToValueAtTime(784, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
    }

    playPaintingComplete() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.28, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.45);
        });
    }

    playChaiSip() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Warm liquid slurp
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.35;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.16);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);

        // Pleasant ascending warm chime
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(523.25, now + 0.04);
        chime.frequency.exponentialRampToValueAtTime(659.25, now + 0.18);
        chimeGain.gain.setValueAtTime(0.12, now + 0.04);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chime.start(now + 0.04);
        chime.stop(now + 0.23);
    }

    playCatMunch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [0, 0.07, 0.14].forEach((delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440 + Math.random() * 200, now + delay);
            osc.frequency.exponentialRampToValueAtTime(120, now + delay + 0.05);

            gain.gain.setValueAtTime(0.2, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.06);
        });
    }

    playGeckoChirp() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [0, 0.06, 0.12, 0.18, 0.24].forEach((delay) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400, now + delay);
            osc.frequency.exponentialRampToValueAtTime(800, now + delay + 0.03);

            gain.gain.setValueAtTime(0.15, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.04);
        });
    }

    playYarnRoll() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.25);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
    }
}

const sounds = new SoundManager();


// =========================================================================
// APPLICATION & GAME STATE
// =========================================================================

let state = {
    // Mode
    mode: 'game', // 'game' or 'classic'

    // Classic Stats
    openCount: parseInt(localStorage.getItem('fridge_openCount')) || 0,
    closeCount: parseInt(localStorage.getItem('fridge_closeCount')) || 0,
    timeSpent: parseInt(localStorage.getItem('fridge_timeSpent')) || 0,
    sessions: parseInt(localStorage.getItem('fridge_sessions')) || 0,
    rareEvents: parseInt(localStorage.getItem('fridge_rareEvents')) || 0,

    // Game Stats
    round: 1,
    score: 0,
    streak: 0,
    bestStreak: parseInt(localStorage.getItem('fridge_bestStreak')) || 0,
    highScore: parseInt(localStorage.getItem('fridge_highScore')) || 0,
    lives: 3,
    hintsLeft: 2,

    // Runtime state
    isOpen: false,
    phase: 'IDLE', // 'IDLE' | 'MEMORIZE' | 'CLOSING' | 'FIND' | 'ROUND_END'
    currentDiff: null,
    phaseTimeRemaining: 0,
    phaseTimerInterval: null,
    usedDiffIndices: []
};

// Increment session
state.sessions++;
localStorage.setItem('fridge_sessions', state.sessions);

// Time tracker
setInterval(() => {
    state.timeSpent++;
    localStorage.setItem('fridge_timeSpent', state.timeSpent);
}, 1000);


// =========================================================================
// DOM ELEMENTS
// =========================================================================

const landingScreen = document.getElementById('landing-screen');
const mainScreen = document.getElementById('main-screen');
const enterBtn = document.getElementById('enter-btn');
const startGameBtn = document.getElementById('start-game-btn');
const shelfGamesBtn = document.getElementById('shelf-games-btn');
const actionBtn = document.getElementById('action-btn');
const waitingText = document.getElementById('waiting-text');
const fridge = document.getElementById('fridge');
const openCounterSpan = document.getElementById('open-counter');
const dynamicMessage = document.getElementById('dynamic-message');
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats');
const finalScreen = document.getElementById('final-screen');
const finalActionBtn = document.getElementById('final-action-btn');
const ultimateJokeScreen = document.getElementById('ultimate-joke-screen');
const jokeButtons = document.querySelectorAll('.joke-btn');

// Game HUD & Controls
const gameHud = document.getElementById('game-hud');
const classicHud = document.getElementById('classic-hud');
const brandBadge = document.getElementById('brand-badge');
const hudRoundVal = document.getElementById('hud-round-val');
const hudScoreVal = document.getElementById('hud-score-val');
const hudStreakVal = document.getElementById('hud-streak-val');
const hudLives = document.getElementById('hud-lives');
const hintBtn = document.getElementById('hint-btn');
const hintText = document.getElementById('hint-text');
const soundBtn = document.getElementById('sound-btn');
const modeToggleBtn = document.getElementById('mode-toggle-btn');
const shelfGamesTopBtn = document.getElementById('shelf-games-top-btn');

// Phase Banner & Timer
const phaseBanner = document.getElementById('phase-banner');
const phaseIcon = document.getElementById('phase-icon');
const phaseTitle = document.getElementById('phase-title');
const phaseSubtitle = document.getElementById('phase-subtitle');
const phaseTimerDisplay = document.getElementById('phase-timer-display');
const phaseTimerNum = document.getElementById('phase-timer-num');
const phaseProgressBar = document.getElementById('phase-progress-bar');

// FX & Toast & Modals
const fxLayer = document.getElementById('fx-layer');
const roundToast = document.getElementById('round-toast');
const toastTitle = document.getElementById('toast-title');
const toastMsg = document.getElementById('toast-msg');
const toastPoints = document.getElementById('toast-points');
const gameOverModal = document.getElementById('game-over-modal');
const finalRoundsVal = document.getElementById('final-rounds-val');
const finalScoreVal = document.getElementById('final-score-val');
const finalStreakVal = document.getElementById('final-streak-val');
const finalRankVal = document.getElementById('final-rank-val');
const playAgainBtn = document.getElementById('play-again-btn');
const switchClassicBtn = document.getElementById('switch-classic-btn');


// =========================================================================
// DIFFERENCE CATALOG (Rich variety of creative changes)
// =========================================================================

const DIFFERENCE_CATALOG = [
    {
        id: 'milk_choco',
        targetId: 'milk',
        name: 'Milk Carton',
        hint: 'Check the top shelf! Something looks sweeter than plain milk...',
        desc: 'The milk transformed into Chocolate Milk! 🍫',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.dataset.originalBg = el.style.background;
            el.style.background = '#fef3c7';
            el.style.borderColor = '#92400e';
            el.innerHTML = `<span>🍫</span><strong>CHOCO</strong><small style="color:#b45309">Extra sweet!</small>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
            el.style.background = el.dataset.originalBg || '';
            el.style.borderColor = '';
        }
    },
    {
        id: 'milk_boba',
        targetId: 'milk',
        name: 'Milk Carton',
        hint: 'Look up at shelf 1! Someone ordered takeout...',
        desc: 'The milk turned into a Boba Milk Tea! 🧋',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `<span>🧋</span><strong>BOBA</strong><small style="color:#6d28d9">50% sugar</small>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'eggs_chick',
        targetId: 'eggs',
        name: 'Egg Tray',
        hint: 'Look at shelf 1! Life finds a way...',
        desc: 'One of the eggs hatched into a cute chick! 🐥',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🥚🐥🥚';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'eggs_omelette',
        targetId: 'eggs',
        name: 'Egg Tray',
        hint: 'Top shelf! Someone made a quick breakfast snack...',
        desc: 'An egg got fried into a sunny-side up! 🍳',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🍳🥚🥚';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'eggs_missing',
        targetId: 'eggs',
        name: 'Egg Tray',
        hint: 'Count the items on shelf 1 carefully...',
        desc: 'One egg mysteriously vanished! 🥚',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🥚&nbsp;🥚';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'tomato_apple',
        targetId: 'tomato',
        name: 'Red Tomato',
        hint: 'Top shelf right corner! Is that really a vegetable?',
        desc: 'The tomato was replaced with a crunchy Apple! 🍎',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🍎';
            el.title = 'Shiny Apple';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
            el.title = 'Fresh Tomato';
        }
    },
    {
        id: 'tomato_ketchup',
        targetId: 'tomato',
        name: 'Red Tomato',
        hint: 'Top shelf right side... it got processed!',
        desc: 'The tomato turned into a Ketchup bottle! 🥫',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🥫';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'leftovers_pizza',
        targetId: 'leftovers',
        name: 'Leftovers Box',
        hint: 'Middle shelf left side! An upgrade from yesterday’s dinner...',
        desc: 'The leftovers got upgraded to Pizza! 🍕',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🍕<span>Pizza!<br>(Cold)</span>`;
            el.style.background = '#e07a5f';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
            el.style.background = '';
        }
    },
    {
        id: 'leftovers_biryani',
        targetId: 'leftovers',
        name: 'Leftovers Box',
        hint: 'Middle shelf! Kerala culinary magic happened...',
        desc: 'The leftovers turned into hot Biryani! 🍲',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🍲<span>Biryani<br>Score!</span>`;
            el.style.background = '#d97706';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
            el.style.background = '';
        }
    },
    {
        id: 'leftovers_empty',
        targetId: 'leftovers',
        name: 'Leftovers Box',
        hint: 'Middle shelf... someone had a midnight hunger attack!',
        desc: 'The leftovers were completely eaten! 💨',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `📭<span>Eaten!<br>(Empty)</span>`;
            el.style.opacity = '0.5';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
            el.style.opacity = '1';
        }
    },
    {
        id: 'water_coconut',
        targetId: 'water',
        name: 'Water Bottle',
        hint: 'Shelf 2 center! The quintessential Kerala cooler...',
        desc: 'The plain water became a Tender Coconut (Elaneer)! 🥥',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🥥<span>Karikku<br>Vellam</span>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'water_soda',
        targetId: 'water',
        name: 'Water Bottle',
        hint: 'Middle shelf! Look for something bubbly and fizzy...',
        desc: 'The water was replaced with chilled Soda! 🥤',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🥤<span>Chilled<br>Soda</span>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'chilli_fire',
        targetId: 'chilli',
        name: 'Spicy Chilli',
        hint: 'Shelf 2 right side! Warning: high thermal levels...',
        desc: 'The chillies caught Fire! 🔥 Too spicy to handle!',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🔥<span>Too Hot<br>To Handle</span>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'lemon_cool',
        targetId: 'lemon',
        name: 'Lonely Lemon',
        hint: 'Bottom shelf left! The lemon has a major attitude change...',
        desc: 'The lonely lemon put on sunglasses and got rotated! 🍋🕶️',
        apply(el) {
            el.dataset.originalTransform = el.style.transform;
            el.dataset.originalHTML = el.innerHTML;
            el.style.transform = 'rotate(-30deg) scale(1.3)';
            el.innerHTML = '🍋<span style="font-size:16px;position:absolute;top:6px;left:6px">🕶️</span>';
        },
        restore(el) {
            el.style.transform = el.dataset.originalTransform || '';
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'lemon_lime',
        targetId: 'lemon',
        name: 'Lonely Lemon',
        hint: 'Bottom shelf left side... it looks greener than before!',
        desc: 'The yellow lemon became a green Lime! 🟢',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = '🍈';
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'pickle_nutella',
        targetId: 'pickle',
        name: 'Mango Pickle',
        hint: 'Shelf 3 center! What replaced the spicy pickle jar?',
        desc: 'The Mango Pickle jar was replaced with Nutella! 🍫',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🍫<small style="color:#78350f">Nutella<br>Secret</small>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'pickle_gone',
        targetId: 'pickle',
        name: 'Mango Pickle',
        hint: 'Shelf 3 center! Someone took the most valuable item...',
        desc: 'Amma took back the Mango Pickle! 🔒',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🔒<small style="color:#b91c1c">Amma<br>Locked It</small>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'achar_honey',
        targetId: 'achar',
        name: 'Achar Forever',
        hint: 'Shelf 3 right side! Sweetness replaced the vinegar...',
        desc: 'Achar Forever became Pure Honey! 🍯',
        apply(el) {
            el.dataset.originalHTML = el.innerHTML;
            el.innerHTML = `🍯<small style="color:#d97706">Pure<br>Honey</small>`;
        },
        restore(el) {
            if (el.dataset.originalHTML) el.innerHTML = el.dataset.originalHTML;
        }
    },
    {
        id: 'veggies_donut',
        targetId: 'veggies',
        name: 'Vegetable Drawer',
        hint: 'Inspect the veggie drawer! An impostor snuck in...',
        desc: 'A glazed Donut snuck in among the healthy vegetables! 🍩',
        apply() {
            const v = document.getElementById('veggie-contents');
            if (v) {
                v.dataset.originalText = v.innerHTML;
                v.innerHTML = '🥬 🥕 🍩 🍅 🥦';
            }
        },
        restore() {
            const v = document.getElementById('veggie-contents');
            if (v && v.dataset.originalText) {
                v.innerHTML = v.dataset.originalText;
            }
        }
    },
    {
        id: 'veggies_mushroom',
        targetId: 'veggies',
        name: 'Vegetable Drawer',
        hint: 'Check the crisper drawer at the very bottom...',
        desc: 'A magical glowing Mushroom appeared in the drawer! 🍄✨',
        apply() {
            const v = document.getElementById('veggie-contents');
            if (v) {
                v.dataset.originalText = v.innerHTML;
                v.innerHTML = '🥬 🥕 🫑 🍄 🥦';
            }
        },
        restore() {
            const v = document.getElementById('veggie-contents');
            if (v && v.dataset.originalText) {
                v.innerHTML = v.dataset.originalText;
            }
        }
    },
    {
        id: 'door_condiment',
        targetId: 'door-shelf-1',
        name: 'Door Top Shelf',
        hint: 'Look at the top rack inside the fridge door...',
        desc: 'A jar was swapped for a Hot Sauce bottle! 🔥',
        apply() {
            const item = document.getElementById('door-s1-c2');
            if (item) {
                item.dataset.orig = item.textContent;
                item.textContent = '🌶️';
            }
        },
        restore() {
            const item = document.getElementById('door-s1-c2');
            if (item && item.dataset.orig) {
                item.textContent = item.dataset.orig;
            }
        }
    },
    {
        id: 'door_soda_bottle',
        targetId: 'door-shelf-2',
        name: 'Door Bottom Shelf',
        hint: 'Look at the tall bottles in the door rack...',
        desc: 'A beverage was replaced with a Juice Carton! 🧃',
        apply() {
            const item = document.getElementById('door-s2-c1');
            if (item) {
                item.dataset.orig = item.textContent;
                item.textContent = '🧃';
            }
        },
        restore() {
            const item = document.getElementById('door-s2-c1');
            if (item && item.dataset.orig) {
                item.textContent = item.dataset.orig;
            }
        }
    },
    {
        id: 'cat_magnet_dog',
        targetId: 'magnet-cat',
        name: 'Cat Magnet',
        hint: 'Look closely at the fridge magnets on the front door...',
        desc: 'The Cat Magnet turned into a Dog Magnet! 🐶',
        apply(el) {
            el.dataset.orig = el.textContent;
            el.textContent = '🐶';
        },
        restore(el) {
            if (el.dataset.orig) el.textContent = el.dataset.orig;
        }
    },
    {
        id: 'fish_magnet_sushi',
        targetId: 'magnet-fish',
        name: 'Fish Magnet',
        hint: 'Check the door magnets! The fish got prepared...',
        desc: 'The Fish Magnet turned into delicious Sushi! 🍣',
        apply(el) {
            el.dataset.orig = el.textContent;
            el.textContent = '🍣';
        },
        restore(el) {
            if (el.dataset.orig) el.textContent = el.dataset.orig;
        }
    },
    {
        id: 'floor_cat_snack',
        targetId: 'floor-cat',
        name: 'Kitchen Cat',
        hint: 'Check outside the fridge! The cat is looking very satisfied...',
        desc: 'The floor cat stole a fish! 🐈🐟',
        apply() {
            const cat = document.getElementById('floor-cat-char');
            if (cat) {
                cat.dataset.orig = cat.textContent;
                cat.textContent = '😸🐟';
            }
        },
        restore() {
            const cat = document.getElementById('floor-cat-char');
            if (cat && cat.dataset.orig) {
                cat.textContent = cat.dataset.orig;
            }
        }
    }
];


// =========================================================================
// INITIALIZATION & EVENT BINDINGS
// =========================================================================

function initApp() {
    // Sound button initial state
    updateSoundButtonUI();

    // Setup interactive item clicks
    setupFridgeItemListeners();
    setupFridgeDoorDirectClick();
    setupShelfGame();
    setupPaintingGame();

    shelfGamesBtn.addEventListener('click', () => {
        setMode('classic');
        landingScreen.classList.remove('active');
        mainScreen.classList.add('active');
        focusShelfGames();
    });

    shelfGamesTopBtn.addEventListener('click', focusShelfGames);

    const paintingNavBtn = document.getElementById('painting-game-btn');
    const paintingTopBtn = document.getElementById('painting-game-top-btn');

    if (paintingNavBtn) {
        paintingNavBtn.addEventListener('click', () => {
            setMode('classic');
            landingScreen.classList.remove('active');
            mainScreen.classList.add('active');
            focusPaintingGame();
        });
    }

    if (paintingTopBtn) {
        paintingTopBtn.addEventListener('click', focusPaintingGame);
    }

    // Mode Toggle
    modeToggleBtn.addEventListener('click', toggleMode);

    // Enter Classic from landing
    enterBtn.addEventListener('click', () => {
        setMode('classic');
        landingScreen.classList.remove('active');
        mainScreen.classList.add('active');
        setDynamicText(`Welcome back.\nYou checked the fridge ${state.openCount} times last session.`);
    });

    // Start Game from landing
    startGameBtn.addEventListener('click', () => {
        setMode('game');
        landingScreen.classList.remove('active');
        mainScreen.classList.add('active');
        startNewGame();
    });

    // Sound Toggle
    soundBtn.addEventListener('click', () => {
        sounds.toggle();
        updateSoundButtonUI();
    });

    // Hint Button
    hintBtn.addEventListener('click', useHint);

    // Main action button (Open / Close in Classic mode, or Start / Next in Game mode)
    actionBtn.addEventListener('click', handleActionButton);

    // Spacebar shortcut for opening/closing fridge or triggering action
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            const anyModalOpen = document.querySelector('.modal:not(.hidden), .easel-modal:not(.hidden)');
            if (!anyModalOpen && mainScreen.classList.contains('active')) {
                e.preventDefault();
                actionBtn.click();
            }
        }
    });

    // Play again button on game over modal
    playAgainBtn.addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        startNewGame();
    });

    // Switch to classic from game over modal
    switchClassicBtn.addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        setMode('classic');
    });

    // Stats Modal
    statsBtn.addEventListener('click', openStatsModal);
    closeStatsBtn.addEventListener('click', () => statsModal.classList.add('hidden'));

    // Final Screen Handlers (Easter egg)
    finalActionBtn.addEventListener('click', () => {
        finalScreen.classList.add('hidden');
        ultimateJokeScreen.classList.remove('hidden');
    });

    jokeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            ultimateJokeScreen.classList.add('hidden');
            mainScreen.classList.add('active');
            state.openCount = 0;
            openCounterSpan.textContent = state.openCount;
            setDynamicText("“Welcome back for round two.”");
        });
    });

    // Initialize interactive floor elements (Chaya station, cat treats, yarn, gecko)
    setupInteractiveKitchenFloor();

    openCounterSpan.textContent = state.openCount;
}

function setupInteractiveKitchenFloor() {
    // 1. Interactive Cat Food Bowl (Feed Treats)
    const catBowl = document.getElementById('cat-bowl');
    const bowlTreats = document.getElementById('bowl-treats');
    const floorCatChar = document.getElementById('floor-cat-char');
    const treatsList = ['🐟', '🍤', '🥛', '🍗', '🥓', '🍣'];
    let treatsCount = 0;
    if (catBowl) {
        catBowl.addEventListener('click', () => {
            treatsCount++;
            sounds.playCatMunch();
            catBowl.style.transform = 'scale(1.2) rotate(4deg)';
            setTimeout(() => catBowl.style.transform = '', 220);

            const treat = treatsList[Math.floor(Math.random() * treatsList.length)];
            if (bowlTreats) {
                bowlTreats.innerHTML = `<span class="treat-particle">${treat}</span>`;
            }

            if (floorCatChar) {
                floorCatChar.textContent = '😸💖';
                floorCatChar.style.transform = 'translateY(-12px) scale(1.15)';
                setTimeout(() => {
                    floorCatChar.textContent = '🐈';
                    floorCatChar.style.transform = '';
                }, 900);
            }

            const rect = catBowl.getBoundingClientRect();
            spawnFloatingScore('💖 Nom!', rect.left + rect.width / 2, rect.top);
            waitingText.textContent = `Fed kitty a delicious ${treat}! Purrr ~`;
        });
    }

    // 2. Playable Rolling Yarn Ball
    const catBall = document.getElementById('cat-ball');
    if (catBall) {
        catBall.addEventListener('click', () => {
            sounds.playYarnRoll();
            catBall.classList.remove('rolling');
            void catBall.offsetWidth; // Trigger reflow
            catBall.classList.add('rolling');

            if (floorCatChar) {
                floorCatChar.textContent = '🐾🐈';
                setTimeout(() => floorCatChar.textContent = '🐈', 750);
            }

            waitingText.textContent = 'Kitty swats the bouncy yarn ball! 🧶🐾';
        });
    }

    // 3. Nostalgic Kerala Wall Gecko (Palli)
    const wallGecko = document.getElementById('wall-gecko');
    if (wallGecko) {
        wallGecko.addEventListener('click', () => {
            sounds.playGeckoChirp();
            wallGecko.classList.remove('scurrying');
            void wallGecko.offsetWidth;
            wallGecko.classList.add('scurrying');

            const geckoFortunes = [
                '“Tik-tik-tik! Palli says: Good things coming to your fridge! 🦎”',
                '“Tik-tik! Nostalgic Kerala kitchen lizard vibe unlocked! ✨”',
                '“The gecko approves of your snack choices. 🦎”'
            ];
            const quote = geckoFortunes[Math.floor(Math.random() * geckoFortunes.length)];
            waitingText.textContent = quote;
            showToast('🦎 KITCHEN GECKO', quote, 'Tik-tik');
        });
    }
}

function focusShelfGames() {
    const games = document.querySelectorAll('.pantry-game');
    games.forEach((game) => game.classList.remove('shelf-game-focus'));
    games.forEach((game) => game.classList.add('shelf-game-focus'));
    waitingText.textContent = 'Shelf games are glowing on the right!';

    setTimeout(() => {
        games.forEach((game) => game.classList.remove('shelf-game-focus'));
    }, 2600);
}

function focusPaintingGame() {
    const wallPicture = document.getElementById('wall-picture');
    if (!wallPicture) return;

    wallPicture.classList.remove('painting-game-focus');
    void wallPicture.offsetWidth; // Force CSS reflow to retrigger animation
    wallPicture.classList.add('painting-game-focus');

    sounds.playBrush();

    if (waitingText) {
        waitingText.textContent = 'Kerala Art Studio is glowing on the left!';
    }

    setTimeout(() => {
        wallPicture.classList.remove('painting-game-focus');
    }, 2600);
}

function updateSoundButtonUI() {
    soundBtn.textContent = sounds.enabled ? '🔊' : '🔇';
    soundBtn.title = sounds.enabled ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)';
}

function setMode(mode) {
    state.mode = mode;
    if (mode === 'game') {
        document.body.classList.add('mode-game');
        document.body.classList.remove('mode-classic');
        modeToggleBtn.textContent = '👀 Stare Mode';
        modeToggleBtn.classList.remove('classic-active');
        brandBadge.textContent = 'Spot The Difference';
        gameHud.classList.remove('hidden');
        classicHud.classList.add('hidden');
        phaseBanner.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
    } else {
        document.body.classList.add('mode-classic');
        document.body.classList.remove('mode-game');
        modeToggleBtn.textContent = '🎮 Game Mode';
        modeToggleBtn.classList.add('classic-active');
        brandBadge.textContent = 'Staring Mode';
        gameHud.classList.add('hidden');
        classicHud.classList.remove('hidden');
        phaseBanner.classList.add('hidden');
        hintBtn.classList.add('hidden');
        document.body.classList.remove('mode-find');
        actionBtn.disabled = false;
        actionBtn.textContent = state.isOpen ? 'CLOSE FRIDGE' : 'OPEN FRIDGE';
        state.phase = 'IDLE';
        waitingText.textContent = 'Entha moppeny veendum?';
        clearPhaseTimer();
    }
}

function toggleMode() {
    if (state.mode === 'game') {
        setMode('classic');
        if (state.isOpen) closeFridgeClassic();
    } else {
        setMode('game');
        startNewGame();
    }
}


// =========================================================================
// GAME LOOP ENGINE
// =========================================================================

function startNewGame() {
    state.round = 1;
    state.score = 0;
    state.streak = 0;
    state.lives = 3;
    state.hintsLeft = 2;
    state.usedDiffIndices = [];
    
    updateGameHud();
    startRound();
}

function updateGameHud() {
    hudRoundVal.textContent = state.round;
    hudScoreVal.textContent = state.score;
    hudStreakVal.textContent = `${state.streak}x 🔥`;
    
    // Lives display
    let hearts = '';
    for (let i = 0; i < 3; i++) {
        hearts += i < state.lives ? '❤️' : '🖤';
    }
    hudLives.textContent = hearts;

    // Hints display
    hintText.textContent = `Hint (${state.hintsLeft})`;
    hintBtn.disabled = state.hintsLeft <= 0 || state.phase !== 'FIND';
}

function startRound() {
    // Clear any previous difference
    if (state.currentDiff) {
        restoreCurrentDiff();
    }

    // Remove any lingering highlights
    clearItemHighlights();

    // Select a unique difference from the catalog
    state.currentDiff = selectRandomDifference();

    // Transition to Phase 1: MEMORIZE (5 seconds)
    enterPhaseMemorize();
}

function selectRandomDifference() {
    // If all used, reset cycle
    if (state.usedDiffIndices.length >= DIFFERENCE_CATALOG.length) {
        state.usedDiffIndices = [];
    }

    const availableIndices = [];
    for (let i = 0; i < DIFFERENCE_CATALOG.length; i++) {
        if (!state.usedDiffIndices.includes(i)) {
            availableIndices.push(i);
        }
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    state.usedDiffIndices.push(randomIndex);
    return DIFFERENCE_CATALOG[randomIndex];
}

// -------------------------------------------------------------------------
// PHASE 1: MEMORIZE (Fridge Opens, Player Studies Contents)
// -------------------------------------------------------------------------

function enterPhaseMemorize() {
    state.phase = 'MEMORIZE';
    document.body.classList.remove('mode-find');
    updateGameHud();

    // Open fridge door
    openFridgeVisual();
    sounds.playDoorOpen();

    // Duration: 5 seconds (slightly faster on higher rounds)
    const duration = Math.max(3.5, 5.5 - (state.round - 1) * 0.2);

    // Update Phase Banner
    phaseBanner.className = 'phase-banner phase-memorize';
    phaseIcon.textContent = '👀';
    phaseTitle.textContent = `Round ${state.round}: Memorize!`;
    phaseSubtitle.textContent = 'Study every item and shelf carefully before the door closes...';
    
    actionBtn.textContent = 'MEMORIZING...';
    actionBtn.disabled = true;
    waitingText.textContent = 'Memorize the items!';

    waitingText.textContent = `Round ${state.round}! Keep your eyes open!`;

    startPhaseTimer(duration, () => {
        enterPhaseClosing();
    });
}

// -------------------------------------------------------------------------
// PHASE 2: CLOSING & SHUFFLING (Fridge Shuts, Mystery Change is Applied)
// -------------------------------------------------------------------------

function enterPhaseClosing() {
    state.phase = 'CLOSING';
    clearPhaseTimer();

    // Close fridge door
    closeFridgeVisual();
    sounds.playDoorClose();

    // Update Banner
    phaseBanner.className = 'phase-banner phase-closing';
    phaseIcon.textContent = '🚪';
    phaseTitle.textContent = 'Shuffling the fridge...';
    phaseSubtitle.textContent = 'Did someone take a snack or swap an item? 🤔';
    phaseTimerNum.textContent = '...';
    phaseProgressBar.style.width = '100%';

    waitingText.textContent = 'Shuffling in progress...';
    waitingText.textContent = 'Shuffling in progress...';

    // Apply difference while door is fully closed
    setTimeout(() => {
        applyCurrentDiff();
    }, 900);

    // Wait 2.2 seconds for suspense, then reopen
    setTimeout(() => {
        enterPhaseFind();
    }, 2200);
}

// -------------------------------------------------------------------------
// PHASE 3: FIND THE DIFFERENCE (Fridge Reopens, Player Taps Difference)
// -------------------------------------------------------------------------

function enterPhaseFind() {
    state.phase = 'FIND';

    // Reopen fridge
    openFridgeVisual();
    sounds.playDoorOpen();

    // Enable inspection cursor & hover feedback
    document.body.classList.add('mode-find');
    updateGameHud();

    // 15 seconds detection timer
    const duration = 15;

    // Update Phase Banner
    phaseBanner.className = 'phase-banner phase-find';
    phaseIcon.textContent = '🔍';
    phaseTitle.textContent = 'SPOT THE DIFFERENCE!';
    phaseSubtitle.textContent = 'Tap on whatever shifted, changed, or sneaked in!';
    
    actionBtn.textContent = 'TAP WHAT CHANGED!';
    actionBtn.disabled = false;
    waitingText.textContent = 'Click the changed item before time expires!';

    waitingText.textContent = 'Onn nokkatte! What changed?';

    startPhaseTimer(duration, () => {
        // Time expired!
        handleRoundTimeout();
    });
}

// -------------------------------------------------------------------------
// PHASE TIMER & PROGRESS BAR
// -------------------------------------------------------------------------

function startPhaseTimer(durationSeconds, onComplete) {
    clearPhaseTimer();

    const startTime = Date.now();
    const endTime = startTime + durationSeconds * 1000;
    state.phaseTimeRemaining = durationSeconds;

    phaseTimerDisplay.classList.remove('urgent');

    state.phaseTimerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, (endTime - now) / 1000);
        state.phaseTimeRemaining = remaining;

        // UI text
        phaseTimerNum.textContent = `${Math.ceil(remaining)}s`;

        // Progress fill
        const pct = Math.max(0, Math.min(100, (remaining / durationSeconds) * 100));
        phaseProgressBar.style.width = `${pct}%`;

        // Urgency color in last 4 seconds of Find phase
        if (state.phase === 'FIND' && remaining <= 4.2) {
            phaseTimerDisplay.classList.add('urgent');
            if (Math.floor(remaining) !== Math.floor(remaining + 0.1)) {
                sounds.playTick();
            }
        }

        if (remaining <= 0) {
            clearPhaseTimer();
            if (onComplete) onComplete();
        }
    }, 100);
}

function clearPhaseTimer() {
    if (state.phaseTimerInterval) {
        clearInterval(state.phaseTimerInterval);
        state.phaseTimerInterval = null;
    }
}


// =========================================================================
// INTERACTION & HITBOX DETECTION
// =========================================================================

function setupShelfGame() {
    const items = document.querySelectorAll('.pantry-item');
    const slots = document.querySelectorAll('.pantry-slot');
    const result = document.getElementById('pantry-result');
    const nextButton = document.getElementById('pantry-next');
    const correctSlots = {
        bread: 'top-left',
        milk: 'top-right',
        veggies: 'middle',
        pickle: 'bottom'
    };
    let selectedItem = null;
    let placedItems = 0;
    const slotLabels = {
        'top-left': 'BREAD',
        'top-right': 'MILK',
        middle: 'VEGGIES',
        bottom: 'PICKLES'
    };

    function resetPantry() {
        selectedItem = null;
        items.forEach((item) => {
            item.disabled = false;
            item.classList.remove('pantry-selected');
        });
        slots.forEach((slot) => {
            slot.textContent = slotLabels[slot.dataset.slot];
            slot.classList.remove('pantry-correct', 'pantry-wrong');
        });
        placedItems = 0;
        result.textContent = 'SELECT AN ITEM';
        nextButton.classList.add('hidden');
    }

    result.addEventListener('click', resetPantry);
    nextButton.addEventListener('click', resetPantry);

    items.forEach((item) => {
        item.addEventListener('click', () => {
            items.forEach((otherItem) => otherItem.classList.remove('pantry-selected'));
            selectedItem = item;
            item.classList.add('pantry-selected');
            result.textContent = 'NOW CHOOSE A SHELF';
        });

        item.addEventListener('dragstart', (event) => {
            selectedItem = item;
            event.dataTransfer.setData('text/plain', item.dataset.item);
            item.classList.add('pantry-selected');
        });
    });

    slots.forEach((slot) => {
        slot.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        slot.addEventListener('click', () => {
            placeSelectedItem(slot);
        });

        slot.addEventListener('drop', (event) => {
            event.preventDefault();
            placeSelectedItem(slot);
        });
    });

    function placeSelectedItem(slot) {
        if (!selectedItem) {
            result.textContent = 'SELECT OR DRAG AN ITEM FIRST';
            return;
        }

            if (correctSlots[selectedItem.dataset.item] === slot.dataset.slot) {
                slot.textContent = `${selectedItem.textContent} READY`;
                slot.classList.add('pantry-correct');
                selectedItem.disabled = true;
                selectedItem.classList.remove('pantry-selected');
                selectedItem = null;
                placedItems++;
                if (placedItems === 4) {
                    result.textContent = 'PANTRY PERFECT!';
                    nextButton.classList.remove('hidden');
                } else {
                    result.textContent = `${placedItems}/4 PLACED`;
                }
            } else {
                slot.classList.add('pantry-wrong');
                result.textContent = 'TRY A DIFFERENT SHELF';
                setTimeout(() => slot.classList.remove('pantry-wrong'), 350);
            }
    }
}

// =========================================================================
// KERALA ART STUDIO & PAINTING GAME
// =========================================================================

function setupPaintingGame() {
    const wallPicture = document.getElementById('wall-picture');
    const canvasArt = document.getElementById('painting-canvas-art');
    const canvasFrame = document.getElementById('painting-canvas-frame');
    const sceneName = document.getElementById('painting-scene-name');
    const sceneNextBtn = document.getElementById('painting-scene-next-btn');
    const easelOpenBtn = document.getElementById('painting-easel-open-btn');
    const stampLayer = document.getElementById('painting-stamp-layer');
    const completeBanner = document.getElementById('painting-complete-banner');
    const tabColor = document.getElementById('paint-mode-color');
    const tabStamp = document.getElementById('paint-mode-stamp');
    const undoBtn = document.getElementById('painting-undo-btn');
    const resetBtn = document.getElementById('painting-reset-btn');
    const paletteContainer = document.getElementById('painting-palette');
    const stampBarContainer = document.getElementById('painting-stamp-bar');
    const palettePots = document.querySelectorAll('.palette-pot');
    const stampBtns = document.querySelectorAll('.stamp-btn');
    const statusMsg = document.getElementById('painting-status-msg');
    const progressBar = document.getElementById('painting-progress-bar');

    // Easel Studio Modal elements
    const easelModal = document.getElementById('painting-easel-modal');
    const closeEaselBtn = document.getElementById('close-easel-btn');
    const easelBackdrop = document.getElementById('easel-modal-backdrop');
    const easelCanvas = document.getElementById('easel-free-canvas');
    const easelColorBtns = document.querySelectorAll('.easel-color-btn');
    const easelBrushBtns = document.querySelectorAll('.easel-brush-size');
    const easelStampBtns = document.querySelectorAll('.easel-stamp-choice');
    const easelClearBtn = document.getElementById('easel-clear-btn');
    const easelUndoBtn = document.getElementById('easel-undo-btn');
    const easelSaveBtn = document.getElementById('easel-save-to-wall-btn');

    if (!wallPicture || !canvasArt) return;

    // 3 Handcrafted Kerala Art Scenes
    const scenes = [
        {
            id: 'sunset',
            name: 'Sunset Backwaters',
            svg: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                <path class="paint-region" data-region="1" data-target="#f43f5e" fill="#ede8df" d="M 0,0 L 200,0 L 200,75 C 160,72 130,76 90,73 C 50,71 20,74 0,72 Z" />
                <circle class="paint-region" data-region="2" data-target="#fbbf24" fill="#dfd8cb" cx="100" cy="46" r="22" />
                <path class="paint-region" data-region="3" data-target="#10b981" fill="#c9c2b4" d="M 0,72 Q 18,52 14,28 Q 24,38 32,32 Q 22,46 25,73 Z M 16,34 Q 8,24 0,26 Q 8,36 16,34 Z M 168,74 Q 175,54 186,30 Q 192,42 200,36 Q 190,52 188,74 Z M 186,36 Q 174,26 164,28 Q 176,38 186,36 Z M 0,68 Q 25,62 50,70 Q 25,76 0,74 Z" />
                <path class="paint-region" data-region="4" data-target="#0ea5e9" fill="#dbd5c9" d="M 0,72 C 35,74 70,71 105,74 C 145,77 175,72 200,74 L 200,130 L 0,130 Z" />
                <path d="M 15,92 Q 35,89 55,92 M 80,105 Q 110,102 140,105 M 30,118 Q 60,116 90,118 M 130,88 Q 155,86 180,88" stroke="#ffffff77" stroke-width="1.5" stroke-linecap="round" fill="none" />
                <path class="paint-region" data-region="5" data-target="#854d0e" fill="#bab3a3" d="M 72,92 C 60,92 56,86 52,83 C 78,81 125,81 146,83 C 142,86 138,92 126,92 Z M 65,82 C 65,72 74,68 98,68 C 122,68 132,72 132,82 Z" />
                <rect x="80" y="73" width="8" height="6" rx="2" fill="#fff" opacity="0.85" />
                <rect x="94" y="73" width="8" height="6" rx="2" fill="#fff" opacity="0.85" />
                <rect x="108" y="73" width="8" height="6" rx="2" fill="#fff" opacity="0.85" />
                <g class="region-label-group" data-label="1"><circle cx="28" cy="16" r="7.5" class="region-label-bg"/><text x="28" y="16" class="region-label">1</text></g>
                <g class="region-label-group" data-label="2"><circle cx="100" cy="46" r="7.5" class="region-label-bg"/><text x="100" y="46" class="region-label">2</text></g>
                <g class="region-label-group" data-label="3"><circle cx="36" cy="48" r="7.5" class="region-label-bg"/><text x="36" y="48" class="region-label">3</text></g>
                <g class="region-label-group" data-label="4"><circle cx="155" cy="110" r="7.5" class="region-label-bg"/><text x="155" y="110" class="region-label">4</text></g>
                <g class="region-label-group" data-label="5"><circle cx="98" cy="84" r="7.5" class="region-label-bg"/><text x="98" y="84" class="region-label">5</text></g>
            </svg>`
        },
        {
            id: 'elephant',
            name: 'Pooram Tusker',
            svg: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                <path class="paint-region" data-region="1" data-target="#f43f5e" fill="#ede8df" d="M 0,0 L 200,0 L 200,130 L 0,130 Z" />
                <path class="paint-region" data-region="3" data-target="#10b981" fill="#c9c2b4" d="M 0,85 C 20,70 50,75 70,90 L 70,130 L 0,130 Z M 15,35 C 15,20 45,15 65,25 C 50,40 30,42 15,35 Z M 135,28 C 135,16 160,12 182,20 C 170,35 150,36 135,28 Z" />
                <path class="paint-region" data-region="4" data-target="#0ea5e9" fill="#dbd5c9" d="M 0,95 Q 100,85 200,95 L 200,130 L 0,130 Z" />
                <path class="paint-region" data-region="5" data-target="#854d0e" fill="#bab3a3" d="M 72,118 L 72,82 C 60,65 65,42 90,38 C 122,38 135,55 135,78 L 135,118 C 128,122 118,116 114,106 L 112,85 C 105,82 98,82 92,85 L 90,108 C 85,118 78,122 72,118 Z M 70,68 C 55,75 52,90 58,102 C 64,105 68,98 65,90 C 62,82 66,74 74,72 Z" />
                <path d="M 68,78 C 56,84 54,94 58,96 C 62,94 65,88 72,82 Z" fill="#fff" stroke="#451a03" stroke-width="0.8" />
                <circle cx="82" cy="54" r="2.5" fill="#451a03" />
                <path class="paint-region" data-region="2" data-target="#fbbf24" fill="#dfd8cb" d="M 82,42 C 92,38 106,38 114,44 C 112,58 105,74 98,78 C 92,74 85,58 82,42 Z" />
                <circle cx="98" cy="80" r="2" fill="#ef4444" />
                <circle cx="88" cy="74" r="1.8" fill="#ef4444" />
                <circle cx="108" cy="74" r="1.8" fill="#ef4444" />
                <g class="region-label-group" data-label="1"><circle cx="100" cy="18" r="7.5" class="region-label-bg"/><text x="100" y="18" class="region-label">1</text></g>
                <g class="region-label-group" data-label="2"><circle cx="98" cy="56" r="7.5" class="region-label-bg"/><text x="98" y="56" class="region-label">2</text></g>
                <g class="region-label-group" data-label="3"><circle cx="40" cy="28" r="7.5" class="region-label-bg"/><text x="40" y="28" class="region-label">3</text></g>
                <g class="region-label-group" data-label="4"><circle cx="160" cy="112" r="7.5" class="region-label-bg"/><text x="160" y="112" class="region-label">4</text></g>
                <g class="region-label-group" data-label="5"><circle cx="120" cy="88" r="7.5" class="region-label-bg"/><text x="120" y="88" class="region-label">5</text></g>
            </svg>`
        },
        {
            id: 'cat-chai',
            name: 'Chai & Cat',
            svg: `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                <path class="paint-region" data-region="1" data-target="#f43f5e" fill="#ede8df" d="M 0,0 L 200,0 L 200,80 L 0,80 Z" />
                <polygon points="120,0 175,0 200,80 145,80" fill="#ffffff33" />
                <path class="paint-region" data-region="4" data-target="#0ea5e9" fill="#dbd5c9" d="M 0,80 L 200,80 L 200,130 L 0,130 Z" />
                <path class="paint-region" data-region="3" data-target="#10b981" fill="#c9c2b4" d="M 25,98 C 22,86 48,82 78,82 C 105,82 115,92 110,105 C 105,116 65,118 35,115 C 26,114 26,106 25,98 Z" />
                <path d="M 28,98 Q 65,95 106,98" stroke="#ffffff55" stroke-width="1.2" fill="none" />
                <path class="paint-region" data-region="2" data-target="#fbbf24" fill="#dfd8cb" d="M 52,72 L 56,100 C 56,104 74,104 74,100 L 78,72 Z" />
                <path d="M 60,66 Q 57,56 64,50 M 68,67 Q 73,58 69,48" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8" />
                <path class="paint-region" data-region="5" data-target="#854d0e" fill="#bab3a3" d="M 120,108 C 112,106 110,92 120,84 C 132,76 172,76 182,85 C 190,92 190,105 180,108 C 170,111 128,111 120,108 Z" />
                <circle cx="126" cy="85" r="11" fill="#bab3a3" />
                <polygon points="118,78 114,68 124,74" fill="#854d0e" />
                <polygon points="128,74 136,68 134,78" fill="#854d0e" />
                <path d="M 120,85 Q 123,88 126,85 Q 129,88 132,85" stroke="#451a03" stroke-width="1" fill="none" />
                <g class="region-label-group" data-label="1"><circle cx="35" cy="30" r="7.5" class="region-label-bg"/><text x="35" y="30" class="region-label">1</text></g>
                <g class="region-label-group" data-label="2"><circle cx="65" cy="86" r="7.5" class="region-label-bg"/><text x="65" y="86" class="region-label">2</text></g>
                <g class="region-label-group" data-label="3"><circle cx="95" cy="102" r="7.5" class="region-label-bg"/><text x="95" y="102" class="region-label">3</text></g>
                <g class="region-label-group" data-label="4"><circle cx="170" cy="118" r="7.5" class="region-label-bg"/><text x="170" y="118" class="region-label">4</text></g>
                <g class="region-label-group" data-label="5"><circle cx="155" cy="94" r="7.5" class="region-label-bg"/><text x="155" y="94" class="region-label">5</text></g>
            </svg>`
        }
    ];

    let currentSceneIndex = 0;
    let activeMode = 'color';
    let activeColor = '#f43f5e';
    let activeColorId = '1';
    let activeStamp = '🌴';
    let filledRegions = new Set();
    let history = [];

    function loadScene(index) {
        currentSceneIndex = index;
        const scene = scenes[currentSceneIndex];
        sceneName.textContent = scene.name;
        canvasArt.innerHTML = scene.svg;
        stampLayer.innerHTML = '';
        filledRegions.clear();
        history = [];
        progressBar.style.width = '0%';
        completeBanner.classList.add('hidden');
        statusMsg.textContent = 'Pick color (1-5) & tap matching region';

        // Attach listeners to regions
        const regions = canvasArt.querySelectorAll('.paint-region');
        regions.forEach(region => {
            region.addEventListener('click', (e) => {
                e.stopPropagation();
                handleRegionClick(region, e);
            });
        });
    }

    function handleRegionClick(region, event) {
        if (activeMode === 'color') {
            const regionId = region.dataset.region;
            const prevFill = region.getAttribute('fill');

            region.setAttribute('fill', activeColor);
            region.classList.remove('region-pulse');
            void region.offsetWidth;
            region.classList.add('region-pulse', 'region-filled');

            const labelGroup = canvasArt.querySelector(`[data-label="${regionId}"]`);
            if (labelGroup) {
                labelGroup.style.opacity = '0';
            }

            filledRegions.add(regionId);
            progressBar.style.width = `${(filledRegions.size / 5) * 100}%`;
            sounds.playColorPop();

            history.push({
                type: 'paint',
                region,
                prevFill,
                regionId,
                labelGroup
            });

            statusMsg.textContent = `Colored section (${regionId})! [${filledRegions.size}/5]`;

            if (filledRegions.size === 5) {
                sounds.playPaintingComplete();
                completeBanner.classList.remove('hidden');
                statusMsg.textContent = '🌟 Masterpiece Restored! Tap Next to continue!';
                if (state.mode === 'game') {
                    state.score += 200;
                    if (hudScoreVal) hudScoreVal.textContent = state.score;
                }
            }
        } else if (activeMode === 'stamp') {
            placeStamp(event);
        }
    }

    function placeStamp(event) {
        const rect = canvasFrame.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const stampEl = document.createElement('span');
        stampEl.className = 'painting-placed-stamp';
        stampEl.textContent = activeStamp;
        stampEl.style.left = `${x}px`;
        stampEl.style.top = `${y}px`;
        stampLayer.appendChild(stampEl);

        sounds.playBrush();
        history.push({
            type: 'stamp',
            element: stampEl
        });
        statusMsg.textContent = `Placed ${activeStamp}! Tap more or switch to Color.`;
    }

    // Canvas Frame click in Stamp mode (even if outside SVG regions)
    canvasFrame.addEventListener('click', (e) => {
        if (activeMode === 'stamp') {
            placeStamp(e);
        }
    });

    // Color Pot selection
    palettePots.forEach(pot => {
        pot.addEventListener('click', () => {
            palettePots.forEach(p => p.classList.remove('active'));
            pot.classList.add('active');
            activeColor = pot.dataset.color;
            activeColorId = pot.dataset.colorId;
            setModeUI('color');
            statusMsg.textContent = `Selected color (${activeColorId}) — tap region (${activeColorId})!`;
            sounds.playBrush();
        });
    });

    // Stamp Selection
    stampBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            stampBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeStamp = btn.dataset.stamp;
            setModeUI('stamp');
            statusMsg.textContent = `Selected stamp ${activeStamp} — tap canvas to place!`;
            sounds.playBrush();
        });
    });

    function setModeUI(mode) {
        activeMode = mode;
        if (mode === 'color') {
            tabColor.classList.add('active');
            tabStamp.classList.remove('active');
            paletteContainer.classList.remove('hidden');
            stampBarContainer.classList.add('hidden');
        } else {
            tabStamp.classList.add('active');
            tabColor.classList.remove('active');
            stampBarContainer.classList.remove('hidden');
            paletteContainer.classList.add('hidden');
        }
    }

    tabColor.addEventListener('click', () => {
        setModeUI('color');
        statusMsg.textContent = `Color mode active — select a color pot (1-5)`;
        sounds.playBrush();
    });

    tabStamp.addEventListener('click', () => {
        setModeUI('stamp');
        statusMsg.textContent = `Stamp mode active — tap canvas to place ${activeStamp}`;
        sounds.playBrush();
    });

    // Undo action
    undoBtn.addEventListener('click', () => {
        if (history.length === 0) {
            statusMsg.textContent = 'Nothing to undo!';
            return;
        }
        const last = history.pop();
        if (last.type === 'paint') {
            last.region.setAttribute('fill', last.prevFill);
            last.region.classList.remove('region-filled');
            if (last.labelGroup) {
                last.labelGroup.style.opacity = '1';
            }
            filledRegions.delete(last.regionId);
            progressBar.style.width = `${(filledRegions.size / 5) * 100}%`;
            completeBanner.classList.add('hidden');
            statusMsg.textContent = `Reverted section (${last.regionId})`;
        } else if (last.type === 'stamp') {
            if (last.element && last.element.parentNode) {
                last.element.parentNode.removeChild(last.element);
            }
            statusMsg.textContent = 'Removed last stamp';
        }
        sounds.playBrush();
    });

    // Reset action
    resetBtn.addEventListener('click', () => {
        loadScene(currentSceneIndex);
        sounds.playBrush();
        statusMsg.textContent = 'Painting reset to fresh canvas!';
    });

    // Next scene action
    sceneNextBtn.addEventListener('click', () => {
        loadScene((currentSceneIndex + 1) % scenes.length);
        sounds.playBrush();
    });

    // =========================================================
    // EASEL STUDIO MODAL CONTROLS
    // =========================================================
    let easelCtx = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let easelColor = '#f43f5e';
    let easelBrushSize = 4;
    let easelStamp = null;
    let easelHistory = [];

    function initEaselCanvas() {
        if (!easelCanvas) return;
        easelCtx = easelCanvas.getContext('2d');
        easelCtx.fillStyle = '#fffdf5';
        easelCtx.fillRect(0, 0, easelCanvas.width, easelCanvas.height);
        easelHistory = [easelCtx.getImageData(0, 0, easelCanvas.width, easelCanvas.height)];
    }

    if (easelOpenBtn && easelModal) {
        easelOpenBtn.addEventListener('click', () => {
            easelModal.classList.remove('hidden');
            if (!easelCtx) initEaselCanvas();
            sounds.playBrush();
        });
    }

    function closeEasel() {
        if (easelModal) easelModal.classList.add('hidden');
    }

    if (closeEaselBtn) closeEaselBtn.addEventListener('click', closeEasel);
    if (easelBackdrop) easelBackdrop.addEventListener('click', closeEasel);

    // Easel Color buttons
    easelColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            easelColorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            easelColor = btn.dataset.color;
            easelStamp = null;
            easelStampBtns.forEach(b => b.classList.remove('active'));
            sounds.playBrush();
        });
    });

    // Easel Brush sizes
    easelBrushBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            easelBrushBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            easelBrushSize = parseInt(btn.dataset.size, 10) || 4;
            easelStamp = null;
            easelStampBtns.forEach(b => b.classList.remove('active'));
            sounds.playBrush();
        });
    });

    // Easel Stamps
    easelStampBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            easelStampBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            easelStamp = btn.dataset.stamp;
            sounds.playBrush();
        });
    });

    // Easel drawing handlers
    if (easelCanvas) {
        function getCanvasCoords(e) {
            const rect = easelCanvas.getBoundingClientRect();
            const scaleX = easelCanvas.width / rect.width;
            const scaleY = easelCanvas.height / rect.height;
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        easelCanvas.addEventListener('pointerdown', (e) => {
            if (!easelCtx) return;
            const coords = getCanvasCoords(e);
            if (easelStamp) {
                // Stamp directly
                easelCtx.font = '32px sans-serif';
                easelCtx.textAlign = 'center';
                easelCtx.textBaseline = 'middle';
                easelCtx.fillText(easelStamp, coords.x, coords.y);
                sounds.playBrush();
                easelHistory.push(easelCtx.getImageData(0, 0, easelCanvas.width, easelCanvas.height));
                return;
            }

            isDrawing = true;
            lastX = coords.x;
            lastY = coords.y;
            easelCtx.beginPath();
            easelCtx.arc(lastX, lastY, easelBrushSize / 2, 0, Math.PI * 2);
            easelCtx.fillStyle = easelColor;
            easelCtx.fill();
        });

        easelCanvas.addEventListener('pointermove', (e) => {
            if (!isDrawing || !easelCtx || easelStamp) return;
            const coords = getCanvasCoords(e);
            easelCtx.beginPath();
            easelCtx.moveTo(lastX, lastY);
            easelCtx.lineTo(coords.x, coords.y);
            easelCtx.strokeStyle = easelColor;
            easelCtx.lineWidth = easelBrushSize;
            easelCtx.lineCap = 'round';
            easelCtx.lineJoin = 'round';
            easelCtx.stroke();
            lastX = coords.x;
            lastY = coords.y;
        });

        const stopDrawing = () => {
            if (isDrawing && easelCtx) {
                isDrawing = false;
                easelHistory.push(easelCtx.getImageData(0, 0, easelCanvas.width, easelCanvas.height));
                if (easelHistory.length > 20) easelHistory.shift();
            }
        };

        easelCanvas.addEventListener('pointerup', stopDrawing);
        easelCanvas.addEventListener('pointercancel', stopDrawing);
        easelCanvas.addEventListener('pointerleave', stopDrawing);
    }

    if (easelClearBtn) {
        easelClearBtn.addEventListener('click', () => {
            if (!easelCtx) return;
            easelCtx.fillStyle = '#fffdf5';
            easelCtx.fillRect(0, 0, easelCanvas.width, easelCanvas.height);
            easelHistory.push(easelCtx.getImageData(0, 0, easelCanvas.width, easelCanvas.height));
            sounds.playBrush();
        });
    }

    if (easelUndoBtn) {
        easelUndoBtn.addEventListener('click', () => {
            if (!easelCtx || easelHistory.length <= 1) return;
            easelHistory.pop();
            const prev = easelHistory[easelHistory.length - 1];
            easelCtx.putImageData(prev, 0, 0);
            sounds.playBrush();
        });
    }

    if (easelSaveBtn) {
        easelSaveBtn.addEventListener('click', () => {
            if (!easelCanvas) return;
            const dataUrl = easelCanvas.toDataURL();
            canvasArt.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" alt="Framed Artwork" />`;
            stampLayer.innerHTML = '';
            completeBanner.classList.add('hidden');
            sceneName.textContent = 'My Kitchen Easel Masterpiece';
            statusMsg.textContent = '🖼️ Your masterpiece is proudly framed on the wall!';
            closeEasel();
            sounds.playPaintingComplete();
            focusPaintingGame();
        });
    }

    // Initialize first scene
    loadScene(0);
}

function setupFridgeItemListeners() {
    const items = document.querySelectorAll('.fridge-item');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            handleItemClick(item, e);
        });
    });
}

function handleItemClick(item, event) {
    // In Classic mode, items have cute easter egg reactions
    if (state.mode === 'classic') {
        handleClassicItemClick(item);
        return;
    }

    // Only active during Phase 3 (FIND)
    if (state.phase !== 'FIND') return;

    const clickedId = item.dataset.itemId;
    const targetId = state.currentDiff.targetId;

    if (clickedId === targetId) {
        // CORRECT GUESS!
        handleCorrectGuess(item, event);
    } else {
        // WRONG GUESS!
        handleWrongGuess(item, event);
    }
}

function handleCorrectGuess(item, event) {
    clearPhaseTimer();
    state.phase = 'ROUND_END';
    document.body.classList.remove('mode-find');

    sounds.playCorrect();

    // Celebration animation on item
    item.classList.add('item-correct');

    // Score calculation
    const basePoints = 100;
    const timeBonus = Math.floor(state.phaseTimeRemaining * 10);
    const streakBonus = state.streak * 25;
    const earnedPoints = basePoints + timeBonus + streakBonus;

    state.score += earnedPoints;
    state.streak++;
    if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak;
        localStorage.setItem('fridge_bestStreak', state.bestStreak);
    }
    if (state.score > state.highScore) {
        state.highScore = state.score;
        localStorage.setItem('fridge_highScore', state.highScore);
    }

    updateGameHud();

    // Floating score animation
    const rect = item.getBoundingClientRect();
    const clickX = event ? event.clientX : rect.left + rect.width / 2;
    const clickY = event ? event.clientY : rect.top + rect.height / 2;
    spawnFloatingScore(`+${earnedPoints}`, clickX, clickY);
    spawnConfetti(clickX, clickY);

    // Toast notification with explanation
    showToast('✨ SPOT ON!', state.currentDiff.desc, `+${earnedPoints}`);

    waitingText.textContent = `Nannaayi! ${state.currentDiff.name} changed!`;
    waitingText.textContent = 'Next round loading...';

    // Delay, then advance to next round
    setTimeout(() => {
        item.classList.remove('item-correct');
        state.round++;
        startRound();
    }, 2400);
}

function handleWrongGuess(item, event) {
    sounds.playWrong();

    // Wobble shake on clicked item
    item.classList.add('item-wrong');
    setTimeout(() => item.classList.remove('item-wrong'), 450);

    // Spawn floating wrong indicator
    const rect = item.getBoundingClientRect();
    const clickX = event ? event.clientX : rect.left + rect.width / 2;
    const clickY = event ? event.clientY : rect.top + rect.height / 2;
    spawnWrongIndicator('❌ No change here!', clickX, clickY);

    // Deduct life
    state.lives--;
    state.streak = 0;
    updateGameHud();

    waitingText.textContent = "Ayyooo! That didn't change!";

    if (state.lives <= 0) {
        // GAME OVER
        handleGameOver();
    }
}

function handleRoundTimeout() {
    sounds.playWrong();
    clearPhaseTimer();
    state.phase = 'ROUND_END';
    document.body.classList.remove('mode-find');

    // Reveal correct item
    revealTargetItem();

    // Deduct life
    state.lives--;
    state.streak = 0;
    updateGameHud();

    showToast('⌛ TIME’S UP!', `The difference was: ${state.currentDiff.desc}`, '0');
    waitingText.textContent = 'Time ran out! Look where the glow is!';

    if (state.lives <= 0) {
        setTimeout(handleGameOver, 2000);
    } else {
        setTimeout(() => {
            clearItemHighlights();
            state.round++;
            startRound();
        }, 3200);
    }
}

function handleGameOver() {
    clearPhaseTimer();
    sounds.playGameOver();
    revealTargetItem();

    finalRoundsVal.textContent = state.round - 1;
    finalScoreVal.textContent = state.score;
    finalStreakVal.textContent = `${state.bestStreak}x 🔥`;

    // Humorous rank
    let rank = 'Goldfish Brain 🐟';
    if (state.round >= 15) rank = 'Elephant Memory 🐘';
    else if (state.round >= 10) rank = 'Fridge Detective 🕵️';
    else if (state.round >= 6) rank = 'Midnight Snacker 🥪';
    else if (state.round >= 3) rank = 'Curious Vibey Guy 🌿';
    finalRankVal.textContent = rank;

    setTimeout(() => {
        gameOverModal.classList.remove('hidden');
    }, 1500);
}

// -------------------------------------------------------------------------
// HINTS & REVEALS
// -------------------------------------------------------------------------

function useHint() {
    if (state.hintsLeft <= 0 || state.phase !== 'FIND') return;

    state.hintsLeft--;
    updateGameHud();
    sounds.playHint();

    revealTargetItem();

    // Clue text in thought bubble
    waitingText.textContent = `Hint: ${state.currentDiff.hint}`;
    showToast('💡 HINT ACTIVATED', state.currentDiff.hint, '🔎');
}

function revealTargetItem() {
    if (!state.currentDiff) return;
    const targetEl = document.querySelector(`[data-item-id="${state.currentDiff.targetId}"]`);
    if (targetEl) {
        targetEl.classList.add('item-revealed');
    }
}

function clearItemHighlights() {
    document.querySelectorAll('.item-revealed, .item-correct, .item-wrong').forEach(el => {
        el.classList.remove('item-revealed', 'item-correct', 'item-wrong');
    });
}

function applyCurrentDiff() {
    if (!state.currentDiff) return;
    const targetEl = document.querySelector(`[data-item-id="${state.currentDiff.targetId}"]`);
    if (targetEl && state.currentDiff.apply) {
        state.currentDiff.apply(targetEl);
    }
}

function restoreCurrentDiff() {
    if (!state.currentDiff) return;
    const targetEl = document.querySelector(`[data-item-id="${state.currentDiff.targetId}"]`);
    if (targetEl && state.currentDiff.restore) {
        state.currentDiff.restore(targetEl);
    }
}


// =========================================================================
// VISUAL FX & FLOATING POPUPS
// =========================================================================

function spawnFloatingScore(text, x, y) {
    const el = document.createElement('div');
    el.className = 'score-flyup';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    fxLayer.appendChild(el);

    setTimeout(() => el.remove(), 1000);
}

function spawnWrongIndicator(text, x, y) {
    const el = document.createElement('div');
    el.className = 'wrong-indicator';
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    fxLayer.appendChild(el);

    setTimeout(() => el.remove(), 800);
}

function spawnConfetti(x, y) {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];
    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-particle';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 80;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        const rot = (Math.random() * 360) + 'deg';

        p.style.setProperty('--dx', `${dx}px`);
        p.style.setProperty('--dy', `${dy}px`);
        p.style.setProperty('--rot', rot);

        fxLayer.appendChild(p);
        setTimeout(() => p.remove(), 900);
    }
}

function showToast(title, msg, points) {
    toastTitle.textContent = title;
    toastMsg.textContent = msg;
    toastPoints.textContent = points;

    roundToast.classList.remove('hidden');

    setTimeout(() => {
        roundToast.classList.add('hidden');
    }, 3000);
}


// =========================================================================
// FRIDGE OPEN / CLOSE PHYSICAL BEHAVIOR
// =========================================================================

function openFridgeVisual() {
    state.isOpen = true;
    fridge.classList.remove('closed');
    fridge.classList.add('open');
}

function closeFridgeVisual() {
    state.isOpen = false;
    fridge.classList.remove('open');
    fridge.classList.add('closed');
}

function handleActionButton() {
    if (state.mode === 'classic') {
        if (!state.isOpen) {
            openFridgeClassic();
        } else {
            closeFridgeClassic();
        }
    } else {
        // Game mode
        if (state.phase === 'IDLE' || state.phase === 'ROUND_END') {
            startRound();
        }
    }
}

function openFridgeClassic() {
    openFridgeVisual();
    sounds.playDoorOpen();

    state.openCount++;
    localStorage.setItem('fridge_openCount', state.openCount);
    if (openCounterSpan) openCounterSpan.textContent = state.openCount;
    actionBtn.textContent = 'CLOSE FRIDGE';
    actionBtn.disabled = false;

    // Humorous commentary progression
    updateClassicOpenMessages();

    if (state.openCount === 35) {
        setTimeout(triggerFinalReveal, 1500);
    }
}

function closeFridgeClassic() {
    closeFridgeVisual();
    sounds.playDoorClose();

    state.closeCount++;
    localStorage.setItem('fridge_closeCount', state.closeCount);
    if (openCounterSpan) openCounterSpan.textContent = state.openCount;
    actionBtn.textContent = 'OPEN FRIDGE';
    actionBtn.disabled = false;

    // Psychological prompt
    triggerClassicPostCloseMessages();
}

function setupFridgeDoorDirectClick() {
    const door = document.querySelector('.fridge-door');
    const handle = document.querySelector('.door-handle');

    if (door) {
        door.addEventListener('click', (e) => {
            if (state.mode === 'classic') {
                e.stopPropagation();
                handleActionButton();
            }
        });
    }

    if (handle) {
        handle.addEventListener('click', (e) => {
            if (state.mode === 'classic') {
                e.stopPropagation();
                handleActionButton();
            }
        });
    }
}

function updateClassicOpenMessages() {
    let msg = "“Maybe there’s something good.”";
    if (state.openCount === 3) msg = "“Nothing yet.”";
    else if (state.openCount === 5) msg = "“You already checked.”";
    else if (state.openCount === 10) msg = "“You checked this fridge 10 times.”";
    else if (state.openCount === 13) msg = "“Why 13?” (Easter Egg unlocked)";
    else if (state.openCount === 20) msg = "“You know these leftovers better than anyone.”";
    else if (state.openCount === 30) msg = "“Are you expecting new food to spawn?”";
    else if (state.openCount >= 50) msg = "“This refrigerator has become your personality.”";

    setDynamicText(msg);
}

function triggerClassicPostCloseMessages() {
    const messages = [
        "“Maybe something changed.”",
        "“You could check again.”",
        "“Probably nothing.”",
        "“Did you remember what was inside?”",
        "“Just checking.”",
        "“Onn nokkatte...”"
    ];

    if (Math.random() < 0.6) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setTimeout(() => {
            if (!state.isOpen && state.mode === 'classic') setDynamicText(randomMsg);
        }, 1800);
    }
}

function handleClassicItemClick(item) {
    const title = item.getAttribute('title') || 'This item';
    waitingText.textContent = `Still checking ${title}?`;
    item.style.transform = 'scale(1.15) rotate(5deg)';
    setTimeout(() => item.style.transform = '', 300);
}

function setDynamicText(text) {
    dynamicMessage.style.opacity = 0;
    setTimeout(() => {
        dynamicMessage.textContent = text;
        dynamicMessage.style.opacity = 1;
    }, 200);
}

function openStatsModal() {
    document.getElementById('stat-opened').textContent = state.openCount;
    document.getElementById('stat-closed').textContent = state.closeCount;
    document.getElementById('stat-food').textContent = "0";
    document.getElementById('stat-new-food').textContent = state.highScore > 0 ? `${state.highScore} pts` : "0";

    const mins = String(Math.floor(state.timeSpent / 60)).padStart(2, '0');
    const secs = String(state.timeSpent % 60).padStart(2, '0');
    document.getElementById('stat-time').textContent = `${mins}:${secs}`;

    statsModal.classList.remove('hidden');
}

function triggerFinalReveal() {
    mainScreen.classList.remove('active');
    finalScreen.classList.remove('hidden');

    document.getElementById('final-opens').textContent = state.openCount;
    document.getElementById('final-closes').textContent = state.closeCount;

    const mins = String(Math.floor(state.timeSpent / 60)).padStart(2, '0');
    const secs = String(state.timeSpent % 60).padStart(2, '0');
    document.getElementById('final-time').textContent = `${mins}:${secs}`;
}


// =========================================================================
// START APPLICATION
// =========================================================================

document.addEventListener('DOMContentLoaded', initApp);