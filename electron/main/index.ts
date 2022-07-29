import { app, BrowserWindow, shell, ipcMain, session, Menu } from "electron";
import { release } from "os";
import { join } from "path";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
	// /dist
	dist: join(__dirname, "../.."),
	// /dist or /public
	public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
// const preload = join(__dirname, "../preload/index.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
const indexHtml = join(ROOT_PATH.dist, "index.html");

async function createWindow() {
	win = new BrowserWindow({
		title: "Main window",
		icon: join(ROOT_PATH.public, "favicon.ico"),
		width: 1000,
		height: 600,
		minHeight: 600,
		minWidth: 800,
		webPreferences: {
			// Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
			// Consider using contextBridge.exposeInMainWorld
			// Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
			spellcheck: false,	
		},
		frame: false,
	});
	Menu.setApplicationMenu(null);
	if (app.isPackaged) {
		win.loadFile(indexHtml);
	} else {
		win.loadURL(url);
		// Open devTool if the app is not packaged
		let vue_devtools_url = `C:\\Users\\admin\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\6.2.1_0`;
		await session.defaultSession.loadExtension(vue_devtools_url);
		win.webContents.openDevTools();
	}

	win.on("maximize", () => {
		win.webContents.send("window-maxed", true);
	});
	win.on("unmaximize", () => {
		win.webContents.send("window-maxed", false);
	});

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	win = null;
	if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore();
		win.focus();
	}
});

app.on("activate", () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});

// 窗口事件处理
// 最小化
ipcMain.on("win-minimize", () => {
	win.minimize();
});
// 最大化
ipcMain.on("win-maximize", event => {
	if (win.isMaximized()) {
		win.unmaximize();
		event.reply("window-maxed", false);
	} else {
		win.maximize();
		event.reply("window-maxed", true);
	}
});
// 关闭
ipcMain.on("win-close", () => {
	win.close();
	app.quit();
});

// 打开emoji选择器
ipcMain.on("open-emoji", () => {
	if (app.isEmojiPanelSupported()) {
		app.showEmojiPanel();
	}
});
