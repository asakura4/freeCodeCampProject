const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  let apiUrl = '/api/translate';
  test('Translation with text and locale fields', function(done){
    const text = 'Mangoes are my favorite fruit.';
    const locale = 'american-to-british';
    const translation = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
    chai.request(server)
      .post(apiUrl)
      .send({
        text,
        locale
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, translation);
          done();
      });


    //done();
  });

  test('Translation with text and invalid locale field', function(done){
    const text = 'Mangoes are my favorite fruit.';
    const locale = 'invalid locale';
    const output = 'Invalid value for locale field';
    chai.request(server)
      .post(apiUrl)
      .send({
        text,
        locale
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, output);
          done();
      });


    //done();
  });

  test('Translation with missing text field', function(done){
    const locale = 'american-to-british';
    const output = 'Required field(s) missing';
    chai.request(server)
      .post(apiUrl)
      .send({
        locale
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, output);
          done();
      });


    //done();
  });

  test('Translation with missing locale field', function(done){
    const text = 'Mangoes are my favorite fruit.';
    const output = 'Required field(s) missing';
    chai.request(server)
      .post(apiUrl)
      .send({
        text
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, output);
          done();
      });


    //done();
  });

  test('Translation with empty text', function(done){
    const text = '';
    const locale = 'american-to-british';
    const output = 'No text to translate';
    chai.request(server)
      .post(apiUrl)
      .send({
        text,
        locale
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, output);
          done();
      });


    //done();
  });

  test('Translation with text that needs no translation', function(done){
    const text = 'SaintPeter and nhcarrigan give their regards!';
    const locale = 'british-to-american';
    const output = 'Everything looks good to me!';
    chai.request(server)
      .post(apiUrl)
      .send({
        text,
        locale
      })
      .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, output);
          done();
      });


    //done();
  });  

});
