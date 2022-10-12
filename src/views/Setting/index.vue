<template>
  <div class="main-box">
    <div class="fix-top">
      <HeaderVue :style="{'--header-height':globalStore.headerHeight}"></HeaderVue>
    </div>
    <div class="page-header">
      <n-space align="center">
        <n-button text @click="goBack">
          <template #icon>
            <n-icon :size="24">
              <ArrowCircleLeft :strokeWidth="4"></ArrowCircleLeft>
            </n-icon>
          </template>
        </n-button>
        <span class="title">设置</span>
      </n-space>
    </div>
    <n-divider style="margin-top: 12px"></n-divider>
    <div class="content">
      <n-descriptions title="常规" :column="1" label-placement="top">
        <n-descriptions-item label="主题">
          <n-radio-group v-model:value="themeType" @update:value="changeTheme">
            <n-radio value="light">浅色主题</n-radio>
            <n-radio value="dark">深色主题</n-radio>
            <n-radio value="auto">使用系统主题</n-radio>
          </n-radio-group>
        </n-descriptions-item>
        <n-descriptions-item label="主题色">
          <n-color-picker v-model:value="primaryColor" placement="bottom-end" :to="false" size="small" :show-alpha="false"
                          :swatches="[
      '#18A058',
      '#2080F0',
      '#F0A020',
    ]"></n-color-picker>
        </n-descriptions-item>
      </n-descriptions>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router";
import {useTheme} from "@/stores/themeStore";
import {ArrowCircleLeft} from "@icon-park/vue-next"
import HeaderVue from "@/layout/components/Header.vue"
import {useGlobalStore} from "@/stores/globalStore";
import {computed} from "vue";
import {ipcRenderer} from "electron";

const globalStore = useGlobalStore()
const theme = useTheme()
const router = useRouter()

const goBack = () => {
  router.back()
}

const themeType = computed({
  get() {
    return theme.themeType
  },
  set(val: 'light' | 'dark' | 'auto') {
    theme.setThemeType(val)
  }
})

const primaryColor = computed({
  get() {
    return theme.primaryColor
  },
  set(v) {
    theme.setPrimaryColor(v)
  }
})
const changeTheme = (e) => {
  if (e === 'auto') {
    const shouldDark = ipcRenderer.sendSync('get-system-theme')
    theme.setSystemTheme(shouldDark)
    ipcRenderer.on('change-system-theme', (e, args) => {
      theme.setSystemTheme(args)
    })
  }
}
</script>

<style scoped lang="scss">
.main-box {
  height: 100vh;

  .fix-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 100;
  }

  .page-header {
    //display: flex;
    padding: 62px 24px 0;
    height: 100px;
    box-sizing: border-box;
    backdrop-filter: blur(18px);
    .title {
      font-size: 24px;
    }
  }

  .content {
    min-width: 180px;
    max-width: 500px;
    margin: auto;
    padding: 0 30px;
    box-sizing: border-box;
    overflow: auto;
    height: calc(100vh - 100px - 37px);
  }
}
</style>