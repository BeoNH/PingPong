import { _decorator, Node } from 'cc';
import {
    AiDifficultyLevel,
    getAiDifficultyPreset,
    getSelectedAiDifficulty,
} from './AiDifficulty';
import { PaddleBase } from './PaddleBase';

const { ccclass, property } = _decorator;

interface BallMotionReader {
    getVelocityX(): number;
}

@ccclass('AiPaddle')
export class AiPaddle extends PaddleBase {
    @property(Node)
    private readonly ballNode: Node | null = null;

    private moveSpeed = 320;
    private reactionDelay = 0.14;
    private aimError = 60;
    private chaseThresholdX = 140;
    private targetY = 0;
    private reactionTimer = 0;
    private ballMotion: BallMotionReader | null = null;

    protected onLoad(): void {
        super.onLoad();

        if (!this.ballNode) {
            throw new Error('AiPaddle: ballNode is required');
        }

        this.ballMotion = this.ballNode.getComponent('BallController') as unknown as BallMotionReader | null;

        if (!this.ballMotion) {
            throw new Error('AiPaddle: ballNode requires BallController');
        }
    }

    protected start(): void {
        this.applyDifficulty(getSelectedAiDifficulty());
    }

    protected update(deltaTime: number): void {
        if (!this.shouldChaseBall()) {
            this.reactionTimer = 0;
            return;
        }

        this.reactionTimer += deltaTime;
        if (this.reactionTimer < this.reactionDelay) {
            this.moveTowardTarget(deltaTime);
            return;
        }

        this.reactionTimer = 0;
        this.targetY = this.getChaseTargetY();
        this.moveTowardTarget(deltaTime);
    }

    public applyDifficulty(level: AiDifficultyLevel): void {
        const preset = getAiDifficultyPreset(level);
        this.moveSpeed = preset.moveSpeed;
        this.reactionDelay = preset.reactionDelay;
        this.aimError = preset.aimError;
        this.chaseThresholdX = preset.chaseThresholdX;
        this.reactionTimer = 0;
    }

    public resetForServe(): void {
        this.targetY = 0;
        this.reactionTimer = 0;
        this.resetToCenter();
    }

    private shouldChaseBall(): boolean {
        if (!this.ballNode!.active) {
            return false;
        }

        if (this.ballMotion!.getVelocityX() <= 0) {
            return false;
        }

        return this.ballNode!.position.x >= this.chaseThresholdX;
    }

    private getChaseTargetY(): number {
        const ballY = this.ballNode!.position.y;

        if (this.aimError <= 0) {
            return ballY;
        }

        return ballY + (Math.random() * 2 - 1) * this.aimError;
    }

    private moveTowardTarget(deltaTime: number): void {
        const currentY = this.node.position.y;
        const diff = this.targetY - currentY;
        const maxStep = this.moveSpeed * deltaTime;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), maxStep);

        this.applyClampedY(currentY + step);
    }
}
