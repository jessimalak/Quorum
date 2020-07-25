const os = require('os');
const { Themebar, Titlebar, Color } = require('custom-electron-titlebar');
let customOrder = localStorage.getItem('buttonOrder');
const platform = os.platform();
function system() {
    let tema = Themebar.win;
    let orden = null;
    if (platform == 'darwin' || customOrder == 'left') {
        orden = 'first-buttons';
        tema = Themebar.mac;
    }
    else if (platform == 'linux' && customOrder !== 'left') {
        tema = Themebar.linux;
    }
    return { theme: tema, order: orden };
}
let bar = new Titlebar({
    backgroundColor: Color.fromHex('#b37feb'),
    iconsTheme: system().theme,
    order: system().order,
    minimizable: !modal,
    maximizable: !modal
});
if (os.platform() == 'darwin' || customOrder == 'left') {
    document.getElementsByClassName('window-controls-container')[0].style.flexDirection = 'row-reverse';
}
function settingsIcon() {
    const container = document.getElementsByClassName('window-controls-container')[0];
    let tema = system().theme.toString();
    let order = system().order;
    if (platform == 'darwin' || customOrder == 'left') {
        container.innerHTML += '<div class="window-icon-bg" id="settings_btn" onclick="openSettings()"><i class="mdi mdi-cog"></i></div>';
    }
    else {
        container.innerHTML = '<div class="window-icon-bg" id="settings_btn" onclick="openSettings()"><i class="mdi mdi-cog"></i></div>' + container.innerHTML;
    }
}
//# sourceMappingURL=appBar.js.map