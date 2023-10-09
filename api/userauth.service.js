const userAuthModel = require("../dao/userAuthModel");

class userAuthService {
  static async getAllUsers(req, res, next) {
    try {
      console.log("user req");
      let obj = await userAuthModel.getAllUsers();

      res.json(obj);
    } catch (err) {
      console.log("error in userauthservice--", err);
      res.status(500).send("Error");
    }
  }

  static async findUser(req, res, next) {
    try {
      console.log(req.body);

      let obj = await userAuthModel.findUser({ username: req.body.username });
      if (obj) {
        if (obj.credentials.password == req.body.password) res.json(obj);
        else res.status(500).send("Incorrect password");
      } else res.status(404).send("User not found");
    } catch (err) {
      console.log("error in userauthservice--", err);
      // res.status(500).send("Error")
    }
  }

  static async saveRecipe(req, res, next) {
    try {
      console.log(req.body);
      let obj = await userAuthModel.saveRecipe(req.body);
      console.log("output----", obj);
      res.json(obj);
    } catch (err) {
      console.log("error in user auth service save recipe--", err);
    }
  }
}
module.exports = userAuthService;
