


const isAdmin = async (req, res, next) => {
 
    
        console.log(req.user , req.user.role , '------------------>>>>>>>>>>>>>>')
        if (req.user && req.user.role === 'admin') {
            next()
        } else {
            //case unknown user
            res.redirect('/')
        }
    
  }
export default isAdmin;