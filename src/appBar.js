const remote = require('electron').remote;
const win = remote.getCurrentWindow();
const os = require('os');
const bar = document.getElementById('statusBar');
const contactPanel = document.getElementsByClassName('panel')[0];
if (os.platform() !== 'win32') {
    bar.style.display = 'none';
    if (contactPanel !== undefined) {
        contactPanel.style.paddingTop = '0';
    }
}
const title = document.getElementById('title').innerHTML;
document.getElementById('title_bar').innerHTML = title;
let min = document.getElementById('min');
min.addEventListener('click', function () {
    win.minimize();
});
let max = document.getElementById('max');
max.addEventListener('click', function () {
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
if (modal) {
    min.style.display = "none";
    max.style.display = "none";
}
//# sourceMappingURL=appBar.js.map