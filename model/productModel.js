const mongoose = require('mongoose');

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'product name is required'],
        trim:true
    },
     description:{
        type:String,
        required:[true,'product description is required']
     },
        price:{
        type:Number,
        required:[true,'product price is required'],
        maxLength:[8,'product price is max 8 digit']
        },
        ratings:{
        type:Number,
        default:0
        },
        images:[
           { public_id:{
                type:String,
                required:true
            },
            
            url:{
                type:String,
                required:true
            }
        }
    ],
        category:{
        type:String,
        required:[true,'product category is required']
        },
        Stock:{
            type:Number,
            required:[true,'product stock is required'] ,
            maxLength:[4,'product stock is max 4 digit']
        },
        numOfReviews:{
            type:Number,
            default:0

        },
        reviews:[
            {

                user:{
                    type:mongoose.Schema.ObjectId,
                    ref:'User',
                    required:true,
        
                },
                name:{
                    type:String,
                    required:[true,'review name is required']
                },
                rating:{
                    type:Number,
                    required:[true,'review rating is required']
                },
                comment:{
                    type:String,
                    required:[true,'review comment is required']
                }
            }
        ],
      
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true,

        },


        createdAt:{
            type:Date,
            default:Date.now
        }
})

    module.exports = mongoose.model('Product',productSchema);