/* #region Main */

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

/* #endregion Main */

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
import Swal from 'sweetalert2'

const login_screen = document.getElementById('login');
const login_btn:HTMLElement = document.getElementById('login_btn');
const login_mail:HTMLInputElement = <HTMLInputElement> document.getElementById('mail_input');
const login_pass:HTMLInputElement = <HTMLInputElement> document.getElementById('password_input');
const toRegister:HTMLElement = document.getElementById('noCount');
const register_screen = document.getElementById('register');
const main_screen = document.getElementById('main');

const toLogin = document.getElementById('withCount')

toRegister.addEventListener('click', ()=>{
    login_screen.style.display = "none";
    register_screen.style.display = "flex";
})

toLogin.addEventListener('click', ()=>{
    login_screen.style.display = "flex";
    register_screen.style.display = "none";
})

function isValidMail(mail){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}

login_btn.addEventListener('click', () =>{
    let mail = login_mail.value;
    let password = login_pass.value;

    if(mail == "" || password == ""){
        console.log("algo anda mal")
    }else if(!isValidMail(mail)){
        console.log("el correo ta malo")
    }
    else{
        firebase.auth().signInWithEmailAndPassword(mail, password).catch(function (err){
            Swal.fire({title: err.code, text:err.message, icon: 'error'})
        })
    }
})

firebase.auth().onAuthStateChanged(user =>{
    if(user){
        login_screen.style.display = "none";
        register_screen.style.display = "none";
        main_screen.style.display = "block"
        console.log(user)
    }else{
        login_screen.style.display = "flex";
        main_screen.style.display = "none"
    }
})

// function Calcular(){
//     firebase.auth().signInAnonymously();
    
// }

// function Cerrar(){
//     firebase.auth().signOut();
// }