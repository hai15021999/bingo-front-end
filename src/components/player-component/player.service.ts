import { Observable } from "rxjs";
import { CoreServices } from "../../common/services/service.core";
import axios from "axios";


export class PlayerServices extends CoreServices {
    
    ensureGameBoard$(gameId: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/game-board/game/${gameId}`;
            axios.get(url).then((res) => {
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

    registerPlayer$(gameId: string, player: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/player/joinGame`;
            const datapost = { playerName: player, gameId: gameId };
            axios.post(url, datapost).then((res) => {
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

    pickPapers$(gameId: string, player: string, paperIds: string[]) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/player/pickPaper`;
            const datapost = { playerName: player, gameId: gameId, paperIds: paperIds };
            axios.post(url, datapost).then((res) => {
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

    notifyWaitingBingo$(gameId: string, player: string) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/player/notifyWaiting`;
            const datapost = { playerName: player, gameId: gameId };
            axios.post(url, datapost).then((res) => {
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

    notifyBingo$(gameId: string, player: string, paperId: string, rowBingo: number[]) {
        return new Observable(observer => {
            const url = `${this.globalSettings.backendUrl}/api/v1/player/notifyBingo`;
            const datapost = { playerName: player, gameId: gameId, paperId: paperId, rowBingo: rowBingo };
            axios.post(url, datapost).then((res) => {
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