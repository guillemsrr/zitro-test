import {TimeAPIBase, TimeData} from "db://assets/menu/clock/api/TimeAPIBase";

export class TimeAPI extends TimeAPIBase {

    protected getAPI(): string {
        return 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Madrid';
    }

    async getCurrentTime(): Promise<TimeData> {
        const data = await this.getData();
        if (!data) {
            return null;
        }
        const time: TimeData = {
            hour: data.hour,
            minute: data.minute,
            seconds: data.seconds
        }
        return time;
    }
}