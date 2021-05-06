/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
var _testid;

suite('Functional Tests', function() {
  let apiUrl = '/api/books';
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    
    suite('POST /api/books with title => create book object/expect book object', function() {
    
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post(apiUrl)
          .send({
            title: 'POST API TEST1', 
          })
          .end((err, res)=>{
            // console.log(res.body);
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.isNotEmpty(res.body._id);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'POST API TEST1');
            _testid = res.body._id;
            done();
          });
          // done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post(apiUrl)
          .send({})
          .end((err, res)=>{
            // console.log(res);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });

      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            let books = res.body;
            assert.equal(res.status, 200);
            assert.isArray(books);
            assert.property(books[0], 'comments');
            assert.property(books[0], 'title');
            assert.property(books[0],'commentcount');
            done();
          });
        // done();
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let fakeid = '111111111111';
        chai.request(server)
          .get('/api/books/' + fakeid)
          .end((err, res) => {
            let books = res.body;
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          });
          // done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + _testid)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.isNotEmpty(res.body._id);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'POST API TEST1');
            assert.property(res.body, 'commentcount');
            assert.equal(res.body.commentcount, 0);
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);

            done();
          });
          // done();
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + _testid)
          .send({
            comment:'API POST comment1'
          })
          .end((err, res) =>{
            console.log(res.body);
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.isNotEmpty(res.body._id);
            assert.property(res.body, 'title');
            assert.equal(res.body.title, 'POST API TEST1');
            assert.property(res.body, 'commentcount');
            assert.equal(res.body.commentcount, 1);
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[0], 'API POST comment1');
            done();
          });
          // done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + _testid)
          .send({})
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            // done();
          });
          done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let fakeid = '111111111111';
        chai.request(server)
          .post('/api/books/' + fakeid)
          .send({
            comment:'API POST comment3'
          })
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();

          });
          // done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/' + _testid)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text,'delete successful');
            done();
          });
          // done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let fakeid = '111111111111';
        chai.request(server)
          .delete('/api/books/' + fakeid)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text,'no book exists');
            done();
          });
          // done();
      });

    });

  });

});
