const mongoose = require('mongoose');
const carsModel=require('../../models/carsModel')


const carsCtrl={
    create:async (req,res)=>{
        try {
            // creating new id for each car
            const id=new mongoose.Types.ObjectId();
            const cars= carsModel({carId:id,...req.body})
            
            await cars.save();
            res.status(200).json({msg:"Cars Successfully Added",cars})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getCar:async (req,res)=>{
        try {
            const cars=await carsModel.find({},{createdAt:0,updatedAt:0,carId:0});
            if(cars.length!==0){
                res.status(200).json({msg:"Cars data fetched successfully",data:cars})

            }else{
                res.status(400).json({msg:"No data to fetch"})
            }
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getFastestCar:async (req,res)=>{
        try {
            const data=await carsModel.aggregate([{
                $sort:{'speed':-1}
            }])

            const maximumSpeed=data[0].speed;
           let fastestCar= data.filter((item)=>item.speed==maximumSpeed)

            res.status(200).json({msg:"fastest car is ",result:fastestCar})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }


}

module.exports=carsCtrl;