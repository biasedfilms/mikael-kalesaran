// ========================================
// PROJECT XANDRO
// SETUP MODULE
// ========================================



// ========================================
// DOM
// ========================================

const bootScreen = document.getElementById("boot-screen");

const app = document.getElementById("app");

const nameInput = document.getElementById("name-input");

const continueButton = document.getElementById("continue-btn");

const errorText = document.getElementById("name-error");



// ========================================
// STORAGE
// ========================================

const STORAGE = {

    USER: "xandro_user"

};



// ========================================
// TIMINGS
// ========================================

const TIMING = {

    INTRO: 4000, 

    FADE: 1200,

    REMOVE: 1400

};

// ========================================
// HELPERS
// ========================================

function getUser(){

    return load(STORAGE.USER, null);

}



function saveUser(name){

    save(STORAGE.USER,{

        name,

        setupComplete:true

    });

}



function revealDashboard(){

    app.classList.add("show");

}



function removeBootScreen(){

    bootScreen.remove();

}

// ========================================
// BOOT
// ========================================

function playBootSequence() {

    console.log("Initial:", getComputedStyle(document.getElementById("boot-logo")).opacity);

    setTimeout(() => {

        console.log("Adding branding");

        const logo = document.getElementById("boot-logo");
        const tagline = document.getElementById("boot-tagline");

        logo.classList.add("visible");

    setTimeout(() => {
        tagline.classList.add("visible");
},      350);

        console.log("After branding:", getComputedStyle(document.getElementById("boot-logo")).opacity);

    }, 2000);

    setTimeout(() => {

        bootScreen.classList.remove("branding");
        bootScreen.classList.add("welcome");
        nameInput.focus();

    }, TIMING.INTRO);

}

// ========================================
// VALIDATION
// ========================================

function validateName(){

    const name = nameInput.value.trim();

    if(name.length === 0){

        errorText.textContent = "Please enter your name.";

        errorText.style.visibility = "visible";

        nameInput.focus();

        preventScroll: true

        return null;

    }

    errorText.textContent = "";

    errorText.style.visibility = "hidden";

    return name;

}

// ========================================
// SETUP
// ========================================

function finishSetup(){

    const name = validateName();

    if(!name){

        return;

    }

    continueButton.disabled = true;

    continueButton.textContent = "Setting up...";

    continueButton.style.opacity = ".9";

    saveUser(name);

    if(window.updateGreeting){

        window.updateGreeting();

    }

    setTimeout(() => {

        revealDashboard();

        bootScreen.classList.add("fade-out");

    }, 0);

    bootScreen.addEventListener(
        "transitionend",
        removeBootScreen,
    {   once: true }
    );

}

// ========================================
// RETURNING USER
// ========================================

function skipSetup(){

    revealDashboard();

    removeBootScreen();

}

// ========================================
// EVENTS
// ========================================

continueButton.addEventListener("click",finishSetup);

nameInput.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        finishSetup();

    }

});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const user = getUser();

    if (user?.setupComplete) {

        skipSetup();

        return;

    }

    // Give the browser one frame to paint
    setTimeout(() => {

        playBootSequence();

    }, 100);

});

history.scrollRestoration = "manual";

window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});