import { _decorator, Component, Sprite, UITransform, Vec3 } from 'cc';
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

    private currentSpeed = 500;

    private readonly velocity: Vec3 = new Vec3();
    private readonly tempPosition: Vec3 = new Vec3();
    private halfWidth = 0;
    private halfHeight = 0;

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
    }

    protected update(deltaTime: number): void {
        if (!this.playing) {
            return;
        }

        this.node.getPosition(this.tempPosition);
        this.tempPosition.x += this.velocity.x * deltaTime;
        this.tempPosition.y += this.velocity.y * deltaTime;

        this.resolveVerticalBounds();
        this.resolvePaddleCollision('ai', this.aiPaddle!);
        this.resolvePaddleCollision('player', this.playerPaddle!);

        if (this.resolveHorizontalOut()) {
            return;
        }

        this.node.setPosition(this.tempPosition);
    }

    public setPlaying(value: boolean): void {
        this.playing = value;
    }

    /** Ẩn/hiện bóng — ẩn thì dừng và reset vận tốc. */
    public setVisible(value: boolean): void {
        this.node.active = value;

        if (!value) {
            this.playing = false;
            this.velocity.set(0, 0, 0);
            this.currentSpeed = this.speed;
        }
    }

    public getVelocityX(): number {
        return this.velocity.x;
    }

    /** Đặt bóng tại điểm serve, chưa phát bóng. */
    public resetToServe(position: Vec3, directionX: number): void {
        this.currentSpeed = this.speed;
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

        if (this.tempPosition.y + this.halfHeight >= top) {
            this.tempPosition.y = top - this.halfHeight;
            this.velocity.y = -Math.abs(this.velocity.y);
            this.boostSpeedAndApply();
        }

        if (this.tempPosition.y - this.halfHeight <= bottom) {
            this.tempPosition.y = bottom + this.halfHeight;
            this.velocity.y = Math.abs(this.velocity.y);
            this.boostSpeedAndApply();
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

            this.tempPosition.x = left + this.halfWidth;
            this.velocity.x = Math.abs(this.velocity.x);
            this.boostSpeedAndApply();
            return false;
        }

        if (this.tempPosition.x + this.halfWidth >= right) {
            if (this.isInGoalZone()) {
                this.emitBallOut('ai');
                return true;
            }

            this.tempPosition.x = right - this.halfWidth;
            this.velocity.x = -Math.abs(this.velocity.x);
            this.boostSpeedAndApply();
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
        const payload: BallOutPayload = { scorer };
        this.node.emit(GAME_EVENTS.BALL_OUT, payload);
    }

    /** Va chạm vợt — mặt trước bật góc; trên/dưới phản xạ; bỏ qua mặt sau. */
    private resolvePaddleCollision(side: PaddleSide, paddle: PaddleBase): void {
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
        let hitOffset = (ballY - paddleY) / padHalfH;
        hitOffset = Math.min(Math.max(hitOffset, -1), 1);

        this.boostSpeed();

        if (face === frontFace) {
            const directionX = side === 'ai' ? 1 : -1;
            const jitterDeg = (Math.random() * 2 - 1) * this.bounceAngleJitterDeg;
            const angleDeg = hitOffset * this.maxBounceAngleDeg + jitterDeg;
            const angleRad = (angleDeg * Math.PI) / 180;

            this.velocity.x = Math.cos(angleRad) * this.currentSpeed * directionX;
            this.velocity.y = Math.sin(angleRad) * this.currentSpeed;
            this.tempPosition.x = paddleX + directionX * (padHalfW + this.halfWidth + sep);
        } else {
            this.velocity.y = face === 'top' ? -Math.abs(this.velocity.y) : Math.abs(this.velocity.y);
            this.applyCurrentSpeed();
            this.tempPosition.y = face === 'top'
                ? paddleY + padHalfH + this.halfHeight + sep
                : paddleY - padHalfH - this.halfHeight - sep;
        }

        const payload: PaddleHitPayload = { side, hitOffset };
        this.node.emit(GAME_EVENTS.PADDLE_HIT, payload);
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
