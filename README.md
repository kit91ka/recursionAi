# Справочник категорий — Zidium Front

SPA на Angular: авторизация по JWT + справочник категорий (CRUD) с поиском,
сортировкой и бесконечной прокруткой. Тестовое задание.

> Это корневой документ репозитория. Здесь — что это, как запустить и где что лежит.
> Подробное **описание процесса разработки со скриншотами** — в [DEVELOPMENT.md](./DEVELOPMENT.md).

---

## Оглавление

- [Стек](#стек)
- [Быстрый старт](#быстрый-старт)
- [Структура репозитория](#структура-репозитория)
- [Документы проекта](#документы-проекта)
- [Скриншоты](#скриншоты)
- [Скрипты](#скрипты)

---

## Стек

- **Angular** (latest stable, standalone-компоненты, signals, `inject()`)
- **PrimeNG + PrimeIcons** — макет нарисован под PrimeNG; тема настроена под токены Figma
- **OpenAPI-клиент** из Swagger бэкенда — `@openapitools/openapi-generator-cli` (`typescript-angular`)
- Состояние — сервисы на signals (без NgRx)
- Тесты — Karma/Jasmine (unit) + Playwright (e2e)

Backend: `https://zidium3-backend.zidium.net/` · тестовый пользователь `test / 77777`.

---

## Быстрый старт

```bash
# 1. Установка зависимостей
npm install

# 2. Генерация API-клиента из Swagger (создаёт src/app/core/api)
npm run gen:api

# 3. Запуск dev-сервера
npm start          # ng serve, http://localhost:4200

# Прочее
npm run build      # прод-сборка
npm test           # unit-тесты
npm run e2e        # e2e (Playwright)
```

---

## Структура репозитория

```
recursionAi/
├── README.md             # этот файл
├── DEVELOPMENT.md        # описание процесса разработки (текст + скриншоты)
├── AGENT_CONTEXT.md      # рабочий контекст ассистента между сессиями
├── conversation.md       # лог переписки
├── plan.txt              # детальный план реализации
├── checklist.md          # чеклист приёмки (13 разделов)
├── project.txt           # исходное ТЗ
├── swagger_front.json    # контракт бэкенда (для генерации клиента)
├── figma_*.json          # выгрузка макетов Figma
├── figma_renders/        # рендеры макетов (эталон для сверки)
├── docs/screenshots/     # скриншоты работающего приложения / тестов / сборки
└── src/                  # исходники приложения (TODO)
```

---

## Документы проекта

| Документ | Назначение |
|---|---|
| [project.txt](./project.txt) | Исходное ТЗ |
| [plan.txt](./plan.txt) | Детальный план реализации, дизайн-токены, архитектура |
| [checklist.md](./checklist.md) | Чеклист приёмки — отмечается по мере готовности |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Процесс разработки по этапам со скриншотами |
| [PROCESS.md](./PROCESS.md) | Хронология разработки по сессиям + карта артефактов |
| [conversation.md](./conversation.md) | Лог переписки по сессиям |

---

## Скриншоты

Галерея «макет → реализация» и скриншоты тестов/сборки — в
[DEVELOPMENT.md](./DEVELOPMENT.md#скриншоты-приложения).
Файлы складываются в [`docs/screenshots/`](./docs/screenshots/).

---

## Скрипты

| Команда | Действие |
|---|---|
| `npm start` | dev-сервер (`ng serve`) |
| `npm run build` | прод-сборка |
| `npm run gen:api` | генерация OpenAPI-клиента |
| `npm test` | unit-тесты |
| `npm run e2e` | e2e-тесты (Playwright) |
| `npm run lint` | линт |

