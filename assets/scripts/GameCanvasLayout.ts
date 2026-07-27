import {
    _decorator,
    Component,
    Node,
    ResolutionPolicy,
    screen,
    view,
    Vec3,
} from 'cc';
import { AiPaddle } from './AiPaddle';
import {
    COURT_LAYOUT,
    DESIGN_HEIGHT,
    DESIGN_WIDTH,
    SCENE_NODE_NAMES,
} from './GameType';
import { PlayerPaddle } from './PlayerPaddle';

const { ccclass } = _decorator;

/** Gắn trên Canvas — policy ngang và vị trí vợt/serve. */
@ccclass('GameCanvasLayout')
export class GameCanvasLayout extends Component {
    private playerPaddle: PlayerPaddle | null = null;
    private aiPaddle: AiPaddle | null = null;
    private playerServeAnchor: Node | null = null;
    private aiServeAnchor: Node | null = null;
    private readonly tempPosition: Vec3 = new Vec3();

    protected onLoad(): void {
        this.playerPaddle = this.requireComponent('PlayerPaddle', PlayerPaddle);
        this.aiPaddle = this.requireComponent('AiPaddle', AiPaddle);
        this.playerServeAnchor = this.requireChild('ServeAnchor');
        this.aiServeAnchor = this.requireChild('AiServeAnchor');

        this.ensureBackgroundBehind();
        this.applyScreenPolicy();
        view.on('canvas-resize', this.onCanvasResize, this);
        this.applyLayout();
    }

    protected onDestroy(): void {
        view.off('canvas-resize', this.onCanvasResize, this);
    }

    private onCanvasResize(): void {
        this.applyScreenPolicy();
        this.ensureBackgroundBehind();
        this.applyLayout();
    }

    /** BG render dưới gameplay/HUD — sibling index ngay sau Camera. */
    private ensureBackgroundBehind(): void {
        const background = this.node.getChildByName(SCENE_NODE_NAMES.BG);
        const camera = this.node.getChildByName(SCENE_NODE_NAMES.CAMERA);
        const targetIndex = camera ? camera.getSiblingIndex() + 1 : 0;

        if (background && background.getSiblingIndex() !== targetIndex) {
            background.setSiblingIndex(targetIndex);
        }
    }

    /** Chọn FIXED_HEIGHT/FIXED_WIDTH để lấp khung ngang. */
    private applyScreenPolicy(): void {
        const windowSize = screen.windowSize;
        const screenAspect = windowSize.width / windowSize.height;
        const designAspect = DESIGN_WIDTH / DESIGN_HEIGHT;
        const policy = screenAspect >= designAspect
            ? ResolutionPolicy.FIXED_HEIGHT
            : ResolutionPolicy.FIXED_WIDTH;

        view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, policy);
    }

    /** Đặt vị trí vợt/serve (player phải, AI trái). */
    private applyLayout(): void {
        this.setNodeX(this.playerPaddle!.node, COURT_LAYOUT.playerPaddleX);
        this.setNodeX(this.aiPaddle!.node, COURT_LAYOUT.aiPaddleX);
        this.setNodeX(this.playerServeAnchor!, COURT_LAYOUT.playerServeX);
        this.setNodeX(this.aiServeAnchor!, COURT_LAYOUT.aiServeX);
    }

    private requireChild(path: string): Node {
        const child = this.node.getChildByPath(path);

        if (!child) {
            throw new Error(`GameCanvasLayout: missing Canvas/${path}`);
        }

        return child;
    }

    private requireComponent<T extends Component>(name: string, type: new () => T): T {
        const child = this.requireChild(name);
        const component = child.getComponent(type);

        if (!component) {
            throw new Error(`GameCanvasLayout: ${name} requires ${type.name}`);
        }

        return component;
    }

    private setNodeX(node: Node, x: number): void {
        node.getPosition(this.tempPosition);
        this.tempPosition.x = x;
        node.setPosition(this.tempPosition);
    }
}
