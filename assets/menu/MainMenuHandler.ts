import {_decorator, Button, Component} from 'cc';
import {SceneManager} from "db://assets/scripts/scene/SceneManager";

const {ccclass, property} = _decorator;

/*deprecated, using SceneLoaderButton*/
@ccclass('MainMenuHandler')
export class MainMenuHandler extends Component {
    @property(Button)
    quizButton: Button | null = null;
    @property(Button)
    slotsButton: Button | null = null;

    @property({visible: true})
    private _quizSceneName: string = "quiz";

    @property({visible: true})
    private _slotsSceneName: string = "slots";

    start() {
        this.quizButton.node.on(Button.EventType.CLICK, this.OpenQuiz, this);
        this.slotsButton.node.on(Button.EventType.CLICK, this.OpenSlots, this);
    }

    OpenQuiz() {
        SceneManager.instance.loadScene(this._quizSceneName);
    }

    OpenSlots() {
        SceneManager.instance.loadScene(this._slotsSceneName);
    }
}