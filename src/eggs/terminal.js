const input = document.getElementById('command-text');
const line = document.getElementById('line');
const olds = document.getElementById('old-commands');
const _name = 'Quorum@' + localStorage.getItem('username') + '-Desktop:~$ ';
const uid_ = localStorage.getItem('uid');
line.innerText = _name;
input.focus();
let none = "";
document.addEventListener('click', () => {
    input.focus();
});
let decoding = false;
let encoding = false;
document.addEventListener('keyup', (k) => {
    if (k.keyCode == 13) {
        olds.style.display = 'flex';
        let command = input.innerText.trim();
        console.log(command.trim());
        input.innerText = "";
        olds.innerHTML += '<div><span id="line">' + _name + '</span><span>' + command + '</span></div>';
        if (!decoding && !encoding) {
            switch (command.replace(" ", "")) {
                case none:
                    olds.innerHTML += '<span></span>';
                    break;
                case "myusername":
                    firebase.database().ref("Usuarios/" + uid_ + "/username").once("value").then((snap) => {
                        olds.innerHTML += '<span>' + snap.val() + '</span>';
                    });
                    break;
                case "myname":
                    firebase.database().ref("Usuarios/" + uid_ + "/nombre").once("value").then((snap) => {
                        olds.innerHTML += '<span>' + snap.val() + '</span>';
                    });
                    break;
                case "mymail":
                    firebase.database().ref("Usuarios/" + uid_ + "/mail").once("value").then((snap) => {
                        olds.innerHTML += '<span>' + snap.val() + '</span>';
                    });
                    break;
                case "-v":
                case "version":
                    olds.innerHTML += '<span>Quorum 0.5.0 <i>alpha</i></span>';
                    break;
                case "decrypt":
                case "decryptdata":
                    olds.innerHTML += '<span class="error">PERMISO DENEGADO</span><br>' +
                        '<span>Necesitas permisos de administrador para acceder</span>';
                    break;
                case "sudodecrypt":
                case "sudodecryptdata":
                    olds.innerHTML += '<span>¿Enserio creiste que podrías hacerlo?</span><br>' +
                        '<span class="credits">Directed By</span><br>' +
                        '<span class="credits">ROBERT B. WEIDE</span><br>';
                    break;
                case "developer":
                case "-dev":
                    olds.innerHTML += '<span class="error credits">HOLI, SOY JESSICA MALAK</span><br>' +
                        '<span class="credits">Una sola chica con mucho tiempo libre y que con el apoyo de su novia decidió hacer ésta app.</span>' +
                        '<span class="credits">Fue una gran ayuda para sobrellevar el estrés por el encierro por la pandemia, tuve algo para concentrarme y enfocar mi mente, mi objetivo inicial solo era hacer un ejercicio para aprender un nuevo lenguaje de programación y ahora pos tienes la app por ende creció mas allá de mi idea inicial.</span>' +
                        '<span class="credits">Sin mi novia Sofi no habría llegado tan lejos, ella ha sido mi apoyo en éstos momentos dificiles</span>';
                    break;
                case "love":
                case "miamor":
                case "<3":
                case "for":
                    olds.innerHTML += '<span class="error credits">PARA MI PRINCESA 💜</span>' +
                        '<span class="credits">Nunca me cansaré de decirte lo importante que eres para mi, llegaste cuando ya me resignaba a estar sola y te adueñaste de mi corazón.' +
                        'Me hiciste sentir querida nuevamente, lograste que fuera mas feliz, me has acompañado en momentos maravillosos y también en los malos con mucha paciencia y esa ternura tan tuya.</span>' +
                        '<span class="credits">No tengo ni idea de cuando leeras ésto (si eres alguién mas...holi) y espero de verdad que logres hacerlo. Hoy es 18 de Julio de 2020 y puedo decir que mas segura que nunca ' +
                        'QUIERO CASARME CONTIGO, sabes que no espero al momento en que estemos juntas dandonos ese beso tan especial y poder despedir el día viendo a tus ojos cerrarse al irnos a dormir, ' +
                        'comenzar la mañana con tu melena despeinada sobre mi mientras me das ese maravilloso beso de buenos días. <i class="error">Te amo, gatita</i></span><br>' +
                        '<span class="credits">Aunque la sombra intente ocultar nuestro camino hayaré la forma de darte luz para sigamos transitando tomadas de la mano todo lo que nos falta por recorrer.</span>' +
                        '<span class="credits">Mientras exista fuerza en mi sostendré tu mano como lo hago ahora y no te soltaré, yo seré tu compañía y te pido que seas la mia, hoy ante nuestros cercanos proclamo lo que siento por ti ' +
                        ', lo gritaré al universo, proclamo mi amor ante todos los dioses, animales y todos los seres de la existencia, lo hago con nerviosismo pero con la misma seguridad que aquella primera vez que te dije ' +
                        'me gustas y con la misma seguridad con que te pedí que fueras mi esposa.</span><span class="credits"><i>primer borrador de mis votos matrimoniales</i></span>';
                    break;
                case "nicedecrypt":
                    olds.innerHTML += '<span class="error">OK</span>';
                    decoding = true;
                    break;
                case "niceencode":
                    olds.innerHTML += '<span class="error">OK</span>';
                    encoding = true;
                    break;
                default:
                    olds.innerHTML += '<span>Comando no encontrado</span>';
                    break;
            }
        }
        else {
            let type;
            if (command == "leave") {
                olds.innerHTML += '<span class="error">OK</span>';
                decoding = false;
                encoding = false;
            }
            else {
                type = command.split("~")[1];
                if (decoding) {
                    olds.innerHTML += '<span>' + decrypt(command.split("~")[0], code, type) + '</span>';
                }
                else {
                    olds.innerHTML += '<span>' + encrypt(command.split("~")[0], code, type) + '</span>';
                }
            }
        }
    }
});
//# sourceMappingURL=terminal.js.map