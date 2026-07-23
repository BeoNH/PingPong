import { _decorator, Node } from 'cc';
import { PaddleBase } from './PaddleBase';

const { ccclass, property } = _decorator;

@ccclass('AiPaddle')
export class AiPaddle extends PaddleBase {
    @property(Node)
    private readonly ballNode: Node | null = null;

    @property
    private moveSpeed = 420;

    @property
    private reactionDelay = 0.08;

    @property
    private chaseThresholdX = 0;

    private targetY = 0;
    private reactionTimer = 0;

    protected onLoad(): void {
        super.onLoad();

        if (!this.ballNode) {
            throw new Error('AiPaddle: ballNode is required');
        }
    }

    protected update(deltaTime: number): void {
        if (!this.shouldChaseBall()) {
            this.reactionTimer = 0;
            return;
        }

        this.reactionTimer += deltaTime;
        if (this.reactionTimer < this.reactionDelay) {
            return;
        }

        this.targetY = this.ballNode!.position.y;
        this.moveTowardTarget(deltaTime);
    }

    private shouldChaseBall(): boolean {
        return this.ballNode!.position.x >= this.chaseThresholdX;
    }

    private moveTowardTarget(deltaTime: number): void {
        const currentY = this.node.position.y;
        const diff = this.targetY - currentY;
        const maxStep = this.moveSpeed * deltaTime;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), maxStep);

        this.applyClampedY(currentY + step);
    }

    public resetForServe(): void {
        this.targetY = 0;
        this.reactionTimer = 0;
        this.resetToCenter();
    }
}
