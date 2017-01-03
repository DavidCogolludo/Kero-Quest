var MenuInGame = {
	//ATRIBUTOS con inicializaciones por defecto
	pauseGameState : {
		posX: 0,
		posY: 0,
		playerHP: 0,
		keyCount: 0
		//invencible
		//tiemporecover
	},
	_level: 'level_01',
	_sprite: 'player_01',

	//METODOS
	init: function (actualPlayer, actualLevel, gameState){
		//Mensajes de depuración
		console.log('Pausa recibe los datos:\n');
		console.log('nivel= '+actualLevel);
		console.log('sprite= '+actualPlayer);
		console.log('posX= '+gameState.posX);
		console.log('posY= '+gameState.posY);
		console.log('playerHP= '+gameState.playerHP);
		console.log('llaves= '+gameState.keyCount);

		//Almacenamos los datos recibidos
		this._level = actualLevel;
		this._sprite = actualPlayer;
		this.pauseGameState.posX = gameState.posX;
		this.pauseGameState.posY = gameState.posY;
		this.pauseGameState.playerHP = gameState.playerHP;
		this.pauseGameState.keyCount = gameState.keyCount;

		//MENSAJES DEPURACION
		console.log('Pausa ha almacenado:\n');
		console.log('nivel= '+this._level);
		console.log('sprite= '+this._sprite);
		console.log('posX= '+this.pauseGameState.posX);
		console.log('posY= '+this.pauseGameState.posY);
		console.log('playerHP= '+this.pauseGameState.playerHP);
		console.log('llaves= '+this.pauseGameState.keyCount);
		
	},

    create: function () {
        var button = this.game.add.button(this.game.world.centerX, 
                                               300, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "RESUME");
        text.font = 'Sniglet';
        text.anchor.set(0.5);
        button.addChild(text);
    },
    
    actionOnClick: function(){
    	console.log('Boton RESUME pulsado');
    	this.game.state.start('play', true, false, this._sprite, this._level, this.pauseGameState, true);
        //this.game.state.resume('play', true, false, this._sprite, this._level, this.pauseGameState, true);
    }, 
};

module.exports = MenuInGame;