/**
 * ESCENA DEL NIVELL 1
 * Gestiona la lògica principal, el mapa, el jugador i la transició al Nivell 2.
 */
var GameScene = new Phaser.Scene('Game');

GameScene.preload = function () {
    // --- CÀRREGA DE RECURSOS (ASSETS) ---
    // Mapa i textures
    this.load.image('canyon_tiles', 'assets/tilesets/TilesetPaid-CanyonDesertPlatformer.png');
    this.load.tilemapTiledJSON('mapa_canyon', 'assets/maps/tiled_map.json');

    // Sprites del món
    this.load.image('gem', 'assets/sprites/gem.png');
    this.load.image('cactus1', 'assets/sprites/cactus1.png');
    this.load.image('background', 'assets/maps/fons.png');

    // Configuació del personatge: spritesheet per a les animacions
    this.load.spritesheet('cat', 'assets/sprites/spritesheet_definitiu.png', {
        frameWidth: 265,
        frameHeight: 265
    });

    // Música de fons
    this.load.audio('theme', 'assets/audio/the_cat.mp3');
};

GameScene.create = function () {
    // 1. CONFIGURACIÓ DEL FONS
    const bg = this.add.image(348, 290, 'background');
    bg.setDisplaySize(640 * 1.27, 640 * 1.27);
    bg.setDepth(-10); // Enviem el fons al darrere de tot

    // 2. CONSTRUCCIÓ DEL MAPA DES DE TILED
    var map = this.make.tilemap({ key: 'mapa_canyon' });
    var tileset = map.addTilesetImage('TilesetPaid-CanyonDesertPlatformer', 'canyon_tiles');

    // Creació de les capes visuals segons els noms definits al programa Tiled
    map.createLayer('cactus explosius', tileset);
    var platforms = map.createLayer('platforms', tileset);
    map.createLayer('decoració', tileset);
    map.createLayer('decoracio 2', tileset);

    // Ajustem els límits físics del món a la mida total del mapa
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // --- SISTEMA DE COL·LISIONS PER OBJECTES ---
    // Creem un grup estàtic per a col·lisions a les pataformes definides com a objecte a Tiled
    this.platformColliders = this.physics.add.staticGroup();

    // Importem els rectangles de la capa d'objectes "Platforms" de Tiled
    const platformObjectLayer = map.getObjectLayer('Platforms');

    if (platformObjectLayer) {
        platformObjectLayer.objects.forEach(obj => {
            // Calculem el centre de l'objecte (Phaser posiciona des del centre, Tiled des de la cantonada)
            const plat = this.platformColliders.create(obj.x + (obj.width / 2), obj.y + (obj.height / 2), null);
            // Ajustem la caixa física a la mida exacta del rectangle dibuixat
            plat.body.setSize(obj.width, obj.height);
            plat.setDisplaySize(obj.width, obj.height);
            plat.setVisible(false); // La col·lisió és invisible, ja veiem el dibuix a la capa de tiles
            plat.refreshBody(); // Refresquem el cos físic per aplicar els canvis de mida
        });
    }

    // 3. CONFIGURACIÓ DEL JUGADOR (MISTO)
    this.player = this.physics.add.sprite(50, 450, 'cat');
    this.player.setScale(0.15); // Escalat segons la mida del spritesheet
    this.player.setBounce(0.20); // Petit efecte de rebot en caure
    this.player.setCollideWorldBounds(true); // Evita que el gat surti de la pantalla
    this.player.setSize(160, 200); // Ajustem la caixa de col·lisió real del gat
    this.player.setOffset(50, 40); // Centrem la caixa sobre el dibuix del gat

    // Fem que el jugador xoqui amb les plataformes invisibles creades abans
    this.physics.add.collider(this.player, this.platformColliders);


    // 4. ENTRADA DE TECLAT
    this.cursors = this.input.keyboard.createCursorKeys();

    // 5. GESTIÓ DE LES GEMMES (PUNTS)
    this.gems = this.physics.add.group();
    
    // Generació automàtica de gemmes en dues files horitzontals
    for (let i = 0; i < 4; i++) {
        let gem = this.gems.create(10 + i * 90, 120, 'gem');
        gem.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
    for (let i = 0; i < 4; i++) {
        let gem = this.gems.create(50 + i * 90, 380, 'gem');
        gem.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    // Col·lisions i recollida
    this.physics.add.collider(this.gems, this.platformColliders);
    this.physics.add.overlap(this.player, this.gems, this.collectStar, null, this);

    // 6. CACTUS 
    // Nota: Actualment els cactus són decoració i la mort la gestiona la "Zona de Dany" (Punt 7).
    // Aquest grup es deixa preparat per si es volguessin afegir enemics amb moviment en el futur.
    // Actualment aquest grup no està en funcionament
    this.cactus = this.physics.add.group();

    // Establim que qualsevol objecte d'aquest grup ha de xocar amb el terra
    this.physics.add.collider(this.cactus, this.platformColliders);

    // 9. ZONES DE DANY (CACTUS)
    const danyLayer = map.getObjectLayer('dany');
    if (danyLayer) {
        this.danyGroup = this.physics.add.staticGroup();
        danyLayer.objects.forEach(obj => {
            const zone = this.danyGroup.create(obj.x + obj.width / 2, obj.y + obj.height / 2);
            zone.setSize(obj.width, obj.height);
            zone.setVisible(false);
            zone.refreshBody();
        });
        this.physics.add.overlap(this.player, this.danyGroup, this.hitDamage, null, this);
    }

    // 10. INTERFÀS D'USUARI 
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });// Afegim la puntuació gràficament a la pantalla
    this.scoreText.setScrollFactor(0); // El text no es mou quan la càmera es desplaça

    // 11. MÚSICA
    if (!this.sound.get('theme')) {
        this.bgMusic = this.sound.add('theme', { loop: true, volume: 0.3 });
        this.bgMusic.play();
    }

    // --- EFECTE DE PARTÍCULES (Tempesta de sorra) ---
    const particles = this.add.particles(0, 0, 'gem', {
        x: 560,
        y: { min: 400, max: 550 },
        speedX: { min: -400, max: -600 },
        scale: { start: 0.08, end: 0 },
        alpha: { start: 0.4, end: 0 },
        lifespan: 2000,
        quantity: 7,
        blendMode: 'ADD'
    });

    this.isGameOver = false;
};

/**
 * BUCLE D'ACTUALITZACIÓ (Update)
 * S'executa unes 60 vegades per segon per comprovar el moviment i l'estat.
 */
GameScene.update = function () {
    if (this.isGameOver) return; // Atura el moviment si el jugador ha mort

    // Moviment horitzontal
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    }
    else {
        this.player.setVelocityX(0);
        this.player.anims.play('turn');
    }

    // Moviment vertical (Salt): només si toca terra
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-330);
    }
};

// --- FUNCIONS DE LÒGICA DE JOC ---

/**
 * Recollida de gemmes i control de victòria per passar al Nivell 2
 */
GameScene.collectStar = function (player, gem) {
    gem.disableBody(true, true); // Elimina la gemma de la pantalla
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    // Condició per guanyar el nivell (8 gemmes)
    if (this.score >= 8) {
        this.physics.pause();
        this.add.text(320, 250, 'NIVELL 1 COMPLETAT!', {
            fontSize: '40px',
            fill: '#ffff00',
            backgroundColor: '#000000'
        }).setOrigin(0.5).setScrollFactor(0);

        this.time.delayedCall(2000, () => {
            // Enviem la puntuació actual al Nivell 2 com a paràmetre
            this.scene.start('Level2', { puntsAnteriors: this.score });
        });
    }
};

/**
 * Gestió de la mort del personatge
 */
GameScene.hitDamage = function (player, zone) {
    if (this.isGameOver) return;

    this.physics.pause();
    player.setTint(0xff0000); // Pintem el gat de vermell
    this.isGameOver = true;

    // Pausa d'un segon abans d'anar a l'escena de Game Over
    this.time.delayedCall(1000, () => {
        this.scene.start('GameOver', {
            finalScore: this.score,
            win: false
        });
    });
};