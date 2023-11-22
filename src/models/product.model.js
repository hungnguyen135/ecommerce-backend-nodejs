'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Products'
const COLLECTION_NAME = 'products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    thumb:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
        enum: ['electronic', 'clothes', 'Furniture']
    },
    shop:{
        type: Types.ObjectId,
        ref: 'Shop',
    },
    attributes:{
        type: Schema.Types.Mixed,
        required:true,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// define the product type = clothes
const clothesSchema = new Schema({
    brand: {
        type: String,
        require: true
    },
    size: String,
    material: String,
    shop:{
        type: Types.ObjectId,
        ref: 'Shop',
    },
}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronics
const electronicSchema = new Schema({
    manu_facturer: {
        type: String,
        require: true
    },
    model: String,
    color: String,
    shop:{
        type: Types.ObjectId,
        ref: 'Shop',
    },
}, {
    collection: 'electronics',
    timestamps: true
})


//Export the model
module.exports = {
    productModel: model(DOCUMENT_NAME, productSchema),
    clothesModel: model('Clothes', clothesSchema),
    electronicModel: model('Electronics', electronicSchema)
}