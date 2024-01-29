const router = require("express").Router();
const authControllers = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

// route
router.post("/admin-signup", authControllers.admin_signup);
router.post("/admin-login", authMiddleware, authControllers.admin_login);
router.get("/get-user", authMiddleware, authControllers.getUser);
router.post("/seller-signup", authControllers.seller_signup);
router.post("/seller-login", authMiddleware, authControllers.seller_login);
router.post(
  "/profile-image-upload",
  authMiddleware,
  authControllers.profile_image_upload
);

module.exports = router;
