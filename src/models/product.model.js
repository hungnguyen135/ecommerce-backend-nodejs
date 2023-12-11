'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');
const DOCUMENT_NAME = 'Products'
const COLLECTION_NAME = 'products'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
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
    rate:{
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// create index for search
productSchema.index({name: 'text', description: 'text'})

// document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

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