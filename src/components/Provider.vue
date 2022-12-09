<template>
	<slot></slot>
</template>
<script setup lang="ts">
// 绑定组件方法至window全局
import { useMessage, useDialog, useNotification, useLoadingBar } from "naive-ui";
import { onUnmounted, provide } from "vue";

const { ipcRenderer } = require("electron");

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();
const loadingBar = useLoadingBar();
window["$message"] = message;
window["$dialog"] = dialog;
window["$notification"] = notification;
window["$loadingBar"] = loadingBar;

// socket 连接
let socketUrl = import.meta.env.PROD ? "ws://www.chiyu.site/ws/" : "ws://127.0.0.1/";
let socket: WebSocket;
// 重新连接锁
let lockReconnect = false;

// 接收消息
const websocketOnMessage = (e: MessageEvent) => {
	heartbeat();
	const data = JSON.parse(e.data);
	if (data.event === "set-ws-key") {
		localStorage.setItem("ws-key", data.data);
	} else if (data.event === "notification") {
		ipcRenderer.send("notification", data.data);
	}
};
// 连接失败
const websocketOnError = () => {
	connectSocket();
};
//连接断开
const websocketOnClose = () => {
	if (lockReconnect) {
		connectSocket();
	}
};
let interval = undefined;
let timeout = undefined;
//心跳检测
const heartbeat = () => {
	clearInterval(interval);
	clearTimeout(timeout);
	interval = setInterval(() => {
		let data = {
			event: "ping",
		};
		socket.send(JSON.stringify(data));
		timeout = setTimeout(() => {
			lockReconnect = true;
			socket.close(3982, localStorage.getItem("ws-key") ?? "");
		}, 2000);
	}, 30000);
};
//连接websocket
const connectSocket = () => {
	socket = new WebSocket(socketUrl);
	socket.onerror = websocketOnError;
	socket.onclose = websocketOnClose;
	socket.onmessage = websocketOnMessage;
};
connectSocket();

ipcRenderer.on("close", () => {
	lockReconnect = false;
	socket.close(3982, localStorage.getItem("ws-key") ?? "");
});
onUnmounted(() => {
	lockReconnect = false;
	if (socket) {
		socket.close(3982, localStorage.getItem("ws-key") ?? "");
	}
	clearInterval(interval);
	clearTimeout(timeout);
});
</script>

<style scoped></style>
