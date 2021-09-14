const Product = require("../models/product");
const Stock = require("../models/stock");
const Brand = require("../models/brand");
const async = require("async");
const Category = require("../models/categories");
const { body, validationResult } = require("express-validator");

exports.product_list = function (req, res, next) {
  Product.find({}, "name")
    .populate("productImage")
    .exec(function (err, description) {
      if (err) {
        return next(err);
      }
      console.log(description);
      res.render("product_list", {
        product_list: description,
      });
    });
};

exports.product_stock = function (req, res, next) {
  // Display detail page for a specific product.
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id)
          .populate("brand")

          .exec(callback);
      },
      product_stock: function (callback) {
        Stock.find({ product: req.params.id }).exec(callback);
      },
      brand: function (callback) {
        Brand.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.product == null) {
        // No results.
        var err = new Error("No product found");
        err.status = 404;
        return next(err);
      }

      // Successful, so render.
      res.render("product_detail", {
        product: results.product,
        product_stock: results.product_stock,
        brand: results.product.brand[0].name,
      });
    }
  );
};

exports.product_create_get = function (req, res, next) {
  async.parallel(
    {
      categories: function (callback) {
        Category.find(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
    },

    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("product_form", {
        title: "Create Product",
        categories: results.categories,
        brands: results.brands,
      });
    }
  );
};

exports.product_create_post = [
  body("name", "Brand name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price required").trim().isLength({ min: 1 }).escape(),
  body("brands", "Brand name required").trim().isLength({ min: 1 }).escape(),
  body("category", "Category required").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    console.log(req.file);
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("product_form", {
        title: "Create Brand",
        errors: errors.array(),
      });
      return;
    } else {
      // Check if Product already exsists with same name already exists.
      Product.findOne({
        "name": req.body.name,
        "category": req.body.category,
      }).exec(function (err, found_product) {
        if (err) {
          return next(err);
        }
        if (found_product) {
          // Product exists, redirect to its detail page.
          res.redirect(found_product.url);
        } else {
          let product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brands,
            productImage: `../images/${req.file.filename}`,
          });

          product.save(function (err) {
            if (err) {
              return next(err);
            }

            // brand saved. Redirect to genre detail page.
            res.redirect(product.url);
          });
        }
      });
    }
  },
];

exports.delete_product = function (req, res, next) {
  Stock.find({ product: req.params.id }).exec(function (err, stock) {
    if (err) {
      return next(err);
    }
    if (stock.length !== 0) {
      // go back to the page and send
    }
    Product.findByIdAndDelete(req.params.id).exec(function (err, product) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};
