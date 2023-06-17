const Product = require("../model/productModel")
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");


//create products-- Admin
 exports.createProduct=catchAsyncError( async (req,res,next)=>{

    req.body.user = req.user.id; 

    const product= await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })

 });
//get all products
exports.getAllProducts=catchAsyncError( async(req,res,next)=>{
    
    var singleObj = {}
    
    var sType = req.query.type;
    var sName = req.query.value;
    singleObj[sType] = {$lte:sName}
    console.log(singleObj)


    const resultPerPage= 15; 
    const productsCount =await Product.countDocuments()

    const apiFeature= new ApiFeatures(Product.find(singleObj),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    const products = await apiFeature.query; 

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
    });
});
exports.getProductDetails =catchAsyncError( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }
    res.status(200).json({
        success:true,
        product
    })

});

// update product-- Admin

exports.updateProduct= catchAsyncError(async (req,res,next)=>{
    let  product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{

        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        product
    })

}
);
//delete product-- Admin

exports.deleteProduct= catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"product not found"
        })
    }
    await product.remove();

    res.status(200).json({
        success:true,
        message:"product deleted"
    })

});

//create  new  review or update the review
exports.createProductReview= catchAsyncError(async (req,res,next)=>{
    const {rating, comment, productId} = req.body;
    const  review ={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    }
    const product =await Product.findById(productId);
    
    const isReviewed =product.reviews.find((rev)=> rev.user.toString()===req.user._id)
    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()=== req.user._id.toString())
            (rev.rating =rating),(rev.comment =comment)
        
        })
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg=0
    product.reviews.forEach((rev)=>{
        avg+=rev.rating;
    })
    product.rating=avg/product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        product
    })


});

//get all Reviews of a product\
exports.getProductReviews= catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.id);
    if(!product){
       return next(new ErrorHandler("product not found",404))
    }
    res.status(200).json({
        success:true,
       reviews: product.reviews,
    })

});

//delete a review
exports.deleteProductReview= catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
       return next(new ErrorHandler("product not found",404))
    }
  const reviews = product.reviews.filter((rev)=> rev._id.toString()!==req.query.id.toString())
    
    let avg=0
    reviews.forEach((rev)=>{
        avg+=rev.rating;
    })
    const ratings=avg/reviews.length;
    const numOfReviews =reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings,    

    },{
        new:true,
        runValidators:true,
        useFindAndModify:false

    });
    res.status(200).json({
        success:true,
        
    })

})



exports.singleProduct= catchAsyncError(async (req,res,next)=>{

try{
    var singleObj = {}

    var sType = req.query.type;
    var sName = req.query.pname;
    singleObj[sType] = sName

    const product = await Product.find(singleObj).lean().exec();
    res.status(200).send(product)
}
catch{
    res.status(400).send("error")

}

});
