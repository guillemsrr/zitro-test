import {TimeAPI} from "db://assets/menu/clock/api/TimeAPI";
import {TimeData} from "db://assets/menu/clock/api/TimeAPIBase";

export class WorldTimeAPI extends TimeAPI {
    protected getAPI(): string {
        return 'http://worldtimeapi.org/api/timezone/Europe/Madrid';
    }

    async getCurrentTime(): Promise<TimeData> {
        const data = await this.getData();
        //TODO
        const time: TimeData = {
            hour: data.hour,
            minute: data.minute,
            seconds: data.seconds
        }
        return time;
    }
}