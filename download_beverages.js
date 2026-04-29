const fs = require('fs');
const https = require('https');
const path = require('path');

const items = [
    {
        name: 'food_38.jpg',
        url: 'https://images.pexels.com/photos/5059339/pexels-photo-5059339.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_39.jpg',
        url: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_40.jpg',
        url: 'https://images.pexels.com/photos/5059368/pexels-photo-5059368.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
        name: 'food_41.jpg',
        url: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=400'
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
