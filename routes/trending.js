const express = require('express')
const router = express.Router()

const { adminById } = require('../controllers/admin')
const  { requireSignin, isAdmin, isAuth}  = require('../controllers/authAdmin')
const {
    trendingRootCategoryById,
    trendingCategoryById,
    trendingSubCategoryById,
    trendingProductById
} = require('../controllers/trending')

const {
    readTrendingRootCategory,
    createTrendingRootCategory,
    updateTrendingRootCategory,
    removeTrendingRootCategory,

    readTrendingCategory,
    createTrendingCategory,
    updateTrendingCategory,
    removeTrendingCategory,

    readTrendingSubCategory,
    createTrendingSubCategory,
    updateTrendingSubCategory,
    removeTrendingSubCategory,

    readTrendingProduct,
    createTrendingProduct,
    updateTrendingProduct,
    removeTrendingProduct
} = require('../controllers/trending')

router.get('/trendingRootCategory/:trendingRootCategoryId', readTrendingRootCategory)
router.post('/trendingRootCategory/create/:rootcategoryId/:adminId', requireSignin, isAdmin, isAuth, createTrendingRootCategory)
router.put('/trendingRootCategory/update/:trendingRootCategoryId/:adminId', requireSignin, isAdmin, isAuth, updateTrendingRootCategory)
router.delete('/trendingRootCategory/remove/:trendingRootCategoryId/:adminId', requireSignin, isAdmin, isAuth, removeTrendingRootCategory)

router.get('/trendingCategory/:trendingCategoryId', readTrendingCategory)
router.post('/trendingCategory/create/:adminId', requireSignin, isAdmin, isAuth, createTrendingCategory)
router.put('/trendingCategory/update/:trendingCategoryId/:adminId', requireSignin, isAdmin, isAuth, updateTrendingCategory)
router.delete('/trendingCategory/remove/:trendingCategoryId/:adminId', requireSignin, isAdmin, isAuth, removeTrendingCategory)

router.get('/trendingSubCategory/:trendingSubCategoryId', readTrendingSubCategory)
router.post('/trendingSubCategory/create/:adminId', requireSignin, isAdmin, isAuth, createTrendingSubCategory)
router.put('/trendingSubCategory/update/:trendingSubCategoryId/:adminId', requireSignin, isAdmin, isAuth, updateTrendingSubCategory)
router.delete('/trendingSubCategory/remove/:trendingSubCategoryId/:adminId', requireSignin, isAdmin, isAuth, removeTrendingSubCategory)

router.get('/trendingProduct/:trendingProductId', readTrendingProduct)
router.post('/trendingProduct/create/:adminId', requireSignin, isAdmin, isAuth, createTrendingProduct)
router.put('/trendingProduct/update/:trendingProductId/:adminId', requireSignin, isAdmin, isAuth, updateTrendingProduct)
router.delete('/trendingProduct/remove/:trendingProductId/:adminId', requireSignin, isAdmin, isAuth, removeTrendingProduct)


router.param('adminId', adminById)
router.param('trendingRootCategoryId', trendingRootCategoryById)
router.param('trendingCategoryId', trendingCategoryById)
router.param('trendingSubCategoryId', trendingSubCategoryById)
router.param('trendingProductId', trendingProductById)

const {rootcategoryById } = require('../controllers/rootCategory')
router.param('rootcategoryId', rootcategoryById)


module.exports = router;