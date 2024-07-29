const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const minify = require('babel-minify');

const inputDir = 'dist/js';
const outputDir = 'dist/js/minified';

if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach(file => {
  if (path.extname(file) === '.js') {
    const filePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    const code = fs.readFileSync(filePath, 'utf8');

    // Transpila y minimiza el código JavaScript
    const transformed = babel.transformSync(code, {
      presets: ['@babel/preset-env']
    });

    const minified = minify(transformed.code);

    fs.writeFileSync(outputFilePath, minified.code);
    console.log(`Script minificado: ${file}`);
  }
});
