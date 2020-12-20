const router = require('express').Router()
const {recover, reset, resetPassword} = require('../controllers/password reset')
const { userPasswordResetValidator } = require('../validator/index');

router.post('/recover', recover)
router.get('/reset/:token', reset)
router.post('/reset/:token', userPasswordResetValidator, resetPassword)

module.exports = router