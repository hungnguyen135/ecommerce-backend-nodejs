'use strict'

const { update } = require("lodash")
const { NotFoundError } = require("../core/error.response")
const cartModel = require("../models/cart.model")
const { getProductById } = require("../models/repositories/product.repo")

class CartService {
    static async createUserCart({userId, product}) {
        const query = { user: userId, state: 'active' };
        const updateOrInsert = {
            $addToSet: {
                products: product
            }
        };
        const options = { upsert: true, new: true };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, product}) {
        const {productId, quantity} = product
        const query = {
            user: userId, 
            'products.productId': productId,
            state: 'active'
        },
        updateSet = {
            $inc: {
                'products.$.quantity': quantity
            }
        },
        options = {$upsert: true, new: true}

        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        const userCart = await cartModel.findOne({
            user: userId
        })

        if(!userCart) {
            return CartService.createUserCart({userId, product})
        }

        if(!userCart.products.length) {
            userCart.products = [product]
            return await userCart.save()
        }

        return await CartService.updateUserCartQuantity({userId, product})
    }

    static async addToCartV2({userId, shop_order_ids}) {
        const {productId, quantity, old_quantity} = shop_order_ids[0]?.item_products[0]

        // check product
        const foundProduct = await getProductById(productId)
        console.log(foundProduct);
        
        if(!foundProduct) throw new NotFoundError('Product not found')
        if (foundProduct.shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Product do not belong to the shop')

        if (quantity === 0) {
            // delete product
        }

        return await this.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({userId, productId}) {
        const query = {user: userId, state: 'active'},
        updateSet = {
            $pull: {
                products: {
                    productId
                }
            }
        }

        const deletedCart = await cartModel.updateOne(query, updateSet)
        return deletedCart
    }

    static async getListUserCarts ({userId}) {
        return await cartModel.findOne({
            user: +userId
        }).lean()
    }
}

module.exports = CartService