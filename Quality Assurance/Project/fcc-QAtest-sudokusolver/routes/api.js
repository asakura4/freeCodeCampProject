'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let cord = req.body.coordinate;
      let val = req.body.value;
      let puzzleString = req.body.puzzle;
      //console.log(req.body.coordinate,req.body.value);
      if(!(cord && val && puzzleString)){
        return res.send({'error':'Required field(s) missing'});
      }
      let validateCheck = solver.validate(puzzleString);
      if(validateCheck !== 'pass'){
        return res.send({'error': validateCheck});
      }
      cord = cord.toUpperCase();

      let rowString = 'ABCDEFGHI';
      let numString = '123456789';
      // console.log(cord[0], cord[1]);

      // coordinate format validation
      if(cord.length != 2 || rowString.indexOf(cord[0]) == -1
        || numString.indexOf(cord[1]) == -1){
        return res.send({'error': 'Invalid coordinate'});
      }
      // value format validation
      if(val.length != 1 || numString.indexOf(val) == -1){
        return res.send({'error': 'Invalid value'});
      }

      // value validation
      let conflictArray = [];
      let row = solver.rowDict[cord[0]];
      let col = cord[1] - 1;
      if(puzzleString[row*9 + col] == val){
        return res.send({valid: true});
      }


      if(!solver.checkRowPlacement(puzzleString, row, col, val)){
        conflictArray.push('row');
      }
      if(!solver.checkColPlacement(puzzleString, row, col, val)){
        conflictArray.push('column');
      }
      if(!solver.checkRegionPlacement(puzzleString, row, col, val)){
        conflictArray.push('region');
      }

      if(conflictArray.length > 0){
        return res.send({
          valid: false,
          conflict: conflictArray,
        })
      }

      return res.send({valid: true});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      if(!puzzleString){
        return res.send({error: 'Required field missing'});
      }

      let validateCheck = solver.validate(puzzleString);
      if(validateCheck !== 'pass'){
        return res.send({'error': validateCheck});
      }
      let output = solver.solve(puzzleString);
      if(output === puzzleString){
        return res.send({error: 'Puzzle cannot be solved'});
      }
      return res.send({solution: output});




    });
};
