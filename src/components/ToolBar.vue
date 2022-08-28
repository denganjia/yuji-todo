<template>
  <div class="main">
    <slot name="extra">
      <div class="logo">✅ Logo</div>
    </slot>
    <div class="operation">
      <n-space :size="5">
        <n-button quaternary size="small" :focusable="false" @click="handleWindow('minimize')">
          <template #icon>
            <n-icon>
              <Minus></Minus>
            </n-icon>
          </template>
        </n-button>
        <n-button quaternary size="small" :focusable="false" @click="handleWindow('maximize')">
          <template #icon>
            <n-icon>
              <Square v-if="!isWindowMax" theme="outline"></Square>
              <Copy v-else theme="outline"></Copy>
            </n-icon>
          </template>
        </n-button>
        <n-button quaternary size="small" :focusable="false" @click="handleWindow('close')">
          <template #icon>
            <n-icon>
              <Close></Close>
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Square, Copy, Close, Minus} from "@icon-park/vue-next";

// 窗口事件处理
const {ipcRenderer} = require("electron");
const handleWindow = (event: "close" | "minimize" | "maximize") => {
  ipcRenderer.send(`win-${event}`);
};
const isWindowMax = ref(false);
ipcRenderer.on("window-maxed", (e: any, arg: boolean) => {
  isWindowMax.value = arg;
});
</script>

<style scoped lang="scss">
.main {
  height: 60px;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  background-color: #f5f5f5;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;

  .logo {
    width: 200px;
    height: 40px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
  }

  .operation {
    flex: none;
    display: flex;
    align-items: center;
    -webkit-app-region: no-drag;
  }
}
</style>
