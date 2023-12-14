// Classe pour créer un controller utilisé par le joueur pour se déplacer dans l'aire de jeu
class Controller {

    // Constructeur (paramètres = touches de déplacements)
    constructor(codeKeyLeft, codeKeyRight, codeKeyUp) {
      this._up = false;
      this._right = false;
      this._down = false;
      this._left = false;

      this._keyUp = codeKeyUp;
      this._keyLeft = codeKeyLeft;
      this._keyRight = codeKeyRight;
  
      let keyEvent = (e) => {
        if (e.code == this._keyUp) {
          this.up = e.type == "keydown";
        }
        if (e.code == this._keyRight) {
          this.right = e.type == "keydown";
        }
        if (e.code == this._keyLeft) {          
          this.left = e.type == "keydown";
        }
      };
      addEventListener("keydown", keyEvent);
      addEventListener("keyup", keyEvent);
      addEventListener("mousemove", keyEvent);

      this.resumeKeysControl();
    }

    // getters
    get up() { 
      return this._up; 
    }
    get right(){ 
      return this._right
    }
    get left(){
      return this._left
    }
    get down(){
      return this._down
    }

    get keyLeft(){
        return this._keyLeft;
    }
    get keyRight(){
        return this._keyRight;
    }
    get keyUp(){
        return this._keyUp;
    }

    resumeKeysControl(){
      return ("Touche gauche : "+this._keyLeft+" | Touche droite : "+this._keyRight+" | Touche saut : "+this._keyUp);
    }

    // setters 
    set keysControl([codeKeyLeft, codeKeyRight, codeKeyUp]){
      this._keyUp = codeKeyUp;
      this._keyLeft = codeKeyLeft;
      this._keyRight = codeKeyRight;
    }
    
    set keyLeft(codeKeyLeft){
        this._keyLeft = codeKeyLeft;
    }
    set keyRight(codeKeyRight){
        this._keyRight = codeKeyRight;
    }
    set keyUp(codeKeyUp){
        this._keyUp = codeKeyUp;
    }

    set up(newUp){
      this._up = newUp 
    }
    set down(newDown){
      this._down = newDown;
    }
    set left(newLeft){
      this._left = newLeft;
    }
    set right(newRight){
      this._right = newRight;
    }
}