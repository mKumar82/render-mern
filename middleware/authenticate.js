const jwt=require("jsonwebtoken");
const User=require("../models/userSchema");



const authenticate=async(req,res,next)=>{
   
    try {
        // console.log("im up here");

        // get token from cookies
        const token=req.cookies.jwtoken;

        // verify this token with secretKey which we have given at token generation
        const verifyToken= jwt.verify(token,process.env.SECRET_KEY);

        // now verifyToken contains the all user data we will check if the user exists
        const rootUser=await User.find({
            _id:verifyToken._id,
            "tokens.token":token
        });

        if(!rootUser){
            throw new Error ("user not found");
        }
        
        // this will help in getting data
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser[0]._id;     
        //***********remember this object is the 0th position of an array*******

        // used to go next otherwise it will stuck here
        next();
    } catch (err) {
        res.status(401).send("unauthorized : no token provided");
        console.log(err);
       
    }
}

module.exports = authenticate;