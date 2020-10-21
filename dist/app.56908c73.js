// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"assets/js/app.js":[function(require,module,exports) {
document.addEventListener('DOMContentLoaded', function () {
  var app = {
    amountPlayers: function amountPlayers(player) {
      return game.nbPlayers = player;
    },
    init: function init() {
      app.helloworld;
    },
    helloworld: console.log("Impostor is running!")
  };

  var Player = function Player(name) {
    var victory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var alive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    this.name = name;
    this.victory = victory;
    this.alive = alive;
  };

  var Card = function Card(role, word) {
    this.role = role;
    this.word = word;
  };

  var game = {
    board: document.querySelector('.board'),
    modal: document.querySelector('.modal'),
    modalForm: document.querySelector('.modal-content-form'),
    modalInfos: document.querySelector('.modal-content-infos'),
    modalTitle: document.querySelector('.modal-title'),
    modalRole: document.querySelector('.modal-role'),
    modalBtn: document.querySelector('.modal-btn'),
    formBtn: document.querySelector('.form-btn'),
    formInput: document.querySelector('.form-input'),
    overlayActive: true,
    nbPlayers: 10,
    nbImpostor: 2,
    nbWhite: 1,
    activePlayer: 0,
    playerList: [],
    cardList: [],
    init: function init() {
      game.getWords();
      game.generateCards();
      game.fillBoard();
      game.chooseCard();
    },
    handleModal: function handleModal(e) {
      e.preventDefault();

      if (e.target === game.modal && game.overlayActive) {
        game.activePlayer--;
        game.formInput.value = "";
        game.closeModal();
        window.removeEventListener('click', game.handleModal);
      } else if (e.target === game.formBtn) {
        var key = game.cardClicked.getAttribute("data-key");
        var _card = game.cardList[key];
        var playerName = game.formInput.value;

        if (playerName != "") {
          game.cardClicked.classList.remove('active');
          _card.player = new Player(playerName);
          game.playerList.push(_card.player);
          game.updateModal(_card.word, playerName);
          game.formInput.value = "";
          game.overlayActive = false;
        }
      } else if (e.target === game.modalBtn) {
        game.modalForm.style.display = "flex";
        game.modalInfos.style.display = "none";
        game.overlayActive = true;
        game.closeModal();
      }
    },
    updateModal: function updateModal(word, name) {
      game.modalForm.style.display = "none";
      game.modalInfos.style.display = "flex";

      if (word.length === 0) {
        game.modalRole.innerHTML = "Tu es Mr.s White";
        game.modalTitle.innerHTML = "".concat(name, ", tu n'as pas de mot secret");
      } else {
        game.modalRole.innerHTML = word;
        game.modalTitle.innerHTML = "".concat(name, ", votre mot est : ");
      }
    },
    closeModal: function closeModal() {
      game.modal.style.display = "none";
    },
    cardClick: function cardClick() {
      if (this.classList.value.indexOf('active') >= 0) {
        game.cardClicked = this;
        game.showModal();
        game.activePlayer++;
        if (game.activePlayer >= game.nbPlayers) game.removeListeners();
      }
    },
    showModal: function showModal() {
      game.modalTitle.innerHTML = "Joueur ".concat(game.activePlayer + 1);
      game.modal.style.display = 'flex';
      window.addEventListener('click', game.handleModal);
    },
    removeListeners: function removeListeners() {
      var cards = document.querySelectorAll('.board-card');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          card = _step.value;
          card.removeEventListener('click', game.cardClick);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    chooseCard: function chooseCard() {
      var cards = document.querySelectorAll('.board-card');
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          card = _step2.value;
          card.addEventListener('click', game.cardClick);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    },
    getWords: function getWords() {
      game.words = {
        goodWord: 'salut',
        badWord: 'aurevoir'
      };
    },
    createPlayer: function createPlayer(name, role, word) {
      game.playerList.push(new Player(name, role, word));
    },
    fillBoard: function fillBoard() {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = game.cardList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          card = _step3.value;
          game.board.innerHTML += card.element;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    },
    generateCards: function generateCards() {
      var nbImpostor = game.nbImpostor,
          nbWhite = game.nbWhite,
          cardList = game.cardList,
          words = game.words,
          nbPlayers = game.nbPlayers;
      var nbInfiltrators = nbImpostor + nbWhite;
      var infiltorsCount = 0;

      for (var i = 0; i < nbPlayers; i++) {
        if (i < nbInfiltrators) {
          if (infiltorsCount < nbImpostor) {
            cardList.push(new Card('impostor', words.badWord));
          } else {
            cardList.push(new Card('mr.white', ''));
          }

          infiltorsCount++;
        } else {
          cardList.push(new Card('citizen', words.goodWord));
        }
      }

      cardList.sort(function () {
        return Math.random() - 0.5;
      });

      for (var _i = 0; _i < cardList.length; _i++) {
        var _cardList$_i = cardList[_i],
            role = _cardList$_i.role,
            word = _cardList$_i.word;
        cardList[_i].key = _i;
        cardList[_i].element = "<div class=\"board-card active\" data-role=\"".concat(role, "\" data-word=\"").concat(word, "\" data-key=\"").concat(_i, "\"></div>");
      }
    }
  };
  app.init();
  game.init();
});
},{}],"../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54690" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/js/app.js"], null)
//# sourceMappingURL=/app.56908c73.js.map