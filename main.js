const { app, BrowserWindow, ipcMain } = require('electron')
const os = require('os');
let win;

app.commandLine.appendSwitch('--lang', 'ES')

function createWindow () {
  Start();
  win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    show:false,
    frame: false
  })
  
  win.loadFile('src/login.html')
  win.on('closed',(e) =>{
    app.quit();
  })
}

function isMacOrLinux(){
  let platform = os.platform();
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

let loadingWindow;

function Start(){
  loadingWindow = new BrowserWindow({
    width:400,
    height:200,
    webPreferences:{
      nodeIntegration:true
    },
    frame:false,
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
    
    loadingWindow.show();
    loadingWindow.focus();
  }
  else{
    loadingWindow.hide();
  }
}

ipcMain.on('loading', (event, val)=>{
  ShowLoading(val);
})

ipcMain.on('loadingchange', (e, info)=>{
  loadingWindow.focus();
  loadingWindow.webContents.send('loadingInfo', info)
})

let settings;

ipcMain.on('openSettings', (e) =>{
  settings = new BrowserWindow({
    height:650,
    width:550,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    },
    parent:win,
    modal:true,
    frame: false
  })
  // settings.setMenu(null)
  settings.loadFile('src/settings.html');
})

ipcMain.on('signOut', (e)=>{
  win.webContents.send('signOut', true);
  settings.close();
})

ipcMain.on('updateTheme', (e, val)=>{
  win.webContents.send('updateTheme', val);
})

ipcMain.on('search',(e)=>{
  let window = new BrowserWindow({
    height:650,
    width:550,
    webPreferences:{
      nodeIntegration:true,
      enableRemoteModule:true
    },
    parent:win,
    modal:true,
    frame: false
  })
  window.loadFile('src/search.html');
})

ipcMain.on('joinRoom',(e, values)=>{
  console.log(values.id)
  win.webContents.send('joinRoom', values);
})

ipcMain.on('addContact', (e, values)=>{
  win.webContents.send('addContact', values);
})

ipcMain.on('showWindow',(e, val)=>{
  win.show()
})