const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const cartSchema = new mongoose.Schema({
 
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    products: [{
        product: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
},  
{
    timestamps: true
})

module.exports = mongoose.model('Cart', cartSchema);