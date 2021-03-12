require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const dns = require('dns');
const crypto = require("crypto-js");
const app = express();

process.env.DB_URI='' /* set mongoDB URL */;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({
  extended: false
}));
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => {
  console.log(mongoose.connection.readyState);
  handleError(error);
});



let urlSchema = new Schema({
  original_url: String,
  short_url: {
    type: String,
    unique: true // shortenUrl must be unique
  }
});

const Url = mongoose.model('Url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// GET: redirect to shorten url from db
app.get('/api/shorturl/:short_url', (req, res) =>{
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
  }

  Url.findOne({short_url: req.params.short_url}, (err, data) => {
    if(err){
      console.log(err);
    }
    if(!data){
      console.log("data not exists");
    }else{
      console.log(data);
      res.redirect(data.original_url);
    }
  });

 
});

// POST: save url and shorten url to db
app.use(bodyParser.json()).post('/api/shorturl/new', (req, res) =>{
  if(mongoose.connection.readyState !== 0){
    console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
  }

  let url = req.body.url;
  let isShortUrl = false;
  if(!url.startsWith("http://") && !url.startsWith("https://")){
    console.log("invalid Url");
    res.json({ error: 'invalid url' });
    return;
  }
  let cipherId = (Math.random()*1000000).toString().substring(0,6)

  console.log("cipherId: " + cipherId);
  let domain = url.split("/").filter(d => d !== "/" && d !== "")[1];
  console.log(domain);

  dns.lookup(domain, (err, address, family) =>{
    if(err){
      console.log("err zone");
      res.status(err.status || 500)
      .json({ error: 'invalid url' });
    }
    else if(family === 0){
      console.log("URL wrong");
      res.json({ error: 'invalid url' });
    }else{
      console.log("URL Correct");
      // res.send({pass:"pass!"});
      Url.findOne({original_url: url},(err, dbUrl) => {
        if(err){
          console.error(err);
          res.json({ error: 'url not exists' });
          return 
        }
        if(dbUrl){
          res.json({
            original_url: dbUrl.original_url,
            short_url: dbUrl.short_url
          });
        }else{
          Url.exists({short_url: cipherId}, (err, result)=>{
            if (err) {
              res.send(err);
            } 
            console.log("does shorten url exists: ", result.toString()); 
            isShortUrl = result;
          });

          while(isShortUrl){
            cipherId = (Math.random()*1000000).toString().substring(0,6);

            Url.exists({short_url: cipherId}, (err, result)=>{
              if (err) {
                res.send(err);
              }
              console.log("does shorten url exists: ", result.toString()); 
              console.log("new cipherId: " + cipherId);
              isShortUrl = result;
            });
          }

          const newUrl = new Url({
            original_url: url,
            short_url: cipherId
          })

          newUrl.save((err, data) => {
            if(err) return console.error(err);
            console.log("save successfully!");
            res.json({
              original_url: url,
              short_url: cipherId
            });
          })
        }
      });

    }
  });

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
