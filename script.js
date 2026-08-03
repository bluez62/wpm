const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const bestWpmElement = document.getElementById('best-wpm');
const percentileElement = document.getElementById('percentile');
const worldRankElement = document.getElementById('world-rank');
const resetBtn = document.getElementById('reset-btn');

// 1. Add your quotes here!
const quotes = [
    "Forests are large areas of land covered with trees and thick plant life. They act as the green lungs of our planet by absorbing carbon dioxide and releasing clean oxygen into the air. Millions of unique animal and plant species make their homes within these complex woodland habitats. Healthy forests also protect vital water supplies and prevent dangerous soil erosion during heavy storms. Unfortunately, human activities like illegal logging and rapid urban growth continue to threaten these peaceful natural environments. Protecting and restoring our global woodland areas is an essential duty for all future generations.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "Precision and speed are the keys to fast typing.",
    "Coding is the language of the future.",
    "Practice makes perfect when training your muscle memory."
];

let startTime;
let timerInterval;

let bestWpm = localStorage.getItem('bestWpm') || 0;
bestWpmElement.innerText = bestWpm;

// 2. Pick a random quote from the array
function setNextQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerText = quotes[randomIndex];
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = timeElapsed;
    }, 1000);
}

function calculateWpm() {
    if (!startTime) return 0;

    const timeElapsedInMinutes = (new Date() - startTime) / 1000 / 60;
    if (timeElapsedInMinutes <= 0) return 0;

    const typedText = quoteInput.value;
    const targetText = quoteDisplay.innerText;
    let correctChars = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === targetText[i]) {
            correctChars++;
        } else {
            break;
        }
    }

    const words = correctChars / 5;
    const wpm = Math.round(words / timeElapsedInMinutes);
    const finalWpm = wpm >= 0 ? wpm : 0;
    
    wpmElement.innerText = finalWpm;
    return finalWpm;
}

function calculateGlobalStats(wpm) {
    if (wpm <= 0) return { percentile: "0.0", rank: "50,000,000" };

    const mean = 70;
    const sd = 22;
    const poolSize = 50000000;

    const z = (wpm - mean) / sd;

    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    
    let percentile = z > 0 ? 1 - p : p;
    percentile = Math.min(Math.max(percentile, 0.00001), 0.99999);

    const percentBetter = (percentile * 100).toFixed(1);
    const rawRank = Math.round(poolSize * (1 - percentile));
    const rank = Math.max(rawRank, 1).toLocaleString();

    return { percentile: percentBetter, rank };
}

function updateStatsUI(currentWpm) {
    const stats = calculateGlobalStats(currentWpm);
    percentileElement.innerText = stats.percentile;
    worldRankElement.innerText = stats.rank;
}

function updateBestWpm(currentWpm) {
    if (currentWpm > bestWpm) {
        bestWpm = currentWpm;
        bestWpmElement.innerText = bestWpm;
        localStorage.setItem('bestWpm', bestWpm); 
    }
}

function resetTest() {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    quoteInput.disabled = false;
    quoteInput.value = "";
    timerElement.innerText = 0;
    wpmElement.innerText = 0;
    percentileElement.innerText = "0.0";
    worldRankElement.innerText = "50,000,000";
    
    // Pick a new quote on reset!
    setNextQuote(); 
}

// Function to display quote and highlight typed characters
function renderQuote() {
    const targetText = currentQuote; 
    const typedText = quoteInput.value;
    
    // Build HTML for quote-display
    let displayHTML = '';
    
    for (let i = 0; i < targetText.length; i++) {
        if (i < typedText.length) {
            // Hide already typed characters (or style them)
            displayHTML += `<span style="opacity: 0;">${targetText[i]}</span>`;
        } else {
            // Remaining untyped characters remain visible
            displayHTML += `<span>${targetText[i]}</span>`;
        }
    }
    
    quoteDisplay.innerHTML = displayHTML;
}

// Call renderQuote() inside your input listener:
quoteInput.addEventListener('input', () => {
    if (!timerInterval) {
        startTimer();
    }

    renderQuote(); // Updates background text on every keypress

    const currentWpm = calculateWpm();
    updateStatsUI(currentWpm);

    if (quoteInput.value === currentQuote) {
        clearInterval(timerInterval);
        quoteInput.disabled = true;
        updateBestWpm(currentWpm);
    }
});

resetBtn.addEventListener('click', resetTest);

// Initialize with a random quote when page loads
setNextQuote();
