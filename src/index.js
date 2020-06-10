"use strict";
/* #region Main */
exports.__esModule = true;
var firebase = require('firebase/app');
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
/* #endregion Main */
//BEGING STATUS-BAR
var electron_1 = require("electron");
var win = electron_1.remote.getCurrentWindow();
var title = document.getElementById('title').innerHTML;
document.getElementById('title_bar').innerHTML = title;
document.getElementById('min').addEventListener('click', function () {
    win.minimize();
});
document.getElementById('max').addEventListener('click', function () {
    if (!win.isMaximized()) {
        win.maximize();
    }
    else {
        win.unmaximize();
    }
});
document.getElementById('close').addEventListener('click', function () {
    win.close();
});
//END STATUS-BAR
var sweetalert2_1 = require("sweetalert2");
var login_screen = document.getElementById('login');
var login_btn = document.getElementById('login_btn');
var login_mail = document.getElementById('mail_input');
var login_pass = document.getElementById('password_input');
var toRegister = document.getElementById('noCount');
var register_screen = document.getElementById('register');
var main_screen = document.getElementById('main');
var toLogin = document.getElementById('withCount');
toRegister.addEventListener('click', function () {
    login_screen.style.display = "none";
    register_screen.style.display = "flex";
});
toLogin.addEventListener('click', function () {
    login_screen.style.display = "flex";
    register_screen.style.display = "none";
});
function isValidMail(mail) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}
login_btn.addEventListener('click', function () {
    var mail = login_mail.value;
    var password = login_pass.value;
    if (mail == "" || password == "") {
        console.log("algo anda mal");
    }
    else if (!isValidMail(mail)) {
        console.log("el correo ta malo");
    }
    else {
        firebase.auth().signInWithEmailAndPassword(mail, password)["catch"](function (err) {
            sweetalert2_1["default"].fire({ title: err.code, text: err.message, icon: 'error' });
        });
    }
});
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        login_screen.style.display = "none";
        register_screen.style.display = "none";
        main_screen.style.display = "block";
        console.log(user);
    }
    else {
        login_screen.style.display = "flex";
        main_screen.style.display = "none";
    }
});
// function Calcular(){
//     firebase.auth().signInAnonymously();
// }
// function Cerrar(){
//     firebase.auth().signOut();
// }
