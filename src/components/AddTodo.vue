<template>
	<n-input
		:bordered="false"
		placeholder="添加待办"
		v-model:value="inputValue"
		@keyup.enter="input"
		:style="{
			'--n-padding-right': '6px',
			'--n-color': isDark ? 'rgba(24, 24, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
			'--n-color-focus': isDark ? 'rgba(24, 24, 28, 1)' : 'rgba(255, 255, 255, 1)',
			'--n-height': '50px',
			'--n-placeholder-color': isDark ? '' : 'rgb(51, 54, 57)',
		}"
		@focus="showPlus = false"
		@blur="showPlus = true"
	>
		<template #prefix>
			<n-icon
				:color="isDark ? 'rgba(255,255,255,0.5)' : '#000'"
				:size="20"
				:component="showPlus ? Plus : Round"
			></n-icon>
		</template>
		<template #suffix v-if="inputValue">
			<n-tooltip :show-arrow="false">
				<template #trigger>
					<div class="flex-center">
						<NDropdown :options="endTimeOptions" trigger="click" @select="endTimeSelect">
							<n-button size="small" quaternary>
								<template #icon>
									<n-icon>
										<CalendarThree></CalendarThree>
									</n-icon>
								</template>
								<p v-if="endTimeValue">{{
									dayjs(endTimeValue).calendar(dayjs(), {
										sameElse: "MM月DD日，dddd",
										lastDay: "[昨天]",
										sameDay: "[今天]",
										nextDay: "[明天]",
										lastWeek: "[上周] dddd",
										nextWeek: "dddd",
									})
								}}</p>
							</n-button>
						</NDropdown>
					</div>
				</template>
				截止日期
			</n-tooltip>

			<n-tooltip :show-arrow="false">
				<template #trigger>
					<div class="flex-center">
						<NDropdown :options="remindMeOption" trigger="click" @select="remindMeSelect">
							<n-button size="small" quaternary>
								<template #icon>
									<n-icon>
										<AlarmClock></AlarmClock>
									</n-icon>
								</template>
								<div v-if="datepickerTime" class="time">
									<p>在{{ datepickerTime }}时提醒我</p>
									<p>{{ dayjs(remindTimeValue).calendar(dayjs()) }}</p>
								</div>
							</n-button>
						</NDropdown>
					</div>
				</template>
				提醒我
			</n-tooltip>

			<n-tooltip trigger="hover" :show-arrow="false" v-if="false">
				<template #trigger>
					<n-button size="small" quaternary>
						<template #icon>
							<n-icon>
								<History></History>
							</n-icon>
						</template>
					</n-button>
				</template>
				重复
			</n-tooltip>
		</template>
	</n-input>
	<NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
		<n-dropdown
			:x="remindPickerPosition.x"
			:y="remindPickerPosition.y"
			:show="showRemindPicker"
			@clickoutside="showRemindPicker = false"
			:options="remindDropdownOption"
			trigger="manual"
		/>
		<NDropdown
			:x="remindPickerPosition.x"
			:y="remindPickerPosition.y"
			:show="showEndTimePicker"
			@clickoutside="showEndTimePicker = false"
			trigger="manual"
			:options="endTimePicker"
		></NDropdown>
	</NConfigProvider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from "naive-ui";
import {
	AlarmClock,
	History,
	CalendarThree,
	Plus,
	Round,
	Time,
	ArrowCircleRight,
	CircleDoubleRight,
	CalendarThirty,
	DeleteFive,
} from "@icon-park/vue-next";
import { ref, computed, h, reactive } from "vue";
import { useTheme } from "@/stores/themeStore";
import { MenuOption, NDatePicker } from "naive-ui";
import { renderIcon } from "@/utils";
import dayjs from "dayjs";

const theme = useTheme();
const isDark = computed(() => {
	return theme.systemTheme === "dark";
});
const showPlus = ref(true);
const inputValue = ref("");
const input = () => {
	if (inputValue.value !== "") {
		emit("add", { title: inputValue.value, remindTime: remindTimeValue.value, endTime: endTimeValue.value });
		inputValue.value = "";
	}
};
const emit = defineEmits<{ (e: "add", value: { title: string; remindTime?: number; endTime?: number }): void }>();

// 添加附加操作
// 时间选择器的绑定值
const remindTimeValue = ref(null);

// 提醒我
const remindMeOption = computed<MenuOption[]>(() => [
	{ label: `今天 ${dayjs().add(4, "hour").set("minute", 0).format("HH:mm")}`, key: "later", icon: renderIcon(Time) },
	{ label: "明天 9:00", key: "tomorrow", icon: renderIcon(ArrowCircleRight) },
	{ label: "下周一 9:00", key: "next-week", icon: renderIcon(CircleDoubleRight) },
	{ type: "divider" },
	{ label: "选择日期和时间", key: "customer", icon: renderIcon(CalendarThirty) },
	{ type: "divider", show: !!remindTimeValue.value },
	{
		label: "取消提醒",
		key: "cancel",
		icon: renderIcon(DeleteFive, { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" }),
		props: { style: { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" } },
		show: !!remindTimeValue.value,
	},
]);

// 提醒我 选择事件
const remindMeSelect = (key: string) => {
	if (key === "customer") {
		remindPickerPosition.x = window.innerWidth - 20;
		remindPickerPosition.y = window.innerHeight - 349 - 90;
		showRemindPicker.value = true;
	}
	if (key === "later") {
		remindTimeValue.value = dayjs().add(4, "hour").set("minute", 0).valueOf();
	}
	if (key === "tomorrow") {
		remindTimeValue.value = dayjs().add(1, "day").set("hour", 9).set("minute", 0).valueOf();
	}
	if (key === "next-week") {
		remindTimeValue.value = dayjs()
			.add(8 - dayjs().day(), "day")
			.set("hour", 9)
			.set("minute", 0)
			.valueOf();
	}
	if (key === "cancel") {
		remindTimeValue.value = null;
	}
};

// 时间选择器位置
const remindPickerPosition = reactive({
	x: 0,
	y: 0,
});
//显示时间选择器
const showRemindPicker = ref(false);

// 时分
const datepickerTime = computed(() => {
	if (!remindTimeValue.value) {
		return false;
	} else {
		return dayjs(remindTimeValue.value).format("HH:mm");
	}
});
//时间选择器的render
const remindDropdownOption: MenuOption[] = [
	{
		key: "datetime",
		type: "render",
		render() {
			return h("div", {}, [
				h(NDatePicker, {
					panel: true,
					type: "datetime",
					value: remindTimeValue.value,
					onConfirm(val) {
						remindTimeValue.value = val;
						showRemindPicker.value = false;
					},
					"onUpdate:value"(val) {
						remindTimeValue.value = val;
					},
					onClear() {
						remindTimeValue.value = null;
					},
					actions: ["clear", "confirm"],
				}),
			]);
		},
	},
];

// 截止日期picker
const showEndTimePicker = ref(false);
//截止日期
const endTimeValue = ref(null);
//截止日期自定义选择render
const endTimePicker: MenuOption[] = [
	{
		key: "datetime",
		type: "render",
		render() {
			return h("div", {}, [
				h(NDatePicker, {
					panel: true,
					type: "date",
					value: endTimeValue.value,
					onConfirm(val) {
						endTimeValue.value = val;
						showEndTimePicker.value = false;
					},
					"onUpdate:value"(val) {
						endTimeValue.value = val;
					},
					onClear() {
						endTimeValue.value = null;
					},
					actions: ["clear", "now"],
				}),
			]);
		},
	},
];
// 截止日期下拉菜单
const endTimeOptions = computed<MenuOption[]>(() => [
	{ label: `今天`, key: "today" },
	{ label: "明天", key: "tomorrow" },
	{ label: "下周一", key: "next-week" },
	{ type: "divider" },
	{ label: "选择日期和时间", key: "customer", icon: renderIcon(CalendarThree) },
	{ type: "divider", show: !!endTimeValue.value },
	{
		label: "删除截止日期",
		key: "cancel",
		icon: renderIcon(DeleteFive, { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" }),
		props: { style: { color: theme.systemTheme === "dark" ? "#e88080" : "#d03050" } },
		show: !!endTimeValue.value,
	},
]);
// 截止时间选择
const endTimeSelect = (key: string) => {
	switch (key) {
		case "customer":
			remindPickerPosition.x = window.innerWidth - 20;
			remindPickerPosition.y = window.innerHeight - 349 - 42;
			showEndTimePicker.value = true;
			break;
		case "cancel":
			endTimeValue.value = null;
			break;
		case "today":
			endTimeValue.value = dayjs().set("hour", 23).set("minute", 59).set("second", 59).valueOf();
			break;
		case "tomorrow":
			endTimeValue.value = dayjs().add(1, "day").set("hour", 23).set("minute", 59).set("second", 59).valueOf();
			break;
		case "next-week":
			endTimeValue.value = dayjs()
				.add(8 - dayjs().day(), "day")
				.set("hour", 0)
				.set("minute", 0)
				.set("second", 0)
				.valueOf();
			break;
		default:
			break;
	}
};
</script>

<style scoped lang="scss">
.n-input {
	backdrop-filter: blur(4px);
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.time {
	font-size: 12px;
	text-align: left;
	font-weight: normal;

	p {
		line-height: 14px;
	}
}
</style>
