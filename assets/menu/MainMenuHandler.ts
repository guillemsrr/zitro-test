import {_decorator, Button, Component, director} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('MainMenuHandler')
export class MainMenuHandler extends Component {
    @property(Button)
    quizButton: Button | null = null;
    @property(Button)
    slotsButton: Button | null = null;

    @property({visible: true})
    _quizSceneName: string = "quiz";

    @property({visible: true})
    _slotsSceneName: string = "slots";

    //Could also approach this way:
    //https://docs.cocos.com/creator/3.8/manual/en/getting-started/first-game-2d/#handle-button-click-event

    start() {
        this.quizButton.node.on(Button.EventType.CLICK, this.OpenQuiz, this);
        this.slotsButton.node.on(Button.EventType.CLICK, this.OpenSlots, this);
    }

    OpenQuiz() {
        console.log("OpenQuiz called");
        director.loadScene(this._quizSceneName);
    }

    OpenSlots() {
        director.loadScene(this._slotsSceneName);
    }
}