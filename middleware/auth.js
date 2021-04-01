const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=function(req,res,next){
    const token=req.header('x-auth-token');
    if(!token) return res.status(401).json({msg:'ACCES DENIED ! , no token provided'})
    try{
        const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
        req.user=decoded.user;
        next();
    }catch(err){
        console.error(err.message);
        res.status(401).json({msg:'invalid token...'});
    }
}