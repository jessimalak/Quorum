const os = require('os');
const { Themebar, Titlebar, Color } = require('custom-electron-titlebar');
const customOrder = localStorage.getItem('buttonOrder');
const platform = os.platform();
function system() {
    let tema = Themebar.win;
    let orden = null;
    if (platform == 'darwin' || customOrder == 'left') {
        orden = 'first-buttons';
        tema = Themebar.mac;
    }
    else if (platform == 'linux') {
        tema = Themebar.linux;
    }
    return { theme: tema, order: orden };
}
let bar = new Titlebar({
    backgroundColor: Color.fromHex('#b37feb'),
    menu: null,
    iconsTheme: system().theme,
    order: system().order,
    minimizable: !modal,
    maximizable: !modal
});
if (os.platform() == 'darwin' || customOrder == 'left') {
    document.getElementsByClassName('window-controls-container')[0].style.flexDirection = 'row-reverse';
}
//# sourceMappingURL=appBar.js.map