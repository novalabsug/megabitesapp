const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/reservation', authController.reservation_get);
router.post('/reservation', authController.reservation_post);

router.post('/comment', authController.comment_post);
router.get('/comment', authController.comment_get);

router.get('/custome_menu', authController.customeMenu_get);

router.post('/contact', authController.contact_post);

router.post('/cart', authController.cart_post);
router.get('/cart', authController.cart_get);

router.post('/menu', authController.menus_post);

router.post('/order', authController.order_post);

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);

router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.get('/admin', authController.admin_panel);

module.exports = router;