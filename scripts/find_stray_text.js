const fs = require('fs');
const path = require('path');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const dir = path.join(__dirname, '../src/components/profile/policy');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });

  traverse(ast, {
    JSXText(path) {
      const text = path.node.value;
      if (text.trim().length > 0) {
        const parentName = path.parent.name ? path.parent.name.name : path.parent.openingElement.name.name;
        if (parentName !== 'PolicyText' && parentName !== 'PolicyHeading' && parentName !== 'PolicyListItem' && parentName !== 'Text') {
          console.log(`File: ${file}`);
          console.log(`Stray text inside <${parentName}>: "${text.trim()}" at line ${path.node.loc.start.line}`);
        }
      }
    }
  });
}
