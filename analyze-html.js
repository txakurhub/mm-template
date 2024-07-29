const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDir = '.';
const jsDir = 'js';
const outputDir = 'dist/js';

// Leer todos los archivos HTML y extraer los scripts utilizados
let usedScripts = new Set();

fs.readdirSync(htmlDir).forEach(file => {
  if (path.extname(file) === '.html') {
    const html = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    const $ = cheerio.load(html);

    $('script[src]').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && src.startsWith(jsDir)) {
        usedScripts.add(path.basename(src));
      }
    });
  }
});

// Crear la carpeta de salida si no existe
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// Filtrar y copiar solo los scripts utilizados
fs.readdirSync(jsDir).forEach(file => {
  if (path.extname(file) === '.js' && usedScripts.has(file)) {
    const filePath = path.join(jsDir, file);
    const outputFilePath = path.join(outputDir, file);

    const code = fs.readFileSync(filePath, 'utf8');

    fs.writeFileSync(outputFilePath, code);
    console.log(`Script utilizado copiado: ${file}`);
  } else {
    console.log(`Script no utilizado encontrado: ${file}`);
  }
});
