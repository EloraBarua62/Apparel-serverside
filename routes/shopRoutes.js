const router = require("express").Router();
const shopControllers = require("../controllers/shopControllers");

router.post("/create", shopControllers.create);
router.get("/list-display", shopControllers.list_display);

module.exports = router;
