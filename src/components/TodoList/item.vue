<template>
	<n-list-item @click="$emit('detail', item.id)" @contextmenu="handleContextMenu">
		<template #prefix>
			<n-button text @click="update({ id: item.id, finished: !item.finished })">
				<template #icon>
					<n-icon :size="18" @mouseenter="hover = true" @mouseleave="hover = false">
						<Round theme="outline" v-if="!hover && !$props.item.finished"></Round>
						<CheckOne theme="outline" v-else></CheckOne>
					</n-icon>
				</template>
			</n-button>
		</template>
		<template #suffix>
			<n-button text>
				<template #icon>
					<n-icon @click="update({ id: item.id, star: !item.star })">
						<Star :theme="item.star ? 'multi-color' : 'outline'"></Star>
					</n-icon>
				</template>
			</n-button>
		</template>
		<span :class="{ done: $props.item.finished }">{{ $props.item.title }}</span>
	</n-list-item>
	<n-dropdown
		placement="top-start"
		trigger="manual"
		:x="position.x"
		:y="position.y"
		:options="options"
		:show="showDropdown"
		:on-clickoutside="clickoutside"
		@select="handleSelect"
	/>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from "vue";
import { ToDos } from "@/apis/types";
import { useDialog } from "naive-ui";
import { Round, CheckOne, Star, DeleteFive, Sun } from "@icon-park/vue-next";
import { renderIcon } from "@/utils";
import { useRoute } from "vue-router";
import { emiter } from "@/utils";

const dialog = useDialog();
const route = useRoute();

const update = (item: any) => {
	emiter.emit("update-todo", item);
};
type Props = {
	item: ToDos.Todo;
};
type Emits = {
	(e: "finish" | "star" | "detail", id: string, args?: { finished?: boolean; star?: boolean }): void;
	(e: "delete", id: string): void;
};
// props
const props = defineProps<Props>();
// hover状态改变prefix图标
const hover = ref(false);
// emit事件
const emits = defineEmits<Emits>();
// 是否已存在于 我的一天
const inMyDay = props.item.onDay;
// 当前页面是不是 我的一天
const isMyDay = route.fullPath.includes("my-day");
// 需要根据isMyDay和inMyDay改变的option
const fakeOption = computed(() => {
	if (isMyDay) {
		return {
			label: "从'我的一天'移除",
			key: "remove-my-day",
			icon: renderIcon(Sun),
		};
	} else if (inMyDay) {
		return {
			label: "已添加到'我的一天'",
			key: "add-my-day",
			icon: renderIcon(Sun),
			disabled: true,
		};
	} else {
		return {
			label: "添加到'我的一天'",
			key: "add-my-day",
			icon: renderIcon(Sun),
		};
	}
});
// 右键展开
const options = ref([
	fakeOption.value,
	{ label: "divider", type: "divider" },
	{ label: "删除任务", key: "delete", icon: renderIcon(DeleteFive), props: { style: { color: "red" } } },
]);
const position = reactive({ x: 0, y: 0 });
const showDropdown = ref(false);
const handleSelect = (key: string) => {
	if (key === "delete") {
		showDropdown.value = false;
		dialog.warning({
			title: "警告",
			content: "删除任务后无法恢复，请三思！",
			positiveText: "删除",
			negativeText: "取消",
			onPositiveClick() {
				emiter.emit("delete-todo", { id: props.item.id });
			},
			onNegativeClick() {},
		});
	}
	if (key === "add-my-day") {
		// todoStore.addToMyDay(props.item.id, true);
		showDropdown.value = false;
	}
	if (key === "remove-my-day") {
		// todoStore.removeFromMyDay(props.item.id, props.item.customerMenuID ? true : false);
		showDropdown.value = false;
	}
};
const handleContextMenu = (e: MouseEvent) => {
	e.preventDefault();
	showDropdown.value = false;
	nextTick().then(() => {
		showDropdown.value = true;
		position.x = e.clientX;
		position.y = e.clientY;
	});
};
const clickoutside = () => {
	showDropdown.value = false;
};
</script>

<style scoped lang="scss">
.n-list.n-list--bordered .n-list-item:not(:last-child) {
	margin-bottom: 5px;
}
.n-list-item {
	background-color: rgba($color: #fff, $alpha: 0.9);
	border-radius: 3px;
	box-sizing: border-box;
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
.done {
	text-decoration: line-through;
}
</style>