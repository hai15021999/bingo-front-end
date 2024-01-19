import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useState } from "react";


interface IJoinGameProps {
    onJoinGameCallback: (gameId: string, callback: () => void) => void;
}

export const JoinGameComponent: React.FC<IJoinGameProps> = (props) => {
    const [gameId, setGameId] = useState('');
    const [isProccess, setProcessing] = useState(false);

    return (
        <div className="__app-main join-game">
            <div className="__app-form-block">
                <div className="__app-logo">
                    Lô tô!
                </div>
                <div className="__app-form">
                    <Form className='__form-control'>
                        <Form.Item className='__form-item-block' rules={[{ required: true, message: 'Nhập ID' }]}>
                            <Input
                                className='__app-form-input'
                                placeholder='Game ID'
                                onChange={(args) => {
                                    setGameId(args.target.value);
                                }}
                                value={gameId}
                            />
                        </Form.Item>
                        <Form.Item className='__form-item-block'>
                            {
                                isProccess ?
                                    <div className="__loading-icon">
                                        <LoadingOutlined style={{ fontSize: 28, color: '#0D6368' }} width={2} spin={true} size={2} />
                                    </div> :
                                    <Button
                                        type='primary'
                                        className='__app-form-button'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setProcessing(true);
                                            props.onJoinGameCallback(gameId, () => {
                                                setProcessing(false);
                                            });
                                        }}
                                    >
                                        Enter
                                    </Button>
                            }

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}