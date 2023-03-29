import express from "express";
import dotenv from 'dotenv';
import createDatabase from "./config/mongoDb.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import productsRouter from "./routes/productsRoutes.js";
import cookieParser from 'cookie-parser'
import isLoggedin from "./middleware/isLoggedin.js";
import stripeRouter from './routes/stripeRoutes.js'
import cors from 'cors';




dotenv.config({ path: '.env' });
createDatabase();
const app = express();
app.use(cookieParser())
app.use(cors({
    origin: 'https://digital-bazzar-backend.herokuapp.com',
    credentials: true 
  }));


app.use(express.json());
app.use(stripeRouter)
//with each request check if user is logged in , get the user info from db => send it with req
app.use(isLoggedin);
app.get('/auth', async (req,res,next)=>{
//when app loads , get the user info , to check if user's role if Admin or not
    res.json(req.user)
    next();
})
app.use('/products' , productsRouter);
app.use('/user' ,  userRouter)  
app.use('/admin' ,  adminRouter)

const port = process.env.PORT || 8080
app.listen(port , ()=>{
    console.log('server is running on ' , port )
})