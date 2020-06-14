const firebase = require('firebase/app')
require('firebase/auth')
const {ipcRenderer} = require('electron');

const texto = document.getElementById('mensaje');
const titulo = document.getElementById('titulo');

ipcRenderer.on('loadingInfo', (e, text)=>{
    let info = text.split('|')
    texto.innerText = info[1];
    titulo.innerText = info[0];
})


