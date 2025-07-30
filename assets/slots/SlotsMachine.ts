import {_decorator, Button, Component, Node} from 'cc';
import {ReelHandler} from "db://assets/slots/ReelHandler";

const {ccclass, property} = _decorator;

@ccclass('SlotsMachine')
export class SlotsMachine extends Component {

    @property({type: Node, visible: true})
    _reelsParent: Node;

    @property({type: Button, visible: true})
    _spinButton: Button;

    @property({visible: true})
    _spinDelay: number = 2;

    private _reels: ReelHandler[] = [];

    start() {
        this._reels = this._reelsParent.getComponentsInChildren(ReelHandler);
        this._spinButton.node.on(Button.EventType.CLICK, this.startSpinning, this);
    }

    startSpinning() {
        this._spinButton.interactable = false;
        this.spinReelsSequentially(0);
    }

    private spinReelsSequentially(index: number) {
        if (index >= this._reels.length) {
            this._spinButton.interactable = true;
            return;
        }

        this._reels[index].spin();

        this.scheduleOnce(() => {
            this.spinReelsSequentially(index + 1);
        }, this._spinDelay);
    }
}