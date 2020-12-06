const express = require('express')
const router = express.Router()

const { requireSignin, isAdmin, isAuth } = require('../controllers/authAdmin');
const { create, read, update, remove, getAllCarousalImages} = require('../controllers/carousal')
const  { adminById }  = require('../controllers/admin')
const { carousalById } = require('../controllers/carousal')


router.get('/carousal/read/:carousalId', read)
router.get('/carousal', getAllCarousalImages)
router.delete('/carousal/remove/:carousalId/:adminId', requireSignin, isAdmin, isAuth, remove);

const multer = require('multer')
const path = require('path')
const aws = require('aws-sdk')
const fs = require('fs')
const Carousal = require('../models/carousal')


// Set The Storage Engine
const storage = multer.diskStorage({
    // destination: './uploads/',
    filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1024 * 1024},
    fileFilter: function(req, file, cb){
    checkFileType(file, cb);
    }
})

// Check File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
    return cb(null,true);
    } else {cb("Only images with PNG, JPG, and JPEG extentions are allowed!");}
}


router.post('/carousal/create/:adminId', requireSignin, isAdmin, isAuth, upload.single('photo'), async function (req, res) {
    
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    // console.log(req.file)
    const file = req.file
    
    if(file == undefined) {
        return res.status(400).json({message: "Please choose an image to create carousal."})
    }
    else { 
        var buffer = fs.readFileSync(file.path)
            let key = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'Carousal',
                Key: key,
                Body: buffer,
                ACL: "public-read"
            }    
            s3.upload(params, async(error, data) => {
                if(error){ 
                    console.log("error: ", error)
                    return res.status(500).json(error)
                }
                console.log('uploaded to s3', data)
                // res.status(200).send(data)
            })
            const object = {
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/Carousal/" + key,
                key: key
            }
        const carousal = new Carousal(req.body)
        carousal.photo = object
        await carousal.save((err, carousal) => {
            if(err) return res.status(500).json(err)
            return res.status(201).json({
                status: "success",
                message: "Carousal created successfully",
                carousal
            })        
        })
    } 
})


router.put('/carousal/update/:carousalId/:adminId', requireSignin, isAdmin, isAuth, upload.single('photo'), async function (req, res) {
    const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    })
    // console.log(req.file)
    const file = req.file
    if(file == undefined) {
        return res.status(400).json({message: "Please choose an image to update carousal."})
    }
    else { 
        var buffer = fs.readFileSync(file.path)
            let key = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            var params = {
                Bucket: process.env.AWS_BUCKET_NAME + '/' + 'Smartaxom' + '/' + 'Carousal',
                Key: key,
                Body: buffer,
                ACL: "public-read"
            }    
            s3.upload(params, async(error, data) => {
                if(error){ 
                    console.log("error: ", error)
                    return res.status(500).json(error)
                }
                console.log('uploaded to s3', data)
                // res.status(200).send(data)
            })
            const object = {
                filePath: "https://kunnu1371.s3.ap-south-1.amazonaws.com/Smartaxom/Carousal/" + key,
                key: key
            }
            await Carousal.findByIdAndUpdate(req.params.carousalId, {$set: req.body, photo: object }, {new: true}).exec((err, carousal) => { 
                if(err) return res.status(500).json(err)
                return res.status(200).json({
                    status: "success", 
                    message: "Carousal updated successfully",
                    carousal
                })
            })
        } 
})

router.param('adminId', adminById)
router.param('carousalId', carousalById)
module.exports = router;   