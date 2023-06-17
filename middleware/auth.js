const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorhandler")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")

exports.isAuthenticatedUser =catchAsyncError(async(req, res, next) => {
   
    const {token} =req.cookies
    
    if(!token){
        return next(new ErrorHandler("please Login to access this resource",401))
    }
    const decodedData =jwt.verify(token, process.env.JWT_SECRET);

   req.user= await User.findById(decodedData.id)

   next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not authorized to access this route`, 403));
        }
        next()
    }
}
