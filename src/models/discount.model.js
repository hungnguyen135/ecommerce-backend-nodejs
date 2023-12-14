'use strict'

const {model, Schema, Types} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    type:{
        type:String,
        default:'fixed_amount',
    },
    value:{
        type:Number,
        required:true,
    },
    max_value:{
        type:Number,
        required:true,
    },
    code: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    max_uses: {
        type: Number,
        required: true
    },
    uses_count: {
        type: Number,
        required: true
    },
    users_used: {
        type: Array,
        default: []
    },
    max_uses_per_user: {
        type: Number,
        required: true
    },
    min_order_value: {
        type: Number,
        required: true
    },
    shop: {
        type: Types.ObjectId,
        ref: 'Shop'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    applies_to: {
        type: String,
        required: true,
        enum: ['all', 'specific']
    },
    product_ids: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    colletion: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);