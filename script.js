const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const resetBtn = document.getElementById('reset-btn');

let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    
    // Timer display interval (just updates the displayed seconds)
    timerInterval = setInterval(() => {
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = timeElapsed;
    }, 1000);
}

function calculateWpm() {
    if (!startTime) return;

    // 1. Calculate precise elapsed time in minutes
    const timeElapsedInMinutes = (new Date() - startTime) / 1000 / 60;
    if (timeElapsedInMinutes <= 0) return;

    // 2. Count ONLY correctly typed characters
    const typedText = quoteInput.value;
    const targetText = quoteDisplay.innerText;
    let correctChars = 0;

    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === targetText[i]) {
            correctChars++;
        } else {
            // Stop counting correct characters past the first mistake (optional standard practice)
            break; 
        }
    }

    // 3. Standard WPM formula: (Correct Characters / 5) / Time in Minutes
    const words = correctChars / 5;
    const wpm = Math.round(words / timeElapsedInMinutes);

    wpmElement.innerText = wpm >= 0 ? wpm : 0;
}

quoteInput.addEventListener('input', () => {
    if (!timerInterval) {
        startTimer();
    }

    // Calculate WPM instantly on every keypress
    calculateWpm();

    if (quoteInput.value === quoteDisplay.innerText) {
        clearInterval(timerInterval);
        quoteInput.disabled = true;
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
