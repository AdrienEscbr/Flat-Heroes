// Classe pour gérer le fichier JSOn contenant les diffréntes informations de chaque niveau
class JsonFile{
    // Constructeur prenant le chemin vers le fichier 
    constructor(jsonFilePath){
        this._file = jsonFilePath
    }

    // Méthode pour récupérer les tableaux de données de chaque niveau
    getLevels() {

        let levels = [];
    
        var request = new XMLHttpRequest();
        request.open('GET', this._file, false);
        request.send(null);
    
        if (request.status === 200) {
            var jsonData = JSON.parse(request.responseText);
    
            for (var levelKey in jsonData) {
                if (jsonData.hasOwnProperty(levelKey)) {
                    var levelData = jsonData[levelKey];
    
                    levels.push(levelData);
                }
            }    
            
            return levels;
    
        } else {
            console.error('Erreur lors de la récupération des données JSON:', request.status);
            return false;
        }
    }


    // Méthode pour récupérer les données du tableau d'un niveau (données des ennemis, des joueurs ou des obstacles)
    getLevelContent(levelNumber, fileDatas, key){

        // valeurs de key : obstacles, enemies, spawn
        
        let content = [];

        if (fileDatas.length > 0) {

            let levelDatas = fileDatas[levelNumber];
    
            levelDatas.forEach(data => {
                if (key in data) {
                    content.push(...data[key]);
                }
            });
            return content;
        } else {
            console.error("Niveau non trouvé :", levelNumber);
            return false;
        }
        
    }
}