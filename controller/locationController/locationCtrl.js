const mongoose = require('mongoose');
const locationModel=require('../../models/location')
const orderModel=require('../../models/orderModel')
const geolib=require('geolib')
const _=require('lodash')


const locationCtrl={
    // create:async (req,res)=>{
    //     try {
    //         // creating new id for each car
    //         const id=new mongoose.Types.ObjectId();
    //         const cars= carsModel({carId:id,...req.body})
            
    //         await cars.save();
    //         res.status(200).json({msg:"Cars Successfully Added",cars})
    //     } catch (error) {
            // res.status(500).json({msg:error.message})
    //     }
    // },

    updateLocation:async (req,res)=>{
        try {
            let cid=new mongoose.Types.ObjectId(req.query.carId),
            locationUpdatedTime=new Date(),
            uid=new mongoose.Types.ObjectId(req.user.id),
            markStartStatus=false,
            markEndStatus;
            let obj={}

            const checkOrder=await orderModel.find({orderId:req.query.oid,carDetails:cid,userId:uid})
            if(!checkOrder){
                res.status(400).json({msg:"Invalid details"})
            }else {
                const checkStart=await locationModel.find({orderId:req.query.oid}).count();
                // console.log('This is check start>>>',checkStart)
                if(checkStart==0){
                    obj={
                        ...obj,
                        
                        markStart:true
                    }
                }
                if(typeof(req.query.markEnd)!=='undefined'){
                    if(req.query.markEnd){
                        obj={
                            ...obj,
                            markStop:true
                        }
                    }
                }

                console.log('This is location updated time',locationUpdatedTime)
                const updateLocation=locationModel({carId:cid,userId:uid,orderId:req.query.oid,latitude:parseFloat(req.query.latitude),longitude:parseFloat(req.query.longitude),locationUpdatedAt:locationUpdatedTime,...obj})
                await updateLocation.save();
                res.status(200).json({msg:"Location updated successfully"})
            }
        } catch (error) {
            res.status(500).json({msg:error.message})
            
        }
    },

    getTotalDistance:async(req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id})
            let locationArray=[];
            for(let i=0;i<getLocationDetails.length;i++){
                let locationObj={
                    latitude:getLocationDetails[i].latitude,
                    longitude:getLocationDetails[i].longitude
                }
                locationArray.push(locationObj)
            }
            let totalDistance=geolib.getPathLength(locationArray)
            console.log('This is total distance',totalDistance)
            res.status(200).json({msg:"Total distance travelled is",total_distance:totalDistance})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getTotalDistanceOfCar:async (req,res)=>{
        try {
            const cid=new mongoose.Types.ObjectId(req.query.carId)
            const getLocationDetails=await locationModel.find({userId:req.user.id,carId:cid});
            let locationArray=[];
            for(let i=0;i<getLocationDetails.length;i++){
               let locationObj={
                    latitude:getLocationDetails[i].latitude,
                    longitude:getLocationDetails[i].longitude
                }
                locationArray.push(locationObj)
            }
            let totalDistance=geolib.getPathLength(locationArray)
            console.log('This is total distance',totalDistance)
            res.status(200).json({msg:"Total distance travelled is",total_distance:totalDistance})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getTotalDistanceOfOrder:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId});
            let locationArray=[];
            for(let i=0;i<getLocationDetails.length;i++){
               let locationObj={
                    latitude:getLocationDetails[i].latitude,
                    longitude:getLocationDetails[i].longitude
                }
                locationArray.push(locationObj)
            }
            let totalDistance=geolib.getPathLength(locationArray)
            console.log('This is total distance',totalDistance)
            res.status(200).json({msg:"Total distance travelled is",total_distance:totalDistance})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    getLocationsTravelled:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId});
            let locationArray=[];
            for(let i=0;i<getLocationDetails.length;i++){
                let locationObj={
                    latitude:getLocationDetails[i].latitude,
                    longitude:getLocationDetails[i].longitude
                }
                console.log("This is location obj",locationObj)
                locationArray.push(locationObj)
            }
            // let totalDistance=geolib.getPathLength(locationArray)
            // console.log('This is total distance',totalDistance)
            res.status(200).json({msg:"Total location list is",Result:locationArray})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    carStoppedCount:async(req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':-1});
            let count =0;
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){
                    if(getLocationDetails[i].longitude==getLocationDetails[j].longitude && getLocationDetails[i].latitude==getLocationDetails[j].latitude ){

                        let diffMs=getLocationDetails[i].locationUpdatedAt-getLocationDetails[j].locationUpdatedAt;
                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        console.log('This is diffMs',diffMins)
                        if(diffMins>5){
                            count++
                        }
                    }
                }
            }
            res.status(200).json({msg:"Total time car stopped is",result:count})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    minsCarStopped:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':-1});
            let count =0;
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){
                    if(getLocationDetails[i].longitude==getLocationDetails[j].longitude && getLocationDetails[i].latitude==getLocationDetails[j].latitude ){

                        let diffMs=getLocationDetails[i].locationUpdatedAt-getLocationDetails[j].locationUpdatedAt;
                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        console.log('This is diffMs',diffMins)
                        if(diffMins>5){
                            count=count+diffMins;
                        }
                    }
                }
            }
            res.status(200).json({msg:"Total amount of time car stopped is",result:count})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    uniqueStoppedLocation:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':-1});
            let count =0,locationList=[];
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){
                    if(getLocationDetails[i].longitude==getLocationDetails[j].longitude && getLocationDetails[i].latitude==getLocationDetails[j].latitude ){

                        let diffMs=getLocationDetails[i].locationUpdatedAt-getLocationDetails[j].locationUpdatedAt;
                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        console.log('This is diffMs',diffMins)
                        if(diffMins>5){
                            let locationObj={}
                            locationObj={
                                latitude:getLocationDetails[i].latitude,
                                longitude:getLocationDetails[i].longitude
                            }
                            locationList.push(locationObj)
                        }
                    }
                }
            }

            let uniqueLocationList=_.uniqWith(locationList,_.isEqual)

            res.status(200).json({msg:"Total amount of time car stopped is",result:uniqueLocationList})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    minsCarRunning:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':-1});
            let count =0;
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){
                    if(getLocationDetails[i].longitude!==getLocationDetails[j].longitude && getLocationDetails[i].latitude!==getLocationDetails[j].latitude ){

                        let diffMs=getLocationDetails[i].locationUpdatedAt-getLocationDetails[j].locationUpdatedAt;
                        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                        console.log('This is diffMs',diffMins)
                        if(diffMins>5){
                            count=count+diffMins;
                        }
                    }
                }
            }
            res.status(200).json({msg:"Total amount of time car running is",result:count})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    timesCarWentOverspeed:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':1});
            let count =0;
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){


                    const speed=geolib.getSpeed({latitude:getLocationDetails[i].latitude,longitude:getLocationDetails[i].longitude,time:getLocationDetails[i].locationUpdatedAt},{latitude:getLocationDetails[j].latitude,longitude:getLocationDetails[j].longitude,time:getLocationDetails[j].locationUpdatedAt})
                    if(speed>80){
                        count++;
                    }

                    console.log('This is speed>>>>',speed)
                }
            }
            res.status(200).json({msg:"Total time car went overspeed is",result:count})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },

    locationCarWentOverspeed:async (req,res)=>{
        try {
            const getLocationDetails=await locationModel.find({userId:req.user.id,orderId:req.query.orderId}).sort({'locationUpdatedAt':1});
            let locationList =[];
            for(let i=0;i<getLocationDetails.length;i++){
                for(let j=i+1;j<getLocationDetails.length;j++){


                    const speed=geolib.getSpeed({latitude:getLocationDetails[i].latitude,longitude:getLocationDetails[i].longitude,time:getLocationDetails[i].locationUpdatedAt},{latitude:getLocationDetails[j].latitude,longitude:getLocationDetails[j].longitude,time:getLocationDetails[j].locationUpdatedAt})
                    if(speed>80){
                        let locationObj={
                            latitude:getLocationDetails[i].latitude,
                            longitude:getLocationDetails[i].longitude
                        }
                        locationList.push(locationObj)
                    }

                    console.log('This is speed>>>>',speed)
                }
            }

            res.status(200).json({msg:"Total time car went overspeed is",result:locationList})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }



}

module.exports=locationCtrl;