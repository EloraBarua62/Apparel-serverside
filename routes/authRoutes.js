const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

router.get("/get-user", userControllers.get_user);
router.post("/signup", userControllers.signup);

module.exports = router;
