import {_decorator, Component, view, Node, Widget} from 'cc';

const {ccclass, property} = _decorator;

//specific Cocos 3.8: https://docs.cocos.com/creator/3.8/manual/en/engine/event/event-screen.html#event-usage-example

@ccclass("SlotResponsivenessHandler")
export class SlotResponsivenessHandler extends Component {

    @property({type: Node, visible: true})
    private _slotMachineNode: Node;

    @property({type: Node, visible: true})
    private _buttonsNode: Node;

    @property({type: Widget, visible: true})
    private _buttonsWidget: Widget;

    @property({visible: true})
    private _slotsMachineScaleFactor: number = 1.5;

    @property({visible: true})
    private _buttonsScaleFactor: number = 1.5;

    @property({visible: true})
    private _buttonsVirticalBottomDistance: number = 200

    @property({visible: true})
    private _buttonsDefaultBottomDistance: number = 50;

    start() {
        this.onOrientationChange();
        window.addEventListener('orientationchange', this.onOrientationChange.bind(this));
    }

    onDisable() {
        window.removeEventListener('orientationchange', this.onOrientationChange.bind(this));
    }

    private onOrientationChange() {
        const size = view.getVisibleSize();
        const isLandscape = size.width > size.height;

        const slotsMachineScale = isLandscape ? 1 : this._slotsMachineScaleFactor;
        if (this._slotMachineNode) {
            this._slotMachineNode.setScale(slotsMachineScale, slotsMachineScale, 1);
        }

        if (this._buttonsNode) {
            const buttonsScale = isLandscape ? 1 : this._buttonsScaleFactor;
            this._buttonsNode.setScale(buttonsScale, buttonsScale, 1);

            this._buttonsWidget.bottom = isLandscape ? this._buttonsDefaultBottomDistance : this._buttonsVirticalBottomDistance;
            this._buttonsWidget.updateAlignment();
        }
    }
}