var express = require("express");
var router = express.Router();
const multer = require("multer");
//Multer
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

//Import Controllers
const productController = require("../controllers/productController");
const brandController = require("../controllers/brandController");
const categoriesController = require("../controllers/categoriesController");
const stockController = require("../controllers/stockController");
/* GET home page. */

//Products routes
router.get("/", function (req, res, next) {
  res.redirect("/product");
});

//Delete stock
router.get("/product/:id/delete_stock", stockController.stock_delete);
//stock
router.get("/product/:id/stock", stockController.stock_product);
router.post("/product/:id/stock", stockController.stock_product_post);

router.get("/product/create", productController.product_create_get);
router.post(
  "/product/create",
  upload.single("productimage"),
  productController.product_create_post
);
router.get("/product/", productController.product_list);
router.get("/product/:id/", productController.product_stock);
router.get("/product/:id/delete_product", productController.delete_product);
//Brands
router.get("/brands/create", brandController.brand_create_get);
router.post(
  "/brands/create",
  upload.single("brandimage"),
  brandController.brand_create_post
);

router.get("/brands/:id/delete", brandController.brand_delete_get);
router.post("/brands/:id/delete", brandController.brand_delete_post);
router.get("/brands/", brandController.brand_list);
router.get("/brands/:id", brandController.brand_products);

router.get("/category/:id", categoriesController.category_products);
module.exports = router;
