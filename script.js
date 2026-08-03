const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const resetBtn = document.getElementById('reset-btn');

let startTime;
let timerInterval;

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeElapsed = Math.floor((new Date() - startTime) / 1000);
        timerElement.innerText = timeElapsed;
        calculateWpm(timeElapsed);
    }, 1000);
}

function calculateWpm(timeElapsed) {
    if (timeElapsed === 0) return;
    const typedCharacters = quoteInput.value.length;
    // Standard WPM calculation: 5 characters equal 1 word
    const words = typedCharacters / 5;
    const minutes = timeElapsed / 60;
    const wpm = Math.round(words / minutes);
    wpmElement.innerText = wpm >= 0 ? wpm : 0;
}

quoteInput.addEventListener('input', () => {
    if (!timerInterval) {
        startTimer();
    }
    
    // Check if the user completed the text accurately
    if (quoteInput.value === quoteDisplay.innerText) {
        clearInterval(timerInterval);
        quoteInput.disabled = true;
    }
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    quoteInput.disabled = false;
    quoteInput.value = "";
    timerElement.innerText = 0;
    wpmElement.innerText = 0;
});
