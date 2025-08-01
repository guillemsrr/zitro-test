import {TimeAPI} from "db://assets/menu/clock/api/TimeAPI";
import {TimeData} from "db://assets/menu/clock/api/TimeAPIBase";

export class WorldTimeAPI extends TimeAPI {
    protected getAPI(): string {
        //https??
        return 'http://worldtimeapi.org/api/timezone/Europe/Madrid';
    }

    async parseCurrentTime(): Promise<TimeData> {
        const data = await this.getData();
        if (!data) {
            return null;
        }

        const datetime = data.datetime as string;
        if (!datetime || datetime === '') {
            console.warn("Unexpected API response format", data);
            return null;
        }

        /*
        {"utc_offset":"+02:00","timezone":"Europe/Madrid","day_of_week":5,"day_of_year":213,"datetime":"2025-08-01T09:12:26.765268+02:00",
        "utc_datetime":"2025-08-01T07:12:26.765268+00:00","unixtime":1754032346,"raw_offset":3600,"week_number":31,"dst":true,
        "abbreviation":"CEST","dst_offset":3600,"dst_from":"2025-03-30T01:00:00+00:00","dst_until":"2025-10-26T01:00:00+00:00","client_ip":"77.75.179.6"}
        * */
        
        const timeParts = datetime.split('T')[1].split(':');

        return {
            hour: parseInt(timeParts[0]),
            minute: parseInt(timeParts[1]),
            seconds: parseInt(timeParts[2].split('.')[0])
        };
    }
}