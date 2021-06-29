const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Solve API test', function(){
    let apiUrl = '/api/solve';
    test('Solve a puzzle with valid puzzle string', function(done){
      const input ='1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      const output ='135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, output);    
          done();
        });
    });    

    test('Solve a puzzle with missing puzzle string', function(done){
      const input ='1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post(apiUrl)
        .send({
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing')
          done();
        });
    });   


    test('Solve a puzzle with invalid characters', function(done){
      const input ='1.5XX2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });   

    test('Solve a puzzle with incorrect length', function(done){
      const input ='1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });   

    test('Solve a puzzle that cannot be solved', function(done){
      const input ='115112.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });


  suite('Check API test', function(){
    let apiUrl = '/api/check';
 
    test('Check a puzzle placement with all fields', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'B3';
      const value = '1';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });


    test('Check a puzzle placement with single placement conflicts', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A4';
      const value = '9';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.equal(res.body.conflict.length, 1);
          let conflicts = res.body.conflict;
          assert.equal(conflicts[0], 'row');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '1';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.equal(res.body.conflict.length, 2);
          assert.equal(res.body.conflict[1], 'column');
          done();
        });
    });


    test('Check a puzzle placement with all placement conflicts', function(done){
      const input ='..9..5.1.8514....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '1';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.equal(res.body.conflict.length, 3);
          assert.equal(res.body.conflict[2], 'region');
          done();
        });
    });


    test('Check a puzzle placement with missing required fields', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing')
          done();
        });
    });


    test('Check a puzzle placement with invalid characters', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6XX';
      const coordinate = 'A1';
      const value = '4';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle')
          done();
        });
    });


    test('Check a puzzle placement with incorrect length', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6';
      const coordinate = 'A1';
      const value = '4';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
          done();
        });
    }); 

   test('Check a puzzle placement with invalid placement coordinate', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'X24';
      const value = '4';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate')
          done();
        });
    }); 

   test('Check a puzzle placement with invalid placement value', function(done){
      const input ='..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = 'X';
      chai.request(server)
        .post(apiUrl)
        .send({
          puzzle: input,
          coordinate,
          value
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value')
          done();
        });
    }); 

  });

});

