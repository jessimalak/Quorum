/* #region Main */

const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
import * as firebaseui from 'firebaseui'
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

/** */
// @ts-ignore
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "sendCode_button",
    {
    size: "invisible",
    callback: function(response) {
        // submitPhoneNumberAuth();
    }
    }
);
/** */

/* #endregion Main */

    //BEGING STATUS-BAR
    import {remote} from 'electron';
    const win = remote.getCurrentWindow();

    const title: string = ( < HTMLInputElement > document.getElementById('title')).innerHTML;

    document.getElementById('title_bar').innerHTML = title;

    document.getElementById('min').addEventListener('click', function () {
        win.minimize();
    })

    document.getElementById('max').addEventListener('click', function () {
        if (!win.isMaximized()) {
            win.maximize();
        } else {
            win.unmaximize();
        }
    })

    document.getElementById('close').addEventListener('click', function () {
        win.close();
    })

    //END STATUS-BAR
import Swal from 'sweetalert2'

const login_screen = document.getElementById('login');
const login_btn = document.getElementById('login_btn');
const sendCode_btn = document.getElementById('sendCode_button');
const country_select = <HTMLInputElement> document.getElementById('code_select');
const phone_input = <HTMLInputElement> document.getElementById('phone_input');
const login_mail= <HTMLInputElement> document.getElementById('mail_input');
const login_pass = <HTMLInputElement> document.getElementById('password_input');
const toRegister = document.getElementById('noCount');
const register_screen = document.getElementById('register');
const register_btn = document.getElementById('register_btn');
const register_user = <HTMLInputElement> document.getElementById('R_user');
const register_mail = <HTMLInputElement> document.getElementById('R_mail');
const register_pass1 = <HTMLInputElement> document.getElementById('R_password1');
const register_pass2 = <HTMLInputElement> document.getElementById('R_password2');
const main_screen = document.getElementById('main');

const toLogin = document.getElementById('withCount');

const phonecoll_btn = document.getElementById('phoneColl');
const phone_login = document.getElementById('phoneContent');
const mailcoll_btn = document.getElementById('mailColl');
const mail_login = document.getElementById('mailContent');


phonecoll_btn.addEventListener("click", function() {
    this.classList.toggle("active");
    if (phone_login.style.maxHeight) {
        phone_login.style.maxHeight = null;
    } else {
        phone_login.style.maxHeight = phone_login.scrollHeight + "px";
        mail_login.style.maxHeight = null;
    }
  });

  phonecoll_btn.click();

  mailcoll_btn.addEventListener("click", function() {
    this.classList.toggle("active");
    if (mail_login.style.maxHeight) {
        mail_login.style.maxHeight = null;
    } else {
        mail_login.style.maxHeight = mail_login.scrollHeight + "px";
        phone_login.style.maxHeight = null;
    }
  });

const Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

toRegister.addEventListener('click', ()=>{
    login_screen.style.display = "none";
    register_screen.style.display = "flex";
})

toLogin.addEventListener('click', ()=>{
    login_screen.style.display = "flex";
    register_screen.style.display = "none";
})


function isValidMail(mail){
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail);
}

login_btn.addEventListener('click', () =>{
    let mail = login_mail.value;
    let password = login_pass.value;

    if(mail == "" || password == ""){
        console.log("algo anda mal")
    }else if(!isValidMail(mail)){
        console.log("el correo ta malo")
    }
    else{
        firebase.auth().signInWithEmailAndPassword(mail, password).catch((err)=>{
            Swal.fire({title: err.code, text:err.message, icon: 'error'})
        })
    }
})

// let uiConfig = {signInSuccessUrl: 'main.html',
//     signInOptions:[
//         firebase.auth.PhoneAuthProvider.PROVIDER_ID
//     ],
//     tosUrl: 'main.html',
//     recaptchaParameters:{
//         size: 'invisible'
//     }
// }

// let ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start('#PhoneContent', uiConfig);

function signIn(){
    let phoneN = phone_input.value;
    if(phoneN == ""){
        phone_input.select();
        Toast.fire({icon: 'error', title: 'Sin tu número no sabemos quien eres'})
    }else{
        
        firebase.auth().SignInWithPhoneNumber(country_select+phoneN).then(async()=>{
            const { value: phoneCode } =  await Swal.fire({
                title: 'Dinos cuál fue el código que te enviamos',
                input: 'text',
                showCancelButton: true,
                inputValidator: (value) => {
                  if (!value) {
                    return 'Si no te llega intenta pedirlo de nuevo'
                  }
                }
              })
        }
            
        ).catch((err)=>{
            Swal.fire({title: err.code, text:err.message, icon: 'error'})
        })
        
    }
    
}

firebase.auth().onAuthStateChanged(user =>{
    if(user){
        login_screen.style.display = "none";
        register_screen.style.display = "none";
        main_screen.style.display = "block"
        ShowLoading('Obteniendo info', 'Desencriptando...')
        console.log(user)
    }else{
        login_screen.style.display = "flex";
        main_screen.style.display = "none"
    }
})

register_btn.addEventListener('click', ()=>{
    let username:string = register_user.value;
    let mail:string = register_mail.value;
    let password:string = register_pass1.value;
    let password2:string = register_pass2.value;
    if(username == ""){
        register_user.select();
        Toast.fire({icon: 'error', title: 'Escoge un nombre usuario'})
    }else if(mail == "" || !isValidMail(mail)){
        register_mail.select();
        Toast.fire({icon: 'error', title: "Escribe un correo que sirva"})
    }else if(password == ""){
        register_pass1.select()
        Toast.fire({icon: 'error', title: "Tenemos que poner una contraseña"})
    }else if(password !== password2){
        register_pass2.select();
        Toast.fire({icon: 'error', title: "Parece que escribiste algo distinto"});
    }else{
        Swal.fire({title: "Términos y condiciones",
        html: '<h4>INFORMACIÓN RELEVANTE</h4><p>Es requisito necesario para el uso de TransForma(Aplicación Móvil), que lea y acepte los siguientes Términos y Condiciones que a continuación se redactan. El uso de nuestros servicios implicará que usted ha leído y aceptado los Términos y Condiciones de Uso (incluyendo nuestra Política de Privacidad) en el presente documento. Será necesario el ingreso de datos personales fidedignos y definición de una contraseña.</p><p>TransForma se reserva el derecho de enmendar, complementar o suspender total o parcialmente la Aplicación Móvil en forma ocasional. Asimismo, la Compañía se reserva el derecho de cambiar los Términos y Condiciones en cualquier momento, con vigencia inmediata a partir del momento que se actualiza la Aplicación Móvil. El término “Usuario” se refiere a todo individuo o entidad que use, acceda, descargue, instale, obtenga o brinde información desde y hacia esta Aplicación Móvil.</p><p>El usuario puede elegir y cambiar la clave para su acceso de administración de la cuenta en cualquier momento, esta se encuentra encriptada y solo puede ser modificada por el Usuario.</p><p>El Usuario debe suspender el uso de la Aplicación Móvil inmediatamente si no están de acuerdo o no aceptan todos estos Términos y Condiciones. TransForma se reserva el derecho de eliminar o prohibir a cualquier Usuario la utilización de esta Aplicación Móvil a su sola discreción.</p><h1>ACTUALIZACIONES DE LA APLICACIÓN MÓVIL</h1><p>TransForma puede solicitar a los Usuarios que actualicen su versión de la Aplicación Móvil en cualquier momento. Aunque se harán todos los esfuerzos por conservar las configuraciones y preferencias personales del Usuario, seguirá existiendo la posibilidad de que las mismas se pierdan.</p><p><b>Problemas de cobertura inalámbrica y desactivación de funciones</b></p><p>Al intentar realizar una transacción en la Aplicación Móvil, es posible que la conexión inalámbrica se interrumpa o que se desactive una función. En caso de que esto ocurriera, los Usuarios deberán verificar el estado de la transacción que se haya intentado realizar apenas ingresen a un área con cobertura inalámbrica o tengan acceso a una computadora. Los Usuarios también pueden ponerse en contacto con un representante de servicio al cliente de TransForma a través del enlace “Contáctenos” .</p><h1>USO NO AUTORIZADO</h1><p>En caso de que aplique (para venta de software, templetes, u otro producto de diseño y programación) usted no puede colocar uno de nuestros productos, modificado o sin modificar, en un CD, sitio web o ningún otro medio y ofrecerlos para la redistribución o la reventa de ningún tipo.</p><h1>PROPIEDAD</h1><p>Usted no puede declarar propiedad intelectual o exclusiva a ninguno de nuestros productos, modificado o sin modificar. Todos los documentos, noticias y canales de información son propiedad de los proveedores del contenido.</p><h1>TERCEROS</h1><p>Los prestadores de servicio de telefonía inalámbrica de los Usuarios, los fabricantes y vendedores de los dispositivos móviles en los que el Usuario descargue, instale, utilice o acceda a la Aplicación Móvil, el creador del sistema operativo para los dispositivos móviles de los Usuarios y el operador de cualquier tienda de aplicaciones o servicios similares mediante los cuales los usuarios obtengan la Aplicación Móvil, si existieran, (en conjunto, los “Terceros”) no son parte de estos Términos y Condiciones y no son propietarios ni responsables de la Aplicación Móvil. Los Terceros no brindan ninguna garantía en relación con la Aplicación Móvil. No son responsables del mantenimiento u otros servicios de soporte técnico de la Aplicación Móvil y no serán responsables ante ningún otro reclamo, pérdidas, imputación de responsabilidades, daños y perjuicios, costos o gastos vinculados con la Aplicación Móvil.</p><p>El Usuario reconoce y acepta que los Terceros y sus empresas subsidiarias son terceros beneficiarios de estos Términos y Condiciones y que ellos tienen el derecho (y se asumirá que han aceptado tal derecho) de ejercer estos Términos y Condiciones ante los usuarios como terceros beneficiarios.</p><p>La Aplicación Móvil fue creada para la versión más reciente disponible en el mercado de los sistemas operativos de los dispositivos móviles de los Usuarios y pueden surgir inconvenientes de compatibilidad cuando se utilicen versiones anteriores. La cobertura de la red inalámbrica y la velocidad de la red de Wi-Fi varían según el proveedor y la ubicación geográfica. TransForma no se responsabiliza por las limitaciones y/o fallas en el funcionamiento de ningún servicio inalámbrico o Wi-FI que se use para acceder a esta Aplicación Móvil ni por la seguridad de los servicios inalámbricos o Wi-Fi. Asimismo, no se responsabiliza de los cargos o tarifas por uso de redes de datos, que son exclusiva responsabilidad del Usuario.</p><p><b>Responsabilidad limitada</b></p><p>LOS TERCEROS, TRANSFORMA Y SUS EMPRESAS MATRICES Y AFILIADAS, JUNTO CON LOS RESPECTIVOS DIRECTIVOS, DIRECTORES, PERSONAL, EMPLEADOS Y REPRESENTANTES (EN CONJUNTO REFERIDOS COMO LAS “PARTES EXENTAS”) NO SERÁN RESPONSABLES NI ESTARÁN SUJETOS A ACCIONES LEGALES, Y POR LA PRESENTE EL USUARIO RENUNCIA A TODO RECLAMO, DEMANDA, IMPUTACIÓN DE RESPONSABILIDADES, CAUSA LEGAL, QUERELLA, RECLAMACIÓN DE DAÑOS Y PERJUICIOS, POR RAZÓN DE, ENTRE OTROS, DAÑOS DIRECTOS, INDIRECTOS, ACCIDENTALES, INCIDENTALES, DERIVADOS, CIRCUNSTANCIALES, EXTRAORDINARIOS, ESPECIALES O PUNITIVOS DE CUALQUIER NATURALEZA CON RESPECTO A ESTA APLICACIÓN MÓVIL (INCLUYENDO LOS PRODUCTOS, SERVICIOS Y CONTENIDOS DE LAS PARTES EXENTAS), AÚN CUANDO LAS PARTES EXENTAS HUBIERAN SIDO ADVERTIDAS DE LA POSIBILIDAD DE DICHOS DAÑOS. EL ÚNICO RECURSO DE LOS USUARIOS ANTE TALES RECLAMOS, DEMANDAS, IMPUTACIÓN DE RESPONSABILIDADES, CAUSAS LEGALES, QUERELLAS O RECLAMOS DE DAÑOS Y PERJUICIOS ES PONER FIN AL USO DE ESTA APLICACIÓN MÓVIL.</p><h1>PRIVACIDAD</h1><p>Nuestra política de privacidad en relación a cualquier información obtenida por TransForma a través de esta Aplicación Móvil puede consultarse en la sección "Acerca de". Pueden tener validez algunas reglas adicionales en materia de privacidad según se establece en las funciones de esta Aplicación Móvil restringidas para servicios específicos del Usuario.</p><p>El uso de esta Aplicación Móvil implica la transmisión electrónica de información a través de las redes del proveedor de servicio inalámbrico. En vista de que TransForma no opera ni controla las redes inalámbricas utilizadas para acceder a la Aplicación Móvil, TransForma no es responsable de la privacidad o seguridad de las transmisiones inalámbricas de datos. El Usuario deberá utilizar proveedores de servicios acreditados y verificar junto a su proveedor de servicios inalámbricos la información relativa a sus prácticas en materia de privacidad y seguridad.</p>',
        showCancelButton: true,
        confirmButtonColor: '#f759ab"',
        cancelButtonColor: '#13c2c2',
        confirmButtonText: 'Acepto',
        cancelButtonText: 'No acepto',
        allowEscapeKey: false, allowOutsideClick: false
    }).then((result)=>{
        if(result){
            ShowLoading('Registrando', 'Estamos guardando tu info en un lugar seguro.');
        }
    })
    }
})

let loadingDialog;

function ShowLoading(titulo:string, mensaje:string){
   loadingDialog = Swal.fire({title: titulo, text: mensaje, allowEscapeKey: false, allowOutsideClick: false, onBeforeOpen: ()=>{ Swal.showLoading()}})
}

// function Cerrar(){
//     firebase.auth().signOut();
// }