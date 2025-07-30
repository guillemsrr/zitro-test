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

    @property({visible: true})
    _spinTime: number = 3;

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
            this._reels[i].reset();
            this.scheduleOnce(() => {
                this._reels[i].spin();
            }, i * this._spinDelay);
        }

        const stopDelay = this.getStopDelay();
        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].stop();

                if (i === this._reels.length - 1) {
                    this.scheduleOnce(() => {
                        this.checkPrizes();
                    }, 1);
                }
            }, stopDelay + i * this._spinDelay);
        }
    }

    private getStopDelay() {
        const lastStartTime = (this._reels.length - 1) * this._spinDelay;
        return lastStartTime + this._spinTime;
    }

    private startWinSpin() {
        this.startSpinning();

        const stopDelay = this.getStopDelay();
        const winningSymbolIndex = this._reels[0].getRandomSymbolIndex();
        const positionIndex = 3;
        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].forceSymbolAtPositionIndex(winningSymbolIndex, positionIndex);
            }, stopDelay + i * this._spinDelay);
        }
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
            centerSymbols.forEach(symbol => {
                symbol.setWinVisuals();
            })
            return;
        }

        centerSymbols.forEach(symbol => {
            symbol.setLooseVisuals();
        })

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