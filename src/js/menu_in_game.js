var mute = false;
var MenuInGame = {
	//METODOS
	init: function (gameState, mus, mut){
		this.prevState = gameState;
    this.music = mus;
    if(mut)this.numFrame = 1;
    else this.numFrame = 0;
	},

    create: function () {
      this.game.stage.backgroundColor = "#4488AA";
      this.muteButn = this.game.add.button(this.game.world.centerX+150,300,'sound',this.muteOnCLick,this,this.numFrame,this.numFrame);
        var button = this.game.add.button(this.game.world.centerX, 
                                               250, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "RESUME");
        text.font = 'Sniglet';
        text.anchor.set(0.5);
        button.addChild(text);

        var button2 = this.game.add.button(this.game.world.centerX, 
                                               340, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        button2.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "RESET");
        text2.font = 'Sniglet';
        text2.anchor.set(0.5);
        button2.addChild(text2);

        var button3 = this.game.add.button(this.game.world.centerX, 
                                               430, 
                                               'button', 
                                               this.actionOnClick3, 
                                               this, 2, 1, 0);
        button3.anchor.set(0.5);
        var text3 = this.game.add.text(0, 0, "EXIT");
        text3.font = 'Sniglet';
        text3.anchor.set(0.5);
        button3.addChild(text3);
    },
    muteOnCLick: function(){
      if(mute){
        mute = false;
        this.music.mute = false;
        this.muteButn.setFrames(0);
      }
      else {
        mute = true;
        this.music.mute = true;
        this.muteButn.setFrames(1);
      }

    },
    actionOnClick: function(){
    	console.log('Boton RESUME pulsado');
    	this.game.state.start(this.prevState, true, false, mute,true);
        //this.game.state.resume('play', true, false, this._sprite, this._level, this.pauseGameState, true);
    },

    actionOnClick2: function(){
    	console.log('Boton RESET pulsado');
      this.music.destroy();
    	this.game.state.start(this.prevState, true, false, mute,false);
    },

    actionOnClick3: function(){
       this.music.destroy();
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    },
};

module.exports = MenuInGame;