'use strict'

const mongoose = require('mongoose')

const connectionString = `mongodb://localhost:27017/shop-dev`;
mongoose.connect(connectionString).then(_ => console.log(`Connected mongodb success`))
.catch(err => console.log(`Error connect`))

// dev 
if(1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose
