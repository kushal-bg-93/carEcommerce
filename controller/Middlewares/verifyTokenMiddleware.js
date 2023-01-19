const req = require('express/lib/request');
const res = require('express/lib/response');
const jwt=require('jsonwebtoken')


//To check the token provided

const verifyToken=async(req,res,next)=>{
    const authToken=req.headers.token;
    if(!authToken){
        res.status(400).json({msg:"Session Expired"})
    }

    try {
        const data=jwt.verify(authToken,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(err) res.status(500).json({err})
            req.user=user;

        })
  
        // // console.log(req.body)
        // if(verifyTokenAndAuthorization(req.body.id,req.user.id)){
        //     req.user=data;
        //     next()
        // }
        // else{
        //     res.status(400).json({msg:"Invalid authorization"})
        // }
        next();
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}

//To verify the token and the authentication
const verifyTokenAndAuthorization=(req,res,next)=>{
verifyToken(req,res,()=>{
    if(req.params.id===req.user.id || req.user.isAdmin){
        next();
    } else{
        res.status(400).json({msg:"Invalid token"})
    }
});

}


//To verify Admin
const verifyAdmin=async (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }
        else {
            res.status(400).json({msg:"Unauthorised access"})
        }
    })
}

module.exports={verifyToken,verifyTokenAndAuthorization,verifyAdmin}