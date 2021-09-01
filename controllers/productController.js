const Product = require("../models/product");
const Stock = require("../models/stock");
const Brand = require("../models/brand");
const async = require("async");

exports.product_list = function (req, res) {
  Product.find({}, "name description")
    .populate("description")
    .exec(function (err, description) {
      if (err) {
        return next(err);
      }

      res.render("product_list", { product_list: description });
    });
};

exports.product_stock = function (req, res) {
  // Display detail page for a specific product.

  async.parallel(
    {
      product: function (callback) {
        Product.findById(req.params.id)
          .populate("brand")
          .populate("name")
          .populate("description")
          .populate("price")
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
      console.log();
      // Successful, so render.
      res.render("product_detail", {
        product: results.product,
        product_stock: results.product_stock,
        brand: results.product.brand[0].name,
      });
    }
  );
};
