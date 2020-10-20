document.addEventListener('DOMContentLoaded', function () {
	var app = {
		nbPlayers: 3,
		nbImp: 1,
		nbWhite: 0,
		init: function () {
			app.helloworld;
		},
		helloworld: console.log("Impostor is running!")
	}
	var game = {
		nbPlayers: app.nbPlayers,
		init: function () {
			app.helloworld;
		},
		handleBtns: function () {

		},
		helloworld: console.log("Impostor is running!")
	}
	app.init()
})