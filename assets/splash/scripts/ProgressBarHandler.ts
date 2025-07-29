import {_decorator, Component, ProgressBar} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('ProgressBarHandler')
export class ProgressBarHandler extends Component {

    @property(ProgressBar)
    progressBar: ProgressBar | null = null;

    @property({visible: true, min: 0.0})
    _minLoadTime: number = 5.0;

    private _elapsedTime: number = 0;

    public onLoadComplete: () => void = () => {
    };

    start() {
        this._elapsedTime = 0;

        if (this.progressBar) {
            this.progressBar.progress = 0;
        }
    }

    update(deltaTime: number) {
        this._elapsedTime += deltaTime;

        let progress = this._elapsedTime / this._minLoadTime;

        this.progressBar.progress = progress;

        if (progress >= 1.0) {
            this.onLoadComplete();
            this.node.active = false;
        }
    }
}