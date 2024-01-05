'use strict'

const { OK } = require("../core/success.response")
const {getListNotiByUser} = require("../services/notification.service")

class NotificationController {
    getListNotiByUser = async (req, res, next) => {
        new OK({
            message: 'Get comments',
            metadata: await getListNotiByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()