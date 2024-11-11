import { ClientEvents, ServerEvents } from "../Constant/Events";
import EventManager from "./EventManager";

export class ServerEventsManager{
    private static instance: ServerEventsManager | null;
    _Socket: any = null;
    _reconnectionDelayMax:number=60000
    private constructor() {}

    public static getInstance(): ServerEventsManager {
        if (!ServerEventsManager.instance) {
            ServerEventsManager.instance = new ServerEventsManager();
        }
        return ServerEventsManager.instance;
    }
    public static clearInstance() {
        ServerEventsManager.instance = null;
    }
    setSocket(socket: any) {
        this._Socket = socket;
        this._reconnectionDelayMax = this._Socket.io._reconnectionDelayMax;
    }
    fireEventToServer(eventName:any, data: any = null) {
        //console.log("fired data : ", data)
        if (data) {
            this._Socket.emit(eventName, JSON.stringify(data));
        }
        else {
            this._Socket.emit(eventName);
        }
    }
    registerServerEvents() {
        this._Socket.on(ServerEvents.GAME_START, this.onGameStart.bind(this));
        this._Socket.on(ServerEvents.PLAYER_POSITION, this.updatePlayerPosition.bind(this));
        this._Socket.on(ServerEvents.PLAYER_ANIMATION, this.updatePlayerAnimation.bind(this));
        this._Socket.on(ServerEvents.PLAYER_DATA_UPDATE, this.updatePlayerData.bind(this));
        this._Socket.on(ServerEvents.PLAYER_WINNER, this.updateResult.bind(this));
        this._Socket.on(ServerEvents.NEW_ROUND_START, this.startNewRound.bind(this));
        //this.registerLeaveGameEvent();
        console.log("Server Event Register : ");
    }
    onGameStart(data: string) {
        let responseData = JSON.parse(data);
        //console.log("OnGame Start : ",JSON.parse(data));
        EventManager.fire(ClientEvents.GAME_START, responseData);
    }
    updatePlayerPosition(data: string) {
        let responseData = JSON.parse(data);
        //console.log("updatePlayerPosition : ",JSON.parse(data));
        EventManager.fire(ClientEvents.PLAYER_POSITION, responseData);
    }
    updatePlayerAnimation(data: string) {
        let responseData = JSON.parse(data);
        //console.log("updatePlayerPosition : ",JSON.parse(data));
        EventManager.fire(ClientEvents.PLAYER_ANIMATION, responseData);
    }
    updatePlayerData(data: string) {
        let responseData = JSON.parse(data);
        console.log("updatePlayerData : ",JSON.parse(data));
        EventManager.fire(ClientEvents.PLAYER_DATA_UPDATE, responseData);
    }
    updateResult(data: string) {
        let responseData = JSON.parse(data);
        console.log("updateResult : ",JSON.parse(data));
        EventManager.fire(ClientEvents.PLAYER_WINNER , responseData);
    }
    startNewRound(data: string) {
        let responseData = JSON.parse(data);
        console.log("updateResult : ",JSON.parse(data));
        EventManager.fire(ClientEvents.NEW_ROUND_START, responseData);
    }
}