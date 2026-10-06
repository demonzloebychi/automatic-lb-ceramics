const fs = require('fs');
const path = require('path');

const inputHtmlPath = 'index.html';
const outputHtmlPath = 'output.html';
// Укажите путь к папке с картинками (если она в текущей папке: 'images')
const imagesDir = 'images'; 

try {
    let html = fs.readFileSync(inputHtmlPath, 'utf-8');
    
    // Регулярное выражение ищет теги img и захватывает полное имя файла (например, image14.png)
    const regex = /<\s*img\s+[^>]*src=["']([^"']*image\d+\.png)["'][^>]*\/?>/gi;

    let counter = 1;
    let matchesFound = 0;

    // Используем .replace() чтобы одновременно переименовать файлы на диске и обновить HTML
    const modifiedHtml = html.replace(regex, (match, srcPath) => {
        matchesFound++;
        
        // Получаем имя файла из путей вроде "images/image14.png" -> "image14.png"
        const oldFileName = path.basename(srcPath);
        
        // Определяем расширение файла (.png, .jpg и т.д.)
        const ext = path.extname(oldFileName);
        
        // Новое имя файла по порядку: 1.png, 2.png и т.д.
        const newFileName = `${counter}${ext}`;
        
        // Полные пути на диске
        const oldFullPath = path.join(imagesDir, oldFileName);
        const newFullPath = path.join(imagesDir, newFileName);

        // Переименовываем файл физически в папке
        if (fs.existsSync(oldFullPath)) {
            // Чтобы избежать ошибок, если файлы уже переименованы или пересекаются, 
            // можно временно переименовывать или делать напрямую:
            fs.renameSync(oldFullPath, newFullPath);
            console.log(`[Файл] ${oldFileName} -> ${newFileName}`);
        } else {
            console.log(`[Предупреждение] Файл не найден на диске: ${oldFullPath}`);
        }

        // Формируем замену для HTML (если вам нужны метки #IMAGE1# или новые пути типа images/1.png)
        // Здесь мы подставляем новую нумерацию
        const replacement = `#IMAGE${counter}#`; 
        counter++;
        
        return replacement;
    });

    // Сохраняем обновленный HTML
    fs.writeFileSync(outputHtmlPath, modifiedHtml, 'utf-8');
    
    console.log('\n--- Готово! ---');
    console.log(`Обработано картинок: ${matchesFound}`);
    console.log(`Новый HTML сохранен в: ${outputHtmlPath}`);

} catch (error) {
    console.error('Ошибка:', error.message);
}