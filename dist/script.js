// The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM
document.addEventListener("DOMContentLoaded", cocktailCarousel);
const button = document.querySelector('button');
const input = document.querySelector('input');
const recipeLink = document.querySelector('.recipe-link');
const searchOptions = document.querySelectorAll('.search-by');
button.addEventListener('click', getDrink);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        getDrink();
    }
});
recipeLink.addEventListener('click', displayRecipe);
searchOptions.forEach(option => option.addEventListener('click', (x) => setSearch(x.target)));
let drinkID;
let searchBy = 'search.php?s';
function setSearch(e) {
    searchOptions.forEach(option => option.classList.remove('active'));
    e.classList.add('active');
    const activeOption = e.innerText;
    switch (activeOption) {
        case 'Name':
            searchBy = 'search.php?s';
            break;
        case 'Ingredient':
            searchBy = 'filter.php?i';
            break;
    }
    console.log(`${searchBy} is being searched`);
}
function getDrink() {
    stopCarousel();
    const drink = input.value;
    document.querySelectorAll('.card').forEach(card => card.remove());
    document.querySelectorAll('.no-drink').forEach(message => message.remove());
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/${searchBy}=${drink}`)
        .then(res => res.json())
        .then(data => {
        var _a, _b;
        console.log(data);
        const carouselContainer = document.querySelector('.carousel-container');
        const resultsContainer = document.querySelector('.results-container');
        carouselContainer.style.display = 'none';
        resultsContainer.style.display = 'flex';
        const drinks = data.drinks;
        if (!drinks || !Array.isArray(drinks)) {
            const noDrink = document.createElement('h2');
            const drinkMessages = ["Go home, you're drunk!", "Shaker's Empty"];
            noDrink.classList.add('no-drink');
            noDrink.innerText = drinkMessages[Math.floor(Math.random() * drinkMessages.length)];
            resultsContainer.append(noDrink);
        }
        else {
            for (let i = 0; i < drinks.length; i++) {
                const cardTemplate = document.querySelector('.card-template');
                const card = cardTemplate.cloneNode(true);
                card.classList.add('card');
                card.id = drinks[i].idDrink;
                card.classList.remove('card-template');
                card.querySelector('.result-name').innerText = drinks[i].strDrink;
                card.querySelector('.result-img').src = drinks[i].strDrinkThumb;
                card.querySelector('.category').innerHTML =
                    (_b = (_a = drinks[i].strIBA) !== null && _a !== void 0 ? _a : drinks[i].strCategory) !== null && _b !== void 0 ? _b : "";
                card.addEventListener('click', (x) => {
                    var _a, _b;
                    const target = x.target;
                    drinkID = target.parentNode instanceof HTMLElement && target.parentNode.id
                        ? target.parentNode.id
                        : (_b = (_a = target.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.id;
                    console.log('drink ID is ' + drinkID);
                });
                card.addEventListener('click', displayRecipe);
                resultsContainer.append(card);
            }
        }
    })
        .catch(err => console.log(`error ${err}`));
}
function cocktailCarousel() {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
        const drink = data.drinks[0];
        drinkID = drink.idDrink;
        console.log('the carousel ID is ' + drinkID);
        document.querySelector('h2').innerText = drink.strDrink;
        document.querySelector('.carousel').src = drink.strDrinkThumb;
    })
        .catch(err => console.log(`error ${err}`));
}
const runCarousel = setInterval(cocktailCarousel, 5000);
function stopCarousel() {
    clearInterval(runCarousel);
}
function displayRecipe() {
    stopCarousel();
    const recipeContainer = document.querySelector('.recipe-container');
    recipeContainer.style.display = 'flex';
    document.querySelectorAll('.ingredient-list').forEach(ing => ing.remove());
    console.log('the drink ID being used is ' + drinkID);
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
        .then(res => res.json())
        .then(data => {
        var _a;
        const drink = data.drinks[0];
        document.querySelector('.drink-name').innerText = drink.strDrink;
        document.querySelector('.recipe-img').src = drink.strDrinkThumb;
        document.querySelector('.directions').innerText = drink.strInstructions;
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            if (ingredient != null) {
                const measure = (_a = drink[`strMeasure${i}`]) !== null && _a !== void 0 ? _a : '';
                const li = document.createElement('li');
                li.classList.add('ingredient-list');
                li.textContent = `${measure} ${ingredient}`;
                document.querySelector('.ingredients-list').appendChild(li);
            }
            else {
                break;
            }
        }
    })
        .catch(err => console.log(`error ${err}`));
}
export {};
//# sourceMappingURL=script.js.map