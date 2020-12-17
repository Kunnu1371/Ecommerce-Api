const express = require('express')
const router = express.Router()

const  { requireSignin, isAdmin, isAuth}  = require('../controllers/authAdmin')
const  { adminById, read, update, removeUser, removeAdmin, TotalUsers, OrderList, userInfo }  = require('../controllers/admin')
const { userById, purchaseHistory } = require('../controllers/user')
const User = require('../models/user')
const Order = require('../models/order')

router.get('/admin/:adminId', requireSignin, isAuth, isAdmin, read)
router.put('/admin/:adminId', requireSignin, isAuth, isAdmin, update)
router.delete('/user/remove/:adminId', requireSignin, isAuth, isAdmin, removeUser)
router.delete('/admin/remove/:adminId', requireSignin, isAuth, isAdmin, removeAdmin)
router.get('/order/by/user/:userId/:adminId', requireSignin, isAuth, isAdmin, purchaseHistory)
router.get('/users/:adminId', requireSignin, isAuth, isAdmin, TotalUsers(User))
router.get('/orders/:adminId', requireSignin, isAuth, isAdmin, OrderList(Order))
router.get('/user/:userId/:adminId', isAdmin, userInfo)

 
router.param('userId', userById)
router.param('adminId', adminById)

module.exports = router;