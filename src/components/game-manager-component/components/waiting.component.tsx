import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { useState } from "react";


interface IWaitingProps {
    onStartGameCallback: (callback: () => void) => void;
    players: string[];
    gameId: string;
}

export const WaitingComponent: React.FC<IWaitingProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);

    return (
        <div className="__app-main waiting">
            <div className="__app-header-toolbar">
                <div className="__app-player-count">
                    <div className="__app-count">{ props.players.length }</div>
                    <div className="__app-title">Players</div>
                </div>
                <div className="__app-logo">Quản Trò!</div>
                <div className="__app-play-button">
                    <Button
                        type='primary'
                        className='__app-form-button'
                        onClick={(e) => {
                            e.preventDefault();
                            setProcessing(true);
                            props.onStartGameCallback(() => {
                                setProcessing(false);
                            })
                        }}
                    >
                        Bắt đầu
                    </Button>
                </div>
            </div>
            <div className="__app-players-waiting">
                <div className="__app-game-id">ID: {props.gameId}</div>
                <div className="__app-list-players">
                    {
                        props.players.reduce((acc: any[], cur) => {
                            acc.push(<div className="__app-player-name" key={`player_${cur}`}>{cur}</div>)
                            return acc;
                        }, [])
                    }
                </div>
            </div>
        </div>
    )
}