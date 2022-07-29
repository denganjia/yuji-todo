<template>
	<div class="menu-content">
		<n-menu :options="menu"></n-menu>
	</div>
</template>

<script setup lang="ts">
import { MenuOption } from "naive-ui";

const menu: MenuOption[] = [
	{ key: "my-day", label: "今天做点什么呢" },
	{ key: "important", label: "重要的事情" },
	{ key: "finished", label: "已经完成啦" },
	{
		type: "group",
		label: "我的菜单",
		key: "custom",
		children: [],
	},
];
</script>

<style scoped lang="scss">
.menu-content {
	width: 100%;
	height: 100%;
}
</style>
