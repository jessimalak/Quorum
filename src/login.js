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
const sweetalert2_1 = require("sweetalert2");
const ipcRenderer = require('electron').ipcRender;
const login_screen = document.getElementById('login');
const login_btn = document.getElementById('login_btn');
const sendCode_btn = document.getElementById('sendCode_button');
const country_select = document.getElementById('code_select');
const phone_input = document.getElementById('phone_input');
const login_mail = document.getElementById('mail_input');
const login_pass = document.getElementById('password_input');
const toRegister = document.getElementById('noCount');
const register_screen = document.getElementById('register');
const register_btn = document.getElementById('register_btn');
const register_user = document.getElementById('R_user');
const register_name = document.getElementById('R_name');
const register_mail = document.getElementById('R_mail');
const register_pass1 = document.getElementById('R_password1');
const register_pass2 = document.getElementById('R_password2');
const main_screen = document.getElementById('main');
const sendReset_btn = document.getElementById('sendResetButton');
const toLogin = document.getElementById('withCount');
let loaded;
const mainScreen = 'mainScreen.html';
toRegister.addEventListener('click', () => {
    login_screen.style.display = "none";
    register_screen.style.display = "flex";
});
toLogin.addEventListener('click', () => {
    login_screen.style.display = "flex";
    register_screen.style.display = "none";
});
let eventType;
function isValidMail(mail) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}
login_btn.addEventListener('click', () => {
    let mail = login_mail.value;
    let password = login_pass.value;
    loaded = true;
    if (mail == "" || password == "") {
        Toast.fire({ title: 'Debes llenar todos los campos', icon: 'error' });
    }
    else if (!isValidMail(mail)) {
        login_mail.select();
        Toast.fire({ icon: 'error', title: "Escribe un correo que sirva" });
    }
    else {
        firebase.auth().signInWithEmailAndPassword(mail, password).then(() => {
            localStorage.setItem("mail", mail);
            eventType = 'login';
            ipcRenderer.send('loading', true);
            ipcRenderer.send('loadingchange', 'Desencripando...|Obteniendo información de perfil');
        }).catch((err) => {
            switch (err.code) {
                case "auth/user-disabled":
                    sweetalert2_1.default.fire({ title: "Cuenta deshabilitada", text: "Ya no puedes usar mas ésta cuenta. Si crees que es un error puedes contactarnos.", icon: 'error' });
                    break;
                case "auth/user-not-found":
                    sweetalert2_1.default.fire({ title: "¿Segur@ que tienes cuenta?", text: "No encontramos ese correo en los registros. Si crees que es un error puedes contactarnos.", icon: 'error' });
                    break;
                case 'auth/wrong-password':
                    sweetalert2_1.default.fire({ title: "Esa no parece tu contraseña", text: "Tienes que escribirla bien para confirmar que eres tu.", icon: 'error' });
                    break;
                default:
                    sweetalert2_1.default.fire({ title: err.code, text: err.message, icon: 'error' });
            }
        });
    }
});
sendReset_btn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    let correo = login_mail.value;
    const { value: mail } = yield sweetalert2_1.default.fire({
        title: 'Dinos cuál fue el código que te enviamos',
        input: 'email',
        showCancelButton: true,
        inputValue: correo,
        inputValidator: (mail) => {
            if (!mail) {
                return 'Escribe tu correo para poder ayudarte';
            }
            else {
                firebase.auth().sendPasswordResetEmail(mail).then(() => {
                    sweetalert2_1.default.fire({
                        title: 'Revisa tu correo',
                        text: 'Te enviamos un link para que puedas actualizar tu contraseña.',
                        icon: 'success'
                    });
                    login_mail.value = mail;
                }).catch((err) => {
                    sweetalert2_1.default.fire({
                        title: 'Algo salió mal',
                        text: 'Vuelve a intentarlo en un rato.',
                        icon: 'error'
                    });
                });
            }
        }
    });
}));
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        let uid = user.uid;
        localStorage.setItem('uid', uid);
        if (eventType == 'login') {
            ipcRenderer.send('loading', true);
            firebase.database().ref('Usuarios/' + uid).once('value')
                .then(function (snapshot) {
                let user = snapshot.val();
                console.log(user.username);
                let mail = CryptoJS.AES.decrypt(user.mail, code);
                let nombre = CryptoJS.AES.decrypt(user.nombre, code);
                localStorage.setItem('username', user.username);
                localStorage.setItem('mail', mail.toString(CryptoJS.enc.Utf8));
                localStorage.setItem('estado', user.estado);
                localStorage.setItem('nombre', nombre.toString(CryptoJS.enc.Utf8));
                window.location.replace(mainScreen);
            });
        }
        else if (eventType == 'register') {
            ipcRenderer.send('loading', true);
            let username = register_user.value;
            let mail = register_mail.value;
            let personalname = register_name.value;
            localStorage.setItem('username', username);
            localStorage.setItem('mail', mail);
            localStorage.setItem('estado', 'Hola, soy nuev@ en Quorum');
            localStorage.setItem('nombre', personalname);
            firebase.database().ref('Usuarios/' + uid).set({
                'username': username,
                "mail": CryptoJS.AES.encrypt(mail, code).toString(),
                "id": uid,
                "estado": "Hola, soy nuev@ en Quorum",
                "nombre": CryptoJS.AES.encrypt(personalname, code).toString()
            }).then(() => {
                window.location.replace(mainScreen);
            });
        }
        else {
            window.location.replace(mainScreen);
        }
    }
    else {
        ipcRenderer.send('loading', false);
    }
});
register_user.addEventListener('focusin', () => {
    isValidUsername = false;
});
register_user.addEventListener('focusout', () => {
    let username = register_user.value.trim().toLowerCase();
    register_user.value = username;
    isValidUsername = true;
    if (username.length >= 4) {
        ValidateUsername(username).then((valid) => {
            if (!valid) {
                register_user.style.backgroundColor = '#fc4c4e';
                Toast.fire({ title: "Éste nombre de usuario ya está en uso", icon: 'error' });
            }
            else {
                register_user.style.backgroundColor = 'transparent';
            }
        });
    }
});
register_btn.addEventListener('click', () => {
    let username = register_user.value;
    let name = register_name.value;
    let mail = register_mail.value;
    let password = register_pass1.value;
    let password2 = register_pass2.value;
    loaded = true;
    eventType = 'register';
    if (username == "" || username.length <= 4) {
        register_user.select();
        Toast.fire({ icon: 'error', title: 'Escoge un nombre usuario' });
    }
    else if (!isValidUsername) {
        register_user.select();
        Toast.fire({ icon: 'error', title: 'Alguien ya tiene ese nombre' });
    }
    else if (name == "" || name.length <= 3) {
        register_user.select();
        Toast.fire({ icon: 'error', title: 'Tu nombre para que tus amigos sepan que eres tu.' });
    }
    else if (mail == "" || !isValidMail(mail)) {
        register_mail.select();
        Toast.fire({ icon: 'error', title: "Escribe un correo que sirva" });
    }
    else if (password == "") {
        register_pass1.select();
        Toast.fire({ icon: 'error', title: "Debes poner una contraseña" });
    }
    else if (password.length < 6) {
        register_pass1.select();
        Toast.fire({ icon: 'error', title: "Elige una mejor contraseña" });
    }
    else if (password !== password2) {
        register_pass2.select();
        Toast.fire({ icon: 'error', title: "Parece que escribiste algo distinto" });
    }
    else {
        sweetalert2_1.default.fire({
            title: "Términos y condiciones",
            html: '<h4>INFORMACIÓN RELEVANTE</h4><p>Es requisito necesario para el uso de TransForma(Aplicación Móvil), que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. El uso de nuestros servicios implicará que usted ha leído y aceptado los Términos y Condiciones de Uso (incluyendo nuestra Política de Privacidad) en el presente documento. Será necesario el ingreso de datos personales fidedignos y definición de una contraseña.</p><p>TransForma se reserva el derecho de enmendar, complementar o suspender total o parcialmente la Aplicación Móvil en forma ocasional. Asimismo, la Compañía se reserva el derecho de cambiar los Términos y Condiciones en cualquier momento, con vigencia inmediata a partir del momento que se actualiza la Aplicación Móvil. El término “Usuario” se refiere a todo individuo o entidad que use, acceda, descargue, instale, obtenga o brinde información desde y hacia esta Aplicación Móvil.</p><p>El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, esta se encuentra encriptada y solo puede ser modificada por el Usuario.</p><p>El Usuario debe suspender el uso de la Aplicación Móvil inmediatamente si no están de acuerdo o no aceptan todos estos Términos y Condiciones. TransForma se reserva el derecho de eliminar o prohibir a cualquier Usuario la utilización de esta Aplicación Móvil a su sola discreción.</p><h1>ACTUALIZACIONES DE LA APLICACIÓN MÓVIL</h1><p>TransForma puede solicitar a los Usuarios que actualicen su versión de la Aplicación Móvil en cualquier momento. Aunque se harán todos los esfuerzos por conservar las configuraciones y preferencias personales del Usuario, seguirá existiendo la posibilidad de que las mismas se pierdan.</p><p><b>Problemas de cobertura inalámbrica y desactivación de funciones</b></p><p>Al intentar realizar una transacción en la Aplicación Móvil, es posible que la conexión inalámbrica se interrumpa o que se desactive una función. En caso de que esto ocurriera, los Usuarios deberán verificar el estado de la transacción que se haya intentado realizar apenas ingresen a un área con cobertura inalámbrica o tengan acceso a una computadora. Los Usuarios también pueden ponerse en contacto con un representante de servicio al cliente de TransForma a través del enlace “Contáctenos” .</p><h1>USO NO AUTORIZADO</h1><p>En caso de que aplique (para venta de software, templetes, u otro producto de diseño y programación) usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y ofrecerlos para la redistribución o la reventa de ningún tipo.</p><h1>PROPIEDAD</h1><p>Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, modificado o sin modificar. Todos los documentos, noticias y canales de información son propiedad de los proveedores del contenido.</p><h1>TERCEROS</h1><p>Los prestadores de servicio de telefonía inalámbrica de los Usuarios, los fabricantes y vendedores de los dispositivos móviles en los que el Usuario descargue, instale, utilice o acceda a la Aplicación Móvil, el creador del sistema operativo para los dispositivos móviles de los Usuarios y el operador de cualquier tienda de aplicaciones o servicios similares mediante los cuales los usuarios obtengan la Aplicación Móvil, si existieran, (en conjunto, los “Terceros”) no son parte de estos Términos y Condiciones y no son propietarios ni responsables de la Aplicación Móvil. Los Terceros no brindan ninguna garantía en relación con la Aplicación Móvil. No son responsables del mantenimiento u otros servicios de soporte técnico de la Aplicación Móvil y no serán responsables ante ningún otro reclamo, pérdidas, imputación de responsabilidades, daños y perjuicios, costos o gastos vinculados con la Aplicación Móvil.</p><p>El Usuario reconoce y acepta que los Terceros y sus empresas subsidiarias son terceros beneficiarios de estos Términos y Condiciones y que ellos tienen el derecho (y se asumirá que han aceptado tal derecho) de ejercer estos Términos y Condiciones ante los usuarios como terceros beneficiarios.</p><p>La Aplicación Móvil fue creada para la versión más reciente disponible en el mercado de los sistemas operativos de los dispositivos móviles de los Usuarios y pueden surgir inconvenientes de compatibilidad cuando se utilicen versiones anteriores. La cobertura de la red inalámbrica y la velocidad de la red de Wi-Fi varían según el proveedor y la ubicación geográfica. TransForma no se responsabiliza por las limitaciones y/o fallas en el funcionamiento de ningún servicio inalámbrico o Wi-FI que se use para acceder a esta Aplicación Móvil ni por la seguridad de los servicios inalámbricos o Wi-Fi. Asimismo, no se responsabiliza de los cargos o tarifas por uso de redes de datos, que son exclusiva responsabilidad del Usuario.</p><p><b>Responsabilidad limitada</b></p><p>LOS TERCEROS, TRANSFORMA Y SUS EMPRESAS MATRICES Y AFILIADAS, JUNTO CON LOS RESPECTIVOS DIRECTIVOS, DIRECTORES, PERSONAL, EMPLEADOS Y REPRESENTANTES (EN CONJUNTO REFERIDOS COMO LAS “PARTES EXENTAS”) NO SERÁN RESPONSABLES NI ESTARÁN SUJETOS A ACCIONES LEGALES, Y POR LA PRESENTE EL USUARIO RENUNCIA A TODO RECLAMO, DEMANDA, IMPUTACIÓN DE RESPONSABILIDADES, CAUSA LEGAL, QUERELLA, RECLAMACIÓN DE DAÑOS Y PERJUICIOS, POR RAZÓN DE, ENTRE OTROS, DAÑOS DIRECTOS, INDIRECTOS, ACCIDENTALES, INCIDENTALES, DERIVADOS, CIRCUNSTANCIALES, EXTRAORDINARIOS, ESPECIALES O PUNITIVOS DE CUALQUIER NATURALEZA CON RESPECTO A ESTA APLICACIÓN MÓVIL (INCLUYENDO LOS PRODUCTOS, SERVICIOS Y CONTENIDOS DE LAS PARTES EXENTAS), AÚN CUANDO LAS PARTES EXENTAS HUBIERAN SIDO ADVERTIDAS DE LA POSIBILIDAD DE DICHOS DAÑOS. EL ÚNICO RECURSO DE LOS USUARIOS ANTE TALES RECLAMOS, DEMANDAS, IMPUTACIÓN DE RESPONSABILIDADES, CAUSAS LEGALES, QUERELLAS O RECLAMOS DE DAÑOS Y PERJUICIOS ES PONER FIN AL USO DE ESTA APLICACIÓN MÓVIL.</p><h1>PRIVACIDAD</h1><p>Nuestra política de privacidad en relación a cualquier información obtenida por TransForma a través de esta Aplicación Móvil puede consultarse en la sección "Acerca de". Pueden tener validez algunas reglas adicionales en materia de privacidad según se establece en las funciones de esta Aplicación Móvil restringidas para servicios específicos del Usuario.</p><p>El uso de esta Aplicación Móvil implica la transmisión electrónica de información a través de las redes del proveedor de servicio inalámbrico. En vista de que TransForma no opera ni controla las redes inalámbricas utilizadas para acceder a la Aplicación Móvil, TransForma no es responsable de la privacidad o seguridad de las transmisiones inalámbricas de datos. El Usuario deberá utilizar proveedores de servicios acreditados y verificar junto a su proveedor de servicios inalámbricos la información relativa a sus prácticas en materia de privacidad y seguridad.</p>',
            showCancelButton: true,
            confirmButtonColor: '#f759ab"',
            cancelButtonColor: '#13c2c2',
            confirmButtonText: 'Acepto',
            cancelButtonText: 'No acepto',
            allowEscapeKey: false, allowOutsideClick: false
        }).then((result) => {
            if (result) {
                firebase.auth().createUserWithEmailAndPassword(mail, password).catch((err) => {
                    sweetalert2_1.default.fire({ title: err.code, text: err.message, icon: 'error' });
                }).then(() => {
                    ipcRenderer.send('loading', true);
                    ipcRenderer.send('loadingchange', 'Registrando|Estamos guardando tu info en un lugar seguro');
                });
            }
        });
    }
});
//# sourceMappingURL=login.js.map