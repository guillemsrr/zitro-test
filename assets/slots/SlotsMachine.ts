import {_decorator, Button, Component, Node} from 'cc';
import {ReelHandler} from "db://assets/slots/ReelHandler";

const {ccclass, property} = _decorator;

@ccclass('SlotsMachine')
export class SlotsMachine extends Component {

    @property({type: Node, visible: true})
    _reelsParent: Node;

    @property({type: Button, visible: true})
    _spinButton: Button;

    private _reels: ReelHandler[] = [];

    start() {
        this._reels = this._reelsParent.getComponentsInChildren(ReelHandler);
        this._spinButton.node.on(Button.EventType.CLICK, this.startSpinning, this);
    }

    startSpinning() {
        //this._spinButton.interactable = false;
        for (let reel of this._reels) {
            reel.spin();
        }
    }
}