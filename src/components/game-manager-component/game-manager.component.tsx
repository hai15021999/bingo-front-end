import { Button, Form, Input } from 'antd';
import './game-manager.component.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface IGameManagerProps {

}


export const GameManagerPage: React.FC<IGameManagerProps> = (props) => {

    const [isProccess, setProcessing] = useState(false);
    const [gameId, setGameId] = useState('');
    
    return (
        <div className="__app-game-manager-page">
            <div className="__app-background-shape-left"></div>
            <div className="__app-background-shape-rignt"></div>
            <div className="__app-main">
                <div className="__app-form-block">
                    <div className="__app-logo">
                        Lô tô!
                    </div>
                    <div className="__app-form">
                        <Form className='__form-control'>
                            <Form.Item className='__form-item-block'>
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
        </div>
    )
}