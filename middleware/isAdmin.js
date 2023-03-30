


const isAdmin = async (req, res, next) => {
 
        if (req.user && req.user.role === 'admin') {
            next()
        } else {
            /// case unknown user
            res.send({isAuth:false})
           
        }
    
  }
export default isAdmin;