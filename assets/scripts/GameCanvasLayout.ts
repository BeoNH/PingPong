import {
    _decorator,
    Component,
    Node,
    ResolutionPolicy,
    screen,
    Sprite,
    UITransform,
    view,
    Vec3,
} from 'cc';
import { AiPaddle } from './AiPaddle';
import { BallController } from './BallController';
import { PlayerPaddle } from './PlayerPaddle';
import { applyDefaultSpriteFrame } from './utils/ApplyDefaultSpriteFrame';

const { ccclass, property } = _decorator;

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

/** Gắn trên Canvas — policy ngang, layout Playfield, biên gameplay. */
@ccclass('GameCanvasLayout')
export class GameCanvasLayout extends Component {
    @property({ tooltip: 'Độ dày tường (px)' })
    private wallThickness = 20;

    @property({ tooltip: 'Độ rộng vạch giữa (px)' })
    private dividerWidth = 6;

    @property({ tooltip: 'Vợt cách biên theo % bề rộng' })
    private paddleInsetRatio = 0.88;

    @property({ tooltip: 'Serve cách tâm theo % bề rộng' })
    private serveInsetRatio = 0.38;

    private background: Node | null = null;
    private topWall: Node | null = null;
    private bottomWall: Node | null = null;
    private centerDivider: Node | null = null;
    private ballController: BallController | null = null;
    private playerPaddle: PlayerPaddle | null = null;
    private aiPaddle: AiPaddle | null = null;
    private playerServeAnchor: Node | null = null;
    private aiServeAnchor: Node | null = null;
    private readonly tempPosition: Vec3 = new Vec3();

    protected onLoad(): void {
        this.background = this.requireChild('Playfield/Background');
        this.topWall = this.requireChild('Playfield/TopWall');
        this.bottomWall = this.requireChild('Playfield/BottomWall');
        this.centerDivider = this.requireChild('Playfield/CenterDivider');
        this.ballController = this.requireComponent('Ball', BallController);
        this.playerPaddle = this.requireComponent('PlayerPaddle', PlayerPaddle);
        this.aiPaddle = this.requireComponent('AiPaddle', AiPaddle);
        this.playerServeAnchor = this.requireChild('ServeAnchor');
        this.aiServeAnchor = this.requireChild('AiServeAnchor');

        this.prepareVisual(this.background);
        this.prepareVisual(this.topWall);
        this.prepareVisual(this.bottomWall);
        this.prepareVisual(this.centerDivider);

        this.ensurePlayfieldBehind();
        this.applyScreenPolicy();
        view.on('canvas-resize', this.onCanvasResize, this);
        this.applyLayout();
    }

    protected onDestroy(): void {
        view.off('canvas-resize', this.onCanvasResize, this);
    }

    private onCanvasResize(): void {
        this.applyScreenPolicy();
        this.ensurePlayfieldBehind();
        this.applyLayout();
    }

    /** Playfield render dưới gameplay/HUD — sibling index ngay sau Camera. */
    private ensurePlayfieldBehind(): void {
        const playfield = this.node.getChildByName('Playfield');
        const camera = this.node.getChildByName('Camera');
        const targetIndex = camera ? camera.getSiblingIndex() + 1 : 0;

        if (playfield && playfield.getSiblingIndex() !== targetIndex) {
            playfield.setSiblingIndex(targetIndex);
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

    /** Co giãn Playfield và đồng bộ biên va chạm. */
    private applyLayout(): void {
        const canvasTransform = this.node.getComponent(UITransform);

        if (!canvasTransform) {
            throw new Error('GameCanvasLayout: Canvas UITransform is required');
        }

        const canvasWidth = canvasTransform.contentSize.width;
        const canvasHeight = canvasTransform.contentSize.height;
        const halfWidth = canvasWidth * 0.5;
        const halfHeight = canvasHeight * 0.5;
        const wall = this.wallThickness;
        const playBottom = -halfHeight + wall;
        const playTop = halfHeight - wall;
        const playHeight = playTop - playBottom;

        this.setNodeSize(this.background!, canvasWidth, canvasHeight);
        this.setNodeSize(this.topWall!, canvasWidth, wall);
        this.setNodeSize(this.bottomWall!, canvasWidth, wall);
        this.setNodeSize(this.centerDivider!, this.dividerWidth, playHeight);

        this.topWall!.setPosition(0, halfHeight - wall * 0.5, 0);
        this.bottomWall!.setPosition(0, -halfHeight + wall * 0.5, 0);
        this.centerDivider!.setPosition(0, 0, 0);
        this.background!.setPosition(0, 0, 0);

        this.ballController!.applyCourtBounds(-halfWidth, halfWidth, playBottom, playTop);
        this.playerPaddle!.applyCourtBounds(playBottom, playTop);
        this.aiPaddle!.applyCourtBounds(playBottom, playTop);

        this.setNodeX(this.playerPaddle!.node, -halfWidth * this.paddleInsetRatio);
        this.setNodeX(this.aiPaddle!.node, halfWidth * this.paddleInsetRatio);
        this.setNodeX(this.playerServeAnchor!, -halfWidth * this.serveInsetRatio);
        this.setNodeX(this.aiServeAnchor!, halfWidth * this.serveInsetRatio);
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

    private setNodeSize(node: Node, width: number, height: number): void {
        const uiTransform = node.getComponent(UITransform);

        if (!uiTransform) {
            throw new Error(`GameCanvasLayout: ${node.name} requires UITransform`);
        }

        uiTransform.setContentSize(width, height);
    }

    private setNodeX(node: Node, x: number): void {
        node.getPosition(this.tempPosition);
        this.tempPosition.x = x;
        node.setPosition(this.tempPosition);
    }

    private prepareVisual(node: Node): void {
        const sprite = node.getComponent(Sprite);

        if (!sprite) {
            throw new Error(`GameCanvasLayout: ${node.name} requires Sprite`);
        }

        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        applyDefaultSpriteFrame(sprite);
    }
}
