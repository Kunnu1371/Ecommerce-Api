const expess = require('express')
const router = expess.Router()

const { addToWishlist, getWishlistItems, deleteWishlistItems, moveToCart } = require('../controllers/wishlist')
const { productById } = require('../controllers/product')
const { userById } = require('../controllers/user')
const { requireSignin, isAuth } = require('../controllers/authUser')

router.get('/wishlist/:userId', requireSignin, isAuth, getWishlistItems)
router.post('/wishlist/add-to-wishlist/:productId/:userId', requireSignin, isAuth, addToWishlist)
router.post('/wishlist/move-to-cart/:productId/:userId', requireSignin, isAuth, moveToCart)
router.delete('/wishlist/remove/:productId/:userId', requireSignin, isAuth, deleteWishlistItems)

router.param('productId', productById)
router.param('userId', userById)

module.exports = router