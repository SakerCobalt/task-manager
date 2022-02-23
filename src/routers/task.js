const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks',auth,async(req,res)=>{
  const task = new Task({
    ...req.body,//unpacks the body so we can add to it.
    user_id:req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
  // task.save().then(()=>{
  //   res.status(201).send(task)
  // }).catch((e)=>{
  //   res.status(400).send(e)
  // })
})

// GET /tasks?completed=false
// GET /tasks?limit=10&skip=20  limit the number of results for any search
// GET /tasks?sortBy=createdAt:asc   :desc for descending  any character to break them up
router.get('/tasks',auth,async(req,res)=>{
  const match = {}
  const sort = {} 

  if (req.query.completed){
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy){
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
     // createdAt: 1  //-1 descending, 1 ascending
  }
    
  try{
    // const tasks = await Task.find({user_id:req.user})
    await req.user.populate({
      path:'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
    res.status(201).send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
  // Task.find({}).then((tasks)=>{
  //   res.send(tasks)
  // }).catch((e)=>{
  //   res.status(500).send(e)
  // })
})

router.get('/tasks/:id',auth,async(req,res)=>{
  // console.log(req)
  const _id = req.params.id
  try {
    const task = await Task.findOne({_id,user_id:req.user._id})
    if (!task){
      return res.status(404).send()
    }
    res.status(201).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
  // Task.find({_id:req.params.id}).then((task)=>{
  //   if(task.length<1){
  //     return res.status(404).send()
  //   }
  //   res.status(200).send(task)
  // }).catch((e)=>{
  //   res.status(500).send(e)
  // })
})

router.patch('/tasks/:id',auth,async (req,res)=>{
  const allowedUpdates = ['description','completed']
  const updates = Object.keys(req.body)
  const isValidUpdate = updates.every((update)=>{
    return allowedUpdates.includes(update)
  })
  if (!isValidUpdate){
    return res.status(400).send({error:'Invalid update parameter!'})
  }

  try{
    //Need to call save() to ensure that the middleware sees the save event vice using update
    const task = await Task.findOne({_id:req.params.id, user_id:req.user})
    // const task = await Task.findById(req.params.id)
    if (!task){
      return res.status(404).send()
    }
    updates.forEach((update)=>{
      task[update]=req.body[update]
    })
    await task.save()
    // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
  try{
    const task = await Task.findOneAndDelete({_id:req.params.id,user_id:req.user})
    if(!task){
      return res.status(404).send(task)
    }
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports=router