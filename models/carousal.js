const mongoose = require('mongoose')

const CarousalSchema = mongoose.Schema({
    name: {
        type: String
    },
    photo: {
        filePath: String,
        key: String,
    }
}, {
    timestamps: true 
})

module.exports = mongoose.model('Carousal', CarousalSchema);