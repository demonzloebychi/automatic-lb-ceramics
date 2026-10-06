// scan.js
const fs = require('fs');

const filePath = 'index.html';

try {
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Ищет любой тег img, у которого в src есть слово image и цифра перед .png
    const regex = /<\s*img\s+[^>]*src=["'][^"']*image\d+\.png["'][^>]*\/?>/gi;

    const matches = html.match(regex);

    if (matches && matches.length > 0) {
        console.log(`Найдено картинок: ${matches.length}\n`);
        matches.forEach((match, index) => {
            console.log(`[${index + 1}] ${match}`);
        });
    } else {
        console.log('Картинок не найдено.');
    }
} catch (error) {
    console.error('Ошибка при чтении файла:', error.message);
}