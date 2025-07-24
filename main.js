async function getMeal() {
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  return data.meals[0];
}
async function loadMealCategories() {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
  const data = await response.json();
  const categories = data.meals;

  const mealsDropdown = document.getElementById("categories");

  categories.forEach(category => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dropdown-item";
    a.href = "#";
    a.textContent = category.strCategory;
    a.addEventListener("click", () => {
      loadMealsByCategory(category.strCategory);
    });

    li.appendChild(a);
    mealsDropdown.appendChild(li);
  });
}

async function loadMealsByCategory(categoryName) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
  const data = await response.json();
  const meals = data.meals;

  const container = document.getElementById("row");
  container.innerHTML = "";

  meals.forEach(meal => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4 ";

    col.innerHTML = `<a href="" class = "text-decoration-none">
      <div class="card h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
        </div>
      </div></a>
    `;
    const a = col.querySelector("a");
    a.addEventListener("click", () => {
      event.preventDefault();
      showMealDetails(meal);
    });

    container.appendChild(col);
  });
}
async function showMealDetails(meal) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
  const data = await response.json();
  const fullMeal = data.meals[0];

  const overlay = document.getElementById("meal-overlay");
  const mealDetails = document.getElementById("meal-details");

  mealDetails.innerHTML = `
    <img src="${fullMeal.strMealThumb}" class="img-fluid mb-3 rounded" alt="${fullMeal.strMeal}">
    <h3>${fullMeal.strMeal}</h3>
    <p><strong>Category:</strong> ${fullMeal.strCategory}</p>
    <p><strong>Area:</strong> ${fullMeal.strArea}</p>
    <p><strong>Instructions:</strong><br>${fullMeal.strInstructions.slice(0, 150)}</p>
    <a href="${fullMeal.strYoutube}" target="_blank" class="btn btn-outline-primary mt-2">Watch on YouTube</a>
  `;
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.getElementById("meal-overlay").classList.add("d-none");
  });
  overlay.classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  loadMealCategories();
  loadMealsByCategory("Beef");
});

async function loadMealsToCarousel(count = 3) {
  const container = document.getElementById("carousel-content");
  const indicators = document.querySelector(".carousel-indicators");

  for (let i = 0; i < count; i++) {
    const meal = await getMeal();

    const item = document.createElement("div");
    item.className = `carousel-item${i === 0 ? " active" : ""}`;
    item.innerHTML = `
      <img src="${meal.strMealThumb}" class="d-block w-100" height="600px" alt="${meal.strMeal}">
      <div class="container">
        <div class="carousel-caption">
          <h1>${meal.strMeal}</h1>
          <p>${meal.strInstructions.slice(0, 200)}...</p>
        </div>
      </div>
    `;
    container.appendChild(item);
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("data-bs-target", "#myCarousel");
    button.setAttribute("data-bs-slide-to", i);
    button.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) {
      button.classList.add("active");
      button.setAttribute("aria-current", "true");
    }
    indicators.appendChild(button);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadMealsToCarousel(3);
});
