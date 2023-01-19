const mongoose = require('mongoose');
const orderModel=require('../../models/orderModel')
const carModel=require('../../models/carsModel');
const carsModel = require('../../models/carsModel');
const Razorpay = require('razorpay');
const crypto=require('crypto')


const ordersCtrl={

    createOrder:async (req,res)=>{
        try {
            console.log('This is user ID',req.user.id)
            const cId=new mongoose.Types.ObjectId(req.query.carId);
            const carDetails=await carsModel.findOne({_id:cId});

            // if no record present for that particular carId 
            if(!carDetails){
                res.status(500).json({msg:"Invalid car id"})
            }
            console.log(carDetails)
            const finalPrice=carDetails.price * parseInt(req.query.totalDays)*100
            // res.status(200).json(carDetails)

            const razorpayInstance=new Razorpay({
                key_id: process.env.RAZOR_PAY_KEY_ID,
                key_secret:process.env.RAZOR_PAY_SECRET_KEY
            })

	// STEP 1:
	// const {totalDays} = req.body;
    	
		
	// STEP 2:	
	razorpayInstance.orders.create({
        'amount':finalPrice,
        'currency':'INR',
        'notes':{
            'carId':carDetails.carId
        }
    },
		async (err, order)=>{	
		//STEP 3 & 4:
		if(!err){
            let price=finalPrice/100;
            let uid=new mongoose.Types.ObjectId(req.user.id)
            const createOrder=orderModel({orderId:order.id,carDetails:cId,noOfDays:req.query.totalDays,price:price,userId:uid,address:req.query.address,mobile:req.query.mobile,name:req.query.name});
            await createOrder.save()
			res.status(200).json(order)
        }
		else{

			res.send(err);
        }
		}
	)

            
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    verifyPayment:async (req,res)=>{
        try {
	
	 //Receive Payment Data
	const {order_id, payment_id} = req.query;	
	const razorpay_signature = req.headers.signature;
    // console.log('oid',order_id,'pid',payment_id)

	// Pass yours key_secret here
	const key_secret = process.env.RAZOR_PAY_SECRET_KEY;	

	//Verification & Send Response to User
	
	// Creating hmac object
	let hmac = crypto.createHmac('sha256', key_secret);

	// Passing the data to be hashed
	hmac.update(order_id + "|" + payment_id);
    // console.log('This is hmac',hmac)
	
	// Creating the hmac in the required format
	const generated_signature = hmac.digest('hex');
    // console.log('Generated signature==>',generated_signature)
    // console.log('razor pay signature==>',razorpay_signature)
	
	
	if(razorpay_signature===generated_signature){
        let uid=new mongoose.Types.ObjectId(req.user.id)
        const updateOrder=await orderModel.updateOne({orderId:order_id,userId:uid},{$set:{paymentStatus:"success",razor_pay_payment_id:payment_id}})
        console.log('update order',updateOrder)
        if(updateOrder.acknowledged && updateOrder.modifiedCount==1 && updateOrder.matchedCount==1){

            res.json({success:true, message:"Payment has been verified"})
        }else{
            res.status(400).json({msg:"There is no order with the given order id for this user"})
        }

	}
	else
	res.json({success:false, message:"Payment verification failed"})



        } catch (error) {
            res.status(500).json({msg:error.message})
            
        }
    },

    getOrders:async (req,res)=>{
        try {
        let uid=new mongoose.Types.ObjectId(req.user.id)
            const orders=await orderModel.find({userId:uid}).populate('carDetails')
            if(orders.length!==0){
                res.status(200).json({msg:"Order details fetched successfully",result:orders})
            }else{

                res.status(200).json({msg:"No orders has been placed yet"})
            }
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getAllOrders:async (req,res)=>{
        // this is for admin only 
        try {
            let uid=new mongoose.Types.ObjectId(req.user.id)
            const orders=await orderModel.find({userId:uid}).populate('carDetails')
            if(orders.length!==0){
                res.status(200).json({msg:"Order details fetched successfully",result:orders})
            }else{

                res.status(200).json({msg:"No orders has been placed yet"})
            }
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getMostOrderedCars:async (req,res)=>{
        try {
            const data=await orderModel.aggregate([{
                $match:{
                    'paymentStatus':'success'
                }
            },{
                $group:{
                    '_id':'$carDetails',
                    'count':{$sum:1}
                }
            },{
                $lookup:{
                    from:'Carscollection',
                    localField:'_id',
                    foreignField:'_id',
                    as:'result'
                }
            },{
                $sort:{'count':-1}
            }])

            // getting the maximum ordered value from sorted list of array and filtering it 
            const maxOrdered=data[0].count;
            let mostOrdered=data.filter((item)=>item.count==maxOrdered)
            res.status(200).json({result:mostOrdered})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    giveRating:async (req,res)=>{
        try {
            const rating=parseInt(req.query.rating);
            // const oid=new mongoose.Types.ObjectId(req.query.oid)
            let uid=new mongoose.Types.ObjectId(req.user.id)

            const checkRating=await orderModel.findOne({orderId:req.query.orderId})
            if(!checkRating){
                res.status(200).json({msg:"Invalid order Id"})
            }else if(checkRating.userId!=req.user.id){
                res.status(200).json({msg:"Invalid order Id for this particular user"})

            }else{
                const updateRating=await orderModel.updateOne({orderId:req.query.orderId},{rating:rating})

            if(updateRating.acknowledged && updateRating.modifiedCount==1 && updateRating.matchedCount==1){

                res.json({success:true, message:"Rating has been updated for the given order"})
            }else{
                res.status(400).json({msg:"Please give a valid rating"})
            }
            }
            

        } catch (error) {
            res.status(500).json({msg:error.message})
            
        }
    },

    getHighestRatedCar:async (req,res)=>{
        try {
            const data=await orderModel.aggregate([{
                $group:{
                    '_id':'$carDetails',
                    'count':{$sum:1},
                    'ratingCount':{$sum:'$rating'}
                }
            },{
                $project:{
                    '_id':1,
                    'avgRating':{'$divide':['$ratingCount','$count']}
                }
            },{
                $sort:{
                    'avgRating':-1
                }
            },{
                $lookup:{
                    from:'Carscollection',
                    localField:'_id',
                    foreignField:'_id',
                    as:'result'
                }
            }])

            const maxRating=data[0].avgRating;

            let highestRatedCar=data.filter((item)=>item.avgRating==maxRating)


            res.status(200).json({result:highestRatedCar})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getMostBookedCar:async (req,res)=>{
        try {
            const data=await orderModel.aggregate([{
                $group:{
                    '_id':'$carDetails',
                    'count':{$sum:'$noOfDays'}
                }
            },{
                $sort:{
                    'count':-1
                }
            },{
                $lookup:{
                    from:'Carscollection',
                    localField:'_id',
                    foreignField:'_id',
                    as:'result'
                }
            }])

            const maxValue=data[0].count;

            let mostBooked=data.filter((item)=>item.count==maxValue)



            res.status(200).json({msg:"highest booked car is ",mostBooked})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }



}

module.exports=ordersCtrl;