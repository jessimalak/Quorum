var ipcRenderer = require('electron').ipcRenderer;
var firebase = require('firebase');
require('firebase/auth');
require('firebase/database');
var firebaseConfig = {
    apiKey: "AIzaSyDGLP6V1uQx9Mxc6FXp6oO6HKD7qZbnbeE",
    authDomain: "quorumchat.firebaseapp.com",
    databaseURL: "https://quorumchat.firebaseio.com",
    projectId: "quorumchat",
    storageBucket: "quorumchat.appspot.com",
    messagingSenderId: "339371371649",
    appId: "1:339371371649:web:1e68336580ea7117003180",
    measurementId: "G-VL1T8FXBQM"
};
firebase.initializeApp(firebaseConfig);
var CryptoJS = require('crypto-js');
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var uid = localStorage.getItem('uid');
var mongo;
var content = document.getElementsByClassName('content')[0];
function updateS() {
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos');
    setTimeout(function () {
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats');
    }, 3000);
    ipcRenderer.send('loading', false);
}
updateS();
content.innerHTML += '<p>' + uid + '</p>';
firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.replace('index.html');
    }
    else {
        firebase.database().ref('Usuarios/' + uid).once('value').then(function (snapshot) {
            var user = snapshot.val();
            document.title = 'Quorum - ' + user.username;
            var message = CryptoJS.AES.decrypt(user.mensajeEnc, user.id);
            content.innerHTML += message.toString(CryptoJS.enc.Utf8);
        });
    }
});
