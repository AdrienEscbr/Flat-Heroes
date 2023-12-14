function init(){
    console.log("Page loaded and DOM is ready !");

    // Chargement des sons et des musiques
    loadSounds()
    // Lancer la musique du menu
    menu.play();

    // Cacher la section des règles du jeu
    let rulesContainer = document.querySelector(".rules");
    rulesContainer.style.display = "none";

    // Cacher la section des règles lorsqu'on clique sur le bouton accueil
    let homeContainer = document.querySelector(".main_container")
    let homeButton = document.querySelector("#home");
    homeButton.addEventListener("click", e => {
        if(homeContainer.style.display == "none"){
            homeContainer.style.display = "flex";
            rulesContainer.style.display = "none";
            
        }
    })
    // Jouer l'effet sonore lorsque la souris passe sur le bouton
    homeButton.addEventListener("mouseover", e =>{
        hoverEffect.play();
    })
    
    // Cacher la section du menu lorsqu'on clique sur le bouton règles
    let rulesButton = document.querySelector("#rules");
    rulesButton.addEventListener("click", e => {
        if(rulesContainer.style.display == "none"){
            rulesContainer.style.display = "flex";
            homeContainer.style.display = "none";
            
        }
    })
    // Jouer l'effet sonore lorsque la souris passe sur le bouton
    rulesButton.addEventListener("mouseover", e =>{
        hoverEffect.play();
    })

    // Afficher le menu des paramètres lorsqu'on clique sur le bouton paramètres
    let parameters = document.querySelector("#parameters");
    parameters.addEventListener("click", e => {
        let parametersPage = document.querySelector(".parameters");
        parametersPage.style.transform = "translateX(0px)";
    })
    // Jouer l'effet sonore lorsque la souris passe sur le bouton
    parameters.addEventListener("mouseover", e =>{
        hoverEffect.play();
    })

    // Fermer le menu des paramètres lorsqu'on clique sur l'icone de croix
    let close = document.querySelector("#close");
    close.addEventListener("click", e=>{
        let parametersPage = document.querySelector(".parameters");
        parametersPage.style.transform = "translateX(527px)";
    })

    // Charger la page de jeu lorsqu'on clique sur le bouton jouer
    let playButton = document.querySelector("#playButton");
        playButton.addEventListener("click", e => {
        window.location.href = "../../jeu.html";
    })
    // Jouer l'effet sonore lorsque la souris passe sur le bouton
    playButton.addEventListener("mouseover", e =>{
        hoverEffect.play();
    })

    // Lorsqu'un des boutons radio est sélectionner, mettre à jour la valeur du localStorage
    document.body.addEventListener("change", e =>{
        console.log(e.target.value);
        setLocalStorageData("nbPlayers", e.target.value);
    })
    
    // Appel de la fonction de redimensionnement
    resizeMain();

    // Appel de la fonction de gestion des paramètres sonores du menu des paramètres
    audioParameters();
    
    // Appel de la fonction de redimensionnement lorsque les dimensions de la page changent
    window.onresize = resizeMain;
    
}

// Appel de la fonction une fois que la page est chargée
window.onload = init;


// Fonction de réajustement des dimensions pour la section principale du menu
function resizeMain(){
    let header = document.querySelector("#header");
    let headerHeight = header.offsetHeight;
    let footer = document.querySelector("#footer");
    let footerPosY = footer.offsetTop;

    let height = footerPosY-headerHeight;
    let main = document.querySelector("#main");
    
    let mainContent = document.querySelector(".main_container")
    mainContent.style.height = height+"px";

    let rulesContent = document.querySelector(".rules")
    rulesContent.style.height = height+"px";

    let paramtersContent = document.querySelector(".parameters")
    paramtersContent.style.height = height+"px";

    main.style.height = height+"px";
}


