import { ipcRenderer } from 'electron';

const selector = <HTMLInputElement> document.getElementById('theme_selector');
selector.value = theme;

const name_ = document.getElementById('usernameP');
const mail_ = document.getElementById('mailP');
const state_ = document.getElementById('stateP');

name_.innerText = "@"+localStorage.getItem('username');
mail_.innerText = localStorage.getItem('mail');
state_.innerText = localStorage.getItem('state');

function logout(){
    ipcRenderer.send('signOut', true);
}

