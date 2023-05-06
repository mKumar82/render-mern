// this file is just for connecting database and backend

const mongoose = require("mongoose");
 
// we are calling connnectDB from app.js DB is the prop passed which is the URI  
const connectDB = (DB)=>{
  
  // connectDB is returning a promise 
 return  mongoose.connect(DB, {
    useNewUrlParser: true,   
    useUnifiedTopology: true,
  }).then(()=>console.log("db connected")).catch((e)=>console.log("db Not connected "+e))
  
}

module.exports = connectDB;

