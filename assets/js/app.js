document.addEventListener('DOMContentLoaded', function () {
	var app = {
		amountPlayers: function (player) {
			return game.nbPlayers = player
		},

		init: function () {
			app.helloworld;
		},
		helloworld: console.log("Impostor is running!")
	}


	const Player = function (name, victory = 0, alive = true) {
		this.name = name;
		this.victory = victory;
		this.alive = alive;
	}

	const Card = function (role, word) {
		this.role = role;
		this.word = word;
	}

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
		seeBtn: document.querySelector('.footer-see'),
		resetBtn: document.querySelector('.footer-reset'),
		inGame: false,
		newPlayers: true,
		seeCard: false,
		overlayActive: true,
		nbPlayers: 4,
		nbImpostor: 1,
		nbWhite: 0,
		nbInfiltrators: 1 + 0,
		nbCitizens: 4 - (1 + 0),
		activePlayer: 0,
		playerList: [],
		cardList: [],

		init: function () {
			game.getWords();
			game.generateCards();
			game.fillBoard();
			game.chooseCard();
			game.handleBtns();
		},

		//MODALS HANDLE
		handleModal: function (e) {
			e.preventDefault()
			if (e.target === game.modal && game.overlayActive) {
				//PLAYER CLICK OVERLAY
				game.activePlayer--;
				game.formInput.value = "";
				game.closeModal();
				window.removeEventListener('click', game.handleModal)
			} else if (e.target === game.formBtn) {
				//PLAYER CHOSE CARD
				const key = game.cardClicked.getAttribute("data-key");
				const card = game.cardList[key];
				let playerName = game.formInput.value;
				if (playerName.trim() != "") {
					game.cardClicked.classList.remove('active')
					game.cardClicked.classList.add('player')
					game.cardClicked.innerHTML += `<div class="content"> <p>${playerName[0]}</p></div>`
					game.cardClicked.innerHTML += `<p class="name">${playerName}</p>`
					card.player = new Player(playerName)
					game.playerList.push(card.player.name)
					game.updateModal(card.word, playerName, false);
					game.formInput.value = "";
					game.overlayActive = false
				}
			} else if (e.target === game.modalBtn && !game.inGame) {
				//PLAYER CLICK CONTINUE
				game.closeModal()
				if (game.activePlayer >= game.nbPlayers) {
					game.startRound();
				}
			} else if (e.target === game.modalBtn) {
				game.closeModal();
			}
		},
		updateModal: function (main, title) {
			game.modalInfos.style.display = "flex"
			game.modalForm.style.display = "none"
			if (game.inGame) {
				game.modalTitle.innerHTML = title;
				game.modalRole.innerHTML = main;
			} else {
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
			game.modalForm.style.display = "flex"
			game.modalInfos.style.display = "none"
			game.overlayActive = true
			game.modal.style.display = "none"
		},

		showModal: function () {
			!game.inGame && (game.modalTitle.innerHTML = `Joueur ${game.activePlayer + 1}`)
			game.modal.style.display = 'flex'
			window.addEventListener('click', game.handleModal)
		},

		// CARDS HANDLE
		cardClick: function () {
			const cardClasses = this.classList.value
			if (cardClasses.indexOf('active') >= 0) {
				game.cardClicked = this;
				game.showModal()
				game.activePlayer++;
			} else if (game.seeCard && cardClasses.indexOf('eliminated') < 0) {
				game.displayWord(this.getAttribute("data-word"));
			} else if (game.inGame && cardClasses.indexOf('eliminated') < 0) {
				game.kickPlayer(this);
			}
		},

		displayWord: function (word) {
			alert(`Votre mot est : ${word}`)
			game.updateSeeMode();

		},

		chooseCard: function () {
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

		//GAME HANDLE
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

		restartGame: function () {
			game.cardList = [];
			game.board.innerHTML = "";
			game.generateCards();
			game.fillBoard();
			game.chooseCard();
			game.inGame = false;
			if (game.inGame) {
				game.inGame = false;
				game.newPlayers = false;
			} else {
				game.playerList = [];
			}
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

		//OTHER STUFF
		removeListeners: function () {
			const cards = document.querySelectorAll('.board-card')
			for (card of cards) {
				card.removeEventListener('click', game.cardClick)
			}
		},
		updateSeeMode: function () {
			const activeCards = document.querySelectorAll('.board-card:not(.eliminated)')
			game.seeCard = !game.seeCard
			if (game.seeCard) {
				for (card of activeCards) {
					card.classList.add('watching')
				}
			} else {
				for (card of activeCards) {
					card.classList.remove('watching')
				}
			}
		},
		handleBtns: function () {
			game.seeBtn.addEventListener("click", game.updateSeeMode)
			game.resetBtn.addEventListener("click", function () {
				if (confirm('Changer de mots ?\nLe tour en cours sera réinitialisé')) game.restartGame()

			})
		},
	}
	app.init()
	game.init()
})