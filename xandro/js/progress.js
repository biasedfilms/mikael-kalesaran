// ========================================
// PROJECT XANDRO
// PROGRESS MODULE
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const progressFill =
    document.getElementById("progress-fill");

const completedCount =
    document.getElementById("completed-count");

const totalCount =
    document.getElementById("total-count");

const progressPercent =
    document.getElementById("progress-percent");



// ========================================
// ANIMATE PERCENTAGE
// ========================================

function animatePercentage(target) {

    const current =
        parseInt(progressPercent.textContent) || 0;

    const difference = target - current;

    if (difference === 0) return;

    const duration = 300;

    const start = performance.now();

    function frame(time) {

        const progress = Math.min(
            (time - start) / duration,
            1
        );

        const value =
            Math.round(current + difference * progress);

        progressPercent.textContent = value + "%";

        if (progress < 1) {

            requestAnimationFrame(frame);

        }

    }

    requestAnimationFrame(frame);

}


// ========================================
// FUNCTIONS
// ========================================

function updateProgress() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(task => task.completed).length;

    const percentage =
        totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

    completedCount.textContent = completedTasks;

    totalCount.textContent = totalTasks;

    progressPercent.textContent = `${percentage}%`;
    

    progressFill.style.width = `${percentage}%`;

}


// ========================================
// INITIALIZATION
// ========================================

function initProgress() {

    updateProgress();

}