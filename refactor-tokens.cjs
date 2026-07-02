const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Substituir tokens exatos com colchetes (ex: text-[#1A535C] -> text-primary)
  content = content.replace(/\[#1A535C\]/gi, 'primary');
  content = content.replace(/\[#2F646C\]/gi, 'primary-light');
  content = content.replace(/\[#2C7E7B\]/gi, 'secondary');
  content = content.replace(/\[#F0F4F8\]/gi, 'accent');
  content = content.replace(/\[#2D2D2D\]/gi, 'foreground');
  content = content.replace(/\[#FF6B6B\]/gi, 'destructive');
  content = content.replace(/\[#4ECDC4\]/gi, 'teal-light');
  content = content.replace(/\[#9c9c9c\]/gi, 'neutral');
  
  // Substituir secondary-hover por primary
  content = content.replace(/hover:bg-secondary-hover/gi, 'hover:bg-primary');
  
  // Substituir sombras fixas (SiteHeader.jsx)
  content = content.replace(/shadow-\[0_2px_2\.4px_-1px_rgba\(26,83,92,0\.6\)\]/g, 'shadow-header');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk('./src');
