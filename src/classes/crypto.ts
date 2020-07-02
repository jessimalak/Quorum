const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';

function encrypt(value: string, key: string, method: string): string {
    let encrypted: string;
    if (method == "A") {
        encrypted = CryptoJS.AES.encrypt(value, key).toString()
    } else if (method =="R") {
        encrypted = CryptoJS.Rabbit.encrypt(value, key).toString()
    }
    return encrypted
}

function decrypt(value: string, key: string, method: string): string {
    let encrypted: string;
    if (method == "A") {
        encrypted = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    } else if (method == "R") {
        encrypted = CryptoJS.Rabbit.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    }
    return encrypted
}