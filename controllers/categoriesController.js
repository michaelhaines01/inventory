const Category = require("../models/categories");

exports.category_list = function (req, res) {
  Category.find({}, "type")
    .populate("type")
    .exec(function (err, type) {
      if (err) {
        return next(err);
      }

      res.render("category_list", {
        category_list: type,
      });
    });
};
