const formidable = require('formidable')
const Carousal = require('../models/carousal')
const fs = require('fs')
const _ = require('lodash')

exports.carousalById = (req,res, next, id) => {
    Carousal.findById(id).exec((err, carousal) => {
        if(err || !carousal) {
            return res.status(404).json({
                error: 'Carousal not found'
            })
        }
        req.carousal = carousal;
        next();
    })
}


// exports.create = (req, res) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//         if(err) {
//             return res.status(500).json({
//                 error: 'Image could not be uploaded'
//             })
//         }

//         let carousal = new Carousal(fields)
        
//         if(files.image) { 
//             if(files.image.size > 1000000) {
//                 return res.status(400).json({
//                     error: "Image should be less than 1mb in size."
//                 })
//             }
//             carousal.image.data = fs.readFileSync(files.image.path)
//             carousal.image.contentType = files.image.type
//         }


//         carousal.save((err, image) => {
//             if(err) {
//                 return res.status(400).json({error: err})
//             }
//             res.status(201).json({ 
//                 status: "success", 
//                 message: "Image created successfully", 
//                 image
//             })
//         })
//     })
// }



exports.read = (req, res) => {
    const carousal = req.carousal
    return res.status(200).json({
        status: "success",
        carousal
    })
}


exports.getAllCarousalImages = async(req, res) => {
    const carousals = await Carousal.find()
    return res.status(200).json({
        status: "success",
        totalImages: carousals.length,
        carousals
    })
}
// exports.update = (req, res) => {
//     let form = new formidable.IncomingForm()
//     form.keepExtensions = true
//     form.parse(req, (err, fields, files) => {
//         if(err) {
//             return res.status(500).json({
//                 error: 'Image could not be uploaded'
//             })
//         }

//         let carousal = req.carousal
//         carousal = _.extend(carousal, fields)
//         // console.log("carousal ", carousal)
//         if(files.image) { 
//             if(files.image.size > 1000000) {
//                 return res.status(400).json({
//                     error: "Image should be less than 1mb in size."
//                 })
//             }
//             carousal.image.data = fs.readFileSync(files.image.path)
//             carousal.image.contentType = files.image.type
//         }


//         carousal.save((err, image) => {
//             if(err) {
//                 return res.status(500).json({error: err})
//             }
//             res.status(200).json({ 
//                 status: "success", 
//                 message: "Image updated successfully", 
//                 image
//             })
//         })
//     })
// }



exports.remove = (req, res) => {
    const carousal = req.carousal
    carousal.remove((err, deletedCarousal) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.status(200).json({
            status: "success",
            "message": "Carousal deleted successfully."
        })
    })
}
