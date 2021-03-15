var express = require('express');
var cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
var multer = require('multer');
var app = express();


var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'tmp/uploads');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
  
})

var upload = multer({storage: storage});

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false
}));


app.use('/public', express.static(process.cwd() + '/public'));


// POST
app.post('/api/fileanalyse', upload.single('upfile'),(req, res) => {
 try{
    console.log(req.file);
  res.json({
    name: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size
  });

 }catch(err){
   console.log(err);
 }

});

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
