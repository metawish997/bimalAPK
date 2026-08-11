const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../app/(student)/profile/policies');
const destDir = path.join(__dirname, '../src/components/profile/policies');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(path.join(sourceDir, file), 'utf8');
  
  // Replace PolicyLayout wrapper with a simple View
  content = content.replace(/<PolicyLayout[^>]*>/, '<View style={{flex: 1, paddingBottom: 40}}>');
  content = content.replace(/<\/PolicyLayout>/, '</View>');
  
  // Also remove PolicyLayout from the imports
  content = content.replace(/PolicyLayout,?\s*/, '');
  
  fs.writeFileSync(path.join(destDir, file), content);
  fs.unlinkSync(path.join(sourceDir, file)); // delete the original
  console.log(`Moved and refactored ${file}`);
}

// Remove the now empty app directory
try {
  fs.rmdirSync(sourceDir);
  console.log('Removed empty app directory');
} catch(e) {
  console.error('Could not remove app directory', e);
}
