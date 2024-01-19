import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useState } from "react";


interface ILoginProps {
    onLoginCallback: (username: string, password: string, callback: () => void) => void;
}

export const LoginComponent: React.FC<ILoginProps> = (props) => {
    const [managerInfo, setManagerInfo] = useState({
        username: '',
        password: ''
    });
    const [isProccess, setProcessing] = useState(false);

    return (
        <div className="__app-main login">
            <div className="__app-form-block">
                <div className="__app-logo">
                    Quản Trò
                </div>
                <div className="__app-form">
                    <Form className='__form-control'>
                        <Form.Item className='__form-item-block'>
                            <Input
                                className='__app-form-input'
                                placeholder='Tài khoản'
                                onChange={(args) => {
                                    const temp = {...managerInfo};
                                    temp.username = args.target.value
                                    setManagerInfo(temp);
                                }}
                                value={managerInfo.username}
                            />
                        </Form.Item>
                        <Form.Item className='__form-item-block'>
                            <Input
                                className='__app-form-input'
                                placeholder='Mật khẩu'
                                type="password"
                                onChange={(args) => {
                                    const temp = {...managerInfo};
                                    temp.password = args.target.value
                                    setManagerInfo(temp);
                                }}
                                value={managerInfo.password}
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
                                            props.onLoginCallback(managerInfo.username, managerInfo.password, () => {
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