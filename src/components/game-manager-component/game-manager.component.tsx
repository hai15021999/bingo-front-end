import toast, { useToasterStore } from 'react-hot-toast';
import { CreateGameComponent } from './components/create-game.component';
import { LoginComponent } from './components/login-manager.component';
import './game-manager.component.scss';
import { useContext, useEffect, useState } from 'react';
import { Steps } from 'antd';
import { take } from 'rxjs';
import { WaitingComponent } from './components/waiting.component';
import { PlayingPageComponent } from './components/playing.component';
import { AppContext } from '../../App';


interface IGameManagerProps {
    // socketService: SocketService
}

interface IGameManagerState {
    gameId: string;
    gameManager: any;
    players: string[];
    isInit: boolean;
    currentPage: 'login' | 'creating' | 'waiting' | 'playing' | 'recording';
    listNumber: number[];
    currentNumber: number;
    winner: string[];
}

enum StepperStateEnum {
    'login',
    'creating',
    'waiting',
    'playing',
    'recording'
}

const initState: IGameManagerState = {
    gameId: '',
    gameManager: null,
    players: [],
    isInit: false,
    currentPage: 'login',
    listNumber: [],
    currentNumber: -1,
    winner: [],
}

export const GameManagerPage: React.FC<IGameManagerProps> = (props) => {
    const { toasts } = useToasterStore();
    const [removedPlayer, setRemovedPlayer] = useState<null | string>(null);
    const [state, setState] = useState(initState);

    useEffect(() => {
        toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((item, i) => i >= 3) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
        if (!state.isInit) {
            const manager = localStorage.getItem('gameManager');
            if (manager) {
                setState((preState) => ({
                    ...preState,
                    gameManager: JSON.parse(manager),
                    currentPage: 'creating'
                }))
            }
            setState((preState) => ({
                ...preState,
                isInit: true,
            }))
        }
        if (removedPlayer) {
            const _players = state.players.filter(item => item !== removedPlayer);
            setState((preState) => ({
                ...preState,
                players: _players
            }))
            setRemovedPlayer(null);
        }
    }, [removedPlayer, state.isInit, state.players, toasts]);

    const { managerService } = useContext(AppContext);

    return (
        <div className="__app-game-manager-page">
            <div className="__app-background-shape-left"></div>
            <div className="__app-background-shape-rignt"></div>
            {
                state.currentPage === 'login' ? <LoginComponent onLoginCallback={(username, password, callback) => {
                    onLogin(username, password, callback);
                }} /> : <></>
            }
            {
                state.currentPage === 'creating' ? <CreateGameComponent onCreateGameCallback={(callback) => {
                    onCreateGame(callback);
                }} /> : <></>
            }
            {
                state.currentPage === 'waiting' ? <WaitingComponent
                    gameId={state.gameId}
                    players={state.players}
                    onRemovePlayerCallback={(player) => {
                        onRemovePlayer(player);
                    }}
                    onStartGameCallback={(callback) => {
                        onStartGame(callback);
                    }} /> : <></>
            }
            {
                state.currentPage === 'playing' ? <PlayingPageComponent
                    players={state.players}
                    listNumber={state.listNumber}
                    nextNumber={state.currentNumber}
                    onEndGameCallback={(callback) => {
                        onEndGame(callback);
                    }}
                    onGenerateNumber={(callback) => {
                        onGenerateNextNumber(callback);
                    }} /> : <></>
            }
            <div className="__app-stepper-block">
                <Steps
                    current={StepperStateEnum[state.currentPage]}
                    status='process'
                    items={[
                        {
                            title: 'Đăng nhập', onClick: () => {
                                // setCurrentPage('login');
                                setState((preState) => ({
                                    ...preState,
                                    currentPage: 'login',
                                }))
                            }, style: { cursor: 'pointer' }
                        },
                        {
                            title: 'Tạo game', onClick: () => {
                                StepperStateEnum[state.currentPage] > 1 && setState((preState) => ({
                                    ...preState,
                                    currentPage: 'creating',
                                }))
                            }, style: { cursor: StepperStateEnum[state.currentPage] > 0 ? 'pointer' : 'not-allowed' }
                        },
                        {
                            title: 'Đợi người chơi', onClick: () => {
                                StepperStateEnum[state.currentPage] > 2 && setState((preState) => ({
                                    ...preState,
                                    currentPage: 'waiting',
                                }))
                            }, style: { cursor: StepperStateEnum[state.currentPage] > 1 ? 'pointer' : 'not-allowed' }
                        },
                        {
                            title: 'Chơi', onClick: () => {
                                StepperStateEnum[state.currentPage] > 3 && setState((preState) => ({
                                    ...preState,
                                    currentPage: 'playing',
                                }))
                            }, style: { cursor: StepperStateEnum[state.currentPage] > 2 ? 'pointer' : 'not-allowed' }
                        },
                        {
                            title: 'Kết quả', onClick: () => {
                                StepperStateEnum[state.currentPage] > 4 && setState((preState) => ({
                                    ...preState,
                                    currentPage: 'recording',
                                }))
                            }, style: { cursor: StepperStateEnum[state.currentPage] > 3 ? 'pointer' : 'not-allowed' }
                        },
                    ]}
                />
            </div>
        </div>
    )

    function onLogin(username: string, password: string, callback: any) {
        managerService.login$(username, password).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(`Sai thông tin đăng nhập.`);
                    callback();
                } else {
                    // setGameManager(res);
                    // setCurrentPage('creating');
                    setState((preState) => ({
                        ...preState,
                        gameManager: res,
                        currentPage: 'creating'
                    }))
                    localStorage.setItem('gameManager', JSON.stringify(res));
                }
            }
        });
    }

    function onCreateGame(callback: any) {
        // setGameId('');
        // setPlayers([]);
        setState((preState) => ({
            ...preState,
            gameId: '',
            players: []
        }))
        managerService.createNewGameBoard$().pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    // setGameId(res);
                    // setCurrentPage('waiting');
                    setState((preState) => ({
                        ...preState,
                        gameId: res,
                        currentPage: 'waiting'
                    }))
                    managerService.socketService.listenKeySocket(res).subscribe({
                        next: res => {
                            if (res) {
                                // setPlayers(res.players ?? players);
                                // setListNumber(res.result);
                                // setCurrentNumber([...res.result].reverse()[0]);
                                // if (res['isBingo'] && res['winner'].length > 0 && res['winner'].length !== winner?.length) {
                                //     setWinner(res['winner']);
                                // }
                                setState((preState) => ({
                                    ...preState,
                                    players: res.players,
                                    listNumber: res.result,
                                    currentNumber: [...res.result].reverse()[0],
                                    winner: res['winner']
                                }))
                            }
                        }
                    })
                    managerService.socketService.listenKeySocket(`${res}_remove_player`).subscribe({
                        next: res => {
                            if (res) {
                                if (res) {
                                    setRemovedPlayer(res);
                                }
                            }
                        }
                    })
                }
            }
        })
    }

    function onStartGame(callback: any) {
        managerService.startGameBoard$(state.gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    // setCurrentPage('playing');
                    setState((preState) => ({
                        ...preState,
                        currentPage: 'playing',
                    }))
                }
            }
        })
    }

    function onRemovePlayer(_player: string) {
        managerService.removePlayer$(state.gameId, _player).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                }
            }
        })
    }

    function onGenerateNextNumber(callback: any) {
        managerService.getNextNumber$(state.gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    // const temp = [...listNumber];
                    // temp.push(res);
                    // setListNumber(temp);
                    // setCurrentNumber(res);
                }
            }
        })
    }

    function onEndGame(callback: any) {
        managerService.finishGame$(state.gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {

                }
            }
        })
    }
}