'use strict'

const { OK, CREATED } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")

class InventoryController {
    addStock = async (req, res, next) => {
        new CREATED({
            message: 'Add stock to inventory success',
            metadata: await InventoryService.addStockToInventory(req.body.type, {
                ...req.body,
                shop: req.shop.shopId
            })
        }).send(res)
    }
}

module.exports = new InventoryController()