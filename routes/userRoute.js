const router = require('express').Router();
const Controller = require('../controller/controller');
const isLoggedInAuth = require('../middlewares/isLoggedInAuth');
const upload = require('../imageController/uploadImage');
const auth = require('../middlewares/isAuth');

router.post('/signup', upload, Controller.signup);

router.post('/login', Controller.login);

router.get('/profile/:userId', isLoggedInAuth, auth, Controller.userProfile);

router.put('/update/:userId', isLoggedInAuth, upload, auth, Controller.upadateUserProfile);

router.delete('/delete/:userId', isLoggedInAuth, auth, Controller.deleteUserProfile);

router.post('/logout', isLoggedInAuth, auth, Controller.logout);

module.exports = router;