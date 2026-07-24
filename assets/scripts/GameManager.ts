import { _decorator, Component, Node, Vec3 } from 'cc';
import { AiPaddle } from './AiPaddle';
import { BallController } from './BallController';
import { GAME_EVENTS, type BallOutPayload, GameState, type MatchEndedPayload } from './GameEvents';
import { PlayerPaddle } from './PlayerPaddle';
import { ScoreManager } from './ScoreManager';

const { ccclass, property } = _decorator;

/** Điều phối trạng thái trận: serve → rally → điểm → game over. */
@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: BallController, tooltip: 'Bóng' })
    private readonly ballController: BallController | null = null;

    @property({ type: ScoreManager, tooltip: 'Cộng điểm' })
    private readonly scoreManager: ScoreManager | null = null;

    @property({ type: PlayerPaddle, tooltip: 'Vợt người chơi' })
    private readonly playerPaddle: PlayerPaddle | null = null;

    @property({ type: AiPaddle, tooltip: 'Vợt AI' })
    private readonly aiPaddle: AiPaddle | null = null;

    @property({ type: Node, tooltip: 'Điểm giao bóng (player)' })
    private readonly playerServeAnchor: Node | null = null;

    @property({ type: Node, tooltip: 'Điểm giao bóng (AI)' })
    private readonly aiServeAnchor: Node | null = null;

    @property({ tooltip: 'Chờ giữa các điểm (s)' })
    private pointResetDelay = 1;

    @property({ tooltip: 'Chờ trước khi giao bóng (s)' })
    private serveLaunchDelay = 0.5;

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
        this.unschedule(this.startRally);
    }

    protected start(): void {
        this.resetRoundPositions();
        this.enterServing();
        this.scheduleLaunchRally();
    }

    public isPlaying(): boolean {
        return this.state === GameState.Playing;
    }

    public getState(): GameState {
        return this.state;
    }

    /** Bắt đầu trận mới sau GameOver. */
    public restartMatch(): void {
        if (this.state !== GameState.GameOver) {
            return;
        }

        this.unschedule(this.continueAfterPoint);
        this.unschedule(this.startRally);
        this.pendingPointReset = false;
        this.serveDirectionX = 1;
        this.scoreManager!.resetScores();
        this.resetRoundPositions();
        this.enterServing();
        this.scheduleLaunchRally();
    }

    /** Giao bóng và bắt đầu rally. */
    public startRally(): void {
        if (this.state !== GameState.Serving) {
            return;
        }

        this.state = GameState.Playing;
        this.ballController!.setPlaying(true);
        this.placeBallAtServeAnchor();
        this.ballController!.launch(this.serveDirectionX, (Math.random() - 0.5) * 0.4);
    }

    /** Xử lý bóng ra biên — ghi điểm, ẩn bóng, serve lại. */
    private onBallOut(payload: BallOutPayload): void {
        if (this.state !== GameState.Playing || this.pendingPointReset) {
            return;
        }

        this.state = GameState.PointScored;
        this.ballController!.setPlaying(false);
        this.ballController!.setVisible(false);
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

    /** Tiếp tục sau delay giữa các điểm. */
    private continueAfterPoint(): void {
        this.pendingPointReset = false;

        if (this.state !== GameState.PointScored) {
            return;
        }

        this.enterServing();
        this.scheduleLaunchRally();
    }

    private scheduleLaunchRally(): void {
        this.unschedule(this.startRally);
        this.scheduleOnce(this.startRally, this.serveLaunchDelay);
    }

    /** Kết thúc trận — ẩn bóng, phát match-ended. */
    private enterGameOver(): void {
        this.state = GameState.GameOver;
        this.unschedule(this.startRally);
        this.ballController!.setPlaying(false);
        this.ballController!.setVisible(false);

        const winner = this.scoreManager!.getWinner();
        if (!winner) {
            throw new Error('GameManager.enterGameOver: winner is required');
        }

        const payload: MatchEndedPayload = { winner };
        this.node.emit(GAME_EVENTS.MATCH_ENDED, payload);
    }

    /** Chuẩn bị serve — hiện bóng tại anchor. */
    private enterServing(): void {
        this.state = GameState.Serving;
        this.ballController!.setPlaying(false);
        this.ballController!.setVisible(true);
        this.placeBallAtServeAnchor();
    }

    /** Reset vị trí vợt và bóng mỗi điểm. */
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
