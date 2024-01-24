import { CheckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { PaperIds } from '../../../configs/paper.config';

interface IPickProps {
    onPickCallback: (papers: string[], callback: () => void) => void;
    paperDisable: any[]
}

export const PickComponent: React.FC<IPickProps> = (props) => {
    const [isProccess, setProcessing] = useState(false);
    const [papersChoosen, setPapersChoosen] = useState<string[]>([]);

    return (
        <div className='__app-main pick'>
            <div className='__app-header-toolbar'>
                <div className='__app-paper-active-count'>
                    <div className='__app-count'>
                        {
                            props.paperDisable.length
                        }
                    </div>
                    <div className='__app-title'>Lượt chơi</div>
                </div>
                <div className='__app-logo'>LÔ TÔ!</div>
                <div className='__app-play-button'>
                    <Button
                        type='primary'
                        className='__app-form-button'
                        onClick={(e) => {
                            e.preventDefault();
                            setProcessing(true);
                            props.onPickCallback(papersChoosen, () => {
                                setProcessing(false);
                            })
                        }}
                    >
                        Bắt đầu
                    </Button>
                </div>
            </div>
            <div className='__app-paper-select'>
                {
                    PaperIds.reduce((acc: any[], cur) => {
                        if (props.paperDisable.includes(cur)) {
                            acc.push(
                                <div className='__app-paper-item disable' key={cur}
                                >
                                    <img src={require(`../../../asssets/images/${cur}.jpg`)} alt=''/>
                                </div>
                            )
                        } else {
                            acc.push(
                                <div className='__app-paper-item' key={cur}
                                    onClick={() => {
                                        onSelectPaper(cur);
                                    }}
                                >
                                    <img src={require(`../../../asssets/images/${cur}.jpg`)} alt=''/>
                                    {
                                        papersChoosen.includes(cur) ? <div className='__icon-check'><CheckOutlined /></div> : <></>
                                    }
                                </div>
                            )
                        }
                        return acc;
                    }, [])
                }
            </div>
        </div>
    )

    function onSelectPaper(paperId: string) {
        if (papersChoosen.length < 2 && !papersChoosen.includes(paperId)) {
            const temp = [...papersChoosen];
            temp.push(paperId);
            setPapersChoosen(temp);
            return;
        }
        if (papersChoosen.includes(paperId)) {
            const temp = [...papersChoosen].reduce((acc: string[], cur) => {
                if (cur !== paperId) {
                    acc.push(cur);
                }
                return acc;
            }, []);
            setPapersChoosen(temp);
            return;
        }
    }
}