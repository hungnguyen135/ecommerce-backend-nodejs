'use strict'

const { convertToObjectIdMongoDb } = require("../../utils")
const inventoryModel = require("../inventory.model")
const {Types} = require('mongoose')

const insertInventory = async({
    productId, shopId, stock, location = ''
}) => {
    return await inventoryModel.create({
        product: productId,
        shop: shopId,
        location,
        stock
    })
}

const revervationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        productId: convertToObjectIdMongoDb(productId),
        stock: {$gte: quantity},
    }
    const updateSet = {
        $inc: {
            stock: -quantity
        },
        $push: {
            reservations: {
                quantity,
                cartId,
                createdAt: new Date()
            }
        }
    }
    const options = {
        upsert: true,
        new: true
    }

    return await inventoryModel.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    revervationInventory
}