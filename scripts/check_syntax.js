const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');

const dir = path.join(__dirname, '../src/components/profile/policies');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let hasError = false;
for (const file of files) {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  try {
    babelParser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript']
    });
    console.log(`OK: ${file}`);
  } catch (err) {
    console.error(`ERROR in ${file}: ${err.message}`);
    hasError = true;
  }
}
if (hasError) process.exit(1);
