# Multi-agent review: замена Claude Code для Angular frontend-команды

Дата: 2026-06-14  
Кандидаты: Cline, OpenHands, Hermes Agent, Aider, Continue, Roo Code  
Шкала: 0-5, где 5 = сильный fit для роли, 0 = неприемлемо.

## Итог

| Кандидат | Protocol | Angular | Figma/DS | Platform | Средняя | Решение |
|---|---:|---:|---:|---:|---:|---|
| Cline | 4.0 | 4.4 | 4.2 | 4.1 | 4.2 | Основной IDE-агент для пилота |
| OpenHands | 4.4 | 4.1 | 4.2 | 3.8 | 4.1 | Platform/SDLC финалист |
| Hermes Agent | 4.2 | 3.9 | 3.6 | 2.8 | 3.6 | R&D-пилот, не основной стандарт |
| Continue | 2.4 | 3.5 | 3.4 | 3.8 | 3.3 | PR checks/governance слой |
| Aider | 2.4 | 3.9 | 2.2 | 3.6 | 3.0 | Tactical CLI для точечных правок |
| Roo Code | 1.4 | 3.0 | 2.0 | 0.8 | 1.8 | Исключить из shortlist |

Рекомендация: пилотировать Cline как основной IDE-инструмент команды и OpenHands как платформенный автономный контур. Continue рассматривать как PR/CI governance слой, Aider как локальный git-first инструмент для ограниченных сценариев. Hermes оставить для sandbox/R&D. Roo Code не внедрять из-за статуса archived/shutdown.

## Разбиение по оценочным блокам

| Оценочный блок | Экспертная линза | Проверенные критерии | Что проверял |
|---|---|---|
| Protocol | Agent Protocol Architect | 1, 2, 3, 5, 6 | Роль агента, tool/function calling, structured output, координация, retry/failure handling, context/memory |
| Angular | Angular Frontend Architect | 4, 7 + Angular-сценарии | Angular/Nx/monorepo, multi-file diff, templates/styles/specs, RxJS, forms, routing, i18n, lint/test/build |
| Figma/DS | Design-System / Figma Reviewer | Figma + 7, 9 | Figma MCP/Dev Mode/screenshot, browser preview, tokens, Storybook, a11y, запрет произвольных UI-решений |
| Platform | Platform Owner / Security / Economics | 8, 9, 10 + внедрение/поддержка | Observability, audit, RBAC, sandbox, secrets, cost, latency, internal ownership, product health |

## Agent Protocol Architect

| Кандидат | 1 Роль | 2 Протокол | 3 Координация | 5 Tool-use | 6 Контекст/память | Вывод |
|---|---:|---:|---:|---:|---:|---|
| OpenHands | 5 | 5 | 4 | 4 | 4 | Лучший архитектурный fit как платформа: Agent Canvas, SDK, Cloud/Enterprise, sandbox и automations. |
| Cline | 4 | 4 | 4 | 4 | 4 | Сильный human-in-the-loop IDE/terminal агент: tools, browser, approvals, checkpoints, MCP, subagent/team сценарии. |
| Hermes Agent | 4 | 4 | 4 | 4 | 5 | Хорошо ложится на autonomous backend-agent: persistent memory, subagents, sandbox/browser. Риск - зрелость API и протокольных контрактов. |
| Aider | 2 | 2 | 1 | 4 | 3 | Сильный executor/worker для git repo, lint/test и точечных изменений, но не полноценный orchestrator. |
| Continue | 2 | 3 | 2 | 3 | 2 | Лучше как PR/checks слой, чем как основной autonomous coding agent. |
| Roo Code | 1 | 1 | 1 | 2 | 2 | Strategic hard stop из-за archived/shutdown статуса. |

## Angular Frontend Architect

| Кандидат | Angular/Nx | Арх. правила | Issue -> файлы | Planner split | Minimal diff | Review edge cases | Lint/test/build | Итог |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Cline | 4.5 | 4.5 | 4.5 | 4.5 | 4.0 | 4.0 | 4.5 | 4.4 |
| OpenHands | 4.0 | 4.5 | 4.0 | 4.5 | 3.5 | 4.0 | 4.5 | 4.1 |
| Aider | 4.0 | 3.5 | 4.0 | 3.5 | 4.5 | 3.5 | 4.0 | 3.9 |
| Hermes Agent | 3.5 | 4.0 | 4.0 | 4.5 | 3.5 | 3.5 | 4.0 | 3.9 |
| Continue | 3.0 | 4.0 | 3.0 | 3.0 | 3.0 | 4.0 | 4.5 | 3.5 |
| Roo Code | 2.5 | 2.5 | 3.0 | 3.5 | 3.0 | 3.0 | 3.5 | 3.0 |

Вывод: для ежедневного Angular/Nx workflow лидирует Cline: IDE-контекст, approvals, checkpoints, terminal commands и rules лучше всего подходят для связки `component.ts`, `template.html`, `service.ts`, `spec.ts`, styles и i18n. OpenHands сильнее для SDLC-пайплайна `issue -> branch/PR -> checks -> review`, но тяжелее как ежедневный IDE assistant.

## Design-System / Figma Reviewer

| Кандидат | Figma handoff | MCP / Dev Mode / screenshot | Browser preview | DS rules / tokens / Storybook / a11y | Security posture | Итог |
|---|---:|---:|---:|---:|---:|---:|
| Cline | 4 | 5 | 4 | 4 | 3 | 4.2 |
| OpenHands | 4 | 4 | 5 | 4 | 4 | 4.2 |
| Hermes Agent | 4 | 4 | 4 | 3 | 3 | 3.6 |
| Continue | 3 | 4 | 3 | 4 | 3 | 3.4 |
| Aider | 2 | 1 | 2 | 3 | 3 | 2.2 |
| Roo Code | 2 | 3 | 3 | 3 | 1 | 2.0 |

Вывод: для Figma/design-system потока брать Cline или OpenHands. Cline удобнее для IDE handoff через Figma MCP/Dev Mode + screenshot oracle + локальные правила дизайн-системы. OpenHands сильнее для полного preview/test/browser цикла, Storybook/a11y команд и visual regression. Aider годится только если весь контроль вынесен в CI. Roo Code не рекомендован для security-sensitive MCP интеграций.

Security notes для Figma:

- Использовать официальный Figma MCP/Dev Mode или строго проверенный MCP-сервер.
- Давать scoped/read-only access там, где возможно.
- Pin versions для MCP-серверов.
- Запретить широкие auto-approve правила.
- Запускать browser/Playwright в sandbox.
- Вести audit logs tool calls.
- Считать third-party MCP потенциальной зоной prompt/tool poisoning и data exfiltration.

## Platform Owner / Security / Economics

| Кандидат | Наблюдаемость | Безопасность | Экономика | Скорость внедрения | Внутренняя поддержка | Поддержка продукта |
|---|---:|---:|---:|---:|---:|---:|
| Cline | 4.5 | 4.0 | 4.5 | 4.0 | 3.5 | 4.0 |
| OpenHands | 4.0 | 4.0 | 4.0 | 3.0 | 4.0 | 4.0 |
| Aider | 2.0 | 3.0 | 4.5 | 5.0 | 4.0 | 4.0 |
| Continue | 3.5 | 3.5 | 4.0 | 4.0 | 4.0 | 3.5 |
| Hermes Agent | 2.5 | 3.0 | 3.5 | 2.5 | 3.0 | 2.0 |
| Roo Code | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.0 |

Вывод: enterprise shortlist - Cline и OpenHands. Cline быстрее внедрить в IDE с governance/observability/RBAC/tool controls. OpenHands сильнее как self-host/VPC/SDK платформа, но дороже во внедрении и эксплуатации. Continue полезен как CI/PR governance layer. Aider дешевле и проще всего для tactical rollout, но слаб как централизованная платформа. Hermes требует R&D и security hardening. Roo Code исключить.

## Практический benchmark

Пилот должен проверять end-to-end workflow, а не отдельные ответы модели.

| Сценарий | Успешный результат |
|---|---|
| Jira/GitHub issue -> поиск файлов | Агент сам находит нужные Angular files и объясняет dependency map |
| Planner split | Задача разбита на component/template/service/test/style/i18n без лишних шагов |
| Minimal implementation | Diff минимальный, не ломает public API компонентов |
| Code review | Найдены Angular-specific риски: subscriptions, change detection, forms, accessibility, router edge cases |
| Test agent | Запускает lint/test/build, корректно чинит ошибки или явно фиксирует блокер |
| Figma handoff | Использует Figma MCP/Dev Mode + screenshot, применяет дизайн-систему, не создаёт новый UI kit |
| Legacy explanation | Объясняет старый feature module/service flow и предлагает безопасный refactor |
| Angular/RxJS migration | Делает ограниченную миграцию с passing tests и понятным rollback |
| Docs / PR | Генерирует PR description, migration notes, changelog без выдуманных деталей |
| Handoff | Следующий агент не теряет constraints, decisions и known blockers |

Метрики пилота:

- Task success rate.
- Time to PR.
- Human interventions.
- Build/test/lint pass rate.
- Diff size и blast radius.
- Review usefulness: доля найденных реальных проблем.
- Figma/design-system compliance.
- Tool call failure rate.
- Retry-loop cost.
- Cost per merged PR.
- Latency end-to-end.
- Security incidents или policy violations.

## Рекомендуемая целевая схема

| Роль в системе | Рекомендуемый инструмент | Причина |
|---|---|---|
| IDE coding agent | Cline | Лучший баланс Angular workflow, approvals, checkpoints, Figma MCP и скорости внедрения |
| Autonomous SDLC/platform agent | OpenHands | Подходит для issue -> branch/PR -> checks -> review и self-host/enterprise сценариев |
| PR governance / policy checks | Continue | Сильнее как review/check слой, не как основной coder |
| Tactical git-first fixer | Aider | Быстрые точечные правки, минимальный diff, низкая стоимость внедрения |
| Experimental multi-agent runtime | Hermes Agent | Проверять только в sandbox/R&D из-за зрелости и поддержки |
| Не внедрять | Roo Code | Archived/shutdown, высокий риск поддержки и безопасности |

## Источники и допущения

- Cline docs: https://docs.cline.bot/
- Cline Enterprise overview: https://docs.cline.bot/enterprise-solutions/overview
- OpenHands docs: https://docs.openhands.dev/
- Aider docs: https://aider.chat/docs/
- Continue docs: https://docs.continue.dev/
- Roo Code GitHub: https://github.com/RooCodeInc/Roo-Code
- Hermes Agent: https://hermes-agent.nousresearch.com/
- Figma Dev Mode MCP / MCP announcements: требуется финальная верификация по официальной Figma-документации перед security review.

Примечание: оценки Hermes и части Figma/MCP security основаны на заявленных возможностях и требуют практического smoke test. Для любого кандидата перед production rollout обязательны security review, policy allowlist для tools и проверка обработки секретов.
