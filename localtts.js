const request = require('request')
const fs = require("fs");
const { makeAll } = require('./reader');
const { exec, execSync } = require('child_process');
let allDone = false;
function fetchTTS(text, index, total) {
    return new Promise((resolve) => {
        const fileName = "./audio/" + index + ".wav";
        request(`http://192.168.50.74:1221/api/tts?text=${encodeURIComponent(text)}&engine=org.nobody.multitts`, {})
        // request(`http://192.168.0.102:1221/api/tts?text=${encodeURIComponent(text)}&engine=org.nobody.multitts`, {})
            .pipe(fs.createWriteStream(fileName))
            .on('finish', function () {
                exec("lame -V0 " + fileName, () => {
                    fs.unlink(fileName, () => {
                        console.log("done " + (index + 1) + "/" + total + " //" + text[0] + text[1] + text[2] + text[3] + text[4] + text[5] + text[6] + text[7] + text[8]);
                        if ((index + 1) === total) {
                            allDone = true;
                        }
                    });
                });
                resolve(1);
            }).on('error', (err) => {
                console.log(err);
                resolve(0);
            });
    })
}
const toOne = () => {
    console.log("all done will toOne")
    const list = fs.readdirSync("./audio").sort((a, b) => {
        return a.split(".")[0] - b.split(".")[0]
    }).filter(n => n.endsWith(".mp3"));
    const allfiles = list.join("|");
    console.log(allfiles);
    execSync(`cd ./audio && ffmpeg -i "concat:${allfiles}" -acodec copy ../output.mp3`)
}
let all = makeAll();
let doneParallel = 0;
const parallelDo = async (totalArr, func, parallel) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < parallel; i++) {
            (async (totalArr, parallel, i) => {
                for (let index = i; index < totalArr.length; index += parallel) {
                    await func(totalArr[index], index, i);
                }
                ++doneParallel;
                console.log(`parallel exit ${doneParallel}/${parallel}`);
                if (doneParallel === parallel) {
                    resolve();
                }
            })(totalArr, parallel, i);
        }
    });
};
(async () => {
    const total = all.length;
    await parallelDo(all, async (data, index) => {
        await fetchTTS(data, index, total);
    }, 1);
    const i = setInterval(() => {
        if (allDone) {
            clearInterval(i);
            toOne();
        }
    }, 100);
})();
