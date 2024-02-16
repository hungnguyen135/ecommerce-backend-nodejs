"use strict";

const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const {uploadDisk, uploadMemory} = require("../../configs/multer.config");
const router = express.Router()

router.post('', asyncHandler(uploadController.uploadFile))
router.post('/single', uploadDisk.single('file'), asyncHandler(uploadController.uploadSingleFile))
router.post('/single/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileWithS3))
router.post('/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadMultipleFiles))

// router.use(authentication)

// router.post('', asyncHandler(productController.createProduct))

module.exports = router