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


// Use the cookie-parser middleware to parse cookies from incoming requests
app.use(cookieParser());

// Use the cors middleware to enable cross-origin resource sharing (CORS) for the specified origins and with credentials
app.use(cors({
    // Allow requests from these origins
    origin: ['https://digital-bazzar.netlify.app' ,  'https://digital-bazzar-backend.herokuapp.com'],
    // Enable sending and receiving cookies across domains
    credentials: true 
}));

app.use(express.json());
//with each request check if user is logged in , get the user info from db => send it with req
app.use(isLoggedin);
app.get('/auth', async (req,res,next)=>{
//when app loads , get the user info , to display in frontend components
   if (req.user){
    res.json(req.user)
    
   }else{
    res.json(false)
   }
})

app.use(stripeRouter)
app.use('/products' , productsRouter);
app.use('/user' ,  userRouter)  
app.use('/admin' ,  adminRouter)

const port = process.env.PORT || 8080
app.listen(port , ()=>{
    console.log('server is running on ' , port )
})