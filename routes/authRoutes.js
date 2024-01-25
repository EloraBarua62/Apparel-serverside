const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const { authMiddleware } = require('../middlewares/authMiddleware');


// route
router.post('/admin-signup', authControllers.admin_signup)
router.post('/admin-login', authControllers.admin_login)
router.get('/get-user', authMiddleware, authControllers.getUser)
router.post('/seller-signup', authControllers.seller_signup);
router.post('/seller-login', authControllers.seller_login);

module.exports = router