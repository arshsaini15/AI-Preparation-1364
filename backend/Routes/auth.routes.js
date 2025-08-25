const {Router} = require('express');
const {signinController, registerUser, logoutController} = require('../Controllers/auth.controller.js');
const router = Router();

router.post("/signup", registerUser)
router.post("/signin", signinController)
router.post("/logout", logoutController)

module.exports = router