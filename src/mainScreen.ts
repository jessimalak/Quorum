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
let username: string;

const settings_btn = document.getElementById('settings_btn');
const content = document.getElementById('chatPanel');

function updateS() {
    ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando contactos')

}

updateS()

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.replace('login.html')
    } else {
        ipcRenderer.send('loadingchange', 'Desencrpitando...|Importando chats')
        firebase.database().ref('Usuarios/' + uid).once('value').then(function (snapshot) {
            let user = snapshot.val();
            username = user.username;
            document.title = 'Quorum - ' + username;
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
                    miembros: {uid},
                    admins: {uid}
                }).then((e) => {
                    console.log(e);
                    firebase.database().ref("Usuarios/"+uid+"/chats/"+e.key).set({
                        nombre: name
                    })
                })
            }
        }
    })
}

function JoinRoom(id:string, name:string){
    firebase.database().ref("Salas/"+id+"miembros").push({
        uid
    }).then(()=>{
        firebase.database().ref("Usuarios/"+uid+"chats/"+id).set({
            nombre: name
        })
    })
}