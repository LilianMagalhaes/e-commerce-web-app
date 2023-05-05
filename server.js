const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ServerStyleSheet } = require("styled-components");
const { Int32 } = require("mongodb");
const ClientCart = require("./public/src/js/ClientCart");
const session = require("express-session");
const APP = express();
APP.use(cors());
APP.use(bodyParser.json());
const PORT = 4242;

// node server connection//
APP.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

APP.use(express.json());
//APP.set('trust proxy', 1) // trust first proxy
//APP.use(session({
//  secret: '123456789',
//  resave: false,
//  saveUninitialized: true,
//  cookie: { secure: true }
//}))
//
//APP.get("/", (request, response, next) => {
//  require.session.name = "Lilian";
//  console.log(require.session.name); // 'Lilian'
//});

APP.use(express.static(__dirname + "/public"));

APP.get("/", (req, res) => {
  console.log("Route GET /  Redirection vers index.html");
  res.redirect("index.html");
});

// Set the "strictQuery" setting to false in mongoose:
mongoose.set("strictQuery", false);
// Connect to MongoDB:
mongoose
  .connect("mongodb://localhost:27017/PWServerConection", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });
mongoose.connection.on("error", (err) => {
  console.error(err);
});
// Create DBs:

const productsDbSchema = new mongoose.Schema({
  code: String,
  name: String,
  stockQty: String,
  price: String,
  overview: [String],
  brand: String,
  ageCategory: String,
  category: String,
  productPrice: String,
  mainImage: String,
});
let productsDbs = mongoose.model("productsDbs", productsDbSchema);

const clientsDbSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    login: String,
    password: String,
  },
  { versionKey: false }
);
let clientsDbs = mongoose.model("clientsDbs", clientsDbSchema);

const clientsCartDbSchema = new mongoose.Schema(
  {
    clientName: String,
    code: String,
    name: String,
    price: String,
    mainImage: String,
  },
  { versionKey: false }
);
let clientsCartDbs = mongoose.model("clientsCartDbs", clientsCartDbSchema);

let myShoppingCart;
let items;
let clients;

clientsDbs.find({}, function (err, clientCart) {
  if (err) console.log(err);
  clients = clientCart;
});

const chargeClientCart = (cartOwner) => {
  myShoppingCart = new ClientCart();
  let tabLength = items.length;
  for (let i = 0; i < tabLength; i++) {
    if (items[i].owner == cartOwner)
      myShoppingCart.addProductToCart(
        items[i].code,
        items[i].qty,
        items[i].price
      );
  }
};

clientsCartDbs.find({}, function (err, clientCart) {
  if (err) console.log(err);
  clients = clientCart;
});

const checkLogin = (login, passw) => {
  for (const element of clients) {
    if (element.email == login && element.password == passw) return element;
  }
};

//ROUTES:
// Get all records from the DB PRODUCTS (READ)
APP.get("/getProductsGallery", async (request, response) => {
  console.log("Route GET /getProductsGallery");
  try {
    const result = await productsDbs.find().exec();
    response.json(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

APP.post("/addProductToInventory", async (request, response) => {
  console.log("Route POST /addProductToInventory");
  console.log(request.body);
  try {
    const productInfo = new productsDbs(request.body);
    const result = await productInfo.save();
    response.send(result);
  } catch (error) {
    response.status(500).send(error);
  }
});

// Delete a record (DELETE)
APP.delete("/deleteProductFromInventory", async (request, response) => {
  console.log("deleteProductFromInventory");
  console.log(request.body);
  try {
    let result = await productsDbs.deleteOne({ _id: request.body }).exec();
    response.send(result);
  } catch (error) {
    response.status(500).send({ error: error.message });
  }
});

APP.get("/", function (equest, res) {
  clientsCartDbs.find({}, function (err, clientCart) {
    if (err) {
      console.log(err);
      items = clientCart;
    }
  });
  res.render("login.ejs", {});
});

APP.post("/connectClient", function (request, res) {
  let client = checkLogin(request.body.login, request.body.password);
  if (client) {
    chargeClientCart(request.body.login);
    res.render("index.ejs", {
      client: client,
      clientCart: myShoppingCart.clientCart,
      quantity: myShoppingCart.clientCart.length,
      total: myShoppingCart.getCartTotalPrice(),
    });
  } else {
    res.redirect("/");
  }
});

//APP.post('/addClientCart', function(req, res) {
//    if (req.body.code != '' &amp;&amp; req.body.qte != ''&amp;&amp; req.body.prix != '') {
//        let client = new Object();
//        client.lastName = req.body.lastName;
//        client.firstName = req.body.firstName;
//        client.email = req.body.email;
//        myShoppingCart.addProductToCart(req.body.code, parseInt(req.body.qty), parseInt(req.body.price));
//        res.render('index.ejs', {
//          client: client,
//          clientCart : myShoppingCart.clientCart,
//          quantity : myShoppingCart.clientCart.length,
//          total : myShoppingCart.getCartTotalPrice()});
//    } else res.redirect('/');
//});

APP.post("/deleteClientCart", function (req, res) {
  if (req.body.ident != "") {
    let client = new Object();
    client.lastName = req.body.lastName;
    client.firstName = req.body.firstName;
    client.email = req.body.email;
    myShoppingCart.deleteProductFromCart(req.body.ident);
    res.render("index.ejs", {
      client: client,
      clientCart: myShoppingCart.clientCart,
      quantity: myShoppingCart.clientCart.length,
      total: myShoppingCart.getCartTotalPrice(),
    });
  } else res.redirect("/");
});

APP.post("/saveClientCart", function (req, res) {
  clientsCartDbs.remove({ clientName: req.body.clientName }, function (err) {
    if (err) {
      throw err;
    }
    console.log("items deleted");
    let myItems;
    let itemsLenght = myShoppingCart.clientCart.length;
    for (let i = 0; i < itemsLenght; i++) {
      myItems = new clientsCartDbs({
        clientName: req.body.clientName,
        code: myShoppingCart.clientCart[i].getCode(),
        qty: parseInt(myShoppingCart.clientCart[i].getQty()),
        price: parseInt(myShoppingCart.clientCart[i].getPrice()),
      });
      myItems.save(function (err) {
        if (err) throw err;
        console.log("ligne panier ajoutée avec succès !");
      });
    }
    res.redirect("/");
  });
});

APP.listen(PORT, () => {
  console.log(`New conection... Server running at http://localhost:${PORT}/`);
});
