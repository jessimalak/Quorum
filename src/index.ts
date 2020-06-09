const firebase = require('firebase/app')
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
    
    //BEGING STATUS-BAR
    import {remote} from 'electron';
    const win = remote.getCurrentWindow();

    const title: string = ( < HTMLInputElement > document.getElementById('title')).innerHTML;

    document.getElementById('title_bar').innerHTML = title;

    document.getElementById('min').addEventListener('click', function () {
        win.minimize();
    })

    document.getElementById('max').addEventListener('click', function () {
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.unmaximize();
        }
    })

    document.getElementById('close').addEventListener('click', function () {
        win.close();
    })

    //END STATUS-BAR

firebase.auth().onAuthStateChanged(user =>{
    console.log(user)
})

function Calcular(){
    firebase.auth().signInAnonymously();
    
}

function Cerrar(){
    firebase.auth().signOut();
}