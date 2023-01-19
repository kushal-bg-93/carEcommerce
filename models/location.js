const mongoose=require('mongoose')

const locationSchema=new mongoose.Schema({
    carId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    latitude:{
        type:Number,
        required:true
    },
    longitude:{
        type:Number,
        required:true
    },
    locationUpdatedAt:{
        type:Date,
        required:true
    },
    stoppedStatus:{
        type:Boolean,
    },
    markStart:{
        type:Boolean
    },
    markStop:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    collection:"CarsLocationCollection"
})

module.exports=mongoose.model("CarsLocationCollection",locationSchema);