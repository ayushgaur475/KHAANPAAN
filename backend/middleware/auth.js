import jwt from 'jsonwebtoken'

const authMiddlewaer = async (req, res, next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({
            success: false,
            message: "Not Authorized Login Again"
        })
    }
    try{ 
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = token_decode.id;
      req.userId = token_decode.id; // added for multer routes
      next();
    }
    catch(error){
       console.log(error);
       res.json({
        success: false,
        message: "Authentication Error: " + error.message
       })
    }
}

export default authMiddlewaer;