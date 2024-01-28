const router = require("express").Router();
const productController = require("../../controllers/dashboard/productController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/product-add", authMiddleware, productController.product_add);
router.get("/product-get", authMiddleware, productController.product_get);
router.post("/product-update/:productId", authMiddleware, productController.product_update);

module.exports = router;
