//@ts-ignore
const { ipcRenderer } = require('electron')
// const firebase = require('firebase')
// require('firebase/auth')
// require('firebase/database')

// var firebaseConfig = {
//     apiKey: "AIzaSyDGLP6V1uQx9Mxc6FXp6oO6HKD7qZbnbeE",
//     authDomain: "quorumchat.firebaseapp.com",
//     databaseURL: "https://quorumchat.firebaseio.com",
//     projectId: "quorumchat",
//     storageBucket: "quorumchat.appspot.com",
//     messagingSenderId: "339371371649",
//     appId: "1:339371371649:web:1e68336580ea7117003180",
//     measurementId: "G-VL1T8FXBQM"
// };

// firebase.initializeApp(firebaseConfig);
const uid = localStorage.getItem('uid')
let mongo: string;
let username = localStorage.getItem('username');
let databaseReference = firebase.database().ref("Usuarios/" + uid);

const settings_btn = document.getElementById('settings_btn');
const chat = document.getElementById('chatPanel');
const welcomeScreen = document.getElementById('welcomeMessage');
const chats = document.getElementById('chat-list');
const chatContainer = document.getElementById('chatMessages');
document.title = 'Quorum - ' + username;

ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
let chatsNames: string[] = new Array();

const mensajeInput = <HTMLInputElement>document.getElementById('mensaje-input');

let loadedChat: { id: string, tipo: string, nombre: string };

const contactSelector = <HTMLInputElement>document.getElementById('contactSelect');
const contactC = <HTMLOptGroupElement>document.getElementById('contactC')
const searchContact_btn = document.getElementById('searchContact_btn');

const contactSelectorD = document.getElementById('contactSelectD');
const options = <HTMLElement>document.getElementsByClassName("custom-options")[0]
let c = "'";
let ContRooms: string[] = new Array();
let chating: string[] = new Array();

firebase.database().ref('Usuarios/' + uid + '/chats').on('value',
    (snapshot) => {
        let id = 0;
        let chats_ = "";

        snapshot.forEach((element) => {
            let data = element.val();
            chatsNames.push(data.nombre)
            let Rname = "";
            if (data.tipo == "Contacto") {
                Rname = decrypt(data.name, code, "A");
            }
            let notify = ""
            if (data.leido !== undefined) {
                if (!data.leido) {
                    notify = '<span id="'+element.key+'_notify" class="mdi mdi-bell-circle notify"></span>'
                }
            }
            chats_ += '<li class="contact-item" id="chat_' + id + '" onclick="OpenChat(' + c + element.key + c + ',' + c + data.tipo + c + ',' + c + id + c + ', ' + c + Rname + c + ')"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + data.nombre + '</p><span>' + Rname + '</span>'+notify+'</div></li>';
            id++;
            ContRooms.push(element.key);
            chating.push(element.key);
        }); chats.innerHTML = chats_;
    })
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.replace('login.html')
    } else {
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos');
        firebase.database().ref("Usuarios/" + uid + "/contactos").once("value").then((snapshot) => {
            snapshot.forEach((element) => {
                let data = element.val();
                if (!ContRooms.includes(data.id)) {
                    options.innerHTML += '<div class="custom-option" onclick="showContact(' + c + data.username + c + ', ' + c + data.id + c + ', ' + c + decrypt(data.nombre, code, "A") + c + ')"><p>' + data.username + ' </p><span> ' + decrypt(data.nombre, code, "A") + '</span></div>'
                    ContRooms.push(data.id);
                }
            });
        }).finally(() => {
            localStorage.setItem('ContRoomS', ContRooms.toString())
            ipcRenderer.send('loading', false);
        })

    }
})

settings_btn.addEventListener('click', () => {
    ipcRenderer.send('openSettings', true);
})

ipcRenderer.on('signOut', (e) => {
    firebase.auth().signOut();
})

ipcRenderer.on('updateTheme', (e, val) => {
    UpdateTheme(val);
})

function OpenSearch(type: string) {
    localStorage.setItem('searchType', type);
    ipcRenderer.send('search', type);
}

function CreateRoom() {
    Swal.fire({
        title: "Crear nueva Sala",
        html: '<input class="inputText searchHeader" type="text" placeholder="Nombre" maxlength="24" name="roomName" id="roomNameInput">' +
            '<input class="inputText searchHeader" type="text" placeholder="Etiquetas (separadas por comas ( , ))" name="roomkeys" id="roomKeywordsInput">' +
            '<label class="check-container">Sala privada<input type="checkbox" id="privateCheck"><span class="checkmark"></span></label>',
        showCloseButton: true,
        background: 'var(--back-Color)',
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: '<i class="mdi mdi-chat-plus"></i> Crear'
    }).then((result) => {
        if (result.value) {
            let name = (<HTMLInputElement>document.getElementById('roomNameInput')).value;
            let keywords = (<HTMLInputElement>document.getElementById('roomKeywordsInput')).value;
            let isPrivate = (<HTMLInputElement>document.getElementById('privateCheck')).checked;
            let id: string;
            if (name !== "") {
                firebase.database().ref("Salas").push({
                    nombre: name,
                    keywords: keywords,
                    miembros: { uid },
                    admins: { uid },
                    private: isPrivate
                }).then((e) => {
                    id = e.key;
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + e.key).set({
                        nombre: name
                    }).then(() => {
                        showChat(name, id, "Sala", "")
                    })
                })
            } else {
                CreateRoom();
            }
        }
    })
}

ipcRenderer.on('joinRoom', (e, values) => {
    firebase.database().ref("Salas/" + values.id + "/miembros").push({
        uid
    }).then(() => {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + values.id).set({
            nombre: values.name,
            tipo: "Sala"
        })
    })
    showChat(values.name, values.id, "Sala", "");
    ContRooms.push(values.id)
    localStorage.setItem('ContRoomS', ContRooms.toString())
})

function showChat(name, id, tipo, Rname) {
    let c = "'";
    chatsNames.push(name);
    let index = chatsNames.length - 1;
    chats.innerHTML += '<li class="contact-item" id="chat_' + index + '" onclick="OpenChat(' + c + id + c + ',' + c + tipo + c + ',' + c + index + c + ',' + c + Rname + c + ')"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + name + '</p><span>' + Rname + '</span></div></li>';
}

class Mensaje {
    sender: string;
    texto: string;
    time: string;
    class: string;
    senderlabel: string = "";
    constructor(sender_, time_, texto_) {
        this.sender = decrypt(sender_, code, "A");
        this.time = time_;
        this.texto = decrypt(texto_, code, "A");
    }
    Show() {
        if (this.sender == username) {
            this.class = "sender";
            this.senderlabel = "";
        } else {
            this.class = "reciver";
            if (loadedChat.tipo == "Sala") {
                this.senderlabel = '<span class="senderLabel">' + this.sender + '</span>'
            }
        }
        let resource = '<div class="mensaje ' + this.class + '">' + this.senderlabel + '<div class="mensaje-content ' + this.class + '-content"><p class="messageText">' + this.texto + '</p><p class="mensaje-time">' + this.time + '</p></div></div>'
        chatContainer.innerHTML += resource;
        Scroll();
    }
}

let firstTime: boolean;

function OpenChat(id: string, tipo: string, index: number, nombre: string) {
    welcomeScreen.style.display = "none";
    chat.style.display = "flex";
    loadedChat = { id, tipo, nombre };
    chatContainer.innerHTML = "";
    mensajeInput.focus();
    let titleP = document.getElementById('chatName');
    let subTitleP = document.getElementById('chatSub');
    if (tipo == "Sala") {
        firebase.database().ref("Salas/" + id + "/mensajes").on("value",
            (snapshot) => {
                chatContainer.innerHTML = "";
                snapshot.forEach((element) => {
                    let data = element.val();
                    let mensaje = new Mensaje(decrypt(data.sender, id, "R"), timeStamp(data.time), decrypt(data.texto, id, "R"));
                    mensaje.Show();
                    //@ts-ignore
                    twemoji.parse(chatContainer);
                });
            });
        titleP.style.fontSize = "2rem"
        titleP.style.fontWeight = "300"
    } else if (tipo == "Contacto") {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + id + "/mensajes").on("value",
            (snapshot) => {
                chatContainer.innerHTML = "";
                firebase.database().ref("Usuarios/" + id + "/chats/" + uid).once('value')
                    .then((snapshot) => {
                        if (snapshot.val() == null) {
                            firstTime = true;
                        }
                    })
                snapshot.forEach((element) => {
                    let data = element.val();
                    let decryptCode: string;
                    let sender = decrypt(data.sender, code, "A")
                    if (sender == username) {
                        decryptCode = id
                    } else {
                        decryptCode = uid;
                    }
                    let mensaje = new Mensaje(data.sender, timeStamp(data.time), decrypt(data.texto, decryptCode, "R"))
                    mensaje.Show();
                    //@ts-ignore
                    twemoji.parse(chatContainer);
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + id).update({
                        leido: true
                    })
                });
            })
        titleP.style.fontSize = "1rem"
        titleP.style.fontWeight = "500"
    }
    titleP.innerText = chatsNames[index];
    subTitleP.innerText = nombre;

}

mensajeInput.addEventListener('keyup', (k) => {
    if (k.keyCode == 13 && !k.shiftKey) {
        SendMessage();
    }
})

function SendMessage() {
    let preMessage = mensajeInput.value;
    if (preMessage.includes("~")) {
        preMessage = Command(preMessage);
    } if (!preMessage.includes("$invalid_")) {
        let mensaje = encrypt(preMessage, code, "A");
        let sender = encrypt(username, code, "A");
        if (mensaje !== "") {
            if (loadedChat.tipo == "Sala") {
                firebase.database().ref("Salas/" + loadedChat.id + "/mensajes").push({
                    sender: encrypt(sender, loadedChat.id, "R"),
                    time: Date.now(),
                    texto: encrypt(mensaje, loadedChat.id, "R")
                });
            } else if (loadedChat.tipo == "Contacto") {
                if (firstTime) {
                    firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid).set({
                        nombre: username,
                        name: encrypt(localStorage.getItem('nombre'), code, "A"),
                        tipo: "Contacto"
                    })
                    firstTime = false;
                }
                firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid + "/mensajes/").push({
                    sender: sender,
                    time: Date.now(),
                    texto: encrypt(mensaje, loadedChat.id, "R")
                }).then(() => {
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + loadedChat.id + "/mensajes/").push({
                        sender: sender,
                        time: Date.now(),
                        texto: encrypt(mensaje, loadedChat.id, "R")
                    })
                });
                firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid).update({
                    leido: false
                })
            }
        } mensajeInput.value = "";
    } else {
        Toast.fire({ title: "Comando invalido, revisalo bien", icon: 'warning' })
        mensajeInput.value = mensajeInput.value.slice(0, -1);
    }
    mensajeInput.focus();

}

function timeStamp(time: number): string {
    let date = new Date(time);
    let M = date.getMonth() + 1;
    let m: string;
    if (date.getMinutes() < 10) {
        m = "0" + date.getMinutes();
    } else {
        m = date.getMinutes().toString()
    }
    return date.getDate() + '/' + M + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + m;
}

function Scroll() {
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
}

ipcRenderer.on('addContact', (e, values) => {
    firebase.database().ref("Usuarios/" + uid + "/contactos").push({
        id: values.id,
        nombre: encrypt(values.name, code, "A"),
        username: values.user
    }).then(() => {
        contactSelector.innerHTML += '<option value="' + values.id + '">' + values.user + ' / ' + values.name + '</option>'
    })
    ContRooms.push(values.id);
    localStorage.setItem('ContRoomS', ContRooms.toString())
})

searchContact_btn.addEventListener('click', () => {
    contactSelectorD.classList.toggle('visible');
})


async function JoinPrivate() {
    const { value: id } = await Swal.fire({
        title: "Entrar a sala privada",
        input: 'text',
        background: "var(--back-Color)",
        inputPlaceholder: 'Código de acceso',
        imageUrl: '../icons/GuyFawkesIcon.png',
        imageWidth: 150,
        imageHeight: 167,
        imageAlt: 'Guy Fawkes',
        showCloseButton: true,
        confirmButtonColor: 'var(--primary)',
        confirmButtonText: 'Entrar <i class="mdi mdi-lock-open-variant"></i>'
    })
    if (id) {
        let canJoin: boolean;
        let nombre: string;
        firebase.database().ref("Salas").once("value").then((snapshot) => {
            snapshot.forEach((element) => {
                let data = element.val();
                nombre = data.nombre
                if (element.key == id && data.private) {
                    canJoin = true;
                    firebase.database().ref("Salas/" + id + "/miembros").push({
                        uid
                    }).then(() => {
                        firebase.database().ref("Usuarios/" + uid + "/chats/" + id).set({
                            nombre: nombre,
                            tipo: "Sala"
                        })
                    })
                }
            });
        }).finally(() => {
            if (!canJoin) {
                Toast.fire({ title: "Ninguna sala privada usa ese código", icon: 'warning' })
            } else {
                showChat(nombre, id, "Sala", "");
                let index = chatsNames.length - 1;
                document.getElementById('chat_' + index).click();
            }
        })
    }
}

const saludos = ["Hola, ¿qué tal has estado?", "Hola $N, ¿Cómo has estado?", "Hola $N ¿qué tal estás?"]

function Command(mensaje: string): string {
    let type: string = mensaje.split("~")[1];
    let extra: string = "";
    let newmessage: string;
    if (type.includes("_")) {
        let splited = type.split("_");
        type = splited[0];
        extra = splited[1];
        if (extra.includes("\n")) {
            extra.replace("\n", "")
        }
    } else {
        type = type.replace(/(\r\n|\n|\r)/gm, "")
        type = type.split(" ")[0]

    }
    let message: string;
    switch (type) {
        default:
            message = "$invalid_"
            break;
        case "holi":
            let index = Math.floor(Math.random() * saludos.length);
            let saludo = saludos[index]
            if (saludo.includes("$N")) {
                saludo = saludo.replace("$N", loadedChat.nombre)
            }
            message = saludo
            break;
        case "suavemente":
            message = 'suavemente besame, que quiero sentir tus labios besandome otra vez, ¡Suavemente!'
            break;
        case "abrazo":
        case "abaxo":
            message = "Te mando un abrazote gigante y muy muy fuerte"
            break;
        case "gatita":
            message = "🐱🍼"
            break;
        case "pandita":
            message = "for(🐼){💜++}"
            break;
        case "tflag":
            message = "🏳️‍⚧️"
            break;
    }
    newmessage = mensaje.replace("~" + type, message)
    return newmessage
}

contactSelectorD.addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
})

function showContact(name, id, Rname) {
    let values = contactSelector.value.split("|");
    if (!chating.includes(id)) {
        chating.push(id)
        showChat(name, id, "Contacto", Rname)
        let index = chatsNames.length - 1;
        document.getElementById('chat_' + index).click();
        firebase.database().ref("Usuarios/" + uid + "/chats/" + id).set({
            nombre: name,
            name: encrypt(Rname, code, "A"),
            tipo: "Contacto"
        })
    } else {
        document.getElementById('chat_' + chatsNames.indexOf(name)).click();
    }
}