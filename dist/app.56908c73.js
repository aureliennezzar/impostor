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
    slider: document.querySelector('.playerSlider'),
    sliderLabel: document.querySelector('.slider-label'),
    civiliansDisplay: document.querySelector('.game-infos-civil'),
    impostorDisplay: document.querySelector('.game-infos-impostor .game-infos-text'),
    mrWhiteDisplay: document.querySelector('.game-infos-mrwhite .game-infos-text'),
    nbPlayers: 5,
    nbImpostor: 1,
    nbWhite: 1,
    nbInfiltrators: 2,
    nbCivilians: 3,
    updateInfos: function updateInfos() {
      app.sliderLabel.innerHTML = 'Joueurs : ' + app.nbPlayers;
      app.civiliansDisplay.innerHTML = app.nbCivilians + ' Civils';
      app.impostorDisplay.innerHTML = app.nbImpostor + ' Imposteurs';
      app.mrWhiteDisplay.innerHTML = app.nbWhite + ' Mr.White';
    },
    handleSlider: function handleSlider() {
      app.updateInfos();
      app.slider.addEventListener('input', function () {
        app.nbPlayers = this.value;
        app.nbImpostor = 0;
        app.nbWhite = 0;
        var maxImpostors = 0;
        var maxInfiltrators = Math.floor(app.nbPlayers / 2);
        this.value % 2 === 0 ? maxImpostors += maxInfiltrators - 1 : maxImpostors += maxInfiltrators;
        var increaseInterval = 2;
        var wCount = 0;
        iCount = 0;

        for (var i = 4; i <= 20; i += 2) {
          !increaseInterval ? wCount++ : iCount++;

          if (app.nbPlayers >= i - 1 && app.nbPlayers <= i) {
            app.nbWhite = wCount;
            app.nbImpostor = iCount;
            console.log(wCount);
            app.nbInfiltrators = iCount + wCount;
            app.nbCivilians = app.nbPlayers - app.nbInfiltrators;
          }

          ;
          increaseInterval++;
          if (increaseInterval > 2) increaseInterval = 0;
        }

        app.updateInfos();
      });
    },
    init: function init() {
      app.handleSlider();
    }
  };
  app.init();

  var Player = function Player(name) {
    var alive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    this.name = name;
    this.alive = alive;
  };

  var Card = function Card(role, word) {
    this.role = role;
    this.word = word;
  };

  var game = {
    // ---------INITIALISATION---------
    //Elements init
    board: document.querySelector('.board'),
    modal: document.querySelector('.modal'),
    modalForm: document.querySelector('.modal-content-form'),
    modalInfos: document.querySelector('.modal-content-infos'),
    modalTitle: document.querySelector('.modal-title'),
    modalRole: document.querySelector('.modal-role'),
    modalBtn: document.querySelector('.modal-btn'),
    formBtn: document.querySelector('.form-btn'),
    formInput: document.querySelector('.form-input'),
    seeBtn: document.querySelector('.footer-see'),
    resetBtn: document.querySelector('.footer-reset'),
    //Variables init
    playerChosing: false,
    inGame: false,
    newPlayers: true,
    seeCard: false,
    overlayActive: true,
    nbPlayers: 3,
    nbImpostor: 1,
    nbWhite: 0,
    nbInfiltrators: 1 + 0,
    nbCitizens: 3 - (1 + 0),
    activePlayer: 0,
    playerList: [],
    cardList: [],
    init: function init() {
      game.getWords();
      game.generateCards();
      game.fillBoard();
      game.initCardsListeners();
      game.handleBtns();
    },
    // ---------MODALS HANDLE---------
    handleModal: function handleModal(e) {
      e.preventDefault();

      if (e.target === game.modal && game.overlayActive & !game.playerChosing) {
        //PLAYER CLICK OVERLAY
        game.activePlayer--;
        game.formInput.value = "";
        game.closeModal();
        window.removeEventListener('click', game.handleModal);
      } else if (e.target === game.formBtn) {
        //PLAYER CHOSE CARD
        game.attribCard();
      } else if (e.target === game.modalBtn && !game.inGame) {
        //PLAYER CLICK CONTINUE
        game.closeModal();

        if (game.activePlayer >= game.nbPlayers) {
          game.startRound();
        } else if (!game.newPlayers && !game.playerChosing) {
          game.playerModal();
        }
      } else if (e.target === game.modalBtn) {
        game.closeModal();
      }
    },
    updateModal: function updateModal(main, title) {
      //Reset modal elements
      game.modalInfos.style.display = "flex";
      game.modalForm.style.display = "none";

      if (game.inGame) {
        //If all players already chose a card, display directly main & title
        game.modalTitle.innerHTML = title;
        game.modalRole.innerHTML = main;
      } else if (!game.newPlayers && !game.playerChosing) {
        //Else if its a new game with same players and nobdy is chosing a card, display directly main & title
        game.modalTitle.innerHTML = title;
        game.modalRole.innerHTML = main;
      } else {
        //Else update modal to show the role/word
        if (main.length === 0) {
          game.modalRole.innerHTML = "Tu es Mr.s White";
          game.modalTitle.innerHTML = "".concat(title, ", tu n'as pas de mot secret");
        } else {
          game.modalRole.innerHTML = main;
          game.modalTitle.innerHTML = "".concat(title, ", votre mot est : ");
        }
      }
    },
    closeModal: function closeModal() {
      //Reset then close modal (display none)
      game.modalForm.style.display = "flex";
      game.modalInfos.style.display = "none";
      game.overlayActive = true;
      game.modal.style.display = "none";
    },
    showModal: function showModal() {
      //Show modal (display flex)
      if (!game.inGame && game.newPlayers) {
        //If not all players chose there cards and its a new game, display the n°Player that have to choose card
        game.modalTitle.innerHTML = "Joueur ".concat(game.activePlayer + 1);
      }

      game.modal.style.display = 'flex';
      window.addEventListener('click', game.handleModal);
    },
    playerModal: function playerModal() {
      //Show who need to choose a card (in case of new game with same players)
      game.updateModal("Choisis une carte", game.playerList[game.activePlayer]);
      game.playerChosing = true;
      game.showModal();
    },
    // ---------CARDS HANDLE---------
    attribCard: function attribCard() {
      //Attribute a player to a card
      var key = game.cardClicked.getAttribute("data-key");
      var card = game.cardList[key];
      var playerName = ""; //If new players set playername to the formInput value, otherwise its the next player in the list

      game.newPlayers ? playerName += game.formInput.value : playerName += game.playerList[game.activePlayer];

      if (playerName.trim() != "") {
        //Player attribution
        game.cardClicked.classList.remove('active');
        game.cardClicked.classList.add('player');
        game.cardClicked.innerHTML += "<div class=\"content\"> <p>".concat(playerName[0], "</p></div>");
        game.cardClicked.innerHTML += "<p class=\"name\">".concat(playerName, "</p>");
        card.player = new Player(playerName);
        game.updateModal(card.word, playerName, false);
        game.overlayActive = false; //If new players push playername to playerlist, else existing player is no longer chosing a card

        if (game.newPlayers) {
          game.playerList.push(card.player.name);
          game.formInput.value = "";
        } else {
          game.playerChosing = false;
          game.showModal();
        }
      }
    },
    cardClick: function cardClick() {
      //When a player click on a card
      var cardClasses = this.classList.value;

      if (cardClasses.indexOf('active') >= 0) {
        //If card is not already chosed
        game.cardClicked = this;

        if (!game.newPlayers) {
          game.attribCard();
        } else {
          game.showModal();
        }

        game.activePlayer++;
      } else if (game.seeCard && cardClasses.indexOf('eliminated') < 0) {
        game.displayWord(this.getAttribute("data-word"));
      } else if (game.inGame && cardClasses.indexOf('eliminated') < 0) {
        game.kickPlayer(this);
      }
    },
    displayWord: function displayWord(word) {
      //Display a word in alert popin
      alert("Votre mot est : ".concat(word));
      game.updateSeeMode();
    },
    initCardsListeners: function initCardsListeners() {
      var cards = document.querySelectorAll('.board-card');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          card = _step.value;
          card.addEventListener('click', game.cardClick);
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
    generateCards: function generateCards() {
      var nbImpostor = game.nbImpostor,
          cardList = game.cardList,
          words = game.words,
          nbPlayers = game.nbPlayers;
      var infiltorsCount = 0;

      for (var i = 0; i < nbPlayers; i++) {
        if (i < game.nbInfiltrators) {
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
    },
    // ---------GAME HANDLE---------
    startRound: function startRound() {
      game.inGame = true;
      game.seeBtn.style.display = "block";
      var firstCard = this.cardList[Math.floor(Math.random() * this.cardList.length)];

      while (firstCard.role === "mr.white") {
        firstCard = this.cardList[Math.floor(Math.random() * this.cardList.length)];
      }

      game.updateModal("".concat(firstCard.player.name, ",commence"), "Décrivez votre mot");
      game.showModal();
    },
    restartGame: function restartGame() {
      game.cardList = [];
      game.board.innerHTML = "";
      game.generateCards();
      game.fillBoard();
      game.initCardsListeners();
      game.activePlayer = 0;

      if (game.inGame) {
        game.newPlayers = false;
        game.playerModal();
      } else if (!game.newPlayers) {
        game.playerModal();
      } else {
        game.playerList = [];
      }

      game.inGame = false;
    },
    kickPlayer: function kickPlayer(el) {
      var cardIndex = parseInt(el.getAttribute("data-key"));
      var card = game.cardList[cardIndex];
      if (!confirm("Eliminer ".concat(card.player.name, " ?"))) return;
      el.classList.add('eliminated');
      card.player.alive = false;

      if (card.role === "impostor" || card.role === "mr.white") {
        game.nbInfiltrators--;
      } else {
        game.nbCitizens--;
      }

      var found = game.cardList[cardIndex + 1] || game.cardList[0];

      while (!found.player.alive) {
        cardIndex++;
        found = game.cardList[cardIndex + 1];
      }

      if (this.nbInfiltrators > this.nbCitizens) {
        alert('les inflitrés ont gagné');
        game.restartGame();
      } else if (this.nbInfiltrators === 1 && this.nbCitizens === 1) {
        alert('les inflitrés ont gagné');
        game.restartGame();
      } else if (this.nbInfiltrators === 0) {
        alert('les civils ont gagné');
        game.restartGame();
      } else {
        game.updateModal(card.player.name, "Un ".concat(card.role, " \xE0 \xE9t\xE9 \xE9limin\xE9 !"));
        game.showModal();
      }
    },
    getWords: function getWords() {
      game.words = {
        goodWord: 'salut',
        badWord: 'aurevoir'
      };
    },
    fillBoard: function fillBoard() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = game.cardList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          card = _step2.value;
          game.board.innerHTML += card.element;
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
    // ---------OTHER STUFF---------
    removeListeners: function removeListeners() {
      var cards = document.querySelectorAll('.board-card');
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = cards[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          card = _step3.value;
          card.removeEventListener('click', game.cardClick);
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
    updateSeeMode: function updateSeeMode() {
      var activeCards = document.querySelectorAll('.board-card:not(.eliminated)');
      game.seeCard = !game.seeCard;

      if (game.seeCard) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = activeCards[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            card = _step4.value;
            card.classList.add('watching');
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      } else {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = activeCards[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            card = _step5.value;
            card.classList.remove('watching');
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    },
    handleBtns: function handleBtns() {
      game.seeBtn.addEventListener("click", game.updateSeeMode);
      game.resetBtn.addEventListener("click", function () {
        if (confirm('Changer de mots ?\nLe tour en cours sera réinitialisé')) game.restartGame();
      });
    }
  }; // game.init()
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62954" + '/');

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