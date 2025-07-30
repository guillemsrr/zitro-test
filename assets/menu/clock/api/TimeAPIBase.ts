export type TimeData = {
    hour: number;
    minute: number;
    seconds: number;
};

export abstract class TimeAPIBase {

    abstract getCurrentTime(): Promise<TimeData>;

    protected abstract getAPI(): string;

    protected async getData(): Promise<any | null> {
        try {
            const response = await fetch(this.getAPI());

            if (!response.ok) {
                console.warn(`Failed to fetch: ${response.status}`);
                return null;
            }

            const data = await response.json();
            if (data?.error) {
                console.warn("API returned error:", data.error);
                return null;
            }

            return data;

        } catch (error) {
            console.error("Error while fetching data:", error);
            return null;
        }
    }
}