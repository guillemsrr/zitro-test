import {_decorator, Component} from 'cc';
import {ProgressBarHandler} from "db://assets/splash/scripts/ProgressBarHandler";
import {SceneManager} from "db://assets/scripts/SceneManager";

const {ccclass, property} = _decorator;

@ccclass('SplashScreenHandler')
export class SplashScreenHandler extends Component {

    @property({type: ProgressBarHandler, visible: true})
    _progressBar: ProgressBarHandler | null = null;

    start() {
        this._progressBar.onLoadComplete = () => {
            SceneManager.instance.loadMenu();
        }
    }
}