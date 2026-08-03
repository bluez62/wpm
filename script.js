const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const bestWpmElement = document.getElementById('best-wpm');
const resetBtn = document.getElementById('reset-btn');

let startTime;
let timerInterval;

// Load stored best WPM on page load
let bestWpm = localStorage.getItem('bestWpm') || 0;
bestWpmElement.innerText = bestWpm;

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

function updateBestWpm(currentWpm) {
    if (currentWpm > bestWpm) {
        bestWpm = currentWpm;
        bestWpmElement.innerText = bestWpm;
        // Save to browser storage
        localStorage.setItem('bestWpm', bestWpm); 
    }
}

quoteInput.addEventListener('input', () => {
    if (!timerInterval) {
        startTimer();
    }

    const currentWpm = calculateWpm();

    // Check if the user finished the test
    if (quoteInput.value === quoteDisplay.innerText) {
        clearInterval(timerInterval);
        quoteInput.disabled = true;
        
        // Update high score when the test completes
        updateBestWpm(currentWpm);
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    startTime = null;
    quoteInput.disabled = false;
    quoteInput.value = "";
    timerElement.innerText = 0;
    wpmElement.innerText = 0;
});
