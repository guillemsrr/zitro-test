import {TimeAPIBase, TimeData} from "db://assets/menu/clock/api/TimeAPIBase";

export class TimeAPI extends TimeAPIBase {

    protected getAPI(): string {
        return 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Madrid';
    }

    async parseCurrentTime(): Promise<TimeData> {
        const data = await this.getData();
        if (!data) {
            return null;
        }
        
        /*
        {"year":2025,"month":8,"day":1,"hour":9,"minute":11,"seconds":16,"milliSeconds":7,"dateTime":"2025-08-01T09:11:16.0072313",
        "date":"08/01/2025","time":"09:11","timeZone":"Europe/Madrid","dayOfWeek":"Friday","dstActive":true}
        * */

        return {
            hour: data.hour,
            minute: data.minute,
            seconds: data.seconds
        };
    }
}