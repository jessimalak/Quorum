//BEGING STATUS-BAR
const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const os = require('os')

const bar = document.getElementById('statusBar');
const contactPanel = <HTMLElement> document.getElementsByClassName('panel')[0];

if(os.platform() !== 'win32'){
    bar.style.display = 'none'
    if(contactPanel !== undefined){
        contactPanel.style.paddingTop = '0';
    }
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