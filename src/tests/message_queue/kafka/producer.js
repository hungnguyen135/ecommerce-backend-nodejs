const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
  logLevel: logLevel.NOTHING //logging
})

// Now to produce a message to a topic, we'll create a producer using our client:

const producer = kafka.producer()

const runProducer = async () => {
    await producer.connect()
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello, Kafka for kevinhung135!' },
      ],
    })
    
    await producer.disconnect()
}

runProducer().catch(console.error)