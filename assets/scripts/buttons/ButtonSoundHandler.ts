import {_decorator, Component, AudioSource, Button, AudioClip} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('ButtonSoundHandler')
export class ButtonSoundHandler extends Component {

    @property({type: AudioSource, visible: true})
    private _audioSource: AudioSource;

    @property({type: AudioClip, visible: true})
    private _clickAudioClip: AudioClip;

    private _button: Button;

    start() {
        this._button = this.getComponent(Button);
        this._button.node.on(Button.EventType.CLICK, this.playButtonClickSound, this);
    }

    private playButtonClickSound() {
        this._audioSource.clip = this._clickAudioClip;
        this._audioSource.play();
    }
}