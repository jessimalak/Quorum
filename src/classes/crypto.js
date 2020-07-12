const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
function Reverse(value) {
    let reverse = value.split("").reverse().join("");
    return reverse;
}
function encrypt(value, key_, method) {
    let encrypted;
    let reverse = Reverse(key_);
    let key = CryptoJS.enc.Utf8.parse(reverse);
    if (method == "A") {
        encrypted = CryptoJS.AES.encrypt(value, key_).toString();
    }
    else if (method == "B") {
        encrypted = CryptoJS.AES.encrypt(value, reverse).toString();
    }
    else if (method == "R") {
        encrypted = CryptoJS.Rabbit.encrypt(value, key).toString();
    }
    return encrypted;
}
function decrypt(value, key_, method) {
    let decrypted;
    let key = CryptoJS.enc.Utf8.parse(Reverse(key_));
    let reverse = Reverse(key_);
    if (method == "A") {
        decrypted = CryptoJS.AES.decrypt(value, key_).toString(CryptoJS.enc.Utf8);
    }
    else if (method == "B") {
        decrypted = CryptoJS.AES.decrypt(value, reverse).toString(CryptoJS.enc.Utf8);
    }
    else if (method == "R") {
        decrypted = CryptoJS.Rabbit.decrypt(value, key).toString(CryptoJS.enc.Utf8);
    }
    return decrypted;
}
//# sourceMappingURL=crypto.js.map