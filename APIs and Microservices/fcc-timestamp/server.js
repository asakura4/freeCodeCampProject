// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.get("/api/timestamp/",(req, res)=>{

  let time, unix;
  unix = Date.now()
  time = new Date(unix).toUTCString();
  
  res.json({unix: unix, utc: time});
});


app.get("/api/timestamp/:date_string", (req, res) =>{
  const dateRegex = /^(\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01]))$/gm;
  const unixRegex = /^(\d+)$/gm;
  let date_string, time, unix;



  if(unixRegex.test(req.params.date_string)){
    date_string = req.params.date_string.match(unixRegex)[0];
    unix = parseInt(date_string);
    time = new Date(parseInt(date_string)).toUTCString();

    res.json({unix: unix, utc: time});
  }
  else{
    date_string = new Date(req.params.date_string);

    if(date_string.toString() === "Invalid Date"){
      res.json({error : "Invalid Date"});
    }else{
      unix = date_string.valueOf();
      time = date_string.toUTCString();
      res.json({unix: unix, utc: time});
    }
  }

});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
