/**
 * ESCENA DE FINAL DE PARTIDA (GAME OVER / VICTÒRIA)
 * Aquesta escena mostra el resultat final i permet reiniciar el joc.
 */
var GameOverScene = new Phaser.Scene('GameOver');

/**
 * MÈTODE INIT
 * Recupera les dades enviades des del Nivell 1 o Nivell 2.
 * @param {Object} data - Conté finalScore (punts) i win (si ha guanyat o no).
 */
GameOverScene.init = function(data) {
    // Guardem la puntuació i el resultat per mostrar-los a la pantalla
    this.puntuacioFinal = data.finalScore;
    this.haGuanyat = data.win;
};

GameOverScene.create = function() {
    // --- 1. LÒGICA VISUAL DINÀMICA ---
    // Decidim el text i el color en funció de si el jugador ha guanyat o perdut
    var titol = this.haGuanyat ? 'VICTÒRIA!' : 'GAME OVER';
    var color = this.haGuanyat ? '#00ff00' : '#ff0000'; // Verd per guanyar, vermell per perdre

    // Mostrem el títol principal centrat
    this.add.text(320, 200, titol, { fontSize: '64px', fill: color }).setOrigin(0.5);
    
    // Mostrem la puntuació final acumulada durant els nivells
    this.add.text(320, 300, 'Punts totals: ' + this.puntuacioFinal, { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    
    // --- 2. BOTÓ DE REINICI INTERACTIU ---
    // Creem un text que funcionarà com a botó
    let btn = this.add.text(320, 450, 'TORNAR A JUGAR', { 
        fontSize: '24px', 
        fill: '#ffff00' 
    }).setOrigin(0.5).setInteractive(); // .setInteractive() permet que l'objecte rebi clics
    
    // Gestionem l'esdeveniment de clic (pointerdown)
    btn.on('pointerdown', () => {
        // En prémer el botó, tornem a l'escena del menú principal (Home)
        this.scene.start('Home');
    });
};