import { _decorator, Button, Component, Node, tween, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

/** Toggle UI — hiện on/off và trượt knob trái/phải. */
@ccclass('ToggleSwitch')
export class ToggleSwitch extends Component {
    @property({ type: Node, tooltip: 'Node trạng thái bật' })
    private onNode: Node | null = null;

    @property({ type: Node, tooltip: 'Node trạng thái tắt' })
    private offNode: Node | null = null;

    @property({ type: Button, tooltip: 'Nút bấm toggle' })
    private toggleButton: Button | null = null;

    @property({ tooltip: 'Vị trí X button khi tắt (px)' })
    private offPositionX = -14;

    @property({ tooltip: 'Vị trí X button khi bật (px)' })
    private onPositionX = 14;

    @property({ tooltip: 'Thời gian tween button (s)' })
    private tweenDuration = 0.15;

    private value = true;
    private readonly knobPosition: Vec3 = new Vec3();
    private onValueChanged: ((value: boolean) => void) | null = null;

    protected onLoad(): void {
        this.resolveRefs();

        if (!this.onNode || !this.offNode) {
            throw new Error('ToggleSwitch: onNode and offNode are required');
        }

        this.captureDefaultPositions();
    }

    protected onEnable(): void {
        const clickTarget = this.toggleButton?.node ?? this.node;
        clickTarget.on(Node.EventType.TOUCH_END, this.onToggleClicked, this);
    }

    protected onDisable(): void {
        const clickTarget = this.toggleButton?.node ?? this.node;
        clickTarget.off(Node.EventType.TOUCH_END, this.onToggleClicked, this);
    }

    /** Gán giá trị ban đầu hoặc đồng bộ từ SettingsService. */
    public setValue(nextValue: boolean, animate = false): void {
        this.value = nextValue;
        this.applyVisual(animate);
    }

    public getValue(): boolean {
        return this.value;
    }

    /** Callback khi người chơi đổi trạng thái. */
    public setOnChange(handler: (value: boolean) => void): void {
        this.onValueChanged = handler;
    }

    private onToggleClicked(): void {
        this.setValue(!this.value, true);
        this.onValueChanged?.(this.value);
    }

    private applyVisual(animate: boolean): void {
        this.onNode!.active = this.value;
        this.offNode!.active = !this.value;

        const targetX = this.value ? this.onPositionX : this.offPositionX;
        const startX = this.value ? this.offPositionX : this.onPositionX;

        this.node.getPosition(this.knobPosition);
        this.knobPosition.x = targetX;

        tween(this.node).stop();

        if (animate) {
            this.node.setPosition(startX, this.knobPosition.y, this.knobPosition.z);
            tween(this.node)
                .to(this.tweenDuration, { position: this.knobPosition.clone() }, { easing: 'quadOut' })
                .start();
            return;
        }

        this.node.setPosition(this.knobPosition);
    }

    private resolveRefs(): void {
        const buttonNode = this.node.name === 'button'
            ? this.node
            : this.node.getChildByName('button');

        this.onNode ??= buttonNode?.getChildByName('on') ?? this.node.getChildByName('on');
        this.offNode ??= buttonNode?.getChildByName('off') ?? this.node.getChildByName('off');
        this.toggleButton ??= buttonNode?.getComponent(Button)
            ?? this.node.getComponent(Button)
            ?? null;
    }

    private captureDefaultPositions(): void {
        const currentX = this.node.position.x;

        if (this.value) {
            this.onPositionX = currentX;
        } else {
            this.offPositionX = currentX;
        }

        if (Math.abs(this.onPositionX - this.offPositionX) < 1) {
            this.offPositionX = -14;
            this.onPositionX = 14;
        }
    }
}
