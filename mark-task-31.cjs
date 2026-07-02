const fs = require('fs');
const filePath = 'documentos_refatoracao/TASKS_REESTRUTURACAO.md';
let content = fs.readFileSync(filePath, 'utf8');

let inTaskToReplace = false;
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/- \[( |\/|x)\] \*\*TASK-(\d{3})\*\*/);
  if (match) {
    const tNum = parseInt(match[2], 10);
    if (tNum === 31) {
      inTaskToReplace = true;
      lines[i] = lines[i].replace(/- \[( |\/|x)\]/, '- [x]');
    } else {
      inTaskToReplace = false;
    }
  }
  
  if (inTaskToReplace && lines[i].startsWith('- **Status**: ')) {
    lines[i] = '- **Status**: [x]';
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Marked task 31 as done.');
