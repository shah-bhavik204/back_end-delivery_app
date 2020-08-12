const jwt  = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        // console.log('check')
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1],process.env.JWT_PASSWORD)
        // console.log(decoded)
        req.userData = decoded
        next();
    }
    catch{
        return res.status(401).send("Auth Failed!")
    }
}