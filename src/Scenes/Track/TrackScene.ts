import Phaser from 'phaser';
import trackGenerator from '../../game-objects/track/trackGenerator';

export default class TrackScene extends Phaser.Scene {
    public cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
    public character!: Phaser.GameObjects.Rectangle; 
    public characterBody!: Phaser.Physics.Arcade.Body;
    constructor() {
        super({ key: 'TrackScene' });
    }

    preload(): void {
        
    }

    create(): void {
        const {x, y, bodyArray, obstacleBodyArray} = trackGenerator(this);
        
        // Création du personnage (carré rouge)
        this.character = this.add.rectangle(x, y, 15, 15, 0xff0000);
        this.physics.add.existing(this.character);
        // Obtenir le corps physique dynamique du personnage
        this.characterBody = this.character.body as Phaser.Physics.Arcade.Body;

        // Configurer le corps physique du personnage
        this.characterBody.setCollideWorldBounds(true); // Permet au personnage de rester dans les limites du monde
        this.characterBody.setImmovable(false); // Le personnage peut se déplacer
        this.characterBody.setSize(15, 15);

          // Ajouter la détection des collisions avec les chemins
          bodyArray.forEach(body => {
              this.physics.add.collider(this.character, body); // Ajouter une collision avec chaque corps
          });

          obstacleBodyArray.forEach(body => {
            this.physics.add.collider(this.character, body); // Ajouter une collision avec chaque corps
        });
        
        // Configurer les touches directionnelles en vérifiant que `this.input.keyboard` n'est pas null
        if (this.input.keyboard) {
            this.cursor = this.input.keyboard.createCursorKeys();
        } else {
            console.error("Clavier non disponible");
        }
    }
    
    update(): void {
       
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
}
