var remote = require('electron').remote;
var win = remote.getCurrentWindow();
var title = document.getElementById('title').innerHTML;
var statusBar = document.getElementById('statusBar');
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
