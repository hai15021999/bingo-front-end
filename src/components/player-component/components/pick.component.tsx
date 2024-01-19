import { LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useState } from "react";


interface IPickProps {
    onPickCallback: (papers: string, callback: () => void) => void;
    listPapers: any[]
}

export const PickComponent: React.FC<IPickProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);
    const [papersChoosen, setPapersChoosen] = useState([]);

    return (
        <div className="__app-main pick">
            <div className="__app-header-toolbar">
                <div className="__app-paper-active-count">
                    <div className="__app-count">
                        {
                            props.listPapers.reduce((acc: number, cur) => {
                                if (cur && cur.enable) {
                                    acc++;
                                }
                                return acc;
                            }, 0)
                        }
                    </div>
                    <div className="__app-title">Lượt chơi</div>
                </div>
                <div className="__app-logo">LÔ TÔ!</div>
                <div className="__app-play-button">
                    <Button
                        type='primary'
                        className='__app-form-button'
                        onClick={(e) => {
                            e.preventDefault();
                            setProcessing(true);
                        }}
                    >
                        Bắt đầu
                    </Button>
                </div>
            </div>
        </div>
    )
}