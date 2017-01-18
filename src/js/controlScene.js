var ControlScene = {
    create: function () {

        var BG = this.game.add.sprite(this.game.world.centerX, 
                                      this.game.world.centerY, 
                                      'controlesBG');
        BG.anchor.setTo(0.5, 0.5);
        var button = this.game.add.button(this.game.world.centerX, this.game.world.centerY+250, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var text = this.game.add.text(0, 0, "¡Buen Viaje!");
        text.anchor.set(0.5);
        button.addChild(text);
    },
    actionOnClick: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.stage.backgroundColor = '#000000';
       this.game.state.start('menu');
    }

};

module.exports = ControlScene;