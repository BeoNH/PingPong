import {
    _decorator,
    Component,
    EventKeyboard,
    EventTouch,
    input,
    Input,
    KeyCode,
    Node,
    UITransform,
    Vec3,
} from 'cc';
import { PlayerPaddle } from './PlayerPaddle';

const { ccclass, property } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
    @property(PlayerPaddle)
    private readonly playerPaddle: PlayerPaddle | null = null;

    @property(Node)
    private readonly touchArea: Node | null = null;

    private readonly tempLocalPos: Vec3 = new Vec3();
    private moveUp = false;
    private moveDown = false;

    protected onLoad(): void {
        if (!this.playerPaddle) {
            throw new Error('InputHandler: playerPaddle is required');
        }

        if (!this.touchArea) {
            throw new Error('InputHandler: touchArea is required');
        }
    }

    protected onEnable(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.touchArea.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        this.touchArea.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected update(deltaTime: number): void {
        if (this.moveUp) {
            this.playerPaddle!.moveByDirection(1, deltaTime);
        }

        if (this.moveDown) {
            this.playerPaddle!.moveByDirection(-1, deltaTime);
        }
    }

    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.moveUp = true;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.moveDown = true;
                break;
            default:
                break;
        }
    }

    private onKeyUp(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.moveUp = false;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.moveDown = false;
                break;
            default:
                break;
        }
    }

    private onTouchMove(event: EventTouch): void {
        const uiTransform = this.touchArea!.getComponent(UITransform);

        if (!uiTransform) {
            throw new Error('InputHandler: touchArea requires UITransform');
        }

        const touchLocation = event.getUILocation();
        this.tempLocalPos.set(touchLocation.x, touchLocation.y, 0);
        uiTransform.convertToNodeSpaceAR(this.tempLocalPos, this.tempLocalPos);
        this.playerPaddle!.setTargetY(this.tempLocalPos.y);
    }
}
