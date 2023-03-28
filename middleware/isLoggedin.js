
import jwt from 'jsonwebtoken'
import userModels from '../models/UsersModel.js';

const {User} = userModels;
const isLoggedin = async (req, res, next) => {
    //with each request check if user is logged in , get the user info from db => send it with req
    if(req.cookies.loggedIn){
        const  token  = req.cookies.token;
        const user = await jwt.verify(token, 'secret');
        if(user){
            const loggedUser = await User.findById(user.id);
            req.user = loggedUser
        }else{
            res.redirect('/')
        }
    }
    next()
  }
export default isLoggedin;
