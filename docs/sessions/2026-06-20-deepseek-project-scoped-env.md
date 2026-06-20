---
date: 2026-06-20
topic: DeepSeek-роутинг только в контексте проекта
---

## Запрос
Сделать так, чтобы переменные окружения для DeepSeek-бэкенда (`ANTHROPIC_BASE_URL`,
`ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_*_MODEL`, `CLAUDE_CODE_*`) применялись **только в контексте
проекта recursionAi**, а не глобально — чтобы не перебивать обычный Anthropic.

## Что сделано
- Добавлен блок `env` в `.claude/settings.json` (коммитится) с роутингом на DeepSeek:
  base URL, модели, effort. Ключ подставляется ссылкой `"ANTHROPIC_AUTH_TOKEN": "${DEEPSEEK_API_KEY}"`
  — литерала секрета в файле нет.
- Существующие хуки (SessionStart/Stop) не тронуты.

## Решения и причины
- **Проектный `.claude/settings.json` вместо `$env:` в сессии PowerShell** — Claude Code читает
  `env` из настроек проекта только при запуске из его каталога → DeepSeek активен лишь здесь,
  глобальный `claude` остаётся на Anthropic.
- **Ключ через `${DEEPSEEK_API_KEY}` из системной переменной**, а не литералом в файле — settings.json
  коммитится, секрет туда нельзя. Имя `DEEPSEEK_API_KEY` нейтральное: само по себе не активирует
  DeepSeek и не ломает глобальную Anthropic-аутентификацию (в отличие от глобального `ANTHROPIC_AUTH_TOKEN`).
- Fallback при отсутствии интерполяции `${VAR}` в версии Claude Code: положить литеральный ключ в
  `.claude/settings.local.json` (он в `.gitignore`, строка 27).

## Открытые вопросы / следующие шаги
- Пользователю один раз выполнить `setx DEEPSEEK_API_KEY "sk-..."` и открыть новый терминал.
- Проверить: `claude` из каталога recursionAi → DeepSeek; из другого каталога → Anthropic.
- Если `${DEEPSEEK_API_KEY}` не разворачивается — применить fallback (settings.local.json).
