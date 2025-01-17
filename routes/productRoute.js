const router = require("express").Router();
const productControllers = require("../controllers/productControllers");


router.post("/create", productControllers.create);
router.get("/list-display", productControllers.list_display);

module.exports = router;

