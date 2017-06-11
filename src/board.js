
// Aurelia imports
import { customElement } from 'aurelia-framework';
// Project imports
import { rand } from 'resources/helpers';

@customElement('board')
export class Board {

  constructor() {

    this.x = 10;    
    this.y = 10;    
    this.minesCount = 10;
    
    this.init();

  }

  init() {

    this.board = new Map;
    this.mines = [];

    this.audioPlaying = false;
    this.displayGif = false;
    this.winner = false;

    this.setBoard();

    this.setCenas();

    console.log(this.board);

  }

  setBoard() {

    for (var i = 0; i < this.x; i++) {
      
      let column = new Map;

      for (var j = 0; j < this.y; j++) {
        let field = {
          mines: null,
          cena: false,
          visited: false,
          flagged: false
        }
        column.set(j, field);
      }
      
      this.board.set(i, column);
    }

  }

  setCenas() {

    for (var i = 0; i < this.minesCount; i++) {

      let randX = rand(0, this.x);
      let randY = rand(0, this.y);

      let field = this.board.get(randX).get(randY);

      if(field.cena === true) {
        i--;
      } else {
        field.cena = true;
        this.mines.push(field);
      }

    }

  }

  click(event, x, y) {
    
    event.preventDefault();
    switch (event.which) {
      case 1:
        // left click
        this.visited(x, y);
        break;
      case 2:
        // mouse click
        this.flagged(x, y);
        break;
    
      default:
        break;
    }

    this.checkVictory();

  }

  checkVictory() {

    let winner = true;

    this.board.forEach(function(column) {

      column.forEach(function(field) {

        if(!field.visited && !field.cena) {
          winner = false;
        }

      });

    });

    this.winner = winner;
    if(winner) {
      this.endGame();
    }

  }

  visited(x, y) {
    let field = this.board.get(x).get(y);

    if(field.cena) {
      this.endGame();
    } else if(field.visited) {
      return;
    } else {
      this.proccessNeighbours(x,y);
    }

  }

  proccessNeighbours(x, y) {

    let mines = 0;
    let field = this.board.get(x).get(y);

    if(field.visited) return;

    let neighbours = [
      {x: x-1, y: y-1},
      {x: x-1, y: y},
      {x: x-1, y: y+1},
      {x: x,   y: y-1},
      {x: x,   y: y+1},
      {x: x+1, y: y-1},
      {x: x+1, y: y},
      {x: x+1, y: y+1}
    ];

    for (var i = 0; i < neighbours.length; i++) {
      
      if(!this.fieldExists(neighbours[i])) continue;

      let neighbourField = this.board.get(neighbours[i].x).get(neighbours[i].y);

      mines += neighbourField.cena ? 1 : 0;

    }

    field.mines = mines;
    field.visited = true;

    if(mines === 0) {
      for (var i = 0; i < neighbours.length; i++) {
        if(this.fieldExists(neighbours[i]))
          this.proccessNeighbours(neighbours[i].x, neighbours[i].y);
      }
    }

  }


  fieldExists(field) {
    return field.x > -1 && field.x < this.x && field.y > -1 && field.y < this.y;
  }

  flagged(x, y) {
    let field = this.board.get(x).get(y);
    field.flagged = !field.flagged;
  }

  endGame() {

    for (var i = 0; i < this.mines.length; i++) {
      this.mines[i].visited = true;
    }

    if(this.audioPlaying) return;

    if(this.winner) {
      alert('You win!');
    } else {

      this.audioPlaying = true;
      var audio = new Audio('audio/john_cena.mp3');
      audio.play();

    }

    var _this = this;

    setTimeout(function(){
      _this.displayGif = true;
    }, 2500);

  }

}