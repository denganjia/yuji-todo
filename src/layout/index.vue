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
				<!-- <content-vue></content-vue> -->
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>

<script setup lang="ts">
import AsideVue from "./components/Asider.vue";
// import ContentVue from "./components/Content.vue";
import HeaderVue from "./components/Header.vue";
import { ref, CSSProperties } from "vue";
const sideWidth = ref(200);
const resize = (val: number) => {
	sideWidth.value = val;
};
const sideStyle: CSSProperties = {
	transition: "min-width 0s,max-width 0s",
};
</script>

<style scoped lang="scss">
.n-layout {
	height: 100%;
	transition: min-width 0s, max-width 0s;
}
</style>
