const expressValidator = require('express-validator')
exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is required').notEmpty()
    req.check('email', 'Email must be between 3 to 32 vharacters')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @')
    .isLength({
        min: 4,
        max: 32
    })
    req.check('phone', 'Phone is required').notEmpty()
    req.check('phone').isLength({min: 10}).withMessage('Invalid Phone number')
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
    const errors = req.validationErrors()
    if(errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}


exports.userPasswordResetValidator = (req, res, next) => {
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number');
    const errors = req.validationErrors()
    if(errors) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}

