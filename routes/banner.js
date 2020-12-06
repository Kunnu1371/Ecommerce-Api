const express = require('express')
const router = express.Router()

const { adminById } = require('../controllers/admin')
const  { requireSignin, isAdmin, isAuth}  = require('../controllers/authAdmin')
const { bannerById, create, read, update, remove } = require('../controllers/banner')


router.get('/banner/:bannerId', read)
router.post('/banner/create/:adminId', requireSignin, isAdmin, isAuth, create)
router.put('/banner/update/:bannerId/:adminId', requireSignin, isAdmin, isAuth, update)
router.delete('/banner/remove/:bannerId/:adminId', requireSignin, isAdmin, isAuth, remove)
 
router.param('bannerId', bannerById)
router.param('adminId', adminById)

module.exports = router;