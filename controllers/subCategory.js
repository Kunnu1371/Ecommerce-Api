const RootCategory = require('../models/rootCategory')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const Product = require('../models/product')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.subCategoryById = (req, res, next, id) => {
    SubCategory.findById(id).exec((err, subcategory) => {
        if(err || !subcategory) {
            res.status(404).json({
                error: "Sub Category not found."
            })
        }
        req.subcategory = subcategory
        next();
    }) 
}

exports.read = async(req, res) => {
    try {
        const subcategory = await SubCategory.findById(req.subcategory._id).populate('category', '_id name').populate('rootcategory', '_id name')
        return res.status(200).json({ 
            status: "success",
            subcategory
        })
    }
    catch(e) {
        return res.json(400).json(e)
    }
}

// exports.create = async (req, res) => {

    // if(!req.body.name || req.body.name.trim() == "") {
    //     return res.status(400).json({
    //         error: "Name is required. Please enter name"
    //     })
    // }

    // if(!req.body.category || req.body.category.trim() == "") {
    //     return res.status(400).json({
    //         error: "Category ID is required. Please enter category ID"
    //     })
    // }

    
    // if(!req.body.rootcategory || req.body.rootcategory.trim() == "") {
    //     return res.status(400).json({
    //         error: "Root Category ID is required. Please enter root category ID"
    //     })
    // }

    // const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory})
    // if(!rootcategory) {
    //     return res.status(400).json({
    //         error: "Root Category doesn't exist. Please make one."
    //     })
    // }

    // const category = await Category.findOne({_id: req.body.category})
    // if(!category) {
    //     return res.status(400).json({
    //         error: "Category doesn't exist. Please make one."
    //     })
    // }
    
    // if(await SubCategory.findOne({ name: {$regex:`${req.body.name}`, $options:"$i"}})) {
    //     res.status(400).json({error: "Sub Category already exist."})
    // }
//     else {
//         const subcategory = new SubCategory(req.body)
//         subcategory.save((err, subcategory) => {
//             if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })}
//             res.status(201).json({
//                 status: "success",
//                 message: "Sub Category has been created successfully.", 
//                 subcategory
//             })
//         })
//     }
// }

// exports.update = async(req, res) => {

//     if(!req.body.name || req.body.name.trim() == "" || !req.body.rootcategory || req.body.rootcategory.trim() == "" || !req.body.category || req.body.category.trim() == "" ) return res.status(400).json({error: "All fields are required."})

//     const subcategory = req.subcategory
//     const rootcategory = await RootCategory.findOne({_id: req.body.rootcategory}) 
//     const category = await Category.findOne({_id: req.body.category}) 

//     if(!rootcategory) {
//         return res.status(400).json({
//             error: "Invalid Root Category or it doesn't exist."
//         })
//     }
//     if(!category) {
//         return res.status(400).json({
//             error: "Invalid Category or it doesn't exist."
//         })
//     }
   
//     await SubCategory.findOneAndUpdate({_id: subcategory._id}, {$set: req.body}, {new: true}).exec((err, updatedsubcategory) => {
//         if(err) {
//             return res.status(500).json({
//                 error: errorHandler(err)
//             })
//         }
//         res.status(201).json({
//             status: "success",
//             message: "Sub Category has been updated successfully",
//             updatedsubcategory
//         })
//     })
// }

exports.remove = (req, res) => {
    let subcategory = req.subcategory
    subcategory.remove((err, deletedsubcategory) => {
        if(err) {
            return res.status(500).json({error: err})
        }
        res.status(200).json({
            status: "success",
            "message": "Sub Category has been deleted successfully."
        })
    })
}



exports.list = async(req, res) => {
    await SubCategory.find().exec((err, subcategories) => {
        if(err) {
            res.status(500).json({error: err})
        }
        res.status(200).json({
            status: "success",   
            total: subcategories.length,
            subcategories
        }) 
    })
}

exports.paginatedResults = (Product) => {
    return async (req, res, next) => {
        let order = req.query.order ? req.query.order : 'asc';
        let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
        let limit = req.query.limit ? parseInt(req.query.limit) : 6;
        const page = parseInt(req.query.page)

        console.log(req.query)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
        const products = await Product.find({subcategory: req.subcategory._id}).countDocuments()
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
            results.products = await Product.find({subcategory: req.subcategory._id})
                                            // .select("-photo")
                                            .populate("rootcategory", "_id name")
                                            .populate("category", "_id name")
                                            .populate("subcategory", "_id name")
                                            .sort([[sortBy, order]])
                                            .limit(limit)
                                            .skip(startIndex)
                                            .exec()
            res.json({status: "success", total: products, results})
            next()
        } catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
}