const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
  try {
    //Get token from request and remove Bearer from the front
    const token = req.header('Authorization').replace('Bearer ','')
    // console.log('Encoded Token',token)
    // console.log('JSON web token verification',jwt.verify(token,process.env.JWT_SECRET))
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    // console.log('This is decoded:',decoded._id)
    const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
    // console.log(user)
    if (!user) {
      throw new Error() //this triggers the catch below
    }

    req.token = token //token that was used to log into this session
    req.user = user  //Saves the user authentication for future requests
    next()
  }catch (e){
    res.status(401).send({error:'Please authenticiate'})
  }
}

module.exports = auth