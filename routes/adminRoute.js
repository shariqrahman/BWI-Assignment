const router = require('express').Router();;
const Controller = require('../controller/controller');
const upload = require('../imageController/uploadImage');

router.post('/create', upload, Controller.signup);

router.get('/profile/:adminId', Controller.adminProfile);

router.get('/users/:adminId', Controller.users)

router.get('/users/profile/:adminId/:userId', Controller.userProfile);

router.put('/users/update/:adminId/:userId', upload, Controller.upadateUserProfile);

router.delete('/users/delete/:adminId/:userId', Controller.deleteUserProfile);

module.exports = router;