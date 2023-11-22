'use strict'

'use strict'

const { OK, CREATED } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {
    createProduct = async (req, res, next) => {
        new CREATED({
            message: 'Create new product success',
            metadata: await ProductService.createProduct(req.body.type, {
                ...req.body,
                shop: req.shop.shopId
            })
        }).send(res)
    }
}

module.exports = new ProductController()