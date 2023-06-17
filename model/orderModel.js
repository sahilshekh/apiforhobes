const mongoose  = require("mongoose")

const orderSchema = new mongoose.Schema({
     shippingInfo :{
         address:{ type:String, required:true},
            city:{ type:String, required:true},
            state:{ type:String, required:true},
            country:{ type:String, required:true},

        
        pinCode:{ type:Number, required:true},
        phonNo:{ type:Number, required:true},
     },
        
    orderItems:[
        {
            name:{ type:String, required:true},
            price:{ type:Number, required:true},
            quantity:{ type:Number, required:true},
            image:{
                type:String,
                required:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                required:true
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    paymentInfo :{
        //paymentMethod:{ type:String, required:true},
         status:{ type:String, required:true},
        id:{ type:String, required:true},
    },

    paidAt:{
        type:Date,
        default:Date.now
    },
    itemsPrice:{
        required:true,
        type:Number,
        default:0
    },
    taxPrice:{
        required:true,
        type:Number,
        default:0
    },
    shippingPrice:{
        required:true,
        type:Number,
        default:0
    },
    totalPrice:{
        required:true,
        type:Number,
        default:0
    },
     orderStatus:{
        type:String,
        required:true,
        default:"Processing"
     },
     deliveredAt:Date,
     createdAt:
     {
        type:Date,
        default:Date.now
        },

    });
module.exports = mongoose.model("Order", orderSchema);



