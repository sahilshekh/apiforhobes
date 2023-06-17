const express = require('express');
const app = express();
const cors = require("cors")
const cookieParser = require("cookie-parser")

const  errorMiddleware=require('./middleware/error');

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser())

//routes import
const product=require('./routes/productRoute');
const user=require("./routes/userRoutes")
const order = require("./routes/orderRoute")

app.use("/api/v1",product);
app.use("/api/v1",user)
app.use("/api/v1",order)
//middleware for error handling
app.use(errorMiddleware);


module.exports = app;