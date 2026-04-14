const API_KEY = "aa5e360422e945a8a9e592631f3b2691";

function fetchNews(category = "general", query = "") {

  let url = "";
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`;
  }

  const loader = document.getElementById("loader");
  loader.style.display = "block";

  fetch(url)
    //CATCH API ERRORS
    .then(response =>{
      if(!response.ok) {
        throw new Error("API Error");
      }
      return response.json();
    })
    .then(data => {
      loader.style.display = "none";
      const container = document.getElementById("news-container"); 
      container.innerHTML = ""; //remove prev inputs

      //HANDLES NO RESULT
      if(!data.articles || data.articles.length === 0) {
        container.innerHTML = "<h3>No results found!!</h3>";
        return;
      }

    data.articles.slice(0,6).forEach(article => {

      // DIVISION OF CODE
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      // CARDS FORCED CODE
      col.innerHTML = `
            <div class="card h-100">
               <img src="${article.urlToImage || "https://via.placeholder.com/300"}" class="card-img-top" alt = "news image">
                <div class ="card-body">
                        <h5 class = "card-title">${article.title}</h5>
                        <p class="card-text">${article.description?.slice(0, 100) || "No description available"}... </p>
                        <a href= "${article.url}" target="_blank" class="btn btn-primary">
                          Read More...
                        </a>
                </div>
            </div>
      `;

      container.appendChild(col);
    });
  })
  // TO CATCH ANY ERROR
  .catch(error => {   
    loader.style.display = "none";

    const container = document.getElementById("news-container");
    container.innerHTML = "<h3>Something went wrong 🚨</h3>";

    console.error(error);
  });
}

const buttons = document.querySelectorAll(".category-btn");

buttons.forEach(button=>{
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    fetchNews(category);
  });
});

fetchNews();

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", ()=> {
  const query = searchInput.value.trim();

  if(!query) return;

  fetchNews("", query);
});

searchInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
    searchBtn.click();
  }
});
