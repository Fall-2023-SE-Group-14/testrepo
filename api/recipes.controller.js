// import RecipesDAO from "../dao/recipesDAO.js";
const RecipesDAO = require("../dao/recipesDAO");

class RecipesController {
  static async apiPostRecipes(req, res, next) {
    try {
      console.log("inside controller");
      let obj = await RecipesDAO.postRecipes(req.body);
      res.json(obj);
    } catch (err) {
      console.log("Error in Post Recipes", err);
    }
  }

  static async apiGetRecipes(req, res, next) {
    const recipesPerPage = req.query.recipesPerPage
      ? parseInt(req.query.recipesPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    //Checking the query to find the required results

    if (req.query.CleanedIngredients) {
      filters.CleanedIngredients = req.query.CleanedIngredients;
      filters.Cuisine = req.query.Cuisine;
      filters.Email = req.query.Email;
      filters.Flag = req.query.Flag;
      filters.totalTime = req.query.totalTime;
    }

    const { recipesList, totalNumRecipes, mail_test_code } =
      await RecipesDAO.getRecipes({
        filters,
        page,
        recipesPerPage,
      });

    let response = {
      recipes: recipesList,
      page: page,
      filters: filters,
      entries_per_page: recipesPerPage,
      total_results: totalNumRecipes,
      mail_test_code: mail_test_code,
    };
    res.json(response);
  }
  //Function to get the cuisines
  static async apiGetRecipeCuisines(req, res, next) {
    try {
      let cuisines = await RecipesDAO.getCuisines();
      res.json(cuisines);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}

module.exports = RecipesController;
