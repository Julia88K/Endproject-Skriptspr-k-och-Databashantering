

const qs = (sel, el = document) => el.querySelector(sel);
const form = qs("#meal-form");
const searchInput = qs("#select");
const results = document.getElementById("results");
const submitButton = qs("#submit");
const dropdown = qs("#recipes");

searchInput.addEventListener("click", () => {
  dropdown.innerHTML = ""; // rensa ev. tidigare lista
  form.style.position = "relative";   // <— NY
  form.style.zIndex = "9999";

  const ul = document.createElement("ul");
  ul.className = "dd-list";

  const dropdownWords = ["Beef", "Chicken", "Vegetarian", "Dessert", "Pork", "Seafood", "Side"];
  dropdownWords.forEach(word => {
    const li = document.createElement("li");
    li.className = "dd-item";
    li.textContent = word;
    li.addEventListener("mousedown", (e) => { // mousedown för att undvika blur-race
      e.preventDefault();
      searchInput.value = word;
      dropdown.innerHTML = ""; // stäng listan
    });
    ul.appendChild(li);
  });

  dropdown.appendChild(ul);
  dropdown.setAttribute("aria-expanded", "true");
});

// Stäng när man klickar utanför / Esc
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dd-wrap")) {
    dropdown.innerHTML = "";
    dropdown.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    dropdown.innerHTML = "";
    dropdown.setAttribute("aria-expanded", "false");
  }
});

submitButton.addEventListener("click", (e)=> {
  e.preventDefault()
  fetchMeals()
  results.innerHTML = "";
  const loadingMsg = document.createElement("p");
  results.appendChild(loadingMsg);
})



async function fetchMeals() {

  const URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let input = searchInput.value;
  console.log(input);
  let res = await fetch(URL);
  let data = await res.json();
  let meals = data.meals
    .filter(meal => (meal.strCategory || "").toLowerCase() == input.toLowerCase())
    .sort((a, b) => a.strMeal.localeCompare(b.strMeal))
    .map(meal => ({
      name: meal.strMeal,
      category: meal.strCategory,
      thumb: `${meal.strMealThumb}/medium`,
      instructions: meal.strInstructions
    }));
   getMeals(meals)
   return meals;
 }

function getMeals(searchInput) {
  results.innerHTML = ""; // rensa tidigare resultat

  searchInput.forEach((meal) => {
    const item = document.createElement("div");
    item.style.position = "relative";
    item.style.display = "inline-block";
    item.style.margin = "10px";

    const img = document.createElement("img");
    img.src = meal.thumb;
    img.alt = meal.name;
    img.style.width = "200px";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    img.loading = "lazy";

    const title = document.createElement("p");
    title.innerText = meal.name;
    title.style.position = "absolute";
    title.style.top = "0";
    title.style.left = "0";
    title.style.width = "100%";
    title.style.margin = "0";
    title.style.padding = "6px 8px";
    title.style.background = "rgba(0, 0, 0, 0.6)";
    title.style.color = "#fff";
    title.style.fontWeight = "600";
    title.style.textAlign = "center";
    title.style.fontSize = "0.9rem";

    // recept-popup
    const recipe = document.createElement("div");
    recipe.innerText = meal.instructions;
    recipe.style.position = "absolute";
    recipe.style.bottom = "0";
    recipe.style.left = "0";
    recipe.style.right = "0";
    recipe.style.background = "rgba(0,0,0,0.8)";
    recipe.style.color = "white";
    recipe.style.padding = "10px";
    recipe.style.fontSize = "0.8rem";
    recipe.style.display = "none";  // döljs tills man hovrar
    recipe.style.maxHeight = "100%";
    recipe.style.overflowY = "auto";

    // visa text vid hover
    item.addEventListener("mouseenter", () => {
      recipe.style.display = "block";
    });
    item.addEventListener("mouseleave", () => {
      recipe.style.display = "none";
    });

    item.append(img, title, recipe);
    results.appendChild(item);
  });
}

