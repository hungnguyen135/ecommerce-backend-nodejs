'use strict'

const { convertToObjectIdMongoDb } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({_id: convertToObjectIdMongoDb(cartId), state: 'active'})
}

module.exports = {
    findCartById,
};