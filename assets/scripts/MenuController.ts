import { _decorator, Button, Component } from 'cc';
import { SCENE_NAMES } from './SceneNames';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
    @property(Button)
    private readonly playButton: Button | null = null;

    protected onLoad(): void {
        if (!this.playButton) {
            throw new Error('MenuController: playButton is required');
        }
    }

    protected onEnable(): void {
        this.playButton!.node.on(Button.EventType.CLICK, this.onPlayClicked, this);
    }

    protected onDisable(): void {
        this.playButton!.node.off(Button.EventType.CLICK, this.onPlayClicked, this);
    }

    private onPlayClicked(): void {
        loadScene(SCENE_NAMES.GAME);
    }
}
