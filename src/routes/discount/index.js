'use strict'

const express = require('express')
const discountController = require('../../controllers/discount.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/product-code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('/shop', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router