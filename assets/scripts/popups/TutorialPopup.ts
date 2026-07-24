import { _decorator, Button } from 'cc';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

/** Popup hướng dẫn chơi trên Menu. */
@ccclass('TutorialPopup')
export class TutorialPopup extends UiPopup {
    @property({ type: Button, tooltip: 'Đóng popup' })
    private closeButton: Button | null = null;

    protected onLoad(): void {
        super.onLoad();
        this.closeButton ??= this.container?.getChildByName('CloseButton')?.getComponent(Button) ?? null;

        if (!this.closeButton) {
            throw new Error('TutorialPopup: closeButton is required');
        }
    }

    protected onEnable(): void {
        this.closeButton!.node.on(Button.EventType.CLICK, this.onCloseClicked, this);
    }

    protected onDisable(): void {
        this.closeButton!.node.off(Button.EventType.CLICK, this.onCloseClicked, this);
    }

    private onCloseClicked(): void {
        this.hide();
    }
}
