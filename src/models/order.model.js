'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    user:{
        type:Number,
        required:true,
    },
    checkout:{
        type:Object,
        default: {},
    },
    shipping:{
        type:Object,
        default: {},
    },
    payment:{
        type:Object,
        default: {},
    },
    products: {
        type: Array,
        required: true
    },
    tracking_number: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'canceled', 'delivered'],
        default: 'pending'
    }
}, {
    timestamps: true,
    colletion: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);