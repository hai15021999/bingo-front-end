
interface IWaitingProps {
    players: string[];
    gameId: string;
}

export const WaitingComponent: React.FC<IWaitingProps> = (props) => {

    return (
        <div className="__app-main pick">
            <div className="__app-header-toolbar">
                <div className="__app-paper-active-count">
                    <div className="__app-count">{props.players.length}</div>
                    <div className="__app-title">Players</div>
                </div>
                <div className="__app-logo">LÔ TÔ!</div>
                <div className="__app-play-button">
                    <span style={{ padding: '12px 56px' }}></span>
                </div>
            </div>
            <div className="__app-players-waiting">
                <div className="__app-game-id">ID: {props.gameId}</div>
                <div className="__app-game-id">Đợi người khác một xíu nha...</div>

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