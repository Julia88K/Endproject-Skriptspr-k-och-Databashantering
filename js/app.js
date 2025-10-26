
//Här hämtas HTML-element med hjälp av CSS-selektorer (via funktionen qs() som använder querySelector).
// Till skillnad från document.getElementById, som bara kan hämta element med ett specifikt id,
// kan qs() använda alla typer av CSS-selektorer.
const qs = (sel, el = document) => el.querySelector(sel);
const form = qs("#meal-form");
const searchInput = qs("#select");
const results = document.getElementById("results");
const submitButton = qs("#submit");
const dropdown = qs("#recipes");

// Skapa dropdown-meny

// När man klickar på Input-fältet så lyssnar den här funktionen och...
searchInput.addEventListener("click", () => {
  // här rensas ev. tidigare lista
  dropdown.innerHTML = "";
  // ...gör att form-taggen placeras ovanför andra element på sidan.
  // Det här är viktigt för att rullgardinsmenyn inte ska hamna bakom något annat.
  form.style.position = "relative";
  form.style.zIndex = "9999";

  // ...skapar ett nytt ul-element (en olistad lista) som ska innehålla menyalternativen.
  const ul = document.createElement("ul");
  ul.className = "dd-list";
//  ...skapar en lista med ord som ska visas i dropdown-menyn.
  const dropdownWords = ["Beef", "Chicken", "Vegetarian", "Dessert", "Pork", "Seafood", "Side", "Lamb", "Pasta"];
  // För varje element (dvs ord, tex. "Beef") skapas ett nytt list-item-element, där innehållet just är elementet "word" (alltså tex. Beef)
  dropdownWords.forEach(word => {
    const li = document.createElement("li");
    li.className = "dd-item";
    li.textContent = word;
    // När användaren klickar på ett alternativ i listan, så stoppar det här funktion att input-fältet stängs för tidigt.
    // Sen skrivs det in det valda ordet i input-fältet, sen tas listan bort så att den försvinner från sidan.
    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      searchInput.value = word;
      // listan stängs eller nollställs
      dropdown.innerHTML = "";
    });
    // Lägger till li-elementet i ul-listan.
    ul.appendChild(li);
  });
  //ul-listan läggs till dropdown-elementet.
  dropdown.appendChild(ul);
  // Anger för skärmläsare att dropdown-menyn nu är öppen.
  dropdown.setAttribute("aria-expanded", "true");
});

// när man klickar någon annanstans på sidan lyssnar den här funktionen och stänger ner dropdown-menyn
document.addEventListener("click", (e) => {
  if (!e.target.closest(".dd-wrap")) {
    dropdown.innerHTML = "";
    dropdown.setAttribute("aria-expanded", "false");
  }
});


// Main-Funktion (Submit-Button)

// När man aktiverar submit-knappen i HTML-dokumentet så lyssnar den på klicket och...
submitButton.addEventListener("click", (e)=> {
  // ...förhindrar att formuläret laddar om sidan
  e.preventDefault()
  // ...anropar funktionen fetchMeals() som hämtar data från API:et TheMealDB
  // baserat på det användaren har skrivit i sökfältet (searchInput), samt visar bilder, titel och recept.
  fetchMeals()
  // Här rensas eventuella tidigare resultat
  results.innerHTML = "";
})


// Fetch-Funktion, hämta data från API:et TheMealDB


// Här skapas en asynkron funktion som hämtar måltider från API:et TheMealDB
async function fetchMeals() {
 // Här definieras API:ets URL
  const URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  // Hämtar värdet (texten) från input-fältet "searchInput".
  // Det här gör att funktionen vet vilken kategori användaren vill söka efter.
  let input = searchInput.value;
  // Här väntas svaret från Fetch-Request
  let res = await fetch(URL);
  // Här görs om svaret till ett JavaScript-objekt (från JSON-format)
  let data = await res.json();
  // Här filtreras, sorteras måltiderna och re-skapas sen som enklare objekt med namn, kategori, bild och recept.
  let meals = data.meals
    .filter(meal => (meal.strCategory || "").toLowerCase() == input.toLowerCase())
    .sort((a, b) => a.strMeal.localeCompare(b.strMeal))
    .map(meal => ({
      name: meal.strMeal,
      category: meal.strCategory,
      thumb: `${meal.strMealThumb}/medium`,
      instructions: meal.strInstructions
    }));
    // Till slut skickas de filtrerade och bearbetade måltiderna vidare
    // till funktionen getMeals() för att visas i HTML.
   getMeals(meals)
 }




 // Sökresultats-Funktion

 // Den här funktionen skapar och visar element för sökresultaten.
function getMeals(searchInput) {
  // Rensar tidigare resultat innan nya läggs till.
  results.innerHTML = "";

  // För varje måltid (meal) i listan skapas ett "div"-element i HTML-dokumentet som fungerar som behållare.
  searchInput.forEach((meal) => {
    const item = document.createElement("div");
    item.style.position = "relative";
    item.style.display = "inline-block";
    item.style.margin = "10px";

    // Skapar en bild för varje måltid i HTML-dokumentet och lägger till enkel styling.
    const img = document.createElement("img");
    img.src = meal.thumb;
    img.alt = meal.name;
    img.style.width = "200px";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    // // Laddas först när bilden syns i vyn
    img.loading = "lazy";

    // Till slut skapas det en text (p-element) i HTML-dokumentet som visar måltidens namn ovanpå bilden.
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

    // Det skapas också ett dolt div-element i HTML-dokumentet som innehåller recepttexten, som ska
    // poppar upp när man ha cursorn på bilden
    const recipe = document.createElement("div");
    // Hämtar instruktionerna från meal-objektet
    recipe.innerText = meal.instructions;
    recipe.style.position = "absolute";
    recipe.style.bottom = "0";
    recipe.style.left = "0";
    recipe.style.right = "0";
    recipe.style.background = "rgba(0,0,0,0.8)";
    recipe.style.color = "white";
    recipe.style.padding = "10px";
    recipe.style.fontSize = "0.8rem";
    // receptet döljs tills man hovrar
    recipe.style.display = "none";
    recipe.style.maxHeight = "100%";
    recipe.style.overflowY = "auto";

    // Den här funktionen lyssnar på när muspekaren hovers på divven och då visas recepttexten.
    item.addEventListener("mouseenter", () => {
      recipe.style.display = "block";
    });

    // Den här funktionen lyssnar på när muspekaren lämnar fältet och då visas receptet inte längre
    // genom att display visas "none".
    item.addEventListener("mouseleave", () => {
      recipe.style.display = "none";
    });
    // Här läggs bild, titel och recept till div-elementet "items"
    item.append(img, title, recipe);
    // item läggs till det befintliga div-elementet "results" i HTML-dokumentet. Nu syns alla element på webbsidan.
    results.appendChild(item);
  });
}

