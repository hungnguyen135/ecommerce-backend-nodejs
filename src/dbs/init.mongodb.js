'use strict'

const mongoose = require('mongoose')

const connectionString = `mongodb://localhost:27017/shop-dev`;

class Database {
    constructor() {
        this.connect()
    }

    connect() {
       
        mongoose.connect(connectionString).then(_ => console.log(`Connected mongodb success`))
        .catch(err => console.log(`Error connect`))
    }
}

module.exports = mongoose
