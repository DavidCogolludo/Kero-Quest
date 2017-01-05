var aux;
var EndLevel = {
    init: function (actualLevel){
      aux = actualLevel;
    },
    create: function () {
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
    
    actionOnClick: function(){
        this.game.state.start('menu');
    },
};

module.exports = EndLevel;

