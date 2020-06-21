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

const settings_btn = document.getElementById('settings_btn');
const content = document.getElementById('chatPanel');

function updateS(){
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos')
    
}

updateS()

firebase.auth().onAuthStateChanged(user =>{
    if(!user){
        window.location.replace('login.html')
    }else{
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
        firebase.database().ref('Usuarios/'+uid).once('value').then(function(snapshot){
            let user = snapshot.val();
            document.title = 'Quorum - '+ user.username;
            ipcRenderer.send('loading', false);
        })
    }
})

settings_btn.addEventListener('click', ()=>{
    ipcRenderer.send('openSettings', true);
})

ipcRenderer.on('signOut', (e)=>{
    firebase.auth().signOut();
})