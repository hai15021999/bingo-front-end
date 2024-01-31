import { Button } from "antd";
import { useState } from "react";

interface IPlayingPageProps {
    players: string[];
    nextNumber: number;
    listNumber: number[];
    onGenerateNumber: (callback: () => void) => void;
    onEndGameCallback: (callback: () => void) => void;
}

export const PlayingPageComponent: React.FC<IPlayingPageProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);
    
    return (
        <div className="__app-main playing">
            <div className="__app-header-toolbar">
                <div className="__app-player-count">
                    <div className="__app-count">{props.players.length}</div>
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
                            props.onEndGameCallback(() => {
                                setProcessing(false);
                            })
                        }}
                    >
                        Kết thúc
                    </Button>
                </div>
            </div>
            <div className="__app-playing-container">
                <div className="__app-list-number-block">
                    {
                        props.listNumber.reverse().reduce((acc: any[], cur) => {
                            acc.push(
                                <div className="__app-number-previous" key={cur}>
                                    {cur}
                                </div>
                            );
                            return acc;
                        }, [])
                    }
                </div>
                <div className="__app-display-number-block">
                    <div className="__app-next-number-block">
                        <div className="__app-next-title">Số tiếp theo:</div>
                        <div className="__app-next-number">{props.nextNumber > 0 ? props.nextNumber : '-'}</div>
                    </div>
                    <div className="__app-submit-btn">
                        <Button
                            type='primary'
                            className='__app-form-button'
                            onClick={(e) => {
                                e.preventDefault();
                                props.onGenerateNumber(() => {
                                    console.log('callback');
                                });
                            }}
                        >
                            LẤY SỐ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}