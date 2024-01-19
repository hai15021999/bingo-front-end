import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form } from "antd";
import { useState } from "react";


interface ICreateGameProps {
    onCreateGameCallback: (callback: () => void) => void;
}

export const CreateGameComponent: React.FC<ICreateGameProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);

    return (
        <div className="__app-main create-game">
            <div className="__app-form-block">
                <div className="__app-logo">
                    Quản Trò
                </div>
                <div className="__app-form">
                    <Form className='__form-control'>
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
                                            props.onCreateGameCallback(() => {
                                                setProcessing(false);
                                            });
                                        }}
                                    >
                                        Tạo Game
                                    </Button>
                            }

                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}