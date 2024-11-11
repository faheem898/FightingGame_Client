import MiFrensPlayer from "../PlayerManager/MiFrensPlayer1";
import { IPlayerData } from "./GameInterface";

export class GameModel{
    public static _icon: string = "Ico1"; 
    public static _playerData: IPlayerData; 
    public static _selfPlayer: MiFrensPlayer; 
    public static _playerList: IPlayerData[] = []; 
}