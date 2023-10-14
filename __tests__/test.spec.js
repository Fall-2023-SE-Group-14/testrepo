const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
// const request = require("supertest")(httplocalhost5000apiv1);
const expect = require("chai").expect;
let chai = require("chai");
let chaiHttp = require("chai-http");
// let index = require('../index');
let server = require("../index");
let should = chai.should();
const userAuthModel = require("../dao/userAuthModel");
const recipesDAO = require("../dao/recipesDAO");
const request = require("supertest")("http://localhost:5000/api/v1");
// var util= require('util');
// var encoder = new util.TextEncoder('utf-8');
//
// describe(GET recipes, function () {
//   it(is the API is functional, async function () {
//     const response = await request.get(recipesCleanedIngredients=coconut);
//
//     expect(response.status).to.eql(200);
//   });
//
//   it(is the API is fetching the filtered ingredient, async function () {
//     const response = await request.get(recipesCleanedIngredients=pear);
//
//     expect(response.body.filters.CleanedIngredients).to.eql(pear);
//   });
// });
let mongoClient;
// function test_connectivity_func() {
//   // Connection URI. Update username, password, and your-cluster-url to reflect your cluster.
//   // See httpsdocs.mongodb.comecosystemdriversnode for more details

//   const uri =
//     "mongodb+srv://hselvar2:hselvar2@cluster0.e7zgr.mongodb.net/recipe?retryWrites=true&w=majority";
//   var result = false;
//   try {
//     // Connect to the MongoDB cluster
//     mongoClient = MongoClient.connect(uri, {
//       useNewUrlParser: true,
//       maxPoolSize: 50,
//       wtimeoutMS: 2500,
//     }).then(async (client) => {
//       await recipesDAO.injectDB(client);
//       let model = await userAuthModel.injectDB(client);
//       // app.listen(port, () => {
//       //   console.log(`listening on port ${port}`);
//       // });
//       // client.close();
//       // process.exit(1);
//       console.log("model--", model);
//       return true;
//     });
//   } catch (e) {
//     console.log("test conn funct", e);
//     return false;
//   } finally {
//   }
// }

// describe("DB run", function () {
//   it("is Db up and running", async function () {
//     const response = await test_connectivity_func();
//     expect1(response).to.equal(true);
//   });
// });

chai.use(chaiHttp);

// before(done => {
//   index.on("ready", () => {
//     done();
//   })
// })
describe("/ checking api status", () => {
  it("it should give 404 not found error", (done) => {
    let promise = new Promise((resolve, reject) => {
      const uri =
        "mongodb+srv://hselvar2:hselvar2@cluster0.e7zgr.mongodb.net/recipe?retryWrites=true&w=majority";
      var result = false;
      try {
        // Connect to the MongoDB cluster
        MongoClient.connect(uri, {
          useNewUrlParser: true,
          maxPoolSize: 50,
          wtimeoutMS: 2500,
        }).then(async (client) => {
          mongoClient = client;
          await recipesDAO.injectDB(client);
          await userAuthModel.injectDB(client);
          // app.listen(port, () => {
          //   console.log(`listening on port ${port}`);
          // });
          // client.close();
          // process.exit(1);
          resolve();
        });
      } catch (e) {
        console.log("test conn funct", e);
        reject();
      }
    });
    promise.then(() => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  // it('it should give 200 statuscode', (done) => {
  //   chai.request(server)
  //   .get('/api/v1/recipes')
  //   .end((err, res) => {
  //     expect(res).to.have.status(200);
  //     done();
  //   });
  //   });

  //     it('it should give 200 statuscode', (done) => {

  //       chai.request(server)
  //             .get('/api/v1/recipes/cuisines')
  //             .end((err, res) => {
  //               expect(res).to.have.status(200);
  //               done();
  //             });
  //     });

  //     it('it should give 200 statuscode', (done) => {

  //       chai.request(server)
  //             .get('/api/v1/users/getAllUsers')
  //             .end((err, res) => {
  //               console.log(res);
  //               expect(res).to.have.status(200);
  //               done();
  //             });
  //     });

  it("is the API is functional test 1", async function () {
    const response = await request.get("/recipes?CleanedIngredients=coconut");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 2", async function () {
    const response = await request.get("/recipes?CleanedIngredients=COCONUT");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 3", async function () {
    const response = await request.get("/recipes?CleanedIngredients=mango");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 4", async function () {
    const response = await request.get("/recipes?CleanedIngredients=MANGO");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 5", async function () {
    const response = await request.get("/recipes?CleanedIngredients=Mango");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 6", async function () {
    const response = await request.get("/recipes?CleanedIngredients=mANGO");

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 7", async function () {
    const response = await request.get(
      "/recipes?CleanedIngredients={mango, salt}"
    );

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 8", async function () {
    const response = await request.get(
      "/recipes?CleanedIngredients={salt, mango}"
    );

    expect(response.status).to.eql(200);
  });

  it("is the API is functional test 9", async function () {
    const response = await request.get("/recipes?CleanedIngredients={}");

    expect(response.status).to.eql(200);
  });

  it("is the API is fetching the filtered ingredient", async function () {
    const response = await request.get("/recipes?CleanedIngredients=pear");

    expect(response.body.filters.CleanedIngredients).to.eql("pear");
  });

  it("is the API is fetching calories", async function () {
    const response = await request.get(
      "/recipes?Cleaned-Ingredients=salt,mint,peanuts"
    );

    expect(response.body.calories).to.not.eql(0);
  });

  it("is the API is fetching calories", async function () {
    const response = await request.get(
      "/recipes?Cleaned-Ingredients=mAnGo,SaLT,pEanUTs"
    );

    expect(response.body.calories).to.not.eql(0);
  });

  it("is the email being sent to the recipent", async function () {
    const response = await request.get(
      "/recipes?Email='thosaniparth0@gmail.com',Flag=true,CleanedIngredients=mango"
    );

    expect(response.status).to.eql(200);
  });

  it("is the API is fetching users", async function () {
    const response = await request.get("/users/getAllUsers");

    expect(response.status).to.eql(200);
  });
  it("is the API is authorizing users", async function () {
    const response = await request
      .post("/users/authorizeUser")
      .send({ username: "hello", password: "world" });

    expect(response.status).to.eql(200);
  });
  it("invalid username", async function () {
    const response = await request
      .post("/users/authorizeUser")
      .send({ username: "hello1", password: "world" });

    expect(response.status).to.eql(404);
  });
  it("invalid password", async function () {
    const response = await request
      .post("/users/authorizeUser")
      .send({ username: "hello", password: "world1" });

    expect(response.status).to.eql(500);
  });
  it("save recipe not working", async function () {
    const response = await request
      .post("/users/saveRecipe")
      .send({ username: "hello", recipeID: "614f8fcc0f571ff03e10ba65" });

    expect(response.status).to.eql(404);
  });

  it("invalid password", async function () {
    const response = await request
      .post("/users/authorizeUser")
      .send({ username: "hello", password: "world12" });

    expect(response.status).to.eql(500);
  });
});
afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoClient.close();
  done();
});
