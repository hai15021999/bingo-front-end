import { LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';


interface IRegisterProps {
    onRegisterCallback: (player: string, callback: () => void) => void;
}

export const RegisterComponent: React.FC<IRegisterProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);
    const [player, setPlayer] = useState('');

    return (
        <div className='__app-main register'>
            <div className='__app-form-block'>
                <div className='__app-logo'>
                    Lô tô!
                </div>
                <div className='__app-form'>
                    <Form className='__form-control'>
                        <Form.Item className='__form-item-block'>
                            <Input
                                className='__app-form-input'
                                placeholder='Tên người chơi'
                                onChange={(args) => {
                                    setPlayer(args.target.value);
                                }}
                                value={player}
                            />
                        </Form.Item>
                        <Form.Item className='__form-item-block'>
                            {
                                isProccess ?
                                    <div className='__loading-icon'>
                                        <LoadingOutlined style={{ fontSize: 28, color: '#0D6368' }} width={2} spin={true} size={2} />
                                    </div> :
                                    <Button
                                        type='primary'
                                        className='__app-form-button'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setProcessing(true);
                                            props.onRegisterCallback(player, () => {
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