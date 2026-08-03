import { _decorator, Button, Component, instantiate, Label, Prefab } from 'cc';
import { AiDifficultyLevel, setSelectedAiDifficulty } from './AiDifficulty';
import { SCENE_NAMES, SHOW_DIFFICULTY_UI, userDATA } from './GameType';
import { NetworkManager, urlParam } from './NetworkManager';
import { PopupHistory } from './popups/PopupHistory';
import { PopupRank } from './popups/PopupRank';
import { SettingsPopup } from './popups/SettingsPopup';
import { TutorialPopup } from './popups/TutorialPopup';
import { markGameEntryFromMenu } from './GameSession';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

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

    @property({ type: Button, tooltip: 'Mở cài đặt' })
    private settingButton: Button | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup cài đặt' })
    private readonly settingsPopupPrefab: Prefab | null = null;

    @property({ type: Button, tooltip: 'Mở lịch sử chơi' })
    private historyButton: Button | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup lịch sử' })
    private readonly historyPopupPrefab: Prefab | null = null;

    @property({ type: Button, tooltip: 'Mở bảng xếp hạng' })
    private rankButton: Button | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup xếp hạng' })
    private readonly rankPopupPrefab: Prefab | null = null;

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

        this.settingButton ??= this.node.getChildByName('SettingButton')?.getComponent(Button) ?? null;
        this.historyButton ??= this.node.getChildByName('HistoryButton')?.getComponent(Button) ?? null;
        this.rankButton ??= this.node.getChildByName('RankButton')?.getComponent(Button) ?? null;

        if (!this.settingButton) {
            throw new Error('MenuController: settingButton is required');
        }

        if (!this.settingsPopupPrefab) {
            throw new Error('MenuController: settingsPopupPrefab is required');
        }

        setSelectedAiDifficulty(AiDifficultyLevel.Medium);

        if (!SHOW_DIFFICULTY_UI) {
            this.hideDifficultyUi();
        }
    }

    protected start(): void {
        void this.login();

        setTimeout(() => {
        void NetworkManager.instance.httpPost('/saveScore', {
                username: userDATA.userName,
                score: 1,
                time: 0
            });
        }, 2000);
    }

    /** Đăng nhập qua token trên URL, lưu username vào userDATA. */
    private async login(): Promise<void> {
        const login = await NetworkManager.instance.httpPost<{ username?: string }>('/login', {
            token: urlParam('token'),
        });

        if (login) {
            userDATA.userName = login.username;
        }
    }

    protected onEnable(): void {
        this.playButton!.node.on(Button.EventType.CLICK, this.onPlayClicked, this);
        this.helpButton!.node.on(Button.EventType.CLICK, this.onHelpClicked, this);
        this.settingButton!.node.on(Button.EventType.CLICK, this.onSettingClicked, this);
        this.historyButton?.node.on(Button.EventType.CLICK, this.onHistoryClicked, this);
        this.rankButton?.node.on(Button.EventType.CLICK, this.onRankClicked, this);

        if (SHOW_DIFFICULTY_UI) {
            this.easyButton!.node.on(Button.EventType.CLICK, this.onEasyClicked, this);
            this.mediumButton!.node.on(Button.EventType.CLICK, this.onMediumClicked, this);
            this.hardButton!.node.on(Button.EventType.CLICK, this.onHardClicked, this);
        }
    }

    protected onDisable(): void {
        this.playButton!.node.off(Button.EventType.CLICK, this.onPlayClicked, this);
        this.helpButton!.node.off(Button.EventType.CLICK, this.onHelpClicked, this);
        this.settingButton!.node.off(Button.EventType.CLICK, this.onSettingClicked, this);
        this.historyButton?.node.off(Button.EventType.CLICK, this.onHistoryClicked, this);
        this.rankButton?.node.off(Button.EventType.CLICK, this.onRankClicked, this);

        if (SHOW_DIFFICULTY_UI) {
            this.easyButton!.node.off(Button.EventType.CLICK, this.onEasyClicked, this);
            this.mediumButton!.node.off(Button.EventType.CLICK, this.onMediumClicked, this);
            this.hardButton!.node.off(Button.EventType.CLICK, this.onHardClicked, this);
        }
    }

    private onPlayClicked(): void {
        markGameEntryFromMenu();
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

    /** Spawn prefab cài đặt. */
    private onSettingClicked(): void {
        const node = instantiate(this.settingsPopupPrefab!);
        const popup = node.getComponent(SettingsPopup);

        if (!popup) {
            throw new Error('MenuController: settingsPopupPrefab must have SettingsPopup');
        }

        popup.show();
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

    /** Spawn prefab lịch sử chơi. */
    private onHistoryClicked(): void {
        const node = instantiate(this.historyPopupPrefab!);
        const popup = node.getComponent(PopupHistory);

        if (!popup) {
            throw new Error('MenuController: historyPopupPrefab must have PopupHistory');
        }

        popup.show();
    }

    /** Spawn prefab bảng xếp hạng. */
    private onRankClicked(): void {
        const node = instantiate(this.rankPopupPrefab!);
        const popup = node.getComponent(PopupRank);

        if (!popup) {
            throw new Error('MenuController: rankPopupPrefab must have PopupRank');
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
