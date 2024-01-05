'use strict'

const { NotFoundError } = require("../core/error.response")
const commentModel = require("../models/comment.model")
const { getProduct } = require("../models/repositories/product.repo")
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
            parentId: parentCommentId,
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

    static async deleteComment({
        commentId, 
        productId
    }) {
        const foundProduct = await getProduct({
            productId
        })
        if (!foundProduct) throw new NotFoundError('Product not found!')

        // xac dinh gia tri left va right cua comment
        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found!')

        const leftValue = comment.left
        const rightValue = comment.right

        // tinh width
        const width = rightValue - leftValue

        // xoa tat ca comment con
        await commentModel.deleteMany({
            productId: convertToObjectIdMongoDb(productId),
            left: {
                $gte: leftValue,
                $lte: rightValue
            }
        })

        // cap nhat gia tri left va right con lai
        await commentModel.updateMany({
            productId: convertToObjectIdMongoDb(productId),
            right: {
                $gt: rightValue
            }
        }, {
            $inc: {
                right: -width
            }
        })

        await commentModel.updateMany({
            productId: convertToObjectIdMongoDb(productId),
            left: {
                $gt: rightValue
            }
        }, {
            $inc: {
                left: -width
            }
        })
        
        return true
    }
}

module.exports = CommentService