const expess = require('express')
const router = expess.Router()

const { addToCart, getCartItems, Increase, Decrease, deleteCartItems, getCartTotal, moveToWishlist, Update, deleteAllItems } = require('../controllers/cart')
const { productById } = require('../controllers/product')
const { userById } = require('../controllers/user')
const { requireSignin, isAuth } = require('../controllers/authUser')

router.get('/cart/:userId', requireSignin, isAuth, getCartItems)
router.post('/cart/add-to-cart/:productId/:userId', requireSignin, isAuth, addToCart)
router.post('/cart/update/increase/:productId/:userId', requireSignin, isAuth, Increase)
router.post('/cart/update/decrease/:productId/:userId', requireSignin, isAuth, Decrease)
router.put('/cart/update/:productId/:userId', requireSignin, isAuth, Update)
router.delete('/cart/remove/:productId/:userId', requireSignin, isAuth, deleteCartItems)
router.post('/cart/cartTotal/:userId', requireSignin, isAuth, getCartTotal)
router.delete('/cart/remove/:userId', requireSignin, isAuth, deleteAllItems)
router.post('/cart/move-to-wishlist/:productId/:userId', requireSignin, isAuth, moveToWishlist)

router.param('productId', productById)
router.param('userId', userById)
module.exports = router