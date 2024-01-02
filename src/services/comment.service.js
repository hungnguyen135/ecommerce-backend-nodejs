'use strict'

const { NotFoundError } = require("../core/error.response")
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

        let rightValue
        if(parentCommentId) {
            // reply comment
            const parentComment = await commentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.right

            await commentModel.updateMany({
                productId: convertToObjectIdMongoDb(productId),
                right: {$gte: rightValue}
            }, {
                $inc: {
                    right: 2
                }
            })

            await commentModel.updateMany({
                productId: convertToObjectIdMongoDb(productId),
                left: {$gt: rightValue}
            }, {
                $inc: {
                    left: 2
                }
            })

        } else {
            const maxRightValue = await commentModel.findOne({
                productId: convertToObjectIdMongoDb(productId)
            }, 'right', {sort: {right: -1}})

            if (maxRightValue) {
                rightValue = maxRightValue + 1
            } else {
                rightValue = 1
            }
        }

        comment.left = rightValue
        comment.right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Not found comment for product')

            const comments = await commentModel.find({
                productId: convertToObjectIdMongoDb(productId),
                left: {$gt: parent.left},
                right: {$lte: parent.right}
            }).select({
                left: 1,
                right: 1,
                content: 1,
                parentId: 1
            }).sort({
                left: 1
            })

            return comments
        }

        const comments = await commentModel.find({
            productId: convertToObjectIdMongoDb(productId),
            parentId: convertToObjectIdMongoDb(parentCommentId),
        }).select({
            left: 1,
            right: 1,
            content: 1,
            parentId: 1
        }).sort({
            left: 1
        })

        return comments
    }
}

module.exports = CommentService