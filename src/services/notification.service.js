'use strict'

const notificationModel = require("../models/notification.model")

const pushNotiToSystem = async ({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let content

    if (type === 'SHOP-001') {
        content = `@@@ vừa thêm một sản phẩm: @@@`
    } else if (type === 'PROMOTION-001') {
        content = `@@@ vừa thêm một voucher: @@@@@`
    }

    const newNoti = await notificationModel.create({
        type: type,
        content: content,
        senderId: senderId,
        receivedId: receivedId,
        options: options
    })

    return newNoti
}

const getListNotiByUser = async ({
    userId = 135,
    type = 'ALL',
    isRead = 0
}) => {
    const match = {receivedId: userId}
    if (type !== 'ALL') {
        match['type'] = type
    }

    return await notificationModel.aggregate([
        {
            $match: match
        }, {
            $project: {
                type: 1,
                senderId: 1,
                receivedId: 1,
                content: {
                    $concat: [
                        {
                            $substr: ['$options.shopName', 0, -1]
                        },
                        ' vừa mới thêm một sản phẩm mới: ',
                        {
                            $substr: ['$options.productName', 0, -1]
                        }
                    ]
                },
                createdAt: 1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    getListNotiByUser
}