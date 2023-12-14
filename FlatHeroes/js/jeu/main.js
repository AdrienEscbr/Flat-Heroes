

// Fonction d'initialisation de la partie jeu
function init(){
    // Chargement des sons
    loadSounds();
    // Mise en place des paramètres audios
    audioParameters();
    
    // Dimensions de l'aire de jeu
    let width = 1000;
    let height = 800;
    // Paramètres physique de l'aire de jeu
    let gravity = 0.6;
    let groundFriction = 0.95;
    let aerialFriction = 0.95;
    let speedX = 0.5;
    let speedY = 25;
    
    // Niveau de départ mis à 0    
    let currentLevel = 0;

    let doOnce = true;

    // Chemin du fichier de jeu
    let gameFilePath = '../../assets/files/levels.json';

    // Récupérations des données du jeu
    let gameFile = new JsonFile(gameFilePath);
    let gameFileLevels = gameFile.getLevels();

    // Redimensionnement de la taille du conteneur principal
    let main = document.querySelector("#main");
    main.style.height = window.innerHeight+"px";

    // Ajout des évènement pour pouvoir ouvrir et fermer les paramètres audios
    let parameters = document.querySelector("#parameters");
    parameters.addEventListener("click", e => {
        let parametersPage = document.querySelector(".parameters");
        parametersPage.style.transform = "translateX(0px)";
    })
    let close = document.querySelector("#close");
    close.addEventListener("click", e=>{
        let parametersPage = document.querySelector(".parameters");
        parametersPage.style.transform = "translateX(527px)";
    })
    let paramtersContent = document.querySelector(".parameters");
    paramtersContent.style.height = window.innerHeight+"px";
    

    // Fonction utilisée par les ennemis "missile" pour trouver le joueur le plus proche pour chaque missile
    function findNearestPlayerForEnemy(enemy, players) {
        let minDistance = Number.MAX_VALUE;
        let nearestPlayer = players[0];        

        for (let i = 0; i < players.length; i++) {
            let player = players[i];

            if(player.lives > 0){
                let distance = calculateDistance(enemy.posX, enemy.posY, player.posX, player.posY);
    
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestPlayer = player;
                }
            }
            
        }
        return { posX: nearestPlayer.posX, posY: nearestPlayer.posY };
    }
    
    // Méthode pour claculer la distance entre un ennemis "missile" et un joueur
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Méthode pour afficher un texte animé au niveau de l'aire de jeu (utilisé pour le passage entre 2 niveau ou lorsque les joueurs gagnent ou perdent)
    function showMessageOverlay(text, cssClass) {
        // Créer une div
        const overlayDiv = document.createElement('div');
        
        // Ajouter le texte
        overlayDiv.textContent = text;
    
        // Ajouter la classe CSS
        overlayDiv.classList.add(cssClass);
    
        // Style de position absolue pour recouvrir le canvas
        overlayDiv.style.position = 'absolute';
        overlayDiv.style.top = '20%';        
    
        // Ajouter la div au corps du document
        document.querySelector('#container').appendChild(overlayDiv);

    
        overlayDiv.addEventListener('animationend', () => {
            // Ajouter la deuxième animation après la fin de la première
            overlayDiv.style.animation = 'secondAnimation 1s ease-in-out infinite';
          });
        
    }

    // Méthode pour supprimer les élements html créés (boutons et messages affichés)
    function deleteChild(parentElementID) { 
        var e = document.querySelector(parentElementID); 
        var first = e.firstElementChild; 
        while (first) { 
            first.remove(); 
            first = e.firstElementChild; 
        } 
    } 

    // méthode pour créer des boutons
    function showButton(text, cssClass, parentElementID){
        const btn = document.createElement('div');
        btn.textContent = text;
        
        btn.classList.add(cssClass);
        document.querySelector(parentElementID).appendChild(btn);

        // Pour le bouton menu
        if(text == "Menu"){
            // Ajouter l'évènement pour revenir au menu s'il est cliqué
            btn.addEventListener("click", ()=>{
                window.location.href="index.html";
            });
            // ajouter l'évènement pour jouer l'effet sonore au survole
            btn.addEventListener("mouseover", e =>{
                hoverEffect.play();
            })
            
        }
        if(text == "Réessayer"){
            // Ajouter l'évènement pour relancer le niveau s'il est cliqué
            btn.addEventListener("click", ()=>{
                console.log("Niveau relancé")
                // Supprimer les éléments html précédement affichés
                deleteChild(parentElementID);
                let text = document.querySelector('.text')
                document.querySelector('#container').removeChild(text);
                
                // Après un court délais, exécuter la fonction
                setTimeout(() => {
                    playAgain()
                }, 10);
            });

            btn.addEventListener("mouseover", e =>{
                hoverEffect.play();
            })

            
        }
    }

    // Fonction pour créer un élément html (pour contenir les boutons)
    function createWrapper(id, parentElementID, cssClass){
        const div = document.createElement('div');
        div.id = id;
        div.style.position = 'absolute';
        div.classList.add(cssClass);

        document.querySelector(parentElementID).appendChild(div);
    }
       
    
    // Si des niveaux ont pu être récupérés dans le fichier JSON
    if(gameFileLevels){

        // Créer l'espace de jeu
        let canvas = new Canva("container", "canvas", width, height, gravity, groundFriction, aerialFriction, speedX, speedY);
        canvas.draw();
        let context = new Context(canvas);
        
        // Créer les controllers utilisés par les joueurs pour se déplacer    
        let controllerPlayer1 = new Controller("KeyA", "KeyD", "KeyW");
        let controllerPlayer2 = new Controller("ArrowLeft", "ArrowRight", "ArrowUp");
        let controllerPlayer3 = new Controller("Numpad4", "Numpad6", "Numpad8");
        let controllerPlayer4 = new Controller("KeyJ", "KeyL", "KeyI");

        let controllers = [controllerPlayer1, controllerPlayer2, controllerPlayer3, controllerPlayer4];
        let colors = ["red", "blue", "yellow", "orange"]
        let players = [];
        
        // Récupérer le nombre de joueur sélectionné
        let nbPlayers = getLocalStorageData("nbPlayers");
        if(nbPlayers <= 0){
            nbPlayers = 1;
        }

        // Ajouter les joueurs à la liste des joueurs
        for(let i = 0; i < nbPlayers; i++){
            players.push(new Player(30, 30, 0, height, colors[i], 0, 1, controllers[i]))
        }


        console.log("Niveaux disponibles : ", gameFileLevels.length);

        // Créer le premier niveau
        let level = new Level(currentLevel, gameFilePath, players);
        level.setEnemyWave();
        // Lancer la musique du jeu
        theme.play();

        // Fonction pour relancer le niveau en cours
        function playAgain(){
            setTimeout(() => {
                level = new Level(currentLevel, gameFilePath, players);
                level.setEnemyWave();
                theme.play();
                requestAnimationFrame(animate)
            });
        }

        // Fonction pour récupérer le nombre de joueurs en vie
        function checkPlayersAlive(){

            let countPlayersAlive = 0                        
            
            players.forEach(player =>{
                if(player.lives > 0){
                    countPlayersAlive++;
                }
            })

            return countPlayersAlive;
        }


        // Fnction d'animation pour les niveaux
        function animate(){

            // S'il y a encore des joueurs en vie 
            if(checkPlayersAlive() > 0){
                
                // Néttoyer le canvas
                context.clearCanvas(canvas);
                // Afficher quel niveau est jouer
                context.drawMessage("Niveau "+(currentLevel+1)+" / "+gameFileLevels.length, 20, 40)

                // Pour chaque obstacle de la liste, le dessiner
                level.obstaclesList.forEach(function(obstacle){
                    context.drawObstacle(obstacle);
                });

                // pour chaque joueur de la liste
                players.forEach(function(player){
                    // Si le joueur est en vie, le dessiner et vérifier les collisions avec l'aire de jeu
                    if(player.lives > 0){
                        context.drawPlayer(player);
                        canvas.update(player, level);
                        canvas.canvasCollision(player);
                    }                    
                });

                // Pour chaque ennemi de la liste
                level.enemiesList.forEach(enemy =>{

                    // S'il est de type "missile"
                    if(enemy.type == "missile" ){
                        // Chercher la position du joueur le plus proche
                        let nearestPlayerPosition = { posX: 0, posY: 0 };
                        nearestPlayerPosition = findNearestPlayerForEnemy(enemy, players);
                        
                        // L'attribuer comme cible pour l'ennemi
                        enemy.setTarget(nearestPlayerPosition.posX, nearestPlayerPosition.posY)
                        // Empêcher les ennemis de se superposer
                        enemy.avoidEnemies(level.enemiesList);
                        // Le guider vers le joueur target
                        enemy.seek();

                        // Si sa durée de vie est <= à 0
                        if(enemy.lifeDuration <= 0){
                            // Supprimer l'ennemi de la liste et l'ajouter à la liste des ennemis éliminés
                            level.addRemovedEnemy( level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1));
                            // Ajouter les particules pour l'animation d'explosion
                            for (i = 0; i <= 50; i++) { 
                                let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                                let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                                let radius = Math.random() * 3; 
                                let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                        
                                level.particles.push(particle); 
                            }
                        }
                    }
                    // Dessiner l'ennemi (qu'il soit de type "missile" ou "arrow")
                    context.drawEnemy(enemy);
                    // Le mettre à jour
                    canvas.updateEnemy(enemy, level);
                })

                // Pour chaque particule de la liste 
                level.particles.forEach((particle, i) => { 
                    // La mettre à jour
                    if (particle.alpha <= 0) { 
                        level.particles.splice(i, 1); 
                    } else particle.updateParticule(particle, context) 
                })
                
                
                // Vérifier les collisions entre les joueurs et les obstacles
                canvas.checkCollisions(players, level.obstaclesList, context);
                // Vérifier la possibilité de saut sur les murs de l'aire de jeu
                canvas.wallJump(players);
                
                console.log(level.enemiesRemoved.length+ " sur "+level.totalEnemies)

                // Si toutes les vagues du niveau sont terminée et que le niveau en cours n'est pas le dernier niveau
                if(level.enemiesRemoved.length >= level.totalEnemies && (currentLevel + 1) < gameFileLevels.length){

                    requestAnimationFrame(animate);
                    // Faire un fois 
                    if(doOnce){
                        // Afficher le message animé
                        showMessageOverlay('Level succeed', 'text');
                        doOnce = false
                        // Attendre 3 secondes puis faire
                        setTimeout(() => {
                            // Incrémenter le numéro du niveau
                            currentLevel++;
                            console.log("Passage au niveau :", currentLevel);

                            // Supprimer le message
                            let text = document.querySelector('.text')
                            document.querySelector('#container').removeChild(text);

                            // Lancer le niveau suivant
                            level = new Level(currentLevel, gameFilePath, players);
                            level.setEnemyWave();
                            doOnce = true;
                        }, 3000);
                    }
                }
                // Sinon si toutes les vagues du niveaux sont terminées et que le niveau en cours est le dernier
                else if(level.enemiesRemoved.length >= level.totalEnemies && (currentLevel + 1) >= gameFileLevels.length){
                    // Attendre 2 secondes
                    if(doOnce){
                        requestAnimationFrame(animate);
                        
                        setTimeout(() => {
                        
                            doOnce = false;
                            
                        }, 2000);
                    }
                    // Après 2 secondes faire
                    else{
                        // Arrêter la musique du jeu
                        theme.stop();
                        // Jouer l'effet sonore de victoire
                        win.play();
                        // Nettoyer le convas
                        context.clearCanvas(canvas);
                        // Afficher le message 
                        showMessageOverlay('YOU WIN !', 'text');
                        // Afficher le bouton pour retourner au menu
                        createWrapper('wrapper', '#container', 'wrapperHorizontal')
                        showButton('Menu', 'button', '#wrapper')
                        // Réinitialiser le numéro de niveau
                        currentLevel = 0;                        
                    }
   
                }
                // Sinon, continuer l'animation du niveau
                else{
                    requestAnimationFrame(animate);
                }  
            }
            // Sinon si aucun joueur n'est en vie
            else{
                // Vider la liste des ennemis
                level.clearEnemiesList();
                // Indiquer que le niveau est terminé
                level.isOver = true;
                // Arrêter la musique du jeu
                theme.stop();
                // Jouer l'effet sonore de défaite
                gameover.play();
                // nettoyer le canvas
                context.clearCanvas(canvas);
                // Afficher le message
                showMessageOverlay('Game Over', 'text');
                // Afficher les boutons
                createWrapper('wrapper', '#container', 'wrapperHorizontal')
                showButton('Menu', 'button', '#wrapper')                
                showButton('Réessayer', 'button', '#wrapper');
            }
        }

        // Exécuter la fonction d'animation
        animate();
    }
    else{
        console.log('Fichier JSON introuvables.')
    }
    
}


// Exécuter la fonction après que la page ait chargée
window.onload = init;