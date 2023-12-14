// Classe pour créer un objet joueur
class Player{

    // Constructeur
    constructor(width, height, posX, posY, color, score, lives, controller){
        this._width = width;
        this._height = height;
        this._posX = posX;
        this._posY = posY;
        this._color = color;
        // this._score = score;

        this._jumping = 1;
        this._lives = lives;

        // Attribue un objet conroller au joueur pour les déplacements
        this._controller = controller;

        this._vx = 0;
        this._vy = 0;

        this._side = null;

        this._type = "player"; 

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
    get color(){
        return this._color;
    }
    // get score(){
    //     return this._score;
    // }
    get jumping(){
        return this._jumping;
    }
    get vx(){
        return this._vx;
    }
    get vy(){
        return this._vy;
    }
    get controller(){
        return this._controller;
    }
    get side(){
        return this._side;
    }
    get lives(){
        return this._lives;
    }
    get type(){
        return this._type;
    }


    //setters
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
    set color(newColor) {
        this._color = newColor;
    }
    // set score(newScore) {
    //     this._score = newScore;
    // }
    set jumping(newJumping){
        this._jumping = newJumping;
    }
    set vx(newVx){
        this._vx = newVx;
    }
    set vy(newVy){
        this._vy = newVy;
    }
    set controller(newController){
        this._controller = newController;
    }
    set side(newSide){
        this._side = newSide;
    }
    set lives(newLives){
        this._lives = newLives;
    }
    set type(newType){
        this._type = newType;
    }


    resumePos(){
        return("X : "+this._posX+" | Y : "+this._posY);
    }


    

}