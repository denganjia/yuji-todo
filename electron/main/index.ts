import { app, BrowserWindow, shell, ipcMain, session, Menu, nativeTheme } from "electron";
import { release } from "os";
import { join } from "path";
import log from "electron-log";

import { autoUpdater } from "electron-updater";

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
		icon: join(ROOT_PATH.public, "icon.ico"),
		width: 927,
		height: 573,
		minHeight: 400,
		minWidth: 360,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			devTools: true,
			spellcheck: false,
		},
		frame: false,
	});
	Menu.setApplicationMenu(null);
	if (app.isPackaged) {
		await win.loadFile(indexHtml);
	} else {
		await win.loadURL(url);
		// Open devTool if the app is not packaged
		let vue_devtools_url = `C:\\Users\\admin\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\6.4.5_0`;
		await session.defaultSession.loadExtension(vue_devtools_url);
		win.webContents.openDevTools();
	}

	win.on("maximize", () => {
		win?.webContents.send("window-maxed", true);
	});
	win.on("unmaximize", () => {
		win?.webContents.send("window-maxed", false);
	});

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith("https:")) shell.openExternal(url);
		return { action: "deny" };
	});
}

app.whenReady().then(async () => {
	await createWindow();
	autoUpdater
		.checkForUpdates()
		.then(res => {
			log.log(res);
		})
		.catch(err => {
			log.error(err);
		});
});

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

app.on("activate", async () => {
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		await createWindow();
	}
});

// 窗口事件处理
// 最小化
ipcMain.on("win-minimize", () => {
	win?.minimize();
});
// 最大化
ipcMain.on("win-maximize", event => {
	if (win?.isMaximized()) {
		win?.unmaximize();
		event.reply("window-maxed", false);
	} else {
		win?.maximize();
		event.reply("window-maxed", true);
	}
});
// 关闭
ipcMain.on("win-close", () => {
	win?.close();
	app.quit();
});

// 打开emoji选择器
ipcMain.on("open-emoji", () => {
	if (app.isEmojiPanelSupported()) {
		app.showEmojiPanel();
	}
});
let currentSize = [0, 0];
// 置顶到窗口最上方
ipcMain.on("fix-top", event => {
	if (win?.isMaximized()) {
		win?.unmaximize();
		event.reply("window-maxed", false);
	}
	win.setAlwaysOnTop(true);
	event.reply("fix-top");
	currentSize = win.getSize();
	win.setSize(360, 500);
	win.setMaximizable(false);
	win.setResizable(false);
});
// 窗口还原
ipcMain.on("restore-window", event => {
	win.setAlwaysOnTop(false);
	event.reply("restore");
	win.setSize(currentSize[0], currentSize[1]);
	win.setMaximizable(true);
	win.setResizable(true);
});

//获取系统暗色模式
ipcMain.on("get-system-theme", event => {
	event.returnValue = nativeTheme.shouldUseDarkColors;
	nativeTheme.on("updated", event => {
		win.webContents.send("change-system-theme", event.sender.shouldUseDarkColors);
	});
});

let feedUrl = "http://www.chiyu.site/doit/api/update/";
autoUpdater.setFeedURL(feedUrl);
let message = {
	error: "检查更新出错",
	checking: "正在检查更新……",
	updateAva: "检测到新版本，正在下载……",
	updateNotAva: "现在使用的就是最新版本，不用更新",
};
autoUpdater.on("error", function (error, message) {
	log.error(error);
	log.error(message);
});
autoUpdater.on("checking-for-update", function () {
	sendUpdateMessage(message.checking);
});
//有更新
autoUpdater.on("update-available", function () {
	sendUpdateMessage(message.updateAva);
});
autoUpdater.on("update-not-available", function () {
	sendUpdateMessage(message.updateNotAva);
});

// 更新下载进度事件
autoUpdater.on("download-progress", function (progressObj) {
	win?.webContents.send("downloadProgress", progressObj);
	win?.setProgressBar(progressObj.percent / 100);
});
//更新下载成功
autoUpdater.on("update-downloaded", () => {
	win?.webContents.send("update-downloaded");
	ipcMain.on("update-now", () => {
		autoUpdater.quitAndInstall(false, true);
	});
});

const sendUpdateMessage = (msg: string) => {
	log.log(msg);
};

// 设置开机自动启动
const ex = process.execPath;
// 监听设置开机自启动
ipcMain.on("set-launch-with-windows", (event, args) => {
	// 需要在应用打包后，将可执行文件路径写进注册表里。
	if (app.isPackaged) {
		//应用是否打包
		log.info("是否开机自启动参数:", args);
		app.setLoginItemSettings({
			openAtLogin: args,
			openAsHidden: false,
			path: ex,
			args: ["--openAsHidden"],
		});
	}
});
