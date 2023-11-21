'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'apikeys'

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    permissions:{
        type:[String],
        required:true,
        enum:['0000', '1111', '2222'],
    },
}, {
    timestamps: true,
    colletion: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);