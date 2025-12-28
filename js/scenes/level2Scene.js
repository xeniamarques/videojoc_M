/**
 * ESCENA DEL NIVELL 2
 * Aquest nivell hereta la puntuació del nivell anterior
 */
var Level2Scene = new Phaser.Scene('Level2');

/**
 * MÈTODE INIT
 * S'executa abans que el preload i serveix per rebre dades d'altres escenes.
 */
Level2Scene.init = function (data) {
    // Recuperem la puntuació del Nivell 1. Si no n'hi ha, comencem des de 0.
    this.score = data.puntsAnteriors || 0;
};

Level2Scene.create = function () {
    var gameW = this.sys.game.config.width;
    var gameH = this.sys.game.config.height;

    // 1. CONFIGURACIÓ VISUAL (FONS I MAPA)
    const bg = this.add.image(348, 290, 'background');
    bg.setDisplaySize(640 * 1.27, 640 * 1.27);
    bg.setDepth(-10);

    var map = this.make.tilemap({ key: 'mapa_canyon' });
    var tileset = map.addTilesetImage('TilesetPaid-CanyonDesertPlatformer', 'canyon_tiles');

    // Capes visuals del Tiled
    map.createLayer('cactus explosius', tileset);
    var platformsVisuals = map.createLayer('platforms', tileset);
    map.createLayer('decoració', tileset);
    map.createLayer('decoracio 2', tileset);

    // Ajustem els límits del món físic
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;

    // 2. SISTEMA DE COL·LISIONS OPTIMITZAT
    // Creem un grup estàtic per gestionar les caixes de col·lisió rectangulats del Tiled
    this.platformColliders = this.physics.add.staticGroup();

    const platformObjectLayer = map.getObjectLayer('Platforms');

    if (platformObjectLayer) {
        platformObjectLayer.objects.forEach(obj => {
            // Posicionem el collider centrat respecte les coordenades del Tiled
            const plat = this.platformColliders.create(obj.x + (obj.width / 2), obj.y + (obj.height / 2), null);
            // Assignem la mida exacta del rectangle definit al Tiled
            plat.body.setSize(obj.width, obj.height);
            plat.setDisplaySize(obj.width, obj.height);
            plat.setVisible(false); // "False" perquè és un element invisible, només serveix per a la física
            plat.refreshBody();
        });
    }

    // 3. JUGADOR (MISTO)
    this.player = this.physics.add.sprite(50, 450, 'cat');
    this.player.setScale(0.15);
    this.player.setBounce(0.20);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(160, 200);
    this.player.setOffset(50, 40);

    // Col·lisió del jugador amb el grup d'objectes estàtics
    this.physics.add.collider(this.player, this.platformColliders);


    // 4. CONTROLS DE L'USUARI
    this.cursors = this.input.keyboard.createCursorKeys();

    // 5. GESTIÓ DE GEMMES (Posicions manuals del nivell 2)
    this.gems = this.physics.add.group();

    const posicionsConcretes = [
        [80, 130], [200, 100], [410, 90],
        [240, 200], [300, 280], [420, 300],
        [280, 110], [430, 220], [490, 350],
        [90, 450], [370, 250], [520, 150]
    ];

    posicionsConcretes.forEach(pos => {
        let gem = this.gems.create(pos[0], pos[1], 'gem');
        gem.setBounceY(0.4);
        gem.setCollideWorldBounds(true);
    });

    // Col·lisions de les gemmes amb el terra
    this.physics.add.collider(this.gems, this.platformColliders);
    // Detecció de recollida de gemmes pel jugador
    this.physics.add.overlap(this.player, this.gems, this.collectStar, null, this);

    // 6. CACTUS 
    // Nota: Actualment els cactus són decoració i la mort la gestiona la "Zona de Dany" (Punt 8).
    // Aquest grup es deixa preparat per si es volguessin afegir enemics amb moviment en el futur.
    // Actualment aquest grup no està en funcionament
    this.cactus = this.physics.add.group();

    // Establim que qualsevol objecte d'aquest grup ha de xocar amb el terra
    this.physics.add.collider(this.cactus, this.platformColliders);

    // 7. ZONES DE DANY (Detectors de mort definits al Tiled)
    const danyLayer = map.getObjectLayer('dany');
    if (danyLayer) {
        this.danyGroup = this.physics.add.staticGroup();
        danyLayer.objects.forEach(obj => {
            const zone = this.danyGroup.create(obj.x + obj.width / 2, obj.y + obj.height / 2);
            zone.setSize(obj.width, obj.height);
            zone.setVisible(false);
            zone.refreshBody();
        });
        /**
     * DETECCIÓ DE DANY (comprobació de problemes a l'hora de detectar el dany):
     * Utilitzo una "Arrow Function" per confirmar la detecció del contacte.
     * Això em permet posar un console.log per verificar si el problema de la mort 
     * era la col·lisió física o la lògica de la funció hitDamage.
     */
        this.physics.add.overlap(this.player, this.danyGroup, (player, zone) => {
            console.log("CONTACTE AMB DANY!");
            this.hitDamage(player, zone);
        }, null, this);
    }

    // 8. INTERFÀS DE PUNTUACIÓ 
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, { fontSize: '32px', fill: '#ffffff' });
    this.add.text(16, 50, 'NIVELL 2', { fontSize: '20px', fill: '#ffff00' });

    // 9. EFECTES ESPECIALS: EMISSOR DE PARTÍCULES
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
};

/**
 * BUCLE D'ACTUALITZACIÓ
 * Controla el moviment del gat segons la interacció de l'usuari.
 */
Level2Scene.update = function () {
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

    // Salt: només si el gat està bloquejat per sota (tocant terra)
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-350);
    }
};

/**
 * LÒGICA DE RECOLLIDA DE GEMMES
 * Augmenta el marcador i comprova la condició de victòria final del joc.
 */
Level2Scene.collectStar = function (player, gem) {
    gem.disableBody(true, true);
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    // Condició per guanyar tot el joc (20 punts totals)
    if (this.score >= 20) {
        this.scene.start('GameOver', { finalScore: this.score, win: true });
    }
};

/**
 * LÒGICA DE MORT (Dany)
 * Atura l'escena, canvia el color del gat i envia l'usuari a la pantalla de Game Over.
 */
Level2Scene.hitDamage = function (player, zone) {
    if (this.isGameOver) return;

    console.log("Mort confirmada");
    this.isGameOver = true;

    this.physics.pause(); // Aturem tot el moviment físic del joc
    player.setTint(0xff0000); // Color vermell per indicar mal
    player.anims.play('turn');

    // Retard d'un segon per donar feedback visual al jugador
    this.time.delayedCall(1000, () => {
        this.isGameOver = false;
        this.scene.start('GameOver', {
            finalScore: this.score,
            win: false
        });
    });
};