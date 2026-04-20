const newsContainer = document.getElementById("news-container");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");

let debounceTimer;
let lastQuery = "";

//  SEARCH
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();

  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    if (query.length < 3 || query === lastQuery) return;

    lastQuery = query;
    fetchNews("", query);
  }, 600);
});

//  FETCH NEWS (via Netlify function)
function fetchNews(category = "general", query = "") {
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

  //  CALL NETLIFY FUNCTION (NOT GNEWS DIRECTLY)
  const url = `/.netlify/functions/news?category=${category}&query=${query}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      loader.style.display = "none";

      if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = "<h3>No results found</h3>";
        return;
      }

      newsContainer.innerHTML = "";

      data.articles.slice(0, 6).forEach((article, index) => {
        const col = document.createElement("div");
        col.className = "col-md-4 fade-in";
        col.style.animationDelay = `${index * 0.1}s`;

        col.innerHTML = `
          <div class="card h-100 custom-card">
            <img src="${article.image || "https://picsum.photos/400/250"}" 
                 class="card-img-top">

            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${article.title}</h5>

              <p class="card-text flex-grow-1">
                ${article.description?.slice(0, 120) || "No description"}...
              </p>

              <div class="d-flex justify-content-between mt-auto gap-2">
                <a href="${article.url}" target="_blank" class="btn btn-primary">
                  Read More
                </a>

                <button class="btn btn-light save-btn">
                  Save
                </button>
              </div>
            </div>
          </div>
        `;

        newsContainer.appendChild(col);

        // SAVE
        const saveBtn = col.querySelector(".save-btn");

        saveBtn.addEventListener("click", () => {
          let saved = JSON.parse(localStorage.getItem("savedNews")) || [];

          saved.push(article);
          localStorage.setItem("savedNews", JSON.stringify(saved));

          saveBtn.innerText = "Saved";
          saveBtn.classList.replace("btn-outline-light", "btn-success");
        });
      });
    })
    .catch(() => {
      loader.style.display = "none";
      newsContainer.innerHTML = "<h3>Something went wrong 🚨</h3>";
    });
}

//  INITIAL LOAD
fetchNews();

//  CATEGORY
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    fetchNews(btn.dataset.category);
  });
});

//  SUBMIT
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  fetchNews("", searchInput.value.trim());
});

//  SAVED TAB
document.getElementById("savedBtn").addEventListener("click", () => {
  const saved = JSON.parse(localStorage.getItem("savedNews")) || [];

  newsContainer.innerHTML = "";

  if (saved.length === 0) {
    newsContainer.innerHTML = "<h3>No saved articles</h3>";
    return;
  }

  saved.forEach((article, index) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 custom-card">
        <img src="${article.image || `https://source.unsplash.com/400x250/?${article.title}`}"
           onerror="this.src='https://source.unsplash.com/400x250/?news'"
           class="card-img-top"
        >

        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${article.title}</h5>

          <p class="card-text flex-grow-1">
            ${article.description?.slice(0, 120) || "No description"}...
          </p>

          <div class="d-flex justify-content-between mt-auto">
            <a href="${article.url}" target="_blank" class="btn btn-primary">
              Read More
            </a>

            <button class="btn btn-danger remove-btn">Remove</button>
          </div>
        </div>
      </div>
    `;

    newsContainer.appendChild(col);

    col.querySelector(".remove-btn").addEventListener("click", () => {
      let updated = JSON.parse(localStorage.getItem("savedNews")) || [];
      updated.splice(index, 1);
      localStorage.setItem("savedNews", JSON.stringify(updated));

      document.getElementById("savedBtn").click();
    });
  });
});
