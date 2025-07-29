import {_decorator, Button, Component, director} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('SceneLoaderButton')
export class SceneLoaderButton extends Component {
    @property(Button)
    button: Button | null = null;

    @property({visible: true})
    sceneName: string = "";

    start() {
        this.button.node.on(Button.EventType.CLICK, this.loadScene, this);
    }

    loadScene() {
        director.loadScene(this.sceneName);
    }
}