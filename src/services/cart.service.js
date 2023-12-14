'use strict'

const cartModel = require("../models/cart.model")

class CartService {
    static async createUserCart({userId, product}) {
        const query = {user: userId, state: 'active'},
        updateOrInsert = {
            $addToSet: {
                products: product
            }
        },
        options = {$upsert: true, new: true}

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

        if(!userCart.product.length) {
            userCart.products = [product]
            return await userCart.save()
        }

        return await CartService.updateUserCartQuantity({userId, product})
    }

    
}

module.exports = CartService