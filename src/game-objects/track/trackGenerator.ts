function trackGenerator(scene: Phaser.Scene) {
    let stickWidth = 50; // Largeur du bâton
    let stickHeight = 220; // Hauteur du bâton
    const numberOfSticks = 1; // Nombre de bâtons pour former le chemin en S
    const obstacleWidth = stickWidth;
    const obstacleHeight = stickWidth / 2;
    const playerWidth = stickWidth / 2;
    const sticksArray = [];
    const bodyArray = [];
    const obstacleArray = [];
    const obstacleBodyArray = [];

    // Position initiale du premier bâton
    let currentX = window.innerWidth /2;
    let currentY = 0;

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

    let obstacle = scene.add.graphics();
    obstacle.fillStyle(0xFFA500, 1); // Couleur orange
    obstacle.fillRect(0, 0, obstacleWidth, obstacleHeight);
    obstacle.x = firstStick.x + stickWidth / 2 - obstacleWidth / 2;
    obstacle.y = firstStick.y + (stickHeight / 2) + stickWidth/2 - obstacleHeight / 2;
    const obstacleInfo = {
        id: "-1",
        obstacle : obstacle,
        type: "first"
    }
    obstacleArray.push(obstacleInfo);

    // Créer un groupe statique pour les corps entourant le premier stick
    const staticBodies = scene.physics.add.staticGroup();
    const obstacleBodies = scene.physics.add.staticGroup();

    // Ajouter un corps physique pour l'obstacle initial
    const firstObstacleBody = obstacleBodies.create(
        obstacle.x + obstacleWidth / 2,
        obstacle.y + obstacleHeight / 2,
        ''
    ).setSize(obstacleWidth, obstacleHeight).setVisible(false);
    const obstacleInfoBody = {
        id: "-1",
        body : firstObstacleBody,
        type: "first"
    }
    obstacleBodyArray.push(obstacleInfoBody);

    // Créer les corps physiques entourant le premier stick
    // Corps physique au-dessus du stick
    const topBody = staticBodies.create(
        currentX + stickWidth / 2, // Centre horizontal aligné avec le stick
        currentY - stickWidth / 2, // Position juste au-dessus du stick
        ''
    ).setSize(stickHeight, stickWidth).setVisible(false);
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
        // Vérifie si c'est le dernier bâton
        const isLastStick = i === numberOfSticks-1;
        let stick = scene.add.graphics();
        stick.fillStyle(0x00ff00, 1);
        stick.lineStyle(2, 0x000000, 1);
        stick.fillRect(0, 0, stickWidth, stickHeight);
        stick.strokeRect(0, 0, stickWidth, stickHeight);
        sticksArray.push(stick);

        if (isHorizontal) {
            stick.setRotation(Phaser.Math.DegToRad(90));
            stick.x = currentX;
            stick.y = currentY;
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
            currentX += -1 * stickWidth;
            currentY += stickHeight;
            isHorizontalLeftDirection = !isHorizontalLeftDirection

            const obstacle = scene.add.graphics();
            obstacle.fillStyle(0xFFA500, 1);
            obstacle.fillRect(0, 0, obstacleHeight, obstacleWidth );
            obstacle.x = currentX + stickWidth / 2 - stickHeight / 2;
            obstacle.y = currentY - stickHeight  - (obstacleWidth - stickWidth);
            const obstacleInfo = {
                id: `${i}`,
                obstacle : obstacle,
                type: "middle"
            }
            obstacleArray.push(obstacleInfo);
            
            const obstacleBody = obstacleBodies.create(
                obstacle.x + obstacleWidth / 2 - obstacleHeight /2,
                obstacle.y + obstacleHeight / 2 + obstacleHeight /2,
                ''
            ).setSize(obstacleHeight, obstacleWidth).setVisible(false);
            const obstacleInfoBody = {
                id: `${i}`,
                body : obstacleBody,
                type: "middle"
            }
            obstacleBodyArray.push(obstacleInfoBody);
        }
        if (!isHorizontal) {
            stick.setRotation(0);
            if(isRight){
                stick.x = isLastStick ? currentX - stickHeight + stickWidth : currentX
                stick.y = currentY;
            }else {
                stick.x = isLastStick ? currentX : currentX - stickHeight + stickWidth;
                stick.y = currentY;
            }            
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

            const obstacle = scene.add.graphics();
            obstacle.fillStyle(0xFFA500, 1); // Couleur orange
            obstacle.fillRect(0, 0, obstacleWidth, obstacleHeight);
            obstacle.x = stick.x + stickWidth / 2 - obstacleWidth / 2;
            obstacle.y = stick.y + (stickHeight / 2) + stickWidth/2 - obstacleHeight / 2;
            const obstacleInfo = {
                id: `${i}`,
                obstacle : obstacle,
                type: "middle"
            }
            obstacleArray.push(obstacleInfo);

            const obstacleBody = obstacleBodies.create(
                obstacle.x + obstacleWidth / 2,
                obstacle.y + obstacleHeight / 2,
                ''
            ).setSize(obstacleWidth, obstacleHeight).setVisible(false);
            const obstacleInfoBody = {
                id: `${i}`,
                body : obstacleBody,
                type: "middle"
            }
            obstacleBodyArray.push(obstacleInfoBody);

            currentX += stickWidth;
            isRight = !isRight;   
        }
        isHorizontal = !isHorizontal;
    }
    if (numberOfSticks % 2 === 0) {
        const lastObstacle = obstacleArray[obstacleArray.length - 2];
        if(lastObstacle){
            lastObstacle.obstacle.clear();
            lastObstacle.obstacle.fillStyle(0x800080, 1); // Couleur violette
            lastObstacle.obstacle.fillRect(0, 0, obstacleWidth, obstacleHeight);
            lastObstacle.type = "last";
            console.log(obstacleArray)
            const lastObstacleBody = obstacleBodyArray[obstacleBodyArray.length - 2];
            if(lastObstacleBody){
                lastObstacleBody.type = "last"
                console.log(obstacleBodyArray)
            }
        }
    }else{
        const lastObstacle = obstacleArray[obstacleArray.length - 1];
        if(lastObstacle){
            lastObstacle.obstacle.clear();
            lastObstacle.obstacle.fillStyle(0x800080, 1); // Couleur violette
            lastObstacle.obstacle.fillRect(0, 0, obstacleWidth, obstacleHeight);
            lastObstacle.type = "last";
            console.log(obstacleArray)
            const lastObstacleBody = obstacleBodyArray[obstacleBodyArray.length - 1];
            if(lastObstacleBody){
                lastObstacleBody.type = "last"
                console.log(obstacleBodyArray)
            }
        }

    }

    return {
        x: firstStick.x + stickWidth / 2,
        y: firstStick.y + playerWidth,
        bodyArray: bodyArray,
        obstacleBodyArray: obstacleBodyArray,
        obstacleArray: obstacleArray,
        playerWidth: playerWidth
    };
}

export default trackGenerator;
