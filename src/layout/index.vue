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
import { ref, CSSProperties, onMounted, onBeforeMount } from "vue";
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
onBeforeMount(() => {
	if (window.outerWidth < 770) {
		sideWidth.value = 0;
	}
});
onMounted(() => {
	window.addEventListener("resize", (e: any) => {
		if (e.target.outerWidth < 770) {
			if (sideWidth.value !== 0) {
				sideWidth.value = 0;
			}
		}
		if (e.target.outerWidth > 770) {
			if (sideWidth.value === 0) {
				sideWidth.value = 200;
			}
		}
	});
});
</script>

<style scoped lang="scss">
.n-layout {
	transition: min-width 0s, max-width 0s;
}
</style>
