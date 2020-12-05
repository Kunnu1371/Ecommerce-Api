const Cart = require('../models/cart')
const Wishlist = require('../models/wishlist')
const Voucher = require('../models/voucher')

exports.addToCart = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId

    const userCart = await Cart.findOne({user: user})
    let productExist = 0
    if(userCart) {
        productsInUserCart = userCart.products
        // checking product exist in cart or not by comparing the productId with the id's of products in cart in db
        for(product of productsInUserCart) {
            if(product.product == productId) {
                productExist = 1 //if product found break the loop
                break
            }
        }
        // console.log(product)
        if(productExist == 1) {
            product.quantity += 1
            // saving changes after updating product quantity 
            userCart.save((err, cart) => {
                if(err) return res.status(400).json(err)
                return res.status(201).json({
                    status: "success",
                    message: "Product already in cart, updated the quantity.",
                    cart
                })
            }) 
        } 
        else {
            // if product not in cart push the new added product in products array
            Cart.findOneAndUpdate({_id: userCart._id}, {$push: {products: {product: productId}}}, {new: true}, (err, cart) => {
                if(err) return res.status(400).json(err)
                return res.status(201).json({
                    status: "success",
                    message: "Product added in cart",
                    cart
                })
            })
        }
    }
    else {
        // if user cart doesn't exist make a new document in cart collection and add the product
        const cart = new Cart({user: user})
        await cart.save((err, cart) => {
            if(err) return res.status(400).json(err)
            Cart.findOneAndUpdate({_id: cart._id}, {$push: {products: {product: productId}}}, {new: true}, (err, cart) => {
                if(err) return res.status(400).json(err)
                return res.status(201).json({
                    status: "success",
                    message: "Product added in cart",
                    cart
                })
            })
        })
    }
}

exports.getCartItems = async (req, res) => {
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
                               .populate('user', '_id role name phone email')
                               .populate('products.product')
    if(userCart) {
        return res.status(200).json({
            status: "success",
            totalProductsInCart: userCart.products.length,
            userCart
        })
    } 
    else {
        return res.json("User's cart is Empty.")
    }
}


exports.getCartTotal = (req, res) => {
    const user = req.params.userId
    Cart.findOne({user: user})
    .populate("products.product")
        .exec((err, data) => {
        if(err) return res.status(500).json(err)
        const products = data.products
        const priceArray = (products.map((product) => {
            // console.log(product.quantity, product.product.price)
            return (product.quantity * product.product.price)
        }))
        // console.log(priceArray)
        
        var Total = 0;
        for(var i = 0; i < priceArray.length; i++ ) {
            Total += priceArray[i]
        }

        const voucher = req.body.voucher
        if(voucher) {
            Voucher.findOne({name: voucher}).exec((err, voucher) => {
                if(err || !voucher) {
                    res.status(500).json({
                        error: "Invalid voucher"
                    })
                }
                if(voucher) {
                    // console.log(voucher)                    
                    if(voucher.isExpired == true || voucher.isActive == false) {
                        return res.status(200).json({message: "The voucher is no longer active or has been expired"})
                    } else {
                        // console.log(voucher.amount)
                        const updatedTotal = Total - voucher.amount
                        return res.status(200).json({
                            status: "success",
                            message: `Voucher applied successfully. You get a discount of ${voucher.amount}`,
                            cartTotal: updatedTotal
                        })               
                    }
                }
            })
        } else {
            return res.status(200).json({
                status: "success",
                cartTotal: Total
            })
        }  
    })
}



// Increase quantity of an Item in cart
exports.Increase = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user}) 
    let productExist = 0
    if(userCart) {
        productsInUserCart = userCart.products
        for(product of productsInUserCart) {
            if(product.product == productId) {
                productExist = 1
                product.quantity += 1
                userCart.save((err, cart) => {
                    if(err) return res.status(400).json(err)
                    return res.status(200).json({
                        status: "success",
                        message: "Product quantity updated.",
                        cart
                    })
                }) 
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in cart"})
        }
    }
    else {
        return res.status(404).json({message: "User cart is Empty."})
    }
} 


exports.Decrease = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
    let productExist = 0

    if(userCart) {
        productsInUserCart = userCart.products
        for(product of productsInUserCart) {
            if(product.product == productId) { 
                productExist = 1
                if(product.quantity <= 1) {
                    await Cart.findOneAndUpdate({_id: userCart._id}, {$pull: {products: {product: productId}}}, {new: true}).exec((err, cart) => {
                        if(err) return res.status(500).json(err)
                        return res.status(200).json({
                            status: "success",
                            message: "Product removed from cart",
                            cart
                        })
                    })
                    break
                }
                product.quantity -= 1
                userCart.save((err, cart) => {
                    if(err) return res.status(500).json(err)
                    return res.status(200).json({
                        status: "success",
                        message: "Product quantity updated.",
                        cart
                    })
                }) 
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in cart"})
        }
    }
    else {
        return res.status(404).json({message: "User cart is Empty."})
    }
}


exports.deleteCartItems = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
    productExist = 0

    if(userCart) {
        productsInUserCart = userCart.products
        for(product of productsInUserCart) {
            if(product.product == productId) {
                productExist = 1
                await Cart.findOneAndUpdate({_id: userCart._id}, {$pull: {products: {product: productId}}}, {new: true}).exec((err, cart) => {
                    if(err) return res.status(500).json(err)
                    return res.status(200).json({
                        status: "success",
                        message: "Product removed from cart",
                        cart
                    })
                })
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in cart"})
        }
    }
    else {
        return res.status(404).json({message: "User cart is Empty."})
    }
}


exports.Update = async (req, res) => {
    const productId = req.params.productId
    const user = req.params.userId
    const quantity = req.body.quantity
    const userCart = await Cart.findOne({user: user})
    productExist = 0
    if(userCart) {
        productsInUserCart = userCart.products
        for(product of productsInUserCart) {
            if(product.product == productId) {
                productExist = 1
                product.quantity = quantity
                userCart.save((err, cart) => {
                    if(err) return res.status(500).json(err)
                    return res.status(201).json({
                        status: "success",
                        message: "Updated product quantity.",
                        cart
                    })
                })
                break
            }
        }
    } else {
        return res.status(404).json({message: "Product not found in Cart"})
    }
}


exports.deleteAllItems = async (req, res) => {
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
    if(userCart) {
        Cart.findOneAndUpdate({user: user}, {$set: {products: []}}, {new: true}).exec((err, cart) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success",
                message: "All items in cart has been deleted",
                cart
            })
        })
    }
    else { return res.status(400).json({message: "Cart is Empty"})}
}

exports.moveToWishlist = async (req, res) => {

    // how move the product from cart to wishlist is working => first delete the product from cart then add the same product in wishlist.

    const productId = req.params.productId
    const user = req.params.userId
    const userCart = await Cart.findOne({user: user})
    let productExist = 0

    if(userCart) {
        productsInUserCart = userCart.products
        for(product of productsInUserCart) {
            if(product.product == productId) {
                productExist = 1
                
                await Cart.findOneAndUpdate({user: user}, {$pull: {products: {product: productId}}}, {new: true}).exec((err, cart) => {
                    if(err) return res.status(500).json(err)
                    Wishlist.findOneAndUpdate({user: user}, {$push: {products: {product: productId}}}, {new: true}).exec((err) => {
                        if(err) return res.status(500).json(err)
                        return res.status(200).json({
                            status: "success",
                            message: "Product moved to Wishlist."
                        })
                    })
                })
                break
            }
        }
        if(productExist == 0) {
            return res.status(404).json({message: "Product not found in cart"})
        }
    }
    else {
        return res.status(404).json({message: "User cart is Empty."})
    }
}
