import dotenv from 'dotenv'
dotenv.config({})
import jwt from 'jsonwebtoken'
const isauthenticated = async(req,res,next)=>{
try {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:'user not authenticated ..',
            success: false
        })
       
    }

        const decode = await jwt.verify(token,process.env.SECRET_KEY)
        if(!decode){
                return res.status(401).json({
                    message:'user not authenticated decode one'
                })
        }
        req.id = decode.userID;
        
        next();
        
        
    
} catch (error) {
    console.log(error)
}
}

export default isauthenticated;
