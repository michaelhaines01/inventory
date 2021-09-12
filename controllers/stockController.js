const Product = require("../models/product");
const Stock = require("../models/stock");
const Brand = require("../models/brand");
const async = require("async");
const Category = require("../models/categories");
const { body, validationResult } = require("express-validator");
const { ResultWithContext } = require("express-validator/src/chain");

exports.stock_product = function (req, res, next) {
  console.log(req.params.id);
  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id).populate("name").exec(callback);
      },
      product_stock: function (callback) {
        Stock.find({ product: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      console.log(results.product_stock);
      res.render("stock_form", {
        product: results.product,
        stock: results.product_stock,
      });
    }
  );
};

exports.stock_product_post = [
  body("small", "small required").trim().isLength({ min: 0 }).escape(),
  body("medium", "medium required").trim().isLength({ min: 0 }).escape(),
  body("large", "large required").trim().isLength({ min: 0 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      async.parallel(
        {
          product: function (callback) {
            Product.findById(req.params.id).populate("name").exec(callback);
          },
          product_stock: function (callback) {
            Stock.find({ product: req.params.id }).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }

          console.log(results.product_stock);
          res.render("stock_form", {
            product: results.product,
            stock: results.product_stock,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Stock.find({ product: req.params.id }).exec(function (err, stock) {
        if (err) {
          return next(err);
        }
        if (stock.length !== 0) {
          async.parallel(
            [
              function (callback) {
                Stock.findOneAndUpdate(
                  { $and: [{ product: req.params.id }, { name: "small" }] },
                  { inventory: req.body.small }
                ).exec(callback);
              },
              function (callback) {
                Stock.findOneAndUpdate(
                  { $and: [{ product: req.params.id }, { name: "medium" }] },
                  { inventory: req.body.medium }
                ).exec(callback);
              },
              function (callback) {
                Stock.findOneAndUpdate(
                  { $and: [{ product: req.params.id }, { name: "large" }] },
                  { inventory: req.body.large }
                ).exec(callback);
              },
            ],

            function (err, doc) {
              if (err) return res.send(500, { error: err });
              res.redirect(`/product/${req.params.id}`);
            }
          );
        } else {
          let small = new Stock({
            product: req.params.id,
            name: "small",
            inventory: req.body.small,
          });

          let medium = new Stock({
            product: req.params.id,
            name: "medium",
            inventory: req.body.medium,
          });
          let large = new Stock({
            product: req.params.id,
            name: "large",
            inventory: req.body.large,
          });
          async.parallel(
            [
              small.save.bind(small),
              medium.save.bind(medium),
              large.save.bind(large),
            ],
            function (err) {
              if (err) {
                return next(err);
              }

              Product.findById(req.params.id).exec(function (
                err,
                found_product
              ) {
                if (err) {
                  return next(err);
                }

                if (found_product) {
                  //redirect to product page
                  res.redirect(found_product.url);
                }
              });
            }
          );
        }
      });
    }
  },
];

exports.stock_delete = function (req, res, next) {
  Stock.deleteMany({ product: req.params.id }).exec(function (err, stock) {
    if (err) {
      return next(err);
    }
    res.redirect(`/product/${req.params.id}`);
  });
};
