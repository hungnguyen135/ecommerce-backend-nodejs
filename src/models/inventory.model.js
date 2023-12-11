'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    product:{
        type:Types.ObjectId,
        ref:'Product',
    },
    location:{
        type:String,
        default:'',
    },
    stock:{
        type:Number,
        required:true,
    },
    shop:{
        type:Types.ObjectId,
        ref:'Shop',
    },
    reservations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    colletion: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);