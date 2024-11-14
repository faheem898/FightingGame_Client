// Player.js

import { Vector3 } from "@esotericsoftware/spine-phaser";
import { ClientEvents } from "../Constant/Events";
import {
  PlayerAnim,
  PlayerAnims,
  PlayerAnimType,
  PlayerName,
  PlayerNameKey,
  PlayerPosition,
} from "../Constant/GameConstant";
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
  isAnimating: boolean = false;
  _playerData!: IPlayerData;
  _specialPowerInterval!: any;
  _characterName!: PlayerName;
  _characterAnimations: any;
  _collisionWidth: number = 40;

  //   _selectedIcon: string = "Icon";
  constructor(gameManager: FightScene, playerData: IPlayerData) {
    this.gameManager = gameManager;
    this.screenWidth = this.gameManager.screenWidth;
    this.screenHeight = this.gameManager.screenHeight;
    this._playerData = playerData;
    this._playeId = playerData.playerId;
    this._sessionId = playerData.playerId;
    GameModel._characterName = playerData?.characterName;
    this._characterName = GameModel._characterName;
    this.setPlayerData(playerData);
  }

  setPlayerData(playerData: IPlayerData) {
    this._playeId = playerData?.playerId;
    this._sessionId = playerData?.sessionId;
    this._characterName = playerData.characterName;

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
        // console.log("Initialize Player ", _playerPosition);
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
        console.log("Player Createdd",PlayerNameKey[this._characterName]);
        this._collisionWidth = GameModel._collisonWidth[this._characterName];
        this._characterAnimations = PlayerAnims[this._characterName];
        //console.log("Character Animations : ",this._characterAnimations);
        let _posDiff = -1;
        if (this._playerPosition === PlayerPosition.RightPlayer) {
          _posDiff = 1;
        }
        this.player = this.gameManager.add.spine(
          this.screenWidth / 2 + 200 * _posDiff,
          this.screenHeight - 25,
          PlayerNameKey[this._characterName],
          `${PlayerNameKey[this._characterName]}-atlas`
        );
        //this.player.animationState.setAnimation(0, this._characterAnimations[PlayerAnim.Idle_Tension], true);
        this.player.setOrigin(0.5, 0.5);
        const scaleFactor = this.screenHeight / 2 / (this.player.height * 0.8);
        //const scaleFactor = this.screenHeight / 2 / (this.player.height * 1);
        // Apply the scale factor to the player
        this.player.setScale(scaleFactor);
        this.player.scaleX = -1 * _posDiff;
        this.setPlayerAnims(this._characterAnimations[PlayerAnim.Idle],false)
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
          fontFamily: "ArialBold",
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
        this.specialPowerProgressBase.y - 6,
        `${this.currentSpecialPower}/${this.totalSpecialPower}`,
        {
          fontSize: "10px",
          color: "#ffffff",
          fontFamily: "ArialBold",
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
    this.isSpecialPower = false;
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
          fontFamily: "ArialBold", // Font family
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
          fontFamily: "ArialBold", // Font family
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
    player.y = player.y;
  }
  setPlayerAnim(animationData: IAnimationData) {
    if (animationData.animType === PlayerAnimType.SpecialPower) {
      this.setSpecialPowerProgress();
    }
    //this.setPlayerAnims(animationData?.anim,animationData!.loop);
    
    this.player.animationState.setAnimation(
      0,
      animationData.anim,
    );
  }
  setWinningData(el: IPlayerResult) {
    let anim = el.winner
      ? this._characterAnimations[PlayerAnim.Victory_Pose]
      : this._characterAnimations[PlayerAnim.Ko_Death];
    if (GameModel._selfPlayer._playeId === el.playerId) {
      let winText = el.winner ? "WinText" : "LoseText";
      this.setPopUp(winText);
    }
    this.player.animationState.setAnimation(
      0,
      anim,
      false
    );
    this.resetRoundData();
    // console.log("Set Result = ", el);
  }
  setPlayerAnims(anim: string, loop: boolean) {
    console.log("Play Normal Anim")
    this.player.animationState.setAnimation(0, anim, loop);
    this.player.animationState.addListener({
      complete: (trackEntry: { animation: { name: string } }) => {
        this.player.animationState.setAnimation(
          0,
          this._characterAnimations[PlayerAnim.Idle_Tension],
          true
        );
      },
    });
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
    this.setSpecialPowerProgress();
    this.setPlayerAnims(
      this._characterAnimations[PlayerAnim.Idle],
      true
    );
  }
  setUserData(playerData: IPlayerData) {
    try {
      // console.log("Set User Data :", this._playerData);
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
    //console.log("Player TYpe");
    let progressDiff =
      this._playerPosition === PlayerPosition.LeftPlayer ? -1 : 1;
    progressBar.scaleX = progressDiff * progrss;
  }
  setHitAnim(animData: IAnimationData) {
    // console.log("Hit Anim : ",animData.animType);
    let animName = PlayerAnim.Idle;
    let anims = this._characterAnimations;
    if (
      animData.isCollision &&
      animData.playerId !== this._playeId &&
      (animData?.animType === PlayerAnimType.Hand ||
        animData?.animType === PlayerAnimType.Leg ||
        animData?.animType === PlayerAnimType.SpecialPower)
    ) {
      if (animData?.animType === PlayerAnimType.Hand) {
        animName = PlayerAnim.Hit_MidPunch;
      } else if (animData?.animType === PlayerAnimType.Leg) {
        animName = PlayerAnim.Hit_MidKick;
      } else if (animData?.animType === PlayerAnimType.SpecialPower) {
        animName = PlayerAnim.Air_Recovery;
      }
       this.setPlayerAnims(anims[animName], false);
    }
  }
  playAnimationIfNotAnimating(
    animationName: string,
    loop: boolean,
    animType: PlayerAnimType
  ) {
    const track = this.player.animationState.tracks[0];

    // If there is an active track, return its animation name
    if (track && track.animation) {
      //console.log("Current Animation : ", track.animation.name, track);
      // return track.animation.name;
    }
    if (!this.isAnimating) {
      let animTypes = animType;
      this.isAnimating = true;
      this.player.animationState.setAnimation(0, animationName, loop);

    
      // Listen for animation complete event to reset the flag
      this.player.animationState.addListener({
        complete: (trackEntry: { animation: { name: string } }) => {
          if (trackEntry.animation.name === animationName) {

            this.player.animationState.setAnimation(
              0,
              this._characterAnimations[PlayerAnim.Idle_Tension],
              true
            );
            // Animation has finished, allow new animations
            this.isAnimating = false;
          }
        },
      });
    }
  }
}

export default MiFrensPlayer;
