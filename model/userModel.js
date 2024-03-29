const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
       maxLength:[30,'Name must be less than 30 characters'],
         minLength:[3,'Name must be more than 3 characters']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        validate:[validator.isEmail,'Please provide a valid email'],

    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minLength:[8,'Password must be more than 8 characters'],
        maxLength:[30,'Password must be less than 30 characters'],
        select:false,

    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user',
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
})

userSchema.pre('save',async function(next){
   if(!this.isModified('password')){
    next()
   };
    this.password= await bcrypt.hash(this.password,10);
})


//jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// Campare Pass
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password);
}

//genrating  Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


module.exports = mongoose.model('User',userSchema);