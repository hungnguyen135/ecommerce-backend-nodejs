'use strict'

const express = require('express')
const cartController = require('../../controllers/cart.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.deleteCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.getListCarts))

// router.use(authentication)

// router.post('', asyncHandler(discountController.createDiscountCode))
// router.get('/shop', asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router