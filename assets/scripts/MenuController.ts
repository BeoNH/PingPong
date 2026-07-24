import { _decorator, Button, Component, instantiate, Label, Prefab } from 'cc';
import { AiDifficultyLevel, setSelectedAiDifficulty } from './AiDifficulty';
import { SCENE_NAMES } from './SceneNames';
import { TutorialPopup } from './popups/TutorialPopup';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

/** Tạm ẩn UI chọn độ khó — mặc định Vừa. Bật lại khi cần F008 full. */
const SHOW_DIFFICULTY_UI = false;

/** Menu — chơi, hướng dẫn, spawn popup từ prefab. */
@ccclass('MenuController')
export class MenuController extends Component {
    @property({ type: Button, tooltip: 'Nút Chơi' })
    private readonly playButton: Button | null = null;

    @property({ type: Button, tooltip: 'Nút Dễ' })
    private readonly easyButton: Button | null = null;

    @property({ type: Button, tooltip: 'Nút Vừa' })
    private readonly mediumButton: Button | null = null;

    @property({ type: Button, tooltip: 'Nút Khó' })
    private readonly hardButton: Button | null = null;

    @property({ type: Label, tooltip: 'Nhãn độ khó' })
    private readonly difficultyLabel: Label | null = null;

    @property({ type: Button, tooltip: 'Mở hướng dẫn' })
    private readonly helpButton: Button | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup hướng dẫn' })
    private readonly tutorialPopupPrefab: Prefab | null = null;

    protected onLoad(): void {
        if (!this.playButton) {
            throw new Error('MenuController: playButton is required');
        }

        if (!this.helpButton) {
            throw new Error('MenuController: helpButton is required');
        }

        if (!this.tutorialPopupPrefab) {
            throw new Error('MenuController: tutorialPopupPrefab is required');
        }

        setSelectedAiDifficulty(AiDifficultyLevel.Medium);

        if (!SHOW_DIFFICULTY_UI) {
            this.hideDifficultyUi();
        }
    }

    protected onEnable(): void {
        this.playButton!.node.on(Button.EventType.CLICK, this.onPlayClicked, this);
        this.helpButton!.node.on(Button.EventType.CLICK, this.onHelpClicked, this);

        if (SHOW_DIFFICULTY_UI) {
            this.easyButton!.node.on(Button.EventType.CLICK, this.onEasyClicked, this);
            this.mediumButton!.node.on(Button.EventType.CLICK, this.onMediumClicked, this);
            this.hardButton!.node.on(Button.EventType.CLICK, this.onHardClicked, this);
        }
    }

    protected onDisable(): void {
        this.playButton!.node.off(Button.EventType.CLICK, this.onPlayClicked, this);
        this.helpButton!.node.off(Button.EventType.CLICK, this.onHelpClicked, this);

        if (SHOW_DIFFICULTY_UI) {
            this.easyButton!.node.off(Button.EventType.CLICK, this.onEasyClicked, this);
            this.mediumButton!.node.off(Button.EventType.CLICK, this.onMediumClicked, this);
            this.hardButton!.node.off(Button.EventType.CLICK, this.onHardClicked, this);
        }
    }

    private onPlayClicked(): void {
        loadScene(SCENE_NAMES.GAME);
    }

    private onEasyClicked(): void {
        setSelectedAiDifficulty(AiDifficultyLevel.Easy);
    }

    private onMediumClicked(): void {
        setSelectedAiDifficulty(AiDifficultyLevel.Medium);
    }

    private onHardClicked(): void {
        setSelectedAiDifficulty(AiDifficultyLevel.Hard);
    }

    /** Spawn prefab hướng dẫn chơi. */
    private onHelpClicked(): void {
        const node = instantiate(this.tutorialPopupPrefab!);
        const popup = node.getComponent(TutorialPopup);

        if (!popup) {
            throw new Error('MenuController: tutorialPopupPrefab must have TutorialPopup');
        }

        popup.show();
    }

    private hideDifficultyUi(): void {
        if (this.easyButton?.node) {
            this.easyButton.node.active = false;
        }

        if (this.mediumButton?.node) {
            this.mediumButton.node.active = false;
        }

        if (this.hardButton?.node) {
            this.hardButton.node.active = false;
        }

        if (this.difficultyLabel?.node) {
            this.difficultyLabel.node.active = false;
        }
    }
}
