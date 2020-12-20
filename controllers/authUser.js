const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup = async (req, res) => {
    const userFound = await User.findOne({email: { $regex: `^${req.body.email}$`, $options: "i" }}, (err, user) => {
        if(err) return res.status(500).json(err)
    })
    if(userFound) {
        return res.json("User with that email exist in database. Please login")
    } else {
            const user = new User(req.body)
            user.save((err, user) => {
            if(err) {
                return res.status(400).json({
                    err: errorHandler(err)
                })
            }
            user.salt = undefined
            user.hashed_Password = undefined
            res.status(201).json({
                status: "success",
                message: "User has been registered",
                user 
            })
        })
    }
} 

exports.signin = (req, res) => { 
    // Check user based on email
    const { email, password} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(404).json({
                err: "User with that email doesn't exist. Please signup"
            })
        }
        // If user found
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password don't match"
            })
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        res.cookie('t', token, { expire: new Date() + 9999})
        const {_id, name, email, role} = user
        return res.status(200).json({  
                            status: "success",
                            token,
                            user: {_id, name, email, role}
                        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.status(200).json({
        message: "signout success"
    })
}

// Cookie parser is required for this function to protect routes
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth"
})

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    // console.log( req.auth._id, req.auth)
    // console.log(user)
    if(!user) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}