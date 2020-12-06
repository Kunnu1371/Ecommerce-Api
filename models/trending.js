const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const frontendRootCategorySchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, default: 'rootcategory' },
    rootcategoryId: {
        type: ObjectId,
        ref: 'RootCategory',
        required: true
    },
    show: {
        type: Boolean, 
        default: 1
    },
    photo: {
        type: Array,
        default: []
    },
},{
    timestamps: true
})


const frontendCategorySchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, default: 'category' },
    categoryId: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    show: {
        type: Boolean, 
        default: 1
    },
    photo: {
        type: Array,
        default: []
    },
},{
    timestamps: true
})


const frontendSubCategorySchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, default: 'subcategory' },
    subcategoryId: {
        type: ObjectId,
        ref: 'SubCategory',
        required: true
    },
    show: {
        type: Boolean, 
        default: 1
    },
    photo: {
        type: Array,
        default: []
    },
},{
    timestamps: true
})


const frontendProductSchema = new mongoose.Schema({
    name: { type: String },
    type: { type: String, default: 'product' },
    productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
    },
    show: {
        type: Boolean, 
        default: 1
    },
    photo: {
        type: Array,
        default: []
    },
},{
    timestamps: true
})

exports.FrontendRootCategory = mongoose.model('FrontendRootCategory', frontendRootCategorySchema);
exports.FrontendCategory = mongoose.model('FrontendCategory', frontendCategorySchema);
exports.FrontendSubCategory = mongoose.model('FrontendSubCategory', frontendSubCategorySchema);
exports.FrontendProduct = mongoose.model('FrontendProduct', frontendProductSchema);