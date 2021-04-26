/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.unitDict = {
    "gal":"L",
    "L":"gal",
    "mi":"km",
    "km":"mi",
    "lbs":"kg",
    "kg":"lbs"
  }

  this.isLetter = function(c){
   return c.toLowerCase() != c.toUpperCase();
  }

  this.getNum = function(input) {
    let result;
    let idx;
    for(idx = 0; idx < input.length; idx++){
      if(this.isLetter(input[idx])){
        break;
      }
    }
    result = input.substring(0,idx);
    if(result.indexOf('/') !== result.lastIndexOf('/')){
      result = "invalid number";
    }else if(result.length == 0){
      result = 1;
    }else if(result.indexOf('/') != -1){
      div = result.split('/');
      result = Number(result.split("/")[0])/Number(result.split("/")[1]);

    }
    return result;
  };
  
  this.getUnit = function(input) {
    let result;
    let idx;
    for(idx = 0; idx < input.length; idx++){
      if(this.isLetter(input[idx])){
        break;
      }
    }
    
    result = input.substring(idx,).toLowerCase();
    if(result === 'l'){
      result = result.toUpperCase();
    }
    if(!(result in this.unitDict)){
      result = "invalid unit";
    }  
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    let result;
    // console.log(initUnit);
    if(!(initUnit in this.unitDict)){
      result = "invalid unit";
    }else{
      result = this.unitDict[initUnit];
    }
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result = "";

    if(unit == "gal"){
      result = "gallons";
    }else if(unit.toLowerCase() == "l" ){
      result = "liters";
    }else if(unit == "mi"){
      result = "miles";
    }else if(unit == "km"){
      result = "kilometers";
    }else if(unit == "lbs"){
      result = "pounds";
    }else if(unit == "kg"){
      result = "kilograms";
    }
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;
    // if(initNum.includes('/')){
    //   div = initNum.split('/');
    //   initNum = Number(num.split("/")[0])/Number(num.split("/")[1]);
    // }
    if(initUnit == "gal"){
      result = initNum * galToL;
    }else if(initUnit == "L"){
      result = initNum / galToL;
    }else if(initUnit == "mi"){
      result = initNum * miToKm;
    }else if(initUnit == "km"){
      result = initNum / miToKm;
    }else if(initUnit == "lbs"){
      result = initNum * lbsToKg;
    }else if(initUnit == "kg"){
      result = initNum / lbsToKg;
    }
    // }else if(isNaN(initNum)){
    //   result = "invalid number";
    //   return result;
    // }else{
    //   result = "invalid unit";
    //   return result;
    // }
    
    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result;
    let initUnitString = this.spellOutUnit(initUnit);
    let returnUnitString = this.spellOutUnit(returnUnit);

    result = `${initNum} ${initUnitString} converts to ${returnNum} ${returnUnitString}`;
    return result;
  };
  
}

module.exports = ConvertHandler;
