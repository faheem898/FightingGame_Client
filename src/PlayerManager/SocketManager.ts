import { io, Socket } from "socket.io-client"; // Ensure you have socket.io-client installed
import { ServerEventsManager } from "./ServerEventsManager";
import { GameEvents, PlayerName, RoomType } from "../Constant/GameConstant";
import { GameModel } from "../Constant/GameModel";
import { IPlayerData } from "../Constant/GameInterface";

type RoomResponse = {
  success: boolean;
  message?: string;
};
export interface IPlayerJoinData {
  playerId?: string;
  playerName?: string;
  wagerAmount?: number;
  photoId?: number;
  characterName?: PlayerName;
  roomType?: RoomType;
}
export class SocketManager {
  private static instance: SocketManager | null = null; // Allow null assignment here
  public _Socket: Socket | null = null;
  public _reconnectionMaxTime: number = 10000;

  private constructor() {}

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public static clearInstance() {
    SocketManager.instance = null; // Now valid since instance is typed to accept null
  }

  init(roomType: string = "Random"): Promise<Socket> {
    return new Promise<Socket>((resolve, reject) => {
      try {
        //const url = "https://localhost:3000"; // Local server URL
        //const url = "https://fightinggame-server.onrender.com"; // Local server URL
        const url = "https://mifrend.hopto.org:3000"; // Local server URL

        // Initialize the socket connection with public reconnection settings
        this._Socket = io(url, {
          transports: ["polling", "websocket"], // Prefer polling first, then websocket as fallback
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelayMax: this._reconnectionMaxTime,
        });

        // Handle socket connection
        this._Socket.on("connect", () => {
          console.log("Client connected to server");
          this.joinRoom(roomType); // Join the specified room after connection
          resolve(this._Socket as Socket);
        });

        // Handle connection errors
        this._Socket.on("connect_error", (error: any) => {
          reject(new Error("Connection Error: " + error));
          console.error("Connection Error:", error);
        });

        this._Socket.on("connect_timeout", (timeout: any) => {
          reject(new Error("Connection Timeout: " + timeout));
          console.error("Connection Timeout:", timeout);
        });
      } catch (error) {
        reject(new Error("Initialization Error: " + error));
      }
    });
  }

  joinRoom(roomType: string) {
    if (this._Socket) {
      this._Socket.emit("joinRoom", roomType, (response: RoomResponse) => {
        if (response.success) {
          console.log(`Joined room: ${roomType}`);
        } else {
          console.error(`Failed to join room: ${response.message}`);
        }
      });
    }
  }
  joinPlayer() {
    const playerId = this.generateRandomPlayerId();
    let PlayerData: IPlayerJoinData = {
      playerId: playerId,
      playerName: "Faheem",
      wagerAmount: 5000,
      photoId: 1,
      characterName: GameModel._characterName,
      roomType: GameModel._roomType,
    };
    console.log("on join player : ", PlayerData);
    this.initializeData(PlayerData);
    ServerEventsManager.getInstance().fireEventToServer(GameEvents.JOIN, PlayerData);
  }
  initializeData(playerData: IPlayerJoinData) {
    let data: IPlayerData = {
      playerId: playerData.playerId,
      sessionId: "",
      isPlaying: false,
      wagerAmount: 0,
      totalHealth: 0,
      currentHealth: 0,
      photoId: 0,
      placeId: "1",
      totalSpecialPower: 0,
      currentSpecialPower: 0,
      characterName: PlayerName.SirMifriend,
      roomType:GameModel._roomType
    };
    GameModel._playerData = data;
  }
  leaveRoom(roomType: string) {
    if (this._Socket) {
      this._Socket.emit("leaveRoom", roomType, (response: RoomResponse) => {
        if (response.success) {
          console.log(`Left room: ${roomType}`);
        } else {
          console.error(`Failed to leave room: ${response.message}`);
        }
      });
    }
  }

  generateRandomPlayerId(length = 8): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let playerId = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      playerId += characters[randomIndex];
    }
    return playerId;
  }
  onClickReconnect() {
    if (this._Socket) {
      this._Socket.disconnect();
      this._Socket.connect();
    }
  }
}
