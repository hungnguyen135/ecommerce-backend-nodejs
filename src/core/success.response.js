'use strict'

const statusCode = {
    OK: 200, 
    CREATED: 201
}

const reasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({message, status = statusCode.OK, reason = reasonStatusCode.OK, metadata = {}}) {
        this.message = !message ? reason : message
        this.status = status
        this.metadata = metadata
    }

    send(res, header = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}) {
        super({message, metadata})
    }
}

class CREATED extends SuccessResponse {
    constructor({options = {}, message, status = statusCode.CREATED, reason = reasonStatusCode.CREATED, metadata}) {
        super({message, status, reason, metadata})
        this.options = options
    }
}

module.exports = {
    OK, 
    CREATED
}