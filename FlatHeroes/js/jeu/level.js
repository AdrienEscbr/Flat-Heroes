
// Classe pour la création et la gestion d'un niveau
class Level {

    // Constructeur
    constructor(numLevel, gameFile, players){

        // Délai de 2 seconde entre l'affichage des différentes vagues d'ennemis
        this.durationBetweenWaves = 1000;
        // Délai de 2 secondes avant de commencer à faire apparaitre les premiers ennemis
        this.delayBeforeStarting = 2000;

        // Numéro du niveau à jouer
        this._numLevel = numLevel;
        // Liste des joueurs
        this._players = players;

        this._totalEnemies = 0;
        this._waveAmount = 0;

        // Récupération des données du niveau
        this.gameFile = new JsonFile(gameFile);
        this.gameFileLevels = this.gameFile.getLevels();

        // Tableau des particules apparaissant dans le niveau 
        this._particles = [];

        // Données des éléments du niveau
        this.obstaclesDatas = this.gameFile.getLevelContent(numLevel, this.gameFileLevels, "obstacles");
        this.enemiesDatas = this.gameFile.getLevelContent(numLevel, this.gameFileLevels, "enemies");
        this.spawnDatas = this.gameFile.getLevelContent(numLevel, this.gameFileLevels, "spawn");
    
        this.obstaclesModel = [];
        this.enemiesModel = [];

        this._isOver = false;

        // Création des patrons pour les obstacles du niveau
        this.obstaclesDatas.forEach(obstacleData => {
            this.obstaclesModel.push(new Obstacle(obstacleData.width, obstacleData.height, obstacleData.posX, obstacleData.posY, obstacleData.color));
        });

        // Création des patrons pour les ennemis du niveau de chaque vague
        this.enemiesDatas.forEach(enemyData =>{
            this.enemiesModel.push(new Enemy(enemyData.width, enemyData.height, enemyData.posX, enemyData.posY, enemyData.color, enemyData.type, enemyData.direction, enemyData.wave, enemyData.amount, enemyData.offset, enemyData.apparitionDelay));
            this._totalEnemies += enemyData.amount;
        });

        // Initialisation des joueurs pour le niveau  
        this._players.forEach(player =>{
            player.posX = this.spawnDatas[0].posX;
            player.posY = this.spawnDatas[0].posY;
            player.vx = 0;
            player.vy = 0;
            player.lives = 1;
            player.jumping = 1;
        });

        // Récupération du nombre de vague d'ennemis
        this._waveAmount = this.spawnDatas[1].waveAmount;

        // Listes utilisées pendant l'éxécution du niveau
        this._obstaclesList = [];
        this._enemiesList = [];
        this._enemiesRemoved = [];
        this._playersRemoved = [];
        
    }

    // getters
    get obstaclesList(){
        return this._obstaclesList;
    }
    get enemiesList(){
        return this._enemiesList;
    }
    get enemiesRemoved(){
        return this._enemiesRemoved;
    }
    get waveAmount(){
        return this._waveAmount;
    }
    get totalEnemies(){
        return this._totalEnemies;
    }
    get numLevel(){
        return this._numLevel;
    }
    get particles(){
        return this._particles;
    }
    get playersRemoved(){
        return this._playersRemoved;
    }
    get player(){
        return this._player;
    }
    get isOver(){
        return this._isOver;
    }

    // setters
    set totalEnemies(newValue){
        this._totalEnemies = newValue;
    }
    set waveAmount(newValue){
        this._waveAmount = newValue;
    }
    set obstaclesList(newList){
        this._obstaclesList = newList;
    }
    set playersRemoved(newList){
        this._playersRemoved = newList;
    }
    set isOver(newValue){
        this._isOver = newValue;
    }
    set players(newPlayers){
        this._players = newPlayers;
    }
    

    // méthode pour vider la liste des ennemis
    clearEnemiesList(){
        this._enemiesList = [];
    }
    // Méthode pour ajouter un ennemis à la liste des ennemis éleminés
    addRemovedEnemy(enemy){
        this._enemiesRemoved.push(enemy);
        // Losqu'un ennemis est éliminé, jouer le son d'explosion
        //explosion.play();
    }
    // Méthode pour ajouter un joueur à la liste des joueurs éliminés
    addRemovedPlayer(player){
        this._playersRemoved.push(player);
    }

    // Méthode pour mettre en place la boucle d'apparition des différentes vagues d'ennemi
    setEnemyWave() {        
        // Jouer le son de début de niveau
        spawn.play()
        
        // Ajouter au tableau de delai celui de pré lancement du niveau
        let tabDelay = [this.delayBeforeStarting];

        // Pour chaque patron d'ennemi de chaque vague, ajouter le delais avant apparition de la vague
        this.enemiesModel.forEach(element => {

            let newDelay = 0;
            if(element.type == "arrow"){
                newDelay = (element.apparitionDelay*element.total)+this.durationBetweenWaves+tabDelay[tabDelay.length-1];
            }
            if(element.type == "missile"){
                newDelay = (element.apparitionDelay*element.total)+this.durationBetweenWaves+tabDelay[tabDelay.length-1]+element.lifeDuration;
            }
            
            tabDelay.push(newDelay);
        })  
        // Ajout des obstacles à la liste des obstacles du niveau
        this.obstaclesModel.forEach(obstacle =>{
            this.obstaclesList.push(new Obstacle(obstacle.width, obstacle.height, obstacle.posX, obstacle.posY, obstacle.color))
        })

        console.log(tabDelay);

        // Boucle pour gérer chaque vague
        let counter = 0;
        // Pour chaque vague
        for (let i = 1; i <= this._waveAmount; i++) {
            // Exécuter le code suivant après chaque délais
            setTimeout(() => {
                // Faire apparaitre la vague i d'ennemis du niveau en cours
                counter += this.spawnEnemiesForWave(this.enemiesModel, i);
                console.log(counter +" sur "+this._waveAmount+" vague(s)");                
            }, tabDelay[i-1] );
        }
    }

    // Méthode pour afficher une vague d'ennemis
    spawnEnemiesForWave(loadedEnemies, waveIndex) {

        // Pour chaque patron d'ennemi pour la vague en cours    
        loadedEnemies.forEach(element => {
            // Si le numéro de la vague attribué correspond au numéro de la vague en cours
            if (element.wave === waveIndex) {
                let incr = 0;

                // Exécuter le code suivant en attendant le délais attribué entre chaque nouvelle exécution
                const intervalId = setInterval(() => {
                    // Si le nombre max d'ennemi de la vague n'a pas était atteint et que le niveau n'est pas terminé
                    if (incr < element.total && this._isOver == false) {
                        
                        // En fonction du type de l'ennemi, exécuter la méthode correspondante
                        if(element.type == "arrow"){
                            this.spawnArrowsEnemies(element, incr);
                        }
                        if(element.type == "missile"){
                            this.spawnMissileEnemies(element, incr);
                        }
                        // Jouer l'effet sonore d'apparition d'un ennemi
                        spawnEnemy.play();                       

                        incr++;
                    } else {
                        // Tous les ennemis de la vague ont été ajoutés, donc arrêter l'intervalle
                        clearInterval(intervalId);
                    }
                }, element.apparitionDelay);

            }
        });
        // Lancer la méthode pour décrémenter la durée de vie des ennemis
        this.decreaseLifeDuration(this._enemiesList)

        return 1;
    }

    // Méthode pour ajouter à la liste des ennemis ceux de type "arrow"
    spawnArrowsEnemies(element, incr){
        // Ajouter l'ennemi dans le tableau en fonction de la direction (seule la position en x et en y change avec un offeset pour qu'ils apparaissent en ligne)
        switch (element.direction) {
            case 'top':
            case 'bottom':
                this._enemiesList.push(new Enemy(
                    element.width,
                    element.height,
                    element.posX + incr * (element.width + element.offset),
                    element.posY,
                    element.color,
                    element.type,
                    element.direction,
                    element.wave,
                    element.total,
                    element.offset,
                    element.apparitionDelay
                ));
                break;

            case 'left':
            case 'right':
                this._enemiesList.push(new Enemy(
                    element.width,
                    element.height,
                    element.posX,
                    element.posY - incr * (element.height + element.offset),
                    element.color,
                    element.type,
                    element.direction,
                    element.wave,
                    element.total,
                    element.offset,
                    element.apparitionDelay
                ));
                break;

            default:
            break;
        }
    }

    // Méthode pour ajouter à la liste des ennemis ceux de type "missile"
    spawnMissileEnemies(element, incr){
        this._enemiesList.push(new Enemy(
            element.width,
            element.height,
            element.posX,
            element.posY /*- incr * (element.height + element.offset)*/,
            element.color,
            element.type,
            element.direction,
            element.wave,
            element.total,
            element.offset,
            element.apparitionDelay
        ))
    }

    // méthode pour décrémenter la durée de vie des ennemis (utile uniquement pour les missiles)
    decreaseLifeDuration() {
        
        // Toutes les secondes faire le code suivant
        const interval = setInterval(() => {
            // S'il y a encore des ennemis dans le tableau des ennemis
            if (this._enemiesList.length > 0) {
                // Pour chacun d'entre eux
                this._enemiesList.forEach(enemy => {
                    // Si ca durée de vie est supérieur à 0, la diminuée de 1 s (soit 1000 ms)
                    if (enemy.lifeDuration > 0) {
                        enemy.lifeDuration -= 1000;
                    }
                }); 
            }
            else {
                // Tous les ennemis de la vague ont été éliminés, donc arrêter l'intervalle
                clearInterval(interval);
            }
        }, 1000);
    }



}