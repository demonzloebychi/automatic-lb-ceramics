// replace.js
const fs = require('fs');

const inputPath = 'info/index.html';
const outputPath = 'info/output.html';

try {
    let html = fs.readFileSync(inputPath, 'utf-8');
    
    // Тот же шаблон для поиска отдельных тегов img
    const regex = /<\s*img\s+[^>]*src=["'][^"']*image\d+\.png["'][^>]*\/?>/gi;

    let counter = 1;
    
    const modifiedHtml = html.replace(regex, (match) => {
        const replacement = `#IMAGE${counter}#`;
        counter++;
        return replacement;
    });

    fs.writeFileSync(outputPath, modifiedHtml, 'utf-8');
    console.log(`Готово! Успешно заменено тегов img: ${counter - 1}`);
    console.log(`Результат сохранен в файл: ${outputPath}`);

} catch (error) {
    console.error('Ошибка при обработке файла:', error.message);
}