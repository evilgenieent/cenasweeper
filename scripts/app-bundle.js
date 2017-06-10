define('app',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function App() {
    _classCallCheck(this, App);
  };
});
define('board',['exports', 'aurelia-framework', 'resources/helpers'], function (exports, _aureliaFramework, _helpers) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Board = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var Board = exports.Board = (_dec = (0, _aureliaFramework.customElement)('board'), _dec(_class = (_class2 = function () {
    function Board() {
      _classCallCheck(this, Board);

      _initDefineProp(this, 'x', _descriptor, this);

      _initDefineProp(this, 'y', _descriptor2, this);

      _initDefineProp(this, 'difficulty', _descriptor3, this);

      this.x = 10;
      this.y = 10;
      this.minesCount = 10;

      this.init();
    }

    Board.prototype.init = function init() {

      this.board = new Map();
      this.mines = [];

      this.setBoard();

      this.setCenas();

      console.log(this.board);
    };

    Board.prototype.setBoard = function setBoard() {

      for (var i = 0; i < this.x; i++) {

        var column = new Map();

        for (var j = 0; j < this.y; j++) {
          var field = {
            mines: null,
            cena: false,
            visited: false,
            flagged: false
          };
          column.set(j, field);
        }

        this.board.set(i, column);
      }
    };

    Board.prototype.setCenas = function setCenas() {

      for (var i = 0; i < this.minesCount; i++) {

        var randX = (0, _helpers.rand)(0, this.x);
        var randY = (0, _helpers.rand)(0, this.y);

        var field = this.board.get(randX).get(randY);

        if (field.cena === true) {
          i--;
        } else {
          field.cena = true;
          this.mines.push(field);
        }
      }
    };

    Board.prototype.click = function click(event, x, y) {

      event.preventDefault();
      switch (event.which) {
        case 1:
          this.visited(x, y);
          break;
        case 2:
          this.flagged(x, y);
          break;

        default:
          break;
      }

      this.checkVictory();
    };

    Board.prototype.checkVictory = function checkVictory() {

      var winner = true;

      this.board.forEach(function (column) {

        column.forEach(function (field) {

          if (!field.visited && !field.cena) {
            winner = false;
          }
        });
      });

      this.winner = winner;
      if (winner) {
        this.endGame();
      }
    };

    Board.prototype.visited = function visited(x, y) {
      var field = this.board.get(x).get(y);

      if (field.cena) {
        this.endGame();
      } else if (field.visited) {
        return;
      } else {
        this.proccessNeighbours(x, y);
      }
    };

    Board.prototype.proccessNeighbours = function proccessNeighbours(x, y) {

      var mines = 0;
      var field = this.board.get(x).get(y);

      if (field.visited) return;

      var neighbours = [{ x: x - 1, y: y - 1 }, { x: x - 1, y: y }, { x: x - 1, y: y + 1 }, { x: x, y: y - 1 }, { x: x, y: y + 1 }, { x: x + 1, y: y - 1 }, { x: x + 1, y: y }, { x: x + 1, y: y + 1 }];

      for (var i = 0; i < neighbours.length; i++) {

        if (!this.fieldExists(neighbours[i])) continue;

        var neighbourField = this.board.get(neighbours[i].x).get(neighbours[i].y);

        mines += neighbourField.cena ? 1 : 0;
      }

      field.mines = mines;
      field.visited = true;

      if (mines === 0) {
        for (var i = 0; i < neighbours.length; i++) {
          if (this.fieldExists(neighbours[i])) this.proccessNeighbours(neighbours[i].x, neighbours[i].y);
        }
      }
    };

    Board.prototype.fieldExists = function fieldExists(field) {
      return field.x > -1 && field.x < this.x && field.y > -1 && field.y < this.y;
    };

    Board.prototype.flagged = function flagged(x, y) {
      var field = this.board.get(x).get(y);
      field.flagged = !field.flagged;
    };

    Board.prototype.endGame = function endGame() {
      for (var i = 0; i < this.mines.length; i++) {
        this.mines[i].visited = true;
      }

      if (this.winner) {
        alert('You win!');
      } else {
        alert('You lost! Muhaha');
      }
    };

    return Board;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'x', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'y', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'difficulty', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/helpers',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.rand = rand;
  function rand(x, y) {
    return Math.floor(Math.random() * y) + x;
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n\n  <require from=\"board\"></require>\n  <require from=\"resources/css/main.css\"></require>\n  \n  <h1>Cena sweeper</h1>\n\n  <board view-model=\"board\"></board>\n\n</template>"; });
define('text!board.html', ['module'], function(module) { module.exports = "<template>\n\n  <div>\n    X: <input type=\"text\" value.bind=\"x\"><br>\n    Y: <input type=\"text\" value.bind=\"y\"><br>\n    Mines: <input type=\"text\" value.bind=\"minesCount\"><br>\n    <button click.delegate=\"init()\">Refresh</button>\n  </div>\n\n  <hr>\n\n  <div>\n\n    <table>\n\n      <tbody>\n\n        <tr repeat.for=\"[x, column] of board\">\n\n          <td repeat.for=\"[y, field] of column\" css=\"color: ${field.cena ? 'red' : 'black'};\">\n            <div\n              class=\"cs-field ${field.visited ? 'cs-visited' : ''} ${field.mines === 0 ? 'cs-empty' : ''} ${field.cena ? 'cs-cena' : ''}\"\n              click.delegate=\"click($event, x, y)\">\n              <!--${field.mines !== 0 ? field.mines : ''}-->\n              ${field.mines}\n              <img if.bind=\"field.cena && field.visited\" src=\"images/john_cena.png\" alt=\"John Cena, out of nowhere!\">\n            </div>\n          </td>\n\n        </tr>\n\n      </tbody>\n\n    </table>\n\n  </div>\n\n</template>"; });
define('text!resources/css/main.css', ['module'], function(module) { module.exports = "body {\n  font-family: Verdana, Tahoma, sans-serif;\n}\n.cs-field {\n  background-color: #add8e6;\n  width: 25px;\n  height: 25px;\n  text-align: center;\n}\n.cs-field.cs-visited {\n  background-color: #008000;\n}\n.cs-field.cs-visited.cs-empty {\n  background-color: #808080;\n}\n.cs-field.cs-visited.cs-cena {\n  background-color: #f00;\n}\n.cs-field > img {\n  width: 25px;\n  height: 25px;\n}\n"; });
//# sourceMappingURL=app-bundle.js.map