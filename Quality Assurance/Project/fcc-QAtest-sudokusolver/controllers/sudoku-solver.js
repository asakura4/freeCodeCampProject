class SudokuSolver {
  constructor(){
    this.rowDict = {
      'A':0,
      'B':1,
      'C':2,
      'D':3,
      'E':4,
      'F':5,
      'G':6,
      'H':7,
      'I':8
    }
  }

  validate(puzzleString) {
    if(puzzleString.length!=81){
      return "Expected puzzle to be 81 characters long";
    }

    var re = new RegExp('^[\\.\\d]+$','i');
    if(!re.test(puzzleString)){
      return "Invalid characters in puzzle";
    }

    return "pass";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let i;
    for(i = row*9; i < row*9+9; i++){
      //console.log(puzzleString[i]);
      if(value == puzzleString[i]){
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let i;
    // console.log(row, column);
    for(i = 0; i < 9; i++){
      // console.log(puzzleString[9*i+column]);
      if(value == puzzleString[9*i+column]){
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // console.log('test', row, column, value);
    let rowStart;
    if(row < 3){
      rowStart = 0; 
    }else if(row < 6){
      rowStart= 3; 
    }else{
      rowStart = 6;
    }
    
    let colStart;
    if(column < 3){
      colStart = 0; 
    }else if(column < 6){
      colStart = 3; 
    }else{
      colStart = 6;
    }
    let i = rowStart;
    while(i < rowStart + 3){
      let j = colStart;
      while(j < colStart + 3){
        // console.log(i, j, puzzleString[9*i + j]);
          if(value == puzzleString[9*i + j]){
            return false;
          }
          j++;
      }
      i++;
    }
    return true;

  }

  nextIndexFinder(puzzleArray){
    let i;
    for(i = 0; i < 81; i++){
      if(puzzleArray[i] === '.'){
        return i;
      }
    }
    return -1;
  }

  solve(puzzleString) {
    let result = this.validate(puzzleString);
    // console.log(result);
    if(result !== 'pass'){
      return result;
    }
    //console.log(result);
    let puzzleArray = puzzleString.split('');
    //console.log(puzzleArray);
    let ans = this.solveHelper(puzzleArray);
    if(ans){
      return puzzleArray.join('');
    }else{
      return puzzleString;
    }

  }

  solveHelper(puzzleArray){
    let idx = this.nextIndexFinder(puzzleArray);
    if(idx == '-1'){
      return true;
    }
    let row = Math.floor(idx / 9);
    let col = idx % 9;
    let val;
    for(val = 1; val < 10; val++){
      if(this.checkRowPlacement(puzzleArray, row, col, val) &&
        this.checkRegionPlacement(puzzleArray, row, col, val)&&
        this.checkColPlacement(puzzleArray, row, col, val)){
          puzzleArray[idx] = val;
          let check = this.solveHelper(puzzleArray);
          if(check){
            return true;
          }
        }
      puzzleArray[idx] = '.'
    }
    return false;

  }
}

module.exports = SudokuSolver;

