'use strict'

const { getSelectData, unGetSelectData } = require('../../utils')
const {productModel, clothesModel, electronicModel} = require('../product.model')
const {Types} = require('mongoose')

const publishProductByShop = async ({shopId, productId}) => {
    const foundProduct = await productModel.findOne({
        shop: new Types.ObjectId(shopId),
        _id: new Types.ObjectId(productId)
    })

    if (!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = true

    const result = await foundProduct.save()

    return result
}

const unPublishProductByShop = async ({shopId, productId}) => {
    const foundProduct = await productModel.findOne({
        shop: new Types.ObjectId(shopId),
        _id: new Types.ObjectId(productId)
    })

    if (!foundProduct) return null

    foundProduct.isDraft = true
    foundProduct.isPublished = false

    const result = await foundProduct.save()

    return result
}

const updateProductById = async({productId, payload, model, isNew = true}) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew
    })
}

// const findAllDraftsForShop = async ({query, limit, skip}) => {
//     return await productModel.find(query)
//         .populate('shop', 'name email -_id')
//         .sort({updateAt: -1})
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .exec()
// }

// const findAllPublishForShop = async ({query, limit, skip}) => {
//     return await productModel.find(query)
//         .populate('shop', 'name email -_id')
//         .sort({updateAt: -1})
//         .skip(skip)
//         .limit(limit)
//         .lean()
//         .exec()
// }

const queryProduct = async ({query, limit, skip}) => {
    return await productModel.find(query)
        .populate('shop', 'name email -_id')
        .sort({updateAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProduct = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await productModel.find({
        isPublished: true,
        $text: {$search: regexSearch}
    }, {
        score: {$meta: 'textScore'}
    })
    .sort()
    .lean()

    return results
}

const getAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const results = await productModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return results
}

const getProduct = async ({productId, unSelect}) => {
    return await productModel.findById(productId).select(unGetSelectData(unSelect))
}

module.exports = {
    publishProductByShop,
    unPublishProductByShop,
    updateProductById,
    // findAllDraftsForShop,
    // findAllPublishForShop,
    queryProduct,
    searchProduct,
    getAllProducts,
    getProduct
}