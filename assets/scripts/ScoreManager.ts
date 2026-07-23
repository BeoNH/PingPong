import { _decorator, Component } from 'cc';
import { GAME_EVENTS, type PaddleSide, type ScoreChangedPayload } from './GameEvents';

const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property
    private winScore = 5;

    private playerScore = 0;
    private aiScore = 0;

    public addPoint(scorer: PaddleSide): boolean {
        if (scorer === 'player') {
            this.playerScore += 1;
        } else {
            this.aiScore += 1;
        }

        const payload: ScoreChangedPayload = {
            player: this.playerScore,
            ai: this.aiScore,
        };
        this.node.emit(GAME_EVENTS.SCORE_CHANGED, payload);

        return this.playerScore >= this.winScore || this.aiScore >= this.winScore;
    }

    public getWinner(): PaddleSide | null {
        if (this.playerScore >= this.winScore) {
            return 'player';
        }

        if (this.aiScore >= this.winScore) {
            return 'ai';
        }

        return null;
    }

    public getScores(): ScoreChangedPayload {
        return { player: this.playerScore, ai: this.aiScore };
    }

    public resetScores(): void {
        this.playerScore = 0;
        this.aiScore = 0;

        const payload: ScoreChangedPayload = {
            player: this.playerScore,
            ai: this.aiScore,
        };
        this.node.emit(GAME_EVENTS.SCORE_CHANGED, payload);
    }
}
