const fs = require("fs");
const { execSync } = require('child_process');
const path = process.argv[2];
const list = fs.readdirSync(path).sort((a, b) => {
    return a.split(".")[0] - b.split(".")[0]
}).filter(n => n.endsWith(".mp3")).map(n => path + "/" + n);
const allfiles = list.join("|");
console.log(allfiles)
execSync(`ffmpeg -y -i "concat:${allfiles}" -acodec copy output.mp3`)