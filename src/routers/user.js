const multer = require('multer')
const sharp = require('sharp')
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

const router = new express.Router()

router.get('/test', (req,res)=>{
  res.send('This is from my other router')
})

router.post('/users', async(req,res)=>{
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)  //This is async, but we don't need to wait
    const token = await user.generateAuthToken()
    res.status(201).send({user,token})
  } catch (e) {
    res.status(400).send(e)
  }
//   user.save().then(()=>{
//     res.status(201).send(user)
//   }).catch((error)=>{
//     // res.status(400)
//     // res.send(error)
//     res.status(400).send(error)
//   })
// })
})

router.post('/users/login',async (req,res)=>{
  try {
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateAuthToken()  //generating for this specific user
    res.send({user, token})
  }catch (e){
    res.status(400).send()
  }
})

router.post('/users/logout',auth, async (req,res)=>{
  try {
    req.user.tokens = req.user.tokens.filter((token)=>{
      //Returns true if the token is not equal to the current session token--> keeps it
      return token.token !== req.token
    })
    await req.user.save()

    res.status(200).send()
  }catch(e){
    res.status(500).send()
  }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()
  }catch (e){
    res.status(500).send()
  }
})

router.get('/users/me', auth, async(req,res)=>{
  //fetch user profile
  res.send(req.user)  //req.user saved in the auth function

   //Will fetch all users.  Could insert search criteria in object
  // try {
  //   const users = await User.find({})
  //   res.status(201).send(users)
  // } catch (e) {
  //   res.status(500).send(e)
  // }
  //   User.find({}).then((users)=>{
//     res.send(users)
//   }).catch((e)=>{
//     res.status(500).send(e)
//   })
// })
})

//Don't want users to be able to get user by id
// router.get('/users/:id',async(req,res)=>{
//   //The params include all params in the url (following a :) -- req.params object
//   const _id = req.params.id
//   try {
//     const user = await User.findById(_id)
//     if (!user) {
//       return res.status(404).send()
//     }
//     res.status(201).send(user)
//   } catch (e) {
//     res.status(500).send(e)
//   }
//   const _id = req.params.id
//   User.findById(_id).then((user)=>{
//     console.log("This is the user:",user)
//     if (!user){
//       return res.status(404).send()
//     }
//     res.status(201).send(user)
//   }).catch((e)=>{
//     res.status(500).send(e)
//   })
// })
// })

router.delete('/users/me',auth, async (req,res)=>{
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    //no need to check if this user exists because we just logged them in
    // if(!user){
    //   return res.status(404).send()
    // }
  
    await req.user.remove()
    sendCancelationEmail(req.user.email,req.user.name)
    res.send(req.user)
  }catch(e) {
    res.status(500).send()
  }
})

router.patch('/users/me',auth,async(req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name','email','password','age']
  const isValidOperation = updates.every((update)=>{
    return allowedUpdates.includes(update)
  })
  if (!isValidOperation){
    return res.status(400).send({error: "invalid Updates!"})
  }

  try{

    updates.forEach((update)=>{
    req.user[update] = req.body[update]
    })
    //This is where the middleware actually gets updated
    await req.user.save()
    //The findBy and update bypass some of the mongoose operators.  Need to save()
    res.send(req.user)
  } catch (e){
    res.status(400).send(e)
  }
})

//POSt /users/me/avatar to upload avatar photo and save to avatars directory
const avatarUpload = multer({
  // dest: 'avatars', //remove so the file data goes through to the route handler callback function
  limits: {
    fileSize: 1000000
  },
  fileFilter(req,file,cb){
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)){ //match supports regular expressions
      cb(undefined,true)
    } else return cb(new Error('Pleaase provide a *.jpg, *.jpeg, or *.png file.'))
  }
})
//avatar in single is the key from the request body
router.post('/users/me/avatar',auth,avatarUpload.single('avatar'),async (req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar = buffer
  // req.user.avatar = req.file.buffer
  await req.user.save() //save the user profile updated with avatar photo
  res.send()
}, (error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.status(200).send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar', async (req,res)=>{
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar){
      throw new Error()
    }

    res.set('Content-Type','image/png')
    res.status(200).send(user.avatar)

  }catch(e){
    res.status(404).send()
  }
})



module.exports=router