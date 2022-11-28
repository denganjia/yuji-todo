<template>
	<n-list-item
		@click="$emit('detail', item.id)"
		@contextmenu="handleContextMenu"
		style="margin-bottom: 5px; padding: 12px"
	>
		<template #prefix>
			<n-button text @click="update({ id: item.id, finished: !item.finished })">
				<template #icon>
					<n-icon :size="18" @mouseenter="hover = true" @mouseleave="hover = false">
						<Round theme="outline" v-if="!hover && !item.finished"></Round>
						<CheckOne theme="outline" v-else></CheckOne>
					</n-icon>
				</template>
			</n-button>
		</template>
		<template #suffix>
			<n-icon class="pointer" @click="update({ id: item.id, star: !item.star })" :size="20">
				<Star :theme="item.star ? 'two-tone' : 'outline'" :strokeWidth="0"></Star>
			</n-icon>
		</template>
		<div>
			<p :class="{ done: item.finished }">{{ item.title }}</p>
			<p class="tag" v-if="!item.finished">
				<NTag :bordered="false" type="warning" round size="small" v-if="item.endTime">
					{{ getLocalTimeString(new Date(item.endTime)) }}
					<template #icon>
						<CalendarThree></CalendarThree>
					</template>
				</NTag>
				<NTag
					:bordered="false"
					type="info"
					round
					size="small"
					v-if="item.remindTime && item.remindTime > new Date().getTime()"
				>
					{{ getLocalTimeString(new Date(item.remindTime)) }}
					<template #icon>
						<AlarmClock></AlarmClock>
					</template>
				</NTag>
			</p>
		</div>
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
import { Round, CheckOne, Star, DeleteFive, SunOne, AlarmClock, CalendarThree } from "@icon-park/vue-next";
import { renderIcon } from "@/utils";
import { emiter } from "@/utils";
import { useGlobalStore } from "@/stores/globalStore";
import calendar from "dayjs/plugin/calendar";
import dayjs from "dayjs";
import { useTheme } from "@/stores/themeStore";
// dayjs.locale("zh-cn");
dayjs.extend(calendar);
const theme = useTheme();

const getLocalTimeString = (time: number | Date) => {
	return dayjs(time).calendar(dayjs());
};
const globalStore = useGlobalStore();
const dialog = useDialog();

const update = (item: any) => {
	emiter.emit("update-todo", item);
};
type Props = {
	item: ToDos.Todo;
};
// props
const props = defineProps<Props>();

// hover状态改变prefix图标
const hover = ref(false);

// 当前页面是不是 我的一天
const isMyDay = computed(() => {
	return globalStore.currentMenu.type === "myDay";
});
// 右键展开
const options: any = ref([
	{
		label: "从'我的一天'移除",
		key: "remove-my-day",
		icon: renderIcon(SunOne),
		show: isMyDay.value,
	},
	{
		label: "已添加到'我的一天'",
		key: "added-my-day",
		icon: renderIcon(SunOne),
		disabled: true,
		show: !isMyDay.value && props.item.oneDay,
	},
	{
		label: "添加到'我的一天'",
		key: "add-my-day",
		icon: renderIcon(SunOne),
		show: !isMyDay.value && !props.item.oneDay,
	},
	{ label: "divider", type: "divider" },
	{
		label: "删除任务",
		key: "delete",
		icon: renderIcon(DeleteFive, { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" }),
		props: { style: { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" } },
	},
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
		emiter.emit("update-todo", { id: props.item.id, oneDay: true });
		showDropdown.value = false;
	}
	if (key === "remove-my-day") {
		emiter.emit("update-todo", { id: props.item.id, oneDay: false });
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
	background-color: var(--n-color);
	border-radius: 3px;
	box-sizing: border-box;
	opacity: 0.9;
	transition: opacity 0.3s;
	overflow: hidden;

	:deep(.n-list-item__divider) {
		display: none;
	}

	&:hover {
		opacity: 1;
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

.pointer {
	cursor: pointer;
}
.tag {
	padding-top: 6px;
}
</style>
