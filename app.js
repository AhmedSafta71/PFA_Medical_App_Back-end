const express =require('express'); 
const https =require('https'); 
const fs = require('fs');
const fileUpload = require('express-fileupload'); 
const path =require('path'); 
//create an express app 
const app =express(); 
const dotenv =require('dotenv'); 
const errorMiddelware= require('./middlewares/errors');
const connectDatabase = require('./config/database');
const cookieParser= require('cookie-parser');
const bodyParser= require('body-parser')
const cloudinary = require('cloudinary');
const doctors = require('./routes/doctorsRoutes');
const users=require('./routes/userRoutes')
// handle uncaught exceptions 
dotenv.config({path: '.env'});
process.on('uncaughtException', err =>{
    console.log(`error: ${err.stack}` ); 
    console.log("shutting down due to uncaught exceptions "); 
    process.exit(1)
})
connectDatabase(); 
https.createServer(
    {
        key: fs.readFileSync('key.pem'), 
        cert:fs.readFileSync('cert.pem')
    },app).listen(process.env.PORT,()=>{
    console.log(`Process is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:true })); 
app.use(fileUpload({useTempFiles: true})); 


// use default routes cf
try {
    app.use('', doctors);
    app.use('', users);

}
catch (error){
    console.log( "error " , error); 
}


//set up cloudianry 
try{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }) 

}
catch(err) {
    console.log(err); 
}