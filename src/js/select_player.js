var MenuScene = {
  player:'',
    create: function () {
        
        var p1 = this.game.add.sprite(this.game.world.centerX-32, 
                                        this.game.world.centerY, 
                                        'player_01');
        p1.anchor.setTo(0.5, 0.5);
        var p2 = this.game.add.sprite(this.game.world.centerX+32, 
                                        this.game.world.centerY, 
                                        'player_02');
        p2.anchor.setTo(0.5, 0.5);
        var buttonB = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY+80, 
                                               'button', 
                                               this.actionOnClickB, 
                                               this, 2, 1, 0);
        buttonB.anchor.set(0.5);
        var buttonO = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY+160, 
                                               'button', 
                                               this.actionOnClickO, 
                                               this, 2, 1, 0);
        buttonO.anchor.set(0.5);
        var textB = this.game.add.text(0, 0, "Blue");
        var textO = this.game.add.text(0, 0, "Orange");
        textB.font = 'Sniglet';
        textB.anchor.set(0.5);
        buttonB.addChild(textB);
        textO.font = 'Sniglet';
        textO.anchor.set(0.5);
        buttonO.addChild(textO);
    },
    
    actionOnClickB: function(){
      this.player= 'b';
        this.game.state.start('play');
    }, 
    actionOnClickO: function(){
      this.player = 'o';
        this.game.state.start('play');
    },
};

module.exports = MenuScene;