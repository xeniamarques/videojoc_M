/**
 * ESCENA DE MENÚ PRINCIPAL (HOME)
 * Primera pantalla que veu l'usuari. Serveix per presentar la història,
 * les instruccions de control i iniciar el cicle de càrrega.
 */
var HomeScene = new Phaser.Scene('Home');

HomeScene.create = function () {
    // Obtenim les mides configurades del joc per centrar elements
    var gameW = this.sys.game.config.width;
    var gameH = this.sys.game.config.height;

    // --- 1. ASPECTE VISUAL ---
    // Creem un fons fosc (rectangle de color gris molt fosc)
    this.add.rectangle(0, 0, gameW, gameH, 0x222222).setOrigin(0);

    // Títol del joc i estil del títol
    this.add.text(320, 100, "Misto's Adventures", {
        fontSize: '45px',
        fill: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // --- 2. NARRATIVA (LORE) I INSTRUCCIONS ---
    // Definim un string multilínia per explicar el context del personatge
    let loreText = 
        "En Misto s'ha perdut per l'immens desert i vol tornar a casa.\n\n" +
        "A la seva mestressa, que és joiera i una mica despistada, " +
        "se li han anat caient pedres precioses pel camí.\n\n" +
        "Segueix les gemmes per ajudar en Misto a tornar a casa.\n\n\n" +
        "CONTROLS:\n\n" +
        "← → ↑ per moure i saltar\n\n" +
        "⚠️ Vigila amb els cactus, són mortals!";

    // Mostrem el bloc de text amb ajustament de paraula (wordWrap) per no sortir de la pantalla
    this.add.text(320, 300, loreText, {
        fontSize: '15px',
        fill: '#dddddd',
        align: 'center',
        wordWrap: { width: 500 }, // El text saltarà de línia automàticament als 500px
        lineSpacing: 4
    }).setOrigin(0.5);

    // --- 3. INTERACTIVITAT D'INICI ---
    // Creem el botó visual d'inici
    let startButton = this.add.text(320, 520, 'Fes clic per començar', {
        fontSize: '24px',
        fill: '#ffff00'
    }).setOrigin(0.5).setInteractive(); // Activem la interactivitat per detectar clics

    // --- GESTIÓ D'ESDEVENIMENTS (CLICS) ---
     
    // Opció A: Clic específic sobre el botó groc
    startButton.on('pointerdown', function () {
        // Enviem l'usuari a l'escena de Càrrega (Loading)
        this.scene.start('Loading'); 
    }, this);
    
    // Opció B: Clic a qualsevol lloc de la pantalla (Input global)
    // Això millora l'experiència d'usuari (UX) facilitant l'inici del joc
    this.input.on('pointerdown', function() {
        this.scene.start('Loading');
    }, this);
};