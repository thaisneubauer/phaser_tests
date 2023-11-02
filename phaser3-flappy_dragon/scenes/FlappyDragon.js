class FlappyDragon extends Phaser.Scene {


    constructor(){
        super({
            key: 'FlappyDragon',
            // Se quisermos alterar alguma configuração do jogo para essa cena:
            /* physics:{
               arcade:{
                debug: false,
                gravity: { y: 500}
               } 
            } */
        });
    }


    init(data){
        this.gameGravity = data.gameGravity;
        this.gameWidth = data.gameWidth;
        this.gameHeight = data.gameHeight;

        this.cursors;

        // *** 1) FUNDO *****
        // A imagem do fundo possui 1200 de largura e 400 de altura.
        // Mas somente uma janela de 400x400 é exibida por vez.
        // Essa janela vai se alterando, simulando o movimento do fundo
        // As variáveis possibilitam o controle da janela em exibição
        this.bg = {
            x_start: 0,
            x: 0,
            y: 200,
            x_end: -800,
            obj: null
        };

        // *** 2) COLUNA *****
        //Os parâmetros speed e space podem ser alterados para deixar o jogo mais fácil ou mais difícil
        this.cols = {
            speed: 60, // velocidade com que as colunas passam, quanto maior, mais rápidamente passam
            space: 180, // vão entre as colunas por onde o dragão tem que passar, quanto maior mais espaço entre as colunas
            x: 500, // posição inicial à direita do canvas, quanto maior, mais tempo demora para a coluna aparecer
            min_x: 400,
            max_x: 800,
            y: -400, // posição inicial acima do canvas, quanto maior, mais para cima aparece a coluna inferior
            min_y: -500,
            max_y: -200,
            height: 600, // altura da imagem da coluna,
            width: 50,
            col1_obj: null,
            col2_obj: null
        };

        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        this.game = {
            over: false,
            current_col_scored: false,
            score: 0,
            restartText: null,
            restartMessage: 'Pressione SHIFT para reiniciar',
        }; 
    }


    preload ()
    {
        this.load.image('bg', 'img/fundo.png');
        //this.load.image('dragon1', 'img/dragao1.png');
        this.load.spritesheet('dragon', 'img/dragao.png', { frameWidth: this.player.width, frameHeight: this.player.height });
        this.load.image('col_bottom', 'img/coluna_bottom.png');
        this.load.image('col_upper', 'img/coluna_upper.png');
        this.load.image('game_over', 'img/gameover.png');
    }


    create ()
    {
        //Adiciona a imagem de fundo e a salva na chave "obj" da variável "bg"
        this.bg.obj = this.add.image(this.bg.x, this.bg.y, 'bg').setOrigin(0,0);


        //Adiciona imagens das colunas
        //cols_group = this.physics.add.group();
        //cols_group.create(cols.x, cols.y, 'col_upper').setOrigin(0,0);
        //cols_group.create(cols.x, cols.y + cols.height + cols.space, 'col_bottom').setOrigin(0,0);
        //cols_group.setVelocityX(-cols.speed);
        //cols_group.setVImmovable(true);
        //cols_group.allowGravity(false);

        this.cols.col1_obj = this.add.image(this.cols.x, this.cols.y, 'col_upper').setOrigin(0,0);
        this.cols.col2_obj = this.add.image(this.cols.x, this.cols.y + this.cols.height + this.cols.space, 'col_bottom').setOrigin(0,0);
        this.physics.add.existing(this.cols.col1_obj);
        this.physics.add.existing(this.cols.col2_obj);
        this.cols.col1_obj.body.allowGravity = false; 
        this.cols.col2_obj.body.allowGravity = false;
        this.cols.col1_obj.body.setVelocityX(-this.cols.speed); 
        this.cols.col2_obj.body.setVelocityX(-this.cols.speed); 


        //cols.col1_obj = this.physics.add.image(cols.x, cols.y, 'col_upper').setOrigin(0,0);
        //cols.col2_obj = this.physics.add.image(cols.x, cols.y + cols.height + cols.space, 'col_bottom').setOrigin(0,0);
        //Comentário sobre a não utilização das linhas acima:  
        //adicionando a imagem diretamente nos physics bagunça a localização dos limites de colisão das colunas

        //Adiciona jogador e suas propriedades físicas
        this.player.obj = this.physics.add.sprite(170, 130, 'dragon').setScale(.8);
        this.player.obj.body.setSize(50,80,true);
        this.player.obj.setCollideWorldBounds(true);


        //Adiciona animação da imagem do jogador
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        //Adiciona a animação do movimento do jogador
        this.player.obj.anims.play('fly');

        //Adiciona os cursores que movimentarão o jogador
        this.cursors = this.input.keyboard.createCursorKeys();

        //Adiciona os monitores de colisão
        this.physics.add.overlap(this.player.obj, this.cols.col1_obj, this.hitCol, null, this);
        this.physics.add.overlap(this.player.obj, this.cols.col2_obj, this.hitCol, null, this);

        //Mostrar o placar
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '20px', fill: '#000' });
        this.game.restartText = this.add.text(15, this.gameHeight/2+100, this.game.restartMessage, 
                                    { fontSize: '20px', fill: 'white', backgroundColor: 'black'});
        this.game.restartText.visible = false;
    }


    update ()
    {
        /*Controla se o jogo acabou e se a tecla que o reinicia foi acionada*/
        if (this.game.over){
            if (this.cursors.shift.isDown){
                this.game.over = false;
                this.game.score = 0;
                this.cols.x = - this.cols.width -1;
                this.scene.restart();
            }
            return 
        }
            
        /*Atualiza a posicao da imagem de fundo*/
        this.bg.x--;
        if (this.bg.x < this.bg.x_end){
            this.bg.x = this.bg.x_start;
        }
        this.bg.obj.x = this.bg.x;


        /*Atualiza posicao das colunas*/
        this.cols.x = this.cols.col1_obj.x
        if (this.cols.x < - this.cols.width){
            this.cols.x = Phaser.Math.FloatBetween(this.cols.min_x, this.cols.max_x); // sorteia o intervalo antes das próximas colunas
            this.cols.col1_obj.x = this.cols.x
            this.cols.col2_obj.x = this.cols.x

            this.cols.y = Phaser.Math.FloatBetween(this.cols.min_y, this.cols.max_y); // sorteia a posição vertical
            this.cols.col1_obj.y = this.cols.y;
            this.cols.col2_obj.y = this.cols.y + this.cols.height + this.cols.space;

            this.game.current_col_scored = false;
        }

        /*Inclui controle de movimentação do dragao*/
        if (this.cursors.left.isDown)
        this.player.obj.setX(this.player.obj.x-5);
        else if (this.cursors.right.isDown)
        this.player.obj.setX(this.player.obj.x+5);
        else if (this.cursors.up.isDown)
        this.player.obj.setY(this.player.obj.y-this.gameGravity);
        else if (this.cursors.down.isDown)
        this.player.obj.setY(this.player.obj.y+this.gameGravity);


        /*Verifica se o jogador passou pelas colunas*/
        if (!this.game.current_col_scored){
            if (this.player.obj.x - this.player.width/2 > this.cols.x + this.cols.width){
                this.game.score++;
                this.game.current_col_scored = true;
                this.scoreText.setText('score: ' + this.game.score);
            }
        }
    }


    hitCol(player_obj, col_obj){
        this.physics.pause();
        this.player.obj.anims.stop('fly');
        this.player.obj.setTint(0xff0000);
        this.game.over = true;
        this.add.image(this.gameWidth/2, this.gameHeight/2, 'game_over').setScale(.5);
        this.game.restartText.visible = true;
    }

}