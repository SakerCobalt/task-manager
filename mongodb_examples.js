//CRUD - create, read, update, and delete
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId
const {MongoClient,ObjectId} = require('mongodb')  //destructuring

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager' //creates it automatically when we try to access it

const id = new ObjectId()
// console.log(id.id.length)
// console.log(id.getTimestamp())
// console.log(id.toHexString().length)

MongoClient.connect(connectionURL,{
  useNewUrlParser: true
}, (error,client)=>{
  if(error){
    console.log('There was an error:',error)
    return
  }
  
  const db = client.db(databaseName)

  // db.collection('tasks').updateMany({completed:false},{
  //   $set:{
  //     completed:true
  //   }
  // }).then((result)=>{
  //   console.log("succeeded",result)
  // }).catch((error)=>{
  //   console.log("Error",error)
  // })

  // db.collection('users').deleteMany({age:27}).then((result)=>{
  //   console.log(result)
  // }).catch((error)=>{
  //   console.log(error)
  // })

  db.collection('tasks').deleteOne({description:"This is a 3rd task"}).then((result)=>{
      console.log(result)
    }).catch((error)=>{
      console.log(error)
    })

  //The following will return a promise if no callback function is supplied
  const updatePromise = db.collection('users').updateOne({_id:new ObjectId("61f1a169663f61256f6fce20")},{
    //use update operators
    // $set: {
    //   name:'Mike'
    // }
    $inc:{
      age:1
    }
  })

  updatePromise.then((result)=>{
    console.log(result)
  }).catch((error)=>{
    console.log(error)
  })

  // db.collection('users').findOne({name:'Jen'}, (error,doc)=>{
  //   if (error){
  //     return console.log('unable to fetch')
  //   }
  //   if(doc===null){
  //     return console.log('The record was not found')
  //   }
  //   console.log(doc)
  // })

  // db.collection('users').findOne({_id:new ObjectId('61f1d1a78a96de162c585780')},(error, doc)=>{
  //   if (error){
  //     return console.log('Unable to fetch from database')
  //   } else if (doc === null){
  //     return console.log('The record was not found')
  //   }
  //   console.log(doc)
  // })

  // //find does not return the document, it returns a cursor--> Pointer to data
  // db.collection('users').find({age:27}).toArray((error,docs)=>{
  //   if (error){
  //     return console.log('Unable to fetch from database')
  //   } else if (docs === null){
  //     return console.log('The record was not found')
  //   }
  //   console.log(docs[0])
  // })

  // db.collection('users').find({age:27}).count((error,docs)=>{
  //   if (error){
  //     return console.log('Unable to fetch from database')
  //   } else if (docs === null){
  //     return console.log('The record was not found')
  //   }
  //   console.log(docs)
  // })

  // //new ObjectId('hex id')  because the ID is binary, the ObjectId formats it to be able to compare
  // db.collection('tasks').findOne({_id:new ObjectId("61f1d41de4ef0c123e7e8404")},(error,doc)=>{
  //   if (error){
  //     return console.log("can't fetch")
  //   } else if (doc===null){
  //     return console.log('Can not locate record')
  //   }
  //   console.log(doc)
  // })

  // db.collection('tasks').find({completed:false}).toArray((error,docs)=>{
  //   if (error){
  //     return console.log('Unable to fetch from database')
  //   } else if (docs === null){
  //     return console.log('The record was not found')
  //   }
  //   console.log(docs)
  // })

  // db.collection('users').insertOne({
  //   _id: id,  //optional.  id generated automatically.  Use if you needed to know the id beforehand
  //   name:'Vikram',
  //   age: 26
  // }, (error,result)=>{
  //   if (error){
  //     return console.log('Unable to insert user')
  //   }
  //   console.log("result return",result)
  // })

//   db.collection('users').insertMany([{
//     name:'Jen',
//     age:28
//   },
// {
//   name:'Gunther',
//   age:27
// }],(error, result)=>{
//   if (error){
//     console.log('Can not insert documents.')
//   }

//   console.log(result)
// })

// db.collection('tasks').insertMany([{
//   description:'This is task 1',
//   completed:true
// },{
//   description:'This is another task',
//   completed:false
// },{
//   description:'This is a 3rd task',
//   completed: false
// }],(error,result)=>{
//   if (error){
//     console.log('The tripple insert did not work')
//   }
//   console.log(result)
// })

})
