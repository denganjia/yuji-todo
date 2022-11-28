<template>
	<slot></slot>
</template>
<script setup lang="ts">
// 绑定组件方法至window全局
import { useMessage, useDialog, useNotification, useLoadingBar } from "naive-ui";
import { provide } from "vue";

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
let socketUrl = "ws://127.0.0.1";
if (import.meta.env.PROD) {
	socketUrl = "ws://www.chiyu.site/doit";
}
const socket = new WebSocket(socketUrl);
socket.onmessage = e => {
	const data = JSON.parse(e.data);
	if (data.event === "set-ws-key") {
		localStorage.setItem("ws-key", data.data);
	} else {
		ipcRenderer.send("notification", data);
	}
};

ipcRenderer.on("close", () => {
	socket.close(3982, localStorage.getItem("ws-key") ?? "");
});
</script>

<style scoped></style>
