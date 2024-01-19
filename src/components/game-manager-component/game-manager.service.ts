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
                    error: error
                });
                observer.complete();
            })
        })
    }
}