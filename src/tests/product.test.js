const redisPubSubService = require("../services/redisPubSub.service");

class ProductTestService {
    purchaseProduct(productId, quantity) {
        const order = {
            productId, quantity
        }

        console.log('productId', productId); 
        redisPubSubService.publishFunc('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductTestService()