const joi=require('joi')

const registerValidation=(req,res,next)=>{
    const Schema=joi.object().keys({
        name:joi.string().required(),
        password:joi.string().required(),
        email:joi.string().email({
            minDomainSegments:2,
            tlds:{allow:["com","in","net"]}
        }),
        mobile:joi.string().length(10),
        isAdmin:joi.bool().optional()
    })
    const {error}=Schema.validate(req.body);

    if(error){
        const {details}=error
        res.status(500).json({err:details})
    }else{
        next();
    }
}

module.exports=registerValidation;