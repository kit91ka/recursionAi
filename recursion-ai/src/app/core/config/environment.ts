/**
 * Конфигурация окружения фронта.
 * Figma-токен из корневого environment.ts намеренно НЕ переносится в бандл
 * (использовался только на этапе анализа макета — см. plan.txt, раздел 7.5).
 */
export const environment = {
  production: false,
  // Пусто = относительные запросы к тому же origin. В dev их проксирует
  // proxy.conf.json → бэкенд (без CORS); в prod приложение публикуется за
  // reverse-proxy, отдающим /front на тот же бэкенд.
  apiBaseUrl: '',
} as const;
