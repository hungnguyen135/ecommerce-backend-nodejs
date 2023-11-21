'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    // version 1
    // static createKeyToken = async ({userId, publicKey}) => {
    //     try {
    //         const publicKeyString = publicKey.toString()
    //         const token = await keytokenModel.create({
    //             user: userId,
    //             publicKey: publicKeyString
    //         })

    //         return token ? token.publicKey : null
    //     } catch (error) {
    //         return error
    //     }
    // }

    // version 2
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // level xxx
            const filter = {user: userId}
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
}

module.exports = KeyTokenService