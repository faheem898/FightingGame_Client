// Player.js

import { Vector3 } from "@esotericsoftware/spine-phaser";
import { ClientEvents } from "../Constant/Events";
import { PlayerAnim, PlayerAnims, PlayerAnimType, PlayerName, PlayerNameKey, PlayerPosition } from "../Constant/GameConstant";
import { IAnimationData, IPlayerData, IPlayerResult, IPositionData } from "../Constant/GameInterface";
import FightScene from "../scenes/FightScene";
import EventManager from "./EventManager";
import { GameModel } from "../Constant/GameModel";
import { ProgressBar } from "../components/ProgressBar";
import { SpriteObject } from "../components/SpriteObject";
import { TextObject } from "../components/TextObject";

class Player {
  gameManager!: FightScene;
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


  _healthProgressBar!: ProgressBar;
  _powerProgressBar!: ProgressBar;
  _specialPowerText!: TextObject;
  _healthText!: TextObject;
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
        this.setTopPanel(_playerPosition)
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
        console.log("Player Createdd", PlayerNameKey[this._characterName]);
        this._collisionWidth = GameModel._collisonWidth[this._characterName];
        this._characterAnimations = PlayerAnims[this._characterName];
        //console.log("Character Animations : ",this._characterAnimations);
        let _posDiff = -1;
        if (this._playerPosition === PlayerPosition.RightPlayer) {
          _posDiff = 1;
        }
        this.player = this.gameManager.add.spine(this.screenWidth / 2 + 200 * _posDiff, this.screenHeight - 25, PlayerNameKey[this._characterName], `${PlayerNameKey[this._characterName]}-atlas`);
        //this.player.animationState.setAnimation(0, this._characterAnimations[PlayerAnim.Idle_Tension], true);
        this.player.setOrigin(0.5, 0.5);
        const scaleFactor = this.screenHeight / 2 / (this.player.height * 0.8);
        //const scaleFactor = this.screenHeight / 2 / (this.player.height * 1);
        // Apply the scale factor to the player
        this.player.setScale(scaleFactor);
        this.player.scaleX = -1 * _posDiff;
        this.setPlayerAnims(this._characterAnimations[PlayerAnim.Idle], false);
        resolve(this.player);
      } catch (error) {
        reject();
      }
    });
  }
  setTopPanel(playerPosition: PlayerPosition) {
    const _posDiff = playerPosition===PlayerPosition.LeftPlayer ? -1 : 1;
    this._healthProgressBar = new ProgressBar(this.gameManager, 0, -5, "TopUI/EmptyBar", "TopUI/FilledBar");
    this._powerProgressBar = new ProgressBar(this.gameManager, -68, 8, "TopUI/SpecialBase", "TopUI/SpecialBar");
    let playerIcon = new SpriteObject(this.gameManager, -190, 0, "TopUI/Icon1");
    let nameBg = new SpriteObject(this.gameManager, -130, -18, "TopUI/PlayerName");
    let blockChain = new SpriteObject(this.gameManager, -165, 30, "TopUI/BlockChain");
    let coin = new SpriteObject(this.gameManager, -140, 22, "TopUI/Coin");
    let wagerFee = new SpriteObject(this.gameManager, -125, 23, "TopUI/WagerFee");
    let nameText = new TextObject(this.gameManager, -150, -25, "Faheem");
    let wagerFeeText = new TextObject(this.gameManager, -125, 15, "5000");
    this._specialPowerText = new TextObject(this.gameManager, -60, 2, "0/10");
    this._healthText = new TextObject(this.gameManager, 80, -25, "300/300");
    nameText.setFont("12px");
    wagerFeeText.setFont("12px");
    this._specialPowerText.setFont("13px");
    this._healthText.setFont("14px");
    nameBg.setScale(1.25, 1.25);
    const panelContainer = this.gameManager.add.container(this.gameManager.gameWidth / 2 + (_posDiff * 225), 40);
    panelContainer.add(this._healthProgressBar);
    panelContainer.add(nameBg);
    panelContainer.add(this._powerProgressBar);
    panelContainer.add(wagerFee);
    panelContainer.add(wagerFeeText);
    panelContainer.add(coin);
    panelContainer.add(playerIcon);
    panelContainer.add(nameText);
    panelContainer.add(blockChain);
    panelContainer.add(this._healthText);
    panelContainer.add(this._specialPowerText);

    // this._healthProgressBar.updateProgress(0.7);
    //wagerFee.setSize(78,18);

    if (playerPosition === PlayerPosition.RightPlayer) {
      panelContainer.scaleX = -1;
      nameText.scaleX = -1;
      wagerFeeText.scaleX = -1;
      this._healthText.scaleX = -1;
      this._specialPowerText.scaleX = -1;
      this._healthText.setPosition(130,-25);
      nameText.setPosition(-110,-25);
      wagerFeeText.setPosition(-120,15);
      this._specialPowerText.setPosition(-50,2);
      coin.setPosition(-105,22);
    }
    this.setSpecialPowerProgress();
  }
  setSpecialPowerProgress() {
    this.currentSpecialPower = 0;
    //Build Updated
    this.isSpecialPower = false;
    this._powerProgressBar.updateProgress(this.currentSpecialPower / this.totalSpecialPower);
    //this.setProgress(this.specialPowerProgressFill, this.currentSpecialPower / this.totalSpecialPower);
    this._specialPowerText.setText(`${this.currentSpecialPower}/${this.totalSpecialPower}`);
    this._specialPowerInterval = setInterval(() => {
      this.currentSpecialPower++;
      if (this.currentSpecialPower > this.totalSpecialPower) {
        clearInterval(this._specialPowerInterval);
        this.currentSpecialPower = this.totalSpecialPower;
        this.isSpecialPower = true;
      }
      this._powerProgressBar.updateProgress(this.currentSpecialPower / this.totalSpecialPower);
      this._specialPowerText.setText(`${this.currentSpecialPower}/${this.totalSpecialPower}`);
    }, 1000);
  }
  resetRoundData() {
    this.isSpecialPower = false;
    clearInterval(this._specialPowerInterval);
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

    this.player.animationState.setAnimation(0, animationData.anim);
  }
  setWinningData(el: IPlayerResult) {
    let anim = el.winner ? this._characterAnimations[PlayerAnim.Victory_Pose] : this._characterAnimations[PlayerAnim.Ko_Death];
    if (GameModel._selfPlayer._playeId === el.playerId) {
      let winText = el.winner ? "WinText" : "LoseText";
      this.setPopUp(winText);
    }
    this.player.animationState.setAnimation(0, anim, false);
    this.resetRoundData();
    // console.log("Set Result = ", el);
  }
  setPlayerAnims(anim: string, loop: boolean) {
    console.log("Play Normal Anim");
    this.player.animationState.setAnimation(0, anim, loop);
    this.player.animationState.addListener({
      complete: (trackEntry: { animation: { name: string } }) => {
        this.player.animationState.setAnimation(0, this._characterAnimations[PlayerAnim.Idle_Tension], true);
      },
    });
  }
  setPopUp(winningTexture: string) {
    let winningText = this.gameManager.add.sprite(this.screenWidth / 2, this.screenHeight / 2, winningTexture);
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
    this.setPlayerAnims(this._characterAnimations[PlayerAnim.Idle], true);
  }
  setUserData(playerData: IPlayerData) {
    try {
      this._healthText.setText(`${playerData?.currentHealth}/${playerData?.totalHealth}`);
      this._healthProgressBar.updateProgress(playerData?.currentHealth/playerData?.totalHealth);
    } catch (error) {}
  }
  setProgress(progressBar: any, progrss: number) {
    //console.log("Player TYpe");
    let progressDiff = this._playerPosition === PlayerPosition.LeftPlayer ? -1 : 1;
    progressBar.scaleX = progressDiff * progrss;
  }
  setHitAnim(animData: IAnimationData) {
    // console.log("Hit Anim : ",animData.animType);
    let animName = PlayerAnim.Idle;
    let anims = this._characterAnimations;
    if (animData.isCollision && animData.playerId !== this._playeId && (animData?.animType === PlayerAnimType.Hand || animData?.animType === PlayerAnimType.Leg || animData?.animType === PlayerAnimType.SpecialPower)) {
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
  playAnimationIfNotAnimating(animationName: string, loop: boolean, animType: PlayerAnimType) {
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
            this.player.animationState.setAnimation(0, this._characterAnimations[PlayerAnim.Idle_Tension], true);
            // Animation has finished, allow new animations
            this.isAnimating = false;
          }
        },
      });
    }
  }
}

export default Player;
