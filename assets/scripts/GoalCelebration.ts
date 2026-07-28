import { _decorator, Component, tween, Vec3 } from 'cc';

const { ccclass } = _decorator;

/** Effect ảnh GOAL — scale hiện rồi ẩn sau khi ghi bàn. */
@ccclass('GoalCelebration')
export class GoalCelebration extends Component {
    private readonly showDuration = 0.25;
    private readonly holdDuration = 0.6;
    private readonly hideDuration = 0.2;
    private readonly startScale = 0.35;

    private playing = false;
    private pendingComplete: (() => void) | null = null;

    protected onLoad(): void {
        this.node.active = false;
    }

    /** Scale hiện GOAL rồi ẩn; gọi callback khi xong. */
    public play(onComplete?: () => void): void {
        this.cancelPending();

        this.playing = true;
        this.pendingComplete = onComplete ?? null;

        this.node.active = true;
        this.bringToFront();

        const s = this.startScale;
        this.node.setScale(s, s, s);

        const totalDuration = this.showDuration + this.holdDuration + this.hideDuration;
        this.scheduleOnce(this.onSafetyTimeout, totalDuration + 0.15);
        this.runTween();
    }

    /** Dừng tween và ẩn ngay — không gọi callback. */
    public stop(): void {
        this.cancelPending();
        this.playing = false;
        this.pendingComplete = null;
        this.node.active = false;
    }

    private cancelPending(): void {
        this.unschedule(this.onSafetyTimeout);
        tween(this.node).stop();
    }

    private bringToFront(): void {
        const parent = this.node.parent;
        if (parent) {
            this.node.setSiblingIndex(parent.children.length - 1);
        }
    }

    private runTween(): void {
        if (!this.playing) {
            return;
        }

        const s = this.startScale;
        const end = new Vec3(1, 1, 1);
        const shrink = new Vec3(s, s, s);

        tween(this.node)
            .to(this.showDuration, { scale: end }, { easing: 'backOut' })
            .to(this.holdDuration, { scale: end })
            .to(this.hideDuration, { scale: shrink }, { easing: 'backIn' })
            .call(() => this.finishPlay())
            .start();
    }

    private readonly onSafetyTimeout = (): void => {
        this.finishPlay();
    };

    private finishPlay(): void {
        if (!this.playing) {
            return;
        }

        this.playing = false;
        this.cancelPending();

        this.node.active = false;

        const complete = this.pendingComplete;
        this.pendingComplete = null;
        complete?.();
    }
}
