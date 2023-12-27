'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

class CheckoutService {
    static async checkoutReview ({
        cartId, userId, shop_order_ids
    }) {
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkoutOrder = {
            total_price: 0,
            fee_ship: 0, 
            total_discount: 0,
            total_checkout: 0
        }
        const shopOrderIdsNew = []

        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts, item_products} = shop_order_ids[i]

            const checkProductServer = await checkProductByServer(item_products)

            if (!checkProductServer[0]) throw new BadRequestError('Order wrong!')

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            checkoutOrder.total_price += checkoutPrice

            const itemCheckout = {
                shopId, 
                shop_discounts,
                price_raw: checkoutPrice,
                price_apply_discount: checkoutPrice,
                item_products: checkProductServer
            }

            if (shop_discounts.length > 0) {
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId, 
                    shopId,
                    products: checkProductServer
                })

                checkoutOrder.total_discount += discount

                if (discount > 0) {
                    itemCheckout.price_apply_discount = totalPrice
                }
            }

            checkoutOrder.total_checkout += itemCheckout.price_apply_discount
            shopOrderIdsNew.push(itemCheckout)
        }

        return {
            shop_order_ids, 
            shop_order_ids_new: shopOrderIdsNew,
            checkout_order: checkoutOrder
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        address = {},
        payment = {}
    }) {
        const {shop_order_ids_new, checkout_order} = await this.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]; `, products);
        const acquireProducts = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProducts.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check neu co san pham het hang trong kho
        if (acquireProducts.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang sau...')
        }

        const newOrder = await orderModel.create({
            user: userId,
            checkout: checkout_order,
            shipping: address,
            payment: payment,
            products: shop_order_ids_new
        })

        // neu them thanh cong thi xoa san pham trong gio hang
        if (newOrder) {

        }

        return newOrder
    }

    static async getOrdersByUser() {
        
    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateorderStatusByShop() {
        
    }
}

module.exports = CheckoutService