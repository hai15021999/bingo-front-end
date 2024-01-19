import toast from 'react-hot-toast';
import { CommonUtility } from '../../common/utils/utilities';
import { CreateGameComponent } from './components/create-game.component';
import { LoginComponent } from './components/login-manager.component';
import './game-manager.component.scss';
import { useEffect, useState } from 'react';
import { Steps } from 'antd';
import { GameManagerServices } from './game-manager.service';
import { take } from 'rxjs';
import { WaitingComponent } from './components/waiting.component';


interface IGameManagerProps {

}

enum StepperStateEnum {
    'login',
    'creating',
    'waiting',
    'playing',
    'recording'
}

export const GameManagerPage: React.FC<IGameManagerProps> = (props) => {
    const managerService = new GameManagerServices();

    const [gameId, setGameId] = useState('');
    const [gameManager, setGameManager] = useState<any>(null);
    const [players, setPlayers] = useState([]);
    const [isInit, setInit] = useState(false);
    /**
     * @description state for current activity of game manager
     */
    const [currentPage, setCurrentPage] = useState<'login' | 'creating' | 'waiting' | 'playing' | 'recording'>('login');

    useEffect(() => {
        if (!isInit) {
            const manager = localStorage.getItem('gameManager');
            if (manager) {
                setGameManager(JSON.parse(manager));
                setCurrentPage('creating');
            }
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
                currentPage === 'waiting' ? <WaitingComponent gameId={gameId} players={players} onStartGameCallback={(callback) => {
                    onCreateGame(callback);
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
        if (verifyManager(username, password)) {
            setGameManager(manager);
            setCurrentPage('creating');
            localStorage.setItem('gameManager', JSON.stringify(manager));
        } else {
            toast.error(`Sai thông tin đăng nhập.`);
            callback();
        }
    }

    function verifyManager(username: string, password: string) {
        if (username !== manager.username) {
            return false;
        }
        console.log(CommonUtility.hashDJB2(password));
        if (CommonUtility.hashDJB2(password) === manager.password) {
            return true;
        }
        return false;
    }

    function onCreateGame(callback: any) {
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
                            }
                        }
                    })
                }
            }
        })
    }
}

const manager = {
    username: 'haipnguyen',
    password: 1432205327,
    role: 'manager',
}