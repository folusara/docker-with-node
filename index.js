
const https = require('https')
const fs = require('fs')
const {Server} = require("socket.io")
const {IncomingForm} = require("formidable")
const  transport  = require('./utils/mail')
const { parse } = require('csv-parse')
require('dotenv').config()
const cluster = require('cluster')
const os = require('os')
const mongoose = require('mongoose')
const { loadLaunchesData } = require('./routers/launches/launches.controller')
const friendControllers = require('./controllers/friends.controller')
const friendRouter = require('./routers/friends.router')
const app = require('./app')
const { loadPlanetsData } = require('./models/planets.model')


const server = https.createServer({
    cert: fs.readFileSync("cert.pem"),
    key: fs.readFileSync("key.pem")
}, app)
const PORT = process.env.PORT || 5000
const Mongodb_Url = process.env.Mongodb_Url 




//SOCKET PROGRAMMING
const io = new Server(server)

io.on('connection', (socket)=>{
    console.log('someone just connected');

    socket.on('disconnect',()=>{
        console.log('someone just disconnected');
    }) 
})


const startServer = async () => {
    await mongoose.connect(Mongodb_Url)
    .then(()=> console.log("db connected"))
    .catch((err)=> console.log("error", err))
    
    await loadPlanetsData()
    // await loadLaunchesData()

    // if (cluster.isMaster) {
    //     console.log(process.pid,'master has been started');
    //     const Num_workers = os.cpus().length
    //     for (let index = 0; index < Num_workers; index++) {
    //         cluster.fork()
    //     }
    // } else{
     
    // }
    console.log(process.pid,"worker has started");

    server.listen(PORT, ()=>{
        console.log(`app is seriously hustling for requests on port: ${PORT}....`);
    })
    
   
}


startServer()
// app.post('/upload', (req,res, next)=>{
//     const form = new IncomingForm ({multiples:true})

//     form.parse(req, (err, field, files) =>{

//         try {
//             const readData = fs.readFileSync(files.payload.filepath)
//             fs.writeFileSync(files.payload.originalFilename, readData)
//             res.status(201).json({message: "file uploaded"})
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({message:"file not uploaded"})
//         }
//     })
//     form.on("progress", (progress) =>{
//         console.log(Math.floor(progress /1024 /1024));
//     })
// })

// app.post('/uploadStream', (req,res, next)=>{
//     const form = new IncomingForm ({multiples:true})
//     form.parse(req, (err, field, files) =>{
//         try {
//             var readStream = fs.createReadStream(files.payload.originalFilename);
//             var writeStream = fs.createWriteStream(files.payload.filepath)
//             readStream.pipe(writeStream);
//             res.status(201).json({message: "file uploaded"});
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({message:"file not uploaded"})
//         };
//     })
//     form.on("progress", (progress) =>{
//         console.log(Math.floor(progress /1024 /1024));
//     })
// })


