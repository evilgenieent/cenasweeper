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

    this.x = 10;
    this.y = 10;
    this.minesCount = 10;
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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Board = exports.Board = (_dec = (0, _aureliaFramework.customElement)('board'), _dec(_class = (_class2 = function () {
    function Board() {
      _classCallCheck(this, Board);

      _initDefineProp(this, 'x', _descriptor, this);

      _initDefineProp(this, 'y', _descriptor2, this);

      _initDefineProp(this, 'minesCount', _descriptor3, this);

      _initDefineProp(this, 'reset', _descriptor4, this);

      this.audio = new Audio('audio/john_cena.mp3');
    }

    Board.prototype.bind = function bind() {

      this.init();
    };

    Board.prototype.xChanged = function xChanged() {
      this.init();
    };

    Board.prototype.yChanged = function yChanged() {
      this.init();
    };

    Board.prototype.minesCountChanged = function minesCountChanged() {
      this.init();
    };

    Board.prototype.resetChanged = function resetChanged() {
      this.init();
    };

    Board.prototype.init = function init() {

      this.board = new Map();
      this.mines = [];

      this.audioPlaying = false;
      this.displayGif = false;
      this.winner = false;

      this.audio.pause();
      this.audio.currentTime = 0;

      this.setBoard();

      this.setCenas();
    };

    Board.prototype.setBoard = function setBoard() {
      for (var i = 0; i < this.x; i++) {

        var column = new Map();

        for (var j = 0; j < this.y; j++) {

          var field = {
            mines: null,
            cena: false,
            visited: false,
            flagged: false,
            questioned: false
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
      if (event.ctrlKey) {
        this.flagged(x, y);
      } else if (event.altKey) {
        this.questioned(x, y);
      } else {
        this.visited(x, y);
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
          if (this.fieldExists(neighbours[i])) {
            this.proccessNeighbours(neighbours[i].x, neighbours[i].y);
          }
        }
      }
    };

    Board.prototype.fieldExists = function fieldExists(field) {
      return field.x > -1 && field.x < this.x && field.y > -1 && field.y < this.y;
    };

    Board.prototype.flagged = function flagged(x, y) {
      var field = this.board.get(x).get(y);

      if (field.visited) return;
      field.flagged = !field.flagged;
    };

    Board.prototype.questioned = function questioned(x, y) {
      var field = this.board.get(x).get(y);

      if (field.visited) return;
      field.questioned = !field.questioned;
    };

    Board.prototype.endGame = function endGame() {
      for (var i = 0; i < this.mines.length; i++) {
        this.mines[i].visited = true;
      }

      if (this.audioPlaying) return;

      if (this.winner) {
        alert('You win!');
      } else {
        this.audioPlaying = true;
        this.audio.play();
      }

      var _this = this;

      setTimeout(function () {
        _this.displayGif = true;
      }, 2500);
    };

    return Board;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'x', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'y', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'minesCount', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'reset', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('controls',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Controls = undefined;

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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var Controls = exports.Controls = (_dec = (0, _aureliaFramework.customElement)('controls'), _dec(_class = (_class2 = function () {
    function Controls() {
      _classCallCheck(this, Controls);

      _initDefineProp(this, 'x', _descriptor, this);

      _initDefineProp(this, 'y', _descriptor2, this);

      _initDefineProp(this, 'minesCount', _descriptor3, this);

      _initDefineProp(this, 'reset', _descriptor4, this);
    }

    Controls.prototype.init = function init() {

      this.reset = !this.reset;
    };

    return Controls;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'x', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'y', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'minesCount', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'reset', [_aureliaFramework.bindable], {
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n  <require from=\"board\"></require>\r\n  <require from=\"controls\"></require>\r\n\r\n  <require from=\"resources/css/simple-grid.css\"></require>\r\n  <require from=\"resources/css/main.css\"></require>\r\n\r\n  <div class=\"jumbotron\">\r\n\r\n    <div class=\"container\">\r\n\r\n      <div class=\"row\">\r\n\r\n        <div class=\"col-12\">\r\n          \r\n          <h3>Cena sweeper</h3>\r\n\r\n        </div>\r\n\r\n        <controls view-model=\"controls\" x.two-way=\"x\" y.two-way=\"y\" mines-count.two-way=\"minesCount\" reset.two-way=\"reset\"></controls>\r\n\r\n      </div>\r\n\r\n    </div>\r\n  \r\n  </div>\r\n\r\n  <div class=\"container\">\r\n\r\n    <div class=\"row\">\r\n\r\n      <div class=\"col-12\">\r\n        <board view-model=\"board\" x.two-way=\"x\" y.two-way=\"y\" mines-count.two-way=\"minesCount\" reset.two-way=\"reset\"></board>\r\n      </div>\r\n\r\n    </div>\r\n\r\n  </div>\r\n\r\n  <div class=\"jumbotron footer\">\r\n\r\n    <div class=\"container\">\r\n\r\n      <div class=\"col-12\">\r\n        \r\n        <a href=\"http://hajnyon.github.io\" target=\"_blank\">hajnyon</a>\r\n        <span class=\"right\"></span>\r\n        \r\n      </div>\r\n    \r\n    </div>\r\n\r\n  </div>\r\n\r\n</template>"; });
define('text!board.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n  <div if.bind=\"displayGif\" class=\"cs-gif center\">\r\n    <img src=\"${winner ? 'images/jc_win.gif' : 'images/jc_lose.gif'}\" alt=\"John Cena everyone!\">\r\n  </div>\r\n  \r\n  <div if.bind=\"!displayGif\">\r\n\r\n    <table class=\"center\">\r\n\r\n      <tbody>\r\n\r\n        <tr repeat.for=\"[x, column] of board\">\r\n\r\n          <td repeat.for=\"[y, field] of column\" css=\"color: ${field.cena ? 'red' : 'black'};\">\r\n            <div\r\n              class=\"cs-field\r\n                ${field.visited ? 'cs-visited' : ''}\r\n                ${field.mines === 0 ? 'cs-empty' : ''}\r\n                ${field.flagged || field.questioned ? 'cs-flagged' : ''}\r\n                ${field.cena ? 'cs-cena' : ''}\"\r\n              click.delegate=\"click($event, x, y)\">\r\n              <!--${field.mines !== 0 ? field.mines : ''}-->\r\n              ${field.mines !== 0 ? field.mines : ''} ${field.questioned ? '?' : ''}\r\n              <img if.bind=\"field.cena && field.visited\" src=\"images/john_cena.png\" alt=\"John Cena, out of nowhere!\">\r\n            </div>\r\n          </td>\r\n\r\n        </tr>\r\n\r\n      </tbody>\r\n\r\n    </table>\r\n\r\n  </div>\r\n\r\n</template>"; });
define('text!resources/css/main.css', ['module'], function(module) { module.exports = "/*\n * @Author: hajnyon \n * @Date: 2017-06-11 02:40:16 \n * @Last Modified by: hajnyon\n * @Last Modified time: 2017-06-12 23:09:22\n */\nbody {\n  font-family: Verdana, Tahoma, sans-serif;\n  color: #fff;\n}\n.jumbotron {\n  background: #4608a3;\n  background-image: -webkit-linear-gradient(#4608a3, #0665dc);\n  height: auto;\n  width: 100%;\n  z-index: 100 !important;\n}\n.jumbotron * {\n  color: #fff;\n}\n.jumbotron.footer {\n  padding: 20px 0;\n  background: #0665dc;\n  background-image: -webkit-linear-gradient(#0665dc, #06badc);\n}\nh6 {\n  margin: 0 0 0 0;\n}\ninput {\n  border: 2px solid #fff;\n  color: #fff;\n  background-color: transparent;\n  width: 96%;\n  padding: 7px 10px;\n  font-size: 16px;\n  outline: none;\n}\nbutton {\n  border: 2px solid #fff;\n  color: #fff;\n  background-color: transparent;\n  padding: 7px 30px;\n  margin-top: 20px;\n  font-size: 16px;\n  outline: none;\n}\nbutton:hover {\n  background-color: #fff;\n  color: #0665dc;\n  cursor: pointer;\n}\n.cs-field {\n  background-color: #add8e6;\n  border: 1px solid #fff;\n  color: #fff;\n  width: 25px;\n  height: 25px;\n  text-align: center;\n}\n.cs-field:hover {\n  border: 1px solid #0665dc;\n  cursor: crosshair;\n}\n.cs-field.cs-visited {\n  border: 1px solid #0665dc;\n  background-color: #0665dc;\n}\n.cs-field.cs-visited:hover {\n  cursor: not-allowed;\n}\n.cs-field.cs-visited.cs-empty {\n  border: 1px solid #808080;\n  background-color: #808080;\n}\n.cs-field.cs-visited.cs-cena {\n  background-color: #f00;\n}\n.cs-field.cs-flagged {\n  background-color: #4608a3;\n  border: 1px solid #4608a3;\n}\n.cs-field > img {\n  width: 25px;\n  height: 25px;\n}\n"; });
define('text!controls.html', ['module'], function(module) { module.exports = "<template>\r\n\r\n  <div class=\"col-3\">\r\n    <h6>X</h6>\r\n    <input type=\"number\" value.bind=\"x & debounce:800\">\r\n  </div>\r\n\r\n  <div class=\"col-3\">\r\n    <h6>Y</h6>\r\n    <input type=\"text\" value.bind=\"y & debounce:800\">\r\n  </div>\r\n\r\n  <div class=\"col-3\">\r\n    <h6>Mines</h6>\r\n    <input type=\"text\" value.bind=\"minesCount & debounce:800\">\r\n  </div>\r\n\r\n  <div class=\"col-3\">\r\n    <button click.delegate=\"init()\">Refresh</button>\r\n  </div>\r\n\r\n</template>"; });
define('text!resources/css/simple-grid.css', ['module'], function(module) { module.exports = "/**\n*** SIMPLE GRID\n*** (C) ZACH COLE 2016\n**/\n@import url(\"https://fonts.googleapis.com/css?family=Lato:400,300,300italic,400italic,700,700italic\");\n/* UNIVERSAL */\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  left: 0;\n  top: 0;\n  font-size: 100%;\n}\n/* ROOT FONT STYLES */\n* {\n  font-family: 'Lato', Helvetica, sans-serif;\n  color: #333447;\n  line-height: 1.5;\n}\n/* TYPOGRAPHY */\nh1 {\n  font-size: 2.5rem;\n}\nh2 {\n  font-size: 2rem;\n}\nh3 {\n  font-size: 1.375rem;\n}\nh4 {\n  font-size: 1.125rem;\n}\nh5 {\n  font-size: 1rem;\n}\nh6 {\n  font-size: 0.875rem;\n}\np {\n  font-size: 1.125rem;\n  font-weight: 200;\n  line-height: 1.8;\n}\n.font-light {\n  font-weight: 300;\n}\n.font-regular {\n  font-weight: 400;\n}\n.font-heavy {\n  font-weight: 700;\n}\n/* POSITIONING */\n.left {\n  text-align: left;\n}\n.right {\n  text-align: right;\n}\n.center {\n  text-align: center;\n  margin-left: auto;\n  margin-right: auto;\n}\n.justify {\n  text-align: justify;\n}\n/* ==== GRID SYSTEM ==== */\n.container {\n  width: 90%;\n  margin-left: auto;\n  margin-right: auto;\n}\n.row {\n  position: relative;\n  width: 100%;\n}\n.row [class^=\"col\"] {\n  float: left;\n  margin: 0.5rem 2%;\n  min-height: 0.125rem;\n}\n.row::after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.col-1,\n.col-2,\n.col-3,\n.col-4,\n.col-5,\n.col-6,\n.col-7,\n.col-8,\n.col-9,\n.col-10,\n.col-11,\n.col-12 {\n  width: 96%;\n}\n.col-1-sm {\n  width: 4.33%;\n}\n.col-2-sm {\n  width: 12.66%;\n}\n.col-3-sm {\n  width: 21%;\n}\n.col-4-sm {\n  width: 29.33%;\n}\n.col-5-sm {\n  width: 37.66%;\n}\n.col-6-sm {\n  width: 46%;\n}\n.col-7-sm {\n  width: 54.33%;\n}\n.col-8-sm {\n  width: 62.66%;\n}\n.col-9-sm {\n  width: 71%;\n}\n.col-10-sm {\n  width: 79.33%;\n}\n.col-11-sm {\n  width: 87.66%;\n}\n.col-12-sm {\n  width: 96%;\n}\n.hidden-sm {\n  display: none;\n}\n@media only screen and (min-width: 33.75em) {\n  .container {\n    width: 80%;\n  }\n}\n@media only screen and (min-width: 45em) {\n  .col-1 {\n    width: 4.33%;\n  }\n  .col-2 {\n    width: 12.66%;\n  }\n  .col-3 {\n    width: 21%;\n  }\n  .col-4 {\n    width: 29.33%;\n  }\n  .col-5 {\n    width: 37.66%;\n  }\n  .col-6 {\n    width: 46%;\n  }\n  .col-7 {\n    width: 54.33%;\n  }\n  .col-8 {\n    width: 62.66%;\n  }\n  .col-9 {\n    width: 71%;\n  }\n  .col-10 {\n    width: 79.33%;\n  }\n  .col-11 {\n    width: 87.66%;\n  }\n  .col-12 {\n    width: 96%;\n  }\n  .hidden-sm {\n    display: block;\n  }\n}\n@media only screen and (min-width: 60em) {\n  .container {\n    width: 75%;\n    max-width: 60rem;\n  }\n}\n"; });
//# sourceMappingURL=app-bundle.js.map