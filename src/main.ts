import Phaser from 'phaser';
import TrackScene from './Scenes/Track/TrackScene';
import '../index.css'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH 
  },
  physics: {
    default: 'arcade', // Active le moteur de physique arcade
    arcade: {
      debug: false // Active le mode debug pour voir les corps physiques
    }
  },
  scene: [TrackScene]
};
const game = new Phaser.Game(config);
// écouter le redimensionnement de la fenêtre et ajuster les éléments du jeu
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});
