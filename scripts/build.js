import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';


const SSRPaths = [
    path.resolve(process.cwd(), 'home/ssr'),
];

function buildSSR() {
    // list all .tsx files
    const jsxFiles = [];
    SSRPaths.forEach((ssrPath) => {
        const files = fs.readdirSync(ssrPath);
        files.forEach((file) => {
            if (file.endsWith('.tsx')) {
                jsxFiles.push(path.resolve(ssrPath, file));
            }
        });
    });

    // build all .tsx files
    jsxFiles.forEach((jsxFile) => {
        const name = path.basename(jsxFile, '.tsx');
        const cmd = `vite build --ssr ${jsxFile} --outDir dist/ssr/${name}`;
        console.log(cmd);
        execSync(cmd);
    });
}


if (process.argv[2] === 'ssr') {
    buildSSR();
}
