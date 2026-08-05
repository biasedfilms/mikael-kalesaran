// ========================================
// PROJECT XANDRO
// STORAGE MODULE
// ========================================


// ========================================
// SAVE DATA
// ========================================

function save(key, data) {

    try {

        localStorage.setItem(

            key,

            JSON.stringify(data)

        );

    }

    catch (error) {

        console.error(`Failed to save "${key}"`, error);

    }

}


// ========================================
// LOAD DATA
// ========================================

function load(key, defaultValue) {

    try {

        const storedData = localStorage.getItem(key);

        if (!storedData) {

            return defaultValue;

        }

        return JSON.parse(storedData);

    }

    catch (error) {

        console.error(`Failed to load "${key}"`, error);

        return defaultValue;

    }

}


// ========================================
// REMOVE DATA
// ========================================

function remove(key) {

    localStorage.removeItem(key);

}


// ========================================
// CLEAR STORAGE
// ========================================

function clearStorage() {

    localStorage.clear();

}

