const { ipcRenderer } = require('electron');
const uid = localStorage.getItem('uid');
let mongo;
let username = localStorage.getItem('username');
let databaseReference = firebase.database().ref("Usuarios/" + uid);
const settings_btn = document.getElementById('settings_btn');
const chat = document.getElementById('chatPanel');
const welcomeScreen = document.getElementById('welcomeMessage');
const chats = document.getElementById('chat-list');
const chatContainer = document.getElementById('chatMessages');
document.title = 'Quorum - ' + username;
let chatsNames = new Array();
function updateS() {
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos');
}
const mensajeInput = document.getElementById('mensaje-input');
let loadedChat;
updateS();
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.replace('login.html');
    }
    else {
        let chats_ = "";
        let c = "'";
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats');
        let id = 0;
        firebase.database().ref('Usuarios/' + uid + '/chats').once('value')
            .then(function (snapshot) {
            snapshot.forEach((element) => {
                let data = element.val();
                chatsNames.push(data.nombre);
                chats_ += '<li class="contact-item" onclick="OpenChat(' + c + element.key + c + ',' + c + data.tipo + c + ',' + id + ')"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + data.nombre + '</p><span>Mi hijo menor es un calenturiento, ten cuidado con él.</span></div></li>';
                id++;
            });
        }).finally(() => {
            chats.innerHTML = chats_;
            ipcRenderer.send('loading', false);
        });
    }
});
settings_btn.addEventListener('click', () => {
    ipcRenderer.send('openSettings', true);
});
ipcRenderer.on('signOut', (e) => {
    firebase.auth().signOut();
});
ipcRenderer.on('updateTheme', (e, val) => {
    UpdateTheme(val);
});
function OpenSearch(type) {
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
            let name = document.getElementById('roomNameInput').value;
            let keywords = document.getElementById('roomKeywordsInput').value;
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
                    });
                });
            }
        }
    });
}
ipcRenderer.on('joinRoom', (e, values) => {
    firebase.database().ref("Salas/" + values.id + "/miembros").push({
        uid
    }).then(() => {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + values.id).set({
            nombre: values.name
        });
    });
});
class Mensaje {
    constructor(sender_, time_, texto_) {
        this.sender = sender_;
        this.time = time_;
        this.texto = texto_;
    }
    Show() {
        if (this.sender == username) {
            this.class = "sender";
        }
        else {
            this.class = "reciver";
        }
        let resource = '<div class="mensaje ' + this.class + '"><div class="mensaje-content ' + this.class + '-content"><p class="messageText">' + this.texto + '</p><p class="mensaje-time">' + this.time + '</p></div></div>';
        chatContainer.innerHTML += resource;
        Scroll();
    }
}
function OpenChat(id, tipo, index) {
    welcomeScreen.style.display = "none";
    chat.style.display = "flex";
    loadedChat = { id, tipo };
    chatContainer.innerHTML = "";
    if (tipo == "Sala") {
        firebase.database().ref("Salas/" + id + "/mensajes").on("value", (snapshot) => {
            chatContainer.innerHTML = "";
            snapshot.forEach((element) => {
                let data = element.val();
                let mensaje = new Mensaje(data.sender, timeStamp(data.time), data.texto);
                mensaje.Show();
            });
        });
        document.getElementById('chatSub').innerText = "";
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
            });
        }
    }
}
function timeStamp(time) {
    let date = new Date(time);
    let M = date.getMonth() + 1;
    return date.getDay() + '/' + M + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
}
function Scroll() {
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}
//# sourceMappingURL=mainScreen.js.map