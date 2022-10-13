<template>
  <div class="header-content" :style="{'--n-color':theme.systemTheme==='dark'?'rgb(24,24,28)':'#f5f5f5'}" v-if="showHeader">
    <div class="logo"><img src="/icon.png" height="25" width="25" alt=""></div>
    <div class="header">
      <div class="no-drag header-action">
        <n-space :size="5" align="center" :wrap-item="false">
          <n-dropdown trigger="hover" :options="option" :show-arrow="true" @select="select">
            <n-avatar
                :size="30"
                round
                :src="userStore.user.avatar ?? 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'"
            >
            </n-avatar>
          </n-dropdown>
          <n-button quaternary size="small" @click="$router.push({name:'setting'})">
            <template #icon>
              <n-icon>
                <SettingTwo theme="outline"></SettingTwo>
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <div class="divider"></div>
        <div style="flex: none; display: flex; align-items: center">
          <n-space :size="5">
            <n-button quaternary size="small" @click="handleWindow('minimize')" :focusable="false">
              <template #icon>
                <n-icon>
                  <Minus></Minus>
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary size="small" @click="handleWindow('maximize')" :focusable="false">
              <template #icon>
                <n-icon>
                  <Square v-if="!isWindowMax" theme="outline"></Square>
                  <Copy v-else theme="outline"></Copy>
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary size="small" @click="handleWindow('close')" :focusable="false">
              <template #icon>
                <n-icon>
                  <Close></Close>
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Square, Copy, SettingTwo, Close, Minus, Logout, User} from "@icon-park/vue-next";
import {DropdownOption} from "naive-ui";
import {ref} from "vue";
import {renderIcon} from "@/utils";
import {useUserStore} from "@/stores/userStore";
import {useRouter} from "vue-router";
import {logoutApi} from "@/apis";
import {useGlobalStore} from "@/stores/globalStore";
import {useTheme} from "@/stores/themeStore";

const theme = useTheme()
const globalStore = useGlobalStore()
const userStore = useUserStore();
const router = useRouter();
//头像下拉菜单
const option: DropdownOption[] = [
  {label: "个人信息设置", key: "set-user-info", icon: renderIcon(User)},
  {type: "divider", key: "divider1"},
  {label: "注销登录", key: "logout", icon: renderIcon(Logout)},
];
// 下拉选择
const select = (key: string) => {
  if (key === "logout") {
    logoutApi().then(() => {
      router.push("/login");
      userStore.logout();
    });

  }
};
// 窗口事件处理
const {ipcRenderer} = require("electron");
const handleWindow = (event: "close" | "minimize" | "maximize") => {
  ipcRenderer.send(`win-${event}`);
};
const isWindowMax = ref(false);
ipcRenderer.on("window-maxed", (e: any, arg: boolean) => {
  isWindowMax.value = arg;
});

//置顶时不显示header
const showHeader = ref(true)
ipcRenderer.on('fix-top', () => {
  showHeader.value = false
  globalStore.setHeaderHeight('0px')
})
ipcRenderer.on('restore', () => {
  showHeader.value = true
  globalStore.setHeaderHeight('50px')
})

</script>

<style scoped lang="scss">
.header-content {
  height: var(--header-height);
  box-sizing: border-box;
  background-color: var(--n-color);
  padding: 10px;
  -webkit-app-region: drag;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo {
    // width: 160px;
    height: 40px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
  }

  .no-drag {
    -webkit-app-region: no-drag;
  }

  .header-action {
    display: flex;

    .divider {
      height: auto;
      width: 1px;
      background-color: #a1a2a3;
      margin: 0 5px;
    }
  }
}
</style>
