'use strict'

const { BadRequestError } = require('../core/error.response')
const {productModel, clothesModel, electronicModel} = require('../models/product.model')

// define factory class to create product
class ProductFactory {
    static productRegistry = {}

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }
}

// define base product class
class Product {
    constructor({
        name, thumb, description, price, 
        quantity, type, shop, attributes
    }) {
        this.name = name,
        this.thumb = thumb,
        this.description = description,
        this.price = price,
        this.quantity = quantity,
        this.type = type,
        this.shop = shop,
        this.attributes = attributes
    }

    // create new product
    async createProduct(productId) {
        return await productModel.create({
            ...this,
            _id: productId
        })
    }
}

// define sub-class for different product types clothes
class Clothes extends Product {
    async createProduct() {
        const newClothes = await clothesModel.create({
            ...this.attributes, 
            shop: this.shop
        })
        if (!newClothes) throw new BadRequestError('Create new clothes error!')

        const newProduct = super.createProduct(newClothes._id)
        if (!newProduct) throw new BadRequestError('Create new product error!')

        return newProduct
    }
}

// define sub-class for different product types electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronicModel.create({
            ...this.attributes,
            shop: this.shop
        })
        if (!newElectronic) throw new BadRequestError('Create new electronic error!')

        const newProduct = super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product error!')

        return newProduct
    }
}

// register product type
ProductFactory.registerProductType('clothes', Clothes)
ProductFactory.registerProductType('electronic', Electronic)

module.exports = ProductFactory