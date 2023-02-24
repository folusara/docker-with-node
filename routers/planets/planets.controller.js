const { habitablePlanets } = require("../../models/planets.model")
const  planetModel  = require('../../models/planets.mongoSchema')

const getAllPlanets = async (req,res) => {
    let planetsList = await planetModel.find({},{
        '_id':0, '__v':0
    })
    console.log(planetsList)
    return res.status(200).json({
        data: planetsList,
        message: "planets successfully sent"
    })
//    return res.status(200).json(planetsList)
}

module.exports = {
    getAllPlanets
}