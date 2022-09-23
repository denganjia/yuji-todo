<script setup lang="ts">
import {DEFAULT_ICON_CONFIGS, IconProvider} from "@icon-park/vue-next";
import Provider from "@/components/Provider.vue";
import UpdateProvider from "@/components/UpdateProvider/index.vue"
import {zhCN, dateZhCN} from "naive-ui";
import {useTheme} from "@/stores/themeStore";

const theme = useTheme()
IconProvider({
  ...DEFAULT_ICON_CONFIGS,
  theme: "outline",
  strokeWidth: 2,
  colors: {
    twoTone: {
      fill: theme.primary,
      twoTone: theme.primary
    },
    outline: {fill: "", background: ''},
    multiColor: {outStrokeColor: '', outFillColor: "", innerStrokeColor: '', innerFillColor: ''},
    filled: {fill: '#63e2b7', background: "#63e2b7"}
  }
});
</script>

<template>
  <n-config-provider :locale="zhCN" :date-local="dateZhCN" :theme-overrides="{ common: { fontWeightStrong: '600' } }">
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <Provider></Provider>
            <router-view></router-view>
            <UpdateProvider></UpdateProvider>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style>
</style>
