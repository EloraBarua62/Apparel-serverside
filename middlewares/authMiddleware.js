const jwt = require('jsonwebtoken')

module.exports.authMiddleware = async(req, res, next) => {
    const {accessToken} = req.cookies;
    if(!accessToken){
        return res.status(409).json({error: "Please login"})
    }
    else{
        try{
            const decodeToken = await jwt.verify(accessToken , process.env.SECRET);
            req.id = decodeToken.id;
            req.role = decodeToken.role;
            next();
        }
        catch(error){
            return res.status(409).json({ error: "Your token is expired, login again" });

        }
    }
}