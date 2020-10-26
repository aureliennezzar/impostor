document.addEventListener('DOMContentLoaded', function () {
	var app = {
		boardWrapper: document.querySelector('.board-wrapper'),
		slider: document.querySelector('.playerSlider'),
		sliderLabel: document.querySelector('.slider-label'),
		civiliansDisplay: document.querySelector('.game-infos-civil'),
		impostorDisplay: document.querySelector('.game-infos-impostor .game-infos-text'),
		mrWhiteDisplay: document.querySelector('.game-infos-mrwhite .game-infos-text'),
		//Minus Add btns
		addImpostor: document.querySelector('.game-infos-impostor .add'),
		minusImpostor: document.querySelector('.game-infos-impostor .minus'),
		addWhite: document.querySelector('.game-infos-mrwhite .add'),
		minusWhite: document.querySelector('.game-infos-mrwhite .minus'),
		buttons: document.querySelectorAll('.game-infos-item button'),
		addButtons: document.querySelectorAll('.game-infos-item button.add'),
		minusButtons: document.querySelectorAll('.game-infos-item button.minus'),

		startBtn: document.querySelector('.btn-start'),
		nbPlayers: 5,
		nbImpostor: 1,
		nbWhite: 1,
		nbInfiltrators: 2,
		nbCitizens: 3,
		maxImpostors: 2,
		maxInfiltrators: 2,

		init: function () {
			console.log(`%c
    _   _            _____                          _                
   | | | |          |_   _|                        | |               
   | |_| |__   ___    | | _ __ ___  _ __   ___  ___| |_ ___  _ __    
   | __| '_ \\ / _ \\   | || '_ \` _ \\| '_ \\ / _ \\/ __| __/ _ \\| '__|   
   | |_| | | |  __/  _| || | | | | | |_) | (_) \\__ \\ || (_) | |      
    \\__|_| |_|\\___|  \\___/_| |_| |_| .__/ \\___/|___/\\__\\___/|_|      
   								   | |                               
								   |_|                               
									                                 `, "background:#1D7D8F;color:#fff;");
			console.log("%cCreated by Aurélien Tallet & Aurélien NEZZAR.", "color:red;")

			app.handleSlider();
			app.handleBtns();
		},
		startGame: function () {
			document.body.classList.add('startgame')
			game.nbPlayers = app.nbPlayers
			game.nbImpostor = app.nbImpostor
			game.nbWhite = app.nbWhite
			game.nbInfiltrators = app.nbInfiltrators
			game.nbCitizens = app.nbCitizens
			game.init()
		},
		handleBtns: function () {
			//Start btn
			app.startBtn.addEventListener('click', app.startGame)
			//ADD
			app.addImpostor.addEventListener('click', function () {
				app.addRole(0)
			})
			app.addWhite.addEventListener('click', function () {
				app.addRole(1)
			})
			//MINUS
			app.minusImpostor.addEventListener('click', function () {
				app.minusRole(0)
			})
			app.minusWhite.addEventListener('click', function () {
				app.minusRole(1)
			})
		},
		addRole: function (type) {
			type
				? app.nbWhite++
				: app.nbImpostor++
			app.nbInfiltrators++
			app.nbCitizens--
			app.updateInfos()
		},
		minusRole: function (type) {
			type
				? app.nbWhite--
				: app.nbImpostor--
			app.nbInfiltrators--
			app.nbCitizens++
			app.updateInfos()

		},
		updateInfos: function () {
			app.sliderLabel.innerHTML = 'Joueurs : ' + app.nbPlayers
			app.civiliansDisplay.innerHTML = app.nbCitizens + ' Civils'
			app.impostorDisplay.innerHTML = app.nbImpostor + ' Imposteurs'
			app.mrWhiteDisplay.innerHTML = app.nbWhite + ' Mr.White'
			//RESET BTNS
			for (btn of app.buttons) {
				btn.style.display = "block"
			}

			//CONDITIONS
			if (app.nbInfiltrators === app.maxInfiltrators) {
				for (btn of app.addButtons) {
					btn.style.display = "none"
				}
			}
			if (app.nbInfiltrators === 1) {
				for (btn of app.minusButtons) {
					btn.style.display = "none"
				}
			}
			if (app.nbImpostor === app.maxImpostors) app.addImpostor.style.display = "none";
			if (!app.nbImpostor) app.minusImpostor.style.display = "none";
			if (!app.nbWhite) app.minusWhite.style.display = "none";
		},
		handleSlider: function () {
			app.updateInfos()
			app.slider.addEventListener('input', function () {
				app.nbPlayers = this.value
				app.nbImpostor = 0
				app.nbWhite = 0
				app.maxImpostors = 0
				app.maxInfiltrators = Math.floor(app.nbPlayers / 2)
				this.value % 2 === 0
					? app.maxImpostors += app.maxInfiltrators - 1
					: app.maxImpostors += app.maxInfiltrators
				let increaseInterval = 2

				let wCount = 0;
				iCount = 0;
				for (let i = 4; i <= 20; i += 2) {
					!increaseInterval ? wCount++ : iCount++
					if (app.nbPlayers >= i - 1 && app.nbPlayers <= i) {
						app.nbWhite = wCount;
						app.nbImpostor = iCount;
						app.nbInfiltrators = iCount + wCount
						app.nbCitizens = app.nbPlayers - app.nbInfiltrators
					};
					increaseInterval++
					if (increaseInterval > 2) increaseInterval = 0
				}
				app.updateInfos()
			})
		},
	}
	app.init()


	const Player = function (name, alive = true) {
		this.name = name;
		this.alive = alive;
	}

	const Card = function (role, word) {
		this.role = role;
		this.word = word;
	}

	var game = {
		// ---------INITIALISATION---------

		//Elements init
		board: document.querySelector('.board'),
		boardWrapper: document.querySelector('.board-wrapper'),
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
		leaveBtn: document.querySelector('.header-leave'),


		//Variables init
		playerChosing: false,
		inGame: false,
		newPlayers: true,
		seeCard: false,
		overlayActive: true,
		activePlayer: 0,
		nbPlayers: app.nbPlayers,
		nbImpostor: app.nbImpostor,
		nbWhite: app.nbWhite,
		nbInfiltrators: app.nbInfiltrators,
		nbCitizens: app.nbCitizens,
		playerList: [],
		cardList: [],

		init: function () {
			game.getWords();
			game.generateCards();
			game.fillBoard();
			game.initCardsListeners();
			game.handleBtns();
		},

		// ---------MODALS HANDLE---------

		handleModal: function (e) {
			e.preventDefault()
			if (e.target === game.modal && game.overlayActive && !game.playerChosing) {
				//PLAYER CLICK OVERLAY
				game.activePlayer--;
				game.formInput.value = "";
				game.closeModal();
				window.removeEventListener('click', game.handleModal)
			} else if (e.target === game.formBtn) {
				//PLAYER CHOSE CARD
				game.attribCard();
			} else if (e.target === game.modalBtn && !game.inGame) {
				//PLAYER CLICK CONTINUE
				game.closeModal()
				if (game.activePlayer >= game.nbPlayers) {
					game.startRound();
				} else if (!game.newPlayers && !game.playerChosing) {
					game.playerModal()
				}
			} else if (e.target === game.modalBtn) {
				game.closeModal();
			}
		},
		updateModal: function (main, title) {

			//Reset modal elements
			game.modalInfos.style.display = "flex"
			game.modalForm.style.display = "none"

			if (game.inGame || (!game.newPlayers && !game.playerChosing)) {
				//If all players already chose a card, display directly main & title
				game.modalTitle.innerHTML = title;
				game.modalRole.innerHTML = main;
			} else {
				//Else update modal to show the role/word
				if (main.length === 0) {
					game.modalRole.innerHTML = "Tu es Mr.s White"
					game.modalTitle.innerHTML = `${title}, tu n'as pas de mot secret`
				} else {
					game.modalRole.innerHTML = main
					game.modalTitle.innerHTML = `${title}, votre mot est : `
				}
			}
		},
		closeModal: function () {
			//Reset then close modal (display none)
			game.modalForm.style.display = "flex"
			game.modalInfos.style.display = "none"
			game.overlayActive = true
			game.modal.style.display = "none"
		},

		showModal: function () {
			//Show modal (display flex)
			if (!game.inGame && game.newPlayers) {
				//If not all players chose there cards and its a new game, display the n°Player that have to choose card
				game.modalTitle.innerHTML = `Joueur ${game.activePlayer + 1}`
			}
			game.modal.style.display = 'flex'
			window.addEventListener('click', game.handleModal)
		},

		playerModal: function () {
			//Show who need to choose a card (in case of new game with same players)
			game.updateModal(`Choisis une carte`, game.playerList[game.activePlayer]);
			game.playerChosing = true
			game.showModal();
		},

		// ---------CARDS HANDLE---------

		attribCard: function () {
			//Attribute a player to a card
			const key = game.cardClicked.getAttribute("data-key");
			const card = game.cardList[key];
			let playerName = "";

			//If new players set playername to the formInput value, otherwise its the next player in the list
			game.newPlayers
				? playerName += game.formInput.value
				: playerName += game.playerList[game.activePlayer]
			if (playerName.trim() != "") {
				//Player attribution
				game.cardClicked.classList.remove('active')
				game.cardClicked.classList.add('player')
				game.cardClicked.innerHTML += `<div class="content"> <p>${playerName[0]}</p></div>`
				game.cardClicked.innerHTML += `<p class="name">${playerName}</p>`
				card.player = new Player(playerName)
				game.updateModal(card.word, playerName, false);
				game.overlayActive = false

				//If new players push playername to playerlist, else existing player is no longer chosing a card
				if (game.newPlayers) {
					game.playerList.push(card.player.name)
					game.formInput.value = "";
				} else {
					game.playerChosing = false;
					game.showModal()
				}
			}
		},
		cardClick: function () {
			//When a player click on a card
			const cardClasses = this.classList.value
			if (cardClasses.indexOf('active') >= 0) {
				//If card is not already chosed
				game.cardClicked = this;
				if (!game.newPlayers) {
					game.attribCard()
				} else {
					game.showModal()
				}
				game.activePlayer++;
			} else if (game.seeCard && cardClasses.indexOf('eliminated') < 0) {
				game.displayWord(this.getAttribute("data-word"));
			} else if (game.inGame && cardClasses.indexOf('eliminated') < 0) {
				game.kickPlayer(this);
			}
		},

		displayWord: function (word) {
			//Display a word in alert popin
			alert(`Votre mot est : ${word}`)
			game.updateSeeMode();

		},


		initCardsListeners: function () {
			const cards = document.querySelectorAll('.board-card')
			for (card of cards) {
				card.addEventListener('click', game.cardClick)
			}
		},

		generateCards: function () {
			const { nbImpostor, cardList, words, nbPlayers } = game
			let infiltorsCount = 0
			for (let i = 0; i < nbPlayers; i++) {
				if (i < game.nbInfiltrators) {
					if (infiltorsCount < nbImpostor) {
						cardList.push(new Card('impostor', words.badWord))
					} else {
						cardList.push(new Card('mr.white', ''))
					}
					infiltorsCount++
				} else {
					cardList.push(new Card('citizen', words.goodWord))
				}
			}
			cardList.sort(() => Math.random() - 0.5);
			for (let i = 0; i < cardList.length; i++) {
				const { role, word } = cardList[i];
				cardList[i].key = i;
				cardList[i].element = `<div class="board-card active" data-role="${role}" data-word="${word}" data-key="${i}"></div>`
			}
		},

		// ---------GAME HANDLE---------
		startRound: function () {
			game.inGame = true;
			game.seeBtn.style.display = "block"
			let firstCard = this.cardList[Math.floor(Math.random() * this.cardList.length)]
			while (firstCard.role === "mr.white") {
				firstCard = this.cardList[Math.floor(Math.random() * this.cardList.length)]
			}
			game.updateModal(`${firstCard.player.name},commence`, "Décrivez votre mot");
			game.showModal();
		},

		leaveGame: function () {
			if (confirm('Quitter la partie ?')) {
				game.playerList = []
				game.cardList = []
				game.newPlayers = true
				game.playerChosing = false
				game.inGame = false
				game.newPlayers = true
				game.seeCard = false
				game.overlayActive = true
				game.activePlayer = 0
				game.board.innerHTML = "";
				document.body.classList.remove('startgame')
			}
		},

		restartGame: function () {
			game.seeBtn.style.display = "none"
			game.cardList = [];
			game.board.innerHTML = "";
			game.generateCards();
			game.fillBoard();
			game.initCardsListeners();
			game.activePlayer = 0;

			if (game.inGame) {
				game.newPlayers = false;
				game.playerModal()
			} else if (!game.newPlayers) {
				game.playerModal()
			} else {
				game.playerList = []
			}
			game.inGame = false;
		},


		restartbtn: function (force = 0) {
			if (confirm('Changer de mots ?\nLe tour en cours sera réinitialisé')) game.restartGame()
		},

		kickPlayer: function (el) {
			let cardIndex = parseInt(el.getAttribute("data-key"))
			const card = game.cardList[cardIndex]
			if (!confirm(`Eliminer ${card.player.name} ?`)) return
			el.classList.add('eliminated')
			card.player.alive = false
			if (card.role === "impostor" || card.role === "mr.white") {
				game.nbInfiltrators--
			} else {
				game.nbCitizens--
			}
			let found = game.cardList[cardIndex + 1] || game.cardList[0];
			while (!found.player.alive) {
				cardIndex++
				found = game.cardList[cardIndex + 1]
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
				game.updateModal(card.player.name, `Un ${card.role} à été éliminé !`);
				game.showModal();
			}
		},

		getWords: function () {
			game.words = { goodWord: 'salut', badWord: 'aurevoir' };
		},

		fillBoard: function () {
			for (card of game.cardList) {
				game.board.innerHTML += card.element
			}

		},

		// ---------OTHER STUFF---------
		removeListeners: function () {
			const cards = document.querySelectorAll('.board-card')
			for (card of cards) {
				card.removeEventListener('click', game.cardClick)
			}

			game.leaveBtn.removeEventListener("click", game.leaveGame)
			game.resetBtn.removeEventListener("click", game.restartbtn)
		},
		updateSeeMode: function () {
			game.seeCard = !game.seeCard
			if (game.seeCard) {
				game.boardWrapper.classList.add('watching')
			} else {
				game.boardWrapper.classList.remove('watching')

			}
		},
		handleBtns: function () {
			game.leaveBtn.addEventListener("click", game.leaveGame)
			game.seeBtn.addEventListener("click", game.updateSeeMode)
			game.resetBtn.addEventListener("click", game.restartbtn)
		},
	}
})