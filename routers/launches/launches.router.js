const express = require('express')
const { getAllLaunches, addNewLunch, abortLaunch, getUpcomingLaunches } = require('./launches.controller')

const launchesRouter = express.Router()


launchesRouter.get('/launches', getAllLaunches)
launchesRouter.post("/schedule-launch", addNewLunch)
launchesRouter.get('/upcoming-launches', getUpcomingLaunches)
launchesRouter.delete("/launches/:id", abortLaunch)

module.exports = launchesRouter