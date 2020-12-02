const Cart = require('../models/cart')
const Wishlist = require('../models/wishlist')
const Voucher = require('../models/voucher')
// exports.cartById = (req, res, next, id) => {
//     Cart.findById(id).exec((err, cart) => {
//         if(err || !cart) {
//             return res.status(400).json({
//                 error: 'Product not found in cart'
//             })
//         }
//         req.cart = cart;
//         console.log(cart, cart.product)
//         next();
//     })
// }

exports.addToCart = async (req, res) => {
    const productId = req.params.productId

    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    if(productInCart) {
        // If product is already added in cart, update the quantity
        Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: 1}}, {new: true }, function(err, data) {
            if(err) return res.status(500).json(err)
            return res.status(200).json({ 
                status: "success",
                message: "Product is already in Cart. Successfully updated quantity", 
                data
            })
        })
    } 

    else {
        // If product is not added in cart, then add it to cart
        const product = new Cart({product: productId})
        await product.save((err, addedProduct) => {
           if(err) return res.status(400).json(err)
           return res.status(200).json({
               status: "success",
               message: "Product successfully added to cart", 
               addedProduct
            })
       })
    }
}

exports.getCartItems = async (req, res) => {
    await Cart.find()
        .populate("product")
        .exec((err, data) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json({
            status: "success",
            Items: data.length, 
            data
        })
    })
}


exports.getCartTotal = (req, res) => {
    Cart.find()
    .populate("product")
        .exec((err, data) => {
        if(err) return res.status(500).json(err)
        const products = data
        const priceArray = (products.map((product) => {
            return (product.Quantity * product.product.price)
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
                    req.voucher = voucher
                    console.log("midleware works")
                    console.log(req.voucher, req.totalAmount)
                    
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
            req.totalAmount = Total
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
    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    // console.log(productId, productInCart)

    if(productInCart) {
        // If product is already added in cart, update the quantity
        Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: 1}}, {new: true }, function(err, data) {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success",
                message: "Successfully updated quantity", 
                data
            })
        })
    } 

    else {
        // console.log(productId, productInCart)
        return res.status(404).json({message: "product not found in cart"})
    }
} 


exports.Decrease = async (req, res) => {
    const productId = req.params.productId
    // check product exist or already added in cart or not
    const productInCart = await Cart.findOne({product: productId})
    // console.log(productId, productInCart)

    if(productInCart) {
        // If product is already added in cart, update the quantity
        if(productInCart.Quantity <= 1) {
            productInCart.remove((err, data) => {
                if(err) return res.status(500).json(err)
                return res.status(200).json({
                    status: "success",
                    message: "Product removed successfully from cart"
                })
            })
        }

        else {
            Cart.findOneAndUpdate({_id: productInCart._id}, {$inc: {Quantity: -1}}, {new: true }, function(err, data) {
                if(err) return res.status(500).json(err)
                return res.status(200).json({
                    status: "success",
                    message: "Successfully updated quantity", 
                    data
                })
            })
        }
    } 

    else {
        return res.status(404).json({message: "product not found in cart"})
    }
}


// exports.deleteCartItems = (req, res) => {
//     const cart =  req.cart
//     cart.remove((err, data) => {
//         if(err) return res.json(err)
//         return res.json("Product removed successfully from cart")
//     }) 
// }


exports.deleteCartItems = async (req, res) => {
    const productId = req.params.productId
    const productInCart = await Cart.findOne({product: productId})

    if(productInCart) {
        productInCart.remove((err, data) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success",
                message: "Product removed successfully from cart"
            })
        })
    }
    else {
        return res.status(404).json({message: "Product not found in cart"})
    }
}


exports.Update = async (req, res) => {
    const product = req.params.productId
    const quantity = req.body.quantity
    const productInCart = await Cart.findOne({product: product})
    if(productInCart) {
        // console.log(productInCart)
        productInCart.Quantity = quantity

        productInCart.save((err, updated) => {
            if(err) return res.status(500).json(err)
            return res.status(200).json({
                status: "success",
                message: "product quantity updated", 
                updated
            })
        })
    } else {
        return res.status(404).json({message: "Product not found in Cart"})
    }
}

exports.deleteAllItems = async (req, res) => {
    await Cart.deleteMany({}, (err, result) => {
        if(err) return res.status(500).json(err)
        return res.status(200).json({
            status: "success",
            message: "All items in cart has been deleted"
        })
    })
}

exports.moveToWishlist = async (req, res) => {

    // how move the product from cart to wishlist is working => first delete the product from cart then add the same product in wishlist.

    const product = req.params.productId
    const productInCart = await Cart.findOne({product: product})
    await productInCart.remove((err, data) => {
        if(err) return res.status(500).json(err)
    }) 

    const newProduct = new Wishlist({product: product})
    await newProduct.save((err, savedProduct) => {
        if(err) res.status(500).json(err)
        return res.status(200).json({
            status: "success",
            message: "Product moved to wishlist"
        })
    })
}
