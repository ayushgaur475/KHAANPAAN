const fs = require('fs');
const https = require('https');

const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Chole_Bhature_delhi.jpg/600px-Chole_Bhature_delhi.jpg';
const dest1 = 'd:\\projects\\KHAANPAAN\\KHAANPAAN\\frontend\\src\\assets\\food_36.jpg';
const dest2 = 'd:\\projects\\KHAANPAAN\\KHAANPAAN\\backend\\uploads\\food_36.jpg';

const options = {
    headers: {
        'User-Agent': 'KhaanPaanBot/1.0 (contact@example.com)'
    }
};

https.get(url, options, (res) => {
    if (res.statusCode !== 200) {
        console.error(`Failed to download: ${res.statusCode} ${res.statusMessage}`);
        return;
    }
    
    const fileStream1 = fs.createWriteStream(dest1);
    res.pipe(fileStream1);
    
    fileStream1.on('finish', () => {
        console.log('Successfully downloaded to frontend assets.');
        fs.copyFileSync(dest1, dest2);
        console.log('Copied to backend uploads.');
    });
}).on('error', (err) => {
    console.error('Error downloading:', err.message);
});
