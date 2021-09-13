const Brand = require("../models/brand");
const Product = require("../models/product");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.brand_list = function (req, res) {
  Brand.find({}, "name description brandimage")
    .populate("name")

    .exec(function (err, name) {
      if (err) {
        return next(err);
      }
      console.log(name);
      res.render("brand_list", {
        brand_list: name,
      });
    });
};

exports.brand_products = function (req, res, next) {
  Product.find({ "brand": req.params.id })
    .populate("brand")

    .exec(function (err, products) {
      if (err) {
        return next(err);
      }
      console.log(products.length);
      if (products.length === 0) {
        var err = new Error("No product found");
        err.status = 404;
        return next(err);
      }

      res.render("brand_products", {
        brand_products: products,
        brand: products[0].brand[0].name,
      });
    });
};

exports.brand_create_get = function (req, res, next) {
  res.render("brand_form", { title: "Create Brand" });
};

// Handle Genre create on POST.
exports.brand_create_post = [
  // Validate and santize the name field.
  body("name", "Brand name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create Brand",

        errors: errors.array(),
      });
      return;
    } else {
      // Check if Brand with same name already exists.
      Brand.findOne({ "name": req.body.name }).exec(function (
        err,
        found_brand
      ) {
        if (err) {
          return next(err);
        }

        if (found_brand) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_brand.url);
        } else {
          brand = new Brand({
            name: req.body.name,
            description: req.body.description,
            brandimage: `../images/${req.file.filename}`,
          });

          brand.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

exports.brand_delete_get = function (req, res, next) {
  console.log(req.params.id);

  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brand_products: function (callback) {
        Product.find({
          brand: req.params.id,
        }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.brand === null) {
        res.redirect("/brands");
      }

      console.log(results.brand_products);
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: results.brand,
        brand_products: results.brand_products,
      });
    }
  );
};

exports.brand_delete_post = function (req, res, next) {
  async.parallel(
    {
      author: function (callback) {
        Brand.findById(req.body.authorid).exec(callback);
      },
      brand_products: function (callback) {
        Product.find({ "brand": req.body.authorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.brand_products.length > 0) {
        // brand has products. Render in same way as for GET route.
        res.render("brand_delete", {
          title: "Delete Brand",
          brand: results.brand,
          brand_products: results.brand_products,
        });
        return;
      } else {
        // brand has no books. Delete object and redirect to the list of authors.
        Brand.findByIdAndRemove(req.body.brandid, function deleteBrand(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect("/brands");
        });
      }
    }
  );
};
