
// Fonction de gestion des paramètres sonores
function audioParameters(){

    // récupération des sliders et des boutons du menu paramètre
    let musicOn = document.querySelector("#musicOn");
    let musicOff = document.querySelector("#musicOff");

    let musicSlider = document.querySelector("#musicSlider");
    let musicVolume = document.querySelector("#musicVolume")

    let soundsOn = document.querySelector("#soundsOn");
    let soundsOff = document.querySelector("#soundsOff");

    let soundsSlider = document.querySelector("#soundsSlider");
    let soundsVolume = document.querySelector("#soundsVolume")

    // Récupération de la valeur du localStorage associé à la gestion du volume des musiques
    let musicValue = getLocalStorageData("music");
    // Mettre le volume de toutes les musiques à la valeur récupérée
    musics.forEach(music =>{
        music.volume(musicValue);
    })
    // Positionner le slider et affichée la valeur récupérée dans le localStorage
    musicSlider.value = musicValue;
    musicVolume.textContent = musicValue;
    // Ajouter la bonne couleur au boutons de volume en fonction de la valeur récupérée
    if(musicValue == 0){
        musicOn.style.backgroundColor = "grey"
        musicOff.style.backgroundColor = "red"
    }
    else{
        musicOn.style.backgroundColor = "green"
        musicOff.style.backgroundColor = "grey"
    }


    // Même chose pour les effets sonores
    let soundsValue = getLocalStorageData("sound");
    soundsEffects.forEach(sound =>{
        sound.volume(soundsValue);
    })
    soundsSlider.value = soundsValue;
    soundsVolume.textContent = soundsValue;
    if(soundsValue == 0){
        soundsOn.style.backgroundColor = "grey"
        soundsOff.style.backgroundColor = "red"
    }
    else{
        soundsOn.style.backgroundColor = "green"
        soundsOff.style.backgroundColor = "grey"
    }


    // Ajout d'un écouteur d'événement sur le bouton qui gère l'activation de la musique au clic 
    musicOn.addEventListener("click", e=>{
        console.log("set music on", getLocalStorageData("music"))
        // Pour chaque musique de la liste
        musics.forEach(music =>{
            // Si le volume était à 0 dans le localStorage
            if(getLocalStorageData("music") == 0){
                // Mettre la valeur par défaut à 0.1 dans le localStorage
                setLocalStorageData("music",0.1);
                // Mettre le volume à la valeur du localStorage
                music.volume(getLocalStorageData("music"));
            }
            // Sinon, mettre le volume à la valeur du localStorage
            else{
                music.volume(getLocalStorageData("music"));
            }        
        })
        // Positionner le slider à la valeur du localStorage
        musicSlider.value = getLocalStorageData("music");
        // Afficher la valeur correspondant au slider
        musicVolume.textContent = getLocalStorageData("music");

        // Modifier la couleur des boutons d'activation/désactivation de la musique
        musicOn.style.backgroundColor = "green"
        musicOff.style.backgroundColor = "grey"
    })

    // Ajout d'un écouteur d'événement sur le bouton qui gère la désactivation de la musique au clic
    musicOff.addEventListener("click", e=>{
        console.log("set music off")
        musics.forEach(music =>{

            setLocalStorageData("music", 0);
            music.volume(getLocalStorageData("music"));
        })
        musicSlider.value = 0;
        musicVolume.textContent = getLocalStorageData("music");

        musicOn.style.backgroundColor = "grey"
        musicOff.style.backgroundColor = "red"
    })

    // Ajout d'un écouteur d'événement sur le slider pour enregistrer la valeur dans le localStorage
    musicSlider.addEventListener("change",  e=>{
        console.log(e.target.value);
        // Enregistrer la valeur du slider dans le localStorage
        setLocalStorageData("music", e.target.value)
        // Modifier le volume de toutes les musiques
        musics.forEach(music =>{
            music.volume(getLocalStorageData("music"));
        })
        // Afficher la valeur du slider
        musicVolume.textContent = getLocalStorageData("music");
        // Modifier la couleur des bouton d'activation et de désactivation de la musique
        if(e.target.value == 0){
            musicOn.style.backgroundColor = "grey"
            musicOff.style.backgroundColor = "red"
        }
        else{
            musicOn.style.backgroundColor = "green"
            musicOff.style.backgroundColor = "grey"
        }
        
    })





    // Même chose pour les effets sonores
    soundsOn.addEventListener("click", e=>{
        console.log("set sounds on", getLocalStorageData("sound"))
        soundsEffects.forEach(sound =>{
            if(getLocalStorageData("sound") == 0){
                setLocalStorageData("sound",0.1);
                sound.volume(getLocalStorageData("sound"));
            }
            else{
                sound.volume(getLocalStorageData("sound"));
            } 
        })
        soundsSlider.value = getLocalStorageData("sound");
        soundsVolume.textContent = getLocalStorageData("sound");

        soundsOn.style.backgroundColor = "green"
        soundsOff.style.backgroundColor = "grey"
    })

    soundsOff.addEventListener("click", e=>{
        console.log("set sounds off")
        soundsEffects.forEach(sound =>{

            setLocalStorageData("sound", 0);
            sound.volume(getLocalStorageData("sound"));
        })
        soundsSlider.value = 0;
        soundsVolume.textContent = getLocalStorageData("sound");

        soundsOn.style.backgroundColor = "grey"
        soundsOff.style.backgroundColor = "red"
    })

    soundsSlider.addEventListener("change",  e=>{
        console.log(e.target.value);
        setLocalStorageData("sound", e.target.value)
        soundsEffects.forEach(sound =>{
            sound.volume(getLocalStorageData("sound"));
        })
        soundsVolume.textContent = getLocalStorageData("sound");

        if(e.target.value == 0){
            soundsOn.style.backgroundColor = "grey"
            soundsOff.style.backgroundColor = "red"
        }
        else{
            soundsOn.style.backgroundColor = "green"
            soundsOff.style.backgroundColor = "grey"
        }
        
    })


}


// Fonction pour récupérer une valeur associée à un mot clé dans le localStorage
function getLocalStorageData(key){

    let data = localStorage.getItem(key);

    if(data != null){
        return data;
    }
    else{
        localStorage.setItem(key, 0);
        return localStorage.getItem(key);
    }

}

// Fonction pour enregistrer une valeur dans la localStorage en utilsant une paire clé-valeur
function setLocalStorageData(key, value){

    let data = localStorage.getItem(key);

    if(data == null){
        localStorage.setItem(key, value)
    }
    else if(data === value){
        //do nothing
        console.log("Valeur inchangée dans le localStorage");
    }
    else{
        localStorage.setItem(key, value);
    }
}