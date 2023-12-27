'use strict'

const redis = require('redis')
const {promisify} = require('util')
const { revervationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.PEXPIRE).bind(redisClient)
const setnxAsync = promisify(redisClient.SETNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < array.length; i++) {
        // Tao mot ke, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime);

        if (result === 1) {
            // thao tac voi inventory
            const isReversation = await revervationInventory({
                productId,
                quantity, cartId
            })

            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve), 50)
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return delAsyncKey
}

module.exports = {
    acquireLock,
    releaseLock
};