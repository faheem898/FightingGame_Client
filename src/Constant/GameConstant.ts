import { Bonk, Doge, Pepe, SirMifriend } from "./AssetManager";

export enum PlayerIcon {
  Icon1 = "Icon1",
  Icon2 = "Icon2",
}
export enum GameEvents {
  DISCONNECT = "DISCONNECT",
  LEAVE = "LEAVE",
  JOIN = "JOIN",
}
export enum PlayerPosition {
  LeftPlayer,
  RightPlayer,
}
export enum PlayerAnimType {
  Hand,
  Leg,
  SpecialPower,
  Shield,
  Movement,
  Defence,
}
export enum RoomType {
  Random,
  PlayWithFriends,
  Tournament,
}
export const RoomNameKey = ["CityStage", "CityStage", "CityStage"];
export enum PlayerName {
  SirMifriend,
  Doge,
  Pepe,
  Bonk,
}
export const PlayerNameKey = ["SirMifriend", "Doge", "Pepe", "Bonk"];
export enum PlayerAnim {
  Idle,
  Idle_Tension,
  Low_Punch,
  Mid_Punch,
  High_Punch,
  Combo_Punch,
  Low_Kick,
  Mid_Kick,
  High_Kick,
  Jump_Kick,
  Mid_Block,
  Weapon_Attack,
  Victory_Pose,
  Ko_Death,
  Jump_Neutral,
  Walk_Forward,
  Hit_HighPunch,
  Hit_MidPunch,
  Hit_MidKick,
  Air_Recovery,
}

export const PlayerJoinData = [
  {
    characterName: 3,
    currentHealth: 20,
    currentSpecialPower: 0,
    isPlaying: true,
    photoId: 1,
    placeId: "0",
    playerId: "lzDMDuPx12",
    playerName: "Faheem",
    roomType: 0,
    sessionId: "lCpwQWGu562RHdv3AAAl11",
    totalHealth: 20,
    totalSpecialPower: 10,
    wagerAmount: 5000,
  },
  {
    characterName: 3,
    currentHealth: 20,
    currentSpecialPower: 0,
    isPlaying: true,
    photoId: 1,
    placeId: "1",
    playerId: "lzDMDuPx",
    playerName: "Faheem",
    roomType: 0,
    sessionId: "lCpwQWGu562RHdv3AAAl",
    totalHealth: 20,
    totalSpecialPower: 10,
    wagerAmount: 5000,
  },
];

export const PlayerAnims = [SirMifriend, Doge, Pepe, Bonk];
