'use strict'

const { CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register success',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }

    login = async (req, res, next) => {
        new CREATED({
            message: 'Login success',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()