//BEGING STATUS-BAR
// const remote = require('electron').remote;
// const win = remote.getCurrentWindow();
const os = require('os')
// const customTitlebar = require('custom-electron-titlebar');
const { Themebar, Titlebar, Color } = require('custom-electron-titlebar');

let customOrder = localStorage.getItem('buttonOrder');
const platform = os.platform();

function system() {
    let tema = Themebar.win;
    let orden = null
    if (platform == 'darwin' || customOrder == 'left') {
        orden = 'first-buttons'
        tema = Themebar.mac
    }else if(platform == 'linux' && customOrder !== 'left'){
        tema = Themebar.linux
    }
    return {theme: tema, order: orden}
}

let bar = new Titlebar({
    backgroundColor: Color.fromHex('#b37feb'),
    menu: null,
    iconsTheme: system().theme,
    order: system().order,
    //@ts-ignore
    minimizable: !modal,
    //@ts-ignore
    maximizable: !modal
})

if (os.platform() == 'darwin' || customOrder == 'left') {
    (<HTMLElement> document.getElementsByClassName('window-controls-container')[0]).style.flexDirection = 'row-reverse'
}

