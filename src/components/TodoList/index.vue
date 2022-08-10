<template>
	<n-scrollbar :style="{ 'max-height': maxHeight }">
		<n-list v-if="route.params.type !== 'finished'">
			<list-item v-for="item in unfinishedList" :item="item"></list-item>
			<n-button size="small" type="primary" v-if="finishedList.length > 0" @click="showCollapse = !showCollapse"
				>已完成 {{ finishedList.length }}
				<template #icon>
					<n-icon>
						<Right
							:style="{
								transform: showCollapse ? 'rotate(90deg)' : 'rotate(0)',
								transition: 'all 0.3s',
							}"
							theme="outline"
						></Right>
					</n-icon>
				</template>
			</n-button>
			<n-collapse-transition :show="showCollapse" style="margin-top: 3px">
				<list-item v-for="item in finishedList" :item="item" :key="item.id"> </list-item>
			</n-collapse-transition>
		</n-list>
		<n-list v-if="route.params.type === 'finished'">
			<list-item v-for="item in props.list" :item="item"></list-item>
		</n-list>
	</n-scrollbar>
</template>

<script setup lang="ts">
import { Right } from "@icon-park/vue-next";
import ListItem from "./item.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ToDos } from "@/apis/types";
import { useRoute } from "vue-router";

const route = useRoute();
const showCollapse = ref(false);
// props
type Props = {
	list: ToDos.Todo[];
};
const props = defineProps<Props>();
// 已完成
const finishedList = computed(() => {
	return props.list.filter(item => item.finished);
});
// 未完成
const unfinishedList = computed(() => {
	return props.list.filter(item => !item.finished);
});
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
