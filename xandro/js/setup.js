// ========================================
// PROJECT XANDRO
// FIRST LAUNCH EXPERIENCE
// ========================================

const bootScreen = document.getElementById("boot-screen");

const branding = document.querySelector(".boot-branding");

const welcomeCard = document.getElementById("welcome-card");

const nameInput = document.getElementById("name-input");

const continueButton = document.getElementById("continue-btn");

const errorText = document.getElementById("name-error");

const Boot = {

    state: "intro",

    play(){

        this.intro();

    },

    intro(){

    bootScreen.classList.add("branding");

    setTimeout(()=>{

        bootScreen.classList.remove("branding");

        bootScreen.classList.add("welcome");

    },1500);

},

    showWelcome(){

    setTimeout(()=>{

        nameInput.focus();

        this.state="ready";

    },700);

},
    finishSetup() {

    const name = nameInput.value.trim();

    if (!name){

        errorText.textContent = "Please enter your name.";
        errorText.style.visibility = "visible";

        nameInput.focus();

        return;

}

// Valid name
    errorText.textContent = "";
    errorText.style.visibility = "hidden";

    continueButton.disabled = true;
    continueButton.textContent = "Setting up...";
    continueButton.style.opacity = ".9";

    save("xandro_user", {

    name: name,

    setupComplete: true

});

if (window.updateGreeting) {
    window.updateGreeting();
}

    const app = document.getElementById("app");

    setTimeout(() => {

    // Reveal dashboard underneath
    app.style.visibility = "visible";

    requestAnimationFrame(() => {

        app.style.opacity = "1";

    });

    // Fade away boot screen
    bootScreen.classList.add("fade-out");

},500);

    setTimeout(() => {

    bootScreen.remove();

},1200);

}

};

continueButton.addEventListener("click", () => {

    Boot.finishSetup();

});

nameInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        Boot.finishSetup();

    }

});

const user = load("xandro_user", null);

if(user?.setupComplete){

    const app = document.getElementById("app");

    app.style.visibility = "visible";

    app.style.opacity = "1";

    bootScreen.remove();

}
else{

    Boot.play();

}