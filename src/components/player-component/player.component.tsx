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

export const PlayerPage: React.FC<IPlayerProps> = (props) => {

    const { playerService } = useContext(AppContext);

    const { toasts } = useToasterStore();
    const [gameId, setGameId] = useState('');
    const [player, setPlayer] = useState('');
    const [selectedPapers, setSelectedPapers] = useState<string[]>([])
    const [paperDisable, setPaperDisable] = useState([]);
    const [gameStatus, setGameStatus] = useState('new');
    const [listPlayers, setListPlayers] = useState<string[]>([]);
    const [currentNumber, setCurrentNumber] = useState(-1);
    const [previousNumber, setPreviousNumber] = useState(-1);
    const [listNumber, setListNumber] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState<'join' | 'register' | 'pick' | 'play'>('join');
    const [winner, setWinner] = useState<any>(null);
    const [isShowPopupWinner, setShowPopupWinner] = useState(false);
    const [isUserBingo, setIsUserBingo] = useState(false);
    const [isGenerateNumber, setGeneratingNumber] = useState(false);
    const [removedPlayer, setRemovedPlayer] = useState<null | string>(null);

    useEffect(() => {
        toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((item, i) => i >= 3) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
        if (!isUserBingo && winner?.length > 0 && winner?.includes(player)) {
            setIsUserBingo(true);
        }
        if (removedPlayer) {
            if (player === removedPlayer) {
                toast.error('You have been kicked out of this game!', {
                    duration: 5000
                });
                onClearState();
            }
            setRemovedPlayer(null);
        }
    }, [isUserBingo, player, removedPlayer, toasts, winner]);

    return (
        <div className='__app-player-page'>
            <div className='__app-background-shape-left'></div>
            <div className='__app-background-shape-rignt'></div>
            {
                currentPage === 'join' ? <JoinGameComponent onJoinGameCallback={(_gameId, callback) => {
                    onJoinGame(_gameId, callback);
                }} /> : <></>
            }
            {
                currentPage === 'register' ? <RegisterComponent onRegisterCallback={(_player, callback) => {
                    onRegisterPlayer(_player, callback);
                }} /> : <></>
            }
            {
                currentPage === 'pick' ? <PickComponent paperDisable={paperDisable} onPickCallback={(paperIds, callback) => {
                    onSelectPapers(paperIds, callback);
                }} /> : <></>
            }
            {
                currentPage === 'play' ? gameStatus === 'new' ? <WaitingComponent gameId={gameId} players={listPlayers} /> : <></> : <></>
            }
            {
                currentPage === 'play' ? gameStatus === 'playing' ? <PlayingPageComponent
                    preNumber={previousNumber}
                    listNumber={listNumber}
                    nextNumber={currentNumber}
                    paperIds={selectedPapers}
                    players={listPlayers}
                    isShowPopupWinner={{
                        isShow: isShowPopupWinner,
                        winner: winner
                    }}
                    onWaitingBingo={() => {
                        notifyWaitingBingo();
                    }}
                    onBingo={(row, paperId) => {
                        verifyBingo(row, paperId);
                    }}
                    onClosePopup={() => {
                        setShowPopupWinner(false);
                    }}
                    isUserBingo={isUserBingo}
                    isGenerateNumber={isGenerateNumber}
                /> : <></> : <></>
            }
            <div className='__app-stepper-block'>
                <Steps
                    current={StepperStateEnum[currentPage]}
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
                    setGameId(_gameId);
                    processWebSocketEmitEvent$(_gameId).subscribe({
                        next: () => {
                            setCurrentPage('register');
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
                        setGeneratingNumber(true);
                        timer(1200).pipe(take(1)).subscribe({
                            next: () => {
                                console.log(currentNumber);
                                setCurrentNumber(res);
                                setGeneratingNumber(false);
                            }
                        })
                    }
                }
            });
            playerService.socketService.listenKeySocket(`${_gameId}_winner`).subscribe({
                next: res => {
                    if (res) {
                        setWinner(res);
                        setShowPopupWinner(true);
                    }
                }
            });
            playerService.socketService.listenKeySocket(`${_gameId}_remove_player`).subscribe({
                next: res => {
                    if (res) {
                        const _players = listPlayers.filter(item => item !== res);
                        setRemovedPlayer(res);
                        setListPlayers(_players);
                    }
                }
            })
            obs.next();
            obs.complete();
        })
    }

    function processEventEmitted(res: any) {
        setPaperDisable(res.selectedPapers);
        setListPlayers(res.players);
        if (gameStatus === 'new' && res.status === 'playing') {
            setGameStatus(res.status);
        }
        setListNumber(res.result);
        setPreviousNumber([...res.result].reverse()[1] ?? -1);
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
        setPlayer(_player);
        playerService.registerPlayer$(gameId, _player).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setCurrentPage('pick');
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
        setSelectedPapers(paperIds);
        playerService.pickPapers$(gameId, player, paperIds).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setCurrentPage('play');
                }
            }
        })
    }

    function notifyWaitingBingo() {
        playerService.notifyWaitingBingo$(gameId, player).pipe(take(1)).subscribe();
    }

    function verifyBingo(row: number[], paperId: string) {
        playerService.notifyBingo$(gameId, player, paperId, row).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(`Kinh hụt`);
                }
            }
        });
    }

    function onClearState() {
        setGameId('');
        setPlayer('');
        setSelectedPapers([]);
        setPaperDisable([]);
        setGameStatus('new');
        setListPlayers([]);
        setCurrentNumber(-1)
        setPreviousNumber(-1)
        setListNumber([])
        setCurrentPage('join');
    }
}