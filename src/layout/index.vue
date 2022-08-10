<template>
	<n-layout>
		<n-layout-header>
			<header-vue></header-vue>
		</n-layout-header>
		<n-layout has-sider :native-scrollbar="false">
			<n-layout-sider :width="sideWidth" :style="sideStyle" :native-scrollbar="false" bordered>
				<aside-vue @resize="resize"></aside-vue>
			</n-layout-sider>
			<n-layout-content>
				<router-view> </router-view>
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>

<script setup lang="ts">
import AsideVue from "./components/Asider.vue";
import HeaderVue from "./components/Header.vue";
import { ref, CSSProperties } from "vue";
import { getBgImg } from "@/apis";
import { useGlobalStore } from "@/stores/globalStore";


const GlobalStore = useGlobalStore();
const sideWidth = ref(200);
const resize = (val: number) => {
	sideWidth.value = val;
};
const sideStyle: CSSProperties = {
	transition: "min-width 0s,max-width 0s",
};
getBgImg().then(res => {
	GlobalStore.setBgImg(res.data);
});
</script>

<style scoped lang="scss">
.n-layout {
	transition: min-width 0s, max-width 0s;
}
</style>
