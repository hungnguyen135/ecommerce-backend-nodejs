'use strict'

const {Schema, model} = require('mongoose');
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    shop:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Shop',
        index:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,
        default:[],
    },
    refreshToken:{
        type:String,
        require:true,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);