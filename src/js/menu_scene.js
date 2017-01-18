var MenuScene = {
  perro: 98,
    create: function () {
        
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX-200, 
                                               this.game.world.centerY+200, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
         var buttonControls = this.game.add.button(this.game.world.centerX+200, 
                                               this.game.world.centerY+200, 
                                               'button', 
                                               this.actionOnClick2, 
                                               this, 2, 1, 0);
        buttonControls.anchor.set(0.5);
        var textControls = this.game.add.text(0, 0, "Controles");
        textControls.font = 'Sniglet';
        textControls.anchor.set(0.5);
        buttonControls.addChild(textControls);
    },
    
    actionOnClick: function(){
        this.game.state.start('preloader');
    },
    actionOnClick2: function(){
       this.game.world.setBounds(0,0,800,600);
       this.game.state.start('controls');
    },
};

module.exports = MenuScene;