import jwt from 'jsonwebtoken'

const generateToken = async (id)=>{
    return jwt.sign({id}, process.env.JWT_KEY, {expiresIn: 604800})
}

export default generateToken;

