document.addEventListener("DOMContentLoaded", function () {
    const intro = document.getElementById("introScreen");
    const icon = document.getElementById("introIcon");
    const wordmark = document.getElementById("introWordmark");

    if (!intro) return;

    // Play once per browser tab session.
    const sessionKey = "maUlamIntroPlayed";

    try {
        if (sessionStorage.getItem(sessionKey)) {
            intro.remove();
            return;
        }

        sessionStorage.setItem(sessionKey, "true");
    } catch (error) {
        // Continue if sessionStorage is unavailable.
    }

    const totalDuration = 5000;
    const transitionDuration = 1500;

    // Match the intro images to your actual sidebar images.
    const sidebarIcon = document.querySelector(
        ".side-bar .logo"
    );

    const sidebarWordmark = document.querySelector(
        ".side-bar .logo2"
    );

    function flyToSidebar(source, target, preserveRatio = false) {
        if (!source || !target || !source.isConnected) return;

        source.style.animation = "none";

        const start = source.getBoundingClientRect();
        const destination = target.getBoundingClientRect();

        if (
            start.width === 0 ||
            start.height === 0 ||
            destination.width === 0 ||
            destination.height === 0
        ) return;

        const dx =
            destination.left + destination.width / 2 -
            (start.left + start.width / 2);

        const dy =
            destination.top + destination.height / 2 -
            (start.top + start.height / 2);

        let scaleX = destination.width / start.width;
        let scaleY = destination.height / start.height;

        if (preserveRatio) {
            // Use one scale factor to prevent distortion
            const scale = Math.min(scaleX, scaleY);
            scaleX = scale;
            scaleY = scale;
        }

        source.animate(
            [
                {
                    transform: "translate(0px, 0px) scale(1, 1)",
                    opacity: 1
                },
                {
                    transform:
                        "translate(" + dx + "px, " + dy +
                        "px) scale(" + scaleX + ", " + scaleY + ")",
                    opacity: 1
                }
            ],
            {
                duration: transitionDuration,
                easing: "cubic-bezier(.4, 0, .2, 1)",
                fill: "forwards"
            }
        );
    }

    // Wait until the intro animation is nearly finished
    window.setTimeout(function () {
        if (!intro.isConnected) return;

        // Start moving both logos
        flyToSidebar(icon, sidebarIcon);
        flyToSidebar(wordmark, sidebarWordmark);

        // Wait for the logos to finish moving before fading out
        window.setTimeout(function () {
            intro.classList.add("is-exiting");

            // Remove the intro after the fade-out
            window.setTimeout(function () {
                intro.remove();
            }, 500);

        }, transitionDuration);

    }, totalDuration - transitionDuration - 500);
});




// Side Bar Script
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const sideBarBtns = document.querySelectorAll('.side-bar-button');
const compactQuery = window.matchMedia('(max-width: 1024px)');

function setCollapsed(collapsed) {
    sidebar.classList.toggle('collapsed', collapsed);
    toggleBtn.classList.toggle('translate', collapsed);
    sideBarBtns.forEach(btn => btn.classList.toggle('shrink', collapsed));
    toggleBtn.setAttribute('aria-expanded', String(!collapsed));
}

toggleBtn.addEventListener('click', () => {
    setCollapsed(!sidebar.classList.contains('collapsed'));
});

// Start collapsed on tablets/phones, and re-sync if the screen size crosses 1024px
setCollapsed(compactQuery.matches);
compactQuery.addEventListener('change', e => setCollapsed(e.matches));

// On tablets/phones, collapse after tapping a link so the content is visible
sideBarBtns.forEach(btn => btn.addEventListener('click', () => {
    if (compactQuery.matches) setCollapsed(true);
}));






/*
// Side Bar Script
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const sideBarBtn = document.querySelectorAll('.side-bar-button')

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.classList.toggle('translate');

    sideBarBtn.forEach(sideBarBtn => {
        sideBarBtn.classList.toggle('shrink');
    });
});
*/

// MP Date Navigator
let currentDate = new Date(); // starts on today

const dateInput = document.getElementById('dateInput');
const prevBtn = document.getElementById('prevDay');
const nextBtn = document.getElementById('nextDay');

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function getWeekDates(baseDate) {
    const date = new Date(baseDate);
    const dayOfWeek = date.getDay();

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
}

function render() {
    dateInput.value = formatDate(currentDate);
}

prevBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    render();
});

nextBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    render();
});

dateInput.addEventListener('change', () => {
    currentDate = new Date(dateInput.value);
    render();
});

render();

// Meal Planner Form Script
const categoryInput = document.getElementById('category-selector');

const mealNameInput = document.getElementById('meal-name');



categoryInput.addEventListener('change', () => {
    console.log(categoryInput.value);
});

categoryInput.addEventListener('change', () => {
    categoryInput.classList.toggle('has-value', categoryInput.value !== '');
});

function resetMealForm() {
    document.getElementById('meal-date').value = '';
    document.getElementById('category-selector').value = '';
    document.getElementById('meal-name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('instructions').value = '';
    document.getElementById('category-selector').classList.remove('has-value');
    currentIngredients = [];
    renderIngredients();

    currentPhotoData = null;
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    uploadPlaceholderText.style.display = 'block';
    mealPhotoInput.value = '';

    editingMealId = null;
}

const form = document.getElementById('form-container')
const backdrop = document.getElementById('modal-backdrop')
const addButton = document.getElementById('add-button')
const xButton = document.getElementById('x-button')

addButton.addEventListener('click', () => {
    editingMealId = null;
    currentPhotoData = null;
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    uploadPlaceholderText.style.display = 'block';
    mealPhotoInput.value = '';
    form.classList.toggle('form-show');
    backdrop.classList.toggle('backdrop-show');
    updateCategoryOptions(document.getElementById('meal-date').value);
});

xButton.addEventListener('click', () => {
    form.classList.toggle('form-show');
    backdrop.classList.toggle('backdrop-show');
    resetMealForm();
});

// Meal Plan Form
const date = document.getElementById('dateInput').value;
const ingredientInput = document.getElementById('ingredient-input');
const addIngBtn = document.getElementById('add-ingredient-btn');
const ingList = document.getElementById('ingredients-list');


let currentIngredients = [];

function renderIngredients() {
    ingList.innerHTML = currentIngredients
        .map((ing, index) => `
            <div class="ingredient-item">
                <span>${index + 1}. ${ing}</span>
                <button type="button" class="remove-ing-btn" data-index="${index}">remove</button>
            </div>
        `)
        .join('');
}

document.getElementById('meal-date').addEventListener('change', () => {
    updateCategoryOptions(document.getElementById('meal-date').value);
});

function updateCategoryOptions(date) {
    const meals = getMeals();
    const options = document.querySelectorAll('#category-selector option[value]:not([value=""])');

    options.forEach(option => {
        const taken = categoryTaken(meals, date, option.value, editingMealId);
        option.disabled = taken;
    });
}

function addIngredient() {
    const value = ingredientInput.value.trim();
    if (value === '') return;

    currentIngredients.push(value);
    renderIngredients();

    ingredientInput.value = '';
    ingredientInput.focus();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (confirmBackdrop.classList.contains('show')) {
            confirmCancelBtn.click(); // treat Escape as Cancel, not Delete — safer default
            return;
        }
        if (expandBackdrop.classList.contains('show')) {
            closeExpandedCard();
            return;
        }
        if (backdrop.classList.contains('backdrop-show')) {
            form.classList.remove('form-show');
            backdrop.classList.remove('backdrop-show');
            return;
        }
    }

    if (e.key === 'Enter' && confirmBackdrop.classList.contains('show')) {
        console.log('Enter triggered confirmOkBtn.click()');
        confirmOkBtn.click();
    }
});

addIngBtn.addEventListener('click', addIngredient);

ingredientInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // stops the whole form from submitting
        addIngredient();
    }
});

ingList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-ing-btn')) {
        const index = Number(e.target.dataset.index);
        currentIngredients.splice(index, 1);
        renderIngredients();
    }
});

const mealPhotoInput = document.getElementById('meal-photo');
const photoPreview = document.getElementById('photo-preview');
const uploadPlaceholderText = document.querySelector('.upload-placeholder-text');

let currentPhotoData = null;

mealPhotoInput.addEventListener('change', () => {
    const file = mealPhotoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        currentPhotoData = reader.result;
        photoPreview.src = currentPhotoData;
        photoPreview.style.display = 'block';
        uploadPlaceholderText.style.display = 'none';
    };
    reader.readAsDataURL(file);
});

// Event delegation — one listener handles clicks on ANY remove button, even future ones
ingList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-ing-btn')) {
        const index = Number(e.target.dataset.index);
        currentIngredients.splice(index, 1);
        renderIngredients();
    }
});

// Unique ID generator
function generateId() {
    const timestamp = Date.now().toString(36); // current time, converted to base36 (shorter string)
    const randomPart = Math.random().toString(36).substring(2, 8); // random chars
    return timestamp + '-' + randomPart;
}

// Data process
function getMeals() {
    return JSON.parse(localStorage.getItem('meals')) || [];
}

function saveMeals(meals) {
    localStorage.setItem('meals', JSON.stringify(meals));
}

function categoryTaken(meals, date, category, excludeId = null) {
    return meals.some(meal =>
        meal.date === date &&
        meal.category === category &&
        meal.id !== excludeId
    );
}

const submitBtn = document.getElementById('submit-button');

submitBtn.addEventListener('click', () => {
    const date = document.getElementById('meal-date').value;
    const category = document.getElementById('category-selector').value;
    const name = document.getElementById('meal-name').value.trim();
    const description = document.getElementById('description').value.trim() || 'No description provided.';
    const instructions = document.getElementById('instructions').value.trim() || 'No data found.';

    if (!date || !category || !name || currentIngredients.length === 0) {
        showToast("Required fields can't be blank.", 'warning');
        return;
    }

    const meals = getMeals();

    if (categoryTaken(meals, date, category, editingMealId)) { // pass editingMealId here
        showToast(`Only 1 ${category} per date.`, 'warning');
        return;
    }

    if (editingMealId) {
        // UPDATE existing meal
        const index = meals.findIndex(m => m.id === editingMealId);
        meals[index] = {
            ...meals[index], // keep the same id
            date, category, name,
            ingredients: currentIngredients,
            description, instructions, photo: currentPhotoData || meals[index].photo || null
        };
        showToast('Meal plan updated!');
    } else {
        // ADD new meal
        meals.push({
            id: generateId(),
            date, category, name,
            ingredients: currentIngredients,
            description, instructions, photo: currentPhotoData || null
        });
        showToast('Meal plan saved!');
    }

    saveMeals(meals);
    render();

    resetMealForm();

    // reset form (same as before)
    document.getElementById('meal-date').value = '';
    document.getElementById('category-selector').value = '';
    document.getElementById('meal-name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('instructions').value = '';
    document.getElementById('category-selector').classList.remove('has-value');
    currentIngredients = [];
    renderIngredients();

    currentPhotoData = null;
    photoPreview.src = '';
    photoPreview.style.display = 'none';
    uploadPlaceholderText.style.display = 'block';
    mealPhotoInput.value = '';


    editingMealId = null; // NEW — reset back to "adding" mode
});

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show'; // reset classes, then re-add
    toast.classList.add(type);

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Plan Display
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function renderMealCards(dateStr) {
    const meals = getMeals().filter(meal => meal.date === dateStr);
    const cards = document.querySelectorAll('.mp-card[data-category]');

    const placeholders = {
        Breakfast: 'images/MP-images/img-bf.jpg',
        Lunch: 'images/MP-images/img-lunch.png',
        Dinner: 'images/MP-images/img-dinner.png'
    };

    cards.forEach(card => {
        const category = card.dataset.category;
        const meal = meals.find(m => m.category === category);

        const nameEl = card.querySelector('.meal-name');
        const descEl = card.querySelector('.meal-desc');
        const imgEl = card.querySelector('img');

        if (meal) {
            nameEl.textContent = meal.name;
            descEl.textContent = meal.description;
            card.dataset.mealId = meal.id;
            imgEl.src = meal.photo || placeholders[category];
            const heartBtn = card.querySelector('.favorite-btn');
            heartBtn.style.display = 'flex';
            heartBtn.textContent = isFavorited(meal.id) ? '♥' : '♡';
            heartBtn.classList.toggle('favorited', isFavorited(meal.id));
        } else {
            nameEl.textContent = 'Nothing planned yet';
            descEl.textContent = '';
            delete card.dataset.mealId;
            imgEl.src = placeholders[category];
            const heartBtn = card.querySelector('.favorite-btn');
            heartBtn.style.display = 'none';
        }
    });

    const banner = document.getElementById('empty-day-banner');
    if (meals.length === 0) {
        banner.textContent = 'Nothing planned for this day yet!';
        banner.classList.add('show');
    } else {
        banner.classList.remove('show');
    }
}

function renderWeekStrip() {
    const weekStrip = document.getElementById('weekStrip');
    const weekDates = getWeekDates(currentDate);
    const meals = getMeals();

    const todayStr = formatDate(new Date());
    const selectedStr = formatDate(currentDate);

    weekStrip.innerHTML = weekDates.map(date => {
        const dateStr = formatDate(date);
        const dayMeals = meals.filter(m => m.date === dateStr);

        const dotCount = ['Breakfast', 'Lunch', 'Dinner']
            .filter(cat => dayMeals.some(m => m.category === cat))
            .length;

        const dots = '<span></span>'.repeat(dotCount);

        const classes = ['day-tile'];
        if (dateStr === todayStr) classes.push('today');
        if (dateStr === selectedStr) classes.push('selected');

        return `
            <div class="${classes.join(' ')}" data-date="${dateStr}">
                <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span class="day-num">${date.getDate()}</span>
                <div class="day-dots">${dots}</div>
            </div>
        `;
    }).join('');
}

document.getElementById('weekStrip').addEventListener('click', (e) => {
    const tile = e.target.closest('.day-tile');
    if (!tile) return;

    currentDate = new Date(tile.dataset.date);
    render();
});

function render() {
    dateInput.value = formatDate(currentDate);
    renderMealCards(formatDate(currentDate));
    renderWeekStrip();
}

render();

// Click to Expand
const expandBackdrop = document.getElementById('expand-backdrop');
const expandCard = document.getElementById('expand-card');
const flipInner = document.querySelector('.flip-inner');
const expandClose = document.getElementById('expand-close');

let currentExpandedMeal = null;
let expandMode = 'planner';

function openExpandedCard(meal, mode = 'planner') {
    currentExpandedMeal = meal;
    expandMode = mode;

    const badge = document.querySelector('.expand-source-badge');
    if (mode === 'planner') {
        badge.textContent = 'Your Planned Meal';
        badge.className = 'expand-source-badge planner';
    } else if (mode === 'recommendation') {
        badge.textContent = 'Recommended Recipe';
        badge.className = 'expand-source-badge recommendation';
    } else if (mode === 'favorite') {
        badge.textContent = 'Favorite Meal';
        badge.className = 'expand-source-badge favorite';
    }

    document.getElementById('edit-meal-btn').style.display = mode === 'planner' ? 'inline-block' : 'none';
    document.getElementById('delete-meal-btn').style.display = mode === 'planner' ? 'inline-block' : 'none';
    document.getElementById('add-to-plan-from-expand-btn').style.display = mode === 'recommendation' ? 'inline-block' : 'none';
    document.getElementById('add-to-plan-from-favorite-btn').style.display = mode === 'favorite' ? 'inline-block' : 'none';

    document.querySelector('.expand-category').textContent = meal.category;
    document.querySelector('.expand-name').textContent = meal.name;
    document.querySelector('.expand-desc').textContent = meal.description;
    document.querySelector('.expand-instructions').textContent = meal.instructions;

    const ingredientsList = document.querySelector('.expand-ingredients');
    ingredientsList.innerHTML = '';
    meal.ingredients.forEach(ing => {
        ingredientsList.innerHTML += `
            <li>
                <label>
                    <input type="checkbox" class="ingredient-check">
                    <span>${ing}</span>
                </label>
            </li>
        `;
    });

    document.getElementById('edit-meal-btn').style.display = mode === 'planner' ? 'inline-block' : 'none';
    document.getElementById('delete-meal-btn').style.display = mode === 'planner' ? 'inline-block' : 'none';
    document.getElementById('add-to-plan-from-expand-btn').style.display = mode === 'recommendation' ? 'inline-block' : 'none';

    flipInner.classList.remove('flipped');
    expandBackdrop.classList.add('show');
}

function closeExpandedCard() {
    expandBackdrop.classList.remove('show');
}

// Click a card to open it — only if it has a meal
document.querySelectorAll('.mp-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
        const mealId = card.dataset.mealId;
        if (!mealId) {
            showToast('Nothing planned yet — add a meal first!', 'warning');
            return;
        }
        const meals = getMeals();
        const meal = meals.find(m => m.id === mealId);
        if (meal) openExpandedCard(meal, 'planner');
    });
});

// Flip button (both front and back share the same class)
document.querySelectorAll('.flip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        flipInner.classList.toggle('flipped');
    });
});

expandClose.addEventListener('click', closeExpandedCard);
expandBackdrop.addEventListener('click', (e) => {
    if (e.target === expandBackdrop) closeExpandedCard(); // only close on backdrop click, not card click
});

// Delete and Edit Button for MP
const deleteMealBtn = document.getElementById('delete-meal-btn');

deleteMealBtn.addEventListener('click', async () => {
    if (!currentExpandedMeal) return;

    const confirmed = await showConfirm(`Delete "${currentExpandedMeal.name}"? This can't be undone.`);
    if (!confirmed) return;

    const meals = getMeals().filter(m => m.id !== currentExpandedMeal.id);
    saveMeals(meals);

    showToast('Meal plan deleted.', 'warning');
    closeExpandedCard();
    renderMealCards(formatDate(currentDate));
});

let editingMealId = null;

const editMealBtn = document.getElementById('edit-meal-btn');

editMealBtn.addEventListener('click', () => {
    if (!currentExpandedMeal) return;

    editingMealId = currentExpandedMeal.id; // remember which meal we're editing

    document.getElementById('meal-date').value = currentExpandedMeal.date;
    document.getElementById('category-selector').value = currentExpandedMeal.category;
    document.getElementById('category-selector').classList.add('has-value');
    document.getElementById('meal-name').value = currentExpandedMeal.name;
    document.getElementById('description').value = currentExpandedMeal.description;
    document.getElementById('instructions').value = currentExpandedMeal.instructions;

    currentIngredients = [...currentExpandedMeal.ingredients]; // copy the array
    renderIngredients();

    if (currentExpandedMeal.photo) {
        photoPreview.src = currentExpandedMeal.photo;
        photoPreview.style.display = 'block';
        uploadPlaceholderText.style.display = 'none';
        currentPhotoData = currentExpandedMeal.photo;
    } else {
        photoPreview.style.display = 'none';
        uploadPlaceholderText.style.display = 'block';
        currentPhotoData = null;
    }

    updateCategoryOptions(currentExpandedMeal.date);

    closeExpandedCard();
    form.classList.add('form-show');
    backdrop.classList.add('backdrop-show');
});

// Reusable Confirmation
const confirmBackdrop = document.getElementById('confirm-backdrop');
const confirmMessage = document.getElementById('confirm-message');
const confirmOkBtn = document.getElementById('confirm-ok');
const confirmCancelBtn = document.getElementById('confirm-cancel');

function showConfirm(message) {
    confirmMessage.textContent = message;
    confirmBackdrop.classList.add('show');
    confirmCancelBtn.focus();

    return new Promise((resolve) => {
        function cleanup(result) {
            confirmBackdrop.classList.remove('show');
            confirmOkBtn.removeEventListener('click', onOk);
            confirmCancelBtn.removeEventListener('click', onCancel);
            resolve(result);
        }
        function onOk() { cleanup(true); }
        function onCancel() { cleanup(false); }

        confirmOkBtn.addEventListener('click', onOk);
        confirmCancelBtn.addEventListener('click', onCancel);
    });
}

// Meal Recommendation Script
document.querySelectorAll('.recom-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.recomCategory;
        const recipe = todaysRecommendations[category];
        if (recipe) openExpandedCard(recipe, 'recommendation');
    });
});


let allRecommendations = mealsData;
let todaysRecommendations = {};

function pickRandomMeal(category, excludeId = null) {
    let options = allRecommendations.filter(r => r.category === category);

    if (excludeId) {
        options = options.filter(r => r.id !== excludeId);
    }

    if (options.length === 0) return null;
    return options[Math.floor(Math.random() * options.length)];
}

function renderRecommendations() {
    const cards = document.querySelectorAll('.recom-card');

    const placeholders = {
        Breakfast: 'images/MP-images/img-bf.jpg',
        Lunch: 'images/MP-images/img-lunch.png',
        Dinner: 'images/MP-images/img-dinner.png'
    };

    cards.forEach(card => {
        const category = card.dataset.recomCategory;
        const previousId = card.dataset.recomId || null;

        const recipe = pickRandomMeal(category, previousId);

        const nameEl = card.querySelector('.meal-name');
        const descEl = card.querySelector('.meal-desc');
        const imgEl = card.querySelector('img');

        if (recipe) {
            nameEl.textContent = recipe.name;
            descEl.textContent = recipe.description;
            card.dataset.recomId = recipe.id;
            todaysRecommendations[category] = recipe;
            imgEl.src = recipe.images || placeholders[category];
            const heartBtn = card.querySelector('.favorite-btn');
            heartBtn.style.display = 'flex';
            heartBtn.textContent = isFavorited(recipe.id) ? '♥' : '♡';
            heartBtn.classList.toggle('favorited', isFavorited(recipe.id));
        } else {
            nameEl.textContent = 'No recipes available yet';
            descEl.textContent = '';
            delete card.dataset.recomId;
            imgEl.src = placeholders[category];
            const heartBtn = card.querySelector('.favorite-btn');
            heartBtn.style.display = 'none';
        }
    });
}

renderRecommendations();

const refreshRecomBtn = document.getElementById('refresh-recom-btn');
refreshRecomBtn.addEventListener('click', renderRecommendations);

const addToPlanFromExpandBtn = document.getElementById('add-to-plan-from-expand-btn');

addToPlanFromExpandBtn.addEventListener('click', () => {
    if (!currentExpandedMeal) return;

    editingMealId = null; // always a NEW plan, never an edit

    document.getElementById('meal-date').value = ''; // user picks the date themselves
    document.getElementById('category-selector').value = currentExpandedMeal.category;
    document.getElementById('category-selector').classList.add('has-value');
    document.getElementById('meal-name').value = currentExpandedMeal.name;
    document.getElementById('description').value = currentExpandedMeal.description;
    document.getElementById('instructions').value = currentExpandedMeal.instructions;

    currentIngredients = [...currentExpandedMeal.ingredients]; // copy, not reference
    renderIngredients();

    if (currentExpandedMeal.images) {
        currentPhotoData = currentExpandedMeal.images;
        photoPreview.src = currentExpandedMeal.images;
        photoPreview.style.display = 'block';
        uploadPlaceholderText.style.display = 'none';
    } else {
        currentPhotoData = null;
        photoPreview.style.display = 'none';
        uploadPlaceholderText.style.display = 'block';
    }

    closeExpandedCard();
    form.classList.add('form-show');
    backdrop.classList.add('backdrop-show');
});

// Core "Favorite" Functions
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorite')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favorite', JSON.stringify(favorites));
}

function isFavorited(sourceId) {
    return getFavorites().some(f => f.sourceId === sourceId);
}

function toggleFavorite(meal) {
    let favorites = getFavorites();
    const alreadyFavorited = favorites.some(f => f.sourceId === meal.id);

    if (alreadyFavorited) {
        favorites = favorites.filter(f => f.sourceId !== meal.id);
    } else {
        favorites.push({
            id: generateId(),
            sourceId: meal.id,
            name: meal.name,
            category: meal.category,
            ingredients: meal.ingredients,
            description: meal.description,
            instructions: meal.instructions,
            photo: meal.photo || meal.images || null
        });
    }

    saveFavorites(favorites);
}

// Favorite Button Scripts
function updateFavoriteIcon(btn, sourceId) {
    const favorited = isFavorited(sourceId);
    btn.textContent = favorited ? '♥' : '♡';
    btn.classList.toggle('favorited', favorited);
}

document.querySelectorAll('.mp-card[data-category] .favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // stop this click from also opening the expanded card

        const card = btn.closest('.mp-card');
        const mealId = card.dataset.mealId;
        if (!mealId) return; // nothing planned on this card — nothing to favorite

        const meals = getMeals();
        const meal = meals.find(m => m.id === mealId);
        if (!meal) return;

        toggleFavorite(meal);
        updateFavoriteIcon(btn, meal.id);
        renderFavorites(document.getElementById('favorites-search').value);
    });
});

document.querySelectorAll('.recom-card .favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();

        const card = btn.closest('.recom-card');
        const category = card.dataset.recomCategory;
        const recipe = todaysRecommendations[category];
        if (!recipe) return;

        toggleFavorite(recipe);
        updateFavoriteIcon(btn, recipe.id);
        renderFavorites(document.getElementById('favorites-search').value);
    });
});

// Favorites Rendering&Filtering 
function renderFavorites(searchTerm = '') {
    const grid = document.getElementById('favorites-grid');
    const favorites = getFavorites();

    const filtered = favorites.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="favorites-empty">No favorites yet — tap the heart on any meal to save it here.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(fav => `
        <div class="favorite-card" data-favorite-id="${fav.id}">
            <button type="button" class="unfavorite-btn" data-favorite-id="${fav.id}">♥</button>
            ${fav.photo ? `<img class="favorite-photo" src="${fav.photo}" alt="">` : ''}
            <div class="favorite-overlay">
                <span class="favorite-category">${fav.category}</span>
                <span class="favorite-name">${fav.name}</span>
            </div>
        </div>
    `).join('');
}

renderFavorites();

document.getElementById('favorites-search').addEventListener('input', (e) => {
    renderFavorites(e.target.value);
});

document.getElementById('favorites-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('unfavorite-btn')) return; // handled separately below

    const card = e.target.closest('.favorite-card');
    if (!card) return;

    const favorites = getFavorites();
    const favorite = favorites.find(f => f.id === card.dataset.favoriteId);
    if (favorite) openExpandedCard(favorite, 'favorite');
});

// Unfavorite Button
document.getElementById('favorites-grid').addEventListener('click', async (e) => {
    if (!e.target.classList.contains('unfavorite-btn')) return;

    const favoriteId = e.target.dataset.favoriteId;
    const favorites = getFavorites();
    const favorite = favorites.find(f => f.id === favoriteId);
    if (!favorite) return;

    const confirmed = await showConfirm(`Remove "${favorite.name}" from favorites?`);
    if (!confirmed) return;

    const updated = favorites.filter(f => f.id !== favoriteId);
    saveFavorites(updated);
    renderFavorites(document.getElementById('favorites-search').value);
});

// Add to favorite form script
let favIngredients = [];
let favPhotoData = null;

const favoriteAddBtn = document.getElementById('add-favorite-btn');
const favoriteModalBackdrop = document.getElementById('favorite-modal-backdrop');
const favoriteXBtn = document.getElementById('favorite-x-button');

favoriteAddBtn.addEventListener('click', () => {
    favoriteModalBackdrop.classList.add('backdrop-show');
});

favoriteXBtn.addEventListener('click', () => {
    favoriteModalBackdrop.classList.remove('backdrop-show');
});

const favIngredientInput = document.getElementById('favorite-ingredient-input');
const favAddIngBtn = document.getElementById('favorite-add-ingredient-btn');
const favIngList = document.getElementById('favorite-ingredients-list');

function renderFavIngredients() {
    favIngList.innerHTML = favIngredients
        .map((ing, index) => `
            <div class="ingredient-item">
                <span>${ing}</span>
                <button type="button" class="remove-fav-ing-btn" data-index="${index}">remove</button>
            </div>
        `)
        .join('');
}

function addFavIngredient() {
    const value = favIngredientInput.value.trim();
    if (value === '') return;

    favIngredients.push(value);
    renderFavIngredients();

    favIngredientInput.value = '';
    favIngredientInput.focus();
}

favAddIngBtn.addEventListener('click', addFavIngredient);

favIngredientInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addFavIngredient();
    }
});

favIngList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-fav-ing-btn')) {
        const index = Number(e.target.dataset.index);
        favIngredients.splice(index, 1);
        renderFavIngredients();
    }
});

const favPhotoInput = document.getElementById('favorite-photo');
const favPhotoPreview = document.getElementById('favorite-photo-preview');
const favUploadPlaceholderText = document.querySelector('#favorite-photo-upload-box .upload-placeholder-text');
function resetFavPhoto() {
    favPhotoData = null;
    favPhotoPreview.src = '';
    favPhotoPreview.style.display = 'none';
    favUploadPlaceholderText.style.display = 'block';
    favPhotoInput.value = '';
}
favPhotoInput.addEventListener('change', () => {
    const file = favPhotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        favPhotoData = reader.result;
        favPhotoPreview.src = favPhotoData;
        favPhotoPreview.style.display = 'block';
        favUploadPlaceholderText.style.display = 'none';
    };
    reader.readAsDataURL(file);
});


const favoriteSubmitBtn = document.getElementById('favorite-submit-button');

favoriteSubmitBtn.addEventListener('click', () => {
    const category = document.getElementById('favorite-category').value;
    const name = document.getElementById('favorite-name').value.trim();
    const description = document.getElementById('favorite-description').value.trim() || 'No description provided.';
    const instructions = document.getElementById('favorite-instructions').value.trim() || 'No data found.';

    if (!category || !name || favIngredients.length === 0) {
        showToast("Category, name, and at least one ingredient are required.", 'warning');
        return;
    }

    const favorites = getFavorites();
    favorites.push({
        id: generateId(),
        sourceId: null, // manually added, not tied to a planner meal or recommendation
        name,
        category,
        ingredients: favIngredients,
        description,
        instructions,
        photo: favPhotoData || null
    });
    saveFavorites(favorites);

    showToast('Favorite added!');
    renderFavorites(document.getElementById('favorites-search').value);

    // reset the form
    document.getElementById('favorite-category').value = '';
    document.getElementById('favorite-name').value = '';
    document.getElementById('favorite-description').value = '';
    document.getElementById('favorite-instructions').value = '';
    favIngredients = [];
    renderFavIngredients();
    favPhotoData = null;
    favPhotoPreview.src = '';
    favPhotoPreview.style.display = 'none';
    favUploadPlaceholderText.style.display = 'block';
    favPhotoInput.value = '';

    favoriteModalBackdrop.classList.remove('backdrop-show');
});

const addToPlanFromFavoriteBtn = document.getElementById('add-to-plan-from-favorite-btn');

addToPlanFromFavoriteBtn.addEventListener('click', () => {
    if (!currentExpandedMeal) return;

    editingMealId = null;

    document.getElementById('meal-date').value = '';
    document.getElementById('category-selector').value = currentExpandedMeal.category;
    document.getElementById('category-selector').classList.add('has-value');
    document.getElementById('meal-name').value = currentExpandedMeal.name;
    document.getElementById('description').value = currentExpandedMeal.description;
    document.getElementById('instructions').value = currentExpandedMeal.instructions;

    currentIngredients = [...currentExpandedMeal.ingredients];
    renderIngredients();

    if (currentExpandedMeal.photo) {
        currentPhotoData = currentExpandedMeal.photo;
        photoPreview.src = currentExpandedMeal.photo;
        photoPreview.style.display = 'block';
        uploadPlaceholderText.style.display = 'none';
    } else {
        currentPhotoData = null;
        photoPreview.style.display = 'none';
        uploadPlaceholderText.style.display = 'block';
    }

    closeExpandedCard();
    form.classList.add('form-show');
    backdrop.classList.add('backdrop-show');
});

const favCategoryInput = document.getElementById('favorite-category');

favCategoryInput.addEventListener('change', () => {
    favCategoryInput.classList.toggle('has-value', favCategoryInput.value !== '');
});







// ===== Clear the Add Favorite form whenever it closes =====
(function () {
    function setup() {
        const backdrop = document.getElementById('favorite-modal-backdrop');
        const form = document.getElementById('favorite-form');
        if (!backdrop || !form) return;   // this page doesn't have the form

        const container = document.getElementById('favorite-form-container');
        const ingList = document.getElementById('favorite-ingredients-list');
        const photoPreview = document.getElementById('favorite-photo-preview');
        const photoBox = document.getElementById('favorite-photo-upload-box');

        function clearForm() {
            form.reset();
            if (ingList) ingList.innerHTML = '';
            if (photoPreview) {
                photoPreview.removeAttribute('src');
                photoPreview.style.display = 'none';
            }
            const hint = photoBox && photoBox.querySelector('.upload-placeholder-text');
            if (hint) hint.style.display = '';
            if (container) container.scrollTop = 0;
        }

        let wasOpen = backdrop.classList.contains('backdrop-show');
        new MutationObserver(function () {
            const isOpen = backdrop.classList.contains('backdrop-show');
            if (wasOpen && !isOpen) {
                setTimeout(function () {
                    if (!backdrop.classList.contains('backdrop-show')) clearForm();
                }, 350);
            }
            wasOpen = isOpen;
        }).observe(backdrop, { attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();