"use strict";
exports.__esModule = true;
//BEGING STATUS-BAR
var electron_1 = require("electron");
var win = electron_1.remote.getCurrentWindow();
var os = require('os');
var bar = document.getElementById('statusBar');
var isWindows = localStorage.getItem('isWindows');
if (os.platform.name !== 'win32') {
    bar.style.display = 'none';
}
// ipcRenderer.on('isWindows', (event, val)=>{
//     localStorage.setItem('isWindows', val);
//     if(!isWindows){
//         bar.style.display = 'none';
//     }
// })
// if(!isWindows){
//     bar.style.display = 'none';
// }
var title = document.getElementById('title').innerHTML;
document.getElementById('title_bar').innerHTML = title;
document.getElementById('min').addEventListener('click', function () {
    win.minimize();
});
document.getElementById('max').addEventListener('click', function () {
    if (!win.isMaximized()) {
        win.maximize();
    }
    else {
        win.unmaximize();
    }
});
document.getElementById('close').addEventListener('click', function () {
    win.close();
});
//END STATUS-BAR
