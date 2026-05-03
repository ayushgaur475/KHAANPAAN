import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const adminAuth = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized, Login Again"
        })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(token_decode.id);
        
        // Ensure user exists AND is either marked as admin OR is the super admin email
        if (!user || (!user.isAdmin && user.email !== "123@gmail.com")) {
            return res.json({
                success: false,
                message: "Not Authorized, Admin Access Only"
            })
        }
        
        req.body.userId = token_decode.id;
        next();
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error authenticating admin"
        })
    }
}

export default adminAuth;
