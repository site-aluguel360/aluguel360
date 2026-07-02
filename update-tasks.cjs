const fs = require('fs');

const filePath = 'documentos_refatoracao/TASKS_REESTRUTURACAO.md';
let content = fs.readFileSync(filePath, 'utf8');

for (let i = 1; i <= 22; i++) {
  const taskStr = i.toString().padStart(3, '0');
  
  // Replace `- [ ] **TASK-XXX**` with `- [x] **TASK-XXX**`
  const regexHeader = new RegExp(`- \\[ \\] \\*\\*TASK-${taskStr}\\*\\*`, 'g');
  content = content.replace(regexHeader, `- [x] **TASK-${taskStr}**`);
  
  // Also replace `- **Status**: [ ]` but only in the context of this task block.
  // Actually, since I am doing tasks 001 to 022 sequentially, a simpler way is to find the block for each task and replace the status.
}

// Alternatively, let's just use regex to replace all `- **Status**: [ ]` for FASE 0 and FASE 1.
// We can just find `- [ ] **TASK-XXX**` up to TASK-022 and its corresponding status.
let inTaskToReplace = false;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/- \[.\] \*\*TASK-(\d{3})\*\*/);
  if (match) {
    const taskNum = parseInt(match[1], 10);
    if (taskNum >= 1 && taskNum <= 22) {
      inTaskToReplace = true;
      lines[i] = lines[i].replace('- [ ]', '- [x]');
    } else {
      inTaskToReplace = false;
    }
  }
  
  if (inTaskToReplace && lines[i].startsWith('- **Status**: [ ]')) {
    lines[i] = '- **Status**: [x]';
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('TASKS_REESTRUTURACAO.md updated successfully.');
