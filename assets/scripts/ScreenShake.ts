import { _decorator, Component, Node, Vec3 } from 'cc';
import { SCENE_NODE_NAMES } from './GameType';
import { SettingsService } from './SettingsService';

const { ccclass, property } = _decorator;

/** Rung Camera mượt khi bóng va chạm — dao động giảm dần, tuân theo toggle effect. */
@ccclass('ScreenShake')
export class ScreenShake extends Component {
    @property({ type: Node, tooltip: 'Node rung (mặc định Camera con)' })
    private shakeTarget: Node | null = null;

    @property({ tooltip: 'Biên độ rung ban đầu (px)' })
    private amplitude = 7;

    @property({ tooltip: 'Thời gian rung (s)' })
    private duration = 0.2;

    @property({ tooltip: 'Tần số dao động (Hz)' })
    private frequency = 22;

    private active = false;
    private elapsed = 0;
    private readonly origin: Vec3 = new Vec3();
    private readonly offset: Vec3 = new Vec3();

    protected onLoad(): void {
        this.resolveShakeTarget();
        this.shakeTarget!.getPosition(this.origin);
    }

    protected update(deltaTime: number): void {
        if (!this.active || !this.shakeTarget) {
            return;
        }

        this.elapsed += deltaTime;
        const progress = this.elapsed / this.duration;

        if (progress >= 1) {
            this.shakeTarget.setPosition(this.origin);
            this.active = false;
            return;
        }

        const envelope = (1 - progress) * (1 - progress);
        const wave = this.elapsed * this.frequency * Math.PI * 2;
        const amp = this.amplitude * envelope;

        this.offset.set(
            Math.sin(wave) * amp,
            Math.cos(wave * 0.9) * amp * 0.65,
            0,
        );

        this.shakeTarget.setPosition(
            this.origin.x + this.offset.x,
            this.origin.y + this.offset.y,
            this.origin.z,
        );
    }

    /** Kích hoạt rung nếu effect đang bật — va chạm liên tiếp làm mới dao động. */
    public shake(): void {
        if (!SettingsService.isEffectEnabled() || !this.shakeTarget) {
            return;
        }

        if (!this.active) {
            this.shakeTarget.getPosition(this.origin);
        }

        this.elapsed = 0;
        this.active = true;
    }

    private resolveShakeTarget(): void {
        this.shakeTarget ??= this.node.getChildByName(SCENE_NODE_NAMES.CAMERA) ?? null;

        if (!this.shakeTarget) {
            throw new Error('ScreenShake: shakeTarget or Canvas/Camera is required');
        }
    }
}
