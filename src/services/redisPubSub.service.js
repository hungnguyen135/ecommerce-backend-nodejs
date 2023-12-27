'use strict'

const redis = require('redis')

class RedisPubSubService {
    constructor() {
        this.subscriber = redis.createClient();
        this.publisher = redis.createClient();
    }

    publishFunc(channel, message) {
        return new Promise((resolve, reject) => {
            if (this.publisher.connected) {
                this.publisher.publish(channel, message, (err, reply) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(reply);
                    }
                });
            } else {
                reject(new Error('Kết nối Redis đã đóng.'));
            }
        })
    }

    subscriberFunc(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService()