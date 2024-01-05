'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'notifications'

// Declare the Schema of the Mongo model
var notificationSchema = new Schema({
    type:{
        type:String,
        enum:['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    senderId:{
        type:Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    receivedId:{
        type:Number,
        required: true,
    },
    content:{
        type:String,
        required: true
    },
    options: {
        type:Object,
        default: {}
    }
}, {
    timestamps: true,
    colletion: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);