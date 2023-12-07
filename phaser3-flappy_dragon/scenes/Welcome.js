class Welcome extends Phaser.Scene {


    constructor(){
        super({
            key: 'Welcome',
            //Alteração da configuracao do jogo para essa cena para acessarmos os elementos html da pagina
            backgroundColor: '#000',
        });
    }


    preload(){
        this.load.html("form", "aux/form.html");
        this.load.image("play", "img/play_bt.png")
    }


    create(){

        this.cursors = this.input.keyboard.createCursorKeys();
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.nameFilled = false;
        var text = {height: 20, padding: 15, content: "Hello --"}

        this.message = this.add.text(
            this.game.config.width/2, 
            this.game.config.height/2 - text.padding*2 - text.height,
            text.content, {
                color: "#FFFFFF",
                fontSize: 40,
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        
        //var html = '<input type="text" name="name" placeholder="Your name" />';
        //this.nameInput = this.add.dom(300, 200).createFromHTML(html).setOrigin(0,0);
        var inputSize = {width: 270, height: 42, padding: 15}; //input size including margins and paddings    
        var inputButton = {width: 30, height: 12};
        var inputCoords = {
            xposition: (this.game.config.width-inputSize.width)/2 - inputButton.width,
            yposition: (this.game.config.height-inputSize.height-inputSize.padding*2)/2,
        };  

       this.inputName = this.add.dom(inputCoords.xposition, inputCoords.yposition).createFromCache('form').setOrigin(0,0);
        
       const nameOkTextButton = this.add.text(
            inputCoords.xposition + inputSize.width + 13, 
            //padding desse elemento + aproximadamente 3 pixels do caracter ">" utilizado no tamanho de fonte escolhido
            inputCoords.yposition + inputButton.height + 2, ">", 
            {backgroundColor: "#8ecbf4", fontSize: 18, padding: 10}
        )
        nameOkTextButton.setInteractive();
        
        this.returnKey.on("down", event => {
            this.updateName(this.inputName);
        });

        nameOkTextButton.on('pointerdown', () => {
            this.updateName(this.inputName);
        })

        this.playBt = this.add.image(this.game.config.width/2-50, this.game.config.height/4*3,'play')
                              .setScale(.2).setOrigin(0,0).setInteractive().setVisible(false);
        
        this.playBt.on('pointerdown', function() {
            if(this.nameFilled){
                this.game.highScore = 0
                this.scene.start('FlappyDragon', this.game);
            }
        }, this);
    }


    update(){
        return
    }


    updateName(inputNameElement){
        let name = inputNameElement.getChildByName("name");
            if(name.value != "") {
                this.message.setText("Hello " + name.value);
                this.playBt.setVisible(true);
                this.nameFilled = true;
                this.game.name = name.value;
            }
    }
}