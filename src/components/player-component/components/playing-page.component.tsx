import { useState } from "react";
import { PaperColor, PaperData } from "../../../configs/paper.config";
import { Button, Modal } from "antd";
import toast from "react-hot-toast";

interface IPlayingPageProps {
    players: string[];
    paperIds: string[];
    nextNumber: number;
    preNumber: number;
    listNumber: number[];
    isShowPopupWinner: {
        isShow: boolean;
        winner: string[];
    };
    onWaitingBingo: () => void;
    onBingo: (row: number[], paperId: string) => void;
    onClosePopup: () => void;
}

export const PlayingPageComponent: React.FC<IPlayingPageProps> = (props) => {
    const [selectedNumber, setSelectedNumber] = useState<number[]>([]);
    const [hasWinner, setHasWinner] = useState(false);

    return (
        <div className="__app-main playing">
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
            <div className="__app-playing-container">
                <div className="__app-paper-block">
                    {
                        props.paperIds.reduce((acc: any[], cur) => {
                            acc.push(generatePaper(cur));
                            return acc;
                        }, [])
                    }
                </div>
                <div className="__app-display-number-block">
                    <div className="__app-previous-number-block">
                        <div className="__app-pre-title">Số trước đó:</div>
                        <div className="__app-pre-number">{props.preNumber > 0 ? props.preNumber : '-'}</div>
                    </div>
                    <div className="__app-next-number-block">
                        <div className="__app-next-title">Số tiếp theo:</div>
                        <div className="__app-next-number">{props.nextNumber > 0 ? props.nextNumber : '-'}</div>
                    </div>
                    <div className="__app-submit-btn">
                        <div className="__app-container-button">
                            <Button
                                type='primary'
                                className='__app-form-button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    const { rowBingo, paperId } = getBingoRow();
                                    if (rowBingo && paperId) {
                                        props.onBingo(rowBingo, paperId);
                                    } else {
                                        toast.error(`Chọn đủ 1 hàng 5 rồi kinh`);
                                    }
                                }}
                            >
                                {hasWinner ? 'BÁO KINH TRÙNG' : 'BÁO KINH'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {
                props.isShowPopupWinner ? <Modal
                    width={1100}
                    open={true}
                    closable={false}
                    title={(
                        <span className='__app-dialog-title'>
                            CHÚC MỪNG NGƯỜI CHƠI!
                        </span>
                    )}
                    footer={getRenderFooterButton()}
                    centered
                >
                    <div className="__dialog-content" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span><strong>{ props.isShowPopupWinner.winner.join(', ') }</strong> đã kinh.</span>
                        <span>Đóng thông báo và báo kinh trùng nếu bạn cũng kinh.</span>
                    </div>
                </Modal> : <></>
            }
        </div>
    )

    function generatePaper(paperId: string) {
        const data = PaperData[paperId];
        const domElements = data?.reduce((acc: any[], cur: number[], index) => {
            if (cur) {
                acc.push(
                    <div className="__app-data-row" key={`${paperId}_row_${index}`}>
                        {
                            generatePaperRow(cur, paperId)
                        }
                    </div>
                )
            }
            return acc;
        }, []);
        return (
            <div className="__table-paper" key={paperId}>{domElements}</div>
        );
    }

    function generatePaperRow(rowData: number[], paperId: string) {
        const elements: any[] = [];
        for (let i = 1; i <= 9; i++) {
            const cell = rowData.find(item => (item >= ((i - 1) * 10) && item < (i * 10)) || (i === 9 && item === 90));
            if (cell === undefined) {
                elements.push(
                    <div className='__cell-empty' key={`${paperId}_cell_${i}`} style={{ background: PaperColor[paperId] }}></div>
                )
            } else {
                elements.push(
                    <div className={`__cell-data ${selectedNumber.includes(cell) ? ' __cell-selected' : ''}`}
                        key={`${paperId}_cell_${i}`}
                        onClick={(e) => {
                            e.preventDefault();
                            if (selectedNumber.includes(cell)) {
                                return;
                            }
                            if (props.listNumber.includes(cell)) {
                                const temp = [...selectedNumber];
                                temp.push(cell);
                                setSelectedNumber(temp);
                                checkBeforeBingo(cell);
                            } else {
                                toast.error(`Làm gì có số ${cell} mà chọn.`);
                            }

                        }}
                    ><span>{cell}</span></div>
                )
            }
        }
        return elements;
    }

    function checkBeforeBingo(cellValue: number) {
        const papersData = props.paperIds.reduce((acc: number[], cur) => {
            const data = PaperData[cur];
            const rowCheck = data.reduce((row_acc: any, row_cur) => {
                if (row_cur.includes(cellValue)) {
                    row_acc = row_cur;
                }
                return row_acc;
            }, null);
            if (rowCheck !== null) {
                acc = rowCheck;
            }
            return acc;
        }, []);

        const checkCellInRow = papersData.reduce((acc: number, cur) => {
            if (selectedNumber.includes(cur) || cellValue === cur) {
                acc++;
            }
            return acc;
        }, 0);
        if (checkCellInRow === 4) {
            props.onWaitingBingo();
        }
    }

    function getBingoRow() {
        const allRows = props.paperIds.reduce((acc: number[][], cur) => {
            const data = PaperData[cur];
            acc.push(...data);
            return acc;
        }, []);

        const rowBingo = allRows.reduce((acc: any, cur) => {
            const isRowBingo = cur.reduce((acc_cell: boolean, cur_cell) => {
                if (!selectedNumber.includes(cur_cell)) {
                    acc_cell = false;
                }
                return acc_cell;
            }, true);
            if (isRowBingo) {
                acc = cur;
            }
            return acc;
        }, null);

        const paperId = rowBingo ? props.paperIds.reduce((acc: any, cur) => {
            const data = PaperData[cur];
            const check = data.reduce((acc_row: any, cur_row) => {
                if (cur_row.includes(rowBingo[0])) {
                    acc_row = cur;
                }
                return acc_row;
            }, null);
            acc = check ? check : acc;
            return acc;
        }, null) : null;

        return { rowBingo, paperId };
    }

    function getRenderFooterButton(): React.ReactNode[] {
        let nodes: React.ReactNode[] = []
        nodes.push(
            <Button key='cancel' onClick={() => {
                if (props.onClosePopup) {
                    setHasWinner(true);
                    props.onClosePopup();
                }
            }}>Đóng</Button>
        );
        return nodes;
    }

}