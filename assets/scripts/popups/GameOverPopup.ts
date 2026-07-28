import { _decorator, Button, Node } from 'cc';
import { type PaddleSide } from '../GameType';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

/** Popup kết thúc trận — ảnh win/lose + nút Chơi lại / Menu. */
@ccclass('GameOverPopup')
export class GameOverPopup extends UiPopup {
    @property({ type: Node, tooltip: 'Ảnh thắng' })
    private winImageNode: Node | null = null;

    @property({ type: Node, tooltip: 'Ảnh thua' })
    private loseImageNode: Node | null = null;

    @property({ type: Button, tooltip: 'Chơi lại' })
    private restartButton: Button | null = null;

    @property({ type: Button, tooltip: 'Về menu' })
    private menuButton: Button | null = null;

    private onRestart: (() => void) | null = null;
    private onMenu: (() => void) | null = null;

    protected onLoad(): void {
        super.onLoad();
        this.resolvePanelRefs();

        if (!this.winImageNode || !this.loseImageNode || !this.restartButton || !this.menuButton) {
            throw new Error('GameOverPopup: winImageNode, loseImageNode, restartButton, menuButton are required');
        }
    }

    protected onEnable(): void {
        this.restartButton!.node.on(Button.EventType.CLICK, this.onRestartClicked, this);
        this.menuButton!.node.on(Button.EventType.CLICK, this.onMenuClicked, this);
    }

    protected onDisable(): void {
        this.restartButton!.node.off(Button.EventType.CLICK, this.onRestartClicked, this);
        this.menuButton!.node.off(Button.EventType.CLICK, this.onMenuClicked, this);
    }

    /** Cấu hình ảnh kết quả rồi hiện popup. */
    public open(winner: PaddleSide, onRestart: () => void, onMenu: () => void): void {
        const playerWon = winner === 'player';
        this.winImageNode!.active = playerWon;
        this.loseImageNode!.active = !playerWon;
        this.onRestart = onRestart;
        this.onMenu = onMenu;
        this.show();
    }

    private onRestartClicked(): void {
        const restart = this.onRestart;
        this.onRestart = null;
        this.onMenu = null;
        this.hide(() => {
            restart?.();
        });
    }

    private onMenuClicked(): void {
        const menu = this.onMenu;
        this.onRestart = null;
        this.onMenu = null;
        this.hide(() => {
            menu?.();
        });
    }

    private resolvePanelRefs(): void {
        const panel = this.container;

        if (!panel) {
            return;
        }

        this.winImageNode ??= panel.getChildByName('win');
        this.loseImageNode ??= panel.getChildByName('lose');
        this.restartButton ??= panel.getChildByName('RestartButton')?.getComponent(Button) ?? null;
        this.menuButton ??= panel.getChildByName('MenuButton')?.getComponent(Button) ?? null;
    }
}
