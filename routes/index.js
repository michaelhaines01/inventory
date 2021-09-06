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

router.get("/product/create", productController.product_create_get);
router.post("/product/create", productController.product_create_post);
router.get("/product/", productController.product_list);
router.get("/product/:id/", productController.product_stock);

//Brands
router.get("/brands/create", brandController.brand_create_get);
router.post("/brands/create", brandController.brand_create_post);
router.get("/brands/:id/delete", brandController.brand_delete_get);
router.post("/brands/:id/delete", brandController.brand_delete_post);
router.get("/brands/", brandController.brand_list);
router.get("/brands/:id", brandController.brand_products);

router.get("/categories/", categoriesController.category_list);
router.get("/category/:id", categoriesController.category_products);
module.exports = router;
