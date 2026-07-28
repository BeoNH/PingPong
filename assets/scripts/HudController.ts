import { _decorator, Component, instantiate, Prefab } from 'cc';
import { GameOverPopup } from './popups/GameOverPopup';
import { GAME_EVENTS } from './GameEvents';
import { GameManager } from './GameManager';
import { ScoreManager } from './ScoreManager';
import { SpriteScoreDisplay } from './SpriteScoreDisplay';
import { SCENE_NAMES, type MatchEndedPayload, type ScoreChangedPayload } from './GameType';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

/** HUD score + spawn popup Game Over từ prefab. */
@ccclass('HudController')
export class HudController extends Component {
    @property({ type: SpriteScoreDisplay, tooltip: 'Điểm người chơi' })
    private readonly playerScoreDisplay: SpriteScoreDisplay | null = null;

    @property({ type: SpriteScoreDisplay, tooltip: 'Điểm AI' })
    private readonly aiScoreDisplay: SpriteScoreDisplay | null = null;

    @property({ type: ScoreManager, tooltip: 'Quản lý điểm' })
    private readonly scoreManager: ScoreManager | null = null;

    @property({ type: GameManager, tooltip: 'Điều phối trận' })
    private readonly gameManager: GameManager | null = null;

    @property({ type: Prefab, tooltip: 'Prefab popup Game Over' })
    private readonly gameOverPopupPrefab: Prefab | null = null;

    protected onLoad(): void {
        if (!this.playerScoreDisplay) {
            throw new Error('HudController: playerScoreDisplay is required');
        }

        if (!this.aiScoreDisplay) {
            throw new Error('HudController: aiScoreDisplay is required');
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
        this.refreshScoreDisplays(this.scoreManager!.getScores());
    }

    protected onDisable(): void {
        this.scoreManager!.node.off(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.off(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
    }

    private onScoreChanged(payload: ScoreChangedPayload): void {
        this.refreshScoreDisplays(payload);
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

    private refreshScoreDisplays(payload: ScoreChangedPayload): void {
        this.playerScoreDisplay!.setScore(payload.player);
        this.aiScoreDisplay!.setScore(payload.ai);
    }
}
