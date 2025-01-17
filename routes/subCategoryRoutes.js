const router = require("express").Router();
const subCategoryControllers = require("../controllers/subCategoryControllers");


router.post(
  "/create",
  subCategoryControllers.sub_category_create
);
router.get("/list-display", subCategoryControllers.list_display);

module.exports = router;
