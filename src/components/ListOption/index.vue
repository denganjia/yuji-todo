<template>
	<n-dropdown :options="options" trigger="hover" placement="bottom" @select="select" :node-props="nodeProps">
		<slot></slot>
	</n-dropdown>
</template>

<script setup lang="ts">
import { h, computed, onBeforeMount } from "vue";
import { useGlobalStore } from "@/stores/globalStore";
import { MenuNodeProps, NSpace } from "naive-ui";

const globalStore = useGlobalStore();

const emit = defineEmits<{ (e: "setImg", val: { thumb: string; full: string }): void; (e: "rename"): void }>();

// 获取img
const getImg = computed(() => {
	return globalStore.bgImg.map(item =>
		h("img", {
			src: item.thumb,
			width: 50,
			style: { cursor: "pointer" },
			onclick: () => {
				emit("setImg", item);
			},
			onload: () => {
				document.body.style.cursor = "loading";
			},
		}),
	);
});
//渲染选择背景项
const renderBgImg = () => {
	return h("div", { class: "bg-box", style: { width: "250px", padding: "0 14px" } }, [
		h(
			"div",
			{
				style: {
					lineHeight: "var(--n-option-height)",
					fontSize: "var(--n-font-size)",
					color: "var(--n-option-text-color)",
				},
			},
			"选择背景",
		),
		h(
			NSpace,
			{ justify: "space-between", align: "center" },
			{
				default: () => getImg.value,
			},
		),
	]);
};
// 下拉菜单options
const options = computed(() => {
	return [
		{
			label: "重命名列表",
			key: "rename",
			show: globalStore.currentMenu.type.includes("item"),
		},
		{
			key: "backgroundImage",
			type: "render",
			render: renderBgImg,
		},
	];
});
const select = (key: string) => {
	if (key === "rename") {
		emit("rename");
	}
};
// @ts-ignore
const nodeProps: MenuNodeProps = () => {
	return {
		onClick(e: MouseEvent) {
			e.stopImmediatePropagation();
			e.stopPropagation();
		},
	};
};

onBeforeMount(() => {
	document.body.style.cursor = "await";
});
</script>

<style scoped lang="scss">
:deep(.bg-box) {
	width: 250px;
	display: flex;
	flex-direction: column;
	.bg-img {
		width: 50px;
		display: block;
	}
}
</style>
