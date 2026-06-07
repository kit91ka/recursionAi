/** Размер страницы для пагинации списка категорий (см. plan.txt, раздел 1.5). */
export const PAGE_SIZE = 10;

/** Задержка debounce для поля поиска (мс). */
export const SEARCH_DEBOUNCE_MS = 300;

/** Задержка debounce перед асинхронной валидацией имени (мс). */
export const NAME_VALIDATION_DEBOUNCE_MS = 350;

/** Ключи localStorage для хранения токенов. */
export const STORAGE_KEYS = {
  token: 'zidium.token',
  refreshToken: 'zidium.refreshToken',
} as const;
