const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse');
const planetModel = require('./planets.mongoSchema');

const habitablePlanets = []
const isHabitable = ( planet ) => {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6
}

const loadPlanetsData = () => {
    return new Promise ((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "public", "kepler_data.csv"))
        .pipe(parse({
            comment: "#",
            columns: true,
        }))
        .on('data', async ( planet ) => {
            if (isHabitable(planet)) {
            savePlanets(planet)
            }
        }).on('error', (err)=> {
            reject(err)
        }).on('end', () => {
            resolve(habitablePlanets)
        } )
    })
}

const savePlanets = async (planet) => {
   try {
    await  planetModel.updateOne({
        keplerName: planet.kepler_name
       }, {
        keplerName: planet.kepler_name
       }, {
        upsert: true
       })
   } catch (error) {
    console.log(`could not save error` + error);
    return error
   }
}

module.exports = {
    loadPlanetsData,
    habitablePlanets
}