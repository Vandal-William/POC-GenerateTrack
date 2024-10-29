import Phaser from 'phaser';
import questionData from '../../data/questionsData';
import { Obstacle } from '../../types/type';
import trackGenerator from '../../game-objects/track/trackGenerator';

export default class TrackScene extends Phaser.Scene {
    public cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
    public character!: Phaser.GameObjects.Rectangle; 
    public characterBody!: Phaser.Physics.Arcade.Body;
    private popupContainer: Phaser.GameObjects.Container | null = null;
    private currentObstacleBody: Phaser.Physics.Arcade.Body | null = null;
    private isCollisionActive: boolean = false;
    private score: number = 0; 
    constructor() {
        super({ key: 'TrackScene' });
    }

    preload(): void {
        // Charger les questions
        questionData.loadQuestionData();
    }

    create(): void {
        // Réinitialisation des variables d'état lors de la création de la scène
        this.popupContainer = null;
        this.currentObstacleBody = null;
        this.isCollisionActive = false;
        this.score = 0;
        // Associer chaque obstacle à une question unique
        const questions = JSON.parse(localStorage.getItem('questionData') || '[]');
        let questionIndex = 0;

        const {x, y, bodyArray, obstacleBodyArray, playerWidth} = trackGenerator(this, questions.length);
        // Création du personnage (carré rouge)
        this.character = this.add.rectangle(x, y, playerWidth, playerWidth, 0xff0000);
        this.physics.add.existing(this.character);
        // Obtenir le corps physique dynamique du personnage
        this.characterBody = this.character.body as Phaser.Physics.Arcade.Body;

        // Configurer le corps physique du personnage
        this.characterBody.setCollideWorldBounds(true); // Permet au personnage de rester dans les limites du monde
        this.characterBody.setImmovable(false); // Le personnage peut se déplacer
        this.characterBody.setSize(playerWidth, playerWidth);

        // Ajouter la détection des collisions avec les chemins
        bodyArray.forEach(body => {
            this.physics.add.collider(this.character, body); // Ajouter une collision avec chaque corps
        });

        obstacleBodyArray.forEach((obstacleInfo) => {
            // Si l'obstacle n'est pas de type "last" et qu'il reste des questions à associer
            if (obstacleInfo.type !== 'last' && questionIndex < questions.length) {
                // Associer la question à l'obstacle dans l'ordre
                obstacleInfo.question = questions[questionIndex];
                questionIndex += 1; // Passer à la question suivante
            }
            this.physics.add.collider(this.character, obstacleInfo.body, () => {
                // Assurez-vous que nous n'avons pas déjà une collision en cours
                if (!this.popupContainer && !this.currentObstacleBody) {
                    this.handleCollision(obstacleInfo);
                }
            });
        });
        
        // Configurer les touches directionnelles en vérifiant que `this.input.keyboard` n'est pas null
        if (this.input.keyboard) {
            this.cursor = this.input.keyboard.createCursorKeys();
        } else {
            console.error("Clavier non disponible");
        }
    }
    
    update(): void {

        // Si une collision est active, ne pas permettre le mouvement du personnage
        if (this.isCollisionActive) {
            return;
        }
          // Vitesse de déplacement du personnage
          const speed = 100;

          // Réinitialiser la vélocité du personnage à chaque frame
          this.characterBody.setVelocity(0);
  
          // Vérifier quelles touches sont enfoncées et ajuster la vélocité
          if (this.cursor.left?.isDown) {
              this.characterBody.setVelocityX(-speed);
          } else if (this.cursor.right?.isDown) {
              this.characterBody.setVelocityX(speed);
          }
  
          if (this.cursor.up?.isDown) {
              this.characterBody.setVelocityY(-speed);
          } else if (this.cursor.down?.isDown) {
              this.characterBody.setVelocityY(speed);
          }
        
    }
    private handleCollision(obstacleInfo: Obstacle): void {
        this.currentObstacleBody = obstacleInfo.body;
        this.isCollisionActive = true;
    
        const popupWidth = 800;
        const popupHeight = 500;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
    
        // Créer le fond de la fenêtre contextuelle
        const background = this.add.rectangle(0, 0, popupWidth, popupHeight, 0xffffff);
        background.setStrokeStyle(2, 0x0000ff);
    
        // Texte de la question ou message de fin
        const questionText = this.add.text(0, -100, 
            obstacleInfo.type === 'last' ? 'Vous avez terminé !' : (obstacleInfo.question ? obstacleInfo.question.text : 'Pas de question trouvée'), 
            {
                fontSize: '18px',
                color: '#000',
                align: 'center',
                wordWrap: { width: popupWidth - 20 }
            }
        ).setOrigin(0.5);
    
        // Initialiser le tableau des boutons et calculer la hauteur maximale
        const buttons: (Phaser.GameObjects.Text | Phaser.GameObjects.Rectangle)[] = [];
        let maxHeight = 30;  // Hauteur de base
        let scoreText: Phaser.GameObjects.Text | null = null;  // Variable pour afficher le score
    
        if (obstacleInfo.type === 'last') {
            const buttonWidth = 200;
            const buttonText = this.add.text(0, 30, 'Rejouer', {
                fontSize: '16px',
                color: '#fff',
                align: 'center',
                wordWrap: { width: buttonWidth - 20 }  // Wrap texte dans les limites du bouton
            }).setOrigin(0.5);
    
            // Calculer la hauteur du bouton au texte
            maxHeight = Math.max(maxHeight, buttonText.height + 10);
            const button = this.add.rectangle(0, 30, buttonWidth, maxHeight, 0x0000ff).setInteractive();
    
            // Gérer l'interaction avec le bouton "Rejouer"
            button.on('pointerdown', () => {
                this.scene.restart(); // Redémarre la scène
            });
    
            // Afficher le score au-dessus du bouton si l'obstacle est de type "last"
            scoreText = this.add.text(0, -40, `Score final : ${this.score}`, {
                fontSize: '20px',
                color: '#000',
                align: 'center'
            }).setOrigin(0.5);
    
            buttons.push(button, buttonText);
        } else if (obstacleInfo.question?.responces && obstacleInfo.question.responces.length > 0) {
            // Pré-calcul des hauteurs de texte
            const buttonWidth = 200;
    
            // Mesurer la hauteur maximale requise pour les boutons
            obstacleInfo.question.responces.forEach((response) => {
                const tempText = this.add.text(0, 0, response.text, {
                    fontSize: '14px',
                    color: '#fff',
                    wordWrap: { width: buttonWidth - 20 }
                }).setVisible(false);  // Temporairement caché pour mesurer
                maxHeight = Math.max(maxHeight, tempText.height + 10);  // Mise à jour de la hauteur maximale avec marge
                tempText.destroy();  // Nettoyer le texte temporaire
            });

            // Fonction pour mélanger un tableau
            function shuffleArray<T>(array: T[]): T[] {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            const shuffledResponses = shuffleArray([...obstacleInfo.question.responces]);
            // Créer les boutons avec la hauteur maximale ajustée
            shuffledResponses.forEach((response, index) => {
                const isLeftColumn = index % 2 === 0;
                const buttonX = isLeftColumn ? -150 : 150;
                const buttonY = -20 + Math.floor(index / 2) * (maxHeight + 10);
    
                const buttonText = this.add.text(buttonX, buttonY, response.text, {
                    fontSize: '14px',
                    color: '#fff',
                    align: 'center',
                    wordWrap: { width: buttonWidth - 20 }
                }).setOrigin(0.5);
    
                const button = this.add.rectangle(buttonX, buttonY, buttonWidth, maxHeight, 0x0000ff).setInteractive();
                
                button.on('pointerdown', () => {
                    // Incrémenter le score si la réponse est correcte
                    if (response.isCorrect && obstacleInfo.question?.scoreGive) {
                        this.score += obstacleInfo.question.scoreGive;
                    }
    
                    // Détruire les anciens messages, s'il y en a
                    this.popupContainer?.getByName('feedbackText')?.destroy();
    
                    // Affichage du message de retour
                    const feedbackText = this.add.text(0, 150, response.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !', {
                        fontSize: '16px',
                        color: response.isCorrect ? '#00ff00' : '#ff0000',
                        align: 'center'
                    }).setOrigin(0.5).setName('feedbackText');
    
                    // Ajouter le message de retour à la popup
                    this.popupContainer?.add(feedbackText);
    
                    // Détruire tous les éléments après 5 secondes
                    this.time.delayedCall(800, () => {
                        this.popupContainer?.destroy();
                        this.popupContainer = null;
                        if (this.currentObstacleBody) {
                            this.currentObstacleBody.destroy();
                            this.currentObstacleBody = null;
                        }
                        this.isCollisionActive = false;
                        this.characterBody.setImmovable(false);
                    });
                });
    
                buttons.push(button, buttonText);
            });
        } else {
            console.warn('Pas de réponses disponibles pour cette question.');
        }
    
        // Ajout des éléments de la fenêtre contextuelle dans le conteneur, en filtrant les null
        const popupElements = [background, questionText, scoreText, ...buttons].filter(item => item !== null) as (Phaser.GameObjects.Text | Phaser.GameObjects.Rectangle)[];
        this.popupContainer = this.add.container(centerX, centerY, popupElements);

        this.popupContainer.setDepth(20);
    
        // Désactiver le mouvement du personnage pendant l'affichage de la fenêtre
        this.characterBody.setVelocity(0);
        this.characterBody.setImmovable(true);
    }
    

             
    
}
