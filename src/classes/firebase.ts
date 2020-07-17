const Swal = require('sweetalert2')
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

const firebaseConfig = {
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
const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

let isValidUsername: boolean;

async function ValidateUsername(username: string) {
    let isValid = true;
    isValidUsername = true;
    if (isValidUser(username)) {
        await firebase.database().ref("Usuarios").orderByChild("username").equalTo(username).once("value")
            .then((snapshot) => {
                snapshot.forEach((element) => {
                    isValidUsername = false;
                    isValid = false;
                });
            });
    }else{
        isValidUsername = false
        isValid = false
    }
    return isValid;
}

function isValidUser(username: string): boolean {
    const re = /\w+/;
    return re.test(username)
}