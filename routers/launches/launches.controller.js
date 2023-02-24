const axios = require("axios")
const launchModel = require("../../models/launches.mongoSchema")
const planetModel = require("../../models/planets.mongoSchema")
const getPadination = require("../../utils/query")

const getAllLaunches = async(req,res) => {

    const {skip, limit} = getPadination(req.query)
    console.log("skip",skip);
    const allLaunches = await launchModel.find({}, 
        {
        '_id': 0, '__v':0
    }
    ).skip(skip).limit(limit)


    if (allLaunches) {
     return res.status(200).json({
         data: allLaunches,
         message: "all launches successfully received"
     })
    } else {
     return res.status(500).send("server error")
    }
 }


 const defaultFlightNumber = 100

 async function getLatestFlightNumber() {
    const latestLaunch = await launchModel.findOne().sort('-flightNumber')
    console.log("LATEST lAUNCH",latestLaunch);

    if (!latestLaunch) {
        return defaultFlightNumber
    } 
        return latestLaunch.flightNumber
    
 }

//  const launch = {
//     flightNumber: 101,
//     mission: 'kepler Explortion X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27,2030'),
//     destination: 'Kepler-296 A f',
//     customers: ['ZTM', 'NASA'],
//     upcoming: true,
//     success: true
// } 




async function saveLaunch (launch) {

    

    const newLaunch = await launchModel.create({ flightNumber: launch.flightNumber, rocket: launch.rocket,
         mission: launch.mission, launchDate: launch.launchDate, 
        customers: launch.customers, success: launch.success, upcoming:launch.upcoming})

        console.log("saved launch1",newLaunch);
        // return res.status(200).json({
        //     data: addedLaunch,
        //     message: `launch with flightNumber ${launch.flightNumber} successfully updated`
        // })
}
 

async function scheduleNewLunch(launch) {

    const planet = await planetModel.findOne({
        keplerName: launch.target
    },{
        '_id':0, '__v': 0
    }) 


    if (!planet) {
        throw new Error ("no planet with that target")
    }
 
    const savedLaunch = await launchModel.findOneAndUpdate({
            flightNumber: launch.flightNumber
        },{
           launch
        },{
            upsert: true,
        })
    const newFlightNumber = await getLatestFlightNumber() + 1
    // console.log("newflightnumber", newFlightNumber );
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery','NASA'],
        flightNumber: newFlightNumber
    })
    // console.log("new launch", newLaunch);
   await saveLaunch(newLaunch)
}


const addNewLunch = async (req,res) => {
    const launch = req.body
    if (!launch.mission || !launch.rocket || !launch.launchDate) {
        return res.status(400).json({
            error: "Missing Required Launch Property"
        })
    }

   await scheduleNewLunch(launch)
   return res.status(200).json({
    newLaunch: launch,
    message: "new launch added"
   })
}

const abortLaunch = async (req,res) => {

   console.log(req.params.id);

   const flightNumber = Number(req.params.id)


   const launch = await launchModel.findOne({
    flightNumber: flightNumber
   },)

   if (!launch) {
    return res.status(400).json({
        message: "No such launch with that flight number in our database"
    })
   }

   const deletedLaunch = await launchModel.updateOne({
    flightNumber: launch.flightNumber
   },{
    upcoming: false,
    success: false
   })

   res.status(200).json({
    deletedLaunch,
    message: `launch with flight number ${launch.flightNumber} successfully aborted!`
   })
}

async function getUpcomingLaunches(req,res) {
    const upcomingLaunches = await launchModel.find({
        upcoming: true,
        success: true
    })
    if (!upcomingLaunches) {
        return res.status(400).json({
            message: "No upcoming launches"
        })
    }

    res.status(200).json({
        upcomingLaunches,
        message: `upcoming launches!`
       })
}

const space_x_url = "https://api.spacexdata.com/v4/launches/query"

async function findLaunch(filter){
    return await launchModel.findOne(filter)
}

async function loadLaunchesData () {
    const response = await axios.post(space_x_url,{
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        "customers": 1
                    }
                }  
            ]
        }
    })

    const launnchDocs = response.data.docs
    for (let launchDoc of launnchDocs) {

        const payLoads = launchDoc['payloads']
        const customers = payLoads.flatMap((payLoad)=>{
            return payLoad['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers: customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch)

    }

} 


module.exports = {
    getAllLaunches,
    addNewLunch,
    abortLaunch,
    getUpcomingLaunches,
    loadLaunchesData
}