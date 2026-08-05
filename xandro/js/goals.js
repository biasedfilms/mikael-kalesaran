// ========================================
// PROJECT XANDRO
// GOALS MODULE
// ========================================


// ========================================
// DATA
// ========================================

let goals = [];



// ========================================
// DOM ELEMENTS
// ========================================

const goalsList = document.getElementById("goals-list");

const addGoalButton = document.getElementById("add-goal-btn");

const goalInputContainer = document.querySelector(".goal-input-container");

const goalInput = document.getElementById("goal-input");



// ========================================
// RENDER GOALS
// ========================================

function renderGoals() {

    goalsList.innerHTML = "";

    if (goals.length === 0) {

    goalsList.innerHTML = `
        <li class="empty-state">
            No goals yet.<br>
            <span>Click <strong>+</strong> to start building your future.</span>
        </li>
    `;

    return;

}

    goals.forEach((goal, index) => {

        const li = document.createElement("li");

        li.className = goal.completed
            ? "goal completed"
            : "goal";

        li.innerHTML = `

            <button class="goal-toggle">

                ${goal.completed ? "◉" : "◎"}

            </button>

            <span>

                ${goal.title}

            </span>

            <button class="delete-goal">

                ✕

            </button>

        `;

        const toggleButton = li.querySelector(".goal-toggle");

        const deleteButton = li.querySelector(".delete-goal");



        // Toggle completion

        toggleButton.addEventListener("click", () => {

            goal.completed = !goal.completed;

            saveGoals();

            renderGoals();

        });



        // Delete goal

        deleteButton.addEventListener("click", () => {

            li.classList.add("deleting");

            setTimeout(() => {

                goals.splice(index, 1);

                saveGoals();

                renderGoals();

            }, 300);

        });



        goalsList.appendChild(li);

    });

}



// ========================================
// SAVE
// ========================================

function saveGoals() {

    save("goals", goals);

}



// ========================================
// ADD GOAL
// ========================================

function addGoal() {

    const title = goalInput.value.trim();

    if (title === "") return;

    goals.push({

        id: Date.now(),

        title,

        completed: false

    });

    goalInput.value = "";

    goalInputContainer.classList.add("hidden");

    saveGoals();

    renderGoals();

}



// ========================================
// BUTTON EVENTS
// ========================================

addGoalButton.addEventListener("click", () => {

    goalInputContainer.classList.toggle("hidden");

    if (!goalInputContainer.classList.contains("hidden")) {

        goalInput.focus();

    }

});



goalInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        addGoal();

    }

});



// ========================================
// INITIALIZE
// ========================================

function initGoals() {

    goals = load("goals", []);

    renderGoals();

}



initGoals();