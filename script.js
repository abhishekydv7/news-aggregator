const API_KEY = "aa5e360422e945a8a9e592631f3b2691";

let debounceTimer;
let lastQuery = "";

const loader = document.getElementById("loader");
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("searchInput");

// 🔍 SEARCH (Debounce)
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    if (query.length < 5 || query === lastQuery) return;

    lastQuery = query;
    fetchNews("", query);
  }, 800);
});

// 📰 FETCH NEWS
function fetchNews(category = "general", query = "") {
  // show loader + skeleton
  loader.style.display = "block";
  newsContainer.innerHTML = "";

  // skeleton
  for (let i = 0; i < 6; i++) {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 custom-card">
        <div class="skeleton skeleton-img"></div>
        <div class="card-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
    `;

    newsContainer.appendChild(col);
  }

  // URL
  let url = query
    ? `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
    : `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("API Error");
      return response.json();
    })
    .then((data) => {
      loader.style.display = "none";

      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = "<h3>No results found!!</h3>";
        return;
      }

      // remove skeleton
      newsContainer.innerHTML = "";

      // render cards
      data.articles.slice(0, 6).forEach((article, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4 fade-in";
        col.style.animationDelay = `${index * 0.1}s`;

        col.innerHTML = `
          <div class="card h-100 custom-card">
            <img src="${article.urlToImage || "https://picsum.photos/400/250"}" 
                 class="card-img-top">

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${article.title}</h5>

              <p class="card-text flex-grow-1">
                ${article.description?.slice(0, 120) || "No description"}...
              </p>

              <div class="d-flex justify-content-between mt-auto gap-2">
              <a href="${article.url}" target="_blank" 
                 class="btn btn-primary mt-auto">
                Read More
              </a>

              <button class="btn btn-light mt-2 save-btn">
                Save
              </button>  
              </div>
            </div>
          </div>
        `;

        newsContainer.appendChild(col);

        const saveBtn = col.querySelector(".save-btn");

        saveBtn.addEventListener("click", () => {
          let saved = JSON.parse(localStorage.getItem("savedNews")) || [];

          saved.push(article);

          localStorage.setItem("savedNews", JSON.stringify(saved));

          alert("Saved!");
        })
      });
    })
    .catch((error) => {
      loader.style.display = "none";
      newsContainer.innerHTML = "<h3>Something went wrong 🚨</h3>";
      console.error(error);
    });
}

// 🚀 INITIAL LOAD
fetchNews();

// 🎯 CATEGORY BUTTONS
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));

    button.classList.add("active");
    fetchNews(button.dataset.category);
  });
});

// 🔎 SEARCH SUBMIT
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  fetchNews("", query);
});

document.getElementById("savedBtn").addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("savedNews")) || [];

  newsContainer.innerHTML = "";

  if (saved.length === 0) {
    newsContainer.innerHTML = "<h3> No saved articles</h3>";
    return;
  }

  saved.forEach((article, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 custom-card">

        <img src="${article.urlToImage || "https://picsum.photos/400/250"}" 
             class="card-img-top">

        <div class="card-body d-flex flex-column">

          <h5 class="card-title">${article.title}</h5>

          <p class="card-text flex-grow-1">
            ${article.description?.slice(0, 120) || "No description"}...
          </p>

          <div class="d-flex justify-content-between mt-auto gap-2">
            <a href="${article.url}" target="_blank" 
             class="btn btn-primary mt-auto">
            Read More
            </a>

            <button class = "btn btn-danger remove-btn">
              Remove
            </button>
          </div>    

        </div>
      </div>
    `;

    newsContainer.appendChild(col);

    const removeBtn = col.querySelector(".remove-btn");

    removeBtn.addEventListener("click", () => {
      let saved = JSON.parse(localStorage.getItem("savedNews")) || [];

      saved.splice(index, 1);

      localStorage.setItem("savedNews", JSON.stringify(saved));

      document.getElementById("savedBtn").click();
    })
  });
});