const Brand = require("../models/brand");
const Product = require("../models/product");
exports.brand_list = function (req, res) {
  Brand.find({}, "name description")
    .populate("name")
    .exec(function (err, name) {
      if (err) {
        return next(err);
      }

      res.render("brand_list", {
        brand_list: name,
      });
    });
};

exports.brand_products = function (req, res) {
  console.log("here");
  console.log(req.params.id);

  Product.find({ brand: [0].req.params.id })
    .populate("name")
    .exec(function (err, products) {
      if (err) {
        return next(err);
      }

      res.render("brand_list", {
        brand_products: products,
      });
    });
};
