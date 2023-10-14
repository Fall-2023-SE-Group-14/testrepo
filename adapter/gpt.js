const axios = require('axios');
const apiKey = process.env.OPENAI_API_KEY;

async function completeChatMessage(ingredients, cuisine) {
    let sample = {
        "_id": "",
        "TranslatedRecipeName": "",
        "TotalTimeInMins": 0,
        "Cuisine": "",
        "URL": "https://www.google.com/url?sa=i&;amp;url=https%3A%2F%2Fjoyfoodsunshine.com%2Fomelette-recipe%2F&amp;psig=AOvVaw0VYV71kTdiRNd6MKqfeD2-&amp;ust=1694111135398000&amp;source=images&amp;cd=vfe&amp;opi=89978449&amp;ved=0CA8QjRxqFwoTCNCL3_XNloEDFQAAAAAdAAAAABAD",
        "Cleaned-Ingredients": "",
        "image-url": "https://joyfoodsunshine.com/wp-content/uploads/2022/07/best-omelette-recipe-1.jpg",
        "Ingredent-count": 0,
        "calories": ""
    };
    let userMessage = "Generate a new receipe with the following ingredients : " + JSON.stringify(ingredients) + " in cuisine: " + cuisine + "  in the below format " + JSON.stringify(sample);
    console.log("Debug Chat GPT Message : ", userMessage);
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
    };

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    console.log("Request ", headers, requestData, apiUrl);
    return axios.post(apiUrl, requestData, { headers })
        .then(response => response.data)
        .catch(error => {
            console.log("ERROR ", JSON.stringify(error));
            throw error;
        });
}

module.exports = { completeChatMessage };
