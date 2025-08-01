import {_decorator, Component, director} from 'cc';
import {ProgressBarHandler} from "db://assets/splash/scripts/ProgressBarHandler";

const {ccclass, property} = _decorator;

@ccclass('SplashScreenHandler')
export class SplashScreenHandler extends Component {

    @property({type: ProgressBarHandler, visible: true})
    private _progressBar: ProgressBarHandler | null = null;

    @property({visible: true})
    private _menuScene: string = 'menu';

    start() {
        this._progressBar.eventTarget.on(this._progressBar.ON_LOAD_COMPLETE_EVENT, this.loadMenu, this);
    }

    loadMenu() {
        director.loadScene(this._menuScene);
    }
}