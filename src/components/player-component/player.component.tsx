import './player.component.scss';
import { useState } from 'react';
import { JoinGameComponent } from './components/join-game.component';
import { PlayerServices } from './player.service';
import { take } from 'rxjs';
import toast from 'react-hot-toast';
import { CommonUtility } from '../../common/utils/utilities';
import React from 'react';
import { RegisterComponent } from './components/register.component';
import { Steps } from 'antd';
import { PickComponent } from './components/pick.component';
import { WaitingComponent } from './components/waiting.component';
import { PlayingPageComponent } from './components/playing-page.component';

interface IPlayerProps {

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

    const playerService = new PlayerServices();

    const [gameId, setGameId] = useState('');
    const [player, setPlayer] = useState('');
    const [selectedPapers, setSelectedPapers] = useState<string[]>([])
    const [paperDisable, setPaperDisable] = useState([]);
    const [gameStatus, setGameStatus] = useState('new');
    const [listPlayers, setListPlayers] = useState<string[]>([]);
    const [currentNumber, setCurrentNumber] = useState(-1);
    const [previousNumber, setPreviousNumber] = useState(-1);
    const [listNumber, setListNumber] = useState<number[]>([13, 15, 17, 31, 44, 61, 70]);

    const [currentPage, setCurrentPage] = useState<'join' | 'register' | 'pick' | 'play'>('join');



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
                onWaitingBingo={() => {
                    notifyWaitingBingo();
                }}
                onBingo={(row, paperId) => {
                    verifyBingo(row, paperId);
                }}
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
        setGameId(_gameId);
        playerService.ensureGameBoard$(_gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (CommonUtility.isNullOrUndefined(res)) {
                    toast.error(`Lỗi hệ thống. Vui lòng thử lại.`);
                    callback();
                } else if (res.error) {
                    toast.error(`Game không tồn tại.`);
                    callback();
                } else {
                    playerService.socketService.listenKeySocket(_gameId).subscribe({
                        next: res => {
                            setPaperDisable(res.selectedPapers);
                            setListPlayers(res.players);
                            if (gameStatus === 'new' && res.status === 'playing') {
                                setGameStatus(res.status);
                            }
                            setListNumber(res.result);
                            setPreviousNumber([...res.result].reverse()[1] ?? -1);
                            setCurrentNumber([...res.result].reverse()[0] ?? -1);
                            if (res['waitingPlayer']) {
                                toast.loading(`${res['waitingPlayer']} đợi...`);
                            }

                        }
                    })
                    setCurrentPage('register');
                }
            }
        })
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
            next: (res) => {

            }
        });
    }
}