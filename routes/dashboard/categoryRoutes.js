const router = require("express").Router();
const categoryControllers = require("../../controllers/dashboard/categoryControllers");
const { authMiddleware } = require("../../middlewares/authMiddleware");

router.post("/category-add", authMiddleware, categoryControllers.category_add);

module.exports = router;
