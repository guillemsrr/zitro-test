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
        this.timeLabel.string = "Fetching current time...";
        this.schedule(this.fetchTime, 1);
    }

    async fetchTime() {
        const time = await this.timeAPI.getCurrentTime();

        this.timeLabel.string = `${this.getTimeString(time.hour)}:${this.getTimeString(time.minute)}:${this.getTimeString(time.seconds)}`;
    }

    private getTimeString(num: number): string {
        if (num < 10) {
            return '0' + num.toString();
        }
        return num.toString();
    }
}