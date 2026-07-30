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
    private playCount = 0;
    private pendingComplete: (() => void) | null = null;

    protected onLoad(): void {
        this.syncLayer();
        this.node.active = false;
    }

    /** Chuẩn bị render — bật node scale 0 rồi tắt (gọi từ GameManager). */
    public primeVisible(): void {
        this.syncLayer();
        this.node.active = true;
        this.node.setScale(0, 0, 0);
    }

    /** Hoàn tất warm-up sau 1 frame. */
    public finishPrime(): void {
        this.node.active = false;
        this.node.setScale(1, 1, 1);
    }

    /** Reset trước trận mới — bàn đầu lại hiện ngay. */
    public resetForMatch(): void {
        this.stop();
        this.playCount = 0;
    }

    /** Scale hiện GOAL rồi ẩn; gọi callback khi xong. */
    public play(onComplete?: () => void): void {
        this.cancelPending();

        this.playing = true;
        this.pendingComplete = onComplete ?? null;
        this.playCount += 1;

        this.node.active = true;
        this.bringToFront();
        this.syncLayer();

        const isFirstPlay = this.playCount === 1;
        const totalDuration = isFirstPlay
            ? this.holdDuration + this.hideDuration
            : this.showDuration + this.holdDuration + this.hideDuration;
        this.scheduleOnce(this.onSafetyTimeout, totalDuration + 0.15);

        if (isFirstPlay) {
            this.node.setScale(1, 1, 1);
            this.runHoldAndHide();
            return;
        }

        const s = this.startScale;
        this.node.setScale(s, s, s);
        this.runTween();
    }

    /** Dừng tween và ẩn ngay — không gọi callback. */
    public stop(): void {
        this.cancelPending();
        this.playing = false;
        this.pendingComplete = null;
        this.node.active = false;
    }

    private syncLayer(): void {
        const parentLayer = this.node.parent?.layer;

        if (parentLayer !== undefined) {
            this.node.layer = parentLayer;
        }
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

    private runHoldAndHide(): void {
        if (!this.playing) {
            return;
        }

        const s = this.startScale;
        const end = new Vec3(1, 1, 1);
        const shrink = new Vec3(s, s, s);

        tween(this.node)
            .to(this.holdDuration, { scale: end })
            .to(this.hideDuration, { scale: shrink }, { easing: 'backIn' })
            .call(() => this.finishPlay())
            .start();
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
