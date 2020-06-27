var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Swal = require('sweetalert2');
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
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});
let isValidUsername;
function ValidateUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let isValid = true;
        isValidUsername = true;
        yield firebase.database().ref("Usuarios").orderByChild("username").equalTo(username).once("value")
            .then((snapshot) => {
            snapshot.forEach((element) => {
                isValidUsername = false;
                isValid = false;
            });
        });
        return isValid;
    });
}
//# sourceMappingURL=firebase.js.map