const fs = require('fs');
const str = fs.readFileSync("./text.txt", "utf-8");
const strArr = str.split("\n");
let i = 0;
const total = strArr.length;
let j = 0;
const oneLen = 100;
exports.mark = () => {
    i = j;
}
exports.getNext = () => {
    let s = "";
    j = i;
    while (j < total && (s.length + strArr[j].length) <= oneLen) {
        s += strArr[j];
        j++;
    }
    return s;
}
exports.makeAll = () => {
    let i = 0;
    let s = strArr[i];
    i++;
    let arr = [];
    while (i < total) {
        while (i < total && (s.length + strArr[i].length) <= oneLen) {
            s += strArr[i];
            i++;
        }
        arr.push(s);
        s = strArr[i];
        i++;
    }
    if (s) {
        arr.push(s);
    }
    return arr;
}
