const { app, BrowserWindow, ipcMain } = require('electron')
const os = require('os');
let win;

function createWindow () {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    show:false,
    frame:isMacOrLinux()
  })
  Start();
  win.loadFile('src/index.html')
  win.on('ready-to-show', (e)=>{
    win.show();
    loadingWindow.show();
  })
  win.on('closed',(e) =>{
    console.log('cerrada')
    app.quit();
  })
}

function isMacOrLinux(){
  let platform = os.platform.name;
  if(platform == 'win32'){
    return false;
  }else{
    return true;
  }
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// app.on('ready', ()=>{
  
// })

let loadingWindow;

function Start(){
  loadingWindow = new BrowserWindow({
    width:400,
    height:200,
    webPreferences:{
      nodeIntegration:true
    }, frame:false,
    parent: win,
    modal: true,
    backgroundColor: '#b37feb',
    resizable:false,
    skipTaskbar:true
})
  loadingWindow.loadFile('src/loading/loading.html')
}

function ShowLoading(show){
  if(show){
    if(loadingWindow == null){
      Start();
    }else{
      loadingWindow.show();
    }
  }
  else{
    loadingWindow.hide();
  }
}

ipcMain.on('loading', (event, val)=>{
  ShowLoading(val);
})

ipcMain.on('loadingchange', (e, info)=>{
  console.log(info)
  loadingWindow.webContents.send('loadingInfo', info)
})
