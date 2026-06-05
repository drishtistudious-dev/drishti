const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkFileCase(filePath) {
    if (!fs.existsSync(filePath)) return false;
    const dir = path.dirname(filePath);
    const base = path.basename(filePath);
    const files = fs.readdirSync(dir);
    return files.includes(base);
}

const files = execSync('find apps/aureum-studio -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);

let error = false;
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const imports = [...content.matchAll(/import\s+(?:.*from\s+)?['"]([^'"]+)['"]/g)];
    imports.forEach(imp => {
        let importPath = imp[1];
        if (importPath.startsWith('.')) {
            let resolved = path.resolve(path.dirname(file), importPath);
            // Check .ts, .tsx, /index.ts, /index.tsx
            const exts = ['', '.ts', '.tsx', '/index.ts', '/index.tsx'];
            let found = false;
            for (let ext of exts) {
                if (checkFileCase(resolved + ext)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.log(`CASE ERROR: ${file} imports ${importPath}`);
                error = true;
            }
        }
    });
});
if (!error) console.log('All local imports are case-correct!');
