
// Classe pour créer un objet obstacle
class Obstacle{

    // Constructeur
    constructor(width, height, posX, posY, color){
        this._width = width;
        this._height = height;
        this._posX = posX;
        this._posY = posY;
        this._color = color;
        this._type = "obstacle";
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
    get type(){
        return this._type;
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
    set color(newColor) {
        this._color = newColor;
    }
    set type(newType){
        this._type = newType;
    }
}