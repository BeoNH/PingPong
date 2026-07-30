import { _decorator, instantiate, Label, Node, warn } from 'cc';
import { userDATA } from '../GameType';
import { NetworkManager } from '../NetworkManager';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

@ccclass('PopupRank')
export class PopupRank extends UiPopup {

    @property({ type: Node, tooltip: 'Bộ top 3 người cao nhất' })
    protected layoutTOP3: Node | null = null;

    @property({ type: Node, tooltip: 'Bộ các thứ tự còn lại' })
    protected layoutBXH: Node | null = null;

    @property({ type: Node, tooltip: 'Bảng xếp hạng của người chơi' })
    protected playerRank: Node | null = null;

    @property({ type: Node, tooltip: 'Các dòng trỏng bảng' })
    protected itemBXH: Node | null = null;


    protected onLoad(): void {
        super.onLoad();

        this.itemBXH!.active = false;
    }

    public onClose(): void {
        this.hide();
    }

    protected onBeforeShow(): void {
        this.initRankingList();
    }

    private initRankingList(): void {
        const layoutTOP3 = this.layoutTOP3!;
        const layoutBXH = this.layoutBXH!;
        const playerRank = this.playerRank!;
        const itemBXH = this.itemBXH!;

        const url = `/getRankList`;
        const data = {
            username: userDATA.userName,
        };

        NetworkManager.instance.httpPost(url, data).then((res) => {
            if (!res) {
                warn(`[PopupRank] ${url} => ${String(res)}`);
                return;
            }

            const listBXH = (res as {
                board: { name: string; numScore: string | number }[];
                yourInfo: { rank: string | number; name: string; numScore: string | number };
            }).board;

            for (let i = 0; i < 3; i++) {
                const e = layoutTOP3.children[i];

                if (listBXH[i]) {
                    e.active = true;
                    e.getChildByPath('txtName')!.getComponent(Label)!.string = this.limitName(listBXH[i].name);
                    e.getChildByPath('txtScore')!.getComponent(Label)!.string = String(listBXH[i].numScore);
                }
            }

            const remCount = listBXH.length - 3;
            const pool = layoutBXH.children;

            for (let j = 0; j < remCount; j++) {
                let item: Node;

                if (j < pool.length) {
                    item = pool[j];
                    item.active = true;
                } else {
                    item = instantiate(itemBXH);
                    item.parent = layoutBXH;
                    item.active = true;
                }

                const rankIndex = j + 3;
                item.getChildByPath('txtRank')!.getComponent(Label)!.string = `${rankIndex + 1}`;
                item.getChildByPath('txtName')!.getComponent(Label)!.string = this.limitName(listBXH[rankIndex].name);
                item.getChildByPath('txtScore')!.getComponent(Label)!.string = String(listBXH[rankIndex].numScore);
            }

            if (remCount > 0) {
                for (let k = remCount; k < pool.length; k++) {
                    pool[k].active = false;
                }
            }

            const yourInfo = (res as { yourInfo: { rank: string | number; name: string; numScore: string | number } }).yourInfo;
            playerRank.getChildByPath('playerRank')!.getComponent(Label)!.string = String(yourInfo.rank);
            playerRank.getChildByPath('playerName')!.getComponent(Label)!.string = this.limitName(yourInfo.name);
            playerRank.getChildByPath('playerScore')!.getComponent(Label)!.string = String(yourInfo.numScore);
        });
    }

    private limitName(name: string): string {
        const maxLength = 15;

        if (name.length > maxLength) {
            return name.substring(0, maxLength) + ' . . .';
        }

        return name;
    }
}
