import fs from 'fs';
import https from 'https';
import path from 'path';

const pizzaUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80";
const burgerUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80";

const pizzaPath = path.join(process.cwd(), '../frontend/src/assets/menu_13.png');
const burgerPath = path.join(process.cwd(), '../frontend/src/assets/menu_14.png');

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

const downloadAssets = async () => {
    try {
        console.log("Downloading Pizza image...");
        await downloadImage(pizzaUrl, pizzaPath);
        console.log("Downloading Burger image...");
        await downloadImage(burgerUrl, burgerPath);
        console.log("Downloaded both images successfully!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

downloadAssets();
