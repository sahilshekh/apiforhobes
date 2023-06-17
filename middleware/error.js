const ErrorHandler=require('../utils/errorhandler');

module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongodb id error
    if(err.name==='CastError'){
        const message = `Resource not found with id ${err.path}`;
         err = new ErrorHandler(message,400);
    
        }

        // duplicate key error
        if(err.code===11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            err = new ErrorHandler(message,400);
        }

        //jwt validation error
        if(err.name==='JsonWebTokenError'){
            const message = `Invalid token`;
            err = new ErrorHandler(message,401);
        }

        // jwt expired error
        if(err.name==='TokenExpiredError'){
            const message = `Token expired`;
            err = new ErrorHandler(message,401);
        }


    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}
