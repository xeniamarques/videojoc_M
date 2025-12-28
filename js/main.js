/**
 * CONFIGURACIÓ GLOBAL DEL JOC
 * En aquest fitxer definim els paràmetres tècnics, el motor de físiques
 * i el llistat d'escenes que formen part del projecte.
 */
var config = {
    // Tipus de renderitzat: Phaser.AUTO triarà WebGL o Canvas segons el navegador
    type: Phaser.AUTO,
    
    // Dimensions del llenç (canvas) del joc
    width: 640,
    height: 640,
    
    // Color de fons inicial (mentre no es carreguen les imatges)
    backgroundColor: "#000000",
    
    // ID del contenidor HTML on s'inserirà el joc (opcional)
    parent: 'game-container', 
    
    // CONFIGURACIÓ DEL MOTOR FÍSIC
    physics: {
        default: 'arcade', // Utilitzem Arcade Physics per a un rendiment òptim en 2D
        arcade: {
            gravity: { y: 300 }, // Força de gravetat que afecta al jugador i objectes
            
            /* DEBUG MODE: 
               Molt útil durant el desenvolupament. Si es posa a 'true', Phaser dibuixa 
               uns marcs de colors sobre les caixes de col·lisió reals, permetent 
               veure si el personatge realment toca el terra o els enemics.
            */
            debug: false 
        }
    },

    /**
     * REGISTRE D'ESCENES
     * L'ordre en aquest llistat determina quina escena s'executa només obrir el joc.
     * En aquest cas, el joc comença a 'HomeScene'.
     */
    scene: [
        HomeScene,      // Pantalla de títol i instruccions
        LoadingScene,   // Carregador d'assets i creació d'animacions
        GameScene,      // Nivell 1
        Level2Scene,    // Nivell 2
        GameOverScene   // Pantalla final (Victòria o Derrota)
    ]
};

/**
 * INSTANCIACIÓ DEL JOC
 * Aquesta línia crea l'objecte global del joc i posa en marxa tot el sistema
 * basant-se en l'objecte de configuració definit a dalt.
 */
var game = new Phaser.Game(config);