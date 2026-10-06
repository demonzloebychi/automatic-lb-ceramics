// compress.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = 'images'; // Папка с вашими переименованными картинками

async function compressImages() {
    try {
        if (!fs.existsSync(imagesDir)) {
            console.error(`Ошибка: Папка "${imagesDir}" не найдена!`);
            return;
        }

        // Читаем все файлы из папки
        const files = fs.readdirSync(imagesDir);
        
        // Фильтруем только изображения (png, jpg, jpeg)
        const imageFiles = files.filter(file => /\.(png|jpe?g)$/i.test(file));

        if (imageFiles.length === 0) {
            console.log('В папке нет картинок для сжатия.');
            return;
        }

        console.log(`Найдено картинок для сжатия: ${imageFiles.length}\n`);

        for (const file of imageFiles) {
            const filePath = path.join(imagesDir, file);
            
            // Получаем исходный размер файла в килобайтах
            const statsBefore = fs.statSync(filePath);
            const sizeBeforeKB = (statsBefore.size / 1024).toFixed(1);

            // Создаем временный файл для безопасной перезаписи
            const tempFilePath = path.join(imagesDir, `temp_${file}`);

            // Сжатие в зависимости от формата (аналог iloveimg)
            const ext = path.extname(file).toLowerCase();

            if (ext === '.png') {
                await sharp(filePath)
                    .png({ quality: 80, compressionLevel: 9, palette: true }) // Сжатие PNG с палитрой (сильно уменьшает вес)
                    .toFile(tempFilePath);
            } else if (ext === '.jpg' || ext === '.jpeg') {
                await sharp(filePath)
                    .jpeg({ quality: 80, mozjpeg: true }) // Использование алгоритма mozjpeg (как в iloveimg)
                    .toFile(tempFilePath);
            }

            // Заменяем оригинал сжатой версией
            fs.renameSync(tempFilePath, filePath);

            const statsAfter = fs.statSync(filePath);
            const sizeAfterKB = (statsAfter.size / 1024).toFixed(1);
            const savedPercent = (((statsBefore.size - statsAfter.size) / statsBefore.size) * 100).toFixed(0);

            console.log(`[Сжато] ${file}: ${sizeBeforeKB} KB -> ${sizeAfterKB} KB (меньше на ${savedPercent}%)`);
        }

        console.log('\n--- Все картинки успешно сжаты! ---');

    } catch (error) {
        console.error('Ошибка при сжатии:', error.message);
    }
}

compressImages();