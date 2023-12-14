'use strict'

const { OK, CREATED } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: 'Create new discount success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shop: req.shop.shopId
            })
        }).send(res)
    }; 

    getAllDiscountCodesByShop = async (req, res, next) => {
        new OK({
            message: 'Get all discounts success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.shop.shopId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: 'Get all discounts success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new OK({
            message: 'Get all discounts success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new DiscountController()