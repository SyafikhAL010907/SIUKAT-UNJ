const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

let count = 0;
walkDir('./src/views/components', function(filePath) {
    if(!filePath.endsWith('.js')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix index.js e.target.files
    if (filePath.replace(/\\/g, '/').endsWith('form/index.js')) {
        content = content.replace('input.onChange(e);', 'input.onChange(e.target.files);');
    }

    // Replace href={storage + '/' + variable}
    content = content.replace(/href=\{([\s\S]*?)storage\s*\+\s*\'\/\'\s*\+\s*([\w\.]+)\s*\}/g, (match, before, variable) => {
        let baseObj = variable.split('.')[0];
        if (variable.includes('.')) {
            let parts = variable.split('.');
            parts.pop();
            baseObj = parts.join('.');
        }
        return `href={${before}storage + '/' + ${variable} + '?t=' + new Date(${baseObj}?.updated_at || 1).getTime()}`;
    });

    // Replace src={...storage + '/' + variable}
    content = content.replace(/:\s*storage\s*\+\s*\'\/\'\s*\+\s*([\w\.]+)/g, (match, variable) => {
        let baseObj = variable.split('.')[0];
        if (variable.includes('.')) {
            let parts = variable.split('.');
            parts.pop();
            baseObj = parts.join('.');
        }
        return `: storage + '/' + ${variable} + '?t=' + new Date(${baseObj}?.updated_at || 1).getTime()`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
        count++;
    }
});

console.log('Total files updated: ' + count);
