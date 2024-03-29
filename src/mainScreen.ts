//@ts-ignore
const { ipcRenderer } = require('electron')
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
bar.updateTitle();

ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
let chatsData: { name: string, time: number, key: string }[] = new Array();
let contacts: { name: string, username: string, key: string }[] = new Array();

const mensajeInput = <HTMLInputElement>document.getElementById('mensaje-input');
const sendButton = document.getElementById('sender');
const voideButton = document.getElementById('voice_button');
const emojiPicker = document.getElementById('emoji_picker')

let customColors = localStorage.getItem('customColors');
const colorSelector = document.getElementById('color_button');
let color: string = "none";

let loadedChat: { id: string, tipo: string, nombre: string, username_: string, tiempo: number };

const options = <HTMLElement>document.getElementsByClassName("custom-options")[0]
let c = "'";

let dataToLoad = "";

let roomData: { admin: boolean, isPrivate: boolean }

firebase.database().ref('Usuarios/' + uid + '/chats').on('value',
    (snapshot) => {
        let id = 0;
        let chats_ = "";
        chats.innerHTML = "";
        chatsData = [];
        snapshot.forEach((element) => {
            let data = element.val();
            chatsData.push({ name: data.nombre, time: data.tiempo, key: element.key })
            let Rname = "";
            if (data.tipo == "Contacto") {
                Rname = decrypt(data.name, code[4], "A", false, false);
            }
            let notify = ""
            if (data.leido !== undefined) {
                if (!data.leido) {
                    notify = '<span id="' + element.key + '_notify" class="mdi mdi-bell-circle notify"></span>'
                }
            }
            chats_ += '<li class="contact-item" id="chat_' + id + '" onclick="OpenChat(' + c + element.key + c + ',' + c + data.tipo + c + ',' + c + id + c + ', ' + c + Rname + c + ', ' + data.tiempo + ', false)"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + data.nombre + '</p><span>' + Rname + '</span>' + notify + '</div></li>';
            id++;
        });
        chats.innerHTML = chats_;
        //@ts-ignore
        twemoji.parse(chats);
    })
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.replace('login.html')
    } else {
        let html = "";
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos');
        firebase.database().ref("Usuarios/" + uid + "/contactos").once("value").then((snapshot) => {
            snapshot.forEach((element) => {
                let data = element.val();
                let id = decrypt(data.id, code[4], "A", false, false)
                let nombre = decrypt(data.nombre, code[4], "A", false, false)
                let username = decrypt(data.username, code[4], "A", false, false)
                if (!chatsData.toString().includes(id)) {
                    contacts.push({ name: nombre, username: username, key: id })
                    html += '<div class="contact-item" onclick="showChat(' + c + username + c + ', ' + c + id + c + ', ' + c + 'Contacto' + c + ', ' + c + nombre + c + ', ' + Date.now() + ', true)"><div><p>' + nombre + '</p><span>' + username + '</span></div></div>';
                }
            });
        }).finally(() => {
            localStorage.setItem('ContRoomS', chatsData.toString())
            ipcRenderer.send('loading', false);
            document.getElementById('contacts').innerHTML += html;
        })

    }
})

//@ts-ignore
new FgEmojiPicker({
    trigger: 'i#emoji_picker',
    position: ['top', 'right'],
    emit(obj, triggerElement) {
        const emoji = obj.emoji;
        mensajeInput.value += emoji;
    }
});


//@ts-ignore
new FgStickerPicker({
    trigger: 'i#sticker_picker',
    position: ['top', 'right']
});

AvalibleCustomColors();

ipcRenderer.on('colors', (e, val) => {
    customColors = val;
    AvalibleCustomColors();
})

function openSettings() {
    ipcRenderer.send('openSettings', true);
}

ipcRenderer.on('signOut', (e) => {
    firebase.auth().signOut();
})

ipcRenderer.on('updateTheme', (e, val) => {
    UpdateTheme(val.theme);
    UpdateBackground(val.fondo)
})

function OpenSearch(type: string) {
    ipcRenderer.send('search', type);
}

function CreateRoom() {
    Swal.fire({
        title: "Crear nueva Sala",
        html: '<input class="inputText searchHeader" type="text" placeholder="Nombre" maxlength="60" name="roomName" id="roomNameInput">' +
            '<input class="inputText searchHeader" type="text" placeholder="Etiquetas (separadas por comas ( , ))" name="roomkeys" id="roomKeywordsInput">' +
            '<label><input type="checkbox" class="filled-in pink" id="privateCheck"><span style="font-size: 1.5rem;">Sala privada</span></label>',
        showCloseButton: true,
        background: 'var(--panel-color)',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'button confirm'
        },
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
                    private: isPrivate,
                    tiempo: Date.now()
                }).then((e) => {
                    id = e.key;
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + e.key).set({
                        nombre: name,
                        tipo: "Sala",
                        tiempo: Date.now()
                    }).then(() => {
                        firebase.database().ref("Salas/" + e.key + "/admins").push({
                            uid,
                            username
                        })
                        firebase.database().ref("Salas/" + e.key + "/miembros").push({
                            uid,
                            username
                        })
                    })
                })
            } else {
                CreateRoom();
            }
        }
    })
    // (<HTMLElement> document.getElementsByClassName('buttonsStyling')[0]).style.color = "var(--text)"
}

ipcRenderer.on('joinRoom', (e, values) => {
    firebase.database().ref("Salas/" + values.id + "/miembros").push({
        uid,
        username
    }).then(() => {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + values.id).set({
            nombre: values.name,
            tipo: "Sala"
        })
    })
    showChat(values.name, values.id, "Sala", "", Date.now(), false);
    localStorage.setItem('ContRoomS', chatsData.toString() + contacts.toString())
})

function showChat(name, id, tipo, Rname, tiempo, myfirst) {
    let c = "'";
    chatsData.push({ name: name, time: tiempo, key: id });
    let index = chatsData.length - 1;
    chats.innerHTML += '<li class="contact-item" id="chat_' + index + '" onclick="OpenChat(' + c + id + c + ',' + c + tipo + c + ',' + c + index + c + ',' + c + Rname + c + ',' + tiempo + ',' + myfirst + ' )"><img src="../icons/userAvatar.png" alt="perfi"><div><p>' + name + '</p><span>' + Rname + '</span></div></li>';
}

class Mensaje {
    key: string;
    sender: string;
    id: string;
    texto: string;
    color: string;
    type: string;
    data: string;
    time: string;
    class: string;
    senderlabel: string = "";
    constructor(key_, sender_, id_, time_, texto_, type_, data_, color_) {
        this.key = key_;
        this.sender = decrypt(sender_, code[4], "A", false, false);
        this.id = id_;
        this.type = type_;
        this.data = data_;
        this.time = time_;
        this.texto = decrypt(texto_, code[4], "A", false, false);
        this.color = color_;
    }
    Show() {
        if (this.id == uid) {
            this.class = "sender";
            this.senderlabel = "";
        } else {
            this.class = "reciver";
            if (loadedChat.tipo == "Sala") {
                this.senderlabel = '<span class="senderLabel">' + this.sender + '</span>'
            }
        }

        if (this.color != "none") {
            this.class = this.color + " " + this.class;
        }
        if (this.texto == "🏳️‍⚧️" || this.texto == "🏳️‍🌈" || this.texto == "🫓") {
            this.class = "big " + this.class;
        }
        let resource;
        if (this.type == "text") {
            resource = '<div id="mensaje' + this.key + '" class="mensaje ' + this.class + '">' + this.senderlabel + '<div class="mensaje-content ' + this.class + '-content"><p class="messageText">' + this.texto + '</p><p class="mensaje-time">' + this.time + '</p></div></div>'
        } else if (this.type == "img") {
            resource = '<div id="mensaje' + this.key + '" class="mensaje ' + this.class + '">' + this.senderlabel + '<div class="mensaje-content ' + this.class + '-content"><img loading="lazy" class="messageImg" src="' + this.data + '"/><p class="mensaje-time">' + this.time + '</p></div></div>'
        } else if (this.type == "sticker") {
            resource = '<div id="mensaje' + this.key + '" class="mensaje ' + this.class + '">' + this.senderlabel + '<div class="mensaje-content ' + this.class + '-content sticker-content"><img loading="lazy" class="messageSticker" src="' + this.data + '"/><p class="mensaje-time">' + this.time + '</p></div></div>'
        }
        chatContainer.innerHTML += resource;
        Scroll();
    }
}

let firstTimeOther: boolean;
let myFirstTime: boolean;

function OpenChat(id: string, tipo: string, index: number, nombre: string, tiempo: number, myfirst: boolean) {
    welcomeScreen.style.display = "none";
    chat.style.display = "flex";
    let username_ = chatsData[index].name;
    loadedChat = { id, tipo, nombre, username_, tiempo };
    myFirstTime = myfirst;
    chatContainer.innerHTML = "";
    mensajeInput.focus();
    let titleP = document.getElementById('chatName');
    let subTitleP = document.getElementById('chatSub');
    if (tipo == "Sala") {
        firebase.database().ref("Salas/" + id).once('value').then((snapshot) => {
            let data = snapshot.val()
            let admins = Object.entries(data.admins);
            let isPrivate = data.private
            let isAdmin = false;
            admins.forEach(([key, value]) => {
                //@ts-ignore
                if (value.uid == uid) {
                    isAdmin = true;
                    return false
                }
            });
            roomData = { isPrivate: isPrivate, admin: isAdmin }
        }).catch((err) => {
            Swal.fire({
                title: "Tal parece que esta sala ya no está disponible",
                icon: "error",
                text: "Vuelve a intentarlo mas tarde o elimina la sala de tu lista.",
                confirmButtonText: "Abandonar sala",
                showCloseButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref("Usuarios/" + uid + "/chats/" + id).remove().then(() => {
                        Toast.fire({ title: "Ya no haces parte de " + nombre, icon: "success" })
                        chat.style.display = "none";
                        welcomeScreen.style.display = "flex"
                    }).catch((err) => {
                        Toast.fire({ title: err, icon: "error" })
                    })
                }
            })
        })
        firebase.database().ref("Salas/" + id + "/mensajes").on("value",
            (snapshot) => {
                chatContainer.innerHTML = "";
                snapshot.forEach((element) => {
                    // let data = element.val();
                    // let senderenc = decrypt(data.sender_id, code[6], "R");
                    // let sender = Reverse(decrypt(senderenc, code[2], "B"))
                    // let url = "none";
                    // let url_enc = decrypt(data.data, id, "R");
                    // let url_dec = decrypt(url_enc, code[2], "B");
                    // if (url_dec != "none") {
                    //     url = url_dec;
                    // }
                    // let mensaje = new Mensaje(element.key, decrypt(data.sender, id, "R"), sender, timeStamp(data.time), decrypt(data.texto, Reverse(id), "R"), decrypt(data.type, id, "R"), url, decrypt(data.color, id, "R"));

                    // mensaje.Show();
                    //@ts-ignore
                    twemoji.parse(chatContainer);
                });
            });
        titleP.style.fontSize = "2rem"
        titleP.style.fontWeight = "300"
        titleP.style.lineHeight = '2rem'
    } else if (tipo == "Contacto") {
        firebase.database().ref("Usuarios/" + uid + "/chats/" + id + "/mensajes").on("value",
            (snapshot) => {
                chatContainer.innerHTML = "";
                firebase.database().ref("Usuarios/" + id + "/chats/" + uid).once('value')
                    .then((snapshot) => {
                        if (snapshot.val() == null) {
                            firstTimeOther = true;
                        }
                    })
                snapshot.forEach((element) => {
                    let data = element.val();
                    // let decryptCode: string;
                    // let senderenc = decrypt(data.sender_id, code[6], "R");
                    // let sender = Reverse(decrypt(senderenc, code[2], "B"))
                    // if (sender == uid) {
                    //     decryptCode = id
                    // } else {
                    //     decryptCode = uid;
                    // }

                    // let url = "";
                    // let url_enc = decrypt(data.data, decryptCode, "R");
                    // let url_dec = decrypt(url_enc, code[2], "B");
                    // if (url_dec != "none") {
                    //     url = url_dec;
                    // }
                    // let mensaje = new Mensaje(element.key, decrypt(data.sender, code[2], "R"), sender, timeStamp(data.time), decrypt(data.texto, Reverse(decryptCode), "R"), decrypt(data.type, decryptCode, "R"), url, decrypt(data.color, decryptCode, "R"))
                    // mensaje.Show();
                    // //@ts-ignore
                    // twemoji.parse(chatContainer);

                    firebase.database().ref("Usuarios/" + uid + "/chats/" + id).update({
                        leido: true
                    })
                });
            })
        titleP.style.fontSize = "1rem"
        titleP.style.fontWeight = "500"
        titleP.style.lineHeight = '1rem'
    }
    titleP.innerText = chatsData[index].name;
    subTitleP.innerText = nombre;

}

let focusInput: boolean;
mensajeInput.addEventListener('focusin', (e) => {
    focusInput = true;
})
mensajeInput.addEventListener('focusout', (e) => {
    focusInput = false;
})

mensajeInput.addEventListener('keyup', (k) => {
    if (focusInput) {
        if (k.key == "Enter" && !k.shiftKey) {
            SendMessage("text");
        }
    }
})

mensajeInput.addEventListener('input', () => {
    if (mensajeInput.value.trim() == "") {
        sendButton.style.display = "none";
        voideButton.style.display = "block";
    } else {
        sendButton.style.display = "block"
        voideButton.style.display = "none";
    }
})



function SendMessage(type_: string, sticker?: string) {
    let preMessage = "";
    let data_ = "none";
    if (type_ == "text") {
        preMessage = mensajeInput.value.trim();
        if (preMessage.includes("~")) {
            preMessage = Command(preMessage);
        }
        resetInput();
    } else if (type_ == "img") {
        preMessage = mensajeInput.value.trim();
        if (preMessage.includes("~")) {
            preMessage = Command(preMessage);
        }
        //SUBIR ARCHIVO...
    } else if (type_ == "sticker") {
        data_ = sticker;
        preMessage = "Sticker";
    }

    // let mensaje = encrypt(preMessage, code[4], "A");
    // let sender = encrypt(username, code[4], "A");
    // let id_ = encrypt(Reverse(uid), code[2], "B");
    // data_ = encrypt(data_, code[2], "B");
    if (preMessage.trim() !== "") {
        // if (loadedChat.tipo == "Sala") {
        //     firebase.database().ref("Salas/" + loadedChat.id + "/mensajes").push({
        //         sender: encrypt(sender, loadedChat.id, "R"),
        //         sender_id: encrypt(id_, code[6], "R"),
        //         time: Date.now(),
        //         texto: encrypt(mensaje, Reverse(loadedChat.id), "R"),
        //         data: encrypt(data_, loadedChat.id, "R"),
        //         type: encrypt(type_, loadedChat.id, "R"),
        //         color: encrypt(color, loadedChat.id, "R")
        //     });
        // } else if (loadedChat.tipo == "Contacto") {
        //     if (firstTimeOther) {
        //         firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid).set({
        //             nombre: username,
        //             name: encrypt(localStorage.getItem('nombre'), code[4], "A"),
        //             tipo: "Contacto",
        //             tiempo: Date.now()
        //         })
        //         firstTimeOther = false;
        //     }
        //     if (myFirstTime) {
        //         firebase.database().ref("Usuarios/" + uid + "/chats/" + loadedChat.id).update({
        //             name: encrypt(loadedChat.nombre, code[4], "A"),
        //             nombre: loadedChat.username_,
        //             tiempo: loadedChat.tiempo,
        //             tipo: loadedChat.tipo
        //         }).then(() => {
        //             myFirstTime = false;
        //         })
        //     }
        //     firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid + "/mensajes/").push({
        //         sender: encrypt(sender, code[2], "R"),
        //         sender_id: encrypt(id_, code[6], "R"),
        //         time: Date.now(),
        //         texto: encrypt(mensaje, Reverse(loadedChat.id), "R"),
        //         data: encrypt(data_, loadedChat.id, "R"),
        //         type: encrypt(type_, loadedChat.id, "R"),
        //         color: encrypt(color, loadedChat.id, "R")
        //     }).then(() => {
        //         firebase.database().ref("Usuarios/" + uid + "/chats/" + loadedChat.id + "/mensajes/").push({
        //             sender: encrypt(sender, code[2], "R"),
        //             sender_id: encrypt(id_, code[6], "R"),
        //             time: Date.now(),
        //             texto: encrypt(mensaje, Reverse(loadedChat.id), "R"),
        //             data: encrypt(data_, loadedChat.id, "R"),
        //             type: encrypt(type_, loadedChat.id, "R"),
        //             color: encrypt(color, loadedChat.id, "R")
        //         })
        //     });
        //     firebase.database().ref("Usuarios/" + loadedChat.id + "/chats/" + uid).update({
        //         leido: false
        //     })
        // }
    }
    mensajeInput.focus();

}

function resetInput() {
    mensajeInput.value = "";
    sendButton.style.display = "none";
    voideButton.style.display = "block";
}

function timeStamp(time: number): string {
    let today = new Date(Date.now());
    let today_day = today.getDate();
    let today_month = today.getMonth() + 1;

    let date = new Date(time);
    let d = date.getDate();
    let M = date.getMonth() + 1;
    let m: string;
    if (date.getMinutes() < 10) {
        m = "0" + date.getMinutes();
    } else {
        m = date.getMinutes().toString()
    }

    if (today_day == d && today_month == M) {
        return "Hoy " + date.getHours() + ":" + m
    } else if (today_day == d + 1 && today_month == M) {
        return "Ayer " + date.getHours() + ":" + m
    } else {
        return d + '/' + M + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + m;
    }
}

function Scroll() {
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
}

ipcRenderer.on('addContact', (e, values) => {
    // firebase.database().ref("Usuarios/" + uid + "/contactos").push({
    //     id: encrypt(values.id, code[4], "A"),
    //     nombre: encrypt(values.name, code[4], "A"),
    //     username: encrypt(values.user, code[4], "A")
    // }).then(() => {
    //     contacts.push({ name: values.name, username: values.user, key: values.id });
    //     // options.innerHTML += '<div class="custom-option" onclick="showContact(' + c + values.user + c + ', ' + c + values.id + c + ', ' + c + values.name + c + ')"><p>' + values.user + ' </p><span> ' + values.name + '</span></div>'
    // })

    localStorage.setItem('ContRoomS', contacts.toString() + chatsData.toString())
})

async function JoinPrivate() {
    const { value: id } = await Swal.fire({
        title: "Entrar a sala privada",
        input: 'text',
        inputPlaceholder: 'Código de acceso',
        imageUrl: '../icons/GuyFawkesIcon.png',
        imageWidth: 150,
        imageHeight: 167,
        imageAlt: 'Guy Fawkes',
        showCloseButton: true,
        confirmButtonText: 'Entrar <i class="mdi mdi-lock-open-variant"></i>',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'button confirm'
        }
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
                        uid,
                        username
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
                showChat(nombre, id, "Sala", "", Date.now(), false);
                let index = chatsData.length - 1;
                document.getElementById('chat_' + index).click();
            }
        })
    }
}

const saludos = ["Hola, ¿qué tal has estado?", "Hola $N, ¿Cómo has estado?", "Hola $N ¿qué tal estás?"]
const philos = ["Solo sé que nada sé, aunque sé mas que los que aún no lo saben", "La peor lucha es la que no se hace", "Frecuentemente hay más que aprender de las preguntas inesperadas de un niño que de los discursos de un hombre", "Vivir sin filosofar es, propiamente, tener los ojos cerrados, sin tratar de abrirlos jamás", "Quien sabe de dolor, todo lo sabe", "La religión es excelente para mantener callada a la gente común", "Quienes creen que el dinero lo hace todo terminan haciendo todo por dinero", "La felicidad no brota de la razón sino de la imaginación", "Si un individuo es pasivo intelectualmente, no conseguirá ser libre moralmente"]

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
            message = "~" + type;
            break;
        case "holi":
            let indexS = Math.floor(Math.random() * saludos.length);
            let saludo = saludos[indexS]
            if (saludo.includes("$N")) {
                saludo = saludo.replace("$N", loadedChat.nombre)
            }
            message = saludo
            break;
        case "filosofar":
            let indexF = Math.floor(Math.random() * philos.length);
            message = philos[indexF]
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
            message = "for( 🐼 ){\n \t💜++\n}"
            break;
        case "tflag":
            message = "🏳️‍⚧️"
            break;
        case "pflag":
            message = "🏳️‍🌈"
            break;
        case "arepita":
            message = "🫓"
            break;
        case "hechizo":
            message = "si fue hechizo o no fue hechizo,\n" +
                "eso no me importa ya, pues mis ojos son sus ojos,\n" +
                "y mi ser solo su ser."
            break;
    }
    newmessage = mensaje.replace("~" + type, message)
    return newmessage
}


function showContact(name, id, Rname) {
    if (!chatsData.toString().includes(id)) {
        showChat(name, id, "Contacto", Rname, Date.now(), true)
        let index = chatsData.length - 1;
        document.getElementById('chat_' + index).click();
        firebase.database().ref("Usuarios/" + uid + "/chats/" + id).set({
            nombre: name,
            // name: encrypt(Rname, code[4], "A"),
            tipo: "Contacto",
            tiempo: Date.now()
        })
    } else {
        document.getElementById('chat_' + chatsData.indexOf(name)).click();
    }
}


function ShowInfo(id: string, tipo: string) {
    if (id == "0") {
        id = loadedChat.id;
        tipo = loadedChat.tipo
    }
    const usuario = document.getElementById('modal-contacto')
    const sala = document.getElementById('modal-sala')
    const title = document.getElementById('modal-title');
    if (tipo == "Sala") {
        usuario.style.display = 'none'
        sala.style.display = 'block'
        const etiquetas = document.getElementById('modal-etiquetas')
        const miembros = document.getElementById('modal-members')
        const input = <HTMLInputElement>document.getElementById('private_key');
        const keyContainer = document.getElementById('key-container')
        const leave_btn = document.getElementById('modal-leave')
        const delete_btn = document.getElementById('modal-delete')
        const members_select = document.getElementById('room-members-select')
        const admins_select = document.getElementById('room-admins-select')
        const selectors = document.getElementById('modal-room-selectors')
        firebase.database().ref("Salas/" + id).once('value').then((snap) => {
            let data = snap.val();
            title.innerText = data.nombre;
            let etiquetas_ = data.keywords
            let chips = "";
            etiquetas_.split(',').forEach((element) => {
                chips += '<p class="chip">' + element + '</p>'
            });
            etiquetas.innerHTML = chips;
            leave_btn.style.display = 'inline-block'
            if (roomData.admin) {
                let miembros_ = data.miembros;
                let admins_ = data.admins
                members_select.innerHTML = '<div class="collection-header"><p>' + Object.keys(miembros_).length + ' miembros</p></div>'
                admins_select.innerHTML = '<div class="collection-header"><p>' + Object.keys(admins_).length + ' admins</p></div>'
                delete_btn.style.display = 'inline-block'
                selectors.style.display = 'block'
                let miembros = Object.entries(miembros_)
                miembros.forEach((element) => {
                    //@ts-ignore
                    members_select.innerHTML += '<a href="#!" onclick="editUser(' + c + element[1].uid + c + ', ' + c + element[1].username + c + ')" class="collection-item">' + element[1].username + '</a>'
                });
                let admins = Object.entries(admins_);
                admins.forEach((element) => {
                    //@ts-ignore
                    admins_select.innerHTML += '<a href="#!" onclick="editUser(' + c + element[1].uid + c + ', ' + c + element[1].username + c + ')" class="collection-item">' + element[1].username + '</a>'
                })
                if (roomData.isPrivate) {
                    keyContainer.style.display = 'block'
                    input.value = id
                } else {
                    keyContainer.style.display = 'none'
                }
                if (Object.keys(admins_).length == 1) {
                    leave_btn.style.display = 'none';
                }
            } else {
                selectors.style.display = 'none'
                delete_btn.style.display = 'none'
                keyContainer.style.display = 'none'
                input.value = ""
            }
            let tiempo = new Date(data.tiempo)
            document.getElementById('modal-date').innerText = 'Creación: ' + tiempo.getDate() + '/' + (tiempo.getMonth() + 1) + '/' + tiempo.getFullYear();
        })
    } else {
        sala.style.display = 'none'
        usuario.style.display = 'block'
        firebase.database().ref("Usuarios/" + id).once('value').then((snap) => {
            let data = snap.val()
            title.innerText = data.username
            if (data.verified) {
                title.innerHTML += '<span class="mdi mdi-check verifyIcon" style="color: var(--accent)"><span>'
            } else {
                title.innerHTML += '<span class="mdi mdi-close verifyIcon" style="color: var(--primary)"><i class="tooltip">Usuario no verificado</i><span>'
            }
            // document.getElementById('modal-name').innerText = decrypt(data.nombre, code[4], "B");
            document.getElementById('modal-estado').innerText = data.estado;
        })
    }
    document.getElementById('modal-time').innerText = CalcTime(loadedChat.tiempo)
    Modal('modal-info', 'modal-content', true)
}

function CopyKey() {
    let input = <HTMLInputElement>document.getElementById('private_key');
    input.select();
    document.execCommand('copy')
    Toast.fire({ title: "clave copiada", icon: 'success' })
}

function Modal(back: string, window: string, show: boolean) {
    document.getElementById(window).classList.toggle('visible')
    if (show) {
        document.getElementById(back).style.display = 'flex';
        document.getElementById(window).style.display = 'block';
    } else {
        setTimeout(() => {
            document.getElementById(back).style.display = 'none'
            document.getElementById(window).style.display = 'none';
        }, 200);
    }
}

function CalcTime(fecha): string {
    let oldDate = new Date(fecha);
    let now = new Date(Date.now())
    let diference = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate())) / (1000 * 60 * 60 * 24));
    return diference + " días conversando"
}

function editUser(id: string, username: string) {
    Swal.fire({
        title: username,
        text: '¿Qué vas a hacer con éste usuario?',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Hacer admin',
        background: 'var(--panel-color)',
        showCloseButton: true,
        showCancelButton: true
    }).then((value) => {
        if (value.isConfirmed) {
            console.log("eliminado");
        } else if (value.isDismissed) {
            console.log("admin");
        }
    })
}

document.getElementById('modal-clear').addEventListener('click', async () => {
    const { values: time } = await Swal.fire({
        title: 'Eliminar mensajes',
        showCloseButton: true,
        input: 'radio',
        inputOptions: {
            'ahora': 'Ahora',
            '1': 'Diariamente',
            '14': 'Cada 2 semanas',
            '30': 'Cada mes'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Selecciona una opción'
            }
        }
    })

    if (time !== 'ahora') {
        console.log(time)
    } else {
        firebase.database().ref('Usuarios/' + uid + "/chats/" + loadedChat.id).update({
            mensajes: null
        })
    }
})

function showContacts() {
    let html = "<div><p>Ya estás conversando con todos tus contactos</p></div>"
    const c = "Contacto";
    if (contacts.length > 0) {
        let conthtml = "";
        contacts.forEach((elem) => {
            conthtml += "<div class='contact-item' onclick='showChat(" + elem.username + ", " + elem.key + ", " + c + ", " + elem.name + ", " + Date.now() + ")'><div><p>" + elem.name + "</p><p>" + elem.username + "</p></div></div>"
        })
        html = conthtml;
    }
    document.getElementById('modal-contacts').classList.add('visible')
    // Swal.fire({
    //     title: "Contactos",
    //     html: html,
    //     showCloseButton: true,
    //     background: 'var(--panel-color)',

    // })
}

function AvalibleCustomColors() {
    console.log(customColors);
    if (customColors == "true") {
        colorSelector.style.display = "block";
    } else {
        colorSelector.style.display = "none";
    }
}

colorSelector.addEventListener('click', () => {
    let panel = document.getElementById('selectores');
    if (panel.style.display != "block") {
        panel.style.display = "block";
    } else {
        panel.style.display = "none";
    }
})

function changeColor(new_color: string) {
    if(color != "none"){
        document.getElementById(color + '-button').classList.remove('selected');
    }if (new_color != color) {
        document.getElementById(new_color + '-button').classList.add('selected');
        colorSelector.classList.remove(color);
        colorSelector.classList.add(new_color)
        color = new_color;
    } else {
        colorSelector.classList.remove(color);
        color = "none";
    }
    document.getElementById('selectores').style.display = "none"
}