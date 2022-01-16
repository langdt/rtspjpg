const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

async function getImage(camera) {
    const tmpfile = `images/cam${camera}.tmp.jpg`;
    const imgfile = `images/cam${camera}.jpg`
    const command = `ffmpeg -y -rtsp_transport tcp -i 'rtsp://admin:pass@192.168.1.50:554/cam/realmonitor?channel=${camera}&subtype=0'` +
    ` -frames:v 1 images/cam${camera}.tmp.jpg`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                fs.rename(tmpfile, imgfile, (err) => {
                    if(err) {
                        reject(err);
                    }
                    else {
                        console.log(`Updated ${imgfile}`);
                        resolve(true);
                    }
                });
            }
        })
    });
}

const dir = path.join(__dirname, 'images');
console.log(dir);
app.use(express.static(dir));
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});

(async function main() {
    createImagesDir();
    setInterval(async () => {
        try {
            const fetches = new Array();
            for(let i=1 ; i <=3 ; i++) {
                fetches.push(await getImage(i));
            }
            await Promise.all(fetches);
        }
        catch(error){
            console.error(error);
        }
    }, 5000);
})();

function createImagesDir() {
    if(!fs.existsSync('images')) {
        fs.mkdirSync('images');
    }
}
