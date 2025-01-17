const router = require("express").Router();
const brandControllers = require("../controllers/brandControllers");


router.post("/create", brandControllers.create);
router.get("/list-display", brandControllers.list_display);

module.exports = router;
