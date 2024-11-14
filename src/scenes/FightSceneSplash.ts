import {
  BgJsonData,
  CharacterJsonData,
  fightSceneTexture,
} from "../Constant/AssetManager";
import { PlayerName } from "../Constant/GameConstant";
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

  SplashTexture: string[] = [
    "SplashBg.png",
    "PlayNow.png",
    "SplashFiller.png",
    "SplashBarBase.png",
    "Character/MiFrens.svg",
    "Character/Pepe.svg",
    "Character/Bonk.svg",
    "Character/Dodge.svg",
  ];
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
      this.load.spineJson(
        element.spineKey,
        `assets/SpineAnimation/${element.json}`
      );
      this.load.spineAtlas(
        `${element.spineKey}-atlas`,
        `assets/SpineAnimation/${element.atlas}`
      );
    });
    CharacterJsonData.forEach((element) => {
      this.load.spineJson(
        element.spineKey,
        `assets/SpineAnimation/${element.json}`
      );
      this.load.spineAtlas(
        `${element.spineKey}-atlas`,
        `assets/SpineAnimation/${element.atlas}`
      );
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
    let SplashBG = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight / 2,
      "SplashBg"
    );
    SplashBG.setOrigin(0.5, 0.5); // Ensure the origin is at the center of the sprite
    SplashBG.setDisplaySize(this.gameWidth, this.gameHeight); // Resize the sprite to match the screen size
    this.setPlayNowBtn();
    this.setCharacterBtn();
  }
  setProgressBar() {
    try {
      this.progressBarBase = this.add.sprite(
        this.gameWidth / 2,
        this.gameHeight - 50,
        "SplashBarBase"
      );
      this.progressBarBase.setOrigin(0.5, 0.5);
      this.progressBarBase.setDisplaySize(604, 10); // Set the size of the background bar
      this.progressBarFill = this.add.sprite(
        this.gameWidth / 2 - 200,
        this.gameHeight - 50,
        "SplashFiller"
      );
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
      let playNow = this.add.sprite(
        this.gameWidth / 2,
        this.gameHeight - 50,
        "PlayNow"
      );
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
      let Mifren = this.add.sprite(
        (this.gameWidth / 2)+100,
        (this.gameHeight/2)-40,
        "Character/MiFrens"
      );
      let Pepe = this.add.sprite(
        (this.gameWidth / 2)+290,
        (this.gameHeight/2)-40,
        "Character/Pepe"
      );
      let Bonk = this.add.sprite(
        (this.gameWidth / 2)-100,
        (this.gameHeight/2)-40,
        "Character/Bonk"
      );
      let Doge = this.add.sprite(
        (this.gameWidth / 2)-290,
        (this.gameHeight/2)-40,
        "Character/Dodge"
      );
      Mifren.setScale(0.75);
      Pepe.setScale(0.75);
      Bonk.setScale(0.75);
      Doge.setScale(0.75);
      Mifren.setInteractive();
      Pepe.setInteractive();
      Bonk.setInteractive();
      Doge.setInteractive();
      Mifren.on("pointerdown", () => {
        console.log("Mifren pointerdown");
        GameModel._characterName=PlayerName.SirMifriend;
      });
      Pepe.on("pointerdown", () => {
        console.log("Pepe pointerdown");
        GameModel._characterName=PlayerName.Pepe;
      });
      Bonk.on("pointerdown", () => {
        console.log("Bonk pointerdown");
        GameModel._characterName=PlayerName.Bonk;
      });
      Doge.on("pointerdown", () => {
        console.log("Doge pointerdown");
        GameModel._characterName=PlayerName.Doge;
      });
    } catch (error) {}
  }
}
