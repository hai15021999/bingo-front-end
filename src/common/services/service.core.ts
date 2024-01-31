import { environment } from "../../environments/environment"
import { SocketService } from "./socket-io.service";


export class CoreServices {
    socketService: SocketService;

    protected globalSettings = {
        backendUrl: '',
        player: null
    }
    constructor(socket: SocketService) {
        this.globalSettings.backendUrl = environment.domain;
        this.socketService = socket;
    }

    
}