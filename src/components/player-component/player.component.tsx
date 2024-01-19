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
    const [listPapers, setListPapers] = useState([])

    const [currentPage, setCurrentPage] = useState<'join' | 'register' | 'pick' | 'play'>('join');



    return (
        <div className="__app-player-page">
            <div className="__app-background-shape-left"></div>
            <div className="__app-background-shape-rignt"></div>
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
                currentPage === 'pick' ? <PickComponent listPapers={listPapers} onPickCallback={(_player, callback) => {
                    onRegisterPlayer(_player, callback);
                }} /> : <></>
            }

            <div className="__app-stepper-block">
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
                            console.log(res);
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
}