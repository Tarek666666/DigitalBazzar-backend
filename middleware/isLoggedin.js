
import jwt from 'jsonwebtoken'
import userModels from '../models/UsersModel.js';

const {User} = userModels;
const isLoggedin = async (req, res, next) => {
    //with each request check if user is logged in , get the user info from db => send it with req
    console.log('from isloggedin middleware , the req.cookies =========>' , req.cookies)
    if(req.cookies.loggedIn){
        const  token  = req.cookies.token;
        const user = await jwt.verify(token, 'secret');
        if(user){
            const loggedUser = await User.findById(user.id);
            req.user = loggedUser
            next()
        }else{
            res.redirect('/')
        }
    }else{
        next()
    }
    
  }
export default isLoggedin;
