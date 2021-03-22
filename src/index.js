const { app, BrowserWindow } = require('electron');

const width = parseInt(process.env.KIOSK_WIDTH) || 800;
const height = parseInt(process.env.KIOSK_HEIGHT) || 480;
const backgroundColor = process.env.KIOSK_BG || '#000000';
const frame = (parseInt(process.env.KIOSK_FRAME) || 0) !== 0;
const resizable =  (parseInt(process.env.KIOSK_RESIZABLE) || 0) !== 0;
const alwaysOnTop = (parseInt(process.env.KIOSK_ONTOP) || 1) !== 0;
const fullscreen = (parseInt(process.env.KIOSK_FULLSCREEN) || 0) !== 0;
const devTools = (parseInt(process.env.KIOSK_DEVTOOLS) || 0) !== 0;
const useCache = (parseInt(process.env.KIOSK_USECACHE) || 0) !== 0;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width,
    height,
    useContentSize: true,
    backgroundColor,
    frame,
    resizable,
    alwaysOnTop,
    fullscreen,
    webPreferences: {
      devTools,
      contextIsolation: true
    }
  });

  mainWindow.loadURL(process.env.KIOSK_URL || 'about:blank');

  if(devTools) {
    mainWindow.webContents.openDevTools({
        mode: 'detach'
    });
  }
};

if(!useCache) {
  app.commandLine.appendSwitch("disable-http-cache");
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
