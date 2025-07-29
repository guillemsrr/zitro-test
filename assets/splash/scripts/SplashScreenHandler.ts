import {_decorator, Component, director} from 'cc';
import {ProgressBarHandler} from "db://assets/splash/scripts/ProgressBarHandler";

const {ccclass, property} = _decorator;

@ccclass('SplashScreenHandler')
export class SplashScreenHandler extends Component {

    @property({type: ProgressBarHandler, visible: true})
    _progressBar: ProgressBarHandler | null = null;

    @property
    public menuScene: string = 'menu';

    start() {
        this._progressBar.onLoadComplete = () => {
            director.loadScene(this.menuScene);
        }
    }
}