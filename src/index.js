"use strict";
/* #region Main */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
// firebase.auth().useDeviceLanguage();
var firebaseConfig = {
    apiKey: "AIzaSyDGLP6V1uQx9Mxc6FXp6oO6HKD7qZbnbeE",
    authDomain: "quorumchat.firebaseapp.com",
    databaseURL: "https://quorumchat.firebaseio.com",
    projectId: "quorumchat",
    storageBucket: "quorumchat.appspot.com",
    messagingSenderId: "339371371649",
    appId: "1:339371371649:web:1e68336580ea7117003180",
    measurementId: "G-VL1T8FXBQM"
};
firebase.initializeApp(firebaseConfig);
/* #endregion Main */
var sweetalert2_1 = require("sweetalert2");
var electron_1 = require("electron");
var CryptoJS = require('crypto-js');
// import sha256 from 'crypto-js/sha256';
// import hmacSHA512 from 'crypto-js/hmac-sha512';
// import Base64 from 'crypto-js/enc-base64';
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var login_screen = document.getElementById('login');
var login_btn = document.getElementById('login_btn');
var sendCode_btn = document.getElementById('sendCode_button');
var country_select = document.getElementById('code_select');
var phone_input = document.getElementById('phone_input');
var login_mail = document.getElementById('mail_input');
var login_pass = document.getElementById('password_input');
var toRegister = document.getElementById('noCount');
var register_screen = document.getElementById('register');
var register_btn = document.getElementById('register_btn');
var register_user = document.getElementById('R_user');
var register_mail = document.getElementById('R_mail');
var register_pass1 = document.getElementById('R_password1');
var register_pass2 = document.getElementById('R_password2');
var main_screen = document.getElementById('main');
var sendReset_btn = document.getElementById('sendResetButton');
var toLogin = document.getElementById('withCount');
var loaded;
var Toast = sweetalert2_1["default"].mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: function (toast) {
        toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
        toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
    }
});
toRegister.addEventListener('click', function () {
    login_screen.style.display = "none";
    register_screen.style.display = "flex";
});
toLogin.addEventListener('click', function () {
    login_screen.style.display = "flex";
    register_screen.style.display = "none";
});
var eventType;
function isValidMail(mail) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}
login_btn.addEventListener('click', function () {
    var mail = login_mail.value;
    var password = login_pass.value;
    loaded = true;
    if (mail == "" || password == "") {
        Toast.fire({ title: 'Debes llenar todos los campos', icon: 'error' });
    }
    else if (!isValidMail(mail)) {
        login_mail.select();
        Toast.fire({ icon: 'error', title: "Escribe un correo que sirva" });
    }
    else {
        firebase.auth().signInWithEmailAndPassword(mail, password).then(function () {
            eventType = 'login';
            electron_1.ipcRenderer.send('loading', true);
            electron_1.ipcRenderer.send('loadingchange', 'Desencripando...|Obteniendo información de perfil');
        })["catch"](function (err) {
            sweetalert2_1["default"].fire({ title: err.code, text: err.message, icon: 'error' });
        });
    }
    var cypher = CryptoJS.AES.encrypt(mail, 'ayuwokiEny').toString();
    var rest = CryptoJS.AES.decrypt(cypher, 'ayuwokiEny');
    var wii = rest.toString(CryptoJS.enc.Utf8);
    console.log(cypher);
    console.log(wii);
});
sendReset_btn.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
    var correo, mail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                correo = login_mail.value;
                return [4 /*yield*/, sweetalert2_1["default"].fire({
                        title: 'Dinos cuál fue el código que te enviamos',
                        input: 'email',
                        showCancelButton: true,
                        inputValue: correo,
                        inputValidator: function (mail) {
                            if (!mail) {
                                return 'Escribe tu correo para poder ayudarte';
                            }
                            else {
                                firebase.auth().sendPasswordResetEmail(mail).then(function () {
                                    sweetalert2_1["default"].fire({ title: 'Revisa tu correo',
                                        text: 'Te enviamos un link para que puedas actualizar tu contraseña.',
                                        icon: 'success' });
                                    login_mail.value = mail;
                                })["catch"](function (err) {
                                    sweetalert2_1["default"].fire({ title: 'Algo salió mal',
                                        text: 'Vuelve a intentarlo en un rato.',
                                        icon: 'error' });
                                });
                            }
                        }
                    })];
            case 1:
                mail = (_a.sent()).value;
                return [2 /*return*/];
        }
    });
}); });
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var uid = user.uid;
        localStorage.setItem('uid', uid);
        if (eventType == 'login') {
            firebase.database().ref('Usuarios' + uid).once('value')
                .then(function (snapshot) {
                var user = snapshot.val();
                console.log(user.username);
                // localStorage.setItem('username', user.username)
            });
        }
        else if (eventType == 'register') {
            var username = register_user.value;
            var mail = register_mail.value;
            firebase.database().ref('Usuarios/' + uid).set({
                'username': username,
                "correo": mail,
                "id": uid,
                "mensajeEnc": CryptoJS.AES.encrypt(mail, uid).toString()
            }).then(function () {
                window.location.replace('main.html');
            });
        }
    }
    else {
        electron_1.ipcRenderer.send('loading', false);
    }
});
register_btn.addEventListener('click', function () {
    var username = register_user.value;
    var mail = register_mail.value;
    var password = register_pass1.value;
    var password2 = register_pass2.value;
    loaded = true;
    eventType = 'register';
    if (username == "") {
        register_user.select();
        Toast.fire({ icon: 'error', title: 'Escoge un nombre usuario' });
    }
    else if (mail == "" || !isValidMail(mail)) {
        register_mail.select();
        Toast.fire({ icon: 'error', title: "Escribe un correo que sirva" });
    }
    else if (password == "") {
        register_pass1.select();
        Toast.fire({ icon: 'error', title: "Debes poner una contraseña" });
    }
    else if (password !== password2) {
        register_pass2.select();
        Toast.fire({ icon: 'error', title: "Parece que escribiste algo distinto" });
    }
    else {
        sweetalert2_1["default"].fire({ title: "Términos y condiciones",
            html: '<h4>INFORMACIÓN RELEVANTE</h4><p>Es requisito necesario para el uso de TransForma(Aplicación Móvil), que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. El uso de nuestros servicios implicará que usted ha leído y aceptado los Términos y Condiciones de Uso (incluyendo nuestra Política de Privacidad) en el presente documento. Será necesario el ingreso de datos personales fidedignos y definición de una contraseña.</p><p>TransForma se reserva el derecho de enmendar, complementar o suspender total o parcialmente la Aplicación Móvil en forma ocasional. Asimismo, la Compañía se reserva el derecho de cambiar los Términos y Condiciones en cualquier momento, con vigencia inmediata a partir del momento que se actualiza la Aplicación Móvil. El término “Usuario” se refiere a todo individuo o entidad que use, acceda, descargue, instale, obtenga o brinde información desde y hacia esta Aplicación Móvil.</p><p>El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, esta se encuentra encriptada y solo puede ser modificada por el Usuario.</p><p>El Usuario debe suspender el uso de la Aplicación Móvil inmediatamente si no están de acuerdo o no aceptan todos estos Términos y Condiciones. TransForma se reserva el derecho de eliminar o prohibir a cualquier Usuario la utilización de esta Aplicación Móvil a su sola discreción.</p><h1>ACTUALIZACIONES DE LA APLICACIÓN MÓVIL</h1><p>TransForma puede solicitar a los Usuarios que actualicen su versión de la Aplicación Móvil en cualquier momento. Aunque se harán todos los esfuerzos por conservar las configuraciones y preferencias personales del Usuario, seguirá existiendo la posibilidad de que las mismas se pierdan.</p><p><b>Problemas de cobertura inalámbrica y desactivación de funciones</b></p><p>Al intentar realizar una transacción en la Aplicación Móvil, es posible que la conexión inalámbrica se interrumpa o que se desactive una función. En caso de que esto ocurriera, los Usuarios deberán verificar el estado de la transacción que se haya intentado realizar apenas ingresen a un área con cobertura inalámbrica o tengan acceso a una computadora. Los Usuarios también pueden ponerse en contacto con un representante de servicio al cliente de TransForma a través del enlace “Contáctenos” .</p><h1>USO NO AUTORIZADO</h1><p>En caso de que aplique (para venta de software, templetes, u otro producto de diseño y programación) usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y ofrecerlos para la redistribución o la reventa de ningún tipo.</p><h1>PROPIEDAD</h1><p>Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, modificado o sin modificar. Todos los documentos, noticias y canales de información son propiedad de los proveedores del contenido.</p><h1>TERCEROS</h1><p>Los prestadores de servicio de telefonía inalámbrica de los Usuarios, los fabricantes y vendedores de los dispositivos móviles en los que el Usuario descargue, instale, utilice o acceda a la Aplicación Móvil, el creador del sistema operativo para los dispositivos móviles de los Usuarios y el operador de cualquier tienda de aplicaciones o servicios similares mediante los cuales los usuarios obtengan la Aplicación Móvil, si existieran, (en conjunto, los “Terceros”) no son parte de estos Términos y Condiciones y no son propietarios ni responsables de la Aplicación Móvil. Los Terceros no brindan ninguna garantía en relación con la Aplicación Móvil. No son responsables del mantenimiento u otros servicios de soporte técnico de la Aplicación Móvil y no serán responsables ante ningún otro reclamo, pérdidas, imputación de responsabilidades, daños y perjuicios, costos o gastos vinculados con la Aplicación Móvil.</p><p>El Usuario reconoce y acepta que los Terceros y sus empresas subsidiarias son terceros beneficiarios de estos Términos y Condiciones y que ellos tienen el derecho (y se asumirá que han aceptado tal derecho) de ejercer estos Términos y Condiciones ante los usuarios como terceros beneficiarios.</p><p>La Aplicación Móvil fue creada para la versión más reciente disponible en el mercado de los sistemas operativos de los dispositivos móviles de los Usuarios y pueden surgir inconvenientes de compatibilidad cuando se utilicen versiones anteriores. La cobertura de la red inalámbrica y la velocidad de la red de Wi-Fi varían según el proveedor y la ubicación geográfica. TransForma no se responsabiliza por las limitaciones y/o fallas en el funcionamiento de ningún servicio inalámbrico o Wi-FI que se use para acceder a esta Aplicación Móvil ni por la seguridad de los servicios inalámbricos o Wi-Fi. Asimismo, no se responsabiliza de los cargos o tarifas por uso de redes de datos, que son exclusiva responsabilidad del Usuario.</p><p><b>Responsabilidad limitada</b></p><p>LOS TERCEROS, TRANSFORMA Y SUS EMPRESAS MATRICES Y AFILIADAS, JUNTO CON LOS RESPECTIVOS DIRECTIVOS, DIRECTORES, PERSONAL, EMPLEADOS Y REPRESENTANTES (EN CONJUNTO REFERIDOS COMO LAS “PARTES EXENTAS”) NO SERÁN RESPONSABLES NI ESTARÁN SUJETOS A ACCIONES LEGALES, Y POR LA PRESENTE EL USUARIO RENUNCIA A TODO RECLAMO, DEMANDA, IMPUTACIÓN DE RESPONSABILIDADES, CAUSA LEGAL, QUERELLA, RECLAMACIÓN DE DAÑOS Y PERJUICIOS, POR RAZÓN DE, ENTRE OTROS, DAÑOS DIRECTOS, INDIRECTOS, ACCIDENTALES, INCIDENTALES, DERIVADOS, CIRCUNSTANCIALES, EXTRAORDINARIOS, ESPECIALES O PUNITIVOS DE CUALQUIER NATURALEZA CON RESPECTO A ESTA APLICACIÓN MÓVIL (INCLUYENDO LOS PRODUCTOS, SERVICIOS Y CONTENIDOS DE LAS PARTES EXENTAS), AÚN CUANDO LAS PARTES EXENTAS HUBIERAN SIDO ADVERTIDAS DE LA POSIBILIDAD DE DICHOS DAÑOS. EL ÚNICO RECURSO DE LOS USUARIOS ANTE TALES RECLAMOS, DEMANDAS, IMPUTACIÓN DE RESPONSABILIDADES, CAUSAS LEGALES, QUERELLAS O RECLAMOS DE DAÑOS Y PERJUICIOS ES PONER FIN AL USO DE ESTA APLICACIÓN MÓVIL.</p><h1>PRIVACIDAD</h1><p>Nuestra política de privacidad en relación a cualquier información obtenida por TransForma a través de esta Aplicación Móvil puede consultarse en la sección "Acerca de". Pueden tener validez algunas reglas adicionales en materia de privacidad según se establece en las funciones de esta Aplicación Móvil restringidas para servicios específicos del Usuario.</p><p>El uso de esta Aplicación Móvil implica la transmisión electrónica de información a través de las redes del proveedor de servicio inalámbrico. En vista de que TransForma no opera ni controla las redes inalámbricas utilizadas para acceder a la Aplicación Móvil, TransForma no es responsable de la privacidad o seguridad de las transmisiones inalámbricas de datos. El Usuario deberá utilizar proveedores de servicios acreditados y verificar junto a su proveedor de servicios inalámbricos la información relativa a sus prácticas en materia de privacidad y seguridad.</p>',
            showCancelButton: true,
            confirmButtonColor: '#f759ab"',
            cancelButtonColor: '#13c2c2',
            confirmButtonText: 'Acepto',
            cancelButtonText: 'No acepto',
            allowEscapeKey: false, allowOutsideClick: false
        }).then(function (result) {
            if (result) {
                firebase.auth().createUserWithEmailAndPassword(mail, password)["catch"](function (err) {
                    sweetalert2_1["default"].fire({ title: err.code, text: err.message, icon: 'error' });
                });
                electron_1.ipcRenderer.send('loading', true);
                electron_1.ipcRenderer.send('loadingchange', 'Registrando|Estamos guardando tu info en un lugar seguro');
            }
        });
    }
});
// function Cerrar(){
//     firebase.auth().signOut();
// }
