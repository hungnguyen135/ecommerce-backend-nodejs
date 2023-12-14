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

    publishProductByShop = async (req, res, next) => {
        new OK({
            message: 'Publish product success',
            metadata: await ProductService.publishProductByShop({
                shopId: req.shop.shopId,
                productId: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: 'UnPublish product success',
            metadata: await ProductService.unPublishProductByShop({
                shopId: req.shop.shopId,
                productId: req.params.id
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new OK({
            message: 'Update product success',
            metadata: await ProductService.updateProduct(req.body.type, req.params.productId, {
                ...req.body,
                shop: req.shop.shopId
            })
        }).send(res)
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'Get list drafts success',
            metadata: await ProductService.findAllDraftsForShop({
                shop: req.shop.shopId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {
        new OK({
            message: 'Get list publish success',
            metadata: await ProductService.findAllPublishForShop({
                shop: req.shop.shopId
            })
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        new OK({
            message: 'Search product success',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res)
    }

    getAllProducts = async (req, res, next) => {
        new OK({
            message: 'Get all products success',
            metadata: await ProductService.getAllProducts(req.query)
        }).send(res)
    }

    getProduct = async (req, res, next) => {
        new OK({
            message: 'Get product success',
            metadata: await ProductService.getProduct({
                productId: req.params.productId
            })
        }).send(res)
    }
}

module.exports = new ProductController()