/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const URI = process.env.DB;
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).catch(error =>{
  console.log(mongoose.connection.readyState);
  handleError(error);
});

let bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments:[String],

});





module.exports = function (app) {
  const Book = mongoose.model('Book', bookSchema);
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      if(mongoose.connection.readyState !== 1){
        console.log('get-1');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }

      Book.find({}, (err, findbook) =>{
        if(err){
          return console.log(err);
        }
        //console.log(findbook);
        res.json(findbook);
      });

    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(mongoose.connection.readyState !== 1){
        console.log('post-1');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }
      if(!title){
        return res.send('missing required field title');
      }
      const b = new Book({
         title: title
      });

      b.save((err, data) =>{
        if(err) return console.error(err);
        return res.json({
          title: data.title,
          _id: data._id
        });
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      if(mongoose.connection.readyState !== 1){
        console.log('delete-1');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }
      Book.deleteMany({}, (err, findBook) =>{
        if(err) return console.error(err);
        res.send('complete delete successful');
      });


    })



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(mongoose.connection.readyState !== 1){
        console.log('get-2');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }

      Book.findById(bookid, (err, findBook) => {
        if(err) console.error(err);
        if(!findBook){
          return res.send('no book exists');
        }
        res.json(findBook);

      })

    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(mongoose.connection.readyState !== 1){
        console.log('post-2');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }
      if(!comment){
        return res.send('missing required field comment')
      }

      Book.findByIdAndUpdate(bookid, 
        { 
          $push: {"comments": comment},
          $inc: {commentcount: 1}
      },{new: true}
      ,(err, findBook) =>{
        if(err) return console.error(err);
        if(!findBook){
          return res.send('no book exists');
        }
        res.json(findBook);
      });

    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(mongoose.connection.readyState !== 1){
        console.log('delete-2');
        console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);
      }
      
      Book.findByIdAndDelete(bookid, (err, book)=>{
        if(err) console.error(err);
        // console.log(book);
        if(!book){
          return res.send('no book exists');
        }
        res.send('delete successful');
      });

    })
  
};
