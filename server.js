const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const process = require("process");

const camKeys = getCameraURLs();
if (camKeys.length == 0) {
    console.log('No cameras configured through $CAM1_RTSP_URL etc');
    process.exit(1);
}

const interval = getInterval();

(async function main() {
  createImagesDir();
  startExpress();
  setInterval(async () => {
    try {
        const fetches2 = camKeys.map(async (val, index) => {
            await getImage(index, val)
        })
    //   const fetches = new Array();
    //   for (let i = 1; i <= 3; i++) {
    //     fetches.push(await getImage(i));
    //   }
      await Promise.all(fetches2);
    } catch (error) {
      console.error(error);
    }
  }, interval);
})();

function createImagesDir() {
  if (!fs.existsSync("images")) {
    fs.mkdirSync("images");
  }
}

function getCameraURLs() {
  const env = process.env;
  const camKeys = Object.keys(env).filter((key) =>
    /^CAM\d+_RTSP_URL/.test(key)
  );
  const camURLS = [];
  camKeys.forEach((value) => {
    const matches = value.match(/^CAM(\d+)_RTSP_URL/);
    if (matches) {
      camURLS[matches[1]] = env[value];
    }
  });
  return camURLS;
}

function getInterval() {
    const env = process.env;
    if (env['REFRESH_INTERVAL_MS']) {
        return parseInt(env['REFRESH_INTERVAL_MS']);
    }
    else {
        return 5000;
    }
}

function startExpress() {
  const dir = path.join(__dirname, "images");
  app.use(express.static(dir));
  app.listen(3000, () => {
    console.log("Listening on http://localhost:3000");
  });
}

async function getImage(camera, url) {
    const tmpfile = `images/cam${camera}.tmp.jpg`;
    const imgfile = `images/cam${camera}.jpg`;
    const command =
      `ffmpeg -y -rtsp_transport tcp -i '${url}' -frames:v 1 ${tmpfile}`;
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          fs.rename(tmpfile, imgfile, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Updated ${imgfile}`);
              resolve(true);
            }
          });
        }
      });
    });
  }
