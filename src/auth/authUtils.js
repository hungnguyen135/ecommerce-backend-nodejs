'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByShopId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'x-rtoken'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // version 1
        // accessToken
        // const accessToken = await JWT.sign(payload, privateKey, {
        //     algorithm: 'RS256',
        //     expiresIn: '2 days'
        // })

        // const refreshToken = await JWT.sign(payload, privateKey, {
        //     algorithm: 'RS256',
        //     expiresIn: '7 days'
        // })

        // version 2
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify::`, err);
            } else {
                console.log(`Decode verify::`, decode);
            }
        })

        return {accessToken, refreshToken}
    } catch (error) {
        return error
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const shopId = req.headers[HEADER.CLIENT_ID]
    if (!shopId) throw new AuthFailureError('Invalid Request!')

    const keyStore = await findByShopId(shopId)
    console.log(keyStore)
    if (!keyStore) throw new NotFoundError('Not found keystore!')

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeShop = JWT.verify(refreshToken, keyStore.privateKey)
            if (shopId !== decodeShop.shopId) throw new AuthFailureError('Invalid shop!')
            req.keyStore = keyStore
            req.shop = decodeShop
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid Request 1!')
    try {
        const decodeShop = JWT.verify(accessToken, keyStore.publicKey)
        if (shopId !== decodeShop.shopId) throw new AuthFailureError('Invalid shop!')
        req.keyStore = keyStore
        req.shop = decodeShop
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}