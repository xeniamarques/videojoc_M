// Definició de l'escena de càrrega per gestionar la memòria i els recursos del joc
var LoadingScene = new Phaser.Scene('Loading');

/**
 * MÈTODE PRELOAD
 * Aquesta funció s'encarrega de carregar tots els fitxers externs a la memòria RAM
 * abans que el joc comenci".
 */
LoadingScene.preload = function () {

    // --- 1. CONFIGURACIÓ VISUAL ---
    // Obtenim les dimensions de la pantalla per centrar els elements
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;

    // Creem els gràfics per a la barra de progrés (el fons fosc i la barra groga)
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8); // Color gris fosc 
    progressBox.fillRect(170, 300, 300, 50); // Posició i mida del contenidor

    // Creem el text del percentatge (0% a 100%)
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 + 30,
        text: '0%',
        style: { font: '18px monospace', fill: '#ffffff' }
    }).setOrigin(0.5); // Centrem el text sobre el seu propi eix

    // --- 2. GESTIÓ DE L'ESDEVENIMENT DE CÀRREGA ---
    // L'objecte 'this.load' emet un esdeveniment 'progress' cada cop que un fitxer es descarrega
    this.load.on('progress', function (value) {
        // Actualitzem el text del percentatge dinàmicament
        percentText.setText(parseInt(value * 100) + '%');

        // Dibuixem la barra groga proporcionalment al valor (de 0 a 1)
        progressBar.clear();
        progressBar.fillStyle(0xffff00, 1);
        progressBar.fillRect(175, 305, 290 * value, 40);
    });

    // --- 3. CARREGUEM TOTS ELS RECURSOS (ASSETS) ---
    // Imatges i Tilesets (textures per al mapa)
    this.load.image('canyon_tiles', 'assets/tilesets/TilesetPaid-CanyonDesertPlatformer.png');

    // Fitxer JSON que conté el disseny del videojoc fet amb Tiled
    this.load.tilemapTiledJSON('mapa_canyon', 'assets/maps/tiled_map.json');

    // Gemmes i decoració
    this.load.image('gem', 'assets/sprites/gem.png');
    this.load.image('background', 'assets/maps/fons.png');

    // Spritesheet de'n Misto (conté tots els frames de les animacions)
    // Es defineix la mida de cada quadre (265x265 píxels)
    this.load.spritesheet('cat', 'assets/sprites/spritesheet_definitiu.png', {
        frameWidth: 265, frameHeight: 265
    });

    // Música de fons
    this.load.audio('theme', 'assets/audio/the_cat.mp3');
};

/**
 * MÈTODE CREATE
 * S'executa automàticament un cop s'han carregat tots els fitxers del 'preload'.
 */
LoadingScene.create = function () {

    // 1. Creem les animacions globals del personatge un sol cop per no repetir codi a tots els nivells del joc.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'cat', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('cat', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // 2. Un cop creades, ja podem anar al joc
    this.scene.start('Game');


    // 3. Fem la transició cap a l'escena principal del joc ('Game')
    this.scene.start('Game');
};