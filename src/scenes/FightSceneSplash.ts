import { ProgressBar } from "../components/ProgressBar";
import { SpriteObject } from "../components/SpriteObject";
import { TextObject } from "../components/TextObject";
import { BgJsonData, CharacterJsonData, fightSceneTexture } from "../Constant/AssetManager";
import { PlayerName, PlayerPosition } from "../Constant/GameConstant";
import { GameModel } from "../Constant/GameModel";
import { ServerEventsManager } from "../PlayerManager/ServerEventsManager";
import { SocketManager } from "../PlayerManager/SocketManager";

export default class FightSceneSplash extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  progressBarFill: any;
  progressBarBase: any;
  fightSceneSpine = [
    {
      spineKey: "CityStage",
      json: "Bg/CityStageBg/City stage.json",
      atlas: "Bg/CityStageBg/City stage.atlas",
    },
    {
      spineKey: "Sirmifren",
      json: "Character/Sirmifren/character1.json",
      atlas: "Character/Sirmifren/character1.atlas.txt",
    },
  ];

  SplashTexture: string[] = ["SplashBg.png", "PlayNow.png", "SplashFiller.png", "SplashBarBase.png", "Character/MiFrens.svg", "Character/Pepe.svg", "Character/Bonk.svg", "Character/Dodge.svg"];
  constructor() {
    super("SplashScene");
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
    //this.setProgressBar();
  }
  create() {
    let SplashBG = this.add.sprite(this.gameWidth / 2, this.gameHeight / 2, "SplashBg");
    SplashBG.setOrigin(0.5, 0.5); // Ensure the origin is at the center of the sprite
    SplashBG.setDisplaySize(this.gameWidth, this.gameHeight); // Resize the sprite to match the screen size
    this.setPlayNowBtn();
    this.setCharacterBtn();
    // this.setTopPanel();

    // this.setTopPanel1(PlayerPosition.LeftPlayer);
    // this.setTopPanel1(PlayerPosition.RightPlayer);
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
      let Mifren = this.add.sprite(this.gameWidth / 2 + 100, this.gameHeight / 2 - 40, "Character/MiFrens");
      let Pepe = this.add.sprite(this.gameWidth / 2 + 290, this.gameHeight / 2 - 40, "Character/Pepe");
      let Bonk = this.add.sprite(this.gameWidth / 2 - 100, this.gameHeight / 2 - 40, "Character/Bonk");
     // let Doge = this.add.sprite(this.gameWidth / 2 - 290, this.gameHeight / 2 - 40, "Character/Dodge");
      Mifren.setScale(0.75);
      Pepe.setScale(0.75);
      Bonk.setScale(0.75);
      //Doge.setScale(0.75);
      Mifren.setInteractive();
      Pepe.setInteractive();
      Bonk.setInteractive();
     // Doge.setInteractive();
      Mifren.on("pointerdown", () => {
        console.log("Mifren pointerdown");
        GameModel._characterName = PlayerName.SirMifriend;
      });
      Pepe.on("pointerdown", () => {
        console.log("Pepe pointerdown");
        GameModel._characterName = PlayerName.Pepe;
      });
      Bonk.on("pointerdown", () => {
        console.log("Bonk pointerdown");
        GameModel._characterName = PlayerName.Bonk;
      });
      // Doge.on("pointerdown", () => {
      //   console.log("Doge pointerdown");
      //   GameModel._characterName = PlayerName.Doge;
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
    const _posDiff = playerPosition===PlayerPosition.LeftPlayer ? -1 : 1;
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
    const panelContainer = this.add.container(this.gameWidth / 2 + (_posDiff * 225), 50);
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
      healthText.setPosition(130,-25);
      nameText.setPosition(-100,-25);
      wagerFeeText.setPosition(-120,15);
      specialPowerText.setPosition(-50,0);
      coin.setPosition(-105,22);
    }
  }

  generateTopPanel() {}
}
