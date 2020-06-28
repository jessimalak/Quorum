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

let chatsNames:string[] = new Array();

function updateS() {
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos')
}

const mensajeInput = <HTMLInputElement>document.getElementById('mensaje-input');

let loadedChat: { id: string, tipo: string };

updateS()

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.replace('login.html')
    } else {
        let chats_ = "";
        let c = "'";
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
        let id = 0;
        firebase.database().ref('Usuarios/' + uid + '/chats').once('value')
            .then(function (snapshot) {
                snapshot.forEach((element) => {
                    let data = element.val();
                    chatsNames.push(data.nombre)
                    chats_ += '<li class="contact-item" onclick="OpenChat(' + c + element.key + c + ',' + c + data.tipo + c + ','+id+')"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + data.nombre + '</p><span>Mi hijo menor es un calenturiento, ten cuidado con él.</span></div></li>';
                    id++;
                });
            }).finally(() => {
                chats.innerHTML = chats_;
                ipcRenderer.send('loading', false);
            })
    }
})
// if(loadedChat)
// {databaseReference.on("value")
//         .then((snapshot)=>{
//             snapshot.forEach((element) => {
//                 let data = element.val();
//                 let mensaje = new Mensaje(data.sender, data.time, data.texto);
//                 mensaje.Show();
//             });
//         })}

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
        html: '<input class="inputText searchHeader" type="text" placeholder="Nombre" name="search" id="roomNameInput">' +
            '<input class="inputText searchHeader" type="text" placeholder="Palabras clave" name="search" id="roomKeywordsInput">',
        showCloseButton: true,
        background: 'var(--back-Color)',
        confirmButtonText: '+ Crear"'
    }).then((result) => {
        if (result.value) {
            let name = (<HTMLInputElement>document.getElementById('roomNameInput')).value;
            let keywords = (<HTMLInputElement>document.getElementById('roomKeywordsInput')).value;
            if (name !== "") {
                firebase.database().ref("Salas").push({
                    nombre: name,
                    keywords: keywords,
                    miembros: { uid },
                    admins: { uid }
                }).then((e) => {
                    console.log(e);
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + e.key).set({
                        nombre: name
                    })
                })
            }
        }
    })
}

ipcRenderer.on('joinRoom', (e, values) => {
    firebase.database().ref("Salas/" + values.id + "/miembros").push({
        uid
    }).then(() => {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + values.id).set({
            nombre: values.name
        })
    })
})

class Mensaje {
    sender: string;
    texto: string;
    time: string
    class: string
    constructor(sender_, time_, texto_) {
        this.sender = sender_;
        this.time = time_;
        this.texto = texto_;
    }
    Show() {
        if (this.sender == username) {
            this.class = "sender";
        } else {
            this.class = "reciver";
        }
        let resource = '<div class="mensaje ' + this.class + '"><div class="mensaje-content ' + this.class + '-content"><p class="messageText">' + this.texto + '</p><p class="mensaje-time">' + this.time + '</p></div></div>'
        chatContainer.innerHTML += resource;
        Scroll();
    }
}

function OpenChat(id: string, tipo: string, index:number) {
    welcomeScreen.style.display = "none";
    chat.style.display = "flex";
    loadedChat = { id, tipo };
    chatContainer.innerHTML = "";
    if (tipo == "Sala") {
        firebase.database().ref("Salas/" + id + "/mensajes").on("value",
            (snapshot) => {
                chatContainer.innerHTML = "";
                snapshot.forEach((element) => {
                    let data = element.val();
                    let mensaje = new Mensaje(data.sender, timeStamp(data.time), data.texto);
                    mensaje.Show();
                });
            });
            document.getElementById('chatSub').innerText = ""
    }
    document.getElementById('chatName').innerText = chatsNames[index];
}


function SendMessage() {
    let mensaje = mensajeInput.value;
    if (mensaje !== "") {
        if (loadedChat.tipo == "Sala") {
            firebase.database().ref("Salas/" + loadedChat.id + "/mensajes").push({
                sender: username,
                time: Date.now(),
                texto: mensaje
            })
        }
    }
}

function timeStamp(time: number): string {
    let date = new Date(time);
    let M = date.getMonth() + 1;
    return date.getDay() + '/' + M + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
}

function Scroll() {
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
}