const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    trim:true
  },
  email: {
    type:String,
    required: true,
    unique:true,  //When changing items like this, you may need to recreate database
    validate(value){
      if (!validator.isEmail(value)){
        throw new Error('Email is invalid')
      }
    },
    trim:true,
    lowercase: true
  },
  age: {
    type:Number,
    validate(value){
      if (value < 0 ){
        throw new Error('Age must be a positive number')
      }
    },
    default:0
  },
  password: {
    type:String,
    validate(value){
      value = value.toLowerCase()
      if(value.includes('password')){
        throw new Error('Password must not include "password"!')
      }
      if(value.length<7){
        throw new Error('Password must be greater than 6 characters long.')
      }
    },
    trim:true,
    required:true
  },
  tokens: [{
    token: {
      type: String,
      required:true,
    }
  }],
  avatar:{
    type: Buffer
  }
},{
timestamps: true
})

//Virtual Property.  Relationship between two models
userSchema.virtual('tasks',{
  ref: 'Task',
  localField: '_id',
  foreignField: 'user_id'
})

//toJSON get called whenever JSON.stringify() is called during send()
userSchema.methods.toJSON = function () {
  //we don't want to use an arrow function so that we can use this inside of function
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

//methods on the user
userSchema.methods.generateAuthToken = async function (){
  //methods are accesible on the instance
  const user = this
  const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({token}) //save token in user tokens
  await user.save()

  return token
}

//methods on the User
userSchema.statics.findByCredentials = async (email,password)=>{
  const user = await User.findOne({email:email})

  if (!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch){
    throw new Error ('Unable to login')
  }

  return user
}

//Hash the plain text password before saving
userSchema.pre('save',async function (next) {
  //this is the document being saved
  const user = this

  //Only hash password if it hasn't been hashed before
  if (user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
  }

  next()
})

//Delete user tasks when user is removed
userSchema.pre('remove',async function (next){
  const user = this
  await Task.deleteMany({user_id:user._id})

  next()
})

const User = mongoose.model('User',userSchema)

module.exports=User