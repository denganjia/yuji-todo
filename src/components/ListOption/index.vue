<template>
	<n-dropdown :options="options" trigger="click" placement="bottom" @select="select">
		<slot></slot>
	</n-dropdown>
</template>

<script setup lang="ts">
import { h, computed,onBeforeMount,onMounted } from "vue";
import { useGlobalStore } from "@/stores/globalStore";
import { NSpace } from "naive-ui";

const globalStore = useGlobalStore();

const emit = defineEmits<{ (e: "setImg", val: string): void; (e: "rename"): void }>();
const getImg = computed(() => {
	return globalStore.bgImg.map(item =>
		h("img", {
			src: item.thumb,
			width: 50,
			style: { cursor: "pointer" },
			onclick: () => {
				emit("setImg", item.full);
			},
		}),
	);
});
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
const options = [
	{
		label: "重命名列表",
		key: "rename",
	},
	{
		key: "backgroundImage",
		type: "render",
		render: renderBgImg,
	},
];
const select = (key: string) => {
	if (key === "rename") {
		emit("rename");
	}
};
onBeforeMount(()=>{
	document.body.style.cursor = 'await'
})
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
