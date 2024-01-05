'use strict'

const { OK } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new OK({
            message: 'Create new comment',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new OK({
            message: 'Delete new comment',
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new OK({
            message: 'Get comments',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()