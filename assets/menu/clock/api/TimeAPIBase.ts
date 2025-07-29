export type TimeData = {
    hour: number;
    minute: number;
    seconds: number;
};

export abstract class TimeAPIBase {

    abstract getCurrentTime(): Promise<TimeData>;

    protected abstract getAPI(): string;

    protected async getData(): Promise<any> {
        const response = await fetch(this.getAPI());
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
}