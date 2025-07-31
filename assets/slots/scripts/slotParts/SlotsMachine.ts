import {_decorator, Button, Component, Node, EventTarget} from 'cc';
import {ReelHandler} from "db://assets/slots/scripts/slotParts/ReelHandler";
import {SlotSymbol} from "db://assets/slots/scripts/slotParts/SlotSymbol";

const {ccclass, property} = _decorator;

@ccclass('SlotsMachine')
export class SlotsMachine extends Component {

    @property({type: Node, visible: true})
    private _reelsParent: Node;

    @property({type: Button, visible: true})
    private _spinButton: Button;

    @property({type: Button, visible: true})
    private _forceWinButton: Button;

    @property({visible: true})
    private _spinDelay: number = 2;

    @property({visible: true})
    private _spinTime: number = 3;

    private _reels: ReelHandler[] = [];

    public readonly eventTarget = new EventTarget();
    public readonly onSpinStart: string = 'onSpin';
    public readonly onWinEventName: string = 'onWin';
    public readonly onLooseEventName: string = 'onLoose';

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

        this.eventTarget.emit(this.onSpinStart);
    }

    private getStopDelay() {
        const lastStartTime = (this._reels.length - 1) * this._spinDelay;
        return lastStartTime + this._spinTime;
    }

    private startWinSpin() {
        this.startSpinning();

        const stopDelay = this.getStopDelay();
        const winningSymbolIndex = this._reels[0].getRandomSymbolIndex();
        const positionIndex = 4;
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
            this.eventTarget.emit(this.onWinEventName);
            centerSymbols.forEach(symbol => {
                symbol.setWinVisuals();
            })
            return;
        }

        this.eventTarget.emit(this.onLooseEventName);
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