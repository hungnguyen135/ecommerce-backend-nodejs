const amqplib = require('amqplib')

const message = 'Hello, RabbitMQ for kevinhung135!'

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`Message sent:`, message);
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error)