const jwt = require('jsonwebtoken')
const User = require("../model/user")

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt
    //check if jwt exists and is verified
    if (token) {
        jwt.verify(token,'Tolu badejo secret',(err, decodedToken )=>{
            if (err) {
                console.log(err.message);
            res.redirect("/login")
            }
            console.log(decodedToken);
            next()
        })
    } else{
        res.redirect("/login")
    }
}

//check user
const checkuser = (req,res,next)=>{
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token,'Tolu badejo secret', async (err, decodedToken )=>{
            if (err) {
                console.log(err.message);
            res.locals.user = null
           next()
            }
            console.log(decodedToken);
            let user = await User.findById(decodedToken.id)
            res.locals.user = user
            next()
        })
    } else{
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkuser }