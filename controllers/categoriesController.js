const Category = require("../models/categories");
const Product = require("../models/product");

exports.category_products = function (req, res, next) {
  Product.find({ "category": req.params.id })

    .populate("category")

    .exec(function (err, products) {
      if (err) {
        return next(err);
      }

      if (products.length === 0) {
        console.log("here");
        var err = new Error("No product found");
        err.status = 404;
        return next(err);
      }
      res.render("category_products", {
        category_products: products,
        category: products[0].category[0].type,
      });
    });
};
/* */
