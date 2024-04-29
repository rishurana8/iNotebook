var jwt = require('jsonwebtoken');
const JWT_SECRET = 'rishur@1234';

const fetchuser = (req,res,next) =>{
    // Getting the user id from the token
    const token = req.header('auth-token');
 try{
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
    const data = jwt.verify(token,JWT_SECRET);
    req.user = data.user;
    next();
 }catch(error){
    res.status(401).send({error: "Please authenticate using a valid token"});
 }
}

module.exports = fetchuser;