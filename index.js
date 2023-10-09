const express = require("express");
const cors = require("cors");
const recipes = require("./api/recipes.route");
const users = require("./api/userauth.route");
const bodyParser = require("body-parser");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
//Result URL
app.use("/api/v1/users", users);
app.use("/api/v1/recipes", recipes);

//Error thrown when page is not found
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

const mongodb = require("mongodb");
const dotenv = require("dotenv");
const recipesDAO = require("./dao/recipesDAO");
const userAuthModel = require("./dao/userAuthModel");

dotenv.config();
const MongoClient = mongodb.MongoClient;
//DB port number
const port = process.env.PORT || 8000;

//Connection to MongoDB
MongoClient.connect(process.env.RECIPES_DB_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: false,
})
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        await recipesDAO.injectDB(client);
        await userAuthModel.injectDB(client);

        app.listen(port, () => {
            console.log(`listening on port ${port}`);
        });
    });

module.exports = app;
