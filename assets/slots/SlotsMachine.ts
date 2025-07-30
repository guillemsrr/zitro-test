import {_decorator, Button, Component, Node} from 'cc';
import {ReelHandler} from "db://assets/slots/ReelHandler";
import {SlotSymbol} from "db://assets/slots/SlotSymbol";

const {ccclass, property} = _decorator;

@ccclass('SlotsMachine')
export class SlotsMachine extends Component {

    @property({type: Node, visible: true})
    _reelsParent: Node;

    @property({type: Button, visible: true})
    _spinButton: Button;

    @property({type: Button, visible: true})
    _forceWinButton: Button;

    @property({visible: true})
    _spinDelay: number = 2;

    private _reels: ReelHandler[] = [];

    public onWin: () => void = () => {
    };

    start() {
        this._reels = this._reelsParent.getComponentsInChildren(ReelHandler);
        this._spinButton.node.on(Button.EventType.CLICK, this.startSpinning, this);
        this._forceWinButton.node.on(Button.EventType.CLICK, this.startWinSpin, this);
    }

    private startSpinning() {
        this.deactivateButtons();

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

                if (i === this._reels.length - 1) {
                    this.checkPrizes();
                }
            }, stopStartDelay + i * this._spinDelay);
        }
    }
    
    private startWinSpin(){
        //TODO: implement a forced win spin
    }

    private checkPrizes() {
        let centerSymbols: SlotSymbol[] = [];
        for (let i = 0; i < this._reels.length; i++) {
            const reel: ReelHandler = this._reels[i];
            const centerSymbol: SlotSymbol = reel.getCenterSymbol();
            centerSymbols.push(centerSymbol);
        }

        if (centerSymbols[0].equals(centerSymbols[1]) && centerSymbols[1].equals(centerSymbols[2])) {
            this.onWin();
            return;
        }
        
        this.activateButtons();
    }

    public activateButtons() {
        this._spinButton.interactable = true;
        this._forceWinButton.interactable = true;
    }

    private deactivateButtons() {
        this._spinButton.interactable = false;
        this._forceWinButton.interactable = false;
    }
}