export interface StartEndTimePairs {
    start_time: Date | string,
    end_time: Date | string,
    venue_id: string,
    timezone: string,
    optional_title?: string
}
