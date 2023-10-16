const {Router} = require('express')
const router = Router();
const authController = require('../controller/authController')



router.get('/signup',authController.signup_get);
router.get('/login',authController.login_get);
router.post('/signup',authController.signup_post)
router.post('/login',authController.longin_post)
router.get('/logout',authController.logout_get);
router.get('/profile',authController.getProfile);
// router.get('/',authController.longin_post)
// router.get('/',)
module.exports = router