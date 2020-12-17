const Cart = require('../models/cart')
const Wishlist = require('../models/wishlist')

exports.addToWishlist = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId

    const userWishlist = await Wishlist.findOne({user: user})
    let productExist = 0
    if(userWishlist) {
        productsInUserWishlist = userWishlist.products
        // checking product exist in wishlist or not by comparing the productId with the id's of products in wishlist in db
        for(product of productsInUserWishlist) {
            if(product.product == productId) {
                productExist = 1 //if product found break the loop
                break
            }
        }
        // console.log(product)
        if(productExist == 1) {
            return res.status(400).json({message: "Product is already present in Wishlist"})
        } 
        else {
            // if product not in wishlist push the new added product in products array
            Wishlist.findOneAndUpdate({_id: userWishlist._id}, {$push: {products: {product: productId}}}, {new: true}, (err, wishlist) => {
                if(err) return res.status(400).json(err)
                return res.status(201).json({
                    status: "success",
                    message: "Product added in Wishlist",
                    wishlist
                })
            })
        }
    }
    else {
        // if user wishlist doesn't exist make a new document in wishlist collection and add the product
        const wishlist = new Wishlist({user: user})
        await wishlist.save((err, cart) => {
            if(err) return res.status(400).json(err)
            Wishlist.findOneAndUpdate({_id: cart._id}, {$push: {products: {product: productId}}}, {new: true}, (err, wishlist) => {
                if(err) return res.status(400).json(err)
                return res.status(201).json({
                    status: "success",
                    message: "Product added in Wishlist",
                    wishlist
                })
            })
        })
    }
}


exports.getWishlistItems = async (req, res) => {
    const user = req.params.userId
    const userWishlist = await Wishlist.findOne({user: user})
                               .populate('user', '_id role name phone email')
                               .populate('products.product')
    if(userWishlist) {
        return res.status(200).json({
            status: "success",
            totalProductsInWishlist: userWishlist.products.length,
            userWishlist
        })
    } 
    else {
        return res.json("User's wishlist is Empty.")
    }
}


exports.deleteWishlistItems = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId
    const userWishlist = await Wishlist.findOne({user: user})
    let productExist = 0

    if(userWishlist) {
        productsInUserWishlist = userWishlist.products
        for(product of productsInUserWishlist) {
            if(product.product == productId) {
                productExist = 1
                await Wishlist.findOneAndUpdate({_id: userWishlist._id}, {$pull: {products: {product: productId}}}, {new: true}).exec((err, wishlist) => {
                    if(err) return res.status(500).json(err)
                    return res.status(200).json({
                        status: "success",
                        message: "Product removed from wishlist",
                        wishlist
                    })
                })
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in Wishlist"})
        }
    }
    else {
        return res.status(404).json({message: "User Wishlist is Empty."})
    }
}


exports.moveToCart = async (req, res) => {

    // how move the product from wishlist to cart is working => first delete the product from wishlist then add the same product in cart.

    const productId = req.params.productId
    const user = req.params.userId
    const userWishlist = await Wishlist.findOne({user: user})
    let productExist = 0

    if(userWishlist) {
        productsInUserWishlist = userWishlist.products
        for(product of productsInUserWishlist) {
            if(product.product == productId) {
                productExist = 1

                Wishlist.findOneAndUpdate({user: user}, {$pull: {products: {product: productId}}}, {new: true}).exec((err, cart) => {
                    if(err) return res.status(500).json(err)
                    Cart.findOneAndUpdate({user: user}, {$push: {products: {product: productId}}}, {new: true}).exec((err) => {
                        if(err) return res.status(500).json(err)
                        return res.status(200).json({
                            status: "success",
                            message: "Product moved to Cart."
                        })
                    })
                })
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in wishlist"})
        }
    } 
    else {
        return res.status(404).json({message: "User Wishlist is Empty."})
    }
    
}


exports.checkProduct = async(req, res) => {
    const productId = req.params.productId
    const userId = req.params.userId
    let isPresent = 0
    try {
        const userWishlist = await Wishlist.findOne({user: userId})
        const productsInUserWishlist = userWishlist.products
        for(product of productsInUserWishlist) {
            if(product.product == productId) {
                isPresent  = 1
                break
            }
        }
        res.json(isPresent)
    } catch(e) {
        return res.status(500).json(e.message)
    }
}