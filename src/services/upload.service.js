'use strict'

const fs = require('node:fs');
const crypto = require("node:crypto");
const cloudinary = require("../configs/cloudinary.config");
const urlImagePublic = 'https://di96fbk3rh2pt.cloudfront.net';
const {BadRequestError} = require("../core/error.response");
const {s3, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} = require("../configs/s3.config");
// const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const randomImageName = () => crypto.randomBytes(16).toString('hex')

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

        const imageName = randomImageName()
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3.send(command)

        // export url
        // // use s3-request-presigner
        // const signedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName
        // })
        // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

        // use CloudFront
        // return {
        //     url: `${urlImagePublic}/${imageName}`,
        //     result
        // }

        // use cloudfront signer
        const url = `${urlImagePublic}/${imageName}`;
        const privateKey = fs.readFileSync('./src/keys/private_key.pem', 'utf-8');
        const keyPairId = "K3LZVA7ZBSU10Z"; // ID cua public key trong cloud front
        const dateLessThan = new Date(Date.now() + 1000 * 60); // het han sau 60s

        const signedUrl = getSignedUrl({
            url,
            keyPairId,
            dateLessThan,
            privateKey
        });

        return {
            signedUrl,
            result
        }

        // return url
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