const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const MD5 = require("crypto-js/md5")

function Reverse(value: string): string {
    let reverse = value.split("").reverse().join("")
    return reverse
}

console.log(MD5(code).toString(CryptoJS.enc.Hex))
console.log(MD5(code).toString(CryptoJS.enc.Base64))
console.log(SHA256(code))

function encrypt(value: string, key_: string, method: string): string {
    let encrypted: string;
    let reverse = Reverse(key_)
    const codeM1 = MD5(key_).toString(CryptoJS.enc.Hex);
    const codeM2 = MD5(reverse).toString(CryptoJS.enc.Hex);
    const codeSHA = SHA256(key_).toString(CryptoJS.enc.Hex);
    if (method == "A") {
        encrypted = AES.encrypt(value, codeM1).toString()
    } else if (method == "B") {
        encrypted = AES.encrypt(value, codeM2).toString()
    } else if (method == "R") {
        encrypted = AES.encrypt(value, codeSHA).toString()
    }
    return encrypted
}

function decrypt(value: string, key_: string, method: string): string {
    let decrypted: string;
    let reverse = Reverse(key_)
    console.log(value)
    let val = (CryptoJS.enc.Base64.parse(value))
    const codeM1 = CryptoJS.MD5(key_).toString(CryptoJS.enc.Hex);
    
    const codeM2 = CryptoJS.MD5(reverse).toString(CryptoJS.enc.Hex);
    const codeSHA = CryptoJS.SHA256(key_).toString(CryptoJS.enc.Hex);
    if (method == "A") {
        decrypted = AES.decrypt(value, codeM1).toString(CryptoJS.enc.Utf8)
    } else if (method == "B") {
        decrypted = AES.decrypt(value, codeM2).toString(CryptoJS.enc.Utf8)
        console.log(AES.decrypt(value, AES.decrypt(codeM2, codeM2).toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Utf8))
    } else if (method == "R") {
        decrypted = AES.decrypt(value, codeSHA).toString(CryptoJS.enc.Utf8)
    }
    console.log(decrypted)
    return decrypted
}