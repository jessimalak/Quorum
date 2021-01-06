const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const Rabbit = require("crypto-js/rabbit");
const TripleDes = require('crypto-js/tripledes')

function Reverse(value: string): string {
    let reverse = value.split("").reverse().join("")
    return reverse
}

function encrypt(value: string, key_: string, method: string, reverseKey: boolean, reverse: boolean): string {
    let encrypted: string;
    let key = key_
    if (reverseKey) {
        key = Reverse(key_)
    }
    if (method == "A") {
        encrypted = AES.encrypt(value, key).toString()
    } else if (method == "B") {
        encrypted = TripleDes.encrypt(value, key).toString()
    } else if (method == "R") {
        encrypted = Rabbit.encrypt(value, key).toString()
    }
    if (reverse) {
        return Reverse(encrypted)
    } else {
        return encrypted
    }
}

function decrypt(value: string, key_: string, method: string, reverseKey: boolean, reverse: boolean): string {
    let decrypted: string;
    let key = key_;
    if (reverseKey) key = Reverse(key_)

    if (method == "A") {
        decrypted = AES.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    } else if (method == "B") {
        decrypted = TripleDes.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    } else if (method == "R") {
        decrypted = Rabbit.decrypt(value, key).toString(CryptoJS.enc.Utf8)
    }
    if (reverse) {
        return Reverse(decrypted)
    } else {
        return decrypted
    }
}