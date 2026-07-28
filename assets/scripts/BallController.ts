import { _decorator, Animation, Component, instantiate, Node, Sprite, UITransform, Vec3 } from 'cc';
import { GAME_EVENTS } from './GameEvents';
import {
    COURT_BOUNDS,
    GOAL_BOUNDS,
    type BallOutPayload,
    type PaddleHitPayload,
    type PaddleSide,
} from './GameType';
import { AiPaddle } from './AiPaddle';
import { PaddleBase } from './PaddleBase';
import { PlayerPaddle } from './PlayerPaddle';
import { ScreenShake } from './ScreenShake';
import { applyDefaultSpriteFrame } from './utils/ApplyDefaultSpriteFrame';

const { ccclass, property } = _decorator;

type PaddleFace = 'left' | 'right' | 'top' | 'bottom';

/** Điều khiển chuyển động bóng, va chạm vợt và biên sân. */
@ccclass('BallController')
export class BallController extends Component {
    private playing = false;

    @property({ type: PlayerPaddle, tooltip: 'Vợt người chơi' })
    private readonly playerPaddle: PlayerPaddle | null = null;

    @property({ type: AiPaddle, tooltip: 'Vợt AI' })
    private readonly aiPaddle: AiPaddle | null = null;

    @property({ type: Node, tooltip: 'Node mẫu effect chạm (ẩn trong scene)' })
    private readonly effectTemplate: Node | null = null;

    @property({ type: ScreenShake, tooltip: 'Rung Canvas khi va chạm' })
    private screenShake: ScreenShake | null = null;

    @property({ tooltip: 'Tốc độ bóng ban đầu (px/s)' })
    private speed = 500;

    @property({ tooltip: 'Tốc độ bóng tối đa (px/s)' })
    private maxSpeed = 1000;

    @property({ tooltip: 'Tăng tốc mỗi lần chạm (px/s)' })
    private speedGainPerHit = 30;

    @property({ tooltip: 'Góc bật tối đa (°)' })
    private maxBounceAngleDeg = 60;

    @property({ tooltip: 'Lệch góc ngẫu nhiên (°)' })
    private bounceAngleJitterDeg = 10;

    private readonly effectInsetPx = 20;

    private currentSpeed = 500;

    private readonly velocity: Vec3 = new Vec3();
    private readonly tempPosition: Vec3 = new Vec3();
    private halfWidth = 0;
    private halfHeight = 0;
    private ballAnimation: Animation | null = null;

    private readonly moveClip = 'ball';
    private readonly effectClip = 'effect_0';
    private readonly effectDuration = 0.37;

    /** Chặn va chạm lặp khi bóng còn chồng lên vợt (cạnh trên/dưới dễ kích nhiều frame). */
    private readonly paddleContactLocked: Record<PaddleSide, boolean> = {
        ai: false,
        player: false,
    };

    /** Khoảng cách tối thiểu giữa hai lần spawn effect (mọi nguồn). */
    private effectCooldownLeft = 0;
    private readonly minEffectIntervalSec = 0.1;

    protected onLoad(): void {
        if (!this.playerPaddle) {
            throw new Error('BallController: playerPaddle is required');
        }

        if (!this.aiPaddle) {
            throw new Error('BallController: aiPaddle is required');
        }

        const uiTransform = this.node.getComponent(UITransform);

        if (!uiTransform) {
            throw new Error('BallController: UITransform is required');
        }

        this.halfWidth = uiTransform.contentSize.width * 0.5;
        this.halfHeight = uiTransform.contentSize.height * 0.5;

        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            applyDefaultSpriteFrame(sprite);
        }

        this.ballAnimation = this.getComponent(Animation);

        if (this.effectTemplate) {
            this.effectTemplate.active = false;
        }

        this.resolveScreenShake();
    }

    private resolveScreenShake(): void {
        if (this.screenShake) {
            return;
        }

        const canvas = this.node.parent;
        this.screenShake = canvas?.getComponent(ScreenShake) ?? null;
    }

    protected update(deltaTime: number): void {
        if (!this.playing) {
            return;
        }

        this.node.getPosition(this.tempPosition);
        this.tempPosition.x += this.velocity.x * deltaTime;
        this.tempPosition.y += this.velocity.y * deltaTime;

        this.effectCooldownLeft = Math.max(0, this.effectCooldownLeft - deltaTime);
        this.refreshPaddleContactLocks();
        this.resolveVerticalBounds();
        this.resolvePaddleCollision('ai', this.aiPaddle!);
        this.resolvePaddleCollision('player', this.playerPaddle!);

        if (this.resolveHorizontalOut()) {
            return;
        }

        this.node.setPosition(this.tempPosition);
        this.syncBallRollAnimation();
    }

    public setPlaying(value: boolean): void {
        this.playing = value;

        if (value) {
            this.ballAnimation?.play(this.moveClip);
            this.syncBallRollAnimation();
        } else {
            this.ballAnimation?.stop();
        }
    }

    /** Ẩn/hiện bóng — ẩn thì dừng và reset vận tốc. */
    public setVisible(value: boolean): void {
        this.node.active = value;

        if (!value) {
            this.playing = false;
            this.velocity.set(0, 0, 0);
            this.currentSpeed = this.speed;
            this.ballAnimation?.stop();
        }
    }

    public getVelocityX(): number {
        return this.velocity.x;
    }

    /** Đặt bóng tại điểm serve, chưa phát bóng. */
    public resetToServe(position: Vec3, directionX: number): void {
        this.currentSpeed = this.speed;
        this.paddleContactLocked.ai = false;
        this.paddleContactLocked.player = false;
        this.effectCooldownLeft = 0;
        this.node.setPosition(position);
        this.velocity.set(directionX * this.currentSpeed, 0, 0);
    }

    /** Phát bóng theo hướng đã chuẩn hóa. */
    public launch(directionX: number, directionY = 0): void {
        this.currentSpeed = this.speed;
        const length = Math.hypot(directionX, directionY) || 1;
        this.velocity.set(
            (directionX / length) * this.currentSpeed,
            (directionY / length) * this.currentSpeed,
            0,
        );
    }

    /** Phản xạ bóng khỏi biên trên/dưới sân. */
    private resolveVerticalBounds(): void {
        const { bottom, top } = COURT_BOUNDS;

        if (this.tempPosition.y + this.halfHeight >= top && this.velocity.y > 0) {
            this.tempPosition.y = top - this.halfHeight;
            this.velocity.y = -Math.abs(this.velocity.y);
            this.boostSpeedAndApply();
            this.spawnHitEffect(this.tempPosition.x, this.tempPosition.y, this.tempPosition.x, top);
        }

        if (this.tempPosition.y - this.halfHeight <= bottom && this.velocity.y < 0) {
            this.tempPosition.y = bottom + this.halfHeight;
            this.velocity.y = Math.abs(this.velocity.y);
            this.boostSpeedAndApply();
            this.spawnHitEffect(this.tempPosition.x, this.tempPosition.y, this.tempPosition.x, bottom);
        }
    }

    /** Ghi điểm hoặc nảy khi bóng chạm biên trái/phải — chỉ goal Y mới tính điểm. */
    private resolveHorizontalOut(): boolean {
        const { left, right } = COURT_BOUNDS;

        if (this.tempPosition.x - this.halfWidth <= left) {
            if (this.isInGoalZone()) {
                this.emitBallOut('player');
                return true;
            }

            if (this.velocity.x < 0) {
                this.tempPosition.x = left + this.halfWidth;
                this.velocity.x = Math.abs(this.velocity.x);
                this.boostSpeedAndApply();
                this.spawnHitEffect(this.tempPosition.x, this.tempPosition.y, left, this.tempPosition.y);
            }

            return false;
        }

        if (this.tempPosition.x + this.halfWidth >= right) {
            if (this.isInGoalZone()) {
                this.emitBallOut('ai');
                return true;
            }

            if (this.velocity.x > 0) {
                this.tempPosition.x = right - this.halfWidth;
                this.velocity.x = -Math.abs(this.velocity.x);
                this.boostSpeedAndApply();
                this.spawnHitEffect(this.tempPosition.x, this.tempPosition.y, right, this.tempPosition.y);
            }

            return false;
        }

        return false;
    }

    private isInGoalZone(): boolean {
        const { bottom, top } = GOAL_BOUNDS;
        return this.tempPosition.y >= bottom && this.tempPosition.y <= top;
    }

    /** Dừng bóng và phát event ghi điểm. */
    private emitBallOut(scorer: PaddleSide): void {
        this.playing = false;
        this.ballAnimation?.stop();
        const payload: BallOutPayload = { scorer };
        this.node.emit(GAME_EVENTS.BALL_OUT, payload);
    }

    /** Va chạm vợt — mặt trước bật góc; trên/dưới phản xạ; bỏ qua mặt sau. */
    private resolvePaddleCollision(side: PaddleSide, paddle: PaddleBase): void {
        if (this.paddleContactLocked[side]) {
            return;
        }

        if (!paddle.intersectsBall(this.tempPosition.x, this.tempPosition.y, this.halfWidth, this.halfHeight)) {
            return;
        }

        const paddleX = paddle.node.position.x;
        const paddleY = paddle.getCenterY();
        const padHalfW = paddle.getHalfWidth();
        const padHalfH = paddle.getHalfHeight();
        const ballX = this.tempPosition.x;
        const ballY = this.tempPosition.y;
        const sep = 2;

        const penLeft = ballX + this.halfWidth - (paddleX - padHalfW);
        const penRight = paddleX + padHalfW - (ballX - this.halfWidth);
        const penBottom = ballY + this.halfHeight - (paddleY - padHalfH);
        const penTop = paddleY + padHalfH - (ballY - this.halfHeight);

        const frontFace: PaddleFace = side === 'ai' ? 'right' : 'left';
        const backFace: PaddleFace = side === 'ai' ? 'left' : 'right';
        const backPen = backFace === 'left' ? penLeft : penRight;
        const frontPen = frontFace === 'right' ? penRight : penLeft;

        if (backPen <= frontPen && backPen <= penBottom && backPen <= penTop) {
            return;
        }

        const face = this.pickPaddleHitFace(frontFace, frontPen, penBottom, penTop);

        if (face !== frontFace) {
            this.tempPosition.y = face === 'top'
                ? paddleY + padHalfH + this.halfHeight + sep
                : paddleY - padHalfH - this.halfHeight - sep;
            this.paddleContactLocked[side] = true;
            return;
        }

        let hitOffset = (ballY - paddleY) / padHalfH;
        hitOffset = Math.min(Math.max(hitOffset, -1), 1);

        this.boostSpeed();

        const directionX = side === 'ai' ? 1 : -1;
        const jitterDeg = (Math.random() * 2 - 1) * this.bounceAngleJitterDeg;
        const angleDeg = hitOffset * this.maxBounceAngleDeg + jitterDeg;
        const angleRad = (angleDeg * Math.PI) / 180;

        this.velocity.x = Math.cos(angleRad) * this.currentSpeed * directionX;
        this.velocity.y = Math.sin(angleRad) * this.currentSpeed;
        this.tempPosition.x = paddleX + directionX * (padHalfW + this.halfWidth + sep);

        this.paddleContactLocked[side] = true;

        paddle.playHitAnimation();
        this.spawnHitEffect(this.tempPosition.x, this.tempPosition.y, paddleX, paddleY);

        const payload: PaddleHitPayload = {
            side,
            hitOffset,
            x: this.tempPosition.x,
            y: this.tempPosition.y,
        };
        this.node.emit(GAME_EVENTS.PADDLE_HIT, payload);
    }

    /** Mở khóa vợt khi bóng đã ra khỏi hitbox — tránh spawn effect liên tục. */
    private refreshPaddleContactLocks(): void {
        if (this.paddleContactLocked.ai && this.aiPaddle
            && !this.aiPaddle.intersectsBall(this.tempPosition.x, this.tempPosition.y, this.halfWidth, this.halfHeight)) {
            this.paddleContactLocked.ai = false;
        }

        if (this.paddleContactLocked.player && this.playerPaddle
            && !this.playerPaddle.intersectsBall(this.tempPosition.x, this.tempPosition.y, this.halfWidth, this.halfHeight)) {
            this.paddleContactLocked.player = false;
        }
    }

    private spawnHitEffect(ballX: number, ballY: number, towardX: number, towardY: number): void {
        if (this.effectCooldownLeft > 0) {
            return;
        }

        this.effectCooldownLeft = this.minEffectIntervalSec;
        this.screenShake?.shake();

        if (!this.effectTemplate) {
            return;
        }

        const { x, y } = this.computeEffectPosition(ballX, ballY, towardX, towardY);

        const parent = this.node.parent;
        if (!parent) {
            return;
        }

        const effect = instantiate(this.effectTemplate);
        effect.active = true;
        effect.layer = this.node.layer;
        effect.setParent(parent);
        effect.setPosition(x, y, 0);
        effect.setSiblingIndex(parent.children.length - 1);

        const animation = effect.getComponent(Animation);
        if (!animation) {
            effect.destroy();
            return;
        }

        animation.stop();
        animation.play(this.effectClip);

        animation.once(Animation.EventType.FINISHED, () => {
            effect.destroy();
        }, effect);
        this.scheduleOnce(() => {
            if (effect.isValid) {
                effect.destroy();
            }
        }, this.effectDuration);
    }

    /** Dịch effect từ tâm bóng về phía điểm chạm (vợt/tường). */
    private computeEffectPosition(
        ballX: number,
        ballY: number,
        towardX: number,
        towardY: number,
    ): { x: number; y: number } {
        const dx = towardX - ballX;
        const dy = towardY - ballY;
        const dist = Math.hypot(dx, dy);

        if (dist <= 0 || this.effectInsetPx <= 0) {
            return { x: ballX, y: ballY };
        }

        const move = Math.min(this.effectInsetPx, dist);

        return {
            x: ballX + (dx / dist) * move,
            y: ballY + (dy / dist) * move,
        };
    }

    /** Tốc độ clip `ball` theo vận tốc — cảm giác lăn nhanh hơn khi bóng nhanh. */
    private syncBallRollAnimation(): void {
        if (!this.ballAnimation || !this.playing) {
            return;
        }

        const state = this.ballAnimation.getState(this.moveClip);
        if (!state) {
            return;
        }

        const ratio = this.currentSpeed / this.speed;
        state.speed = Math.min(Math.max(ratio * 1.35, 1), 3.2);
    }

    private pickPaddleHitFace(
        frontFace: PaddleFace,
        frontPen: number,
        penBottom: number,
        penTop: number,
    ): PaddleFace {
        let face: PaddleFace = frontFace;
        let minPen = frontPen;

        if (penBottom < minPen) {
            minPen = penBottom;
            face = 'bottom';
        }

        if (penTop < minPen) {
            face = 'top';
        }

        return face;
    }

    private boostSpeed(): void {
        this.currentSpeed = Math.min(this.currentSpeed + this.speedGainPerHit, this.maxSpeed);
    }

    private boostSpeedAndApply(): void {
        this.boostSpeed();
        this.applyCurrentSpeed();
        this.syncBallRollAnimation();
    }

    private applyCurrentSpeed(): void {
        const magnitude = Math.hypot(this.velocity.x, this.velocity.y);

        if (magnitude <= 0) {
            return;
        }

        const scale = this.currentSpeed / magnitude;
        this.velocity.x *= scale;
        this.velocity.y *= scale;
    }
}
