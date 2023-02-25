const { friends } = require("../models/friends.model")

 const getFriends  = (req,res)=>{
    res.json(friends)
}

 const getSingleFriend =  (req,res)=>{
    const id = +req.params.id
    const friend = friends[id]

    if (!friend) {
        return res.status(404).send("No friend with such Id")
    } else {
       return  res.status(200).json(friend)
    }

}

module.exports = {
    getFriends, getSingleFriend 
}