/** Размер страницы для пагинации списка категорий (см. plan.txt, раздел 1.5). */
export const PAGE_SIZE = 10;

/**
 * Упреждающий запас (px) для бесконечной прокрутки: за сколько до низа вьюпорта
 * начинать догрузку следующей страницы. Используется и как `rootMargin`
 * IntersectionObserver, и в ручной автодогрузке (`window.innerHeight + запас`).
 * 200px ≈ несколько строк таблицы — догрузка стартует заранее, чтобы пользователь
 * не упирался в конец списка и не видел «прыжок» при подгрузке, но не настолько
 * рано, чтобы тянуть лишние страницы далеко до видимой области.
 */
export const INFINITE_SCROLL_PREFETCH_PX = 200;

/** Задержка debounce для поля поиска (мс). */
export const SEARCH_DEBOUNCE_MS = 300;

/** Задержка debounce перед асинхронной валидацией имени (мс). */
export const NAME_VALIDATION_DEBOUNCE_MS = 350;

/** Ключи localStorage для хранения токенов. */
export const STORAGE_KEYS = {
  token: 'zidium.token',
  refreshToken: 'zidium.refreshToken',
} as const;
