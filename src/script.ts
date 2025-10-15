// The user will enter a cocktail. Get a cocktail name, photo, and instructions and place them in the DOM

document.addEventListener("DOMContentLoaded", cocktailCarousel);

const button = document.querySelector('button') as HTMLButtonElement;
const input = document.querySelector('input') as HTMLInputElement;
const recipeLink = document.querySelector('.recipe-link') as HTMLElement;
const searchOptions = document.querySelectorAll('.search-by');

button.addEventListener('click', getDrink);

input.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    getDrink();
  }
});

recipeLink.addEventListener('click', displayRecipe);

searchOptions.forEach(option => 
  option.addEventListener('click', (x) => setSearch(x.target as HTMLElement))
);

let drinkID: string;
let searchBy: string = 'search.php?s';

function setSearch(e: HTMLElement) {
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

function getDrink(): void {
  stopCarousel();

  const drink = input.value;
  document.querySelectorAll('.card').forEach(card => card.remove());
  document.querySelectorAll('.no-drink').forEach(message => message.remove());

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/${searchBy}=${drink}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
      const resultsContainer = document.querySelector('.results-container') as HTMLElement;
      carouselContainer.style.display = 'none';
      resultsContainer.style.display = 'flex';

      const drinks = data.drinks;
      if (!drinks || !Array.isArray(drinks)) {
        const noDrink = document.createElement('h2');
        const drinkMessages = ["Go home, you're drunk!", "Shaker's Empty", "404: Cocktail not found", "Nothing shaken or stirred.", "No matches — must be a mocktail!"];
        noDrink.classList.add('no-drink');
        noDrink.innerText = drinkMessages[Math.floor(Math.random() * drinkMessages.length)]!;
        resultsContainer.append(noDrink);
      } else {
        for (let i = 0; i < drinks.length; i++) {
          const cardTemplate = document.querySelector('.card-template') as HTMLElement;
          const card = cardTemplate.cloneNode(true) as HTMLElement;
          card.classList.add('card');
          card.id = drinks[i].idDrink;
          card.classList.remove('card-template');

          (card.querySelector('.result-name') as HTMLElement).innerText = drinks[i].strDrink;
          (card.querySelector('.result-img') as HTMLImageElement).src = drinks[i].strDrinkThumb;
          (card.querySelector('.category') as HTMLElement).innerHTML =
            drinks[i].strIBA ??
            drinks[i].strCategory ??
            "";

          card.addEventListener('click', (x) => {
            const target = x.target as HTMLElement;
            drinkID = target.parentNode instanceof HTMLElement && target.parentNode.id
              ? target.parentNode.id
              : (target.parentNode?.parentNode as HTMLElement)?.id;
            console.log('drink ID is ' + drinkID);
          });

          card.addEventListener('click', displayRecipe);
          resultsContainer.append(card);
        }
      }
    })
    .catch(err => console.log(`error ${err}`));
}

function cocktailCarousel(): void {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks[0];
      drinkID = drink.idDrink;
      console.log('the carousel ID is ' + drinkID);

      (document.querySelector('h2') as HTMLElement).innerText = drink.strDrink;
      (document.querySelector('.carousel') as HTMLImageElement).src = drink.strDrinkThumb;
    })
    .catch(err => console.log(`error ${err}`));
}

const runCarousel = setInterval(cocktailCarousel, 5000);

function stopCarousel(): void {
  clearInterval(runCarousel);
}

function displayRecipe(): void {
  stopCarousel();

  const recipeContainer = document.querySelector('.recipe-container') as HTMLElement;
  recipeContainer.style.display = 'flex';

  document.querySelectorAll('.ingredient-list').forEach(ing => ing.remove());

  console.log('the drink ID being used is ' + drinkID);

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks[0];

      (document.querySelector('.drink-name') as HTMLElement).innerText = drink.strDrink;
      (document.querySelector('.recipe-img') as HTMLImageElement).src = drink.strDrinkThumb;
      (document.querySelector('.directions') as HTMLElement).innerText = drink.strInstructions;

      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        if (ingredient != null) {
          const measure = drink[`strMeasure${i}`] ?? '';
          const li = document.createElement('li');
          li.classList.add('ingredient-list');
          li.textContent = `${measure} ${ingredient}`;
          (document.querySelector('.ingredients-list') as HTMLElement).appendChild(li);
        } else {
          break;
        }
      }
    })
    .catch(err => console.log(`error ${err}`));
}

