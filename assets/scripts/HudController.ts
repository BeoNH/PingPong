import { _decorator, Button, Component, Label } from 'cc';
import { GAME_EVENTS, type MatchEndedPayload, type PaddleSide, type ScoreChangedPayload } from './GameEvents';
import { GameManager } from './GameManager';
import { ScoreManager } from './ScoreManager';
import { SCENE_NAMES } from './SceneNames';
import { loadScene } from './utils/SceneLoader';

const { ccclass, property } = _decorator;

@ccclass('HudController')
export class HudController extends Component {
    @property(Label)
    private readonly playerScoreLabel: Label | null = null;

    @property(Label)
    private readonly aiScoreLabel: Label | null = null;

    @property(Label)
    private readonly messageLabel: Label | null = null;

    @property(ScoreManager)
    private readonly scoreManager: ScoreManager | null = null;

    @property(GameManager)
    private readonly gameManager: GameManager | null = null;

    @property(Button)
    private readonly restartButton: Button | null = null;

    @property(Button)
    private readonly menuButton: Button | null = null;

    protected onLoad(): void {
        if (!this.playerScoreLabel) {
            throw new Error('HudController: playerScoreLabel is required');
        }

        if (!this.aiScoreLabel) {
            throw new Error('HudController: aiScoreLabel is required');
        }

        if (!this.messageLabel) {
            throw new Error('HudController: messageLabel is required');
        }

        if (!this.scoreManager) {
            throw new Error('HudController: scoreManager is required');
        }

        if (!this.gameManager) {
            throw new Error('HudController: gameManager is required');
        }

        if (!this.restartButton) {
            throw new Error('HudController: restartButton is required');
        }

        if (!this.menuButton) {
            throw new Error('HudController: menuButton is required');
        }
    }

    protected onEnable(): void {
        this.scoreManager!.node.on(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.on(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
        this.restartButton!.node.on(Button.EventType.CLICK, this.onRestartClicked, this);
        this.menuButton!.node.on(Button.EventType.CLICK, this.onMenuClicked, this);
        this.refreshScoreLabels(this.scoreManager!.getScores());
        this.messageLabel!.string = '';
        this.setEndGameButtonsVisible(false);
    }

    protected onDisable(): void {
        this.scoreManager!.node.off(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.off(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
        this.restartButton!.node.off(Button.EventType.CLICK, this.onRestartClicked, this);
        this.menuButton!.node.off(Button.EventType.CLICK, this.onMenuClicked, this);
    }

    private onScoreChanged(payload: ScoreChangedPayload): void {
        this.refreshScoreLabels(payload);
    }

    private onMatchEnded(payload: MatchEndedPayload): void {
        this.messageLabel!.string = this.buildWinnerMessage(payload.winner);
        this.setEndGameButtonsVisible(true);
    }

    private onRestartClicked(): void {
        this.setEndGameButtonsVisible(false);
        this.messageLabel!.string = '';
        this.gameManager!.restartMatch();
    }

    private onMenuClicked(): void {
        loadScene(SCENE_NAMES.MENU);
    }

    private setEndGameButtonsVisible(visible: boolean): void {
        this.restartButton!.node.active = visible;
        this.menuButton!.node.active = visible;
    }

    private refreshScoreLabels(payload: ScoreChangedPayload): void {
        this.playerScoreLabel!.string = String(payload.player);
        this.aiScoreLabel!.string = String(payload.ai);
    }

    private buildWinnerMessage(winner: PaddleSide): string {
        return winner === 'player' ? 'Bạn thắng!' : 'AI thắng!';
    }
}
