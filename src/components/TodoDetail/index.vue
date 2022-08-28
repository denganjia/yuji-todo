<template>
	<n-drawer v-model:show="show" @update:show="$emit('update:show', $event)"> </n-drawer>
</template>

<script setup lang="ts">
type Props = {
	show: boolean;
};
const props = defineProps<Props>();
defineEmits<{ (e: "update:show", val: boolean): void }>();

const options = [
	{
		label: "滨海湾金沙，新加坡",
		key: "marina bay sands",
		disabled: true,
	},
	{
		label: "布朗酒店，伦敦",
		key: "brown's hotel, london",
	},
	{
		label: "亚特兰蒂斯巴哈马，拿骚",
		key: "atlantis bahamas, nassau",
	},
	{
		label: "比佛利山庄酒店，洛杉矶",
		key: "the beverly hills hotel, los angeles",
	},
];
</script>

<style scoped lang="scss"></style>
