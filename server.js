const app = require('./app');

const dotenv=require('dotenv');

const connectDataBase=require('./config/database');

//Handle uncaughtException
process.on('uncaughtException',(err)=>{
    console.log(`uncaughtException: ${err.message}`);
    console.log(`shutting down...the server due to uncaughtException`);
    process.exit(1);
})



//config connect

dotenv.config({path:'./config/config.env'});

//mongoose connect
connectDataBase()

const server= app.listen(process.env.PORT || 4000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);

})
//https://backend-app3.herokuapp.com/products

// unhandled promise rejections
process.on('unhandledRejection',(err)=>{
    console.log(`unhandledRejection: ${err.message}`);
    console.log(`Shuding down...`);
    server.close(()=>{
        process.exit(1);
    });
})