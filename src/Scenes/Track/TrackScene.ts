import Phaser from 'phaser';
import trackGenerator from '../../game-objects/track/trackGenerator';

export default class TrackScene extends Phaser.Scene {
    public cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
    public character!: Phaser.GameObjects.Rectangle; 
    public characterBody!: Phaser.Physics.Arcade.Body;
    private popupContainer: Phaser.GameObjects.Container | null = null;
    private currentObstacleBody: Phaser.Physics.Arcade.Body | null = null;
    private isCollisionActive: boolean = false;
    constructor() {
        super({ key: 'TrackScene' });
    }

    preload(): void {
        
    }

    create(): void {
        // Réinitialisation des variables d'état lors de la création de la scène
        this.popupContainer = null;
        this.currentObstacleBody = null;
        this.isCollisionActive = false;

        const {x, y, bodyArray, obstacleBodyArray, playerWidth} = trackGenerator(this);
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

         // Ajouter la détection des collisions avec les obstacles
        obstacleBodyArray.forEach(obstacleInfo => {
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
    private handleCollision(obstacleInfo: { id: string; body: Phaser.Physics.Arcade.Body; type: string }): void {
        // Sauvegarder le corps de l'obstacle en collision
        this.currentObstacleBody = obstacleInfo.body;

        // Activer le drapeau indiquant qu'une collision est en cours
        this.isCollisionActive = true;

        // Créer une fenêtre contextuelle avec un rectangle blanc et un message
        const popupWidth = 300;
        const popupHeight = 150;
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Rectangle blanc avec bordure bleue
        const background = this.add.rectangle(0, 0, popupWidth, popupHeight, 0xffffff);
        background.setStrokeStyle(2, 0x0000ff);

        // Texte "Hello World"
        const text = this.add.text(0, -30, obstacleInfo.type === "middle" || obstacleInfo.type === "first"  ? `obstacle id : ${obstacleInfo.id}`: 'Vous avez terminer !', {
            fontSize: '18px',
            color: '#000',
            align: 'center',
        });
        text.setOrigin(0.5);

        let button: Phaser.GameObjects.Rectangle;
        let buttonText: Phaser.GameObjects.Text;

        if (obstacleInfo.type === 'last') {
            // Ajouter un bouton "Rejouer" si l'obstacle est de type "last"
            button = this.add.rectangle(0, 30, 120, 40, 0x0000ff).setInteractive();
            buttonText = this.add.text(0, 30, 'Rejouer', {
                fontSize: '16px',
                color: '#fff',
            }).setOrigin(0.5);

            // Gérer l'interaction avec le bouton "Rejouer"
            button.on('pointerdown', () => {
                this.scene.restart(); // Redémarrer la scène
            });
        } else {
            // Ajouter un bouton "OK" pour les autres types d'obstacles
            button = this.add.rectangle(0, 30, 100, 40, 0x0000ff).setInteractive();
            buttonText = this.add.text(0, 30, 'OK', {
                fontSize: '16px',
                color: '#fff',
            }).setOrigin(0.5);

            // Gérer l'interaction avec le bouton "OK"
            button.on('pointerdown', () => {
                this.popupContainer?.destroy();
                this.popupContainer = null;
                if (this.currentObstacleBody) {
                    this.currentObstacleBody.destroy();
                    this.currentObstacleBody = null;
                }
                this.isCollisionActive = false;
                this.characterBody.setImmovable(false);
            });
        }

        // Ajouter le bouton et le texte au conteneur
        this.popupContainer?.add([button, buttonText]);

        this.characterBody.setVelocity(0);
        this.characterBody.setImmovable(true);

        // Conteneur pour la fenêtre contextuelle
        this.popupContainer = this.add.container(centerX, centerY, [background, text, button, buttonText]);
        this.popupContainer.setDepth(20);

        // Désactiver les entrées du personnage pendant que la fenêtre est affichée
        this.characterBody.setVelocity(0);
        this.characterBody.setImmovable(true);
    }
}
