'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { getAllDiscountCodesUnSelect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { getAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongoDb } = require("../utils")

class DiscountService {
    static async createDiscountCode (payload) {
        const {
            name, description, type, code, value, min_order_value, max_value, 
            start_date, end_date, max_uses, uses_count, is_active, shop,
            product_ids, applies_to, users_used, max_uses_per_user
        } = payload

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date!')
        }

        const foundDiscount = await discountModel.findOne({
            code: code,
            shop: convertToObjectIdMongoDb(shop)
        }).lean()


        if (foundDiscount && foundDiscount.is_active) {
            throw new BadRequestError('Discount not exists!')
        }

        const newDiscount = await discountModel.create({
            name: name,
            description: description,
            type: type,
            code: code,
            value: value,
            min_order_value: min_order_value || 0,
            max_value: max_value,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            max_uses: max_uses,
            uses_count: uses_count,
            users_used: users_used,
            shop: convertToObjectIdMongoDb(shop),
            max_uses_per_user: max_uses_per_user,
            is_active: is_active,
            applies_to: applies_to,
            product_ids: applies_to === 'all'? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscount() {

    }

    static async getAllDiscountCodesWithProduct({code, shopId, userId, limit, page}) {
        const foundDiscount = await discountModel.findOne({
            code: code,
            shop: convertToObjectIdMongoDb(shopId)
        }).lean()

        if (!foundDiscount || !foundDiscount.is_active) {
            throw new NotFoundError('Discount not exists!')
        }

        const {applies_to, product_ids} = foundDiscount
        let products

        if (applies_to === 'all') {
            products = await getAllProducts({
                filter: {
                    shop: convertToObjectIdMongoDb(shopId),
                    isPublished: true
                }, 
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }
        if (applies_to === 'specific') {
            products = await getAllProducts({
                filter: {
                    _id: {$in: product_ids},
                    isPublished: true
                }, 
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['name']
            })
        }

        return products
    }

    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await getAllDiscountCodesUnSelect({
            limit: +limit, 
            page: +page, 
            filter: {
                shop: convertToObjectIdMongoDb(shopId),
                is_active: true
            },
            unSelect: ['__v', 'shop'],
            model: discountModel
        })

        return discounts
    }

    static async getDiscountAmount({code, userId, shopId, products}) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                code: code,
                shop: convertToObjectIdMongoDb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not exists!')

        const {is_active, max_uses, start_date, end_date, min_order_value, max_uses_per_user, users_used, type, value} = foundDiscount

        if (!is_active) throw new NotFoundError('Discount has expired!')
        if (!max_uses) throw new NotFoundError('Discount are out!')

        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new NotFoundError('Discount has expired!')
        }

        let totalOrder = 0
        if (min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < min_order_value) {
                throw new NotFoundError(`Discount requires a minium order value of ${min_order_value}`)
            }
        }

        if (max_uses_per_user > 0) {
            const userUseDiscount = users_used.find(user => user.userId === userId)
            if (userUseDiscount) {

            }
        }

        const amount = type === 'fixed_amount' ? value : totalOrder * (value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({
        shopId, code
    }){
        const deleted = await discountModel.findOneAndDelete({
            code: code,
            shop: convertToObjectIdMongoDb(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({code, shopId, userId}) {
        const foundDiscount = await checkDiscountExists({
            mode: discountModel,
            filter: {
                code: code, 
                shop: convertToObjectIdMongoDb(shopId)
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not exists!')

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                users_used: userId
            },
            $inc: {
                max_uses: 1,
                uses_count: -1
            }
        })

        return result
    }
}

module.exports = DiscountService