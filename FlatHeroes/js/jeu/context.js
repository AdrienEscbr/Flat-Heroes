// Classe pour la création du context et la gestion de ses différents élements
class Context{

    // Constructeur
    constructor(canvasObject){
        this.canvas = document.getElementById(canvasObject.objectId);
        this.context = this.canvas.getContext("2d");        
    }

    // Méthode pour dessiner un joueur dans l'aire de jeu
    drawPlayer(playerObject){
        this.context.save();
        this.context.translate(playerObject.posX, playerObject.posY)
                
        
        this.context.strokeStyle  = playerObject.color;
        this.context.lineWidth = 3;
        this.context.strokeRect(0, 0, playerObject.width, playerObject.height);

        this.context.restore();
    }

    // Méthode pour dessiner un obstacle dans l'aire de jeu
    drawObstacle(obstacleObject){
        this.context.save();
        this.context.translate(obstacleObject.posX, obstacleObject.posY)
                
        this.context.fillStyle = obstacleObject.color;
        this.context.fillRect(0, 0, obstacleObject.width, obstacleObject.height);
                
        this.context.restore();
    }

    // Méthode pour dessiner une particule dans l'aire de jeu
    drawParticule(particleObject) { 
        this.context.save(); 
        //this.context.globalAlpha = this.alpha; 
        this.context.fillStyle = particleObject.color; 
          
        /* Begins or reset the path for  
           the arc created */
        this.context.beginPath(); 
          
        /* Some curve is created*/
        this.context.arc(particleObject.posX, particleObject.posY, particleObject.radius, 0, Math.PI * 2, false); 
  
        this.context.fill(); 
          
        /* Restore the recent canvas context*/
        this.context.restore(); 
    }

    // Méthode pour dessiner un ennemi dans l'aire de jeu
    drawEnemy(enemyObject){
        
        this.context.save();
        
        this.context.translate(enemyObject.posX, enemyObject.posY);

        // Si l'ennemi est de type "arrow", dessiner un triangle pointant dans la direction propre à l'ennemi
        if(enemyObject.type == "arrow"){
            this.context.fillStyle = enemyObject.color;
        
            this.context.beginPath();
    
            switch(enemyObject.direction){
                case "bottom":
                    // Dessiner la pyramide inversée        
                    this.context.moveTo(0, 0); // Coin supérieur gauche
                    // Coin supérieur droit
                    this.context.lineTo(enemyObject.width, 0);
                    // Coin inférieur
                    this.context.lineTo(enemyObject.width / 2, enemyObject.height);
                    // Refermer le triangle en revenant au coin supérieur gauche
                    this.context.lineTo(0, 0);
                break;
    
                case "top":
                    // Dessiner la pyramide
                    this.context.moveTo(0, enemyObject.height); // Coin inférieur gauche
                    // Coin supérieur droit
                    this.context.lineTo(enemyObject.width, enemyObject.height);
                    // Coin supérieur
                    this.context.lineTo(enemyObject.width / 2, 0);
                    // Refermer le triangle en revenant au coin inférieur gauche
                    this.context.lineTo(0, enemyObject.height);
                break;
    
                case "right":
                    // Dessiner la pyramide pointant vers la droite
                    this.context.moveTo(0, 0);
                    this.context.lineTo(enemyObject.width, enemyObject.height / 2);
                    this.context.lineTo(0, enemyObject.height);
                    this.context.lineTo(0, 0);
                break;
    
                case "left":
                    // Dessiner la pyramide pointant vers la gauche
                    this.context.moveTo(enemyObject.width, 0);
                    this.context.lineTo(0, enemyObject.height / 2);
                    this.context.lineTo(enemyObject.width, enemyObject.height);
                    this.context.lineTo(enemyObject.width, 0);
                break;
    
                default:
                    // Dessiner la pyramide inversée        
                    this.context.moveTo(0, 0); // Coin supérieur gauche
                    // Coin supérieur droit
                    this.context.lineTo(enemyObject.width, 0);
                    // Coin inférieur
                    this.context.lineTo(enemyObject.width / 2, enemyObject.height);
                    // Refermer le triangle en revenant au coin supérieur gauche
                    this.context.lineTo(0, 0);
                break;
            }
        }

        // Si l'ennemi est de type "missile", dessiner un triangle orienté pour suivre la trajectoire calculé 
        if(enemyObject.type == "missile"){
            let angle = Math.atan2(enemyObject.velocity.y, enemyObject.velocity.x);


            this.context.rotate(angle);

            // Dessiner une pointe de flèche
            this.context.beginPath();
            this.context.moveTo(0, 0);
            this.context.lineTo(-enemyObject.width / 2, -enemyObject.height / 2);
            this.context.lineTo(-enemyObject.width / 2, enemyObject.height / 2);
            this.context.closePath();
    
            // Remplir la pointe de flèche
            this.context.fillStyle = enemyObject.color;


        }
    
        // Remplir le triangle
        this.context.fill();
    
        this.context.restore();
    
    }

    // Méthode pour nettoyer le canvas
    clearCanvas(canvasObject){
        this.context.clearRect(0, 0, canvasObject.width, canvasObject.height);
    }

    // méthode pour afficher un texte
    drawMessage(message, posX, posY){
        this.context.save();

        this.context.font = "30px Arial";
        this.context.fillStyle  = "white";
        this.context.fillText(message, posX, posY);

        this.context.restore();
    }
}