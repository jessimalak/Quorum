const searchType = localStorage.getItem('searchType');
if (searchType == "Salas") {
    let count = 0;
    firebase.database().ref("Salas").once("value").then((snapshot) => {
        snapshot.forEach((element) => {
            let data = element.val();
            let sala = new Room(element.key, data.nombre, data.miembros.isPrototypeOf.length);
            sala.Show();
            if (count == 5) {
                return true;
            }
            count++;
        });
    });
}
console.log(searchType);
const inputSearch = document.getElementById('SearchInput');
const resultDiv = document.getElementById('resultados');
const progressbar = document.getElementsByClassName('progress')[0];
class User {
    constructor(user_name, name_, estado_, id_) {
        this.username = user_name;
        this.name = name_;
        this.estado = estado_;
        this.id = id_;
    }
    Show() {
        let structure = '<div class="userCard"><img src="../icons/userAvatar.png" loading="lazy" alt="imagen de perfil"><div><p>@' + this.username + '</p><p>' + this.name + '</p><i>' + this.estado + '</i></div><button class="button" onclick="AddContact(' + this.id + ')"><span class="mdi mdi-plus"></span></button></div>';
        resultDiv.innerHTML += structure;
    }
}
class Room {
    constructor(id_, title_, miembros_) {
        this.id = id_;
        this.title = title_;
        this.miembros = miembros_;
    }
    Show() {
        let structure = '<div class="userCard"><img src="../icons/userAvatar.png" loading="lazy" alt="imagen de perfil"><div><p>' + this.title + '</p><i>' + this.miembros + ' miembros</i></div><button class="button" onclick="JoinRoom(' + this.id + ',' + this.title + ')"><span class="mdi mdi-plus"></span></button></div>';
        resultDiv.innerHTML += structure;
    }
}
inputSearch.addEventListener('keyup', (k) => {
    if (k.keyCode == 13) {
        Search();
    }
});
function Search() {
    progressbar.style.display = "block";
    let searchValue = inputSearch.value;
    let result;
    if (searchValue == "") {
        Toast.fire({ title: "No hay nada para buscar", icon: "error" });
    }
    else {
        resultDiv.innerHTML = "";
        if (searchType == "Usuarios") {
            firebase.database().ref("Usuarios").orderByChild("username").equalTo(searchValue).once("value")
                .then((snapshot) => {
                snapshot.forEach((element) => {
                    let data = element.val();
                    let username = data.username;
                    let nombre = CryptoJS.AES.decrypt(data.nombre, code);
                    if (username !== localStorage.getItem('username')) {
                        result = true;
                        let user = new User(data.username, nombre.toString(CryptoJS.enc.Utf8), data.estado, element.key);
                        user.Show();
                    }
                });
            }).finally(() => {
                if (!result) {
                    resultDiv.innerHTML = '<p>No hay resultados</p>';
                }
                progressbar.style.display = "none";
            });
        }
        else if (searchType == "Salas") {
        }
    }
}
//# sourceMappingURL=search.js.map