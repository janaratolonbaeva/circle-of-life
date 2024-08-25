import fs from 'fs';
import path from 'path';

export default function inlineResources() {
  return {
    name: 'inline-resources',
    closeBundle() {
      const htmlPath = path.resolve('index.html');
      const cssPath = path.resolve('src/css/style.css');
      const outputPath = path.resolve('../views/memoring.blade.php');

      // Найти скомпилированный JS файл с хэшем
      const buildDir = path.resolve('public/build/assets/');
      const jsFile = fs.readdirSync(buildDir).find((file) => file.endsWith('.js'));
      const jsPath = path.resolve(buildDir, jsFile);

      // Чтение файлов
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const jsContent = fs.readFileSync(jsPath, 'utf8');

      // Создание итогового контента
      const finalContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    ${cssContent}
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    ${jsContent}
  </script>
</body>
</html>
      `;

      // Запись итогового контента в файл
      fs.writeFileSync(outputPath, finalContent, 'utf8');
      console.log('memoring.blade.php has been created successfully!');
    },
  };
}
