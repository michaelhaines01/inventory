#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Brand = require("./models/brand");
var Catagories = require("./models/categories");
var Product = require("./models/product");
var Stock = require("./models/stock");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var brands = [];
var categories = [];
var products = [];
var stocks = [];

function brandCreate(name, description, brandimage, cb) {
  let branddetail = {
    name: name,
    description: description,
    brandimage: brandimage,
  };

  var brand = new Brand(branddetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function categoryCreate(type, cb) {
  let categorydetail = {
    type: type,
  };

  var category = new Catagories(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New category " + category);
    categories.push(category);
    cb(null, category);
  });
}

function productCreate(
  name,
  description,
  price,
  productImage,
  category,
  brand,

  cb
) {
  let productdetail = {
    name: name,
    description: description,
    price: price,
    productImage: productImage,
  };

  if (category != false) productdetail.category = category;
  if (brand != false) productdetail.brand = brand;

  var product = new Product(productdetail);
  product.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("Product " + product);
    products.push(product);
    cb(null, product);
  });
}

function stockCreate(product, name, inventory, cb) {
  let stockdetail = {
    name: name,
    inventory: inventory,
  };
  if (product != false) stockdetail.product = product;
  var stock = new Stock(stockdetail);

  stock.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New stock " + stock);
    stocks.push(stock);
    cb(null, stock);
  });
}

function createBrandCategory(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          "Arai",
          "Arai Helmet Limited (株式会社 アライヘルメット, Kabushiki-gaisha Arai Herumetto) is a Japanese company that designs and manufactures motorcycle helmets and other helmets for motorsports.",
          "../public/images/arai",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Shoei",
          "Shoei is a Japanese company producing motorcycle helmets since 1958.",
          "../images/shoei",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "AGV",
          "AGV has been a leading force in helmet design and motorcycle racing since its foundation, ceaselessly innovating every area from aerodynamics, comfort and safety to graphics, sponsorship and advertising in the lead since 1947",
          "../images/agv",
          callback
        );
      },
      function (callback) {
        categoryCreate("Full face", callback);
      },
      function (callback) {
        categoryCreate("Modular", callback);
      },
      function (callback) {
        categoryCreate("Open face", callback);
      },
    ],
    cb // optional callback
  );
  console.log("here");
}

function createProduct(cb) {
  async.parallel(
    [
      function (callback) {
        productCreate(
          "Concept-X",
          "Although a nod to the past, the Concept-X is very much a helmet of the present. Ready for a generation of modern riders that demand a new, old style - but with the performance and comfort only an Arai can provide. ",
          790.0,
          "../images/Arai-concept-x.jpg",
          categories[0],
          brands[0],

          callback
        );
      },
      function (callback) {
        productCreate(
          "GT-Air II",
          "With the innovative and highly-acclaimed GT-Air as a baseline, the all-new GT-Air II was destined for greatness from the very start. Advancements in design, functionality and performance have further evolved SHOEI’s premiere full-face touring helmet",
          800.0,
          "../images/Shoei-gt-air-2.jpg",
          categories[0],
          brands[1],

          callback
        );
      },
      function (callback) {
        productCreate(
          "K1 Dreamtime",
          "K1 is the AGV sport helmet for everyday riding challenges. Born from the AGV racing technology, ready for every road experience.",
          349.0,
          "../images/AGV-k1-dreamtime.jpg",
          categories[0],
          brands[2],
          callback
        );
      },
      function (callback) {
        productCreate(
          "Freeway Classic Union",
          "The Freeway-Classic fulfills the fundamental functions of a motorcycle helmet for those who like to take it easy and experience the world around them to the fullest.",
          539.95,
          "../images/Arai-freeway-union.jpg",
          categories[0],
          brands[0],
          callback
        );
      },
      function (callback) {
        productCreate(
          "J.O Matt Brown",
          "Whether you ride a custom classic or modern retro, the new Shoei J.O will match your ride, with no compromise on safety and comfort!",
          599.9,
          "../images/Shoe-j.o-matt-brown.jpg",
          categories[2],
          brands[1],
          callback
        );
      },
      function (callback) {
        productCreate(
          "Neotec II",
          "An every-occasion helmet with the adaptability to excel no matter where your next journey takes you, the NEOTEC II does it all with style and precision. ",
          1099.9,
          "../images/Shoe-neotec-2.jpg",
          categories[1],
          brands[1],
          callback
        );
      },
      function (callback) {
        productCreate(
          "Sportmodular Matt Carbon",
          "The world’s first SportModular helmet: the performance of a full-face helmet together with the comfort of a modular. Entirely built in Carbon Fiber (shell and chin)",
          999.0,
          "../images/AGV-sportmodular-carbon.jpg",
          categories[1],
          brands[2],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createStock(cb) {
  async.parallel(
    [
      function (callback) {
        stockCreate(products[0], "Small", 5, callback);
      },
      function (callback) {
        stockCreate(products[0], "Medium", 4, callback);
      },

      function (callback) {
        stockCreate(products[0], "Large", 7, callback);
      },

      function (callback) {
        stockCreate(products[1], "Small", 5, callback);
      },

      function (callback) {
        stockCreate(products[1], "Large", 9, callback);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createBrandCategory, createProduct, createStock],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("here");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

/*function (callback) {
  productCreate(
    //name
    //description
    //price
    //image address
    //catergories
    //brands
  );
},*/
