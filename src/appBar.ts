//BEGING STATUS-BAR
import {remote, ipcRenderer} from 'electron';
const win = remote.getCurrentWindow();
const os = require('os')

const bar = document.getElementById('statusBar')

if(os.platform() !== 'win32'){
    bar.style.display = 'none'
}

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