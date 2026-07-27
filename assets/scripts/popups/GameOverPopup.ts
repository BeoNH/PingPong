import { _decorator, Button, Label } from 'cc';
import { type PaddleSide } from '../GameType';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

/** Popup kết thúc trận — nút Chơi lại / Menu. */
@ccclass('GameOverPopup')
export class GameOverPopup extends UiPopup {
    @property({ type: Label, tooltip: 'Tiêu đề thắng/thua' })
    private titleLabel: Label | null = null;

    @property({ type: Button, tooltip: 'Chơi lại' })
    private restartButton: Button | null = null;

    @property({ type: Button, tooltip: 'Về menu' })
    private menuButton: Button | null = null;

    private onRestart: (() => void) | null = null;
    private onMenu: (() => void) | null = null;

    protected onLoad(): void {
        super.onLoad();
        this.resolvePanelRefs();

        if (!this.titleLabel || !this.restartButton || !this.menuButton) {
            throw new Error('GameOverPopup: titleLabel, restartButton, menuButton are required');
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

    /** Cấu hình nội dung rồi hiện popup. */
    public open(winner: PaddleSide, onRestart: () => void, onMenu: () => void): void {
        this.titleLabel!.string = winner === 'player' ? 'Bạn thắng!' : 'AI thắng!';
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

        this.titleLabel ??= panel.getChildByName('TitleLabel')?.getComponent(Label) ?? null;
        this.restartButton ??= panel.getChildByName('RestartButton')?.getComponent(Button) ?? null;
        this.menuButton ??= panel.getChildByName('MenuButton')?.getComponent(Button) ?? null;
    }
}
