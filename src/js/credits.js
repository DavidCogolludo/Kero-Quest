var aux;
var EndLevel = {
    init: function (actualLevel){
      aux = actualLevel;
    },
    create: function () {
       //SOUND---------------------------------------
      this.music = this.game.add.audio('menu_music');
      this.music.onDecoded.add(this.startMusic, this);
      //-----------------------------------------------
        console.log("Level Completed!");
        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'creditsBG');
        BG.anchor.setTo(0.5, 0.5);

        //TEXTOS
        var text = this.game.add.text(0, 0, "Return Menu");
        text.anchor.set(0.5);

        //BOTONES
        var button = this.game.add.button(430, 410, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        button.addChild(text);
    },
     startMusic: function(){
      this.music.fadeIn(2000,true);
    },
    actionOnClick: function(){
        this.music.destroy();
        this.game.state.start('menu');
    },
};

module.exports = EndLevel;

