import { _decorator, Component, Node, Vec3 } from 'cc';
import { AiPaddle } from './AiPaddle';
import { BallController } from './BallController';
import { GAME_EVENTS, type BallOutPayload, GameState, type MatchEndedPayload } from './GameEvents';
import { PlayerPaddle } from './PlayerPaddle';
import { ScoreManager } from './ScoreManager';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(BallController)
    private readonly ballController: BallController | null = null;

    @property(ScoreManager)
    private readonly scoreManager: ScoreManager | null = null;

    @property(PlayerPaddle)
    private readonly playerPaddle: PlayerPaddle | null = null;

    @property(AiPaddle)
    private readonly aiPaddle: AiPaddle | null = null;

    @property(Node)
    private readonly playerServeAnchor: Node | null = null;

    @property(Node)
    private readonly aiServeAnchor: Node | null = null;

    @property
    private pointResetDelay = 1;

    private state: GameState = GameState.Ready;
    private serveDirectionX = 1;
    private pendingPointReset = false;
    private readonly servePosition: Vec3 = new Vec3();

    protected onLoad(): void {
        if (!this.ballController) {
            throw new Error('GameManager: ballController is required');
        }

        if (!this.scoreManager) {
            throw new Error('GameManager: scoreManager is required');
        }

        if (!this.playerPaddle) {
            throw new Error('GameManager: playerPaddle is required');
        }

        if (!this.aiPaddle) {
            throw new Error('GameManager: aiPaddle is required');
        }

        if (!this.playerServeAnchor) {
            throw new Error('GameManager: playerServeAnchor is required');
        }

        if (!this.aiServeAnchor) {
            throw new Error('GameManager: aiServeAnchor is required');
        }
    }

    protected onEnable(): void {
        this.ballController!.node.on(GAME_EVENTS.BALL_OUT, this.onBallOut, this);
    }

    protected onDisable(): void {
        this.ballController!.node.off(GAME_EVENTS.BALL_OUT, this.onBallOut, this);
        this.unschedule(this.continueAfterPoint);
    }

    protected start(): void {
        this.resetRoundPositions();
        this.enterServing();
        this.startRally();
    }

    public isPlaying(): boolean {
        return this.state === GameState.Playing;
    }

    public getState(): GameState {
        return this.state;
    }

    public restartMatch(): void {
        if (this.state !== GameState.GameOver) {
            return;
        }

        this.unschedule(this.continueAfterPoint);
        this.pendingPointReset = false;
        this.serveDirectionX = 1;
        this.scoreManager!.resetScores();
        this.resetRoundPositions();
        this.enterServing();
        this.startRally();
    }

    public startRally(): void {
        if (this.state !== GameState.Serving) {
            return;
        }

        this.state = GameState.Playing;
        this.ballController!.setPlaying(true);
        this.placeBallAtServeAnchor();
        this.ballController!.launch(this.serveDirectionX, (Math.random() - 0.5) * 0.4);
    }

    private onBallOut(payload: BallOutPayload): void {
        if (this.state !== GameState.Playing || this.pendingPointReset) {
            return;
        }

        this.state = GameState.PointScored;
        this.ballController!.setPlaying(false);
        this.serveDirectionX = payload.scorer === 'player' ? 1 : -1;
        this.resetRoundPositions();

        const matchEnded = this.scoreManager!.addPoint(payload.scorer);
        if (matchEnded) {
            this.enterGameOver();
            return;
        }

        this.pendingPointReset = true;
        this.scheduleOnce(this.continueAfterPoint, this.pointResetDelay);
    }

    private continueAfterPoint(): void {
        this.pendingPointReset = false;

        if (this.state !== GameState.PointScored) {
            return;
        }

        this.enterServing();
        this.startRally();
    }

    private enterGameOver(): void {
        this.state = GameState.GameOver;
        this.ballController!.setPlaying(false);

        const winner = this.scoreManager!.getWinner();
        if (!winner) {
            throw new Error('GameManager.enterGameOver: winner is required');
        }

        const payload: MatchEndedPayload = { winner };
        this.node.emit(GAME_EVENTS.MATCH_ENDED, payload);
    }

    private enterServing(): void {
        this.state = GameState.Serving;
        this.ballController!.setPlaying(false);
        this.placeBallAtServeAnchor();
    }

    private resetRoundPositions(): void {
        this.playerPaddle!.resetToCenter();
        this.aiPaddle!.resetForServe();
        this.placeBallAtServeAnchor();
    }

    private placeBallAtServeAnchor(): void {
        this.getActiveServeAnchor().getPosition(this.servePosition);
        this.ballController!.resetToServe(this.servePosition, this.serveDirectionX);
    }

    private getActiveServeAnchor(): Node {
        return this.serveDirectionX > 0 ? this.playerServeAnchor! : this.aiServeAnchor!;
    }
}
