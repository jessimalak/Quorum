"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const Swalert = require('sweetalert2');
const selector = document.getElementById('theme_selector');
selector.value = theme;
let user;
const name_ = document.getElementById('usernameP');
const mail_ = document.getElementById('mailP');
const state_ = document.getElementById('stateP');
const save_btn = document.getElementById('save-btn');
const name_btn = document.getElementById('username_btn');
const mail_btn = document.getElementById('mail_btn');
const state_btn = document.getElementById('state_btn');
const pass_btn = document.getElementById('pass_btn');
name_.innerText = "@" + localStorage.getItem('username');
mail_.innerText = localStorage.getItem('mail');
state_.innerText = localStorage.getItem('estado');
function logout() {
    electron_1.ipcRenderer.send('signOut', true);
}
name_btn.addEventListener('click', () => {
    ChangeUsername(localStorage.getItem('username'), '¿Cuál será tu nuevo nombre?');
});
mail_btn.addEventListener('click', () => {
    ChangeMail(localStorage.getItem('mail'));
});
state_btn.addEventListener('click', () => {
    UpdateState(localStorage.getItem('estado'));
});
save_btn.addEventListener('click', () => {
    theme = selector.value;
    localStorage.setItem('theme', theme);
    electron_1.ipcRenderer.send('updateTheme', theme);
});
firebase.auth().onAuthStateChanged((userData) => {
    user = userData;
});
function ChangeUsername(initValue, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value: val } = yield Swalert.fire({
            title: title,
            input: 'text',
            inputValue: initValue,
            showCancelButton: true,
            inputValidator: (val) => {
                if (!val || val == initValue) {
                    return 'No hay nada que cambiar aquí';
                }
                else {
                    let name = val.toLowerCase().trim();
                    console.log("nameTo: " + val);
                    ValidateUsername(name).then((valid) => {
                        if (valid) {
                            console.log("validado: " + valid);
                            let uid = user.uid;
                            user.updateProfile({
                                displayName: val
                            }).then(() => {
                                localStorage.setItem('username', name);
                                firebase.database().ref("Usuarios/" + uid).update({
                                    username: name
                                }).then(() => {
                                    name_.innerHTML = "@" + name;
                                    localStorage.setItem('username', name);
                                    console.log('listo');
                                }).catch(() => {
                                    console.log('error al escribir');
                                });
                            }).catch(() => {
                                Toast.fire({ title: "algo pasó, intentalo mas tarde" });
                            });
                        }
                        else {
                            ChangeUsername(initValue, "Alguien ya tiene ese nombre");
                        }
                    });
                }
            }
        });
    });
}
function ChangeMail(initValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value: pass } = yield Swalert.fire({
            title: 'Escribe tu contraseña para saber que eres tu',
            input: 'password',
            inputPlaceholder: 'Contraseña',
            showCancelButton: true,
            inputValidator: (pass) => {
                if (!pass) {
                    return 'Sin tu contraseña no podemos ayudarte';
                }
                else {
                    console.log(pass);
                    let AuthCredential = firebase.auth().EmailAuthProvider.credential(initValue, pass);
                    firebase.auth().reauthenticateWithCredential(AuthCredential).then(() => __awaiter(this, void 0, void 0, function* () {
                        const { value: newMail } = yield Swalert.fire({
                            title: '¿Cuál será tu correo ahora?',
                            input: 'email',
                            inputValue: initValue,
                            showCancelButton: true,
                            inputValidator: (newMail) => {
                                if (!newMail || newMail == initValue) {
                                    return 'No hay nada que cambiar';
                                }
                                else {
                                    user.updateEmail(newMail).then(() => {
                                        let uid = user.uid;
                                        let eMail = CryptoJS.AES.encrypt(newMail, code).toString();
                                        firebase.database().ref("Usuarios/" + uid).update({
                                            mail: eMail
                                        }).then(() => {
                                            Toast.fire({ title: 'Ahora puedes iniciar sesión con ' + newMail, icon: 'success' });
                                        }).catch((err) => {
                                            console.log(err);
                                        });
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                                }
                            }
                        });
                    }));
                }
            }
        });
    });
}
function UpdateState(current) {
    return __awaiter(this, void 0, void 0, function* () {
        const { value: nEstado } = yield Swalert.fire({
            title: "Ponte filosofic@",
            input: 'text',
            inputValue: current,
            showCancelButton: true,
            inputValidator: (nEstado) => {
                if (!nEstado || nEstado == current) {
                    return 'No hay nada que cambiar';
                }
                else {
                    let uid = user.uid;
                    firebase.database().ref("Usuarios/" + uid).update({
                        estado: nEstado
                    }).then(() => {
                        localStorage.setItem('estado', nEstado);
                        state_.innerText = nEstado;
                    });
                }
            }
        });
    });
}
//# sourceMappingURL=settings.js.map