// import mongodb from "mongodb";
// import nodemailer from "nodemailer";
// import password from "./mail_param.js";

const mongodb = require("mongodb");
// import 'requests' from requests;
// import axios from "axios";
const axios = require("axios");
const request = require("request");
// import request from "request";

const ObjectId = mongodb.ObjectId;
let recipes;
//Function to connect to DB
class RecipesDAO {
  static async injectDB(conn) {
    if (recipes) {
      return;
    }
    try {
      recipes = await conn.db(process.env.RECIPES_NS).collection("recipe");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in recipesDAO: ${e}`
      );
    }
  }

  static async postRecipes(addRecipeDetails) {
    console.log("inside dao");

    return recipes.insertOne(addRecipeDetails, function(err, res) {
      if (err) throw err;

      console.log("1 document inserted");
      console.log(res);
      return res;
    });
  }

  //Function to get the Recipe List
  static async getRecipes({
    filters = null,
    page = 0,
    recipesPerPage = 10,
  } = {}) {
    let query;
    console.log("heeere", filters);
    if (filters) {
      if ("CleanedIngredients" in filters) {
        var str = "(?i)";
        var time = parseInt(filters["totalTime"]);

        for (var i = 0; i < filters["CleanedIngredients"].length; i++) {
          const str1 = filters["CleanedIngredients"][i];
          str += "(?=.*" + str1 + ")";
        }
        console.log(str);
        if (time) {
          query = {
            "Cleaned-Ingredients": { $regex: str },
            TotalTimeInMins: { $lte: time },
          };
        } else {
          query = {
            "Cleaned-Ingredients": { $regex: str },
          };
        }
        query["Cuisine"] = filters["Cuisine"];
        var email = filters["Email"];
        var flagger = filters["Flag"];
        console.log(email);
        console.log(flagger);
        console.log(query);
      }
    }

    let cursor;

    try {
      cursor = await recipes
        .find(query)
        .collation({ locale: "en", strength: 2 });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { recipesList: [], totalNumRecipess: 0 };
    }

    const displayCursor = cursor.limit(recipesPerPage);
    try {
      const recipesList = await displayCursor.toArray();
      const totalNumRecipes = await recipes.countDocuments(query);

      var str_mail = "";
      for (var j = 1; j <= recipesList.length; j++) {
        // str_mail += "\nRecipe " + j + ": \n";
        // str_mail += recipesList[j - 1]["TranslatedRecipeName"] + "\n";
        // str_mail += "Time taken to prepare the recipe: \n" ;
        // str_mail += recipesList[j - 1]["TotalTimeInMins"] + " mins \n";
        // console.log(str_mail);
        var new_str = recipesList[j - 1]["Cleaned-Ingredients"]?.replace(
          /,/g,
          " and "
        );
        // console.log(new_str);
        var total_cal = 0;
        await axios
          .get("https://api.calorieninjas.com/v1/nutrition?query=" + new_str, {
            headers: {
              "X-Api-Key": "XSCESI7dxnCa7WydS0dZdQ==2nqZmMFF8hXOwdkE",
            },
          })
          .then(function(response) {
            // handle success
            for (let i = 0; i < response.data.items.length; i++) {
              var temp = response.data.items[i].calories;
              // console.log(temp);
              total_cal += temp;
            }
          })
          .catch(function(error) {
            // handle error
            console.log("error:" + error);
          })
          .then(function() {
            // always executed
          });

        // console.log(total_cal)
        // 6c6cd52f12d5f99f0bf67d14e8c3547d
        recipesList[j - 1]["calories"] = total_cal.toFixed(2);
        str_mail += "\nRecipe " + j + ": \n";
        str_mail += recipesList[j - 1]["TranslatedRecipeName"] + "\n";
        str_mail += "Time taken to prepare the recipe: \n";
        str_mail += recipesList[j - 1]["TotalTimeInMins"] + " mins \n";
        str_mail += "Total Calories in the food item: \n";
        str_mail += recipesList[j - 1]["calories"] + " calories \n";
        // console.log(str_mail);
        // var new_str = recipesList[j - 1]["Cleaned-Ingredients"].replace(
        //   /,/g,
        //   " and "
        // );

        // console.log(recipesList[j-1])
      }

      // if (flagger == "true") {
      //   var transporter = nodemailer.createTransport({
      //     host: "smtp.gmail.com",
      //     port: 465,
      //     secure: true,
      //     auth: {
      //       user: "simran.walmart@gmail.com",
      //       pass: pass,
      //     },
      //   });

      //   var mailOptions = {
      //     from: "simran.walmart@gmail.com",
      //     to: email,
      //     subject: "Your Recommended Recipes!",
      //     text: str_mail,
      //   };

      //
      //   transporter.sendMail(mailOptions, function(error, info) {
      //     if (error) {
      //       console.log(error);
      //     } else {
      //       mail_test_code = info.response;
      //       console.log("Email sent: " + info.response);
      //     }
      //   });
      // }
      var mail_test_code;

      return { recipesList, totalNumRecipes, mail_test_code };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { recipesList: [], totalNumRecipes: 0, mail_test_code: 420 };
    }
  }

  //Function to get the list of Cuisines
  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await recipes.distinct("Cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }

  // code
}

module.exports = RecipesDAO;
