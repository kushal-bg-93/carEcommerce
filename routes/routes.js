const router=require('express').Router()
const regCtrl=require('../controller/auth/register')
const loginCtrl=require('../controller/auth/login')
const regValidation=require('../validation/registerValidationMiddleware')
const carValidation=require('../validation/carsValidation')
const {verifyToken,verifyTokenAndAuthorization,verifyAdmin}=require('../controller/Middlewares/verifyTokenMiddleware')
const carsCtrl=require('../controller/carsController/carsCtrl')
const orderCtrl=require('../controller/orderController/order')
const locationCtrl=require('../controller/locationController/locationCtrl')
const { route } = require('express/lib/application')
// const {findById,find,save}=require('../controller/node_training_products/products.controller')
// const upload=require('../controller/Middlewares/upload')
const express=require('express')
const ordersCtrl = require('../controller/orderController/order')
const app=express.Router();
// const logger=require('../logger')

//auth  routes
router.post("/users/signup",regValidation,regCtrl);
router.post("/users/login",loginCtrl);

//car Creation and fetching routes
router.post('/cars',carValidation,verifyAdmin,carsCtrl.create)
router.get('/cars',carsCtrl.getCar)
router.get('/cars/fastestCar',carsCtrl.getFastestCar)


// order routes
router.post('/orders/placeOrder',verifyTokenAndAuthorization,orderCtrl.createOrder)
router.get('/payments/verify',verifyTokenAndAuthorization,orderCtrl.verifyPayment)
router.get('/orders/getOrder',verifyTokenAndAuthorization,orderCtrl.getOrders)
router.get('/orders/getAllOrders',verifyAdmin,orderCtrl.getAllOrders)
router.get('/orders/getMostOrdered',verifyTokenAndAuthorization,orderCtrl.getMostOrderedCars)
router.post('/orders/giveRating',verifyTokenAndAuthorization,ordersCtrl.giveRating)
router.get('/orders/highestRatedCar',verifyTokenAndAuthorization,orderCtrl.getHighestRatedCar)
router.get('/orders/mostbooked',verifyTokenAndAuthorization,orderCtrl.getMostBookedCar)

// location routes
router.post('/cars/location',verifyTokenAndAuthorization,locationCtrl.updateLocation)
router.get('/reports/findTotalDistanceTravelledByUser',verifyTokenAndAuthorization,locationCtrl.getTotalDistance)
router.get('/reports/findTotalDistanceTravelledByUserOnCar',verifyTokenAndAuthorization,locationCtrl.getTotalDistanceOfCar)
router.get('/reports/findTotalDistanceTravelledByOrderId',verifyTokenAndAuthorization,locationCtrl.getTotalDistanceOfOrder)
router.get('/reports/findLocationsTravelledByOrderId',verifyTokenAndAuthorization,locationCtrl.getLocationsTravelled)
router.get('/reports/findStoppedCountByOrderId',verifyTokenAndAuthorization,locationCtrl.carStoppedCount)
router.get('/reports/findStoppedDurationByOrderId',verifyTokenAndAuthorization,locationCtrl.minsCarStopped)
router.get('/reports/findUniqueStoppedLocationByOrderId',verifyTokenAndAuthorization,locationCtrl.uniqueStoppedLocation)
router.get('/reports/findRunningDurationByOrderId',verifyTokenAndAuthorization,locationCtrl.minsCarRunning)
router.get('/reports/findOverspeedCountByOrderId',verifyTokenAndAuthorization,locationCtrl.timesCarWentOverspeed)
router.get('/reports/findOverspeedLocationsByOrderId',verifyTokenAndAuthorization,locationCtrl.locationCarWentOverspeed)










router.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    return res.status(404).json({
      status: 404,
      message: 'API NOT FOUND!',
      data: {
        url: req.url
      }
    });
  });

  router.use(function (err,req,res,next){
      console.log(err.stack);

      if(res.headersSent){
          return next(err)
      }

      if(err.error?.isJoi){
          console.log(err.error.message);

          return res.status(400).json({
              status:"validationError",
              message:err.error.message
          })
      }

      console.log("error>>>>>>",err)
      res.status(500).json({
          status:"failure",
          message:'Internal Server Error',
          error:JSON.stringify(err)
      })
  })

module.exports=router;