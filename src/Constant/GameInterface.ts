import { Vector3 } from "@esotericsoftware/spine-phaser";
import { PlayerAnimType } from "./GameConstant";

export interface IPlayerData {
  playerId?: string;
  playerName?: string;
  sessionId: string;
  isPlaying?: boolean;
  wagerAmount?: number;
  totalHealth: number;
  currentHealth: number;
  photoId?: number;
  placeId?: string;
  totalSpecialPower?: number;
  currentSpecialPower?: number;
  characterName: number;
  roomType?: number;
}
export interface IWinnerData {
    playerId?: string;
    playerName?: string;
    sessionId: string;
    winner?:boolean;
}
export interface IPositionData {
  playerId?: string;
  sessionId?: string;
  playerPos?: Vector3;
}
export interface IAnimationData {
  playerId?: string;
  sessionId?: string;
  anim: string;
  loop: boolean;
  isCollision?: boolean;
  animType: PlayerAnimType;
}
export interface IResultData {
  winner: IPlayerResult;
  loser: IPlayerResult;
  
}
export interface IPlayerResult {
playerId?: string;
playerName?: string;
sessionId: string;
winner: boolean;

}
