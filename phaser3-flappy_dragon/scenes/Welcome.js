class Welcome extends Phaser.Scene {


    constructor(){
        super({
            key: 'Welcome',
            //Alteração da configuracao do jogo para essa cena para acessarmos os elementos html da pagina
            backgroundColor: '#000',
        });
    }

    init(data){
        this.game = data.game;
    }


    preload(){
        this.load.html("form", "aux/form.html");
    }


    create(){

        this.message = this.add.text(200, 200, "Hello, --", {
            color: "#FFFFFF",
            fontSize: 40,
            fontStyle: "bold"
        }).setOrigin(0.5);

        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        //this.add.dom(100,100).createFromHTML('<h1>Teste</h1>');
        //this.nameInput = this.add.dom(100, 100).createFromCache("form");
        //var html = '<div id="input-form"><input type="text" name="name" placeholder="Full Name" /></div>';
        //this.nameInput = this.add.dom(100, 100).createFromHTML(html);
        const element = this.add.dom(100, 100).createFromCache('form');
        //var elem = this.add.dom("input");
        //elem.id ='teste';
        //var data = this.cache.html.get('form');

        this.returnKey.on("down", event => {
            let name = this.nameInput.getChildByName("name");
            if(name.value != "") {
                this.message.setText("Hello, " + name.value);
                name.value = "";
            }
        });
    }


    update(){
        if (this.returnKey.isDown){
            this.scene.start('FlappyDragon', {gameGravity: config.physics.arcade.gravity.y, 
                gameWidth: config.width, gameHeight: config.height,
                score: score});
            return
        }
    }

}