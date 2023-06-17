const Order = require('../model/orderModel');
const ErrorHandler = require("../utils/errorhandler");

const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel")
 

//create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice,totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });
});


exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
     const order =await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler(`Order not found:${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order
    });
}
);

//get logged in user orders
exports.myOrder = catchAsyncError(async (req, res, next) => {
    const orders =await Order.find({user:req.user._id});
  
   res.status(200).json({
       success: true,
       orders
   });
});


//get all Order-- Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders =await Order.find();
    let totalAmount =0
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    }) 
  
   res.status(200).json({
       success: true,
       orders
   });
});


//update order status-- Admin

exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order =await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }

    if(order.orderStatus ==="Delivered"){
        return next(new ErrorHandler("Order already delivered", 404));
    }
   order.orderItems.forEach(async(o)=>{
       await updateStock(o.Product,o.quantity)
   })
    order.orderStatus =req.body.status;    

    if(req.body.status=="delivered"){
        order.deliveredAt =Date.now();
    }
    await order.save({validateBeforeSave:false});

   res.status(200).json({
       success: true,
       
   });
});
async function updateStock(id,quantity){
    const product =await Product.findById(id);
    product.stock -=quantity;
    await product.save({validateBeforeSave:false});
}

//delete Order-- Admin

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order =await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order not found", 404));
    }
   
  await order.remove();
   res.status(200).json({
       success: true,
   });
});
