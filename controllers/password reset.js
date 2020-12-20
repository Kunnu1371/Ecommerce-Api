require('dotenv').config()
const User = require('../models/user')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.API_KEY)

exports.recover = async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(!user) {
        return res.status(400).json({message: 'The email address ' + req.body.email + ' is not associated with any account.'})
    }
    user.generatePasswordReset();
    user.save()
        .then(user => {
            let link = 'http://' + 'localhost:3000' + '/api/reset/' + user.resetPasswordToken;
            const mailOptions = {
                to: user.email,
                from: 'kunalgautam1371@gmail.com',
                subject: 'Password change request',
                text: `Hi ${user.name}\n Please click on the following link ${link} to reset your password. \n\n If you did not request this, please ingore this email and your password will remain unchanged.\n`
            }
            sgMail.send(mailOptions, (err,result) => {
                if(err) return res.status(500).json({message: err})
                res.status(200).json({message: 'A mail has been sent to ' + user.email + 'which contain password reset link.'})
            })
        })
        .catch(e => res.status(500).json({message: e.message}))
}


exports.reset = (req, res) => {
    const user = User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
    // console.log(user)
    if(!user) {
        return res.status(401).json({message: 'Password reset token is invalid or has expired.'})
    }
    return res.status(201).json({message: 'Now A password reset form will be redirected. User have to fill the form. For testing purpose copy the token from url param and paste in postman route'})
}

exports.resetPassword = async (req, res) => {
    const user = await User.findOne({resetPasswordToken: req.params.token})
    // console.log(user)
    if(!user) {
        return res.status(401).json({message: 'Password reset token is invalid or has expired.'})
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    user.save((err, result) => {
        if(err) return res.status(500).json({message: err})
        const mailOptions = {
            to: user.email,
            from: 'kunalgautam1371@gmail.com',
            subject: 'Your Password has been changed',
            text: `Hi ${user.name}\n This is a confirmation that the password for your account ${user.email} has just changed.`
        }
        sgMail.send(mailOptions, (err, result) => {
            if(err) return res.status(500).json({message: err.message})
            res.status(200).json({message: "Your password has been updated."})
        }) 
    })
}