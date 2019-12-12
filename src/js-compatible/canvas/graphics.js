"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Graphics3D = exports.Graphics2D = exports.Graphics = void 0;

var THREE = _interopRequireWildcard(require("three"));

var PIXI = _interopRequireWildcard(require("pixi.js"));

var _locator = require("./locator");

require("jquery");

var _types = require("./types");

var _graph3 = require("./graph");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A wrapper around THREE and PIXI rendering engines to give them the same syntax 
 * to handle with.
 */
var Graphics =
/*#__PURE__*/
function () {
  // /**
  //  * Indicator for performed synchronization
  //  */
  // protected synchronized: boolean = true;

  /**
   * Pauses the asynchronous animation if set to true
   */

  /**
   * Initializes a common interface for graphics manipulations
   * @param canvas The div in which the graphics renderer sits in
   */
  function Graphics(canvas) {
    _classCallCheck(this, Graphics);

    this.canvas = canvas;
    this.id = void 0;
    this.syncTargets = new Map();
    this.domObject = void 0;
    this.rootScene = void 0;
    this.graphs = new Map();
    this.width = void 0;
    this.height = void 0;
    this.lc = void 0;
    this.clock = void 0;
    this.pause = false;
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    this.clock = new THREE.Clock(false);
  }
  /**
   * Adds a dataset to the current list of datasets to this and all the synchronized targets
   * @param dataset the dataset to be added, it has to have an id
   * @param color 
   * @param material
   * @param synchronize Whether the operation should be synchronized with the sync targets
   * @returns the Graph object created that contains the dataset
   */


  _createClass(Graphics, [{
    key: "removeDataset",
    value: function removeDataset(id) {
      var synchronize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (id instanceof _types.Dataset) {
        this.removeDataset(id.id, synchronize);
      } else {
        if (synchronize) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.syncTargets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var graphics = _step.value;
              graphics[1].removeDataset(id, false);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        this.removeGraph(id, false);
      }
    }
    /**
     * Adds the graph to the Graphs list directly without initialization
     * and that of all the synchronized targets
     * @param graph the graph to be added
     * @param synchronize Whether the operation should be synchronized with the sync targets
     */

  }, {
    key: "removeGraph",
    value: function removeGraph(id) {
      var synchronize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (id instanceof _types.Dataset) {
        return this.removeGraph(id.id, synchronize);
      } else {
        if (synchronize) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.syncTargets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var graphics = _step2.value;
              graphics[1].removeGraph(id, false);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        return this.graphs["delete"](id);
      }
    }
    /**
     * Updates all the graphs in this canvas
     */

  }, {
    key: "updateGraphs",
    value: function updateGraphs() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.graphs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var item = _step3.value;
          item[1].update();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    /**
     * Attaches this.domObject to the specified panel
     */

  }, {
    key: "attach",
    value: function attach() {
      this.canvas.appendChild(this.domObject);
      this.clock.start();
      this.startAnimation();
    }
    /**
     * Detaches this.domObject from the specified panel
     */

  }, {
    key: "detach",
    value: function detach() {
      this.clock.stop();
      this.canvas.removeChild(this.domObject);
      this.pause = true;
    }
  }, {
    key: "animate",
    value: function animate() {
      if (!this.pause) requestAnimationFrame(this.animate);
      this.updateGraphs();
      this.render();
    }
  }, {
    key: "startAnimation",
    value: function startAnimation() {
      this.pause = false;
      this.animate();
    }
  }, {
    key: "pauseAnimation",
    value: function pauseAnimation() {
      this.pause = true;
    }
    /**
     * Called to render the root scene
     */

  }, {
    key: "addSyncTarget",
    value: function addSyncTarget(graphics) {
      if (graphics === this) throw new Error("Cannot add self to the sync target list");
      this.syncTargets.set(graphics.id, graphics);
    }
  }, {
    key: "removeSyncTarget",
    value: function removeSyncTarget(graphics) {
      return this.syncTargets["delete"](graphics.id);
    }
  }]);

  return Graphics;
}();
/**
 * Standard 2D graphical representation
 */


exports.Graphics = Graphics;

var Graphics2D =
/*#__PURE__*/
function (_Graphics) {
  _inherits(Graphics2D, _Graphics);

  function Graphics2D(canvas) {
    var _this;

    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "g2d";

    _classCallCheck(this, Graphics2D);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphics2D).call(this, canvas));
    _this.canvas = canvas;
    _this.id = id;
    _this.domObject = void 0;
    _this.rootScene = void 0;
    _this.app = void 0;
    _this.renderer = void 0;
    _this.lc = void 0;
    _this.graphs = new Map();
    _this.app = new PIXI.Application({
      width: _this.width,
      height: _this.height,
      antialias: true,
      // default: false
      transparent: true,
      // default: false
      resolution: 1 // default: 1

    });
    _this.domObject = _this.app.view;
    _this.domObject.id = id; //Setup root scene

    _this.rootScene = _this.app.stage; //Setup renderer

    _this.renderer = _this.app.renderer;
    _this.app.renderer.autoDensity = true; //purpose served by autoDensity which takes into acount of the window.devicePixelRatio
    // this.renderer.resolution = window.devicePixelRatio; 

    _this.renderer.resize(_this.width, _this.height);

    _this.lc = new _locator.Locator();
    _this.lc.A = [[30, 0, 0], [0, -30, 0], [0, 0, 0]];
    _this.lc.B = [_this.width / 2, _this.height / 2, 0];
    return _this;
  }

  _createClass(Graphics2D, [{
    key: "addDataset",
    value: function addDataset(dataset, color, material) {
      var synchronize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (synchronize) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.syncTargets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var item = _step4.value;
            item[1].addDataset(dataset, color, undefined, synchronize);
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
              _iterator4["return"]();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }

      if (dataset.id != undefined) {
        var _graph = new _graph3.PIXIGraph(dataset, this, color);

        this.addGraph(_graph, false);
        return _graph;
      } else throw new Error("Failed to add dataset, the id of " + dataset + " is not defined");
    }
  }, {
    key: "addGraph",
    value: function addGraph(graph) {
      var synchronize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (synchronize) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.syncTargets[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var item = _step5.value;
            item[1].addGraph(graph, false);
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
              _iterator5["return"]();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }

      this.graphs.set(graph.id, graph);
      this.rootScene.addChild(graph.PIXIObject);
    }
  }, {
    key: "render",
    value: function render() {
      this.app.render();
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
      this.lc.B = [this.width / 2, this.height / 2, 0];
      this.renderer.resize(this.width, this.height);
      $(this.canvas).outerWidth(this.width);
      $(this.canvas).outerHeight(this.height);
      this.updateGraphs();
      this.render();
    }
  }]);

  return Graphics2D;
}(Graphics);
/**
 * Standard 3D graphical representation
 */


exports.Graphics2D = Graphics2D;

var Graphics3D =
/*#__PURE__*/
function (_Graphics2) {
  _inherits(Graphics3D, _Graphics2);

  function Graphics3D(canvas) {
    var _this2;

    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "g3d";

    _classCallCheck(this, Graphics3D);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Graphics3D).call(this, canvas));
    _this2.canvas = canvas;
    _this2.id = id;
    _this2.domObject = void 0;
    _this2.rootScene = void 0;
    _this2.renderer = void 0;
    _this2.lights = {};
    _this2.camera = void 0;
    _this2.lc = void 0;
    _this2.graphs = new Map();
    _this2.renderer = _this2.createWebGLRenderer();
    _this2.domObject = _this2.renderer.domElement; //Attach dom object

    _this2.domObject.id = id; //Create scene

    _this2.rootScene = new THREE.Scene(); //Setup lighting

    var topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 0, 5);

    _this2.addLight("top", topLight);

    var botLight = new THREE.DirectionalLight(0xffffff, 0.5);
    botLight.position.set(0, 0, -5);

    _this2.addLight("bot", botLight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    _this2.addLight("ambient", ambientLight); //Setup camera


    _this2.camera = _this2.createPerspectiveCamera(); //Setup locator for cooridnate transformation

    _this2.lc = new _locator.Locator();
    return _this2;
  }

  _createClass(Graphics3D, [{
    key: "addLight",
    value: function addLight(name, light) {
      this.lights[name] = light;
      this.rootScene.add(light);
    }
  }, {
    key: "removeLight",
    value: function removeLight(name) {
      this.rootScene.remove(this.lights[name]);
      delete this.lights[name];
    }
  }, {
    key: "createWebGLRenderer",
    value: function createWebGLRenderer() {
      var renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(this.width, this.height);
      return renderer;
    }
  }, {
    key: "createPerspectiveCamera",
    value: function createPerspectiveCamera() {
      var aspect = this.width / this.height;
      var camera = new THREE.PerspectiveCamera(75, aspect, 0.01, 500);
      camera.position.y = -5;
      camera.lookAt(0, 0, 0);
      camera.up.set(0, 0, 1);
      return camera;
    }
    /**
     * Adds a dataset to the current list of datasets to this and all the synchronized targets
     * @param dataset the dataset to be added, it has to have an id
     * @param synchronize Whether the operation should be synchronized with the sync targets
     * @returns the Graph object created that contains the dataset
     */

  }, {
    key: "addDataset",
    value: function addDataset(dataset, color, material) {
      var synchronize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      if (synchronize) {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
          for (var _iterator6 = this.syncTargets[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var graphics = _step6.value;
            graphics[1].addDataset(dataset, color, material, false);
          }
        } catch (err) {
          _didIteratorError6 = true;
          _iteratorError6 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
              _iterator6["return"]();
            }
          } finally {
            if (_didIteratorError6) {
              throw _iteratorError6;
            }
          }
        }
      }

      if (dataset.id != undefined) {
        var _graph2 = new _graph3.THREEGraph(dataset, this, color, material);

        this.addGraph(_graph2, false);
        return _graph2;
      } else throw new Error("Failed to add dataset, the id of " + dataset + " is not defined");
    }
  }, {
    key: "addGraph",
    value: function addGraph(graph) {
      var synchronize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (synchronize) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = this.syncTargets[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var item = _step7.value;
            item[1].addGraph(graph, false);
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }

      this.graphs.set(graph.id, graph);
      this.rootScene.add(graph.THREEObject);
    }
  }, {
    key: "render",
    value: function render() {
      this.renderer.render(this.rootScene, this.camera);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      this.width = this.canvas.offsetWidth;
      this.height = this.canvas.offsetHeight;
      this.renderer.setSize(this.width, this.height);

      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
      }

      if (this.camera instanceof THREE.OrthographicCamera) this.camera.updateProjectionMatrix();
      this.renderer.render(this.rootScene, this.camera);
    }
  }]);

  return Graphics3D;
}(Graphics);

exports.Graphics3D = Graphics3D;
//# sourceMappingURL=graphics.js.map
