const redisPubSubService = require("../services/redisPubSub.service");

class InventoryTestService {
    constructor() {
        redisPubSubService.subscriberFunc('purchase_events', (channel, message) => {
            InventoryTestService.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryTestService()