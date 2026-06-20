---
date: 2026-06-17
topic: fix-hook-paths
---

## Запрос
Ошибка `Cannot find module 'C:\Users\user\WebstormProjects\recursionAi\recursion-ai\.claude\hooks\stop-reminder.js'` — хуки падали, потому что относительные пути в `settings.json` резолвились от неверного CWD (`recursion-ai/` вместо корня проекта).

## Что сделано
- **`.claude/settings.json`**: все три команды хуков переведены с относительных путей на `${CLAUDE_PROJECT_DIR}/.claude/hooks/...`
- **`.claude/hooks/session-start.js`**: путь к `AGENT_CONTEXT.md` теперь резолвится от `__dirname`, а не от CWD
- **`docs/sessions/2026-06-17-fix-hook-paths.md`**: лог сессии

## Решения и причины
- `${CLAUDE_PROJECT_DIR}` — переменная Claude Code, гарантирует корректный путь к корню проекта независимо от CWD
- `stop-reminder.js` не требовал правок (он не читает файлы проекта, только пишет маркер в `os.tmpdir()`)

## Открытые вопросы
- Хук `PostToolUse` ссылается на `retry-on-error.js`, которого нет в `.claude/hooks/` — либо нужно создать файл, либо убрать хук из settings.json
