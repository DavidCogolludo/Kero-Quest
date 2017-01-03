var MenuInGame = {
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
        this.game.state.resume('play');
    }, 
};

module.exports = MenuInGame;