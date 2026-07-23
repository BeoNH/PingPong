import { _decorator } from 'cc';
import { PaddleBase } from './PaddleBase';

const { ccclass, property } = _decorator;

@ccclass('PlayerPaddle')
export class PlayerPaddle extends PaddleBase {
    @property
    private moveSpeed = 500;

    public moveByDirection(direction: number, deltaTime: number): void {
        this.node.getPosition(this.tempPosition);
        this.tempPosition.y += direction * this.moveSpeed * deltaTime;
        this.applyClampedY(this.tempPosition.y);
    }

    public setTargetY(targetY: number): void {
        this.applyClampedY(targetY);
    }
}
