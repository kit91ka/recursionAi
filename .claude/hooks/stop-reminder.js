// Stop hook: once per session, remind Claude to update AGENT_CONTEXT.md and
// write a session log to docs/sessions/ before the session ends.
//
// Blocks the stop exactly ONCE per session_id (tracked via a marker file in the
// OS temp dir) so it never causes an infinite stop loop: the first stop attempt
// is blocked with a reminder; any subsequent stop is allowed through.
const os = require('os');
const fs = require('fs');
const path = require('path');

let data = '';
process.stdin.on('data', (chunk) => (data += chunk));
process.stdin.on('end', () => {
  let sessionId = 'unknown';
  try {
    sessionId = JSON.parse(data).session_id || 'unknown';
  } catch (_) {
    // no/invalid stdin — fall back to a single shared marker
  }

  const marker = path.join(os.tmpdir(), `claude_session_logged_${sessionId}.marker`);

  if (fs.existsSync(marker)) {
    process.exit(0); // already reminded this session — allow stop
  }

  fs.writeFileSync(marker, new Date().toISOString());
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason:
        'Перед завершением сессии выполни правила из CLAUDE.md: при необходимости обнови AGENT_CONTEXT.md и запиши лог этой сессии в docs/sessions/ (один файл на сессию). После этого можешь завершать — повторно напоминать не буду.',
    })
  );
});
