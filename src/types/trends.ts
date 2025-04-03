export interface TrendItem {
    title: string;
    traffic?: number;
    relatedQueries?: string[];
}

export interface ScrapingResult {
    success: boolean;
    data?: TrendItem[];
    error?: string;
    timestamp: string;
}

export interface TrendResponse {
    data: TrendItem[];
    timestamp: string;
} 