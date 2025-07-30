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

        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].spin();
            }, i * this._spinDelay);
        }

        /*El giro se realizará de izquierda a derecha y con un intervalo entre ellos de 2 segundos.
         Estarán un mínimo de 3 segundos todos los rodillos girando.
         La parada se realizará también de izquierda a derecha manteniendo el tiempo de 2 segundos entre ellos.*/

        const lastStartTime = (this._reels.length - 1) * this._spinDelay;
        const minSpinTime = 3;

        const stopStartDelay = lastStartTime + minSpinTime;
        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].stop();

                // Re-enable button when last reel stops
                if (i === this._reels.length - 1) {
                    this._spinButton.interactable = true;
                }
            }, stopStartDelay + i * this._spinDelay);
        }
    }
}