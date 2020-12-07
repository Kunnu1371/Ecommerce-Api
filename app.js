require('dotenv').config();
const express = require('express')
const app = express()
const authUserRoutes = require('./routes/authUser')
const authAdminRoutes = require('./routes/authAdmin')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const rootCategoryRoutes = require('./routes/rootCategory')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subCategory')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const carousalRoutes = require('./routes/carousal')
const voucherRoutes = require('./routes/voucher')
const cartRoutes = require('./routes/cart')
const wishListRoutes = require('./routes/wishlist')
const bannerRoutes = require('./routes/banner')
const trendingRoutes = require('./routes/trending')
const searchRoute = require('./routes/searchProduct')
const cors = require('cors')

// importing Middlewares
const morgran = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')

// Middlewares
app.use(morgran('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(expressValidator());
app.use(cors())
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})



// Routes
app.use('/api', authUserRoutes)
app.use('/api', authAdminRoutes)
app.use('/api', userRoutes)
app.use('/api', adminRoutes)
app.use('/api', rootCategoryRoutes)
app.use('/api', categoryRoutes)
app.use('/api', subCategoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/api', carousalRoutes)
app.use('/api', voucherRoutes)
app.use('/api', cartRoutes)
app.use('/api', wishListRoutes)
app.use('/api', bannerRoutes)
app.use('/api', trendingRoutes)
app.use('/api', searchRoute)

app.listen(3000, () => {
    console.log(`Server started on port 3000`)
})
require('./config/dbConnection')  