"use strict";

const {uploadImageFromUrl, uploadSingleFile, uploadMultipleFiles, uploadFileWithS3} = require("../services/upload.service");
const {OK} = require("../core/success.response");

class UploadController {
    uploadFile = async (req, res, next) => {
        new OK({
            message: "Upload file successfully",
            metadata: await uploadImageFromUrl()
        }).send(res)
    }

    uploadSingleFile = async (req, res, next) => {
        new OK({
            message: "Upload single file successfully",
            metadata: await uploadSingleFile(req)
        }).send(res)
    }

    uploadMultipleFiles = async (req, res, next) => {
        new OK({
            message: "Upload multiple files successfully",
            metadata: await uploadMultipleFiles(req)
        }).send(res)
    }

    uploadFileWithS3 = async (req, res, next) => {
        new OK({
            message: "Upload file use s3 successfully",
            metadata: await uploadFileWithS3(req)
        }).send(res)
    }
}

module.exports = new UploadController()