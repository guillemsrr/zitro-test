import {_decorator, Component, Label} from 'cc';
import {TimeAPIBase, TimeData} from "db://assets/menu/clock/api/TimeAPIBase";
import {TimeAPI} from "db://assets/menu/clock/api/TimeAPI";
import {WorldTimeAPI} from "db://assets/menu/clock/api/WorldTimeAPI";

const {ccclass, property} = _decorator;

@ccclass('ClockHandler')
export class ClockHandler extends Component {
    @property(Label)
    timeLabel: Label | null = null;

    private _timeAPI: TimeAPIBase = new WorldTimeAPI(); //or TimeAPI for a currently working API, without fallback

    private _isFetching: boolean = false;
    private readonly _fetchInterval: number = 1;

    start() {
        this.timeLabel.string = "Fetching current time...";
        this.schedule(this.fetchTime, this._fetchInterval);
    }

    onDisable() {
        this.unschedule(this.fetchTime);
    }

    async fetchTime() {
        if (this._isFetching) {
            return;
        }

        this._isFetching = true;
        const time: TimeData = await this._timeAPI.getCurrentTime();
        this._isFetching = false;
        if (!time || !this.timeLabel) {
            return;
        }
        this.timeLabel.string = `${this.getTimeString(time.hour)}:${this.getTimeString(time.minute)}:${this.getTimeString(time.seconds)}`;
    }

    private getTimeString(num: number): string {
        if (num < 10) {
            return '0' + num.toString();
        }
        return num.toString();
    }
}