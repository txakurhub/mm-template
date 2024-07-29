const postcss = require('postcss');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./**/*.html', './**/*.js'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const inputDir = 'styles';
const outputDir = 'dist';

// Lee todos los archivos CSS en la carpeta de entrada
fs.readdirSync(inputDir).forEach(file => {
  if (path.extname(file) === '.css') {
    const css = fs.readFileSync(path.join(inputDir, file), 'utf8');

    // Procesa el CSS con PostCSS
    postcss([autoprefixer, purgecss])
      .process(css, { from: path.join(inputDir, file), to: path.join(outputDir, file) })
      .then(result => {
        // Escribe el archivo CSS procesado en la salida
        fs.writeFileSync(path.join(outputDir, file), result.css);

        if (result.map) {
          fs.writeFileSync(path.join(outputDir, file + '.map'), result.map.toString());
        }

        console.log(`Procesado: ${file}`);
      })
      .catch(err => console.error(err));
  }
});
