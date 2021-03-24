const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: false
}));

process.env.DB_URI='';

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => {
  console.log(mongoose.connection.readyState);
  handleError(error);
});

let exerciseSchema = new Schema({
    _id: false,
    description: {
      type: String,
      required: true
    },
    duration :{
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
let exerciseUserSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true
    },
    exercise:[exerciseSchema]
});


const ExerciseUser = mongoose.model('ExerciseUser', exerciseUserSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// GET: all user information
app.get('/api/exercise/users' ,(req, res) => {
  // TODO: get array of all user
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
  }

  console.log("GET: all user information");
  const userAll = ExerciseUser.find({}).select('-__v')
    .exec((err, data)=>{
      if(err) return console.error(err);
      // console.log(data);
      return res.send(data);
    });
  

});

// GET: retrieve a full exercise log of any user.
app.get('/api/exercise/log' ,(req, res) => {
  // TODO: retrieve a full exercise log of any user.
  console.log("GET: retrieve a full exercise log of any user");
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
  }
  
  queryColumn = {
    "userId": req.query.userId,
    "from": req.query.from == null ? 0 : new Date(req.query.from).getTime(),
    "to": req.query.to == null ? new Date().getTime() : new Date(req.query.to).getTime(),
    "limit": req.query.limit == null ? null : Number(req.query.limit),
  }
  // console.log(queryColumn);
  // res.json(queryColumn);
  ExerciseUser.findById(queryColumn["userId"], (err, user)=>{
    if(err) return console.log(err);
    
    if(user == null) return res.send("Not found");
    
    // console.log(user.exercise);
    count = user.exercise.length;

    log = user.exercise.filter(e => e.date.getTime() >= queryColumn["from"] && e.date.getTime()  <= queryColumn["to"])
      .slice(0, queryColumn["limit"] || count)
      .map(e => ({
         description: e.description,
         duration: e.duration,
         date: e.date.toDateString() 
      }));
    // console.log(log);
    
    res.send({
        _id: user._id,
        username: user.username,
        log: log,
        count: log.length
    });

  });

});




// POST: create new user
app.use(bodyParser.json()).post('/api/exercise/new-user' ,(req, res) => {
  // TODO: create new user
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
  }
  console.log("POST: create new user");

  const u = new ExerciseUser({
    username: req.body.username
  });

  u.save((err, data) => {
    if(err) return console.error(err);
    return res.send({
      username: data.username,
      _id: data._id
    });
  });

});

// POST: create new exercise
app.use(bodyParser.json()).post('/api/exercise/add' ,(req, res) => {
  // TODO: create new exercise
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState); 
  }
  console.log("POST: create new exercise");


  console.log(req.body);
  const exercise = {
    userId: req.body.userId,
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date == null ? convertDate("") : convertDate(req.body.date)
  };

  ExerciseUser.findOneAndUpdate({_id:exercise.userId},{
    $push: {
      exercise:{
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date
      }
    }
  },(err, data) => {
    // console.log(data);
    if(err) return console.error(err);
      res.send({
        username: data.username, 
        description: exercise.description,
        duration: exercise.duration,
        _id: data._id,
        date: exercise.date
      });
    
  });

});


function convertDate(dateStr){
  console.log(dateStr);
  if(dateStr === "") return new Date().toDateString()
  try{
    
     date = new Date(dateStr).toDateString();
     return date;
  }catch(error){
    return new Date().toDateString();
  }
}



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
