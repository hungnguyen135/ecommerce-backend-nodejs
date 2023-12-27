'use strict'

const { OK, CREATED } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CartController {
    /**
     * @des add to cart for user
     * @param {int} userId 
     * @param {*} res 
     * @param {*} next 
     * @method products
     * @url /v1/api/cart/user
     * @return {
     * }
     */
    addToCart = async (req, res, next) => {
        new OK({
            message: 'Add to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    // update
    updateCart = async (req, res, next) => {
        new OK({
            message: 'Update cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    // delete
    deleteCart = async (req, res, next) => {
        new OK({
            message: 'Delete cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    // get list carts
    getListCarts = async (req, res, next) => {
        new OK({
            message: 'Get list cart success',
            metadata: await CartService.getListUserCarts(req.query)
        }).send(res)
    }
}

module.exports = new CartController()