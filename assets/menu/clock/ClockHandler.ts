import {_decorator, Component, Label, Node} from 'cc';
import {TimeAPIBase} from "db://assets/menu/clock/api/TimeAPIBase";
import {TimeAPI} from "db://assets/menu/clock/api/TimeAPI";

const {ccclass, property} = _decorator;

@ccclass('ClockHandler')
export class ClockHandler extends Component {
    @property(Label)
    timeLabel: Label | null = null;

    private timeAPI: TimeAPIBase = new TimeAPI();

    start() {
        this.schedule(this.fetchTime, 1);
    }

    async fetchTime() {
        const time = await this.timeAPI.getCurrentTime();
        this.timeLabel.string = `${time.hour}:${time.minute}:${time.seconds}`;
    }
}