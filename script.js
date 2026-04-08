const API_KEY = "aa5e360422e945a8a9e592631f3b2691";
const url =
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

fetch(url)
//Convert response-> JSON
.then(response => response.json())
//Log data
.then(data =>{
    console.log(data);
    const article = data.articles[2];
    console.log(article);

    document.getElementById("news-title").innerText = article.title;
    document.getElementById("news-desc").innerText = article.description;
    document.getElementById("news-img").innerText = article.urlToImage;
    
    const img = document.getElementById("news-img");
    console.log("img")

    img.src = article.urlToImage;
})

