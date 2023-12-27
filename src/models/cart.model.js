"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    state: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'failed', 'pending'],
      default: 'active'
    },
    products: {
      type: Array,
      required: true,
      default: [],
    },
    count_product: {
      type: Number,
      default: 0,
    },
    user: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
    colletion: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
