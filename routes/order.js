const express = require('express')
const router = express.Router()

const  { requireSignin, isAuth, isAdmin }  = require('../controllers/authAdmin')
const  { userById }  = require('../controllers/user')
const { adminById } = require('../controllers/admin')
const { decreaseQuantity } = require('../controllers/product')
const  { create, updateOrderStatus, orderById, getOrderDetail, TotalOrders }  = require('../controllers/order')

router.post('/order/create/:userId', requireSignin, isAuth, decreaseQuantity,  create)
router.get('/order/:orderId/:userId', requireSignin, isAuth, getOrderDetail)
router.put('/order/:orderId/status/:adminId', requireSignin, isAuth, isAdmin, updateOrderStatus)
router.get('/orders/total/:adminId', requireSignin, isAdmin, isAuth, TotalOrders)

router.param('userId', userById)
router.param('adminId', adminById)
router.param('orderId', orderById) 

module.exports = router;