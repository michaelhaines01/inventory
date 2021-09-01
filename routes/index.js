var express = require("express");
var router = express.Router();

//Import Controllers
const productController = require("../controllers/productController");
const brandController = require("../controllers/brandController");
const categoriesController = require("../controllers/categoriesController");
/* GET home page. */

//Products routes
router.get("/", function (req, res, next) {
  res.redirect("/product");
});

router.get("/product/", productController.product_list);
router.get("/product/:id/", productController.product_stock);

router.get("/brands/", brandController.brand_list);
router.get("/brands/:id", brandController.brand_products);

router.get("/categories/", categoriesController.category_list);

module.exports = router;
