
import jwt from 'jsonwebtoken'
import userModels from '../models/UsersModel.js';

const {User} = userModels;
const isLoggedin = async (req, res, next) => {
    //with each request check if user is logged in , get the user info from db => send it with req
    
    if(req.cookies.loggedIn){
        const  token  = req.cookies.token;
        const user = await jwt.verify(token, 'secret');
        console.log('useeeeeeeer from loggedin middleware =========>' , user)
        if(user){
            const loggedUser = await User.findById(user.id);

            console.log('useeeeeeeer from the logged from database middleware =========>' , loggedUser)
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
