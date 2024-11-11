import { ClientEvents, ServerEvents } from "../Constant/Events";
import { GameModel } from "../Constant/GameModel";
import EventManager from "../PlayerManager/EventManager";
import { ServerEventsManager } from "../PlayerManager/ServerEventsManager";
import { SocketManager } from "../PlayerManager/SocketManager";

export default class MatchMakingScene extends Phaser.Scene {
    gameWidth: number = 0;
    gameHeight: number = 0;

    constructor() {
      super("MatchMakingScene");
    }
  
    preload() {
      // Set up width and height
      this.gameWidth = this.sys.game.config.width as number;
      this.gameHeight = this.sys.game.config.height as number;
    }
    create() {
      let SplashBG = this.add.sprite(
        this.gameWidth / 2,
        this.gameHeight / 2,
        "MatchMakingBg"
      );
      SplashBG.setOrigin(0.5, 0.5); // Ensure the origin is at the center of the sprite
      SplashBG.setDisplaySize(this.gameWidth, this.gameHeight); // Resize the sprite to match the screen size
      this.registerEvents();
      this.startMatchMaking();
    }
    registerEvents() {
        EventManager.on(ClientEvents.GAME_START, this.onGameStart.bind(this));
    }
    deregisterEvent() {
        EventManager.off(ClientEvents.GAME_START, this.onGameStart.bind(this));
    }
    onGameStart(event: CustomEvent) {
        console.log("Game started! Event data:", event.detail);
        GameModel._playerList=event.detail;
        this.deregisterEvent();
        this.scene.start("FightScene");

    }
   
    
    
    async startMatchMaking() {
        let socket = await SocketManager.getInstance().init();
        ServerEventsManager.getInstance().setSocket(socket);
        SocketManager.getInstance().joinPlayer();
        ServerEventsManager.getInstance().registerServerEvents();
      }
  }