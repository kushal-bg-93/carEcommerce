const express=require('express')
const app=express();
const cors=require('cors');
const mongoose=require('mongoose')
const routes=require('./routes/routes')
// const logger=require('./httpLogger')
// const redis=require('./utils/redis')

const dotenv=require('dotenv');
const res = require('express/lib/response');
const morgan = require('morgan');
// const session=require('express-session')
dotenv.config();

const PORT=process.env.PORT || 5000;

// app.use(morgan('combined'))
// app.use(logger)

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + 'uploads'));

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//         maxAge:1*60*60*1000
//     }
// }))

mongoose.set('strictQuery',true)
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Database connected succesfully")
}).catch((err)=>{
    res.status(500).json({error:err})
})

// const connectToRedis=async ()=>{
//     console.log('connecting to redis');
//     await redis.connect();

//     console.log('connected to redis')

//     await redis.redisClient.set('name','Apple')
//     const value=await redis.redisClient.get('name')
//     console.log('value'+value)
// }

// connectToRedis();


app.use(routes);

app.listen(PORT,()=>{
    console.log(`server is up and running @ localhost:${PORT}`)
})