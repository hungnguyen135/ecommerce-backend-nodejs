'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


// router.get('/:productId', asyncHandler(productController.getProduct))

router.use(authentication)

router.post('/', asyncHandler(commentController.createComment))

// router.post('', asyncHandler(productController.createProduct))

module.exports = router