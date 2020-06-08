const remote = require('electron').remote;
const win = remote.getCurrentWindow();

const title:string = (<HTMLInputElement>document.getElementById('title')).innerHTML;
const statusBar:HTMLElement  = document.getElementById('statusBar');

document.getElementById('title_bar').innerHTML = title;

document.getElementById('min').addEventListener('click', function(){
    win.minimize();
})

document.getElementById('max').addEventListener('click', function(){
    if(!win.isMaximized()){
        win.maximize();
    }else{
        win.unmaximize();
    }
})

document.getElementById('close').addEventListener('click', function(){
    win.close();
})