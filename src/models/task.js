const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type:String,
    required:true,
    trim:true
  },
  completed: {
    type:Boolean,
    default:false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref:'User' //The User model
  }
},{
  timestamps: true
})

taskSchema.pre('save',async function (next) {
  const task = this
  //Where middleware is run
  console.log('Middleware running.')
  next()
})

const Task = mongoose.model('Task',taskSchema)

module.exports=Task