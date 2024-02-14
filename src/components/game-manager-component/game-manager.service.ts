import { Observable } from "rxjs";
import { CoreServices } from "../../common/services/service.core";
import axios from "axios";


export class GameManagerServices extends CoreServices {

    login$(username: string, password: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/manager/login`;
            axios.post(url, {
                username,
                password
            }).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }
    
    createNewGameBoard$() {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/game-board/newGame`;
            axios.post(url, undefined).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }

    removePlayer$(gameId: string, player: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/manager/removePlayer`;
            axios.post(url, {
                gameId,
                player
            }).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
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
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
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
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }

    finishGame$(gameId: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/manager/restart`;
            axios.post(url, {
                gameId: gameId
            }).then((res) => {
                observer.next(res.data.value);
                observer.complete();
            }).catch((error) => {
                observer.next({
                    error: error.response?.data?.value?.message ?? error.message ?? JSON.stringify(error)
                });
                observer.complete();
            })
        })
    }
}