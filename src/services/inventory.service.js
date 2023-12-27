'use strict'

const { BadRequestError } = require("../core/error.response")
const inventoryModel = require("../models/inventory.model")
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory({
        stock, productId,
        shopId,
        location = 'HN',
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product does not exists!')

        const query = {
            shopId: shopId,
            productId: productId
        }
        const updateSet = {
            $inc: {
                stock: stock,
            },
            $set: {
                location: location
            }
        }
        const options = {upsert: true, new: true}

        return await inventoryModel.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService