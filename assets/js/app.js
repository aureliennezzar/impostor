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
		overlayActive: true,
		nbPlayers: 10,
		nbImpostor: 2,
		nbWhite: 1,
		activePlayer: 0,
		playerList: [],
		cardList: [],

		init: function () {
			game.getWords();
			game.generateCards()
			game.fillBoard();
			game.chooseCard();
		},


		handleModal: function (e) {
			e.preventDefault()
			if (e.target === game.modal && game.overlayActive) {
				game.activePlayer--;
				game.formInput.value = "";
				game.closeModal();
				window.removeEventListener('click', game.handleModal)
			} else if (e.target === game.formBtn) {
				const key = game.cardClicked.getAttribute("data-key");
				const card = game.cardList[key];
				let playerName = game.formInput.value;
				if (playerName != "") {
					game.cardClicked.classList.remove('active')
					card.player = new Player(playerName)
					game.playerList.push(card.player)
					game.updateModal(card.word, playerName);
					game.formInput.value = "";
					game.overlayActive = false

				}
			} else if (e.target === game.modalBtn) {
				game.modalForm.style.display = "flex"
				game.modalInfos.style.display = "none"
				game.overlayActive = true
				game.closeModal()
			}
		},
		updateModal: function (word, name) {
			game.modalForm.style.display = "none"
			game.modalInfos.style.display = "flex"
			if (word.length === 0) {
				game.modalRole.innerHTML = "Tu es Mr.s White"
				game.modalTitle.innerHTML = `${name}, tu n'as pas de mot secret`
			} else {
				game.modalRole.innerHTML = word
				game.modalTitle.innerHTML = `${name}, votre mot est : `
			}
		},
		closeModal: function () {
			game.modal.style.display = "none"
		},

		cardClick: function () {
			if (this.classList.value.indexOf('active') >= 0) {
				game.cardClicked = this;
				game.showModal()
				game.activePlayer++;
				if (game.activePlayer >= game.nbPlayers) game.removeListeners();
			}
		},

		showModal: function () {
			game.modalTitle.innerHTML = `Joueur ${game.activePlayer + 1}`
			game.modal.style.display = 'flex'
			window.addEventListener('click', game.handleModal)

		},

		removeListeners: function () {
			const cards = document.querySelectorAll('.board-card')
			for (card of cards) {
				card.removeEventListener('click', game.cardClick)
			}
		},

		chooseCard: function () {
			const cards = document.querySelectorAll('.board-card')
			for (card of cards) {
				card.addEventListener('click', game.cardClick)
			}
		},

		getWords: function () {
			game.words = { goodWord: 'salut', badWord: 'aurevoir' };
		},

		createPlayer: function (name, role, word) {
			game.playerList.push(new Player(name, role, word));
		},

		fillBoard: function () {
			for (card of game.cardList) {
				game.board.innerHTML += card.element
			}

		},
		generateCards: function () {
			const { nbImpostor, nbWhite, cardList, words, nbPlayers } = game
			let nbInfiltrators = nbImpostor + nbWhite
			let infiltorsCount = 0
			for (let i = 0; i < nbPlayers; i++) {
				if (i < nbInfiltrators) {
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
		}

	}
	app.init()
	game.init()
})