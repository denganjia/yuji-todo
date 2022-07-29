<template></template>
<script setup lang="ts">
// 绑定组件方法至window全局
import { useMessage, useDialog, useNotification, useLoadingBar } from "naive-ui";

const message = useMessage()
const dialog = useDialog()
const notification = useNotification()
const loadingBar = useLoadingBar()
window['$message'] = message
window['$dialog'] = dialog
window['$notification'] = notification
window['$loadingBar'] = loadingBar
</script>

<style scoped>
</style>