import {_decorator, Component, tween, UIOpacity, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('QuizVisualsHandler')
export class QuizVisualsHandler extends Component {
    @property({type: Node, visible: true})
    private _questionNode: Node;

    @property({type: UIOpacity, visible: true})
    private _questionOpacity: UIOpacity;

    @property({visible: true})
    private _fadeDuration: number = 2;

    start() {
        this._questionOpacity.opacity = 0;
    }

    startQuestionAnimation(onFinished?: () => void) {
        tween(this._questionOpacity)
            .to(this._fadeDuration, {opacity: 255})
            .call(() => {
                if (onFinished) onFinished();
            })
            .start();
    }

    endQuestionAnimation(onFinished?: () => void) {
        tween(this._questionOpacity)
            .to(this._fadeDuration, {opacity: 0})
            .call(() => {
                if (onFinished) onFinished();
            })
            .start();
    }

    winEffect() {
        const originalScale = this._questionNode.scale.clone();
        const enlargedScale = originalScale.multiplyScalar(1.1);

        tween(this._questionNode)
            .to(0.15, {scale: enlargedScale})
            .to(0.15, {scale: originalScale})
            .start();
    }

    looseEffect() {
        const originalPos = this._questionNode.position.clone();

        tween(this._questionNode)
            .to(0.05, {position: originalPos.add3f(5, 0, 0)})
            .to(0.05, {position: originalPos.add3f(-5, 0, 0)})
            .to(0.05, {position: originalPos})
            .start();
    }
}