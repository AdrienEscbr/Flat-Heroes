
// Tableu des effets sonores
let soundsEffects = [];
// Tableau des musique
let musics = [];

// Fonction pour charger les musiques et les sons du jeu
function loadSounds(){
    spawnEnemy = new Howl({
        src: ['https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3'],
        loop: false,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : spawnEnemy");
        }
    });

    explosion = new Howl({
        //src: ['../../assets/sounds/explosion.mp3'],
        src:['assets/sounds/explosion.mp3'],
        loop: false,
        volume: 0.08,
        onload: function () {
            console.log("Loaded asset : explosion");
        }
    });

    jump = new Howl({
        src: ['assets/sounds/jump.mp3'],
        loop: false,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : jump");
        }
    });

    theme = new Howl({
        src: ['assets/sounds/game.mp3'],
        loop: true,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : theme");
        }
    });

    menu = new Howl({
        src: ['assets/sounds/menu.mp3'],
        loop: true,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : menu");
        }
    });

    gameover = new Howl({
        src: ['assets/sounds/gameover.wav'],
        loop: false,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : gameover");
        }
    });

    spawn = new Howl({
        src: ['assets/sounds/spawn.wav'],
        loop: false,
        volume: 0.5,
        onload: function () {
            console.log("Loaded asset : spawn");
        }
    });

    win = new Howl({
        src: ['assets/sounds/win.mp3'],
        loop: false,
        volume: 0.1,
        onload: function () {
            console.log("Loaded asset : win");
        }
    });

    hoverEffect = new Howl({
        src: ['assets/sounds/hoverEffect.mp3'],
        loop: false,
        volume: 0.2,
        onload: function () {
            console.log("Loaded asset : hoverEffect");
        }
    });

    // Ajout des sons et des musiques dans les tableaux (utilisés pour la gestion des volumes dans les paramètres)
    soundsEffects = [spawnEnemy, explosion, jump, gameover, spawn, win, hoverEffect];
    musics = [theme, menu];
}