/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
     
      // convertHandler.convert(5, 'gal');
      let input = req.query.input;
      //console.log(input);
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);
      
      if(initNum === 'invalid number' && initUnit === 'invalid unit'){
        // console.log("1", initNum, initUnit);
        return res.status(200).send('invalid number and unit');
        
      }else if(initNum === 'invalid number'){
        // console.log("2", initNum);
        return res.status(200).send('invalid number');
      }else if(initUnit === 'invalid unit'){
        // console.log("3", initUnit);
        return res.status(200).send('invalid unit');
      }

      //let spellOutUnit = convertHandler.spellOutUnit(initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let returnNum = convertHandler.convert(initNum, initUnit);
      
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
      let returnJson = {
        initNum: initNum,
        initUnit: initUnit,
        returnNum:returnNum,
        returnUnit: returnUnit,
        string: toString
      }
      return res.json(returnJson);
    });
    
};
