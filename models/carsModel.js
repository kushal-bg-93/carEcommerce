const { string } = require('joi');
const mongoose=require('mongoose')

const carSchema=new mongoose.Schema({
    carId:{
        type:mongoose.Types.ObjectId,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    speed:{
        type:String,
        required:true
    },
    mileage:{
        type:String,
        required:true
    },
    control:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    collection:"Carscollection"
})

module.exports=mongoose.model("Carscollection",carSchema);