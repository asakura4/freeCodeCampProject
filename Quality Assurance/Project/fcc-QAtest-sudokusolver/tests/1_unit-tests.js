const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  suite('Function solver.validate(puzzleString)', function(){
    test('valid puzzle string of 81 characters', function(done){
      let input = '..9..5...85.4....2432..........69.83.9.....6.62.7....9......1945....4.37.4.3..6..';
      assert.equal(solver.validate(input), 'pass');
      done();
    });

    test('puzzle string that is not 81 characters in length', function(done){
      let input = '..9..5..';
      assert.equal(solver.validate(input), 'Expected puzzle to be 81 characters long');
      done();
    });

    test('puzzle string with invalid characters', function(done){
      let input = 'tt9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      assert.equal(solver.validate(input), 'Invalid characters in puzzle');
      done();
    });
  });

  suite('Function solver.checkRowPlacement(puzzleString, row, column, value)', function(){
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    test('a valid row placement', function(done){
      assert.isTrue(solver.checkRowPlacement(input, 0,0,3));
      done();
    });

    test('an invalid row placement', function(done){
      assert.isFalse(solver.checkRowPlacement(input, 0,0,1));
      assert.isFalse(solver.checkRowPlacement(input, 4,0,6));
      done();
    });
  });

  suite('Function solver.checkColPlacement(puzzleString, row, column, value)', function(){
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    test('a valid column placement', function(done){
      assert.isTrue(solver.checkColPlacement(input, 0,0,7));
      assert.isTrue(solver.checkColPlacement(input, 5,7,2));
      done();
    });

    test('an invalid column placement', function(done){
      assert.isFalse(solver.checkColPlacement(input, 0,0,1));
      assert.isFalse(solver.checkColPlacement(input, 4,0,6));
      done();
    });
  });

  suite('Function solver.checkRegionPlacement(puzzleString, row, column, value)', function(){
    let input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

    test('a valid region (3x3 grid) placement', function(done){
      assert.isTrue(solver.checkRegionPlacement(input, 1,2,1));
      assert.isTrue(solver.checkRegionPlacement(input, 4,8,1));
      done();
    });

    test('an invalid region (3x3 grid) placement', function(done){
      assert.isFalse(solver.checkRegionPlacement(input, 1,2,9));
      assert.isFalse(solver.checkRegionPlacement(input, 4,8,3));
      done();
    });
  });


  suite('Function solver.solve(puzzleString)', function(){
    // test('Valid puzzle strings pass the solver', function(done){
    //   done();
    // });

    test('Invalid puzzle strings fail the solver', function(done){
      let input = '..9..5..';
      assert.equal(solver.solve(input), 'Expected puzzle to be 81 characters long');
      let input2 = 'tt9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      assert.equal(solver.solve(input2), 'Invalid characters in puzzle');
      done();
    });
    
    test('Valid puzzle strings pass the solver', function(done){
      let input ='5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      let output = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
      assert.equal(solver.solve(input).length, 81);
      done();
    });   

   test('Solver returns the the expected solution for an incomplete puzzle', function(done){
      let input ='5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      let output = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
      assert.equal(solver.solve(input), output);
      done();
    });   
  });




});
