var MenuInGame = {
	//ATRIBUTOS con inicializaciones por defecto
	pauseGameState : {
		posX: 0,
		posY: 0,
		playerHP: 0,
		invencible: false,
		timeRecover: 0,
	},
	_level: 'level_01',
	_sprite: 'player_01',

	//METODOS
	init: function (actualPlayer, actualLevel, gameState){
		//Mensajes de depuración
		/*
		console.log('Pausa recibe los datos:\n');
		console.log('nivel= '+actualLevel);
		console.log('sprite= '+actualPlayer);
		console.log('posX= '+gameState.posX);
		console.log('posY= '+gameState.posY);
		console.log('playerHP= '+gameState.playerHP);
		console.log('llaves= '+gameState.keyCount);*/

		//Almacenamos los datos recibidos
		this._level = actualLevel;
		this._sprite = actualPlayer;
		this.pauseGameState.posX = gameState.posX;
		this.pauseGameState.posY = gameState.posY;
		this.pauseGameState.playerHP = gameState.playerHP;
		this.pauseGameState.invincible = gameState.invincible;
		this.pauseGameState.timeRecover = gameState.timeRecover;

		//MENSAJES DEPURACION
		/*
		console.log('Pausa ha almacenado:\n');
		console.log('nivel= '+this._level);
		console.log('sprite= '+this._sprite);
		console.log('posX= '+this.pauseGameState.posX);
		console.log('posY= '+this.pauseGameState.posY);
		console.log('playerHP= '+this.pauseGameState.playerHP);
		console.log('invincible= '+this.pauseGameState.invincible);
		*/
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

        var button2 = this.game.add.button(this.game.world.centerX, 
                                               370, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        button2.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "RESET");
        text2.font = 'Sniglet';
        text2.anchor.set(0.5);
        button2.addChild(text2);

        var button3 = this.game.add.button(this.game.world.centerX, 
                                               440, 
                                               'button', 
                                               this.actionOnClick3, 
                                               this, 2, 1, 0);
        button3.anchor.set(0.5);
        var text3 = this.game.add.text(0, 0, "EXIT");
        text3.font = 'Sniglet';
        text3.anchor.set(0.5);
        button3.addChild(text3);
    },
    
    actionOnClick: function(){
    	console.log('Boton RESUME pulsado');
    	this.game.state.start('play', true, false, this._sprite, this._level, this.pauseGameState, true);
        //this.game.state.resume('play', true, false, this._sprite, this._level, this.pauseGameState, true);
    },

    actionOnClick2: function(){
    	console.log('Boton RESET pulsado');
    	this.game.state.start('play', true, false, this._sprite, this._level, this.pauseGameState, false);
        //this.game.state.resume('play', true, false, this._sprite, this._level, this.pauseGameState, true);
    },

    actionOnClick3: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    },
};

module.exports = MenuInGame;