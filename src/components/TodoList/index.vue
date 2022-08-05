<template>
	<n-scrollbar :style="{ 'max-height': maxHeight }">
		<n-list :bordered="true" style="--n-border-color: rgba(255, 255, 255, 0)">
			<list-item v-for="item in unfinishedList" :item="item" ></list-item>
			<n-button size="small" style="
					--n-color: rgba(255, 255, 255, 0.8);
					--n-color-focus: rgba(255, 255, 255, 1);
					--n-color-hover: var(--n-color-focus);
					--n-text-color-pressed: var(--n-text-color);
					--n-text-color-hover: var(--n-text-color);
					--n-text-color-focus: var(--n-text-color);
					--n-border-hover: var(--n-border);
					--n-border-pressed: var(--n-border);
					--n-border-focus: var(--n-border);
					--n-color-pressed: var(--n-color);
					--n-ripple-color: var(--n-color);
				" v-if="finishedList.length > 0" @click="showCollapse = !showCollapse">已完成 {{ finishedList.length }}
				<template #icon>
					<n-icon>
						<Right :style="{
							transform: showCollapse ? 'rotate(90deg)' : 'rotate(0)',
							transition: 'all 0.3s',
						}" theme="outline"></Right>
					</n-icon>
				</template>
			</n-button>
			<n-collapse-transition :show="showCollapse" style="margin-top: 3px">
				<list-item v-for="item in finishedList" :item="item">
				</list-item>
			</n-collapse-transition>
		</n-list>
	</n-scrollbar>
</template>

<script setup lang="ts">
import { Right } from "@icon-park/vue-next";
import ListItem from "./item.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ToDos } from "@/apis/types";
const showCollapse = ref(false);
// props
type Props = {
	list: ToDos.Todo[];
};
const props = defineProps<Props>();
// 已完成
const finishedList = computed(() => {
	return props.list.filter(item => item.finished).sort((a, b) =>
		Number(b.star) - Number(a.star));
});
// 未完成
const unfinishedList = computed(() => {
	return props.list.filter(item => !item.finished).sort((a, b) =>
		Number(b.star) - Number(a.star));
});

// type Emits = {
// 	(e: "change" | "star" | "detail", id: string): void;
// 	(e: "delete", id: string): void;
// };
// // 自定义事件冒泡
// const emits = defineEmits<Emits>();
// const switchFinished = (id: string) => {
// 	emits("change", id);
// };
// const star = (id: string) => {
// 	emits("star", id);
// };
// const detail = (id: string) => {
// 	emits("detail", id);
// };
// const deleteItem = (id: string) => {
// 	emits("delete", id);
// };
//内容高度
const innerHeight = ref(662);
const maxHeight = computed(() => {
	return innerHeight.value - 214 + "px";
});
const resize = () => {
	innerHeight.value = window.innerHeight;
};
onMounted(() => {
	innerHeight.value = window.innerHeight;
	window.addEventListener("resize", resize);
});
onUnmounted(() => {
	window.removeEventListener("resize", resize);
});
</script>

<style scoped lang="scss">
.n-list-item {
	background-color: rgba($color: #fff, $alpha: 0.9);
	border-radius: 3px;
	box-sizing: border-box;
	margin-bottom: 5px;

	&:hover {
		background-color: #fff;
	}

	:deep(.n-list-item__prefix) {
		display: flex;
	}

	:deep(.n-list-item__suffix) {
		display: flex;
	}
}

.n-list {
	background-color: unset;
}
</style>
