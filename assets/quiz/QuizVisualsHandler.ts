import {_decorator, Component, tween, UIOpacity, Node, Animation} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('QuizVisualsHandler')
export class QuizVisualsHandler extends Component {
    @property({type: Node, visible: true})
    private _questionNode: Node;

    @property({type: UIOpacity, visible: true})
    private _questionOpacity: UIOpacity;

    @property({type: UIOpacity, visible: true})
    private _buttonsOpacity: UIOpacity;
    
    @property({type: Animation, visible: true})
    private _questionAnimation: Animation;

    @property({visible: true})
    private _questionFadeDuration: number = 1;

    @property({visible: true})
    private _buttonFadeDuration: number = 0.5;

    @property({visible: true})
    private _feedbackDuration: number = 2;

    @property({visible: true})
    private _winQuestionScale: number = 1.1;
    
    @property({visible: true})
    private _looseQuestionScale: number = 0.8;

    @property({type: Node, visible: true})
    private _gameOverNode: Node;

    onLoad() {
        this._questionOpacity.opacity = 0;
        this._buttonsOpacity.opacity = 0;
        this._gameOverNode.active = false;
    }

    startQuestionAnimation(onFinished?: () => void) {

        this._questionAnimation.play();
        
        tween(this._questionOpacity)
            .to(this._questionFadeDuration, {opacity: 255})
            .call(() => {
                tween(this._buttonsOpacity)
                    .to(this._buttonFadeDuration, {opacity: 255})
                    .call(() => {
                        if (onFinished) onFinished();
                    })
                    .start();
            })
            .start();
    }

    endQuestionAnimation(onFinished?: () => void) {
        this.scheduleOnce(() => {
            tween(this._questionOpacity)
                .to(this._questionFadeDuration, {opacity: 0})
                .call(() => {
                    if (onFinished) onFinished();
                })
                .start();

            tween(this._buttonsOpacity)
                .to(this._questionFadeDuration, {opacity: 0})
                .start();
        }, this._feedbackDuration);
    }

    winEffect(onFinished?: () => void) {
        const originalScale = this._questionNode.scale.clone();
        const enlargedScale = originalScale.clone().multiplyScalar(this._winQuestionScale);

        tween(this._questionNode)
            .to(this._feedbackDuration / 2, {scale: enlargedScale})
            .to(this._feedbackDuration / 2, {scale: originalScale})
            .start();

        this.endQuestionAnimation(onFinished);
    }

    looseEffect(onFinished?: () => void) {
        const originalScale = this._questionNode.scale.clone();
        const smallerScale = originalScale.clone().multiplyScalar(this._looseQuestionScale);

        tween(this._questionNode)
            .to(this._feedbackDuration / 2, {scale: smallerScale})
            .to(this._feedbackDuration / 2, {scale: originalScale})
            .start();

        this.endQuestionAnimation(onFinished);
    }

    showGameOver() {
        this._gameOverNode.active = true;
    }
}