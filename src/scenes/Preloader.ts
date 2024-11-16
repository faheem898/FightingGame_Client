import { ProgressBar } from "../components/ProgressBar";
import { SpriteObject } from "../components/SpriteObject";
import { TextObject } from "../components/TextObject";
import { BgJsonData, CharacterJsonData, fightSceneTexture } from "../Constant/AssetManager";
import { PlayerName, PlayerPosition } from "../Constant/GameConstant";
import { GameModel } from "../Constant/GameModel";
import { ServerEventsManager } from "../PlayerManager/ServerEventsManager";
import { SocketManager } from "../PlayerManager/SocketManager";

export default class Preloader extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  progressBarFill: any;
  progressBarBase: any;

  SplashTexture: string[] = ["SplashBg.png", "PlayNow.png", "SplashFiller.png", "SplashBarBase.png", "Character/MiFrens.svg", "Character/Pepe.svg", "Character/Bonk.svg", "Character/Dodge.svg"];
  constructor() {
    super("Preloader");
  }

  preload() {
    // Set up width and height
    this.gameWidth = this.sys.game.config.width as number;
    this.gameHeight = this.sys.game.config.height as number;
    this.SplashTexture.forEach((element) => {
      const imageKey = element.split(".")[0];
      const imageAddress = `assets/GameUI/${element}`;
      console.log("Image Key : ", imageKey, imageAddress);
      this.load.image(imageKey, imageAddress);
    });
    BgJsonData.forEach((element) => {
      this.load.spineJson(element.spineKey, `assets/SpineAnimation/${element.json}`);
      this.load.spineAtlas(`${element.spineKey}-atlas`, `assets/SpineAnimation/${element.atlas}`);
    });
    CharacterJsonData.forEach((element) => {
      this.load.spineJson(element.spineKey, `assets/SpineAnimation/${element.json}`);
      this.load.spineAtlas(`${element.spineKey}-atlas`, `assets/SpineAnimation/${element.atlas}`);
      // console.log("Json Key : ", element.spineKey, element.json, element.atlas);
    });
    fightSceneTexture.forEach((element) => {
      const imageKey = element.split(".")[0];
      const imageAddress = `assets/GameUI/${element}`;
      //console.log("Image Key : ", imageKey, imageAddress);
      this.load.image(imageKey, imageAddress);
    });
     //this.openDogeAnim();
    //this.setProgressBar();
  }
  create() {
    let SplashBG = this.add.sprite(this.gameWidth / 2, this.gameHeight / 2, "SplashBg");
    SplashBG.setOrigin(0.5, 0.5); // Ensure the origin is at the center of the sprite
  //  SplashBG.setDisplaySize(window.innerWidth, window.innerHeight); // Resize the sprite to match the screen size
    //this.setPlayNowBtn();
    //this.resizeBackground(SplashBG);
    //this.fitHeight();
    SplashBG.setDisplaySize(2450, this.gameHeight);
    this.setCharacterBtn();
    // this.setTopPanel();

    // this.setTopPanel1(PlayerPosition.LeftPlayer);
    // this.setTopPanel1(PlayerPosition.RightPlayer);

    // let pla=this.add.spine(
    //   this.gameWidth / 2,
    //   this.gameHeight,
    //   "Bonk",
    //   `Bonk-atlas`
    //   // "CityStage-atlas"
    // );
    // pla.animationState.setAnimation(0,"5.Idle_Tension",true);
    // pla.setScale(0.5,0.5)
  }


fitHeight() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Base height and width of the game (your design resolution)
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Calculate the scaling factor to fit the height
    const scaleFactor = windowHeight / baseHeight;

    // Apply the scale factor to the game canvas
    const newWidth = Math.ceil(baseWidth * scaleFactor);
    const newHeight = windowHeight;

    // Resize the game canvas to fit the new dimensions
    //this.scale.resize(newWidth, newHeight);

    // Optionally, adjust the camera to center the content
    console.log("Scale Factor : ",scaleFactor)
    this.cameras.main.setZoom(1.2);
    this.cameras.main.centerOn(baseWidth / 2, baseHeight / 2);
}

  resizeBackground(SplashBG:any) {
    const gameWidth = this.scale.width; // Fixed game width (1920)
    const gameHeight = this.scale.height; // Fixed game height (1080)
    const windowWidth = window.innerWidth; // Actual window width
    const windowHeight = window.innerHeight; // Actual window height

    // Determine scale factor to fit background to window
    const bgScaleX = windowWidth / gameWidth;
    const bgScaleY = windowHeight / gameHeight;
    const scale = Math.max(bgScaleX, bgScaleY); // Use the larger scale to fill the window

    SplashBG.setScale(scale); // Scale the background
    SplashBG.setPosition(0, 0); // Reset position to (0, 0) for proper alignment
}
  openDogeAnim() {
    this.load.spineJson("Doge", `assets/SpineAnimation/Character/Doge/character2.json`);
    this.load.spineAtlas(`Doge-atlas`, `assets/SpineAnimation/Character/Doge/character2.atlas.txt`);
    
    
      // this.load.spineJson(element.spineKey, `assets/SpineAnimation/${element.json}`);
      // this.load.spineAtlas(`${element.spineKey}-atlas`, `assets/SpineAnimation/${element.atlas}`);
      // console.log("Json Key : ", element.spineKey, element.json, element.atlas);
  }
  setProgressBar() {
    try {
      this.progressBarBase = this.add.sprite(this.gameWidth / 2, this.gameHeight - 50, "SplashBarBase");
      this.progressBarBase.setOrigin(0.5, 0.5);
      this.progressBarBase.setDisplaySize(604, 10); // Set the size of the background bar
      this.progressBarFill = this.add.sprite(this.gameWidth / 2 - 200, this.gameHeight - 50, "SplashFiller");
      this.progressBarFill.setOrigin(0, 0.5); // Set the origin to the left side for scaling
      this.progressBarFill.setDisplaySize(0, 10); // Initially set the width to 0 (empty)

      // Track progress of loading assets
      this.load.on("progress", (percentage: number) => {
        console.log("On Progress : ", percentage);
        // Update the width of the progress bar fill based on the loading progress
        this.progressBarFill.setDisplaySize(604 * percentage, 10); // Scale the width based on the percentage
      });

      // When loading is complete, show the PlayNow button
      this.load.on("complete", () => {
        console.log("On Complete : ");
        //this.setPlayNowBtn();
      });
    } catch (error) {}
  }
  async setPlayNowBtn() {
    try {
      let playNow = this.add.sprite(this.gameWidth / 2, this.gameHeight - 50, "PlayNow");
      playNow.setInteractive();
      // Add an event listener for when the sprite is clicked (pointerdown or pointerup)
      playNow.on("pointerdown", () => {
        // When clicked, start the fight scene
        console.log("Play Now");
        this.scene.start("MatchMakingScene");
      });
    } catch (error) {}
  }
  async setCharacterBtn() {
    try {
      let Mifren = this.add.sprite(this.gameWidth / 2 + 100, 120, "Character/MiFrens");
      let Pepe = this.add.sprite(this.gameWidth / 2 + 290, 120, "Character/Pepe");
      let Bonk = this.add.sprite(this.gameWidth / 2 - 100, 120, "Character/Bonk");
     // let Doge = this.add.sprite(this.gameWidth / 2 - 290, 120, "Character/Dodge");
      Mifren.setScale(0.75);
      Pepe.setScale(0.75);
      Bonk.setScale(0.75);
     // Doge.setScale(0.75);
      Mifren.setInteractive();
      Pepe.setInteractive();
      Bonk.setInteractive();
      //Doge.setInteractive();
      Mifren.on("pointerdown", () => {
        console.log("Mifren pointerdown");
        GameModel._characterName = PlayerName.SirMifriend;
        this.scene.start("MatchMakingScene");
      });
      Pepe.on("pointerdown", () => {
        console.log("Pepe pointerdown");
        GameModel._characterName = PlayerName.Pepe;
        this.scene.start("MatchMakingScene");
      });
      Bonk.on("pointerdown", () => {
        console.log("Bonk pointerdown");
        GameModel._characterName = PlayerName.Bonk;
        this.scene.start("MatchMakingScene");
      });
      // Doge.on("pointerdown", () => {
      //   console.log("Doge pointerdown");
      //   GameModel._characterName = PlayerName.Doge;
      //   this.scene.start("MatchMakingScene");
      // });
    } catch (error) {}
  }

  setTopPanel() {
    let progressBar = new ProgressBar(this, 0, -5, "TopUI/EmptyBar", "TopUI/FilledBar");
    let specialPowerBar = new ProgressBar(this, -68, 8, "TopUI/SpecialBase", "TopUI/SpecialBar");
    let playerIcon = new SpriteObject(this, -190, 0, "TopUI/Icon1");
    let nameBg = new SpriteObject(this, -130, -19, "TopUI/PlayerName");
    let blockChain = new SpriteObject(this, -165, 30, "TopUI/BlockChain");
    let coin = new SpriteObject(this, -145, 22, "TopUI/Coin");
    let wagerFee = new SpriteObject(this, -125, 22, "TopUI/WagerFee");
    let nameText = new TextObject(this, -150, -25, "Faheem");
    let wagerFeeText = new TextObject(this, -130, 15, "5000");
    let specialPowerText = new TextObject(this, -50, 0, "0/10");
    let healthText = new TextObject(this, 100, -25, "300/300");
    nameText.setFont("12px");
    wagerFeeText.setFont("12px");
    nameBg.setScale(1.25, 1.25);
    const panelContainer = this.add.container(this.gameWidth / 2 - 200, 50);
    panelContainer.add(progressBar);
    panelContainer.add(nameBg);
    panelContainer.add(specialPowerBar);
    panelContainer.add(wagerFee);
    panelContainer.add(wagerFeeText);
    panelContainer.add(coin);
    panelContainer.add(playerIcon);
    panelContainer.add(nameText);
    panelContainer.add(blockChain);

    //progressBar.setSize(300,12);
    //  progressBar.setFillerOrigin(1);
    progressBar.updateProgress(0.7);
    //wagerFee.setSize(78,18);
    // panelContainer.scaleX=(-1)
  }
  setTopPanel1(playerPosition: PlayerPosition) {
    const _posDiff = playerPosition === PlayerPosition.LeftPlayer ? -1 : 1;
    let progressBar = new ProgressBar(this, 0, -5, "TopUI/EmptyBar", "TopUI/FilledBar");
    let specialPowerBar = new ProgressBar(this, -68, 8, "TopUI/SpecialBase", "TopUI/SpecialBar");
    let playerIcon = new SpriteObject(this, -190, 0, "TopUI/Icon1");
    let nameBg = new SpriteObject(this, -130, -25, "TopUI/PlayerName");
    let blockChain = new SpriteObject(this, -165, 30, "TopUI/BlockChain");
    let coin = new SpriteObject(this, -140, 22, "TopUI/Coin");
    let wagerFee = new SpriteObject(this, -125, 22, "TopUI/WagerFee");
    let nameText = new TextObject(this, -150, -25, "Faheem");
    let wagerFeeText = new TextObject(this, -125, 15, "5000");
    let specialPowerText = new TextObject(this, -50, 0, "0/10");
    let healthText = new TextObject(this, 80, -25, "300/300");
    nameText.setFont("12px");
    wagerFeeText.setFont("12px");
    specialPowerText.setFont("13px");
    healthText.setFont("14px");
    nameBg.setScale(1.25, 1.25);
    const panelContainer = this.add.container(this.gameWidth / 2 + _posDiff * 225, 50);
    panelContainer.add(progressBar);
    panelContainer.add(nameBg);
    panelContainer.add(specialPowerBar);
    panelContainer.add(wagerFee);
    panelContainer.add(wagerFeeText);
    panelContainer.add(coin);
    panelContainer.add(playerIcon);
    panelContainer.add(nameText);
    panelContainer.add(blockChain);
    panelContainer.add(healthText);
    panelContainer.add(specialPowerText);

    //progressBar.setSize(300,12);
    //  progressBar.setFillerOrigin(1);
    progressBar.updateProgress(0.7);
    //wagerFee.setSize(78,18);

    if (playerPosition === PlayerPosition.RightPlayer) {
      panelContainer.scaleX = -1;
      nameText.scaleX = -1;
      wagerFeeText.scaleX = -1;
      healthText.scaleX = -1;
      specialPowerText.scaleX = -1;
      healthText.setPosition(130, -25);
      nameText.setPosition(-100, -25);
      wagerFeeText.setPosition(-120, 15);
      specialPowerText.setPosition(-50, 0);
      coin.setPosition(-105, 22);
    }
  }

  generateTopPanel() {}
}
