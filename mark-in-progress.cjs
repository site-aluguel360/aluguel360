const fs = require('fs');
const filePath = 'documentos_refatoracao/TASKS_REESTRUTURACAO.md';
let content = fs.readFileSync(filePath, 'utf8');

const tasksInProgress = [23, 24, 25, 26, 27, 28, 29, 30];

let inTaskToReplace = false;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/- \[( |\/|x)\] \*\*TASK-(\d{3})\*\*/);
  if (match) {
    const tNum = parseInt(match[2], 10);
    if (tasksInProgress.includes(tNum)) {
      inTaskToReplace = true;
      lines[i] = lines[i].replace(/- \[( |\/|x)\]/, '- [/]');
    } else {
      inTaskToReplace = false;
    }
  }
  
  if (inTaskToReplace && lines[i].startsWith('- **Status**: [ ]')) {
    lines[i] = '- **Status**: [/]';
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Marked in progress successfully.');
