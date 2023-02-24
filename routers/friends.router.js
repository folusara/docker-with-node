const express = require('express')
const friendControllers= require('../controllers/friends.controller')
const friendRouter = express.Router()

friendRouter.use((req, res, next) => {
    console.log("ip address", req.ip);
    next()
})

friendRouter.get('/', friendControllers.getFriends)
friendRouter.get('/:id',friendControllers.getSingleFriend)

module.exports = friendRouter