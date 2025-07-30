import {_decorator, Component} from 'cc';
import {SlotsMachine} from "db://assets/slots/SlotsMachine";

const {ccclass, property} = _decorator;

@ccclass('SlotsGameManager')
export class SlotsGameManager extends Component {

    @property(SlotsMachine)
    private slotMachine: SlotsMachine;

    @property
    private resetDelay: number = 2;

    start() {
        this.slotMachine.onWin = () => {
            //TODO: show win animation
            console.log("WIN!");
            
            this.scheduleOnce(() => {
                this.slotMachine.activateButtons();
            }, this.resetDelay);
        }
    }
}