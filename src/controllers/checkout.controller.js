'use strict'

const { OK, CREATED } = require("../core/success.response")
const CheckoutService = require("../services/checkout.service")

class CheckoutController {
    // get list carts
    checkoutReview = async (req, res, next) => {
        new OK({
            message: 'Checkout review cart success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController()