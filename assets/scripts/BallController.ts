import { _decorator, Component, Sprite, UITransform, Vec3 } from 'cc';
import { GAME_EVENTS, type BallOutPayload, PaddleHitPayload, type PaddleSide } from './GameEvents';
import { AiPaddle } from './AiPaddle';
import { PaddleBase } from './PaddleBase';
import { PlayerPaddle } from './PlayerPaddle';
import { applyDefaultSpriteFrame } from './utils/ApplyDefaultSpriteFrame';

const { ccclass, property } = _decorator;

@ccclass('BallController')
export class BallController extends Component {
    private playing = false;

    @property(PlayerPaddle)
    private readonly playerPaddle: PlayerPaddle | null = null;

    @property(AiPaddle)
    private readonly aiPaddle: AiPaddle | null = null;

    @property
    private speed = 400;

    @property
    private courtLeft = -500;

    @property
    private courtRight = 500;

    @property
    private courtBottom = -280;

    @property
    private courtTop = 280;

    @property
    private maxBounceAngleDeg = 60;

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
        this.resolvePaddleCollision('player', this.playerPaddle!, 1);
        this.resolvePaddleCollision('ai', this.aiPaddle!, -1);

        if (this.resolveHorizontalOut()) {
            return;
        }

        this.node.setPosition(this.tempPosition);
    }

    public setPlaying(value: boolean): void {
        this.playing = value;
    }

    public isActive(): boolean {
        return this.playing;
    }

    public isMovingTowardAi(): boolean {
        return this.velocity.x > 0;
    }

    public resetToServe(position: Vec3, directionX: number): void {
        this.node.setPosition(position);
        this.velocity.set(directionX * this.speed, 0, 0);
    }

    public launch(directionX: number, directionY = 0): void {
        const length = Math.hypot(directionX, directionY) || 1;
        this.velocity.set(
            (directionX / length) * this.speed,
            (directionY / length) * this.speed,
            0,
        );
    }

    private resolveVerticalBounds(): void {
        if (this.tempPosition.y + this.halfHeight >= this.courtTop) {
            this.tempPosition.y = this.courtTop - this.halfHeight;
            this.velocity.y = -Math.abs(this.velocity.y);
        }

        if (this.tempPosition.y - this.halfHeight <= this.courtBottom) {
            this.tempPosition.y = this.courtBottom + this.halfHeight;
            this.velocity.y = Math.abs(this.velocity.y);
        }
    }

    private resolveHorizontalOut(): boolean {
        if (this.tempPosition.x - this.halfWidth <= this.courtLeft) {
            this.emitBallOut('ai');
            return true;
        }

        if (this.tempPosition.x + this.halfWidth >= this.courtRight) {
            this.emitBallOut('player');
            return true;
        }

        return false;
    }

    private emitBallOut(scorer: PaddleSide): void {
        this.playing = false;
        const payload: BallOutPayload = { scorer };
        this.node.emit(GAME_EVENTS.BALL_OUT, payload);
    }

    private resolvePaddleCollision(side: PaddleSide, paddle: PaddleBase, directionX: number): void {
        const movingTowardPaddle = directionX > 0
            ? this.velocity.x < 0
            : this.velocity.x > 0;

        if (!movingTowardPaddle) {
            return;
        }

        if (!paddle.intersectsBall(this.tempPosition.x, this.tempPosition.y, this.halfWidth, this.halfHeight)) {
            return;
        }

        const hitOffset = (this.tempPosition.y - paddle.getCenterY()) / paddle.getHalfHeight();
        const clampedOffset = Math.min(Math.max(hitOffset, -1), 1);
        const angleRad = (clampedOffset * this.maxBounceAngleDeg * Math.PI) / 180;
        const launchSpeed = Math.hypot(this.velocity.x, this.velocity.y) || this.speed;

        this.velocity.x = Math.cos(angleRad) * launchSpeed * directionX;
        this.velocity.y = Math.sin(angleRad) * launchSpeed;

        this.tempPosition.x = paddle.node.position.x + directionX * (paddle.getHalfWidth() + this.halfWidth + 2);

        const payload: PaddleHitPayload = { side, hitOffset: clampedOffset };
        this.node.emit(GAME_EVENTS.PADDLE_HIT, payload);
    }
}
