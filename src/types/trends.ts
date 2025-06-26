export interface TrendItem {
    term: string;
    value: number;
    timestamp: string;
    rank?: number;
    description?: string;
    hint?: string[];
    percentage_increase?: string;
    time_started?: string;
}

export interface TrendResponse {
    data: TrendItem[];
    message: string;
    filters: {
        country: string;
        period: string;
        category: string;
        sort: string;
    };
    cached?: boolean;
    source?: string;
    extraction_date?: string;
    data_source?: string;
} 