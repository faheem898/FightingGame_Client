// Player.js

import { Vector3 } from "@esotericsoftware/spine-phaser";
import { ClientEvents } from "../Constant/Events";
import { PlayerAnimType, PlayerPosition } from "../Constant/GameConstant";
import {
  IAnimationData,
  IPlayerData,
  IPlayerResult,
  IPositionData,
} from "../Constant/GameInterface";
import FightScene from "../scenes/FightScene";
import EventManager from "./EventManager";
import { GameModel } from "../Constant/GameModel";

class MiFrensPlayer {
  gameManager!: FightScene;
  progressBarBase!: Phaser.GameObjects.Sprite;
  progressBarFill!: Phaser.GameObjects.Sprite;
  specialPowerProgressBase!: Phaser.GameObjects.Sprite;
  specialPowerProgressFill!: Phaser.GameObjects.Sprite;
  specialPowerProgressText!: Phaser.GameObjects.Text;
  healthProgressText!: Phaser.GameObjects.Text;
  wagerAmountText!: Phaser.GameObjects.Text;
  playerNameText!: Phaser.GameObjects.Text;
  specialPowerText!: Phaser.GameObjects.Text;
  specialHealthProgressText!: Phaser.GameObjects.Text;
  player: any;
  currentProgressCount: number = 300;
  totalProgressCount: number = 300;
  currentSpecialPower: number = 0;
  totalSpecialPower: number = 10;
  wagerAmount: number = 3000;
  screenWidth: number = 0;
  screenHeight: number = 0;
  _selectedIcon: string = "Player/Icon1";
  _selectedIconIndicator: string = "Player/LeftIconIndicator";
  _playerPosition: number = PlayerPosition.LeftPlayer;
  _playeName: string = "Faheem";
  _playeId: string | undefined;
  _sessionId: string | undefined;
  isLeftPlayer: boolean = false;
  isSpecialPower: boolean = false;
  _playerData!: IPlayerData;
  _specialPowerInterval!: any;

  //   _selectedIcon: string = "Icon";
  constructor(gameManager: FightScene, playerData: IPlayerData) {
    this.gameManager = gameManager;
    this.screenWidth = this.gameManager.screenWidth;
    this.screenHeight = this.gameManager.screenHeight;
    this._playerData = playerData;
    this._playeId = playerData.playerId;
    this._sessionId = playerData.playerId;
    this.setPlayerData(playerData);
  }

  setPlayerData(playerData: IPlayerData) {
    this._playeId = playerData?.playerId;
    this._sessionId = playerData?.sessionId;
    if (playerData.placeId === "0") {
      this._playerPosition = PlayerPosition.LeftPlayer;
      this.isLeftPlayer = true;
    } else {
      this._playerPosition = PlayerPosition.RightPlayer;
    }
  }
  async initializePlayer(_playerPosition: PlayerPosition) {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log("Initialize Player ", _playerPosition);
        //this._playerPosition = _playerPosition;
        this.setPlayerHealthProgress();
        this.setPlayerSpecialPowerProgress();
        this.setPlayerNamePanel();
        this.setPopUp("FightText");
        this.setUserData(this._playerData);
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
  async createPlayer() {
    return new Promise<void>((resolve, reject) => {
      try {
        console.log("Player Createdd", this._playerPosition);
        let _posDiff = -1;
        if (this._playerPosition === PlayerPosition.RightPlayer) {
          _posDiff = 1;
        }
        this.player = this.gameManager.add.spine(
          this.screenWidth / 2 + 200 * _posDiff,
          this.screenHeight - 25,
          "Sirmifren",
          "Sirmifren-atlas"
        );
        this.player.animationState.setAnimation(0, "idle", true);
        //this.dogePlayer.animationState.setAnimation(0, "idle", true);
        this.player.setOrigin(0.5, 0.5);
        const scaleFactor = this.screenHeight / 2 / (this.player.height * 0.75);
        // Apply the scale factor to the player
        this.player.setScale(scaleFactor);
        this.player.scaleX = -1 * _posDiff;
        resolve(this.player);
      } catch (error) {
        reject();
      }
    });
  }

  setPlayerHealthProgress() {
    try {
      let _posDiff = -1;
      const barWidth = 325;
      const barHeight = 11;
      let diffwIdth = 380;
      let originX = 1;
      if (this._playerPosition === PlayerPosition.RightPlayer) {
        _posDiff = 1;
        diffwIdth = 380;
      }
      const barX = this.screenWidth / 2 + 360 * _posDiff;
      const barY = 35;

      // Empty progress bar (background)
      this.progressBarBase = this.gameManager.add.sprite(
        barX,
        barY,
        "EmptyBar"
      );
      this.progressBarBase.setOrigin(originX, 0.5); // Set origin to left (0) to keep position aligned
      this.progressBarBase.setDisplaySize(barWidth, barHeight);

      // Filled progress bar (foreground)
      this.progressBarFill = this.gameManager.add.sprite(
        barX,
        barY,
        "FilledBar"
      );
      this.progressBarFill.setOrigin(originX, 0.5); // Same origin as base for alignment

      this.progressBarFill.setDisplaySize(barWidth, barHeight);
      if (this._playerPosition === PlayerPosition.LeftPlayer) {
        this.progressBarBase.scaleX = 1 * _posDiff;
        this.progressBarFill.scaleX = 1 * _posDiff;
      }
      // // Health progress text
      const progresstextwidth =
        this._playerPosition === PlayerPosition.RightPlayer ? 55 : 115;
      this.healthProgressText = this.gameManager.add.text(
        this.screenWidth / 2 + progresstextwidth * _posDiff,
        15,
        `${this.currentProgressCount}/${this.totalProgressCount}`,
        {
          fontSize: "15px",
          color: "#ffffff",
          fontFamily: "Arial",
          align: "center",
        }
      );
      this.healthProgressText.setOrigin(0, 0);
    } catch (error) {
      console.error("Error setting up progress bar:", error);
    }
  }
  setPlayerSpecialPowerProgress() {
    try {
      let _posDiff = -1;
      const barWidth = 189;
      const barHeight = 15;
      let diffwIdth = 380;
      let originX = 1;
      if (this._playerPosition === PlayerPosition.RightPlayer) {
        _posDiff = 1;
        diffwIdth = 380;
      }
      const barX = this.screenWidth / 2 + 355 * _posDiff;
      const barY = 48;
      // Empty progress bar (background)
      this.specialPowerProgressBase = this.gameManager.add.sprite(
        barX,
        barY,
        "HealthProgressBase"
      );
      this.specialPowerProgressBase.setOrigin(originX, 0.5); // Set origin to left (0) to keep position aligned
      this.specialPowerProgressBase.setDisplaySize(barWidth, barHeight);

      // Filled progress bar (foreground)
      this.specialPowerProgressFill = this.gameManager.add.sprite(
        barX,
        barY,
        "HealthProgressFill"
      );
      this.specialPowerProgressFill.setOrigin(originX, 0.5); // Same origin as base for alignment

      this.specialPowerProgressFill.setDisplaySize(barWidth, barHeight);
      if (this._playerPosition === PlayerPosition.LeftPlayer) {
        this.specialPowerProgressBase.scaleX = 1 * _posDiff;
        this.specialPowerProgressFill.scaleX = 1 * _posDiff;
      }
      this.setProgress(
        this.specialPowerProgressFill,
        this.currentSpecialPower / this.totalSpecialPower
      );
      // // Health progress text
      const progresstextwidth =
        this._playerPosition === PlayerPosition.RightPlayer ? 55 : 115;
      this.specialPowerProgressText = this.gameManager.add.text(
        this.specialPowerProgressBase.x - 75 * _posDiff,
        this.specialPowerProgressBase.y - 5,
        `${this.currentSpecialPower}/${this.totalSpecialPower}`,
        {
          fontSize: "10px",
          color: "#ffffff",
          fontFamily: "Arial",
          align: "center",
        }
      );
      this.healthProgressText.setOrigin(0, 0);
      this.setSpecialPowerProgress();
    } catch (error) {
      console.error("Error setting up progress bar:", error);
    }
  }
  setSpecialPowerProgress() {
    this.currentSpecialPower = 0;
    //Build Updated
    this.isSpecialPower=false;
    this.setProgress(
      this.specialPowerProgressFill,
      this.currentSpecialPower / this.totalSpecialPower
    );
    this.specialPowerProgressText.setText(
      `${this.currentSpecialPower}/${this.totalSpecialPower}`
    );
    this._specialPowerInterval = setInterval(() => {
      this.currentSpecialPower++;
      if (this.currentSpecialPower > this.totalSpecialPower) {
        clearInterval(this._specialPowerInterval);
        this.currentSpecialPower = this.totalSpecialPower;
        this.isSpecialPower = true;
      }
      this.setProgress(
        this.specialPowerProgressFill,
        this.currentSpecialPower / this.totalSpecialPower
      );
      this.specialPowerProgressText.setText(
        `${this.currentSpecialPower}/${this.totalSpecialPower}`
      );
    }, 1000);
  }
  resetRoundData() {
    this.isSpecialPower = false;
    clearInterval(this._specialPowerInterval);
  }
  setPlayerNamePanel() {
    try {
      let _selectedIconIndicator = "PlayerUI/LeftIconIndicator";
      let _selectedIcon = "PlayerUI/Icon1";
      let _selectedBlockChain = "PlayerUI/Blockchain";
      let _wagerBG = "PlayerUI/PlayerBg";
      let _coin = "PlayerUI/coin";

      let _posDiff = -1;
      // this._playerPosition = PlayerPosition.RightPlayer
      if (this._playerPosition === PlayerPosition.RightPlayer) {
        _selectedIconIndicator = "PlayerUI/LeftIconIndicator";
        _selectedIcon = "PlayerUI/Icon2";
        _posDiff = 1;
      }
      let PlayerIcon = this.gameManager.add.sprite(
        this.progressBarBase.x + 20 * _posDiff,
        40,
        _selectedIcon
      );
      let playeNameBg = this.gameManager.add.sprite(
        PlayerIcon.x - 54 * _posDiff,
        PlayerIcon.y - 18,
        "PlayerUI/PlayerNameBg"
      );
      playeNameBg.scaleX = -1 * _posDiff;
      this.playerNameText = this.gameManager.add.text(
        playeNameBg.x,
        playeNameBg.y,
        this._playeName, // The text content
        {
          fontSize: "10px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      this.playerNameText.setOrigin(0.5, 0.5);
      let wagerBG = this.gameManager.add.sprite(
        PlayerIcon.x - (PlayerIcon.width + 7) * _posDiff,
        PlayerIcon.height + 5,
        _wagerBG
      );
      let coinBg = this.gameManager.add.sprite(
        wagerBG.x - 20,
        wagerBG.y,
        _coin
      );
      this.wagerAmountText = this.gameManager.add.text(
        wagerBG.x - 10,
        wagerBG.y - 8,
        `${this.wagerAmount}`, // The text content
        {
          fontSize: "15px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "Arial", // Font family
          align: "center", // Text alignment
        }
      );
      wagerBG.scaleX = -1 * _posDiff;
      let blockChain = this.gameManager.add.sprite(
        PlayerIcon.x - (PlayerIcon.width / 2.5) * _posDiff,
        PlayerIcon.height + 10,
        _selectedBlockChain
      );
    } catch (error) {
      console.log("SetPlayer Data : ", error);
    }
  }
  setPlayerPosition(player: any, playerPos: Vector3 | undefined) {
    player.x = playerPos?.x;
    player.y = playerPos?.y;
  }
  setPlayerAnim(animationData: IAnimationData) {
    if(animationData.animType ===PlayerAnimType.SpecialPower){
      this.setSpecialPowerProgress();
    }
    this.player.animationState.setAnimation(
      0,
      animationData.anim,
      animationData.loop
    );
  }
  setWinningData(el: IPlayerResult) {
    let anim = el.winner ? "victory_pose" : "ko_death";
    if (GameModel._selfPlayer._playeId === el.playerId) {
      let winText = el.winner ? "WinText" : "LoseText";
      this.setPopUp(winText);
    }
    this.setPlayerAnims(anim, true);
    this.resetRoundData();
    console.log("Set Result = ", el);
  }
  setPlayerAnims(anim: string, loop: boolean) {
    this.player.animationState.setAnimation(0, anim, loop);
  }
  setPopUp(winningTexture: string) {
    let winningText = this.gameManager.add.sprite(
      this.screenWidth / 2,
      this.screenHeight / 2,
      winningTexture
    );
    this.gameManager.time.delayedCall(3000, () => {
      winningText.destroy();
    });
  }
  setNewRound(playerData: IPlayerData) {
    this.setPopUp("FightText");
    this.setUserData(playerData);
    let _posDiff = this._playerPosition === PlayerPosition.LeftPlayer ? -1 : 1;
    this.player.x = this.screenWidth / 2 + 200 * _posDiff;
    this.setPlayerAnims("idle_tension", true);
  }
  setUserData(playerData: IPlayerData) {
    try {
      console.log("Set User Data :", this._playerData);
      this.playerNameText.setText(playerData?.playerName ?? "Unknown Player");
      this.wagerAmountText.setText(playerData?.wagerAmount?.toString() ?? "0");
      this.setProgress(
        this.progressBarFill,
        playerData?.currentHealth / playerData?.totalHealth
      );
      this.healthProgressText.setText(
        `${playerData?.currentHealth}/${playerData?.totalHealth}`
      );
    } catch (error) {}
  }
  setProgress(progressBar: any, progrss: number) {
    console.log("Player TYpe");
    let progressDiff =
      this._playerPosition === PlayerPosition.LeftPlayer ? -1 : 1;
    progressBar.scaleX = progressDiff * progrss;
  }
}

export default MiFrensPlayer;
