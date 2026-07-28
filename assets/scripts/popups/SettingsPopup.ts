import { _decorator, Button } from 'cc';
import { SettingsService } from '../SettingsService';
import { ToggleSwitch } from '../ToggleSwitch';
import { UiPopup } from './UiPopup';

const { ccclass, property } = _decorator;

/** Popup cài đặt — toggle âm thanh và hiệu ứng rung. */
@ccclass('SettingsPopup')
export class SettingsPopup extends UiPopup {
    @property({ type: ToggleSwitch, tooltip: 'Toggle âm thanh' })
    private soundToggle: ToggleSwitch | null = null;

    @property({ type: ToggleSwitch, tooltip: 'Toggle hiệu ứng' })
    private effectToggle: ToggleSwitch | null = null;

    @property({ type: Button, tooltip: 'Đóng popup' })
    private closeButton: Button | null = null;

    protected onLoad(): void {
        super.onLoad();
        this.resolvePanelRefs();

        if (!this.soundToggle || !this.effectToggle || !this.closeButton) {
            throw new Error('SettingsPopup: soundToggle, effectToggle, closeButton are required');
        }

        this.soundToggle.setValue(SettingsService.isSoundEnabled(), false);
        this.effectToggle.setValue(SettingsService.isEffectEnabled(), false);

        this.soundToggle.setOnChange((enabled) => {
            SettingsService.setSoundEnabled(enabled);
        });

        this.effectToggle.setOnChange((enabled) => {
            SettingsService.setEffectEnabled(enabled);
        });
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

    private resolvePanelRefs(): void {
        const panel = this.container;

        if (!panel) {
            return;
        }

        this.soundToggle ??= panel.getChildByName('Sound')?.getChildByName('button')?.getComponent(ToggleSwitch)
            ?? panel.getChildByName('Sound')?.getComponent(ToggleSwitch)
            ?? null;
        this.effectToggle ??= panel.getChildByName('Effect')?.getChildByName('button')?.getComponent(ToggleSwitch)
            ?? panel.getChildByName('Effect')?.getComponent(ToggleSwitch)
            ?? null;
        this.closeButton ??= panel.getChildByName('CloseButton')?.getComponent(Button) ?? null;
    }
}
