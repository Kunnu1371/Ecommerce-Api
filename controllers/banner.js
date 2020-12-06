const Banner = require('../models/banner')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.bannerById = (req, res, next, id) => {
    Banner.findById(id).exec((err, banner) => {
        if(err || !banner) {
            return res.status(404).json({
                error: "Banner not found"
            })
        }
        req.banner = banner;
        next();
    })
}


exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(500).json({
                error: 'Image could not be uploaded'
            })
        }

        let banner = new Banner(fields)
        
        if(files.image) { 
            if(files.image.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            banner.image.data = fs.readFileSync(files.image.path)
            banner.image.contentType = files.image.type
        }


        banner.save((err, banner) => {
            if(err) {
                return res.status(400).json({error: err})
            }
            res.status(201).json({ 
                status: "success", 
                message: "Banner created successfully", 
                banner
            })
        })
    }) 
}

exports.read = (req, res, next) => {
    if(req.banner.image.data) {
        res.set('Content-Type', req.banner.image.contentType)
        return res.status(200).send(req.banner.image.data)
    }
    next();
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(500).json({
                error: 'Image could not be uploaded'
            })
        }

        let banner = req.banner
        banner = _.extend(banner, fields)
        // console.log("banner ", banner)
        if(files.image) { 
            if(files.image.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size."
                })
            }
            banner.image.data = fs.readFileSync(files.image.path)
            banner.image.contentType = files.image.type
        }


        banner.save((err, image) => {
            if(err) {
                return res.status(500).json({error: err})
            }
            res.status(200).json({ 
                status: "success", 
                message: "Banner updated successfully", 
                image
            })
        })
    })
}

exports.remove = (req, res) => {
    let banner = req.banner
    banner.remove((err, deletedbanner) => {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            status: "success",
            "message": "Banner deleted successfully."
        })
    })
}