const { 
    FrontendRootCategory,
    FrontendCategory,
    FrontendSubCategory,
    FrontendProduct
} = require('../models/trending')

const RootCategory = require('../models/rootCategory')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const Product = require('../models/product')

const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.trendingRootCategoryById = (req, res, next, id) => {
    FrontendRootCategory.findById(id).exec((err, frontendRootCategory) => {
        if(err || !frontendRootCategory) {
            return res.status(404).json({
                error: "not found"
            })
        }
        req.frontendRootCategory = frontendRootCategory;
        next();
    })
}

exports.trendingCategoryById = (req, res, next, id) => {
    FrontendCategory.findById(id).exec((err, frontendCategory) => {
        if(err || !frontendCategory) {
            return res.status(404).json({
                error: "not found"
            })
        }
        req.frontendCategory = frontendCategory;
        next();
    })
}

exports.trendingSubCategoryById = (req, res, next, id) => {
    FrontendSubCategory.findById(id).exec((err, frontendSubCategory) => {
        if(err || !frontendSubCategory) {
            return res.status(404).json({
                error: "not found"
            })
        }
        req.frontendSubCategory = frontendSubCategory;
        next();
    })
}

exports.trendingProductById = (req, res, next, id) => {
    FrontendProduct.findById(id).exec((err, frontendProduct) => {
        if(err || !frontendProduct) {
            return res.status(404).json({
                error: "not found"
            })
        }
        req.frontendProduct = frontendProduct;
        next();
    })
}
 

// FUNCTIONS FOR ROOT CATEGORY
exports.readTrendingRootCategory = (req, res) => {
    return res.status(200).json(req.frontendRootCategory)
}


exports.createTrendingRootCategory = async(req, res) => {
    const rootcategory = await RootCategory.findById(req.params.rootcategoryId)
    const object = {
        name: rootcategory.name,
        rootcategoryId: rootcategory._id,
        photo: rootcategory.photo
    }
    const frontendrootcategory = new FrontendRootCategory(object)
    frontendrootcategory.save((err, result) => {
        if(err) return res.status(500).json(err)
        return res.status(201).json({
            status: "success",
            message: "created",
            result
        })
    })
}

exports.updateTrendingRootCategory = async (req, res) => {
    try {
        const updated = await FrontendRootCategory.findOneAndUpdate({_id: req.params.trendingRootCategoryId}, {$set: req.body}, {new: true})
        return res.status(201).json({
            status: "success",
            updated
        })
    } catch(e) {
        return res.status(400).json(e.message)
    }
}

exports.removeTrendingRootCategory = (req, res) => {
    let rootcategory = req.frontendRootCategory
    rootcategory.remove((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "deleted successfully."
        })
    })
}


// FUCNTIONS FOR CATEGORY
exports.readTrendingCategory = (req, res) => {
    return res.status(200).json(req.frontendCategory)
}

exports.createTrendingCategory = async (req, res) => {
    const category = await Category.findById(req.params.categoryId)
    const object = {
        name: category.name,
        categoryId: category._id,
        photo: category.photo
    }
    const frontendcategory = new FrontendCategory(object)
    frontendcategory.save((err, result) => {
        if(err) return res.status(500).json(err)
        return res.status(201).json({
            status: "success",
            message: "created",
            result
        })
    })
}

exports.updateTrendingCategory = async (req, res) => {
    try {
        const updated = await FrontendCategory.findOneAndUpdate({_id: req.params.trendingCategoryId}, {$set: req.body}, {new: true})
        return res.status(201).json({
            status: "success",
            updated
        })
    } catch(e) {
        return res.status(400).json(e.message)
    }
}

exports.removeTrendingCategory = (req, res) => {
    let category = req.frontendCategory
    category.remove((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "deleted successfully."
        }) 
    })
}



// FUCNTIONS FOR SUB CATEGORY
exports.readTrendingSubCategory = (req, res) => {
    return res.status(200).json(req.frontendSubCategory)
}

exports.createTrendingSubCategory = async (req, res) => {
    const subcategory = await SubCategory.findById(req.params.subcategoryId)
    const object = {
        name: subcategory.name,
        subcategoryId: subcategory._id,
        photo: subcategory.photo
    }
    const frontendcategory = new FrontendSubCategory(object)
    frontendcategory.save((err, result) => {
        if(err) return res.status(500).json(err)
        return res.status(201).json({
            status: "success",
            message: "created",
            result
        })
    })
}

exports.updateTrendingSubCategory = async (req, res) => {
    try {
        const updated = await FrontendSubCategory.findOneAndUpdate({_id: req.params.trendingSubCategoryId}, {$set: req.body}, {new: true})
        return res.status(201).json({
            status: "success",
            updated
        })
    } catch(e) {
        return res.status(400).json(e.message)
    }
}

exports.removeTrendingSubCategory = (req, res) => {
    let subcategory = req.frontendSubCategory
    subcategory.remove((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "deleted successfully."
        })
    })
}




// FUCNTIONS FOR PRODUCT
exports.readTrendingProduct = (req, res) => {
    return res.status(200).json(req.frontendProduct)
}

exports.createTrendingProduct = async(req, res) => {
    const product = await Product.findById(req.params.productId)
    const object = {
        name: product.name,
        productId: product._id,
        photo: product.photo
    }
    const frontendcategory = new FrontendProduct(object)
    frontendcategory.save((err, result) => {
        if(err) return res.status(500).json(err)
        return res.status(201).json({
            status: "success",
            message: "created",
            result
        })
    })
}

exports.updateTrendingProduct = async (req, res) => {
    try {
        const updated = await FrontendProduct.findOneAndUpdate({_id: req.params.trendingProductId}, {$set: req.body}, {new: true})
        return res.status(201).json({
            status: "success",
            updated
        })
    } catch(e) {
        return res.status(400).json(e.message)
    }
}

exports.removeTrendingProduct = (req, res) => {
    let product = req.FrontendProduct
    product.remove((err, result) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            message: "deleted successfully."
        })
    })
}