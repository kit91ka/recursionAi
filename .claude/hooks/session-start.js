// SessionStart hook: inject AGENT_CONTEXT.md into the session context.
// stdout from a SessionStart hook is added to Claude's context.
const fs = require('fs');

const file = 'AGENT_CONTEXT.md';
if (fs.existsSync(file)) {
  const body = fs.readFileSync(file, 'utf8').trim();
  if (body) {
    process.stdout.write('# AGENT_CONTEXT.md (loaded at session start)\n\n' + body + '\n');
  }
}
