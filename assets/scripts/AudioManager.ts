import { _decorator, AudioClip, AudioSource, Component } from 'cc';
import { BallController } from './BallController';
import { GAME_EVENTS } from './GameEvents';
import { type MatchEndedPayload, type ScoreChangedPayload } from './GameType';
import { GameManager } from './GameManager';
import { ScoreManager } from './ScoreManager';
import { SettingsService } from './SettingsService';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(BallController)
    private readonly ballController: BallController | null = null;

    @property(ScoreManager)
    private readonly scoreManager: ScoreManager | null = null;

    @property(GameManager)
    private readonly gameManager: GameManager | null = null;

    @property(AudioClip)
    private readonly paddleHitClip: AudioClip | null = null;

    @property(AudioClip)
    private readonly scoreClip: AudioClip | null = null;

    @property(AudioClip)
    private readonly matchEndClip: AudioClip | null = null;

    private audioSource: AudioSource | null = null;

    protected onLoad(): void {
        if (!this.ballController) {
            throw new Error('AudioManager: ballController is required');
        }

        if (!this.scoreManager) {
            throw new Error('AudioManager: scoreManager is required');
        }

        if (!this.gameManager) {
            throw new Error('AudioManager: gameManager is required');
        }

        this.audioSource = this.getComponent(AudioSource) ?? this.addComponent(AudioSource);
    }

    protected onEnable(): void {
        this.ballController!.node.on(GAME_EVENTS.PADDLE_HIT, this.onPaddleHit, this);
        this.scoreManager!.node.on(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.on(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
    }

    protected onDisable(): void {
        this.ballController!.node.off(GAME_EVENTS.PADDLE_HIT, this.onPaddleHit, this);
        this.scoreManager!.node.off(GAME_EVENTS.SCORE_CHANGED, this.onScoreChanged, this);
        this.gameManager!.node.off(GAME_EVENTS.MATCH_ENDED, this.onMatchEnded, this);
    }

    private onPaddleHit(): void {
        this.playClip(this.paddleHitClip);
    }

    private onScoreChanged(_payload: ScoreChangedPayload): void {
        this.playClip(this.scoreClip);
    }

    private onMatchEnded(_payload: MatchEndedPayload): void {
        this.playClip(this.matchEndClip);
    }

    private playClip(clip: AudioClip | null): void {
        if (!SettingsService.isSoundEnabled() || !clip || !this.audioSource) {
            return;
        }

        this.audioSource.playOneShot(clip);
    }
}
