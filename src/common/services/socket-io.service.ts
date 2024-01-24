import { Socket, io } from "socket.io-client";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

export class SocketService {
    private _socket: Socket;
  
    constructor() {
        const socketUrl = environment.domain;
        this._socket = io(socketUrl, {
          transports: ['websocket'],
          autoConnect: false,
          withCredentials: true,
        });
        this._socket.connect();
    }
  
    listenKeySocket(key: string): Observable<any> {
      return new Observable(obs => {
        this._socket.on(key, (res) => {
          obs.next(res);
        });
      })
    }
  
    removeListenKey(key: string) {
      this._socket.off(key);
    }
  
    destroy() {
      if (this._socket) {
        this._socket.off();
        this._socket.disconnect();
      }
    }
  }