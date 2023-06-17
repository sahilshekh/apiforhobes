const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

const User = require("../model/userModel");
const sendToken=require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//register user
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password, avatar } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"this is a sample url"
        },

    });
   
    sendToken(user,200,res);

})

//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {

 const { email, password } = req.body;
  
 //1) check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Incorrect email or password', 401));
    }
    sendToken(user,200,res);
})

//logout user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success',
        message: 'Logout Successfully'
    });
})

//forget password
// exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//         return next(new ErrorHandler('User with this email does not exist', 404));
//     }

// // get reset token
//     const resetToken = user.getResetPasswordToken();
//     await user.save({ validateBeforeSave: false });

//     const resetPasswordUrl =`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

//     const message =`your password reset token is :- \n\n  ${resetPasswordUrl}  \n\nif you did not request this, please ignore this email and your password will remain unchanged.`;


//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'your password reset token',
//             message,
//         });
//         res.status(200).json({
//             status: 'success',
//             message: `Email sent to ${user.email} successfully`
//         });
        

//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpires = undefined;
//         await user.save({ validateBeforeSave: false });
//         return next(new ErrorHandler('Something went wrong. Try again later', 500));
//     }

// })


exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
 // Reset Password
 exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

  //get user details
  exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      user,
    });
  });

 // update User Password
  exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    // check old password
   const  isPasswordMatched =await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Incorrect old password', 401));
    }
    // check new password and confirm password
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler('Password does not match', 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  });

   // update User Profile
   exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const  newUserData ={
        name: req.body.name,
        email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      status: 'success',
      user,
    });
  });

  //get all users(admin)
  exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      users,
    });
  });
//  get single user(admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found:${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    user,
  });
});

 // update User role (admin)
 exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const  newUserData ={
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    status: 'user role updated',
    
  });
});
 // delete User -- (admin)
 exports.deleteUserRole = catchAsyncError(async (req, res, next) => {
 
  const  user =await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found:${req.params.id}`, 404));
  }
  await user.remove();


  res.status(200).json({
    status: 'user deleted successfully',
    
  });
});
