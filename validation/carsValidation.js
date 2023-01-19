const joi=require('joi')

const carsValidation=(req,res,next)=>{
    const Schema=joi.object().keys({
        name:joi.string().required(),
        description:joi.string().required(),
        speed:joi.string().required(),
        mileage:joi.string().required(),
        control:joi.string().required(),
        type:joi.string().required(),
        price:joi.number().required()
    })
    const {error}=Schema.validate(req.body);

    if(error){
        const {details}=error
        res.status(500).json({err:details})
    }else{
        next();
    }
}

module.exports=carsValidation;