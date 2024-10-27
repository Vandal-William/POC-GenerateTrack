function trackGenerator(scene: Phaser.Scene) {
    let stickWidth = 30; // Largeur du bâton
    let stickHeight = 100; // Hauteur du bâton
    const numberOfSticks = 6; // Nombre de bâtons pour former le chemin en S
    const sticksArray = [];
    const bodyArray = [];

    // Position initiale du premier bâton
    let currentX = 500;
    let currentY = 100;

    let isHorizontal = false; // Alterne entre horizontal et vertical
    let isRight = false
    let isHorizontalLeftDirection = true

    // Créer le premier bâton manuellement (vertical)
    let firstStick = scene.add.graphics();
    firstStick.fillStyle(0x00ff00, 1); // Vert rempli
    firstStick.lineStyle(2, 0x000000, 1); // Bordure noire de 2px
    firstStick.fillRect(0, 0, stickWidth, stickHeight);
    firstStick.strokeRect(0, 0, stickWidth, stickHeight);
    firstStick.setRotation(0); // Le premier bâton est vertical
    firstStick.x = currentX;
    firstStick.y = currentY;

    // Créer un groupe statique pour les corps entourant le premier stick
    const staticBodies = scene.physics.add.staticGroup();

    // Créer les corps physiques entourant le premier stick
    // Corps physique au-dessus du stick
    const topBody = staticBodies.create(
        currentX + stickWidth / 2, // Centre horizontal aligné avec le stick
        currentY - stickWidth / 2, // Position juste au-dessus du stick
        ''
    ).setSize(stickWidth, stickWidth).setVisible(false);
    bodyArray.push(topBody)
    // Corps à gauche du stick
    const leftBody = staticBodies.create(
        currentX - stickWidth / 2, // Position juste à gauche du stick
        currentY + stickHeight / 2, // Centre vertical aligné avec le stick
        ''
    ).setSize(stickWidth, stickHeight).setVisible(false);
    bodyArray.push(leftBody)
    // Corps à droite du stick
    const rightBody = staticBodies.create(
        currentX + stickWidth + stickWidth / 2, // Position juste à droite du stick
        currentY + stickHeight / 2, // Centre vertical aligné avec le stick
        ''
    ).setSize(stickWidth, stickHeight).setVisible(false);
    bodyArray.push(rightBody)
    // Ajuste la position pour le prochain bâton
    currentY += stickHeight;

    for (let i = 0; i < numberOfSticks; i++) {
        // Créer un objet Graphics pour chaque bâton
        let stick = scene.add.graphics();

        // Définir couleur de remplissage verte et bordure noire
        stick.fillStyle(0x00ff00, 1); // Vert rempli
        stick.lineStyle(2, 0x000000, 1); // Bordure noire de 2px

        // Vérifie si c'est le dernier bâton et `numberOfSticks` est pair
        const isLastStick = i === numberOfSticks-1;

        // Dessiner le rectangle
        stick.fillRect(0, 0, stickWidth, stickHeight);
        stick.strokeRect(0, 0, stickWidth, stickHeight);
        sticksArray.push(stick);

        if (isHorizontal) {
            // Bâton horizontal, rotation 90 degrés
            stick.setRotation(Phaser.Math.DegToRad(90));
            // Position du stick
            stick.x = currentX;
            stick.y = currentY;
            // Ajouter les 4 corps physiques autour du bâton horizontal
            if(isHorizontalLeftDirection){

                const topBody = staticBodies.create(
                    currentX - (stickHeight / 2) - stickWidth,
                    currentY - stickWidth / 2,
                    ''
                ).setSize(stickHeight, stickWidth).setVisible(false);
                bodyArray.push(topBody);
    
                const bottomBody = staticBodies.create(
                    currentX - (stickHeight / 2) + stickWidth,
                    currentY + stickWidth + stickWidth / 2,
                    ''
                ).setSize(stickHeight, stickWidth).setVisible(false);
                bodyArray.push(bottomBody);

            }else{

                const topBody = staticBodies.create(
                    currentX - (stickHeight / 2) + stickWidth,
                    currentY - stickWidth / 2,
                    ''
                ).setSize(stickHeight, stickWidth).setVisible(false);
                bodyArray.push(topBody);
    
                const bottomBody = staticBodies.create(
                    currentX - (stickHeight / 2) - stickWidth,
                    currentY + stickWidth + stickWidth / 2,
                    ''
                ).setSize(stickHeight, stickWidth).setVisible(false);
                bodyArray.push(bottomBody);
            }

            const leftBody = staticBodies.create(
                currentX - stickHeight - stickWidth / 2,
                currentY + stickWidth / 2,
                ''
            ).setSize(stickWidth, stickWidth).setVisible(false);
            bodyArray.push(leftBody);

            const rightBody = staticBodies.create(
                currentX + stickWidth / 2,
                currentY + stickWidth / 2,
                ''
            ).setSize(stickWidth, stickWidth).setVisible(false);
            bodyArray.push(rightBody);
            // Placement à gauche ou à droite du bâton vertical précédent
            currentX += -1 * stickWidth; // Se déplace latéralement
            currentY += stickHeight; // Avance vers le bas pour connexion
            isHorizontalLeftDirection = !isHorizontalLeftDirection
        } 
        if (!isHorizontal) {
            // Bâton vertical
            stick.setRotation(0);
            
            if(isRight){
                // Position du stick
                stick.x = isLastStick ? currentX - stickHeight + stickWidth : currentX
                stick.y = currentY;
            }else {
                // Position du stick
                stick.x = isLastStick ? currentX : currentX - stickHeight + stickWidth;
                stick.y = currentY;
            }

             // Ajouter les 2 corps physiques autour du bâton vertical (droite et gauche)
             const leftBody = staticBodies.create(
                stick.x - stickWidth / 2,
                isLastStick ? stick.y + stickHeight / 2 : stick.y + (stickHeight / 2) + stickWidth / 2,
                ''
            ).setSize(stickWidth, isLastStick ? stickHeight : stickHeight - stickWidth).setVisible(false);
            bodyArray.push(leftBody);

            const rightBody = staticBodies.create(
                stick.x + stickWidth + stickWidth / 2,
                isLastStick ? stick.y + stickHeight / 2 : stick.y + (stickHeight / 2) + stickWidth / 2,
                ''
            ).setSize(stickWidth, isLastStick ? stickHeight : stickHeight - stickWidth).setVisible(false);
            bodyArray.push(rightBody);

            currentX += stickWidth;
            isRight = !isRight

            
        }
        // Alterne orientation pour le prochain bâton et inverse direction
        isHorizontal = !isHorizontal;
    }
    return {
        x: firstStick.x + stickWidth / 2,
        y: firstStick.y + stickHeight / 2,
        bodyArray: bodyArray
    };
}

export default trackGenerator;
