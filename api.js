const express = require('express')

const api = express.Router()
const launchesRouter = require('./routers/launches/launches.router')
const planetsRouter = require('./routers/planets/planets.router')

api.use("/planets",planetsRouter)
api.use("/launches",launchesRouter)

module.exports = api