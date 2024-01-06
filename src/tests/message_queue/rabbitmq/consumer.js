const amqplib = require('amqplib')

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, (message) => {
            console.log(`Received ${message.content.toString()}`);
        }, {
            noAck: true // true: nếu dữ liệu đã được xử lý rồi thì sẽ không được gửi lại nữa
        })
        
    } catch (error) {
        console.error(error);
    }
}

runProducer().catch(console.error)