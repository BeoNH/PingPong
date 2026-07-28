import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

/** Hiển thị một chữ số 0–9 bằng sprite trên node HUD. */
@ccclass('SpriteScoreDisplay')
export class SpriteScoreDisplay extends Component {
    @property({ type: [SpriteFrame], tooltip: 'Ảnh số 0–9 (10 phần tử, index = chữ số)' })
    private digitFrames: SpriteFrame[] = [];

    private sprite: Sprite | null = null;

    protected onLoad(): void {
        if (this.digitFrames.length !== 10) {
            throw new Error('SpriteScoreDisplay: digitFrames requires 10 SpriteFrames (0–9)');
        }

        this.sprite = this.getComponent(Sprite);
        if (!this.sprite) {
            throw new Error('SpriteScoreDisplay: Sprite component is required');
        }

        this.sprite.sizeMode = Sprite.SizeMode.RAW;
        this.setScore(0);
    }

    /** Cập nhật chữ số hiển thị (0–9). */
    public setScore(value: number): void {
        const digit = Math.min(Math.max(Math.floor(value), 0), 9);
        this.sprite!.spriteFrame = this.digitFrames[digit];
    }
}
