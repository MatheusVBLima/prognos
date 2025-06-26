// Cache simples em memória para dados estáticos
type CacheData = {
    data: any;
    timestamp: number;
}

const cache = new Map<string, CacheData>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em milissegundos

export function setCache(key: string, data: any) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

export function getCache(key: string): any | null {
    const cached = cache.get(key);

    if (!cached) return null;

    // Verificar se o cache expirou
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
        cache.delete(key);
        return null;
    }

    return cached.data;
}

export function clearCache() {
    cache.clear();
}