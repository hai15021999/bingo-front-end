import './player.component.scss';
import { useContext, useEffect, useState } from 'react';
import { JoinGameComponent } from './components/join-game.component';
import { Observable, take, timer } from 'rxjs';
import toast, { useToasterStore } from 'react-hot-toast';
import { CommonUtility } from '../../common/utils/utilities';
import React from 'react';
import { RegisterComponent } from './components/register.component';
import { Steps } from 'antd';
import { PickComponent } from './components/pick.component';
import { WaitingComponent } from './components/waiting.component';
import { PlayingPageComponent } from './components/playing-page.component';
import { AppContext } from '../../App';

interface IPlayerProps {
    // socketService: SocketService
}

interface IPlayerState {
    gameId: string;
    player: string;
    selectedPapers: string[];
    paperDisable: string[];
    gameStatus: string;
    listPlayers: string[];
    currentNumber: number;
    previousNumber: number;
    listNumber: number[];
    currentPage: 'join' | 'register' | 'pick' | 'play';
    winner: any;
    isShowPopupWinner: boolean;
    isUserBingo: boolean;
    isGenerateNumber: boolean;
    // removedPlayer: null | string;
}

/**
    * @description state for current activity of player
    * - join is input game id step
    * - register is input player name step
    * - pick is choose loto paper step
    * - play is playing time
*/
enum StepperStateEnum {
    'join',
    'register',
    'pick',
    'play'
}

const initState: IPlayerState = {
    gameId: '',
    player: '',
    selectedPapers: [],
    paperDisable: [],
    gameStatus: 'new',
    listPlayers: [],
    currentNumber: -1,
    previousNumber: -1,
    listNumber: [],
    currentPage: 'join',
    winner: null,
    isShowPopupWinner: false,
    isUserBingo: false,
    isGenerateNumber: false,
    // removedPlayer: null
}

export const PlayerPage: React.FC<IPlayerProps> = (props) => {

    const { playerService } = useContext(AppContext);

    const { toasts } = useToasterStore();

    const [state, setState] = useState<IPlayerState>(initState);
    const [removedPlayer, setRemovedPlayer] = useState<null | string>(null);
    const [isRestartGame, setRestartGame] = useState(false);

    useEffect(() => {
        toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((item, i) => i >= 3) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
        if (!state.isUserBingo && state.winner?.length > 0 && state.winner?.includes(state.player)) {
            setState((preState) => {
                return { ...preState, isUserBingo: true }
            })
        }
        if (removedPlayer) {
            if (state.player === removedPlayer) {
                toast.error('You have been kicked out of this game!', {
                    duration: 5000
                });
                playerService.socketService.removeListenKey(state.gameId);
                onClearState();
            } else {
                const _players = state.listPlayers.filter(item => item !== removedPlayer);
                setState((preState) => ({
                    ...preState,
                    listPlayers: _players
                }))
            }
            setRemovedPlayer(null);
        }
        if (isRestartGame) {
            onRestart();
            setRestartGame(false);
        }
    }, [isRestartGame, playerService.socketService, removedPlayer, state, toasts]);

    return (
        <div className='__app-player-page'>
            <div className='__app-background-shape-left'></div>
            <div className='__app-background-shape-rignt'></div>
            {
                state.currentPage === 'join' ? <JoinGameComponent onJoinGameCallback={(_gameId, callback) => {
                    onJoinGame(_gameId, callback);
                }} /> : <></>
            }
            {
                state.currentPage === 'register' ? <RegisterComponent onRegisterCallback={(_player, callback) => {
                    onRegisterPlayer(_player, callback);
                }} /> : <></>
            }
            {
                state.currentPage === 'pick' ? <PickComponent paperDisable={state.paperDisable} onPickCallback={(paperIds, callback) => {
                    onSelectPapers(paperIds, callback);
                }} /> : <></>
            }
            {
                state.currentPage === 'play' ? state.gameStatus === 'new' ? <WaitingComponent gameId={state.gameId} players={state.listPlayers} /> : <></> : <></>
            }
            {
                state.currentPage === 'play' ? state.gameStatus === 'playing' ? <PlayingPageComponent
                    preNumber={state.previousNumber}
                    listNumber={state.listNumber}
                    nextNumber={state.currentNumber}
                    paperIds={state.selectedPapers}
                    players={state.listPlayers}
                    isShowPopupWinner={{
                        isShow: state.isShowPopupWinner,
                        winner: state.winner
                    }}
                    onWaitingBingo={() => {
                        notifyWaitingBingo();
                    }}
                    onBingo={(row, paperId) => {
                        verifyBingo(row, paperId);
                    }}
                    onClosePopup={() => {
                        setState((preState) => {
                            return { ...preState, isShowPopupWinner: false }
                        })
                    }}
                    isUserBingo={state.isUserBingo}
                    isGenerateNumber={state.isGenerateNumber}
                /> : <></> : <></>
            }
            <div className='__app-stepper-block'>
                <Steps
                    current={StepperStateEnum[state.currentPage]}
                    status='process'
                    items={[
                        {
                            title: 'Nhập Game ID',
                        },
                        {
                            title: 'Nhập Tên người chơi',
                        },
                        {
                            title: 'Chọn Lô tô',
                        },
                        {
                            title: 'Tận hưởng',
                        }
                    ]}
                />
            </div>
        </div>
    )

    function onJoinGame(_gameId: string, callback: any) {
        if (CommonUtility.isNullOrEmpty(_gameId)) {
            toast.error(`Không để trống ID game.`);
            callback();
            return;
        }
        playerService.ensureGameBoard$(_gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(`Game không tồn tại.`);
                    callback();
                } else {
                    // setGameId(_gameId);
                    setState((preState) => {
                        return { ...preState, gameId: _gameId }
                    })
                    processWebSocketEmitEvent$(_gameId).subscribe({
                        next: () => {
                            setState((preState) => {
                                return { ...preState, currentPage: 'register' }
                            })
                        }
                    })
                }
            }
        })
    }

    function processWebSocketEmitEvent$(_gameId: string) {
        return new Observable(obs => {

            playerService.socketService.listenKeySocket(_gameId).subscribe({
                next: (res) => {
                    processEventEmitted(res);
                }
            })

            playerService.socketService.listenKeySocket(`${_gameId}_generate_number`).subscribe({
                next: res => {
                    if (res) {
                        // setGeneratingNumber(true);
                        setState((preState) => {
                            return { ...preState, isGenerateNumber: true }
                        })
                        timer(1200).pipe(take(1)).subscribe({
                            next: () => {
                                setState((preState) => {
                                    return { ...preState, currentNumber: res, isGenerateNumber: false }
                                })
                            }
                        })
                    }
                }
            });
            playerService.socketService.listenKeySocket(`${_gameId}_winner`).subscribe({
                next: res => {
                    if (res) {
                        setState((preState) => ({
                            ...preState,
                            winner: res,
                            isShowPopupWinner: true
                        }))
                    }
                }
            });
            playerService.socketService.listenKeySocket(`${_gameId}_remove_player`).subscribe({
                next: res => {
                    if (res) {
                        setRemovedPlayer(res);
                    }
                }
            });
            playerService.socketService.listenKeySocket(`${_gameId}_restart`).subscribe({
                next: res => {
                    if (res) {
                        setRestartGame(true);
                    }
                }
            })
            obs.next();
            obs.complete();
        })
    }

    function processEventEmitted(res: any) {
        setState((preState) => ({
            ...preState,
            paperDisable: res.selectedPapers,
            listPlayers: res.players
        }))
        if (state.gameStatus === 'new' && res.status === 'playing') {
            setState((preState) => ({
                ...preState,
                gameStatus: res.status,
            }))
        }
        setState((preState) => ({
            ...preState,
            listNumber: res.result,
            previousNumber: [...res.result].reverse()[1] ?? -1
        }))
        if (res['waitingPlayer']) {
            toast.loading(`${res['waitingPlayer']} đợi...`);
        }
    }

    function onRegisterPlayer(_player: string, callback: any) {
        if (CommonUtility.isNullOrEmpty(_player)) {
            toast.error(`Không để trống Tên người chơi.`);
            callback();
            return;
        }
        setState((preState) => ({
            ...preState,
            player: _player,
        }))
        playerService.registerPlayer$(state.gameId, _player).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setState((preState) => ({
                        ...preState,
                        currentPage: 'pick',
                    }))
                }
            }
        })
    }

    function onSelectPapers(paperIds: string[], callback: any) {
        if (CommonUtility.isNullOrEmpty(paperIds)) {
            toast.error(`Chọn giấy lô tô đã.`);
            callback();
            return;
        }
        setState((preState) => ({
            ...preState,
            selectedPapers: paperIds,
        }))
        playerService.pickPapers$(state.gameId, state.player, paperIds).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setState((preState) => ({
                        ...preState,
                        currentPage: 'play',
                    }))
                }
            }
        })
    }

    function notifyWaitingBingo() {
        playerService.notifyWaitingBingo$(state.gameId, state.player).pipe(take(1)).subscribe();
    }

    function verifyBingo(row: number[], paperId: string) {
        playerService.notifyBingo$(state.gameId, state.player, paperId, row).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(`Kinh hụt`);
                }
            }
        });
    }

    function onClearState() {
        setState(initState);
    }

    function onRestart() {
        setState(pre => {
            return {
                ...pre,
                gameStatus: 'new',
                currentNumber: -1,
                previousNumber: -1,
                listNumber: [],
                winner: null,
                isShowPopupWinner: false,
                isUserBingo: false,
                isGenerateNumber: false,
            }
        })
    }
}