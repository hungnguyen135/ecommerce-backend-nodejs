'use strict'

const commentModel = require("../models/comment.model")
const { convertToObjectIdMongoDb } = require("../utils")

class CommentService {
    static async createComment({
        productId, 
        userId,
        content,
        parentCommentId = null,

    }) {
        const comment = new commentModel({
            productId: productId,
            userId: userId,
            content: content,
            parentId: parentCommentId
        })

        let rightvalue
        if(parentCommentId) {
            // reply comment

        } else {
            const maxRightValue = await commentModel.findOne({
                productId: convertToObjectIdMongoDb(productId)
            }, 'right', {sort: {right: -1}})

            if (maxRightValue) {
                rightvalue = maxRightValue + 1
            } else {
                rightvalue = 1
            }
        }

        comment.left = rightvalue
        comment.right = rightvalue + 1

        await comment.save()
        return comment
    }
}

module.exports = new CommentService()