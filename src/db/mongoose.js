const mongoose = require('mongoose')


//Need to start mongodb with >mongod.exe --dbpath=AbsolutePathToData
mongoose.connect(process.env.MONGODB_URL,{
  useNewUrlParser: true,
  useCreateIndex: true
})