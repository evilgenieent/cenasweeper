/*
 * @Author: hajnyon 
 * @Date: 2017-06-11 02:39:57 
 * @Last Modified by: hajnyon
 * @Last Modified time: 2017-06-12 22:54:24
 */

// Aurelia imports
import { customElement, bindable } from 'aurelia-framework';
// Project imports
import { rand } from 'resources/helpers';

@customElement('board')
export class Board {

  @bindable x;
  @bindable y;
  @bindable minesCount;
  @bindable reset;

  constructor() {

    // audio file
    this.audio = new Audio('audio/john_cena.mp3');

  }

  bind() {

    this.init();

  }

  /**
   * Watches bindable changing and delegates init method.
   */
  xChanged() {
    this.init();
  }
  yChanged() {
    this.init();
  }
  minesCountChanged() {
    this.init();
  }
  resetChanged() {
    this.init();
  }

  /**
   * Initializes the game.
   */
  init() {

    this.board = new Map;
    this.mines = [];

    this.audioPlaying = false;
    this.displayGif = false;
    this.winner = false;
    
    // reset audio
    this.audio.pause();
    this.audio.currentTime = 0;

    this.setBoard();

    this.setCenas();

  }

  /**
   * Set board fields to 2d map.
   */
  setBoard() {

    // rows
    for (var i = 0; i < this.x; i++) {

      let column = new Map;

      // columns
      for (var j = 0; j < this.y; j++) {

        let field = {
          mines: null,
          cena: false,
          visited: false,
          flagged: false,
          questioned: false
        }

        column.set(j, field);

      }

      this.board.set(i, column);
    }

  }

  /**
   * Set random positions of cenas (mines).
   */
  setCenas() {

    // set all mines
    for (var i = 0; i < this.minesCount; i++) {

      // get random positions
      let randX = rand(0, this.x);
      let randY = rand(0, this.y);

      // find field
      let field = this.board.get(randX).get(randY);

      // if field isn't already mine, set it, else rerun step
      if (field.cena === true) {
        i--;
      } else {
        field.cena = true;
        this.mines.push(field);
      }

    }

  }

  /**
   * 
   * @param {Object} event Propertios of triggered event.
   * @param {Integer} x X position on 2d board.
   * @param {Integer} y Y position on 2d board.
   */
  click(event, x, y) {

    // watch click event and recognize if ctrl or alt is pushed aswell
    if(event.ctrlKey) {

      // click with ctrl (flag it)
      this.flagged(x, y);

    } else if(event.altKey) {

      // click with alt (question it)
      this.questioned(x, y);

    } else {

      // normal click
      this.visited(x, y);

    }

    this.checkVictory();

  }

  /**
   * Checks if game isn't already won.
   */
  checkVictory() {

    let winner = true;

    // loop 2d board
    this.board.forEach(function (column) {

      column.forEach(function (field) {

        // if every noncena field is visited end game
        if (!field.visited && !field.cena) {
          winner = false;
        }

      });

    });

    // end game
    this.winner = winner;
    if (winner) {
      this.endGame();
    }

  }

  /**
   * Performs actions according to field state.
   * 
   * @param {Integer} x X position on board.
   * @param {Integer} y Y position on board.
   */
  visited(x, y) {
    let field = this.board.get(x).get(y);

    if (field.cena) {
      // field is cena, end game
      this.endGame();
    } else if (field.visited) {
      // field already visited
      return;
    } else {
      // field not visited, perform lookup around
      this.proccessNeighbours(x, y);
    }

  }

  /**
   * Checks neighbours of the field and proccesses them.
   * 
   * @param {Integer} x X position on board.
   * @param {Integer} y Y position on board.
   */
  proccessNeighbours(x, y) {

    let mines = 0;
    let field = this.board.get(x).get(y);

    // if field is already visited return
    if (field.visited) return;

    // possible neighboars
    let neighbours = [
      { x: x - 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y },
      { x: x + 1, y: y + 1 }
    ];

    // loop neighbours
    for (var i = 0; i < neighbours.length; i++) {

      // check if field exists
      if (!this.fieldExists(neighbours[i])) continue;

      let neighbourField = this.board.get(neighbours[i].x).get(neighbours[i].y);

      // add fields mines (cenas) count
      mines += neighbourField.cena ? 1 : 0;

    }

    field.mines = mines;
    field.visited = true;

    // if no mines are present recurse on neighbours
    if (mines === 0) {
      for (var i = 0; i < neighbours.length; i++) {
        if (this.fieldExists(neighbours[i])) {
          this.proccessNeighbours(neighbours[i].x, neighbours[i].y);
        }
      }
    }

  }

  /**
   * Check fields existence by borders of board.
   * 
   * @param {Object} field Field properties.
   */
  fieldExists(field) {
    return field.x > -1 && field.x < this.x && field.y > -1 && field.y < this.y;
  }

  /**
   * Sets field as flagged.
   * 
   * @param {Integer} x X position on board.
   * @param {Integer} y Y position on board.
   */
  flagged(x, y) {
    let field = this.board.get(x).get(y);

    // no point to flagg visited fields
    if(field.visited) return;
    field.flagged = !field.flagged;

  }

  /**
   * Sets field as questioned.
   * 
   * @param {Integer} x X position on board.
   * @param {Integer} y Y position on board.
   */
  questioned(x, y) {
    let field = this.board.get(x).get(y);

    // no point to question visited fields
    if(field.visited) return;
    field.questioned = !field.questioned;

  }

  /**
   * Ends game either as win or lose.
   */
  endGame() {

    // display all cenas (mines)
    for (var i = 0; i < this.mines.length; i++) {
      this.mines[i].visited = true;
    }

    // if audio already playing don't play it more
    if (this.audioPlaying) return;

    // win or lose
    if (this.winner) {
      alert('You win!');
    } else {

      // play audio
      this.audioPlaying = true;
      this.audio.play();

    }

    var _this = this;

    // display gif after little break
    setTimeout(function () {
      _this.displayGif = true;
    }, 2500);

  }

}