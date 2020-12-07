const router = require('express').Router()

const Product = require('../models/product')

router.get('/search', async function(req, res) {
    const keyword = req.query.keyword 
                    ? {
                        name: {
                            $regex: req.query.keyword, 
                            $options:"$i"
                        },
                    }
                    : {}
    const products = await Product.find({...keyword})
    return res.status(200).json({
        status: "success",
        total: products.length,
        products
    })
})

module.exports = router