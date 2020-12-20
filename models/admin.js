const mongoose = require('mongoose')
const crypto = require('crypto')
const {v1} = require('uuid');


let uuidv1 = v1;


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    hashed_Password: {
        type: String,
        trim: true,
        required: true
    },
    about: {
        type: String,
        trim: true,
    },
    salt: {
        type: String,
    },
    role: {
        type: Number,
        default: 1
    },
    history: {
        type: Array,
        default: []
    }
},  {
    timestamps: true
}
)

userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_Password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashed_Password;
    },
    
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
}

module.exports = mongoose.model('Admin', userSchema);