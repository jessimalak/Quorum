const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';

function Reverse(value: string): string {
    let reverse = value.split("").reverse().join("")
    return reverse
}

function encrypt(value: string, key_: string, method: string): string {
    let encrypted: string;
    let reverse = Reverse(key_)
    let key = CryptoJS.enc.Utf8.parse(reverse)
    if (method == "A") {
        encrypted = CryptoJS.AES.encrypt(value, key_).toString()
    }else if(method == "B"){
        encrypted = CryptoJS.AES.encrypt(value, reverse).toString()
    } else if (method == "R") {
        encrypted = CryptoJS.Rabbit.encrypt(value, key).toString()
    }
    return encrypted
}

function decrypt(value: string, key_: string, method: string): string {
    let decrypted: string;
    let key = CryptoJS.enc.Utf8.parse(Reverse(key_))
    let reverse = Reverse(key_)
    if (method == "A") {
        decrypted = CryptoJS.AES.decrypt(value, key_).toString(CryptoJS.enc.Utf8)
    }else if(method == "B"){
        decrypted = CryptoJS.AES.decrypt(value, reverse).toString(CryptoJS.enc.Utf8)
    } else if (method == "R") {
        decrypted = CryptoJS.Rabbit.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    }
    return decrypted
}