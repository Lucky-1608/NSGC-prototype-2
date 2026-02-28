const fs = require('fs');
const path = require('path');

const targetDirs = [
    'c:\\Users\\vuppa\\OneDrive\\Desktop\\Project\\NSGC 2\\app',
    'c:\\Users\\vuppa\\OneDrive\\Desktop\\Project\\NSGC 2\\components'
];

const extensions = ['.tsx', '.ts'];

const replacements = [
    { search: /yellow-300/g, replace: 'cyan-300' },
    { search: /yellow-400/g, replace: 'cyan-400' },
    { search: /yellow-500/g, replace: 'cyan-500' },
    { search: /yellow-600/g, replace: 'cyan-600' },
    { search: /yellow-900/g, replace: 'cyan-900' }
];

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (extensions.includes(path.extname(fullPath))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            replacements.forEach(rep => {
                content = content.replace(rep.search, rep.replace);
            });

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    } else {
        console.error(`Directory not found: ${dir}`);
    }
});

console.log('Replacement complete.');
