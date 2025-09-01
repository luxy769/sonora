import { API_BASE_URL } from '../config';

export const getCoverUrl = (coverPath: string | null): string => {
    if (!coverPath) {
        return '/media/covers/placeholder.jpg';
    }
    
    // Убираем начальный слеш если есть
    const cleanPath = coverPath.startsWith('/') ? coverPath.slice(1) : coverPath;
    
    // Используем тот же хост что и для API
    const baseUrl = API_BASE_URL.replace('/8001', ''); // Убираем порт backend
    return `${baseUrl}:8001/${cleanPath}`;
}; 