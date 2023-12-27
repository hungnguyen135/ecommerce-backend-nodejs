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
}

module.exports = new CommentController()