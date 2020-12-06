const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    name: {
        type: String
    },

    image: {
        data: Buffer,
        contentType: String
    },
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Banner', bannerSchema);