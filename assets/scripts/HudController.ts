import { _decorator, Component, instantiate, Label, Prefab } from 'cc';
import { GameOverPopup } from './popups/GameOverPopup';
import { GAME_EVENTS } from './GameEvents';
import { GameManager } from './GameManager';
import { ScoreManager } from './ScoreManager';
import { SCENE_NAMES, type MatchEndedPayload, type ScoreChangedPayload } from './GameType';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

/** HUD score + spawn popup Game Over từ prefab. */
@ccclass('HudController')
export class HudController extends Component {
    @property({ type: Label, tooltip: 'Điểm người chơi' })
    private readonly playerScoreLabel: Label | null = null;

    @property({ type: Label, tooltip: 'Điểm AI' })
    private readonly aiScoreLabel: Label | null = null;

    @property({ type: ScoreManager, tooltip: 'Quản lý điểm' })
    private readonly scoreManager: ScoreManager | null = null;

    @property({ type: GameManager, tooltip: 'Điều phối trận' })
    private readonly gameManager: GameManager | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup Game Over' })
    private readonly gameOverPopupPrefab: Prefab | null = null;

    protected onLoad(): void {
        if (!this.playerScoreLabel) {
            throw new Error('HudController: playerScoreLabel is required');
        }

        if (!this.aiScoreLabel) {
            throw new Error('HudController: aiScoreLabel is required');
        }

        if (!this.scoreManager) {
            throw new Error('HudController: scoreManager is required');
        }

        if (!this.gameManager) {
            throw new Error('HudController: gameManager is required');
        }

        if (!this.gameOverPopupPrefab) {
            throw new Error('HudController: gameOverPopupPrefab is required');
        }
    }

    protected onEnable(): void {
        this.scoreManager!.node.on(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.on(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
        this.refreshScoreLabels(this.scoreManager!.getScores());
    }

    protected onDisable(): void {
        this.scoreManager!.node.off(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.off(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
    }

    private onScoreChanged(payload: ScoreChangedPayload): void {
        this.refreshScoreLabels(payload);
    }

    /** Spawn prefab Game Over khi trận kết thúc. */
    private onMatchEnded(payload: MatchEndedPayload): void {
        const node = instantiate(this.gameOverPopupPrefab!);
        const popup = node.getComponent(GameOverPopup);

        if (!popup) {
            throw new Error('HudController: gameOverPopupPrefab must have GameOverPopup');
        }

        popup.open(
            payload.winner,
            () => {
                this.gameManager!.restartMatch();
            },
            () => {
                loadScene(SCENE_NAMES.MENU);
            },
        );
    }

    private refreshScoreLabels(payload: ScoreChangedPayload): void {
        this.playerScoreLabel!.string = String(payload.player);
        this.aiScoreLabel!.string = String(payload.ai);
    }
}
