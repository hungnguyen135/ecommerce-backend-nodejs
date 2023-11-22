'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const router = express.Router()

router.post('', asyncHandler(productController.createProduct))

module.exports = router