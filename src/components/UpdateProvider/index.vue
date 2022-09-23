<template></template>
<script setup lang="ts">
import {useDialog} from "naive-ui";
// 系统更新
const {ipcRenderer} = require("electron");
const dialog = useDialog()
ipcRenderer.on('update-downloaded',()=>{
  dialog.info({
    title:'更新提示',
    content:'新版本已下载成功！现在更新？',
    positiveText:'立即更新',
    negativeText:'稍后',
    onPositiveClick:()=>{
      ipcRenderer.send('update-now')
    },
    onNegativeClick:()=>{
      ipcRenderer.send('update-delay')
    }
  })
})
</script>

<style scoped lang="scss">

</style>