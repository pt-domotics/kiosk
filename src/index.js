const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const url = process.env.KIOSK_URL || "about:blank";
const dataDir = process.env.KIOSK_DATA_DIR || path.join(app.getPath("home"), ".config/kiosk");
const width = parseInt(process.env.KIOSK_WIDTH) || 800;
const height = parseInt(process.env.KIOSK_HEIGHT) || 480;
const backgroundColor = process.env.KIOSK_BG || "#ffffff";
const frame = (parseInt(process.env.KIOSK_FRAME) || 0) !== 0;
const resizable = (parseInt(process.env.KIOSK_RESIZABLE) || 0) !== 0;
const alwaysOnTop = (parseInt(process.env.KIOSK_ONTOP) || 1) !== 0;
const fullscreen = (parseInt(process.env.KIOSK_FULLSCREEN) || 0) !== 0;
const devTools = (parseInt(process.env.KIOSK_DEVTOOLS) || 0) !== 0;
const useCache = (parseInt(process.env.KIOSK_USECACHE) || 0) !== 0;
const loadNewWindowURL = (parseInt(process.env.KIOSK_LOAD_NEW_WINDOW_URL) || 0) !== 0;

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
			contextIsolation: true,
		},
	});

	mainWindow.loadURL(url);

	if (devTools) {
		mainWindow.webContents.openDevTools({
			mode: "detach",
		});
	}

	mainWindow.webContents.on("did-create-window", (w, e) => {
		w.close();

		if (loadNewWindowURL) {
			mainWindow.loadURL(e.url);
		}
	});
};

if (!useCache) {
	app.commandLine.appendSwitch("disable-http-cache");
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on("certificate-error", (event, _webContents, _url, _error, _certificate, callback) => {
	event.preventDefault();
	callback(true);
});

app.setPath("userData", dataDir);
