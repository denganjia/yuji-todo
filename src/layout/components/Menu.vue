<template>
	<div class="menu-content">
		<n-menu
			:options="menu"
			key-field="id"
			children-field="lists"
			label-field="name"
		></n-menu>
	</div>
</template>

<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { getMenuApi } from "@/apis";
import { onBeforeMount, reactive, ref } from "vue";

const menu: MenuOption[] = reactive([
	{ id: "my-day", name: "今天做点什么呢" },
	{ id: "important", name: "重要的事情" },
	{ id: "finished", name: "已经完成啦" },
	{
		type: "divider",
		id: "divider",
	},
]);

const defaultExpanded = ref([]);

//挂载前获取菜单
onBeforeMount(async () => {
	joinMenu();
});
// 拼接菜单
const joinMenu = async () => {
	const { data } = await getMenuApi();
	// console.log(data);
	menu.splice(4, menu.length - 3, ...data);
};
// 暴露出去
defineExpose({
	joinMenu,
});
</script>

<style scoped lang="scss">
.menu-content {
	width: 100%;
	height: 100%;
}
</style>
