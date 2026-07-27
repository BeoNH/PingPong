import { _decorator, Component, Sprite, UITransform, Vec3 } from 'cc';
import { COURT_BOUNDS } from './GameType';
import { applyDefaultSpriteFrame } from './utils/ApplyDefaultSpriteFrame';

const { ccclass } = _decorator;

@ccclass('PaddleBase')
export class PaddleBase extends Component {
    protected readonly tempPosition: Vec3 = new Vec3();
    protected halfHeight = 0;

    protected onLoad(): void {
        const uiTransform = this.node.getComponent(UITransform);

        if (!uiTransform) {
            throw new Error(`${this.constructor.name}: UITransform is required`);
        }

        this.halfHeight = uiTransform.contentSize.height * 0.5;

        const sprite = this.node.getComponent(Sprite);
        if (sprite) {
            applyDefaultSpriteFrame(sprite);
        }
    }

    public getHalfHeight(): number {
        return this.halfHeight;
    }

    public getCenterY(): number {
        return this.node.position.y;
    }

    public getHalfWidth(): number {
        const uiTransform = this.node.getComponent(UITransform);
        return (uiTransform?.contentSize.width ?? 0) * 0.5;
    }

    public intersectsBall(ballX: number, ballY: number, ballHalfWidth: number, ballHalfHeight: number): boolean {
        const halfWidth = this.getHalfWidth();
        const paddleX = this.node.position.x;
        const paddleY = this.node.position.y;

        return (
            ballX + ballHalfWidth >= paddleX - halfWidth
            && ballX - ballHalfWidth <= paddleX + halfWidth
            && ballY + ballHalfHeight >= paddleY - this.halfHeight
            && ballY - ballHalfHeight <= paddleY + this.halfHeight
        );
    }

    protected applyClampedY(targetY: number): void {
        const minY = COURT_BOUNDS.bottom + this.halfHeight;
        const maxY = COURT_BOUNDS.top - this.halfHeight;
        const clampedY = Math.min(Math.max(targetY, minY), maxY);

        this.node.getPosition(this.tempPosition);
        this.tempPosition.y = clampedY;
        this.node.setPosition(this.tempPosition);
    }

    public resetToCenter(): void {
        this.node.getPosition(this.tempPosition);
        this.tempPosition.y = 0;
        this.applyClampedY(this.tempPosition.y);
    }
}
