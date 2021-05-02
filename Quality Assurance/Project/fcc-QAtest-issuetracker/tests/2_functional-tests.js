const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

var _testid;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let apiUrl = '/api/issues/apigettest_' +
              Date.now().toString().substring(7);
  
  // API: POST 
  // #1
  test("Create an issue with every field: POST request to", function(done){
    chai.request(server)
      .post(apiUrl)
      .send({
        issue_title: "issue title 1 of API TEST1",
        issue_text: "issue test 1 of API TEST1",
        created_by: "tw",
        assigned_to: "JZ",
        status_text: "POST TEST Status text",
      })
      .end((err, res) =>{
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.property(res.body, 'created_on');
        assert.isNumber(Date.parse(res.body.created_on));
        assert.property(res.body, 'updated_on');
        assert.isNumber(Date.parse(res.body.updated_on));
        assert.property(res.body, 'created_by');
        assert.equal(res.body.created_by, "tw");
        assert.property(res.body, 'assigned_to');
        assert.equal(res.body.assigned_to, "JZ");
        assert.property(res.body, 'status_text');
        assert.equal(res.body.status_text, "POST TEST Status text");
        assert.property(res.body, '_id');
        assert.isNotEmpty(res.body._id);
        _testid = res.body._id;

        done();
      });
    });
  // API: POST 
  // #2  
  test("Create an issue with only required fields: POST request to", function(done){
    chai.request(server)
      .post(apiUrl)
      .send({
        issue_title: "issue title 2 of API TEST2",
        issue_text: "issue test 2 of API TEST2",
        created_by: "tw",
      })
      .end((err, res) =>{
        if(err){
          console.log(err);
        }

        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.property(res.body, 'created_on');
        assert.isNumber(Date.parse(res.body.created_on));
        assert.property(res.body, 'updated_on');
        assert.isNumber(Date.parse(res.body.updated_on));
        assert.property(res.body, 'created_by');
        assert.equal(res.body.created_by, "tw");
        assert.property(res.body, 'assigned_to');
        assert.equal(res.body.assigned_to, "");
        assert.property(res.body, 'status_text');
        assert.equal(res.body.status_text, "");
        assert.property(res.body, '_id');
        assert.isNotEmpty(res.body._id);

        done();
      });
    });

  // API: POST 
  // #3  
  test("Create an issue with missing required fields: POST request to", function(done){
    chai.request(server)
      .post(apiUrl)
      .send({
        issue_title: "issue title of POST API TEST3",
      })
      .end((err, res) =>{
        if(err){
          console.log(err);
        }

        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'required field(s) missing');

        done();
      });
    });

  // API GET
  // #1  
  test("View issues on a project: GET request to", function(done){
    chai.request(server)
      .get(apiUrl)
      .end((err, res) => {
        let issues = res.body
        assert.isArray(issues);
        assert.lengthOf(issues, 2);
        let re = new RegExp('issue title \\d of API TEST\\d');
        issues.forEach((issue)=>{
          assert.property(issue, 'issue_title');
          assert.match(issue.issue_title, re);
          assert.property(issue, 'issue_text');
          assert.property(issue, 'created_by');
          assert.property(issue, 'assigned_to');
          assert.property(issue, 'status_text');
          assert.property(issue, 'open');
          assert.property(issue, 'created_on');
          assert.property(issue, 'updated_on');
          assert.property(issue, '_id');
        });
        done();
      });
    });

  // API GET
  // #2  
  test("View issues on a project with one filter: GET request to ", function(done){

    chai.request(server)
      .get(apiUrl+'?created_by=tw')
      .end((err,res)=>{
        assert.isArray(res.body);
        assert.lengthOf(res.body, 2);
        done();
      });
    });
  // API GET
  // #3  
  test("View issues on a project with multiple filter: GET request to ", function(done){  
    chai.request(server)
      .get(apiUrl+'?created_by=tw&assigned_to=JZ')
      .end((err,res)=>{
        // console.log(res.body);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 1);
        
        done();
      });

    });


  // API PUT
  // #1  
  test("Update one field on an issue: PUT request to", function(done){

    let updateSuccess = {
      _id:_testid,
      issue_text: 'Put issues test - update'
    }
    //console.log(updateSuccess);

    chai.request(server)
      .put(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          result: 'successfully updated',
          _id: updateSuccess._id
        });
        done();
      });   

    });
  // API PUT
  // #2  
  test("Update multiple field on an issue: PUT request to", function(done){

    let updateSuccess = {
      _id:_testid,
      issue_text: 'Put issues test - update',
      issue_title: 'issue title 1 of API TEST1 after put'
    }
    //console.log(updateSuccess);

    chai.request(server)
      .put(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          result: 'successfully updated',
          _id: updateSuccess._id
        });
        done();
      });   

    });
  // API PUT
  // #3  
  test("Update an issue with missing _id: PUT request to", function(done){

    let updateSuccess = {
      issue_text: 'Put issues test - update'
    }
    //console.log(updateSuccess);

    chai.request(server)
      .put(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          error: 'missing _id'
        });
        done();
      });   

    });
  // API PUT
  // #4  
  test("Update an issue with no fields to update: PUT request to", function(done){

    let updateSuccess = {
      _id:_testid,
    }
    //console.log(updateSuccess);

    chai.request(server)
      .put(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          error: 'no update field(s) sent',
          _id: _testid 
        });
        done();
      });   

    });
  // API PUT
  // #5  
  test("Update an issue with no fields to update: PUT request to", function(done){

    let updateSuccess = {
      _id:'00000',
      issue_text: 'Put issues test - update'
    }
    //console.log(updateSuccess);

    chai.request(server)
      .put(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          error: 'could not update',
          _id: '00000' 
        });
        done();
      });   
    });
  // API DELETE
  // #1  
  test("Delete an issue: DELETE request to", function(done){

    let updateSuccess = {
      _id:_testid,
    }
    //console.log(updateSuccess);

    chai.request(server)
      .delete(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          result: 'successfully deleted',
          _id: _testid 
        });
        done();
      });   
    });

  // API DELETE
  // #2  
  test("Delete an issue with an invalid _id", function(done){

    let updateSuccess = {
    }
    //console.log(updateSuccess);

    chai.request(server)
      .delete(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          error: 'missing _id',
        });
        done();
      });   
    });
  // API DELETE
  // #3  
  test("Delete an issue with missing _id", function(done){

    let updateSuccess = {
      _id:'0000',
    }
    //console.log(updateSuccess);

    chai.request(server)
      .delete(apiUrl)
      .send(updateSuccess)
      .end((err, res) => {
        let issue = res.body;
        // console.log(issue);
        assert.deepEqual(issue, {
          error: 'could not delete',
          _id: '0000' 
        });
        done();
      });   
    });


});
