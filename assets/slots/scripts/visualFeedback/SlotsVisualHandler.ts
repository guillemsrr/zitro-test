import {_decorator, Component, Prefab, instantiate, Node, Vec3, tween, Tween, AudioSource, AudioClip} from 'cc';
import {SlotsMachine} from "db://assets/slots/scripts/slotParts/SlotsMachine";

const {ccclass, property} = _decorator;

@ccclass('SlotsVisualHandler')
export class SlotsVisualHandler extends Component {

    @property({type: SlotsMachine, visible: true})
    private _slotMachine: SlotsMachine;

    @property({type: Prefab, visible: true})
    private _winParticlePrefab: Prefab;

    @property({type: Node, visible: true})
    private _particlesParent: Node;

    @property({type: Node, visible: true})
    private _winTextNode: Node;

    @property({visible: true})
    private _resetDelay: number = 4;

    @property({visible: true})
    private _numberParticlesByShot: number = 5;

    @property({visible: true})
    private _numberShots: number = 3;

    @property({visible: true})
    private _particleShotDelay: number = 1;

    @property({visible: true})
    private _winTextPulseDuration: number = 1;

    @property({visible: true})
    private _winTextScale: number = 1.5;

    @property({type: AudioSource, visible: true})
    private _audioSource: AudioSource;

    @property({type: AudioClip, visible: true})
    private _spinAudioClip: AudioClip;

    @property({type: AudioClip, visible: true})
    private _winAudioClip: AudioClip;

    @property({type: AudioClip, visible: true})
    private _loosAudioClip: AudioClip;

    private _textAnimation: Tween<Node> | null = null;

    start() {
        this._slotMachine.eventTarget.on(this._slotMachine.ON_SPIN_START_EVENT_NAME, this.startSpinSound, this);
        this._slotMachine.eventTarget.on(this._slotMachine.ON_WIN_EVENT_NAME, this.startWinEffect, this);
        this._slotMachine.eventTarget.on(this._slotMachine.ON_LOOSE_EVENT_NAME, this.looseEffect, this);
    }

    private startWinEffect() {
        this.playWinTextAnimation();

        this._audioSource.stop();
        this._audioSource.loop = false;
        this._audioSource.clip = this._winAudioClip;
        this._audioSource.play();

        for (let i = 0; i < this._numberShots; i++) {
            this.scheduleOnce(() => {
                this.createWinParticles();
            }, i * this._particleShotDelay);
        }

        this.scheduleOnce(() => {
            this.reset();
        }, this._resetDelay);
    }

    private reset() {
        this._particlesParent.destroyAllChildren();

        if (this._textAnimation) {
            this._textAnimation.stop();
            this._textAnimation = null;
        }

        this._winTextNode.active = false;
        this._winTextNode.scale = new Vec3(1, 1, 1);
        this._slotMachine.activateButtons();
    }

    private createWinParticles() {
        for (let i = 0; i < this._numberParticlesByShot; i++) {
            const particle = instantiate(this._winParticlePrefab);
            particle.setParent(this._particlesParent);
        }
    }

    private playWinTextAnimation() {
        this._winTextNode.active = true;

        const originalScale = new Vec3(1, 1, 1);
        const enlargedScale = new Vec3(this._winTextScale, this._winTextScale, this._winTextScale);

        this._textAnimation = tween(this._winTextNode)
            .repeatForever(
                tween()
                    .to(this._winTextPulseDuration, {scale: enlargedScale})
                    .to(this._winTextPulseDuration, {scale: originalScale})
            )
            .start();
    }

    looseEffect() {
        this._audioSource.stop();
        this._audioSource.loop = false;
        this._audioSource.clip = this._loosAudioClip;
        this._audioSource.play();
    }

    startSpinSound() {
        this._audioSource.stop();
        this._audioSource.loop = true;
        this._audioSource.clip = this._spinAudioClip;
        this._audioSource.play();
    }
}