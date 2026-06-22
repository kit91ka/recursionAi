# AGENT_CONTEXT — recursionAiCursor

## Проект
Репозиторий для работы с AI-агентом (Cursor/Claude Code): правила сессий, скиллы, хуки. Тестовое задание по справочникам — см. `project.txt`.

## Конвенции агента
- `CLAUDE.md` — правила: читать/обновлять этот файл, вызывать `orchestrate` для нетривиальных задач, писать лог в `docs/sessions/`.
- Хуки: `.claude/settings.json` — SessionStart (загрузка AGENT_CONTEXT), Stop (напоминание о логе).
- Скилл-оркестратор: `.claude/skills/orchestrate/SKILL.md`.

## Скиллы
Cursor подхватывает:
- `.claude/skills/` (используется в проекте)
- `.cursor/skills/` (стандарт Cursor)
- глобально: `~/.cursor/skills/`, `~/.claude/skills/`

Установка из GitHub: Settings → Rules → Remote Rule (GitHub), или копирование папки `skill-name/SKILL.md`, или CLI (`skills-pm`, `skills-lc-cli`).

## Состояние
- README.md, DEVELOPMENT.md — пустые.
- Реализация справочника категорий — в процессе/не начата (см. сессии 2026-06-07).
