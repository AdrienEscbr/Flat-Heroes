
// Classe pour la création et la gestion des évènement interne au canvas
class Canva{
    // Constructeur
    constructor(parentId, objectId, width, height, gravity, groundFriction, aerialFriction, speedX, speedY){
        this._parentId = parentId;// Id de l'élément html parent qui contiendra le canvas
        this._width = width;// largeur
        this._height = height;// hauteur
        this._objectId = objectId;// id du canvas
        this._gravity = gravity;// valeur de la gravité dans le canvas
        this._speedX = speedX;// valeur de l'accélération en X
        this._speedY = speedY;// accélération en Y
        this._groundFriction = groundFriction;// force de drag sur les paroies et obstacles
        this._aerialFriction = aerialFriction;// force de drag en l'air
        this._bonusJump = 5;
    }



    // Méthode pour créer le canvas et l'afficher
    draw(){
        let canvas = document.createElement('canvas');
        canvas.id = this._objectId;
        canvas.width = this._width;
        canvas.height = this._height;
        let id = "#"+this._parentId;
        let parent = document.querySelector(id);
        if(parent){
            parent.appendChild(canvas);
        }
        else{
            console.log("Impossible de créer le canva car l'élément parent n'existe pas pour cet ID.");
        }
    }

    // Méthode pour contenir un joueur dans l'aire de jeu et récupérer la face du joueur en contact avec les murs
    canvasCollision(object) {

        let side = null

        //Handle canvas boundaries
        if (object.posX <= 0) {
            object.posX = 0;
            object.vx = 0; 
            object.jumping = 1;// Si le joueur touche le mur gauche, il récupère un saut
            side = 'left';
        }
        if (object.posY <= 0) {
            object.posY = 0;
            object.vy = 0; 
            side = 'top';
        }
        if (object.posX + object.width >= this._width) {
            object.posX = this._width - object.width;
            object.vx = 0; 
            object.jumping = 1;// Si le joueur touche le mur droit, il récupère un saut
            side = 'right';
        }
        if (object.posY + object.height >= this._height) {
            object.posY = this._height - object.height;
            object.vy = 0;
            object.jumping = 1;// Si le joueur touche le sol, il récupère un saut
            side = 'bottom';
        }

        // side indique la partie du joueur en contact avec l'aire de jeu
        return side;
    }

    // Méthode de détection de superpositions des surface de deux élément pour savoir s'il y a collision ou non
    objectsOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
 
        if ((x1 > (x2 + w2)) || ((x1 + w1) < x2))
            return false; // No horizontal axis projection overlap
        if ((y1 > (y2 + h2)) || ((y1 + h1) < y2))
            return false; // No vertical axis projection overlap
        return true; // If previous tests failed, then both axis projections
                        // overlap and the rectangles intersect
    }

    // Méthode pour connaitre quelle partie de 2 objets se chevauchent
    objectSideCollision(r1, r2) {
        let dx = (r1.posX + r1.width / 2) - (r2.posX + r2.width / 2);
        let dy = (r1.posY + r1.height / 2) - (r2.posY + r2.height / 2);
        let width = (r1.width + r2.width) / 2;
        let height = (r1.height + r2.height) / 2;
        let collision = 'none';
    
        // Si les rectangles se chevauchent
        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            let offsetX = width - Math.abs(dx);
            let offsetY = height - Math.abs(dy);
    
            // Détermination de la direction de la collision
            if (offsetX < offsetY) {
                // Collision horizontale
                if (dx > 0) {
                    // Obstacle à gauche du joueur
                    collision = 'left';                    
                } else {
                    // Obstacle à droite du joueur
                    collision = 'right';                    
                }
            } else {
                // Collision verticale
                if (dy > 0) {
                    // Obstacle au-dessus du joueur
                    collision = 'top';                    
                } else {
                    // Obstacle en dessous du joueur
                    collision = 'bottom';
                    
                }
            }
        }
    
        return collision;
    }

    // Méthode pour vérifier si deux objets de l'aire de jeu se touchent et agir en conséquence (ici entre les joueurs et les obstacles)
    checkCollisions(objects1, objects2, context) {

        // Récupérer les paramètre du premier objet
        objects1.forEach( object1 => {
            let object1XBoundingRect = object1.posX ;
            let object1YBoundingRect = object1.posY ;
            let object1Width = object1.width;
            let object1Height = object1.height;

            // Récupérer les paramètres du deuxième objet
            objects2.forEach( object2 => {

                let object2XBoundingRect = object2.posX ;
                let object2YBoundingRect = object2.posY ;
                let object2Width = object2.width;
                let object2Height = object2.height;

                // Vérifier s'il y a collision entre les deux objets
                if (this.objectsOverlap(object1XBoundingRect, object1YBoundingRect,
                    object1Width, object1Height,
                    object2XBoundingRect, object2YBoundingRect,
                    object2Width, object2Height)) {

                    //context.drawMessage("Collision", 30, 30);
                    
                    // Récupérer la face du joueur qui est en contact avec l'obstacle
                    let side = this.objectSideCollision(object1, object2);
                    
                    //context.drawMessage(side, 30, 50);                       
                    
                    // Agir pour que le joueur ne passe pas à travers les obstacles
                    if(side === 'bottom'){
                        object1.posY = object2.posY - object1.height;
                        object1.jumping = 1;
                        object1.vy = 0;
                    }
                    if(side === 'top'){
                        object1.posY = object2.posY + object2.height;
                        object1.vy = 0;
                    }
                    if(side === 'left'){
                        object1.posX = object2.posX+object2.width;
                        //object1.vx -= this.speedX;
                        object1.jumping += 1;
                    }
                    if(side === 'right'){
                        object1.posX = object2.posX - object1.width;
                        //object1.vx += this.speedX;
                        object1.jumping += 1;
                    }
                    
                    // Appeler la méthode pour vérifier qu'un joueur peut utiliser le saut sur les faces latérales d'un obstacle
                    this.obstacleJump(object1, object2);
                
                } 
                    
            })
        })
    }

    // Méthode pour vérifier si un joueur peut effectuer un saut sur les faces latérales d'un obstacle
    obstacleJump(player, obstacle){

        // Récupération de la face du joueur en contact avec l'obstacle 
        let playerObstacleCollides = this.objectSideCollision(player, obstacle);

        // Si le joueur utilise la touche de saut et est capable d'effectuer un saut
        if (player.controller.up && player.jumping > 0) {
            
            // Si le joueur a encore des vies, jouer le son de saut
            if(player.lives > 0){
                jump.play();
            }
            
            // Si le joueur est en contact avec un obstacle sur le côté droit 
            if (playerObstacleCollides === 'right') {
                // Appliquer une impulsion vers le haut et à gauche
                player.vx = -(this._speedX+this._bonusJump);
                player.vy = -this._speedY;
            }
            // Si le joueur est en contact avec un obstacle sur le côté gauche 
            else if (playerObstacleCollides === 'left') {
                // Appliquer une impulsion vers le haut et à droite
                player.vx = (this._speedX+this._bonusJump);
                player.vy = -this._speedY;
            }

            player.jumping=0; // Réduire le nombre de sauts restants
        }
    }

    // Méthode pour controller les saut sur les murs de l'aire de jeu
    wallJump(players){

        // Pour chaque joueur
        players.forEach(player =>{

            // Récupérer la face du joueur en contact avec les surfaces de l'aire de jeu (+ agir pour qu'il n'en sorte pas)
            let canvasSide = this.canvasCollision(player);

            // Si le joueur utilise la touche de saut et est capable d'effectuer un saut 
            if (player.controller.up && player.jumping > 0) {

                // Jouer l'effet de saut si le joueur possède encore des vies
                if(player.lives > 0){
                    jump.play();
                }
                // Si le joueur est en contact avec le côté droit du canvas
                if (canvasSide === 'right') {
                    // Appliquer une impulsion vers le haut et à gauche
                    player.vx = -(this._speedX+this._bonusJump);
                    player.vy = -this._speedY;
                }
                // Si le joueur est en contact avec le côté gauche du canvas
                else if (canvasSide === 'left') {
                    // Appliquer une impulsion vers le haut et à droite
                    player.vx = (this._speedX+this._bonusJump);
                    player.vy = -this._speedY;
                }
    
                player.jumping--; // Réduire le nombre de sauts restants
            }
        })
    }

    // Méthode pour vérifier la collision entre un joueur et un ennemi
    enemiesCollision(object, level){        
        
        // Pour chaque ennemi du niveau en cours
        level.enemiesList.forEach(enemy => {

            // vérifier s'il y a collision entre un joueur et un ennemi
            const collides = (
                object.posX < enemy.posX + enemy.width &&
                object.posX + object.width > enemy.posX &&
                object.posY < enemy.posY + enemy.height &&
                object.posY + object.height > enemy.posY
            );

            // S'il y a collision
            if (collides) {

                // Créer les particules pour l'animation d'explosion
                for (let i = 0; i <= 5; i++) { 
                    let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                    let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                    let radius = Math.random() * 3; 
                    let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                      
                    // Ajouter les particules au tableau des particules du niveau en cours
                    level.particles.push(particle); 
                }
                // Supprimer uniquement l'ennemi qui entre en collision
                enemy.lifeDuration = 0;
                // Supprimer l'ennemi de l'aire de jeu et le mettre dans le tableau recensant les ennemis éliminés
                level.addRemovedEnemy(level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1));
                // Décrémenté le compteur de vie du joueur
                object.lives -= 1;
            }
        });
    }

    // méthode pour vérifier la collision entre les ennemis et les obstacles du niveau en cours
    enemiesObstaclesCollision(level){
        
        // Pour chaque ennemi du niveau en cours
        level.enemiesList.forEach((enemy) => {

            // Récupérer l'index de cet ennemi dans le tableau
            let index = level.enemiesList.indexOf(enemy);

            // Pour chaque obstacle du niveau en cours
            level.obstaclesList.forEach(obstacle => {

                // Vérifier s'il y a collision entre l'ennemi et l'obstacle
                const collides = (
                    enemy.posX < obstacle.posX + obstacle.width &&
                    enemy.posX + enemy.width > obstacle.posX &&
                    enemy.posY < obstacle.posY + obstacle.height &&
                    enemy.posY + enemy.height > obstacle.posY
                );
                
                // S'il y a collision et que l'ennemi est de type "arrow" (soit les ennemis qui n'ont pas un comportement de "boids")
                if (collides && enemy.type == "arrow") {
                    // Créer les particules pour l'animation d'explosion
                    for (let i = 0; i <= 5; i++) { 
                        let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                        let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                        let radius = Math.random() * 3; 
                        let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                          
                        
                        level.particles.push(particle); 
                    }
                    // Supprimer uniquement l'ennemi qui entre en collision
                    enemy.lifeDuration = 0;
                    level.addRemovedEnemy( level.enemiesList.splice(index, 1) );
                    
                }
            });
        });
    }

    // Méthode pour mettre à jour la positions des ennemis 
    updateEnemy(enemy, level){

        // Pour les ennemis avec un comportement de type "arrow"
        if(enemy.type == "arrow"){
            // En fonction de la direction propre à l'ennemi
            switch(enemy.direction){
                
                // Si la direction pointe vers le bas de l'aire de jeu
                case "bottom" : 

                    // Si l'ennemi n'a pas encore atteint le bas de l'aire de jeu, continuer le déplacement
                    if (enemy.posY + enemy.height < this._height) {
                        enemy.vy += this._gravity;
                        enemy.posY += enemy.vy;
                    
                        // Augmenter progressivement la vitesse de chute
                        enemy.vy *= this._aerialFriction;
                    }
                    // Sinon, supprimer l'ennemi et déclencher l'animation d'explosion
                    else{
                        for (let i = 0; i <= 5; i++) { 
                            let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                            let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                            let radius = Math.random() * 3; 
                            let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                              
                            level.particles.push(particle); 
                        }
                        // Supprimer uniquement l'ennemi qui entre en collision
                        enemy.lifeDuration = 0;
                        level.addRemovedEnemy(level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1) );
                    }
                break;

                // Si la direction pointe vers le haut de l'aire de jeu
                case "top" :
                    // Si l'ennemi n'a pas encore atteint le haut de l'aire de jeu, continuer le déplacement
                    if (enemy.posY > 0) {
                        enemy.vy += this._gravity;
                        enemy.posY -= enemy.vy;
                    
                        // Augmenter progressivement la vitesse de chute
                        enemy.vy *= this._aerialFriction;
                    }
                    // Sinon, supprimer l'ennemi et déclencher l'animation d'explosion
                    else{
                        for (let i = 0; i <= 5; i++) { 
                            let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                            let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                            let radius = Math.random() * 3; 
                            let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                              
                            level.particles.push(particle); 
                        }
                        // Supprimer uniquement l'ennemi qui entre en collision
                        enemy.lifeDuration = 0;
                        level.addRemovedEnemy(level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1) );
                    }
                break;

                // Si la direction pointe vers la droite de l'aire de jeu
                case "right" : 
                    // Si l'ennemi n'a pas encore atteint la droite de l'aire de jeu, continuer le déplacement
                    if (enemy.posX + enemy.width < this._width) {
                        enemy.vx += this._gravity;
                        enemy.posX += enemy.vx;
                        // Augmenter progressivement la vitesse de chute
                        enemy.vx *= this._aerialFriction;
                    }
                    // Sinon, supprimer l'ennemi et déclencher l'animation d'explosion
                    else{
                        for (let i = 0; i <= 5; i++) { 
                            let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                            let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                            let radius = Math.random() * 3; 
                            let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                              
                            level.particles.push(particle); 
                        }
                        // Supprimer uniquement l'ennemi qui entre en collision
                        enemy.lifeDuration = 0;
                        level.addRemovedEnemy(level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1) );
                    }
                break;

                // Si la direction pointe vers la gauche de l'aire de jeu
                case "left" : 
                    // Si l'ennemi n'a pas encore atteint la gauche de l'aire de jeu, continuer le déplacement
                    if (enemy.posX > 0) {
                        enemy.vx += this._gravity;
                        enemy.posX -= enemy.vx;
                        // Augmenter progressivement la vitesse de chute
                        enemy.vx *= this._aerialFriction;
                    }
                    // Sinon, supprimer l'ennemi et déclencher l'animation d'explosion
                    else{
                        for (let i = 0; i <= 5; i++) { 
                            let dx = (Math.random() - 0.5) * (Math.random() * 6); 
                            let dy = (Math.random() - 0.5) * (Math.random() * 6); 
                            let radius = Math.random() * 3; 
                            let particle = new Particle(enemy.posX, enemy.posY, radius, dx, dy, enemy.color); 
                              
                            level.particles.push(particle); 
                        }
                        // Supprimer uniquement l'ennemi qui entre en collision
                        enemy.lifeDuration = 0;
                        level.addRemovedEnemy(level.enemiesList.splice(level.enemiesList.indexOf(enemy), 1) );
                    }
                break;
            }
        }

        // Si l'ennemi est de type "missile" (guidé vers le joueur le plus proche)
        if(enemy.type == "missile"){

            // Actualiser sa position 
            enemy.velocity.x += enemy.acceleration.x;
            enemy.velocity.y += enemy.acceleration.y;

            let speed = Math.sqrt(enemy.velocity.x * enemy.velocity.x + enemy.velocity.y * enemy.velocity.y);

            if (speed > enemy.maxSpeed) {
                enemy.velocity.x = (enemy.velocity.x / speed) * enemy.maxSpeed;
                enemy.velocity.y = (enemy.velocity.y / speed) * enemy.maxSpeed;
            }

            enemy.posX += enemy.velocity.x;
            enemy.posY += enemy.velocity.y;



            // Vérifier si l'ennemi sort du canvas à gauche ou à droite et l'arréter pour qu'il n'en sorte pas
            if (enemy.posX < 0) {
                enemy.posX = 0;
            } else if (enemy.posX + enemy._width > this._width) {
                enemy.posX = this._width - enemy._width;
            }

            // Vérifier si l'ennemi sort du canvas en haut ou en bas et l'arréter pour qu'il n'en sorte pas
            if (enemy.posY < 0) {
                enemy.posY = 0;
            } else if (enemy.posY + enemy._height > this._height) {
                enemy.posY = this._height - enemy._height;
            }

            enemy.acceleration.x = 0;
            enemy.acceleration.y = 0;
        }
        
        
    }

    // Mettre à joueur la position des joueur + vérifier les différentes collisions dans l'aire de jeu
    update(object, level) {

        // Si le joueur veut sauter
        if (object.controller.up && object.jumping == 1) {
            // Changer sa direction de déplacment verticale
            object.vy -= this._speedY;
            // Mettre son compteur de saut à 
            object.jumping = 0;
            // Jouer l'effet sonore de saut si le joueur est en vie
            if(object.lives > 0){
                jump.play();
            }
            
        }
        
        // Si le joueur veut se déplacer vers la gauche 
        if (object.controller.left) {
            object.vx -= this._speedX;
            object.side = "left";
        }
        
        // Si le joueur veut se déplacer vers la droite 
        if (object.controller.right) 
        {
            object.vx += this._speedX;
            object.side = "right";
        
        }

        // Actualiser les différentes constantes physiques pour un comportement réaliste
        object.vy += this._gravity;
        object.posX += object.vx;
        object.posY += object.vy;
        object.vx *= this._groundFriction;        
        object.vy *= this._aerialFriction;

        // Vérifier les collisions
        this.enemiesCollision(object, level)
        this.enemiesObstaclesCollision(level)
        
    }



    // getters
    get objectId(){        
        return this._objectId;
    }
    get width(){
        return this._width;
    }
    get height(){
        return this._height;
    }
    get bonusJump(){
        return this._bonusJump
    }

    // setters
    set objectId(objectId){
        this._objectId = objectId;
    }
    set width(newWidth){
        this._width = newWidth;
    }
    set height(newheight){
        this._height = newheight;
    }
    set bonusJump(newBonusJump){
        this._bonusJump = newBonusJump;
    }
}