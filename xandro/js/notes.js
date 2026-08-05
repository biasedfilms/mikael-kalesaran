// ========================================
// PROJECT XANDRO
// NOTES MODULE
// ========================================


// ========================================
// STORAGE KEY
// ========================================

const NOTES_KEY = "notes";


// ========================================
// DOM
// ========================================

const notesInput = document.getElementById("notes-input");

const notesStatus = document.getElementById("notes-status");


// ========================================
// LOAD NOTES
// ========================================

function loadNotes() {

    const data = load(NOTES_KEY, {

        text: "",

        updated: null

    });

    notesInput.value = data.text;

    updateNotesStatus(data.updated);

}


// ========================================
// SAVE NOTES
// ========================================

let saveTimer;

function saveNotes() {

    notesStatus.textContent = "Saving...";

    const timestamp = Date.now();

    save(NOTES_KEY, {

        text: notesInput.value,

        updated: timestamp

    });

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {

        updateNotesStatus(timestamp);

    }, 500);

}

function updateNotesStatus(timestamp) {

    if (!timestamp) {

        notesStatus.textContent = "Ready";

        return;

    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) {

        notesStatus.textContent = "Saved just now";

    }

    else if (seconds < 3600) {

        const minutes = Math.floor(seconds / 60);

        notesStatus.textContent =
            `Saved ${minutes} min${minutes > 1 ? "s" : ""} ago`;

    }

    else {

        const hours = Math.floor(seconds / 3600);

        notesStatus.textContent =
            `Saved ${hours} hour${hours > 1 ? "s" : ""} ago`;

    }

}

// ========================================
// AUTO RESIZE
// ========================================

function autoResizeNotes() {

    notesInput.style.height = "auto";

    notesInput.style.height = notesInput.scrollHeight + "px";

}


// ========================================
// EVENTS
// ========================================

notesInput.addEventListener("input", () => {

    autoResizeNotes();

    saveNotes();

});


// ========================================
// INITIALIZE
// ========================================

function initNotes() {

    loadNotes();

}


initNotes();

setInterval(() => {

    const data = load(NOTES_KEY, {

        text: "",

        updated: null

    });

    updateNotesStatus(data.updated);

}, 30000);