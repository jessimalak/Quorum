//@ts-ignore
const { ipcRenderer } = require('electron');
const Swalert = require('sweetalert2');

const themeSelector = <HTMLInputElement>document.getElementById('theme_selector');
themeSelector.value = theme;
const fondoSelector = <HTMLInputElement>document.getElementById('fondo_selector');
const colorPicker = <HTMLInputElement>document.getElementById('fondoCPicker')
if (fondo.includes("#")) {
    fondoSelector.value = 'color';
    colorPicker.value = fondo
    colorPicker.style.display = 'inline-block'
} else if (fondo == "theme") {
    fondoSelector.value = fondo;
}
else {
    fondoSelector.value = 'imagen';
}
let user;
let order = null;

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

const _switch = <HTMLInputElement>document.getElementById('orderSwitch');
if (platform == 'linux') {
    const switch_ = <HTMLElement>document.getElementsByClassName('switch')[0]
    switch_.style.display = 'inline-block';
    if (customOrder == 'left') {
        _switch.checked = false
    }
}

_switch.addEventListener('change', () => {
    if (_switch.checked) {
        order = null;
    } else {
        order = 'left'
    }
    if(order !== customOrder){
        Toast.fire({
            title: 'Es necesario reiniciar Qourum para aplicar el cambio',
            icon: 'warning'
        })
    }
})

function logout() {
    ipcRenderer.send('signOut', true);
}

name_btn.addEventListener('click', () => {
    ChangeUsername(localStorage.getItem('username'), '¿Cuál será tu nuevo nombre?');
})

mail_btn.addEventListener('click', () => {
    Swal.fire({
        title: 'No has verificado tu correo',
        text: 'Ésto es para asegurarnos que tu correo es real y no una cuenta falsa',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Verificar',
        showCloseButton: true
    }).then((result) => {
        if (result) {
            firebase.auth().currentUser.sendEmailVerification()
                .then(function () {
                    Toast.fire({ title: 'Te hemos enviado un mensaje de confirmación a tu correo', icon: 'success' })
                })
                .catch(function (error) {
                    Toast.fire({ title: 'Ha ocurrido un problema, intentalo mas tarde', icon: 'error' })
                });
        }
    })

})

state_btn.addEventListener('click', () => {
    UpdateState(localStorage.getItem('estado'));
})

save_btn.addEventListener('click', () => {
    theme = themeSelector.value;
    localStorage.setItem('theme', theme);
    localStorage.setItem('fondo', fondo);
    localStorage.setItem('buttonOrder', order)
    ipcRenderer.send('updateTheme', { theme: theme, fondo: fondo })
})
const verifyText = document.getElementById('verified');

firebase.auth().onAuthStateChanged((userData) => {
    user = userData;
    let verified = user.emailVerified;
    if (verified === true) {
        mail_btn.style.display = 'none'
    } else {
        document.getElementById('verifyIcon').style.display = 'none'
    }

    firebase.database().ref("Usuarios/" + user.uid + "/verified").once('value')
        .then((snap) => {
            let data = snap.val()
            console.log(data)
            if (verified !== data) {
                firebase.database().ref("Usuarios/" + user.uid).update({
                    verified: true
                })
            }
        })
});

async function ChangeUsername(initValue: string, title: string) {
    const { value: val } = await Swalert.fire({
        title: title,
        input: 'text',
        inputValue: initValue,
        background: 'var(--panel-color)',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        inputValidator: (val) => {
            if (!val || val == initValue) {
                return 'No hay nada que cambiar aquí';
            } else {
                let name = val.toLowerCase().trim();
                // ValidateUsername(name);
                console.log("nameTo: " + val)
                ValidateUsername(name).then((valid) => {
                    if (valid) {
                        console.log("validado: " + valid)
                        let uid = user.uid;
                        user.updateProfile({
                            displayName: val
                        }).then(() => {
                            localStorage.setItem('username', name)
                            firebase.database().ref("Usuarios/" + uid).update({
                                username: name
                            }).then(() => {
                                name_.innerHTML = "@" + name;
                                localStorage.setItem('username', name)
                                console.log('listo')
                            }).catch(() => {
                                console.log('error al escribir')
                            })
                        }).catch(() => {
                            Toast.fire({ title: "algo pasó, intentalo mas tarde" })
                        })
                    } else {
                        ChangeUsername(initValue, "Alguien ya tiene ese nombre");
                    }
                })
            }
        }
    })

}

async function ChangeMail(initValue: string) {
    const { value: pass } = await Swalert.fire({
        title: 'Escribe tu contraseña para saber que eres tu',
        input: 'password',
        inputPlaceholder: 'Contraseña',
        showCancelButton: true,
        inputValidator: (pass) => {
            if (!pass) {
                return 'Sin tu contraseña no podemos ayudarte';
            } else {
                console.log(pass)
                let AuthCredential = firebase.auth().EmailAuthProvider.credential(initValue, pass);
                firebase.auth().reauthenticateWithCredential(AuthCredential).then(async () => {
                    const { value: newMail } = await Swalert.fire({
                        title: '¿Cuál será tu correo ahora?',
                        input: 'email',
                        inputValue: initValue,
                        showCancelButton: true,
                        inputValidator: (newMail) => {
                            if (!newMail || newMail == initValue) {
                                return 'No hay nada que cambiar'
                            } else {
                                user.updateEmail(newMail).then(() => {
                                    let uid = user.uid;
                                    let eMail = CryptoJS.AES.encrypt(newMail, code).toString();
                                    firebase.database().ref("Usuarios/" + uid).update({
                                        mail: eMail
                                    }).then(() => {
                                        Toast.fire({ title: 'Ahora puedes iniciar sesión con ' + newMail, icon: 'success' })
                                    }).catch((err) => {
                                        console.log(err)
                                    })

                                }).catch((err) => {
                                    console.log(err)
                                })
                            }
                        }
                    })
                })
            }
        }
    })

}

async function UpdateState(current: string) {
    const { value: nEstado } = await Swalert.fire({
        title: "Ponte filosofic@",
        input: 'text',
        inputValue: current,
        background: 'var(--panel-color)',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        inputValidator: (nEstado) => {
            if (!nEstado || nEstado == current) {
                return 'No hay nada que cambiar'
            } else {
                let uid = user.uid;
                firebase.database().ref("Usuarios/" + uid).update({
                    estado: nEstado
                }).then(() => {
                    localStorage.setItem('estado', nEstado);
                    state_.innerText = nEstado;
                })
            }
        }
    })
}

fondoSelector.addEventListener('change', () => {
    let value = fondoSelector.value;
    if (value == 'theme') {
        fondo = 'theme'
        colorPicker.style.display = 'none'
        _body.style.background = 'var(--back-color)'
    } else if (value == 'color') {
        fondo = colorPicker.value
        colorPicker.style.display = 'inline-block'
    } else if (value == 'imagen') {

    }
})

colorPicker.addEventListener('change', () => {
    let color = colorPicker.value;
    fondo = color
    _body.style.background = color;
})

const qr = require('qrcode');

function ShowQR() {
    qr.toDataURL('Quorum |' + user.uid).then((result) => {
        Swal.fire({
            title: "Mi QR",
            // html: '<canvas></canvas>',
            imageUrl: result,
            showConfirmButton: false,
            showCloseButton: true
        })
    }).catch((err) => {
        console.log(err)
    })

}