'use strict'

const keytokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')

class KeyTokenService {
    // version 1
    // static createKeyToken = async ({shopId, publicKey}) => {
    //     try {
    //         const publicKeyString = publicKey.toString()
    //         const token = await keytokenModel.create({
    //             shop: shopId,
    //             publicKey: publicKeyString
    //         })

    //         return token ? token.publicKey : null
    //     } catch (error) {
    //         return error
    //     }
    // }

    // version 2
    static createKeyToken = async ({shopId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     shop: shopId,
            //     publicKey,
            //     privateKey
            // })

            // level xxx
            const filter = {shop: shopId}
            const update = {
                publicKey, 
                privateKey, 
                refreshTokenUsed: [], 
                refreshToken
            }
            const options = {
                upsert: true, 
                new: true
            }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByShopId = async (shopId) => {
        return await keytokenModel.findOne({shop: new Types.ObjectId(shopId)})
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }

    static deleteOneKeyById = async (id) => {
        return await keytokenModel.deleteOne(id)
    }

    static deleteOneKeyByShop = async (shopId) => {
        return await keytokenModel.deleteOne({shop: new Types.ObjectId(shopId)})
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({refreshTokensUsed: refreshToken})
    }
}

module.exports = KeyTokenService