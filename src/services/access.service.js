'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require("../models/shop.model")

const shopRoles = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: hashPassword, roles: [shopRoles.SHOP]
            })
            if (newShop) {
                // create privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })

                console.log({privateKey, publicKey}) 
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService