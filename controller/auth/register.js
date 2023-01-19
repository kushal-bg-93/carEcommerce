const cryptojs=require('crypto-js')
const user=require('../../models/usermodel')

const registerCtrl=async (req,res)=>{
    // res.send("Register Route working")

   const {email}=req.body;

   const extUser=await user.findOne({email})

   if(extUser){
    res.status(400).json({msg:"User Already Exists... Please Login"})
}

    // console.log(extUser.length)
else{

    
    const {password,...otherdata}=req.body;
    
    const encryptPassword=cryptojs.AES.encrypt(password,process.env.CRYPTO_SECRET_KEY)
    
    try {
        const result =await user({...otherdata,password:encryptPassword})
        
        result.save();
        res.status(200).json({msg:"User Successfully Registered"})
        
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
    
}
}

module.exports=registerCtrl;