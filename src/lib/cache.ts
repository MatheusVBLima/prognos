import fs from 'fs';
import path from 'path';
import { ScrapingResult } from '@/types/trends';

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'trends.json');
const CACHE_DURATION = 10 * 1000; // 10 segundos em milissegundos

type CacheData = {
    data: any
    timestamp: number
}

const cache = new Map<string, CacheData>()

// Garante que o diretório de cache existe
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

export const cacheService = {
    async get(): Promise<ScrapingResult | null> {
        try {
            if (!fs.existsSync(CACHE_FILE)) {
                return null;
            }

            const cacheContent = fs.readFileSync(CACHE_FILE, 'utf-8');
            const cacheData: CacheData = JSON.parse(cacheContent);

            // Verifica se o cache expirou
            if (Date.now() - cacheData.timestamp > CACHE_DURATION) {
                return null;
            }

            // Remove o campo timestamp antes de retornar
            const { timestamp, ...result } = cacheData;
            return result;
        } catch (error) {
            console.error('Erro ao ler cache:', error);
            return null;
        }
    },

    async set(data: ScrapingResult): Promise<void> {
        try {
            const cacheData = {
                ...data,
                timestamp: data.timestamp || new Date().toISOString()
            };

            fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    },

    async clear(): Promise<void> {
        try {
            if (fs.existsSync(CACHE_FILE)) {
                fs.unlinkSync(CACHE_FILE);
            }
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
        }
    },
};

export function setCache(key: string, data: any) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    })
}

export function getCache(key: string): any | null {
    const cached = cache.get(key)

    if (!cached) return null

    // Verificar se o cache expirou
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
        cache.delete(key)
        return null
    }

    return cached.data
}

export async function saveToCache(data: any): Promise<void> {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString();
        const cacheData: ScrapingResult = {
            success: true,
            data,
            timestamp: timestamp
        };

        fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    } catch (error) {
        console.error('Erro ao salvar no cache:', error);
    }
}

export function getCachedData(): ScrapingResult | null {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            return null;
        }

        const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
        const cacheData = JSON.parse(fileData) as ScrapingResult;

        const cacheAge = Date.now() - new Date(cacheData.timestamp).getTime();

        if (cacheAge > CACHE_DURATION) {
            return null;
        }

        return cacheData;
    } catch (error) {
        console.error('Erro ao ler do cache:', error);
        return null;
    }
} 