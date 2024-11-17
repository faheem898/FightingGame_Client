import Phaser from "phaser";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import FightSceneSplash from "./scenes/Preloader";
import FightScene from "./scenes/FightScene";
import MatchMakingScene from "./scenes/MatchMakingScene";
import Preloader from "./scenes/Preloader";
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container', // Matches the ID of your game container
  width: 2400,
  height: 1100,
  backgroundColor: 0x000000,
  scene: [Preloader,MatchMakingScene, FightScene, Scene1, Scene2],
  pixelArt: true,
  antialias: false, // Disables anti-aliasing for crisper images
  scale: {
    // mode: Phaser.Scale.RESIZE,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    activePointers: 2, // Allow at least two simultaneous touch points
  },
  plugins: {
    scene: [
      { key: "spine.SpinePlugin", 
        plugin: SpinePlugin, 
        mapping: "spine" },
    ],
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
      }
    ]
  },
  physics: {
    default: 'arcade', // make sure 'arcade' is set as the default physics system
    arcade: {
      //gravity: { y: 0 }, // disable gravity if needed
      debug: false // optional, enable for physics debugging
    }
  },
};

const game = new Phaser.Game(config);