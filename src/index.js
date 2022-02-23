const express = require('express')
require('./db/mongoose') //ensures mongoose.js runs
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//Without middleware: new request -> run route handler
//With middleware: new request -> do something -> run route handler

// app.use((req,res,next)=>{
//   if(req.method==='GET'){
//     res.send('GET requests are disabled')
//   }else {
//     next()
//   }
// })

//File upload
// const multer = require('multer')
// const upload = multer({
//   dest:'images',
//   limits: {
//     fileSize: 1000000, //Value is Bytes
//   },
//   fileFilter(req,file,cb){
//     // if (!file.originalname.endsWith('.pdf')) {
//       if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('File must be a PDF'))
//     }

//     cb(undefined,true)  //accept if it is a pdf
//     // cb(undefined,false)//silently rejects the upload
//   }
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//   res.send() //to send a 200 response with no body
// }, (error, req, res, next)=>{
//   res.status(400).send({error:error.message})
// })


//Code could to be used for maintenance
// app.use((req,res,next)=>{
//   res.status(503).send('Server is down for maintenance.  Please try later')
// })

app.use(express.json()) //automatically parses incoming json to object
app.use(userRouter)
app.use(taskRouter)

//launch server with >npm run dev for development.  See package.json for scripts
app.listen(port, ()=>{
  console.log('Server is up on port'+port)
})



// const main = async ()=>{
//   // const task = await Task.findById('620182b00ed19c4f640f9294')
//   // await task.populate('user_id').execPopulate() //populate from the User model
//   // console.log(task.user_id)

//   const user = await User.findById('620181d159bfd1531c6ff2ac')
//   await user.populate('tasks').execPopulate()
//   console.log(user.tasks)
// }

// main ()
// const pet = {
//   name:"Hal"
// }

// //The toJSON method isi called when the JSON.stringify is called.
// pet.toJSON = function () {
//   return {}
// }

// console.log(JSON.stringify(pet))