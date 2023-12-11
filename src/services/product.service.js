'use strict'

const { BadRequestError } = require('../core/error.response')
const {productModel, clothesModel, electronicModel} = require('../models/product.model')
const { queryProduct, publishProductByShop, unPublishProductByShop, searchProduct, getAllProducts, getProduct, updateProductById } = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')

// define factory class to create product
class ProductFactory {
    static productRegistry = {}

    static registerProductType (type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    // POST
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT
    static async publishProductByShop({shopId, productId}) {
        return await publishProductByShop({shopId, productId})
    }

    static async unPublishProductByShop({shopId, productId}) {
        return await unPublishProductByShop({shopId, productId})
    }

    // GET
    static async findAllDraftsForShop ({shop, limit = 50, skip = 0}) {
        const query = {shop, isDraft: true}
        return await queryProduct({query, limit, skip})
    }

    static async findAllPublishForShop ({shop, limit = 50, skip = 0}) {
        const query = {shop, isPublished: true}
        return await queryProduct({query, limit, skip})
    }

    static async searchProduct ({keySearch}) {
        return await searchProduct({keySearch})
    }

    static async getAllProducts ({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await getAllProducts({limit, sort, page, filter, select: ['name', 'thumb', 'description', 'price']})
    }

    static async getProduct ({productId}) {
        return await getProduct({productId, unSelect: ['__v']})
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
        const newProduct =  await productModel.create({
            ...this,
            _id: productId
        })
        if (newProduct) {

        }

        return newProduct
    }

     // update product
    async updateProduct(productId, payload) {
        return await updateProductById({productId, payload, model: productModel})
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

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        // remove attr has null or underfined
        if (objectParams.attributes) {
            // update child
            await updateProductById({productId, objectParams: updateNestedObjectParser(objectParams.attributes), model: clothesModel})
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
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

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        // remove attr has null or underfined
        if (objectParams.attributes) {
            // update child
            await updateProductById({productId, objectParams: updateNestedObjectParser(objectParams.attributes), model: electronicModel})
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// register product type
ProductFactory.registerProductType('clothes', Clothes)
ProductFactory.registerProductType('electronic', Electronic)

module.exports = ProductFactory