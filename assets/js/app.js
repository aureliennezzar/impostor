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


	const Player = function(name, victory = 0, alive = true) {
		this.name = name;
		this.victory = victory;
		this.alive = alive
	}

	const Card = function(role, word, player = {}) {
		this.role = role;
		this.word = word;
		this.player = player;
		
	}

	var game = {
		board: document.querySelector('.board'),
		nbPlayers: 3,
		nbImpostor: 1,
		nbWhite: 0,
		playerList: [],
		cardList:[],
		init: function () {
			game.getWords();
			// game.fillBoard();
			game.generateCards()
		},
		getWords: function () {
			game.words = {goodWord: 'salut', badWord:'aurevoir'};
		},
		createPlayer: function (name, role, word) {
			game.playerList.push(new Player(name, role, word));
		},
		fillBoard: function () {
			for (let j = 0; j < game.nbPlayers; j++) {
				game.board.innerHTML += `<div class='Card'>Joueur ${j}</div>`;
			}

		},
		generateCards: function(){
			let nbCitizens = game.nbImpostor + game.nbWhite
			console.log(nbCitizens)
			for (let i = 0; i < game.nbImpostor; i++) game.cardList.push(new Card(1,game.words.badWord))
			for (let i = 0; i < game.nbWhite; i++) game.cardList.push(new Card(2,''))
			for (let i = 0; i < game.nbPlayers - nbCitizens ; i++) game.cardList.push(new Card(0,game.words.goodWord))

		}

	}
	app.init()
	game.init()
	console.log(game.cardList)
})