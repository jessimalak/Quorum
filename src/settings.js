"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const selector = document.getElementById('theme_selector');
selector.value = theme;
const name_ = document.getElementById('usernameP');
const mail_ = document.getElementById('mailP');
const state_ = document.getElementById('stateP');
name_.innerText = "@" + localStorage.getItem('username');
mail_.innerText = localStorage.getItem('mail');
state_.innerText = localStorage.getItem('state');
function logout() {
    electron_1.ipcRenderer.send('signOut', true);
}
//# sourceMappingURL=settings.js.map