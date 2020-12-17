const { errorHandler } = require('../helpers/dbErrorHandler');
const Order = require('../models/order');
const User = require('../models/user')

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        req.profile = user;
        next();
    })
}

exports.read = (req, res) => {
    User.findById(req.profile._id)
        .exec((err, user) => {
        if(err) return res.status(500).json(err)
        user.hashed_Password = undefined
        user.salt = undefined
        return res.status(200).json({
            status: "success",
            user
        })
    })
}

exports.update = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile.id}, 
        {$set: req.body}, 
        {new: true},
        (err, user) => {
            if(err){
                return res.status(401).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            // user.hashed_password = undefined
            // user.profile.salt = undefined
            res.status(200).json({
                status: "success",
                user
            })
        })

} 


exports.purchaseHistory = async (req, res) => {
    await Order.find({user: req.params.userId})
    .populate('user', '_id name email') 
    .populate('products.product') 
    .sort('-created') 
    .exec((err, orders) => {
        if(err) {  
            return res.status(500).json({
                error: errorHandler(err)
            })  
        }    
        res.status(200).json({
            status: "success",
            total: orders.length, 
            orders
        })
    })
}