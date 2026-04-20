export async function handler(event) {
  const API_KEY = process.env.GNEWS_API_KEY;

  const { category = "general", query = "" } = event.queryStringParameters;

  let url = "";

  if (query) {
    url = `https://gnews.io/api/v4/search?q=${query}&lang=en&apikey=${API_KEY}`;
  } else {
    url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&apikey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news" }),
    };
  }
}
