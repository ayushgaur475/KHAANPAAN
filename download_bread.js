const fs = require('fs');
const https = require('https');
const path = require('path');

const items = [
    {
        name: 'food_42.jpg',
        url: 'https://images.pexels.com/photos/10790638/pexels-photo-10790638.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_43.jpg',
        url: 'https://images.pexels.com/photos/9510613/pexels-photo-9510613.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_44.jpg',
        url: 'https://images.pexels.com/photos/11100570/pexels-photo-11100570.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_45.jpg',
        url: 'https://images.pexels.com/photos/11100571/pexels-photo-11100571.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
];

const baseAssets = 'd:\\projects\\KHAANPAAN\\KHAANPAAN\\frontend\\src\\assets\\';
const baseUploads = 'd:\\projects\\KHAANPAAN\\KHAANPAAN\\backend\\uploads\\';

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
};

async function run() {
    for (const item of items) {
        const destAssets = path.join(baseAssets, item.name);
        const destUploads = path.join(baseUploads, item.name);
        
        console.log(`Downloading ${item.name}...`);
        try {
            await download(item.url, destAssets);
            console.log(`Saved to assets.`);
            fs.copyFileSync(destAssets, destUploads);
            console.log(`Copied to uploads.`);
        } catch (err) {
            console.error(`Error with ${item.name}:`, err.message);
        }
    }
}

run();
