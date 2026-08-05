// ========================================
// PROJECT XANDRO
// GREETING MODULE
// ========================================

const greetingElement = document.getElementById("greeting");

const greetings = {

    morning: [
        "Good Morning",
        "Rise and shine",
        "Ready for today?",
        "A fresh start",
        "Let's Begin",
        "Ready Today?",
        "New Day",
        "Morning Focus",
        "Let's Build",
        "Stay Sharp"
    ],

    afternoon: [
        "Good Afternoon",
        "Welcome Back",
        "Keep Going",
        "Stay Focused",
        "Still Going?",
        "Making Progress?",
        "Keep Building",
        "Halfway There",
        "Stay Productive",
        "Almost There"
    ],

    evening: [
        "Good Evening",
        "Welcome Back",
        "Keep Going",
        "One More Push",
        "Still Productive?",
        "Stay Focused",
        "Finish Strong",
        "Nice To See You",
        "Back Again?",
        "Let's Continue"
    ],

    night: [
        "Good Evening",
        "Still Awake?",
        "Working Late?",
        "Night Shift?",
        "Burning Oil?",
        "Late Session?",
        "Keep Going",
        "Still Here?",
        "Night Mode",
        "One Last Task?"
    ]

};

function getGreetingPool(){

    const hour = new Date().getHours();

    if(hour >= 5 && hour < 12) return greetings.morning;
    if(hour >= 12 && hour < 17) return greetings.afternoon;
    if(hour >= 17 && hour < 22) return greetings.evening;

    return greetings.night;
}

function updateGreeting(){

    const userData = load("xandro_user", null);

    const username = userData?.name || "Friend";

    const pool = getGreetingPool();

    const randomGreeting =
        pool[Math.floor(Math.random() * pool.length)];

    greetingElement.textContent =
        `${randomGreeting}, ${username}.`;

}

updateGreeting();

window.updateGreeting = updateGreeting;