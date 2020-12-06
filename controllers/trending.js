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
    // return res.json(rootcategory)
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

exports.updateTrendingRootCategory = (req, res) => {
    
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
    return res.status(200).json(req.frontendRootCategory)
}

exports.createTrendingCategory = (req, res) => {

}

exports.updateTrendingCategory = (req, res) => {

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

exports.createTrendingSubCategory = (req, res) => {

}

exports.updateTrendingSubCategory = (req, res) => {

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

exports.createTrendingProduct = (req, res) => {

}

exports.updateTrendingProduct = (req, res) => {

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