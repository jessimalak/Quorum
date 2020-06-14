const {ipcRenderer} = require('electron')
const firebase = require('firebase')
require('firebase/auth')
require('firebase/database')

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
const CryptoJS = require('crypto-js');
const AES = require("crypto-js/aes");
const SHA256 = require("crypto-js/sha256");
const uid = localStorage.getItem('uid')
let mongo:string;

const content = document.getElementsByClassName('content')[0];

function updateS(){
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos')
    setTimeout(()=>{
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
    }, 3000)
    ipcRenderer.send('loading', false);
}

updateS()
content.innerHTML += '<p>'+uid+'</p>';

firebase.auth().onAuthStateChanged(user =>{
    if(!user){
        window.location.replace('index.html')
    }else{
        firebase.database().ref('Usuarios/'+uid).once('value').then(function(snapshot){
            let user = snapshot.val();
            document.title = 'Quorum - '+ user.username;
            let message = CryptoJS.AES.decrypt(user.mensajeEnc, user.id);
            content.innerHTML += message.toString(CryptoJS.enc.Utf8);
        })
    }
})

