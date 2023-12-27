'use strict'

const express = require('express')
const checkoutController = require('../../controllers/checkout.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


router.post('/review', asyncHandler(checkoutController.checkoutReview))

// router.use(authentication)

// router.post('', asyncHandler(discountController.createDiscountCode))
// router.get('/shop', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router