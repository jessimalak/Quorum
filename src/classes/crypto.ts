const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const SHA3 = require('crypto-js/sha3')

function Reverse(value: string): string {
    let reverse = value.split("").reverse().join("")
    return reverse
}

function encrypt(value: string, key_: string, method: string): string {
    let encrypted: string;
    let reverse = Reverse(key_)
    const codeM1 = SHA3(key_, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
    const codeM2 = SHA3(reverse, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
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
    const codeM1 = CryptoJS.SHA3(key_, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
    const codeM2 = CryptoJS.SHA3(reverse, { outputLength: 512 }).toString(CryptoJS.enc.Hex);
    const codeSHA = CryptoJS.SHA256(key_).toString(CryptoJS.enc.Hex);
    if (method == "A") {
        decrypted = AES.decrypt(value, codeM1).toString(CryptoJS.enc.Utf8)
    } else if (method == "B") {
        decrypted = AES.decrypt(value, codeM2).toString(CryptoJS.enc.Utf8)
    } else if (method == "R") {
        decrypted = AES.decrypt(value, codeSHA).toString(CryptoJS.enc.Utf8)
    }
    return decrypted
}