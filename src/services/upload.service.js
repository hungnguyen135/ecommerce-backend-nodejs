'use strict'

const crypto = require("crypto");
const cloudinary = require("../configs/cloudinary.config");
const {BadRequestError} = require("../core/error.response");
const {PutObjectCommand, s3} = require("../configs/s3.config");

// Upload from url image
const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://statics.oeg.vn/storage/STADIUM/icon-stadium/logo-oeg.png';
        const folderName = 'product/shopId', newFileName = 'test-demo'

        const result = await cloudinary.uploader.upload(urlImage, {
            // public_id: newFileName,
            folder: folderName
        })

        return result
    } catch (error) {
        console.error(error);
    }
}

const uploadSingleFile = async (req) => {
    try {
        const {folder: folderName = 'product/shopId'} = req.body
        const {file} = req
        if (!file) {
            throw new BadRequestError('File missing!')
        }

        const result = await cloudinary.uploader.upload(file.path, {
            // public_id: newFileName,
            folder: folderName
        })

        return {
            image_url: result.secure_url,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error(error);
    }
}

const uploadMultipleFiles = async (req) => {
    try {
        const {folder: folderName = 'product/shopId'} = req.body
        const {files} = req
        if (!files.length) return

        const uploadedUrls = []
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                // public_id: newFileName,
                folder: folderName
            })

            uploadedUrls.push({
                image_url: result.secure_url,
                thumb_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: 'jpg'
                })
            })
        }

        return uploadedUrls
    } catch (error) {
        console.error(error);
    }
}

// Upload file use s3Client
const uploadFileWithS3 = async (req) => {
    try {
        const {file} = req
        if (!file) {
            throw new BadRequestError('File missing!')
        }

        const randomImageName = () => crypto.randomBytes(16).toString('hex')
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: randomImageName(),
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)

        return result
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadSingleFile,
    uploadMultipleFiles,
    uploadFileWithS3
}