import { _decorator, instantiate, Label, Node, warn } from 'cc';
import { userDATA } from '../GameType';
import { NetworkManager } from '../NetworkManager';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

@ccclass('PopupHistory')
export class PopupHistory extends UiPopup {

    @property({ type: Node, tooltip: 'Danh sách lịch sử chơi' })
    protected layoutHistory: Node | null = null;

    @property({ type: Node, tooltip: 'Các dòng tỏng bảng' })
    protected itemHis: Node | null = null;

    protected onLoad(): void {
        super.onLoad();

        this.itemHis!.active = false;
    }

    public onClose(): void {
        this.hide();
    }

    protected onBeforeShow(): void {
        this.initHistoryList();
    }

    private initHistoryList(): void {
        const url = `/getHistory`;
        const data = {
            username: userDATA.userName,
        };

        NetworkManager.instance.httpPost(url, data).then((res) => {
            if (!res) {
                warn(`[PopupHistory] ${url} => ${String(res)}`);
                return;
            }

            const listHis = (res as { history: { date: string; numScore: string | number }[] }).history;
            const pool = this.layoutHistory!.children;

            for (let i = 0; i < listHis.length; i++) {
                let item: Node;

                if (i < pool.length) {
                    item = pool[i];
                    item.active = true;
                } else {
                    item = instantiate(this.itemHis!);
                    item.parent = this.layoutHistory;
                    item.active = true;
                }

                item.getChildByPath('txtDate')!.getComponent(Label)!.string = this.formatDate(listHis[i].date);
                item.getChildByPath('txtScore')!.getComponent(Label)!.string = String(listHis[i].numScore) + " ";
            }

            for (let k = listHis.length; k < pool.length; k++) {
                pool[k].active = false;
            }
        });
    }

    private formatDate(dateString: string): string {
        const date: Date = new Date(dateString);
        const datePart: string = date.toDateString().split(' ').slice(1).join('_');
        const timePart: string = date.toTimeString().split(' ')[0];
        return `${datePart} ${timePart}`;
    }
}
