const API_KEY = "aa5e360422e945a8a9e592631f3b2691";
const url =
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

fetch(url)
//Convert response-> JSON
.then(response => response.json())
//Log data
.then(data =>{
  const container = document.getElementById("news-container"); 
  container.innerHTML = ""; //remove prev inputs
    data.articles.slice(0,6).forEach(article => {

      // create column
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      //create card using innerHTML
      col.innerHTML = `
            <div class="card h-100">
               <img src="${article.urlToImage}" class="card-img-top" alt = "news image">
                <div class ="card-body">
                        <h5 class = "card-title">${article.title}</h5>
                        <p class="card-text">${article.description?.slice(0,100) || "No description available"}... </p>
                        <a href= "${article.url}" target="_blank" class="btn btn-primary">
                          Read More...
                        </a>
                </div>
            </div>
      `;

      container.appendChild(col);
    });
    
});
