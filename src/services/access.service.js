'use strict'

const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const shopModel = require("../models/shop.model")
const keyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const KeyTokenService = require('./keyToken.service')
const { findByEmail } = require('./shop.service')

const shopRoles = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        const holderShop = await shopModel.findOne({email}).lean()
        if(holderShop) {
            throw new BadRequestError('Shop already registered!')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: hashPassword, roles: [shopRoles.SHOP]
        })
        if (newShop) {
            // version 1
            // create privateKey, publicKey
            // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1', // Public Key CryptoGraphy Standards
            //         format: 'pem',
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem',
            //     }
            // })

            // console.log({privateKey, publicKey}) 

            // const publicKeyString = await keyTokenService.createKeyToken({
            //     shopId: newShop.id,
            //     publicKey
            // })

            // if (!publicKeyString) {
            //     return {
            //         code: 'xxx',
            //         message: 'Public key error'
            //     }
            // }

            // const publicKeyObject = crypto.createPublicKey(publicKeyString)
            // // create token pair
            // const token = await createTokenPair({shopId: newShop.id, email}, publicKeyObject, privateKey)
            // console.log(`Create token success::`, token);

            // return {
            //     code: 201,
            //     metadata: {
            //         shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            //         token
            //     }
            // }

            // version 2
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')

            const keyStores = await keyTokenService.createKeyToken({
                shopId: newShop.id,
                publicKey,
                privateKey
            })

            if (!keyStores) {
                return {
                    code: 'xxx',
                    message: 'keyStores error'
                }
            }

            const tokens = await createTokenPair({shopId: newShop.id, email}, publicKey, privateKey)
            console.log(`Create token success::`, tokens);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }
        }

        return {
            code: 200,
            metadata: null
        }
    }

    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError('Shop not registered!')

        const {_id: shopId} = foundShop

        const math = bcrypt.compare(password, foundShop.password)
        if (!math) throw new AuthFailureError('Authentication error!')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({shopId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            shopId, 
            publicKey, 
            privateKey, 
            refreshToken: tokens.refreshToken
        })

        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    static logout = async ({keyStore}) => {
        const delKey = await KeyTokenService.deleteOneKeyById(keyStore._id)
        return delKey
    }

    static handleRefreshToken = async ({keyStore, shop, refreshToken}) => {
        const {shopId, email} = shop

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteOneKeyByShop(shopId)
            throw new ForbiddenError('Something wrong happend! Please re-login!')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!')

        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Shop not registered!')

        // tao 1 cap token moi
        const tokens = await createTokenPair({shopId, email}, keyStore.publicKey, keyStore.privateKey)
        // update token 
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            shop,
            tokens
        }
    }

    static fetchWithRetry = async (url = 'localhost:3333', errorCount = 0) => {ư
        const ERROR_COUNT_MAX = 3;

        const response = await fetch(url)
        if (response.status < 200 || response.status >= 300) {
            if (errorCount <= ERROR_COUNT_MAX) {
                setTimeout(async () => {
                    await this.fetchWithRetry(url, errorCount + 1)
                }, Math.pow(2, errorCount) * 3000 + Math.random() * 1000) // 3100, 3200..., 3900
            }
        } 

        return response
    }


}

module.exports = AccessService