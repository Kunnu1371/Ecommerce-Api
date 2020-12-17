const router = require('express').Router()

const Product = require('../models/product')

router.get('/search', async function(req, res) {
    const keyword = req.query.keyword
                    ? {
                        name: {
                            $regex: req.query.keyword, 
                            $options:"$i"
                        },
                        // description: {
                        //     $regex: req.query.keyword, 
                        //     $options:"$i"
                        // },
                    }
                    : {}

    const page = parseInt(req.query.page)
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    console.log(req.query)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const results = {}

        if (endIndex < await Product.countDocuments().exec()) {
            results.next = {
            page: page + 1,
            limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous = {
            page: page - 1,
            limit: limit
            }
        }
        try {
            results.products = await Product.find({...keyword})
                                            .sort([[sortBy, order]])
                                            .limit(limit)
                                            .skip(startIndex)
                                            .exec()
            return res.status(200).json({
                status: "success", 
                total: results.products.length, 
                results
            })
        } catch(e) {
            return res.status(400).json(e.message)
        }
})

module.exports = router