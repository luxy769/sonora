// Конфигурация для разных окружений
const getApiUrl = () => {
    // Если мы в браузере и есть window.location, используем текущий хост
    if (typeof window !== 'undefined' && window.location) {
        const host = window.location.hostname;
        const port = '8001'; // Порт backend
        
        // Если localhost, используем localhost
        if (host === 'localhost' || host === '127.0.0.1') {
            return `http://localhost:${port}`;
        }
        
        // Иначе используем текущий хост с портом backend
        return `http://${host}:${port}`;
    }
    
    // Fallback для Docker
    return 'http://backend:8000';
};

export const API_BASE_URL = getApiUrl(); 