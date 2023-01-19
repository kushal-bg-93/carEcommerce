// const { string } = require('joi');
const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
   orderId:{
       type:String,
       required:true,
       unique:true
   },
   carDetails:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Carscollection'
   },
   noOfDays:{
       type:Number,
       default:1
   },
   price:{
       type:Number,
       required:true
   },
   rating:{
       type:Number
   },
   paymentStatus:{
       type:String,
       enum:["pending","success"],
       default:"pending"
   },
   userId:{
    type:mongoose.Types.ObjectId,
    required:true
   },
   razor_pay_payment_id:{
       type:String
   },
   address:{
       type:String,
       required:true
   },
   mobile:{
       type:String,
       required:true
   },
   name:{
       type:String,
       required:true
   }

},{
    timestamps:true,
    collection:"Orderscollection"
})

module.exports=mongoose.model("Orders",orderSchema);