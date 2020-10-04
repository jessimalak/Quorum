//@ts-ignore
const { ipcRenderer } = require('electron');

let searchType = "Usuarios"

const inputSearch = <HTMLInputElement>document.getElementById('SearchInput');
const resultDiv = document.getElementById('resultados');
const progressbar = <HTMLInputElement>document.getElementsByClassName('progress')[0];

let adds = localStorage.getItem('ContRoomS');
// adds = JSON.parse()


progressbar.style.display = "block";
resultDiv.innerHTML += '<p style="margin: 0 1rem">Sala aleatorias</p>'
let count: number = 0;
firebase.database().ref("Salas").once("value").then((snapshot) => {
    let rooms = []
    console.log(Object.keys(snapshot.val()).length)
    snapshot.forEach(element => {
        let data = element.val()
        let room = {key: element.key, nombre: data.nombre, miembros: data.miembros, keywords: data.keywords, private: data.private }
        rooms.push(room)
    });
    for (count; count < 5; count++) {
        let index = Math.floor(Math.random() * (rooms.length - 1))
        console.log(index)
        let data = rooms[index];
        console.log(rooms.length)
        if (!data.private) {
            let sala = new Room(data.key, data.nombre, Object.keys(data.miembros).length, data.keywords, adds.includes(data.key));
            sala.Show()
            if (count == 5) {
                return true;
            }
        }
    };
}).finally(() => {
    progressbar.style.display = "none";
})


class User {
    username: string;
    name: string;
    estado: string;
    id: string
    isAdded: boolean
    constructor(user_name: string, name_: string, estado_: string, id_: string) {
        this.username = user_name;
        this.name = name_;
        this.estado = estado_;
        this.id = id_
        this.isAdded = adds.includes(id_)
    }

    Show() {
        let c = "'";
        let icon;
        let dis = "";
        if (this.isAdded) {
            icon = 'mdi-check'
            dis = 'disabled'
        } else {
            icon = 'mdi-account-plus'
        }
        let structure = '<div class="userCard"><img src="../icons/userAvatar.png" loading="lazy" alt="imagen de perfil"><div><p>@' + this.username + '</p><p>' + this.name + '</p><i>' + this.estado + '</i></div><button id="' + this.id + '_btn" class="button" onclick="AddContact(' + c + this.id + c + ',' + c + this.username + c + ',' + c + this.name + c + ')" ' + dis + '><span id="' + this.id + '_span" class="mdi ' + icon + '"></span></button></div>';
        resultDiv.innerHTML += structure;
    }
}

class Room {
    id: string;
    title: string;
    miembros: number;
    categorias: string;
    chips: string = "";
    isAdded: boolean;
    constructor(id_: string, title_: string, miembros_: number, categorias_: string, isAdd: boolean) {
        this.id = id_;
        this.title = title_;
        this.miembros = miembros_;
        this.categorias = categorias_;
        this.isAdded = isAdd;
    }
    Show() {
        let c = "'";
        let icon: string;
        let dis = "";
        if (this.categorias !== "") {
            if (this.categorias.includes(",")) {
                let categories = this.categorias.split(",");
                categories.forEach((value) => {
                    this.chips += '<p class="chip">' + value + '</p>'
                })
            } else {
                this.chips = '<p class="chip">' + this.categorias + '</p>'
            }
        } else {
            this.chips = "";
        }
        if (this.isAdded) {
            icon = 'mdi-check'
            dis = "disabled"
        } else {
            icon = 'mdi-chat-plus'
        }
        let structure = '<div class="userCard z-depth-3"><img src="../icons/userAvatar.png" loading="lazy" alt="imagen de perfil"><div><p>' + this.title + '</p><i>' + this.miembros + ' miembros</i><br>' + this.chips + '</div><button class="button" id="' + this.id + '_btn" onclick="Join(' + c + this.id + c + ',' + c + this.title + c + ')" ' + dis + '><span id="' + this.id + '_span" class="mdi ' + icon + '"></span></button></div>';
        resultDiv.innerHTML += structure;
    }
}

inputSearch.addEventListener('keyup', (k) => {
    if (k.keyCode == 13) {
        Search();
    }
})

function Search() {
    progressbar.style.display = "block";
    let searchValue = inputSearch.value.toLowerCase();
    let result: boolean;
    if (searchValue == "" || searchValue.length <= 3) {
        Toast.fire({ title: "No hay nada para buscar", icon: "error" })
        progressbar.style.display = "none";
    } else {
        resultDiv.innerHTML = "";
        if (searchType == "Usuarios") {
            if (searchValue.includes("@")) {
                searchValue = searchValue.replace("@", "");
            }
            firebase.database().ref("Usuarios").orderByChild("username").equalTo(searchValue.trim()).once("value")
                .then((snapshot) => {
                    snapshot.forEach((element) => {
                        let data = element.val();
                        let username = data.username;
                        let nombre = decrypt(data.nombre, code[4], "B")
                        if (username !== localStorage.getItem('username')) {
                            result = true;
                            let user = new User(data.username, nombre, data.estado, element.key);
                            user.Show();
                        }
                    });
                }).finally(() => {
                    if (!result) {
                        resultDiv.innerHTML = '<p>No hay resultados</p>';
                    }
                    progressbar.style.display = "none";
                });
        } else if (searchType == "Salas") {
            firebase.database().ref("Salas").once("value").then((snapshot) => {
                snapshot.forEach((element) => {
                    let data = element.val();
                    if (data.nombre.toLowerCase().includes(searchValue) || data.keywords.toLowerCase().includes(searchValue) && !data.private) {
                        let sala = new Room(element.key, data.nombre, Object.keys(data.miembros).length, data.keywords, adds.includes(element.key));
                        sala.Show()
                    }
                });
            }).finally(() => {
                progressbar.style.display = "none";
            })
        }
    }
}
function Join(id: string, name: string) {
    ipcRenderer.send('joinRoom', { id: id, name: name })
    let button = <HTMLButtonElement>document.getElementById(id + '_btn');
    button.disabled = true;
    let span = document.getElementById(id + "_span");
    span.classList.remove("mdi-chat-plus");
    span.classList.add("mdi-check")
}

function AddContact(id: string, user: string, name: string) {
    ipcRenderer.send('addContact', { id: id, user: user, name: name })
    let button = <HTMLButtonElement>document.getElementById(id + '_btn');
    button.disabled = true;
    let span = document.getElementById(id + "_span");
    span.classList.remove("mdi-account-plus");
    span.classList.add("mdi-check")
}

function ChangeSearch (){
    let button = document.getElementById('searchType')
    button.classList.toggle('mdi-account-plus')
    button.classList.toggle('mdi-account-multiple-plus')
    if(searchType == "Usuarios"){
        searchType = "Salas"
        inputSearch.placeholder = "Salas de chat";
    }else{
        searchType = "Usuarios"
        inputSearch.placeholder = "Buscar usuarios";
    }
}