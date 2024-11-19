import Phaser from "phaser";
import VirtualJoyStick from "phaser3-rex-plugins/plugins/virtualjoystick.js";
import VirtualJoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import { GameEvents, PlayerAnim, PlayerAnimType, PlayerJoinData, PlayerName, PlayerNameKey, PlayerPosition, RoomNameKey, RoomType } from "../Constant/GameConstant";
import { IAnimationData, IPlayerData, IPlayerResult, IPositionData, IResultData, IWinnerData } from "../Constant/GameInterface";
import { IPlayerJoinData } from "../PlayerManager/SocketManager";
import { GameModel } from "../Constant/GameModel";
import { ServerEventsManager } from "../PlayerManager/ServerEventsManager";
import { Vector3 } from "@esotericsoftware/spine-phaser";
import { ClientEvents, ServerEvents } from "../Constant/Events";
import EventManager from "../PlayerManager/EventManager";
import Player from "../PlayerManager/Player";
export default class FightScene extends Phaser.Scene {
  gameWidth: number = 0;
  gameHeight: number = 0;
  screenWidth: number = 0;
  screenHeight: number = 0;
  animIndex: number = 0;
  _opponentPlayer: any;
  _selfPlayer: any;
  progressBarBase: any;
  progressBarFill: any;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  updownPanel: any;
  private joystick!: VirtualJoyStick;
  private _selfPlayerManager!: Player;
  private _opponentPlayerManager!: Player;
  private speed: number = 200;
  private _collisionWidth: number = 0;
  private _playerCollide: boolean = false;
  private isAnimating: boolean = false;
  private isPlayerMoveForward: boolean = false;
  private playerAnimType: PlayerAnimType = PlayerAnimType.Hand;
  private punchHitboxPlayer: Phaser.GameObjects.Rectangle | undefined;
  private punchHitboxEnemy: Phaser.GameObjects.Rectangle | undefined;
  gameTimerText!: Phaser.GameObjects.Text;
  playerHitbox1: any;
  playerHitbox2: any;
  gameTimeInterval: any;
  isRunning: boolean = false;
  private playerAction: {
    [key in "hand" | "legs" | "shield" | "fire" | "run"]: () => void;
  };
  playersData: IPlayerData[] = [];
  playersComponentMap: Map<string, Player> = new Map<string, Player>();
  constructor() {
    super("FightScene");
    this.playerAction = {
      hand: this.performHandAction,
      legs: this.performLegsAction,
      shield: this.performShieldAction,
      fire: this.performFireAction,
      run: this.performRunAction,
    };
  }

  preload() {
    // Set up width and height
    this.gameWidth = this.sys.game.config.width as number;
    this.gameHeight = this.sys.game.config.height as number;
    this.screenWidth = this.sys.game.config.width as number;
    this.screenHeight = this.sys.game.config.height as number;
  }

  async create() {
    // Create background Spine object in the center
    this.playersData = GameModel._playerList;
    GameModel._roomType = this.playersData[0].roomType;
    // console.log("Room Type : ",GameModel._roomType)
    const bg = this.add.spine(
      this.gameWidth / 2,
      this.gameHeight / 2,
      RoomNameKey[GameModel._roomType],
      `${RoomNameKey[GameModel._roomType]}-atlas`
      // "CityStage-atlas"
    );
    bg.animationState.setAnimation(0, "animation", true);
    const scale = this.gameWidth / 4000;
    const scaleY = this.gameHeight / 1500;
    bg.setScale(scale, scaleY);
    this.physics.world.setBoundsCollision(true, true, true, true);

    //Handle Sir Creation
    // await this.createSelfPlayer();
    // await this.createOpponentPlayer();
    this.setTimer();
    //GameModel._playerData = PlayerJoinData[0];
    // GameModel._playerList = PlayerJoinData;
    await this.initilizePlayer(this.playersData[0]);
    await this.initilizePlayer(this.playersData[1]);
    this.startCollisionDetection();
    this.setControlButton();
    this.setJoyStickMovement();
    if (this.input?.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
    this.registerEvents();
    // this.setCollision();
  }
  registerEvents() {
    EventManager.on(ClientEvents.PLAYER_POSITION, this.handlePosition.bind(this));
    EventManager.on(ClientEvents.PLAYER_ANIMATION, this.handleAnimation.bind(this));
    EventManager.on(ClientEvents.PLAYER_DATA_UPDATE, this.handlePlayerData.bind(this));
    EventManager.on(ClientEvents.PLAYER_WINNER, this.handleWinner.bind(this));
    EventManager.on(ClientEvents.NEW_ROUND_START, this.startNewRound.bind(this));
  }
  deregisterEvent() {
    EventManager.off(ClientEvents.PLAYER_POSITION, this.handlePosition.bind(this));
    EventManager.off(ClientEvents.PLAYER_ANIMATION, this.handleAnimation.bind(this));
    EventManager.off(ClientEvents.PLAYER_DATA_UPDATE, this.handlePlayerData.bind(this));
    EventManager.off(ClientEvents.PLAYER_WINNER, this.handleWinner.bind(this));
    EventManager.on(ClientEvents.NEW_ROUND_START, this.startNewRound.bind(this));
  }
  handlePosition(event: CustomEvent) {
    let positionData: IPositionData = event.detail;
    if (positionData.playerId !== this._selfPlayerManager._playeId) {
      //console.log("Oppoene ", positionData.playerId, this._selfPlayerManager._playeId);
      this._opponentPlayerManager.setPlayerPosition(this._opponentPlayer, positionData?.playerPos);
    }
  }
  handleAnimation(event: CustomEvent) {
    let animationData: IAnimationData = event.detail;
    if (animationData.playerId !== this._selfPlayerManager._playeId) {
      //console.log("Animation Data : ", animationData);
      this._opponentPlayerManager.setPlayerAnim(animationData);
    }
    this.playersComponentMap?.forEach((element) => {
      element.setHitAnim(animationData);
    });
  }
  getPlayerWithSessionId(sessionId: any) {
    let plyr = this.playersComponentMap.get(sessionId);
    return plyr;
  }
  handlePlayerData(event: CustomEvent) {
    let playerData: IPlayerData[] = event.detail;
    //console.log("Player Data : ",playerData)
    this.playersData = playerData;
    this.playersData.forEach((el: IPlayerData) => {
      let plyr = this.playersComponentMap.get(el.sessionId);
      //console.log("Player Id : ",plyr?._playeId,plyr?._sessionId,plyr?.isLeftPlayer)
      plyr?.setUserData(el);
    });
    //console.log("Player Data : ", playerData);
  }
  handleWinner(event: CustomEvent) {
    let playerData: IPlayerResult[] = event.detail;
    console.log("Winning Data : ", playerData);
    playerData.forEach((el) => {
      let playerComponent = this.playersComponentMap?.get(el.sessionId);
      playerComponent?.setWinningData(el);
    });
    clearInterval(this.gameTimeInterval);
  }

  startNewRound(event: CustomEvent) {
    let playerData: IPlayerData[] = event.detail;
    this.playersData = playerData;
    this.playersData.forEach((el: IPlayerData) => {
      let plyr = this.playersComponentMap.get(el.sessionId);
      plyr?.setNewRound(el);
    });
    this.isAnimating = false;
    this.startTimer();
    console.log("startNewRound Data : ", playerData);
  }
  initilizePlayer(playerData: IPlayerData): Promise<Player> {
    return new Promise<Player>(async (resolve, reject) => {
      try {
        // console.log("addPlayer 2: ", playerData);
        let isSelfPlayer = false;
        let playerComponent = new Player(this, playerData);
        if (playerData.playerId === GameModel._playerData.playerId) {
          console.log("Self Player Data : ", playerData);
          GameModel._selfPlayer = playerComponent;
          await this.createSelfPlayer(playerComponent);
          isSelfPlayer = true;
        } else {
          await this.createOpponentPlayer(playerComponent);
          // console.log("Opponent Player Data : ", playerData);
        }
        this.playersComponentMap.set(playerData.sessionId, playerComponent);
        return resolve(playerComponent);
      } catch (err) {
        console.error("error while init player", err);
      }
    });
  }
  async createSelfPlayer(playerComponent: Player) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // console.log("Create Self Player");
        this._selfPlayerManager = playerComponent;
        await this._selfPlayerManager.initializePlayer();
        this._selfPlayer = await this._selfPlayerManager.createPlayer();
        // console.log("Player : ", this._selfPlayer);
        this.setSelfCollision();
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
  async createOpponentPlayer(playerComponent: Player) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.log("Create Opponent Player");
        this._opponentPlayerManager = playerComponent;
        await this._opponentPlayerManager.initializePlayer();
        this._opponentPlayer = await this._opponentPlayerManager.createPlayer();
        this.setOpponentCollision();
        resolve();
      } catch (error) {
        reject();
      }
    });
  }
  setSelfCollision() {
    this.playerHitbox1 = this.add.zone(this._selfPlayer.x, this._selfPlayer.y, this._selfPlayer.width + this._selfPlayerManager._collisionWidth, this._selfPlayer.height);
    this.physics.world.enable(this.playerHitbox1);
    this.playerHitbox1.body.setAllowGravity(false);
    this.playerHitbox1.body.setImmovable(true);
    // console.log("Self Collision");
  }
  setOpponentCollision() {
    this.playerHitbox2 = this.add.zone(this._opponentPlayer.x, this._opponentPlayer.y, this._opponentPlayer.width + this._opponentPlayerManager._collisionWidth, this._opponentPlayer.height);
    this.physics.world.enable(this.playerHitbox2);
    this.playerHitbox2.body.setAllowGravity(false);
    this.playerHitbox2.body.setImmovable(true);
    // console.log("Opponent Collision");
  }
  startCollisionDetection() {
    this.physics.add.overlap(this.playerHitbox1, this.playerHitbox2, this.handleCollision, undefined, this);
  }
  handleCollision(_player1Hitbox: any, _player2Hitbox: any) {
    //console.log("Collision detected between players!");
    this._playerCollide = true;
    // Add your logic here, like reducing health, playing an animation, etc.
  }
  setJoyStickMovement() {
    const joyStickPlugin = this.plugins.get("rexVirtualJoystick") as VirtualJoyStickPlugin;
    let self = this;
    if (joyStickPlugin) {
      this.joystick = joyStickPlugin
        .add(this, {
          x: 200,
          y: this.screenHeight - 200,
          radius: 90,
          base: this.add.sprite(200, this.screenHeight - 200, "JoyStickBg"),
          thumb: this.add.sprite(200, this.screenHeight - 200, "JoyStickController"),
          dir: "8dir", // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
          // fixed: true,
          forceMin: 10,
          // enable: true
        })
        .on("update", (event: any) => {
          self.dumpJoyStickState();
        });
      this.setMovementButton();
      // console.log("JoyStick : ", this.joystick);
    }
  }
  setMovementButton() {
    this.add.sprite(200, this.screenHeight - 290, "up");
    this.add.sprite(200, this.screenHeight - 130, "down");
    this.add.sprite(115, this.screenHeight - 215, "left");
    this.add.sprite(285, this.screenHeight - 215, "right");
    this.add.sprite(150, this.screenHeight - 260, "TopLeft");
    this.add.sprite(250, this.screenHeight - 260, "TopRight");
    this.add.sprite(150, this.screenHeight - 175, "BottomLeft");
    this.add.sprite(250, this.screenHeight - 175, "BottomRight");
    // console.log("Set Up down Panel : ", this.joystick.base);
  }

  setControlButton() {
    this.createControl("hand", this.screenWidth - 200, this.screenHeight - 150);
    this.createControl("legs", this.screenWidth - 380, this.screenHeight - 110);
    this.createControl("shield", this.screenWidth - 380, this.screenHeight - 230);
    this.createControl("fire", this.screenWidth - 160, this.screenHeight - 330);
    this.createControl("run", this.screenWidth - 280, this.screenHeight - 310);
    // console.log("Create Control Called");
    // Optionally: create a background for the fight scene or player character
    // this.add.sprite(screenWidth / 2, screenHeight / 2, "background");

    // Player actions (these can be tied to animations or abilities)
    this.playerAction = {
      hand: () => this.performHandAction(),
      legs: () => this.performLegsAction(),
      shield: () => this.performShieldAction(),
      fire: () => this.performFireAction(),
      run: () => this.performRunAction(),
    };
  }

  private createControl(texture: string, x: number, y: number) {
    const controlButton = this.add.sprite(x, y, texture).setInteractive().setOrigin(0.5, 0.5).setScale(1); // Adjust scale if needed

    // Set up event for control button click (pointerdown)
    controlButton.on("pointerdown", () => {
      this.handleControlClick(texture); // Call the action handler on click
    });
  }

  // Handle the action when a control is clicked
  private handleControlClick(controlType: string) {
    if (this.playerAction[controlType as keyof typeof this.playerAction]) {
      this.playerAction[controlType as keyof typeof this.playerAction](); // Trigger the corresponding action
    }
  }

  // Action functions (can be expanded to trigger animations, effects, etc.)
  performHandAction() {
    //Handle Collison
    // console.log("Animating =", this.isAnimating);
    if (!this.isAnimating) {
      this._collisionWidth = 80;
      this.resizeCollision(this._collisionWidth);
      // console.log("Hand Collsion Width : ", this.playerHitbox1.width);
    }
    // console.log("Hand action triggered: Punch!");
    // Trigger punch animation or logic here
    // this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.High_Punch], false, PlayerAnimType.Hand);
    // return;
    let cursor = this.cursors;
    if (cursor.down.isDown) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Low_Punch], false, PlayerAnimType.Hand);
    } else if (cursor.right.isDown && this._selfPlayerManager.isLeftPlayer) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Combo_Punch], false, PlayerAnimType.Hand);
    } else if (cursor.left.isDown && !this._selfPlayerManager.isLeftPlayer) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Combo_Punch], false, PlayerAnimType.Hand);
    } else if (cursor.up.isDown) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.High_Punch], false, PlayerAnimType.Hand);
    } else {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Mid_Punch], false, PlayerAnimType.Hand);
    }
  }
  resizeCollision(_collisionWidth: number) {
    this.playerHitbox1.setSize(this.playerHitbox1.width + _collisionWidth, this.playerHitbox1.height);
    this.playerHitbox2.body.setSize(this.playerHitbox2.width + _collisionWidth, this.playerHitbox2.height);
    this.physics.add.overlap(this.playerHitbox1, this.playerHitbox2, this.handleCollision, undefined, this);
  }
  performLegsAction() {
    if (!this.isAnimating) {
      this._collisionWidth = 100;
      this.resizeCollision(this._collisionWidth);
      console.log("Legs Collsion Width : ", this.playerHitbox1.width);
    }
    console.log("Legs action triggered: Kick!");
    // Trigger kick animation or logic here
    let cursor = this.cursors;
    if (cursor.down.isDown) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Low_Kick], false, PlayerAnimType.Leg);
    } else if (cursor.right.isDown && this._selfPlayerManager.isLeftPlayer) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.High_Kick], false, PlayerAnimType.Leg);
    } else if (cursor.left.isDown && !this._selfPlayerManager.isLeftPlayer) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.High_Kick], false, PlayerAnimType.Leg);
    } else if (cursor.up.isDown) {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Kick], false, PlayerAnimType.Leg);
    } else {
      this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Mid_Kick], false, PlayerAnimType.Leg);
    }
  }

  performShieldAction() {
    console.log("Shield action triggered: Block!");
    // Trigger shield raise animation or logic here
    let cursor = this.cursors;
    this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Mid_Block], false, PlayerAnimType.Shield);
  }

  performFireAction() {
    if (!this._selfPlayerManager.isSpecialPower) {
      return;
    }
    if (!this.isAnimating) {
      this._collisionWidth = 900;
      this.resizeCollision(this._collisionWidth);
      console.log("Hand Collsion Width : ", this.playerHitbox1.width);
    }
    console.log("Fire action triggered: Fire attack!");
    // Trigger fire animation or logic here
    this._selfPlayerManager.setSpecialPowerProgress();
    this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Weapon_Attack], false, PlayerAnimType.SpecialPower);
    //Handle Collison
  }

  performRunAction() {
    if (!this.isAnimating) {
      //this._collisionWidth = 100;
      this.resizeCollision(this._collisionWidth);
      console.log("Hand Collsion Width : ", this.playerHitbox1.width);
    }
    console.log("performRunAction!");
    // Trigger fire animation or logic here
    this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.dash_forward], false, PlayerAnimType.Movement);
    this.isRunning = true;
    if (this._selfPlayerManager.isLeftPlayer) {
      this.cursors.right.isDown = true;
    } else if (!this._selfPlayerManager.isLeftPlayer) {
      this.cursors.left.isDown = true;
    }

    setTimeout(() => {
      this.isRunning = false;
      this.cursors.right.isDown = false;
      this.cursors.left.isDown = false;
    }, 850);
    //ollison
  }
  update() {
    if (this._selfPlayer) {
      let isPlayerMoveForward = false;
      if (this.physics.world.overlap(this.playerHitbox1, this.playerHitbox2)) {
        if (this._selfPlayerManager.isLeftPlayer && this.cursors.right.isDown) {
          isPlayerMoveForward = true;
        } else if (!this._selfPlayerManager.isLeftPlayer && this.cursors.left.isDown) {
          isPlayerMoveForward = true;
        }
        //Return Because of Collision
        if (isPlayerMoveForward) {
          return;
        }
      }
      this.playerHitbox1.x = this._selfPlayer.x;
      this.playerHitbox1.y = this._selfPlayer.y;
      this.playerHitbox2.x = this._opponentPlayer.x;
      this.playerHitbox2.y = this._opponentPlayer.y;
      // Define movement speed
      const speed = 400;
      // if (this.cursors.left.isDown && this.cursors.up.isDown) {
      //   console.log("JoyStick : ", this.cursors);
      // }
      // Check for left/right arrow key input
      if (this.cursors.left.isDown) {
        this._selfPlayer.x -= (speed * this.game.loop.delta) / 1000; // Move left
        this.onPositionChanged();
        if (!this.isRunning) {
          if (this.cursors.up.isDown) {
            this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Neutral], false, PlayerAnimType.Movement);
          } else {
            this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Walk_Forward], false, PlayerAnimType.Movement);
          }
        }
      } else if (this.cursors.right.isDown) {
        this._selfPlayer.x += (speed * this.game.loop.delta) / 1000; // Move right
        this.onPositionChanged();
        if (!this.isRunning) {
          if (this.cursors.up.isDown) {
            this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Neutral], false, PlayerAnimType.Movement);
          } else {
          this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Walk_Forward], false, PlayerAnimType.Movement);
          }
        }
      }

      // Check for up/down arrow key input
      if (this.cursors.up.isDown) {
        //this._selfPlayerManager.setPlayerAnims(this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Neutral],false);
        this.playAnimationIfNotAnimating(this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Neutral], false, PlayerAnimType.Movement);
      }
      // else if (this.cursors.down.isDown) {
      //   this._selfPlayer.y += speed * this.game.loop.delta / 1000;  // Move down
      // }

      // Optional: Clamp the player position to the screen boundaries
      this._selfPlayer.x = Phaser.Math.Clamp(this._selfPlayer.x, 100, this.screenWidth - 100);
      this._selfPlayer.y = Phaser.Math.Clamp(this._selfPlayer.y, 0, this.screenHeight);
    }
  }
  onAnimationChanged(currentAnim: string, loop: boolean, isCollision: boolean, animType: PlayerAnimType) {
    let animData = {
      playerId: this._selfPlayerManager._playeId,
      sessionId: this._selfPlayerManager._sessionId,
      anim: currentAnim,
      loop: loop,
      isCollision: isCollision,
      animType: animType,
    };
    //console.log("Fired Data : ", animData);
    ServerEventsManager.getInstance().fireEventToServer(ServerEvents.PLAYER_ANIMATION, animData);
  }
  onPositionChanged() {
    let playerPos = new Vector3(this._selfPlayer.x, this._selfPlayer.y, 0);
    let positionData = {
      playerId: this._selfPlayerManager._playeId,
      sessionId: this._selfPlayerManager._sessionId,
      playerPos: playerPos,
    };
    ServerEventsManager.getInstance().fireEventToServer(ServerEvents.PLAYER_POSITION, positionData);
  }
  playAnimationIfNotAnimating(animationName: string, loop: boolean, animType: PlayerAnimType) {
    const track = this._selfPlayer.animationState.tracks[0];
    //console.log("Current Anim : ", animationName);
    // If there is an active track, return its animation name
    if (track && track.animation) {
      if (track.animation.name === this._selfPlayerManager._characterAnimations[PlayerAnim.Walk_Forward] || track.animation.name === this._selfPlayerManager._characterAnimations[PlayerAnim.Jump_Neutral]) {
        if (track.animation.name === animationName) {
          //console.log("Animation Return");
          return;
        }
        //return
      }
    }
    if (!this.isAnimating) {
      let animTypes = animType;
      if (animType !== PlayerAnimType.Movement) {
        //console.log("Animation Playing : ", animationName, this.isAnimating);
        this.isAnimating = true;
      }
      this._selfPlayer.animationState.setAnimation(0, animationName, loop);
      let collision = this.physics.world.overlap(this.playerHitbox1, this.playerHitbox2) ? true : false;
      this.onAnimationChanged(animationName, loop, collision, animTypes);
      // Listen for animation complete event to reset the flag
      this._selfPlayer.animationState.addListener({
        complete: (trackEntry: { animation: { name: string } }) => {
          if (trackEntry.animation.name === animationName) {
            this.resizeCollision(-this._collisionWidth);
            this._collisionWidth = 0;
            this.onAnimationChanged(this._selfPlayerManager._characterAnimations[PlayerAnim.Idle_Tension], true, false, PlayerAnimType.Movement);
            this._selfPlayer.animationState.setAnimation(0, this._selfPlayerManager._characterAnimations[PlayerAnim.Idle_Tension], true);
            // Animation has finished, allow new animations
            this.isAnimating = false;
          }
        },
      });
    }
  }
  private dumpJoyStickState() {
    const cursorKeys = this.joystick.createCursorKeys();
    if (cursorKeys.up.isDown && cursorKeys.right.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.right.isDown && cursorKeys.down.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.down.isDown && cursorKeys.left.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = true;
    } else if (cursorKeys.left.isDown && cursorKeys.up.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = true;
    } else if (cursorKeys.up.isDown) {
      this.cursors.up.isDown = true;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.right.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = true;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.down.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = true;
      this.cursors.left.isDown = false;
    } else if (cursorKeys.left.isDown) {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = true;
    } else {
      this.cursors.up.isDown = false;
      this.cursors.right.isDown = false;
      this.cursors.down.isDown = false;
      this.cursors.left.isDown = false;
    }
  }
  setTimer() {
    try {
      let timeBg = this.add.sprite(this.screenWidth / 2, 65, "TimeBg");
      timeBg.setScale(1.2);
      this.gameTimerText = this.add.text(
        this.screenWidth / 2 - 45,
        timeBg.y - 15,
        "03:00", // The text content
        {
          fontSize: "35px", // Font size
          color: "#ffffff", // Font color (white in this case)
          fontFamily: "ArialBold", // Font family
          align: "center", // Text alignment
        }
      );
      this.startTimer();
    } catch (error) {}
  }
  startTimer() {
    let countdown = 180;
    this.gameTimeInterval = setInterval(() => {
      countdown--; // Decrement the countdown by 1 second
      this.gameTimerText.setText(this.formatTime(countdown)); // Update the label text with the new time in MM:SS format

      if (countdown <= 0) {
        clearInterval(this.gameTimeInterval);
        this.gameTimerText.setText("00:00"); // When the countdown reaches 0, show "Time's Up!"
        // You can stop the timer or trigger another event here if needed
      }
    }, 1000);
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60); // Get the number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format the minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    // Return the formatted time as "MM:SS"
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
