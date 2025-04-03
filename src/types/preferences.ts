export interface UserPreferences {
    // Configurações de exibição
    defaultCountry: string;
    defaultPeriod: string;
    defaultCategory: string;
    defaultSort: string;

    // Configurações de tema
    theme: 'light' | 'dark' | 'system';

    // Configurações de notificação
    enableNotifications: boolean;
    notificationTypes: {
        trendingAlerts: boolean;
        weeklyReports: boolean;
        systemUpdates: boolean;
    };

    // Configurações de exportação
    exportFormat: 'csv' | 'json' | 'excel';

    // Configurações de visualização
    chartType: 'bar' | 'line' | 'pie';
    showRelatedQueries: boolean;
    compactView: boolean;

    // Configurações regionais
    language: string;
    dateFormat: string;
}

export interface PreferencesResponse {
    success: boolean;
    data?: UserPreferences;
    error?: string;
}

// Preferências padrão para novos usuários
export const defaultPreferences: UserPreferences = {
    defaultCountry: 'Brasil',
    defaultPeriod: 'Últimas 24 horas',
    defaultCategory: 'Todas as categorias',
    defaultSort: 'Por relevância',

    theme: 'system',

    enableNotifications: true,
    notificationTypes: {
        trendingAlerts: true,
        weeklyReports: true,
        systemUpdates: true,
    },

    exportFormat: 'csv',

    chartType: 'bar',
    showRelatedQueries: true,
    compactView: false,

    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY'
}; 