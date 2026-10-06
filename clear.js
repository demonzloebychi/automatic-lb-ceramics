// clear.js
const fs = require('fs');

const inputPath = 'index.html';
const outputPath = 'output.html';

try {
    let html = fs.readFileSync(inputPath, 'utf-8');
    
    // Регулярное выражение ищет ссылки вида:
    // https://www.google.com/url?q= [ЦЕЛЕВОЙ URL до &amp;] &amp; [хвост параметров Google]
    const regex = /href=["']https:\/\/www\.google\.com\/url\?q=([^&]+)&amp;[^"']*["']/gi;

    let count = 0;

    // Заменяем найденную ссылку на чистый URL, который был спрятан в параметре q=
    const modifiedHtml = html.replace(regex, (match, cleanUrl) => {
        count++;
        // Декодируем URL на случай, если там есть закодированные символы (например, %2F вместо /)
        const decodedUrl = decodeURIComponent(cleanUrl);
        
        return `href="${decodedUrl}"`;
    });

    fs.writeFileSync(outputPath, modifiedHtml, 'utf-8');
    
    console.log(`Готово! Очищено ссылок: ${count}`);
    console.log(`Результат сохранен в файл: ${outputPath}`);

} catch (error) {
    console.error('Ошибка при обработке файла:', error.message);
}