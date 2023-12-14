// Classe pour créer et gérer des objets particules
class Particle { 

    // Constructeur
    constructor(posX, posY, radius, vx, vy, color) { 
        this.posX = posX; 
        this.posY = posY; 
        this.radius = radius; 
        this.vx = vx; 
        this.vy = vy; 
        this.alpha = 1; 
        this._color = color;
    } 


    // getters
    get posX(){
        return this._posX;
    }
    get posY(){
        return this._posY;
    }
    get radius(){
        return this._radius;
    }
    get vx(){
        return this._vx;
    }
    get vy(){
        return this._vy;
    }
    get alpha(){
        return this._alpha;
    }
    get color(){
        return this._color;
    }

    // setters
    set posX(newPosX) {
        this._posX = newPosX;
    }
    set posY(newPosY) {
        this._posY = newPosY;
    }
    set vx(newVx){
        this._vx = newVx;
    }
    set vy(newVy){
        this._vy = newVy;
    }
    set alpha(newAlpha){
        this._alpha = newAlpha;
    }
    set radius(newRadius){
        this._radius = newRadius;
    }
    set color(newColor){
        this._color = newColor;
    }
    
    // Méthode pour mettre à jour la position d'une particule
    updateParticule(particle, context) { 
        context.drawParticule(particle); 
        this.alpha -= 0.01; 
        this.posX += this.vx; 
        this.posY += this.vy; 
    } 

    // méthode pour gérer l'effet d'explosion 
    explode(particles) { 
      
        particles.forEach((particle, i) => { 
                if (particle.alpha <= 0) { 
                    particles.splice(i, 1); 
                } else particle.update(ctx) 
        })
    }
} 