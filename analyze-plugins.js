const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlDir = '.';
const pluginsDir = 'plugins';
const outputDir = 'dist/plugins';

// Leer todos los archivos HTML y extraer los scripts utilizados
let usedScripts = new Set();

fs.readdirSync(htmlDir).forEach(file => {
  if (path.extname(file) === '.html') {
    const html = fs.readFileSync(path.join(htmlDir, file), 'utf8');
    const $ = cheerio.load(html);

    $('script[src]').each((i, elem) => {
      const src = $(elem).attr('src');
      if (src && src.startsWith(pluginsDir)) {
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
function copyUsedFiles(dir, outputPath) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const outputFullPath = path.join(outputPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      copyUsedFiles(fullPath, outputFullPath);
    } else {
      if (path.extname(file) === '.js' && usedScripts.has(file)) {
        if (!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const code = fs.readFileSync(fullPath, 'utf8');
        fs.writeFileSync(outputFullPath, code);
        console.log(`Script utilizado copiado: ${file}`);
      } else {
        console.log(`Script no utilizado encontrado: ${file}`);
      }
    }
  });
}

copyUsedFiles(pluginsDir, outputDir);
