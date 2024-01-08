const amqplib = require('amqplib')

const message = 'Hello, RabbitMQ for kevinhung135!'

const log = console.log

console.log = function() {
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const notiExchange = 'notiExchange' // notification direct
        const notiQueue = 'notiQueueProcess' //assertQueue
        const notiExchangeDLX = 'notiExchangeDLX' 
        const notiExchangeRoutingKeyDLX = 'notiExchangeRoutingKeyDLX' 

        // 1. create exchange
        await channel.assertExchange(notiExchange, 'direct', {
            duration: true
        })

        // 2. create queue 
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phép các kết nối truy cập vào cùng một lúc hàng đợi
            deadLetterExchange: notiExchangeDLX,
            deadLetterRoutingKey: notiExchangeRoutingKeyDLX
        })

        // 3. bind queue
        await channel.bindQueue(queueResult.queue, notiExchange)

        // 4. send message
        const msg = 'a new product'
        console.log(`producer msg`, msg);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error)