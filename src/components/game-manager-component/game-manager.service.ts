import { Observable } from "rxjs";
import { CoreServices } from "../../common/services/service.core";
import axios from "axios";
import { SocketService } from "../../common/services/socket-io.service";


export class GameManagerServices extends CoreServices {

    socketService: SocketService;
    constructor() {
        super();
        this.socketService = new SocketService();
    }
    
    createNewGameBoard$() {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/game-board/newGame`;
            axios.post(url, undefined).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }

    startGameBoard$(gameId: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/game-board/startGame`;
            axios.post(url, {
                gameId: gameId
            }).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }

    getNextNumber$(gameId: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/game-board/getNumber`;
            axios.post(url, {
                gameId: gameId
            }).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }
}