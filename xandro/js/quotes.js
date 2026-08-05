// ========================================
// PROJECT XANDRO
// QUOTES MODULE
// ========================================


// ========================================
// DEFAULT DATA
// ========================================

const defaultQuotes = [

    {
        text: "Discipline is choosing what you want most over what you want now.",
        author: "Abraham Lincoln"
    },

    {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
    },

    {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
    },

    {
        text: "Dream big and dare to fail.",
        author: "Norman Vaughan"
    },

    {
        text: "Stay hungry. Stay foolish.",
        author: "Steve Jobs"
    }

];


// ========================================
// DATA
// ========================================

let currentQuote = {};


// ========================================
// DOM ELEMENTS
// ========================================

const quoteText = document.getElementById("quote-text");

const quoteAuthor = document.getElementById("quote-author");


// ========================================
// FUNCTIONS
// ========================================

function getRandomQuote() {

    const randomIndex = Math.floor(
        Math.random() * defaultQuotes.length
    );

    return defaultQuotes[randomIndex];

}

function renderQuote() {

    quoteText.textContent =
             currentQuote.text;

    quoteAuthor.textContent =
        `— ${currentQuote.author}`;

}



// ========================================
// INITIALIZATION
// ========================================

function initQuotes() {

    currentQuote = getRandomQuote();

    renderQuote();

}