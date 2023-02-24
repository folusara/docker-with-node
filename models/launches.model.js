const axios = require("axios")
const launchModel = require("./launches.mongoSchema");


const space_x_url = "https://api.spacexdata.com/v5/launches/latest/query"


const loadLaunchData = async () => {
    await axios.post()
}

// const launches = new Map();
const launch = {
    flightNumber: 100,
    mission: 'kepler Explortion X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27,2030'),
    destination: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}

// launches.set(launch.flightNumber,launch)
const saveLaunches = async (launch) => {
    await launchModel.updateOne({
        flightNumber: launch.flightNumber
    },{
       launch
    },{
        upsert: true
    })
}

 

module.exports = {
    loadLaunchData,
    saveLaunches
}