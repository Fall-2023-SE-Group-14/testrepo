// import express from "express";
// import cors from "cors";
// import recipes from "./api/recipes.route.js";
// import users from "./api/userauth.route.js";
// import bodyParser from "body-parser";

const express = require("express");
const cors = require("cors");
const recipes = require("./api/recipes.route");
const users = require("./api/userauth.route");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
//Result URL
app.use("/api/v1/recipes", recipes);
app.use("/api/v1/users", users);

//Error thrown when page is not found
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

module.exports = app;
