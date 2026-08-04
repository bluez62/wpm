const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const bestWpmElement = document.getElementById('best-wpm');
const percentileElement = document.getElementById('percentile');
const worldRankElement = document.getElementById('world-rank');
const resetBtn = document.getElementById('reset-btn');

const quotes = [
    "Octopuses are smart sea animals with three hearts, blue blood, and eight flexible arms.",
    "The ocean covers 71 percent of Earth, making it a massive world of water, life, and weather.",
    "The endless blue canopy shifts from golden sunrises to starry nights, inspiring wonder with drifting clouds and painting infinite horizons.",
    "Cosmic expansion drives galaxies apart, while mysterious dark matter holds them together, hiding secrets of our universe’s ultimate fate.",
    "Mars is a cold, desert world with a thin atmosphere, massive volcanoes, and signs of ancient liquid water.",
];

let startTime;
let timerInterval;
let currentQuote = "";

let bestWpm = localStorage.getItem('bestWpm') || 0;
bestWpmElement.innerText = bestWpm;

// 2. Render quote text and handle overlay character fading
function renderQuote() {
    const typedText = quoteInput.value;
    let displayHTML = '';
    
    for (let i = 0; i < currentQuote.length; i++) {
        if (i < typedText.length) {
            // Hide already typed characters underneath
            displayHTML += `<span style="opacity: 0;">${currentQuote[i]}</span>`;
        } else {
            // Remaining untyped characters remain visible
            displayHTML += `<span>${currentQuote[i]}</span>`;
        }
    }
    
    quoteDisplay.innerHTML = displayHTML;
}

// 3. Pick a random quote from the array
function setNextQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    renderQuote();
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
    let correctChars = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentQuote[i]) {
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
    
    setNextQuote(); 
}

quoteInput.addEventListener('input', () => {
    if (!timerInterval) {
        startTimer();
    }

    renderQuote();

    quoteDisplay.scrollTop = quoteInput.scrollTop;

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
