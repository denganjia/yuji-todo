<template>
	<n-input
		:bordered="false"
		placeholder="添加待办"
		v-model:value="inputValue"
		@keyup.enter="input"
		style="
			--n-padding-right: 0;
			--n-color: rgba(255, 255, 255, 0.7);
			--n-color-focus: rgba(255, 255, 255, 1);
			--n-height: 40px;
			--n-placeholder-color: rgb(51, 54, 57);
		"
		@focus="showPlus = false"
		@blur="showPlus = true"
	>
		<template #prefix>
			<n-icon color="#000" :size="20" :component="showPlus ? Plus : Round"></n-icon>
		</template>
		<template #suffix v-if="false">
			<n-tooltip :show-arrow="false">
				<template #trigger>
					<n-button size="small" quaternary>
						<template #icon>
							<n-icon>
								<CalendarThree></CalendarThree>
							</n-icon>
						</template>
					</n-button>
				</template>
				截止日期
			</n-tooltip>

			<n-tooltip :show-arrow="false">
				<template #trigger>
					<n-button size="small" quaternary>
						<template #icon>
							<n-icon>
								<AlarmClock></AlarmClock>
							</n-icon>
						</template>
					</n-button>
				</template>
				闹钟
			</n-tooltip>

			<n-tooltip trigger="hover" :show-arrow="false">
				<template #trigger>
					<n-button size="small" quaternary>
						<template #icon>
							<n-icon>
								<Redo></Redo>
							</n-icon>
						</template>
					</n-button>
				</template>
				重复
			</n-tooltip>
		</template>
	</n-input>
</template>

<script setup lang="ts">
import { AlarmClock, Redo, CalendarThree, Plus, Round } from "@icon-park/vue-next";
import { ref } from "vue";
const showPlus = ref(true);
const inputValue = ref("");
const input = () => {
	if (inputValue.value !== "") {
		emit("add", inputValue.value);
		inputValue.value = "";
	}
};
const emit = defineEmits<{ (e: "add", value: string): void }>();
</script>

<style scoped lang="scss">
.n-input {
	backdrop-filter: blur(4px);
}
</style>
