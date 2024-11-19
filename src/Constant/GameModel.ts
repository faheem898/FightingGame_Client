import MiFrensPlayer from "../PlayerManager/Player";
import { PlayerName, RoomType } from "./GameConstant";
import { IPlayerData } from "./GameInterface";

export class GameModel{
    public static _icon: string = "Ico1"; 
    public static _characterName: PlayerName = PlayerName.Pepe; 
    public static _roomType: RoomType = RoomType.Random; 
    public static _playerData: IPlayerData; 
    public static _selfPlayer: MiFrensPlayer; 
    public static _playerList: IPlayerData[] = []; 
    public static _collisonWidth = [-180,-375,-475,100]; 
}