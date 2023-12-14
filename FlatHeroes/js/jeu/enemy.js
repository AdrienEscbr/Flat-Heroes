// Classe pour la création d'un ennemi
class Enemy{
    // Constructeur 
    constructor(width, height, posX, posY, color, type, direction, wave, total, offset, apparitionDelay){
        // taille 
        this._width = width;
        this._height = height;
        // position
        this._posX = posX;
        this._posY = posY;

        this._exist = true;
        this._color = color;
        this._vx = 0;
        this._vy = 0;
        this._type = type;
        this._direction = direction;
        this._wave = wave;
        this._total = total;
        // Décalage (pour que deux ennemis n'apparaissent pas au même endroit si désiré)
        this._offset = offset;
        // temps avant apparition dans l'aire de jeu
        this._apparitionDelay = apparitionDelay;

        // Paramètres physique
        this._velocity = { x: 0, y: 0 };
        this._acceleration = { x: 0.2, y: 0.2 };
        this._maxSpeed = this.generateRandomNumber(5, 8)
        this._maxForce = 0.2;
        // Position de la cible (pour les ennemis "missile")
        this._target = { x: 0, y: 0 };
        // Durer de vie en seconde (chiffre aléatoire entre 2 bornes pour les ennemis "missile")
        this._lifeDuration = 1000 * this.generateRandomNumber(5, 10)
    }


    // Méthode pour générer un nombre aléatoire entre 2 borne
    generateRandomNumber(bmin, bmax) {
        return Math.floor(Math.random() * (bmax - bmin + 1)) + bmin;
    }
    // méthode pour modifier les coordonnées de la cible (pour les "missile") 
    setTarget(targetX, targetY) {
        this._target = { x: targetX, y: targetY };
    }
    // Méthode pour modifier l'accélération des "missiles"
    applyForce(force) {
        this._acceleration.x += force.x;
        this._acceleration.y += force.y;
    }

    // Méthode pour empêcher des "missiles" de se chevaucher (comportement de répulsion)
    avoidEnemies(enemies) {
        for (let otherEnemy of enemies) {
            if (otherEnemy !== this) {
                let distance = Math.sqrt(
                    (this._posX - otherEnemy.posX) ** 2 + (this._posY - otherEnemy.posY) ** 2
                );

                // Si la distance est inférieure à une certaine valeur, appliquer une force de répulsion
                if (distance < 30) {
                    let steer = {
                        x: this._posX - otherEnemy.posX,
                        y: this._posY - otherEnemy.posY
                    };

                    let steerMagnitude = Math.sqrt(steer.x ** 2 + steer.y ** 2);

                    if (steerMagnitude > 0) {
                        steer.x = (steer.x / steerMagnitude) * this.maxForce;
                        steer.y = (steer.y / steerMagnitude) * this.maxForce;

                        this.applyForce(steer);
                    }
                }
            }
        }
    }

    // méthode pour modifier la trajectoire du "missile" pour suivre un joueur
    seek() {
        let desired = {
            x: this._target.x - this._posX,
            y: this._target.y - this._posY
        };

        let distance = Math.sqrt(desired.x * desired.x + desired.y * desired.y);

        if (distance > 0) {
            desired.x = (desired.x / distance) * this._maxSpeed;
            desired.y = (desired.y / distance) * this._maxSpeed;

            // Limiter la force maximale appliquée
            let steer = {
                x: desired.x - this._velocity.x,
                y: desired.y - this._velocity.y
            };

            let steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
            if (steerMagnitude > this._maxForce) {
                steer.x = (steer.x / steerMagnitude) * this._maxForce;
                steer.y = (steer.y / steerMagnitude) * this._maxForce;
            }

            this.applyForce(steer);
        }
    }


    
    
    // getters
    get width(){
        return this._width;
    }
    get height(){
        return this._height;
    }
    get posX(){
        return this._posX;
    }
    get posY(){
        return this._posY;
    }
    get exist(){
        return this._exist;
    }
    get color(){
        return this._color;
    }
    get vx(){
        return this._vx;
    }
    get vy(){
        return this._vy;
    }
    get type(){
        return this._type;
    }
    get direction(){
        return this._direction;        
    }
    get wave(){
        return this._wave;
    }
    get total(){
        return this._total;
    }
    get offset(){
        return this._offset;
    }
    get apparitionDelay(){
        return this._apparitionDelay;
    }
    get velocity(){
        return this._velocity;
    }
    get acceleration(){
        return this._acceleration;
    }
    get maxSpeed(){
        return this._maxSpeed
    }
    get maxForce(){
        return this._maxForce;
    }
    get target(){
        return this._target;
    }
    get lifeDuration(){
        return this._lifeDuration;
    }


    // setters
    set width(newWidth) {
        this._width = newWidth;
    }
    set height(newHeight) {
        this._height = newHeight;
    }
    set posX(newPosX) {
        this._posX = newPosX;
    }
    set posY(newPosY) {
        this._posY = newPosY;
    }
    set exist(boolExist) {
        this._exist = boolExist;
    }
    set color(newColor){
        this._color = newColor;
    }
    set vx(newVx){
        this._vx = newVx;
    }
    set vy(newVy){
        this._vy = newVy;
    }
    set type(newType){
        this._type = newType;
    }
    set direction(newDir){
        this._direction = newDir;
    }
    set wave(newWave){
        this._wave = newWave;
    }
    set total(newTotal){
        this._total = newTotal;
    }
    set offset(newOffset){
        this._offset = newOffset;
    }
    set apparitionDelay(newApparitionDelay){
        this._apparitionDelay = newApparitionDelay;
    }
    set lifeDuration(newLifeDuration){
        this._lifeDuration = newLifeDuration;
    }
    set velocity(newVelocity){
        this._velocity = newVelocity;        
    }
    set acceleration(newAcceleration){
        this._acceleration = newAcceleration;        
    }
    set maxSpeed(newSpeed){
        this._maxSpeed = newSpeed;        
    }
    set maxForce(newForce){
        this._maxForce = newForce;
    }
    set target(newTarget){
        this._target = newTarget;
    }


    resumePos(){
        return("X : "+this._posX+" | Y : "+this._posY);
    }

}