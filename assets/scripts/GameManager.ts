import { _decorator, Animation, Component, Node, Vec3 } from 'cc';
import { AiPaddle } from './AiPaddle';
import { BallController } from './BallController';
import { GAME_EVENTS } from './GameEvents';
import { consumeGameIntroOnLoad } from './GameSession';
import { GoalCelebration } from './GoalCelebration';
import { SERVE_DIR, type BallOutPayload, GameState, type MatchEndedPayload, type ServeDirection } from './GameType';
import { PlayerPaddle } from './PlayerPaddle';
import { ScoreManager } from './ScoreManager';

const { ccclass, property } = _decorator;

const HAND_ANIM_CLIP = 'hand';

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

    @property({ type: Node, tooltip: 'Tay hướng dẫn intro (Canvas/hand)' })
    private readonly handNode: Node | null = null;

    @property({ type: GoalCelebration, tooltip: 'Effect GOAL khi ghi bàn' })
    private goalCelebration: GoalCelebration | null = null;

    @property({ tooltip: 'Chờ trước khi giao bóng (s)' })
    private serveLaunchDelay = 0.5;

    private state: GameState = GameState.Serving;
    private serveDirectionX: ServeDirection = SERVE_DIR.PLAYER;
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

        if (!this.handNode) {
            throw new Error('GameManager: handNode is required');
        }

        this.resolveGoalCelebration();
    }

    private resolveGoalCelebration(): void {
        if (this.goalCelebration) {
            return;
        }

        const goalNode = this.node.parent?.getChildByName('goal') ?? null;
        this.goalCelebration = goalNode?.getComponent(GoalCelebration) ?? null;

        if (!this.goalCelebration) {
            throw new Error('GameManager: Canvas/goal requires GoalCelebration component');
        }
    }

    protected onEnable(): void {
        this.ballController!.node.on(GAME_EVENTS.BALL_OUT, this.onBallOut, this);
        this.ballController!.node.on(GAME_EVENTS.BALL_EXITED, this.onBallExited, this);
        this.node.on(GAME_EVENTS.PLAYER_PADDLE_INPUT, this.onPlayerPaddleInput, this);
    }

    protected onDisable(): void {
        this.ballController!.node.off(GAME_EVENTS.BALL_OUT, this.onBallOut, this);
        this.ballController!.node.off(GAME_EVENTS.BALL_EXITED, this.onBallExited, this);
        this.node.off(GAME_EVENTS.PLAYER_PADDLE_INPUT, this.onPlayerPaddleInput, this);
        this.unschedule(this.continueAfterPoint);
        this.unschedule(this.startRally);
        this.goalCelebration?.stop();
    }

    protected start(): void {
        this.resolveGoalCelebration();

        if (consumeGameIntroOnLoad()) {
            this.beginIntroFromMenu();
            return;
        }

        this.prepareNormalMatchStart();
    }

    /** Bắt đầu trận mới sau GameOver. */
    public restartMatch(): void {
        if (this.state !== GameState.GameOver) {
            return;
        }

        this.unschedule(this.continueAfterPoint);
        this.unschedule(this.startRally);
        this.goalCelebration?.stop();
        this.pendingPointReset = false;
        this.serveDirectionX = SERVE_DIR.PLAYER;
        this.scoreManager!.resetScores();
        this.prepareNormalMatchStart();
    }

    /** Giao bóng và bắt đầu rally. */
    public startRally(): void {
        if (this.state !== GameState.Serving) {
            return;
        }

        this.state = GameState.Playing;
        this.ballController!.setPlaying(true);
        this.placeBallAtServeAnchor();
        this.ballController!.launch(
            this.serveDirectionX,
            (Math.random() - 0.5) * 0.4,
        );
    }

    /** Xử lý bóng vào khung goal — ghi điểm; bóng vẫn lăn cho đến khi ra khỏi màn hình. */
    private onBallOut(payload: BallOutPayload): void {
        if (this.state !== GameState.Playing || this.pendingPointReset) {
            return;
        }

        this.state = GameState.PointScored;
        this.serveDirectionX = payload.scorer === 'player' ? SERVE_DIR.PLAYER : SERVE_DIR.AI;
        this.prepareAfterPoint();

        const matchEnded = this.scoreManager!.addPoint(payload.scorer);
        this.pendingPointReset = true;
        this.goalCelebration!.play(() => {
            this.pendingPointReset = false;

            if (matchEnded) {
                this.enterGameOver();
                return;
            }

            this.continueAfterPoint();
        });
    }

    /** Ẩn bóng sau khi đã lăn hết khỏi màn hình. */
    private onBallExited(): void {
        if (this.state !== GameState.PointScored && this.state !== GameState.GameOver) {
            return;
        }

        this.ballController!.setPlaying(false);
        this.ballController!.setVisible(false);
    }

    /** Tiếp tục sau effect GOAL — serve lại. */
    private continueAfterPoint(): void {
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

    /** Reset vị trí vợt và bóng khi bắt đầu trận mới. */
    private resetMatchPositions(): void {
        this.playerPaddle!.resetToCenter();
        this.aiPaddle!.resetForServe();
        this.placeBallAtServeAnchor();
    }

    /** Sau mỗi điểm — chỉ reset AI; vợt player giữ nguyên vị trí. */
    private prepareAfterPoint(): void {
        this.aiPaddle!.resetForServe();
    }

    private placeBallAtServeAnchor(): void {
        this.getActiveServeAnchor().getPosition(this.servePosition);
        this.ballController!.resetToServe(this.servePosition, this.serveDirectionX);
    }

    private getActiveServeAnchor(): Node {
        return this.serveDirectionX === SERVE_DIR.PLAYER
            ? this.playerServeAnchor!
            : this.aiServeAnchor!;
    }

    /** Vào Game từ Menu — ẩn AI, hiện tay hướng dẫn. */
    private beginIntroFromMenu(): void {
        this.state = GameState.Intro;
        this.resetMatchPositions();
        this.aiPaddle!.node.active = false;
        this.ballController!.setPlaying(false);
        this.ballController!.setVisible(false);
        this.showHandHint();
    }

    /** Người chơi di chuyển vợt — kết thúc intro, giao bóng từ AI. */
    private onPlayerPaddleInput(): void {
        if (this.state !== GameState.Intro) {
            return;
        }

        this.completeIntroFromMenu();
    }

    private completeIntroFromMenu(): void {
        this.hideHandHint();
        this.aiPaddle!.node.active = true;
        this.serveDirectionX = SERVE_DIR.AI;
        this.enterServing();
        this.scheduleLaunchRally();
    }

    private prepareNormalMatchStart(): void {
        this.hideHandHint();
        this.aiPaddle!.node.active = true;
        this.resetMatchPositions();
        this.enterServing();
        this.scheduleLaunchRally();
    }

    private showHandHint(): void {
        const animation = this.handNode!.getComponent(Animation);

        if (!animation) {
            throw new Error('GameManager.showHandHint: hand requires Animation');
        }

        this.handNode!.active = true;
        animation.play(HAND_ANIM_CLIP);
    }

    private hideHandHint(): void {
        const animation = this.handNode!.getComponent(Animation);
        animation?.stop();
        this.handNode!.active = false;
    }
}
