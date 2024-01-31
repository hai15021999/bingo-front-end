import toast, { useToasterStore } from 'react-hot-toast';
import { CommonUtility } from '../../common/utils/utilities';
import { CreateGameComponent } from './components/create-game.component';
import { LoginComponent } from './components/login-manager.component';
import './game-manager.component.scss';
import { useContext, useEffect, useState } from 'react';
import { Steps } from 'antd';
import { take } from 'rxjs';
import { WaitingComponent } from './components/waiting.component';
import { PlayingPageComponent } from './components/playing.component';
import { SocketService } from '../../common/services/socket-io.service';
import { AppContext } from '../../App';


interface IGameManagerProps {
    socketService: SocketService
}

enum StepperStateEnum {
    'login',
    'creating',
    'waiting',
    'playing',
    'recording'
}

export const GameManagerPage: React.FC<IGameManagerProps> = (props) => {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
            .filter(t => t.visible) // Only consider visible toasts
            .filter((item, i) => i >= 3) // Is toast index over limit
            .forEach(t => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts]);
    
    const { managerService } = useContext(AppContext);

    const [gameId, setGameId] = useState('');
    const [gameManager, setGameManager] = useState<any>(null);
    const [players, setPlayers] = useState([]);
    const [isInit, setInit] = useState(false);
    const [currentPage, setCurrentPage] = useState<'login' | 'creating' | 'waiting' | 'playing' | 'recording'>('login');
    const [listNumber, setListNumber] = useState<number[]>([]);
    const [currentNumber, setCurrentNumber] = useState(-1);
    const [winner, setWinner] = useState<any>(null);

    useEffect(() => {
        if (!isInit) {
            const manager = localStorage.getItem('gameManager');
            if (manager) {
                setGameManager(JSON.parse(manager));
                setCurrentPage('creating');
            }
            setInit(true);
        }
    }, [isInit]);

    return (
        <div className="__app-game-manager-page">
            <div className="__app-background-shape-left"></div>
            <div className="__app-background-shape-rignt"></div>
            {
                currentPage === 'login' ? <LoginComponent onLoginCallback={(username, password, callback) => {
                    onLogin(username, password, callback);
                }} /> : <></>
            }
            {
                currentPage === 'creating' ? <CreateGameComponent onCreateGameCallback={(callback) => {
                    onCreateGame(callback);
                }} /> : <></>
            }
            {
                currentPage === 'waiting' ? <WaitingComponent 
                gameId={gameId} 
                players={players} 
                onRemovePlayerCallback={(player) => {
                    onRemovePlayer(player);
                }}
                onStartGameCallback={(callback) => {
                    onStartGame(callback);
                }} /> : <></>
            }
            {
                currentPage === 'playing' ? <PlayingPageComponent 
                players={players} 
                listNumber={listNumber} 
                nextNumber={currentNumber} 
                onEndGameCallback={(callback) => {
                    onEndGame(callback);
                }}
                onGenerateNumber={(callback) => {
                    onGenerateNextNumber(callback);
                }} /> : <></>
            }
            <div className="__app-stepper-block">
                <Steps
                    current={StepperStateEnum[currentPage]}
                    status='process'
                    items={[
                        { title: 'Đăng nhập', onClick: () => { setCurrentPage('login') }, style: { cursor: 'pointer' }},
                        { title: 'Tạo game', onClick: () => { StepperStateEnum[currentPage] > 1 && setCurrentPage('creating') }, style: { cursor: StepperStateEnum[currentPage] > 0 ? 'pointer' : 'not-allowed' }},
                        { title: 'Đợi người chơi', onClick: () => { StepperStateEnum[currentPage] > 2 && setCurrentPage('waiting') }, style: { cursor: StepperStateEnum[currentPage] > 1 ? 'pointer' : 'not-allowed' } },
                        { title: 'Chơi', onClick: () => { StepperStateEnum[currentPage] > 3 && setCurrentPage('playing') }, style: { cursor: StepperStateEnum[currentPage] > 2 ? 'pointer' : 'not-allowed' } },
                        { title: 'Kết quả', onClick: () => { StepperStateEnum[currentPage] > 4 && setCurrentPage('recording') }, style: { cursor: StepperStateEnum[currentPage] > 3 ? 'pointer' : 'not-allowed' } },
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
                    setGameManager(res);
                    setCurrentPage('creating');
                    localStorage.setItem('gameManager', JSON.stringify(res));
                }
            }
        });
    }

    function onCreateGame(callback: any) {
        setGameId('');
        setPlayers([]);
        managerService.createNewGameBoard$().pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setGameId(res);
                    setCurrentPage('waiting');
                    managerService.socketService.listenKeySocket(res).subscribe({
                        next: res => {
                            if (res) {
                                setPlayers(res.players ?? players);
                                setListNumber(res.result);
                                setCurrentNumber([...res.result].reverse()[0]);
                                if (res['isBingo'] && res['winner'].length > 0 && res['winner'].length !== winner?.length) {
                                    setWinner(res['winner']);
                                }
                            }
                        }
                    })
                    managerService.socketService.listenKeySocket(`${res}_remove_player`).subscribe({
                        next: res => {
                            if (res) {
                                const _players = players.filter(item => item !== res);
                                setPlayers(_players);
                            }
                        }
                    })
                }
            }
        })
    }

    function onStartGame(callback: any) {
        managerService.startGameBoard$(gameId).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                    callback();
                } else {
                    setCurrentPage('playing');
                }
            }
        })
    }

    function onRemovePlayer(_player: string) {
        managerService.removePlayer$(gameId, _player).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res.error) {
                    toast.error(res.error);
                }
            }
        })
    }

    function onGenerateNextNumber(callback: any) {
        managerService.getNextNumber$(gameId).pipe(take(1)).subscribe({
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
        managerService.finishGame$(gameId).pipe(take(1)).subscribe({
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

// const manager = {
//     username: 'haipnguyen',
//     password: 1432205327,
//     role: 'manager',
// }