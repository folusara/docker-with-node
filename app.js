const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const friendRouter = require('./routers/friends.router')
const cors = require('cors')
const morgan = require('morgan')
const api = require('./api')
const helmet = require("helmet")
const passport = require("passport")
const { Strategy } = require("passport-google-oauth20")
const cookieSession = require("cookie-session")

const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
}

const AUTH_OPTIONS = {
    callbackURL: "/auth/backend-home",
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
}

function verifyCallBack(accessToken, refreshToken, profile, done) {
    console.log("google profile", profile);
    console.log("google axcesstoken", accessToken)
    console.log("google refreshToken", refreshToken);
    done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallBack))

passport.serializeUser((user,done)=> {
done(null,user._json.email)
})

passport.deserializeUser((email, done)=>{
    done(null,email)
})

const app = express()


app.use(helmet())
app.use(cookieSession({
    name:"session",
    maxAge: 1000 * 60 * 60 * 24,
    keys: ['secret key']
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))
app.use('/v1', api)



function checkIsLoggedIn(req, res, next) {
    // console.log("req.user",req.user._json.email);
    const isLoggedIn = req.isAuthenticated() &&  req.user

    if (!isLoggedIn) {
        return res.status(401).json({
           message: "you must login to access this api"
        })
    }
    next()
}
app.use("/friends", checkIsLoggedIn, friendRouter)
app.use('/static', express.static('public'))
app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/temp/index.html")
    // res.send("helloooooo")
})

app.get('/failure', (req,res)=>{
    res.status(400).send("failed to login")
})

app.get('/success', (req,res)=>{
    res.status(200).send("logged in successfully")
})

app.get("/auth/backend-home", passport.authenticate("google",{
    failureMessage:"/failure",
    successRedirect:"/",
    session: true
}), (req,res)=> {
    console.log('google called us back!!');
})

app.get("/auth/google", passport.authenticate("google",{
    scope: ['email', 'profile']
}), (req,res)=> {
    console.log('google called us back!!');
})

app.get("/auth/logout", (req,res)=> {
    req.logout()
    return res.redirect("/")
})


module.exports = app
