import {_decorator, Button, Component, Node, EventTarget, game} from 'cc';
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

    private _pauseBeforeCheckPrizes: number = 1;

    private _reels: ReelHandler[] = [];

    public readonly eventTarget = new EventTarget();
    public readonly onSpinStart: string = 'onSpin';
    public readonly onWinEventName: string = 'onWin';
    public readonly onLooseEventName: string = 'onLoose';

    private _lastTime: number = 0;
    private _currentMargin: number = 0;

    start() {
        this._reels = this._reelsParent.getComponentsInChildren(ReelHandler);
        this._spinButton.node.on(Button.EventType.CLICK, this.startSpinning, this);
        this._forceWinButton.node.on(Button.EventType.CLICK, this.startWinSpin, this);
    }

    private startSpinning() {
        this.deactivateButtons();

        this._lastTime = game.totalTime;
        this._currentMargin = 0;

        this.eventTarget.emit(this.onSpinStart);

        for (let i = 0; i < this._reels.length; i++) {
            this._reels[i].reset();
            this.scheduleOnce(() => {
                this._reels[i].spin();
                this.printTimeMargin();
            }, i * this._spinDelay);
        }

        this.scheduleOnce(() => {
            this.stopSpinning();
        }, (this.getStopDelay()));
    }

    private getStopDelay() {
        return (this._reels.length - 1) * this._spinDelay + this._spinTime;
    }

    private startWinSpin() {
        this.startSpinning();

        const stopDelay = this.getStopDelay();
        const winningSymbolIndex = this._reels[0].getRandomSymbolIndex();

        //this creates the ilusion of a win by adjusting the winning symbol with an offset that will get to the center
        const positionIndex = 2;
        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].forceSymbolAtPositionIndex(winningSymbolIndex, positionIndex);
            }, stopDelay + i * this._spinDelay);
        }

        //force the winning symbol just in case scheduleOnce is not precise enough
        this.scheduleOnce(() => {
            for (let i = 0; i < this._reels.length; i++) {
                this._reels[i].setWinningSymbol(this._reels[i].getCenterSymbol(), winningSymbolIndex);

            }
        }, stopDelay + this.getTimeToCheckPrizes() - 0.1);
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

    private stopSpinning() {
        for (let i = 0; i < this._reels.length; i++) {
            this.scheduleOnce(() => {
                this._reels[i].stop();

                this.printTimeMargin();

            }, i * this._spinDelay);
        }

        this.scheduleOnce(() => {
            this.checkPrizes();
            this.printTimeMargin();
        }, this.getTimeToCheckPrizes());
    }

    private getTimeToCheckPrizes() {
        return this._spinDelay * (this._reels.length - 1) + this._pauseBeforeCheckPrizes;
    }

    private printTimeMargin() {
        // This function is for debugging purposes to track the time margins

        /*const now = game.totalTime;
        let margin = now - this._lastTime;
        margin /= 1000;
        this._lastTime = now;
        this._currentMargin += margin;

        console.log(`Elapsed time: ${margin}`);
        console.log(`Total margin: ${this._currentMargin}`);*/
    }
}