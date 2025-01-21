const router = require("express").Router();
const categoryControllers = require("../controllers/categoryControllers");


router.post("/create", categoryControllers.create);
router.get("/list-display", categoryControllers.list_display);
router.get("/category-list", categoryControllers.category_list);

module.exports = router;
