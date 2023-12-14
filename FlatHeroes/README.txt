Projet Master 1 Informatique - Flat Heroes
par Adrien ESCOUBEYROU


• Les pages html :

    - Menu principal

        C'est l'accueil du jeu. Il est possible d'y lire les règles, de régler les paramètres audios, de sélectionner un nombre de joueur et de lancer une partie.

    - Page de jeu

        La page sur laquelle se déroule la partie. En fonction du nombre de joueurs sélectionné dans le menu principal, il y a aura plus ou moins de joueurs.
        La roue en haut à droite de l'aire de jeu permet d'ouvrir les paramètres sonores.
        L'inscription en haut à gauche indique le niveau joué.

    (Les pages ne sont pas pleinement responsive, il n'est pas conseillé de lancer le jeu sur téléphone portable ou tablette car les commandes de jeu ne seront pas reconnues s'il n'y a pas de clavier)

• Déroulement d'une partie :

    Les joueurs doivent survivre aux différentes vagues d'ennemis de chaque niveau. Si tous les joueurs sont éliminés, le niveau se termine. Il est possible de relancer le niveau en cours ou de retourner au menu à ce moment là.
    Pour valider un niveau, il faut au moins un joueur en vie. 
    Si tous les niveaux sont passés, la partie est gagnée.

• Type d'ennemis

    Il y a 2 types d'ennemis : les flèches et les missiles. 

    Les flèches se déplacent dans une seule direction et disparaissent au contact d'une surface ou d'un joueur.

    Les missiles suivent le joueur le plus proche et ne disparaissent qu'après avoir touché un joueur ou que leur temps de vie est épuisé. Ce temps est généré aléatoirement mais ne dépasse pas les 10 secondes.
    La vitesse d'un missile varie d'un missile à l'autre, certains sont plus rapides, d'autres plus lents.
    IMPORTANT : Les missiles traversent les murs mais ne peuvent pas sortir de l'aire de jeu.

• Les joueurs :

    Les joueurs sont au maximum 4. Chaque joueur possède une seule vie par niveau. 
    Un joueur perd une vie s'il est touché par un ennemi. 
    Les joueurs peuvent effectuer des sauts. Ces sauts ne peuvent être réinitialisés que si le joueur touche le sol de l'aire de jeu, le dessus ou les bords d'un obstacle ou les paroies de l'aire de jeu.
    Il est possible de sauter plusieurs fois le long des paroies del'aire de jeu ou sur les bords d'un obstacle.

    Un joueur peut se déplacer qu'avec les touches qui lui sont attribuée : vers la gauche, vers la doite ou vers le haut (= saut)

    Touches du clavier attribuées : 
        - joueur 1 (rouge) : q/d/z
        - joueur 2 (bleu) : flèche gauche/flèche droite/flèche haut
        - joueur 3 (jaune) : 4/6/8
        - joueur 4 (orange) : j/l/i

    Les joueurs ne peuvent pas passer à travers les obstacles ni sortir de l'aire de jeu.

    Un joueur n'ayant plus de vie est effacé de l'aire de jeu pour le niveau en cours.

• Les paramètres

    Il est possible de changer le volume des effets sonores et de la musique en ouvrant le menu des paramètres.

    Il est possible d'en couper le sons également.

    Les paramètres ainsi modifiés sont enregistrés pour l'ensemble du jeu (menu principal et jeu).

    Pour fermer les paramètres, il faut cliquer sur le croix.

• Les vagues d'ennemis : 

    Il y a une ou plusieurs vagues d'ennemis pour un niveau. Chaque vague se joue l'une après l'autre.
    Quand tout les ennemis sont éliminés, un message apparait. Il s'écoule 2 secondes avant que le prochain niveau soit lancé.

• Gameover 

    Lorsque tous les joueurs sont éliminés, il est possible de retourner au menu principal ou de relancer le niveau

• Winner 

    Lorsque la partie est gagnée, un message s'affiche et le bouton pour retourner au menu principal s'affiche.

• Les obstacles

    Chaque niveau dispose d'un nombre d'obstacle de couleur, de taille et de position différentes.
    Certains niveaux n'ont d'ailleurs pas d'obstacles.


• Explosion

    Les explosions ne surviennent qu'au moment où un joueur ou un ennemi est éliminé. 


• Le fichier des niveaux : 

    Toutes les données des niveaux sont consignées dans le fichier JSON.
    Pour ajouter un niveau, il suffit d'y ajouter un nouveau tableau en suivant l'architecture des précédents.

    Le tableau "obstacles" contient les données de chaque obstacle du niveau.
    
    Le tableau "enemies" contient les données de chaque vague d'ennemis. Si le pramètre wave contient le même numéro qu'un autre, alors les ennemis seront affichés en même temps.
    Le paramètre "offset" renseigne le décalage entre deux ennemis, pour qu'ils n'apparaissent pas aux même coordonnées. Un offset négatif permettra d'afficher les ennemis dans l'autre sens.
    Le paramètre "apparitionDelay" renseigne le temps d'apparition entre 2 ennemis d'une même vague.
    Le paramètre "direction" ne peut prendre que 4 valeurs : "top", "left", "bottom" ou "right". Il indique la direction vers laquelle un ennemi de type "arrow" se déplacera. Cette valeur n'a pas d'importance pour les ennemis de type "missile".

    Le tableau "spawn" renseigne les coordonnées d'apparition des joueurs et le nombre de vagues du niveau.


• Le principe d'apparition des ennemis : 

    Chaque niveau possède un nombre définit d'ennemis.

    Chaque niveau possède une liste d'ennemis qui est parcouru dans la boucle d'animation.
    Ce tableau est parcouru pour mettre à jour les ennemis.

    Il est enrichit par une boucle qui ajoute des ennemis de façon asynchrone, en fonction du delais d'apparition de chaque vague (voir json)
    Un ennemi éliminé est retiré de ce tableau pour être stocké dans un autre tableau "poubelle".

    On sait qu'un niveau est terminé lorsque le nombre d'ennemis du tableau "poubelle" a atteint le nombre d'ennemi maximum du niveau.
