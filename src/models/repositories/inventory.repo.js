'use strict'

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

module.exports = {
    insertInventory
}