const clockElement = document.getElementById("current-time");
const dateElement = document.getElementById("current-date");

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
    
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    clockElement.textContent = time;
    dateElement.textContent = date;

}

function initClock() {

    updateClock();

    setInterval(updateClock, 1000);

}