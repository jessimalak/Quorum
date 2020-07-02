const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
function encrypt(value, key, method) {
    let encrypted;
    if (method == "A") {
        encrypted = CryptoJS.AES.encrypt(value, key).toString();
    }
    else if (method == "R") {
        encrypted = CryptoJS.Rabbit.encrypt(value, key).toString();
    }
    return encrypted;
}
function decrypt(value, key, method) {
    let encrypted;
    if (method == "A") {
        encrypted = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    }
    else if (method == "R") {
        encrypted = CryptoJS.Rabbit.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    }
    return encrypted;
}
//# sourceMappingURL=crypto.js.map