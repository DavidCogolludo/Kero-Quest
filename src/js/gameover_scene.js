var aux;
var GameOver = {
    init: function (actualLevel){
      aux = actualLevel;
    },
    create: function () {
        console.log("Game Over");
        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'gameOverBG');
        BG.anchor.setTo(0.5, 0.5);
        var button = this.game.add.button(510, 330, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        //var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Level");
        var text2 = this.game.add.text(0, 0, "Return Menu");
        text.anchor.set(0.5);
        //goText.fill = '#43d637';
        //goText.anchor.set(0.5);
        text2.anchor.set(0.5);
        //goText.anchor.set(0.5);
        button.addChild(text);
       
        var button2 = this.game.add.button(510, 430, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        button2.addChild(text2);
    },
    
    actionOnClick: function(){
        this.game.state.start(aux, true, false, false);
    },
    actionOnClick2: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    }

};

module.exports = GameOver;

