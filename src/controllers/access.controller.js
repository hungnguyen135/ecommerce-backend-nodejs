'use strict'

const { OK, CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register success',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        new OK({
            message: 'Login success',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout success',
            metadata: await AccessService.logout({ keyStore: req.keyStore })
        }).send(res)
    }

    handleRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Get token success',
            metadata: await AccessService.handleRefreshToken({ 
                keyStore: req.keyStore,
                shop: req.shop,
                refreshToken: req.refreshToken
             })
        }).send(res)
    }
}

module.exports = new AccessController()